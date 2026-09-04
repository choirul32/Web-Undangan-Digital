import { NextResponse } from "next/server";
import { generateText } from "ai";
import { requireAdminApiSession } from "../../../../lib/auth";
import { getTemplateAiModel } from "../../../../lib/ai/provider";
import { buildSystemPrompt } from "../../../../lib/ai/systemPrompt";
import { sanitizeDesignConfig } from "../../../../lib/ai/validateDesignConfig";
import { readOrnamentManifest, ORNAMENT_BUCKET } from "../../../../lib/ai/manifest";
import { normalizeCatalogOrnament } from "../../../../lib/ai/catalog";
import { createServiceSupabaseClient } from "../../../../lib/supabase/server";
import { getAllColorPalettes } from "../../../../lib/colorPalettes";
import { extractJson } from "../../../../lib/ai/extractJson";

// ---- Infer tema dari nama file / tags (untuk ornamen lama tanpa metadata) ----
const THEME_HINTS = [
  { theme: "wayang", keywords: ["wayang", "golek", "kulit"] },
  { theme: "jawa", keywords: ["jawa", "batik", "songket", "keraton", "parang", "kawung"] },
  { theme: "bali", keywords: ["bali", "kamboja", "barong", "penjor"] },
  { theme: "islami", keywords: ["islami", "arab", "kaligrafi", "masjid", "bismillah"] },
  { theme: "floral", keywords: ["bunga", "floral", "flower", "rose", "peony", "bouquet", "tulip"] },
  { theme: "tropical", keywords: ["tropical", "tropis", "monstera", "palem", "frangipani", "daun"] },
  { theme: "modern", keywords: ["modern", "geometris", "minimalis"] },
  { theme: "minimal", keywords: ["minimal", "simple", "clean"] },
  { theme: "royal", keywords: ["royal", "mewah", "gold", "emas", "luxury"] },
  { theme: "watercolor", keywords: ["watercolor", "aquarel"] },
  { theme: "nature", keywords: ["nature", "alam", "hutan", "green"] },
  { theme: "elegant", keywords: ["elegant", "classic", "klasik"] },
];

function inferThemesFromName(name = "", tags = "") {
  const haystack = `${name} ${tags}`.toLowerCase();
  const found = [];

  for (const { theme, keywords } of THEME_HINTS) {
    if (keywords.some((keyword) => haystack.includes(keyword))) {
      found.push(theme);
    }
  }

  return found;
}

// ---- Bangun ornamen dari manifest + lengkapi src & theme ----
function buildManifestOrnaments(manifest, supabase) {
  return Object.entries(manifest).map(([storagePath, metadata]) => {
    const publicUrl = supabase.storage
      .from(ORNAMENT_BUCKET)
      .getPublicUrl(storagePath).data.publicUrl;

    const name = metadata.name || storagePath.split("/").pop() || storagePath;
    const themes = Array.isArray(metadata.theme) && metadata.theme.length
      ? metadata.theme
      : inferThemesFromName(name, metadata.tags);

    return normalizeCatalogOrnament({
      id: storagePath,
      src: metadata.src || publicUrl,
      name,
      theme: themes,
      suggestedSlots: metadata.suggestedSlots,
      visualProps: metadata.visualProps,
      tags: metadata.tags,
    });
  });
}

function parseAiOutput(text = "") {
  const parsed = extractJson(text);

  if (!parsed || typeof parsed !== "object") {
    return { designConfig: {}, description: "", parseError: "AI tidak menghasilkan JSON valid." };
  }

  // AI kadang membungkus dalam { designConfig: {...} }, kadang langsung config.
  const designConfig = parsed.designConfig && typeof parsed.designConfig === "object"
    ? parsed.designConfig
    : parsed;

  const description = typeof parsed.description === "string" ? parsed.description : "";

  return { designConfig, description, parseError: "" };
}

// ---- Ambil design_config template sumber (referensi gaya) ----
async function getReferenceTemplateConfig(templateId) {
  if (!templateId) {
    return null;
  }

  const supabase = createServiceSupabaseClient();
  const { data } = await supabase
    .from("templates")
    .select("template_id, name, design_config")
    .eq("template_id", templateId)
    .maybeSingle();

  if (!data) {
    return null;
  }

  return {
    id: data.template_id,
    name: data.name,
    designConfig: data.design_config || {},
  };
}

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const prompt = String(payload.prompt || "").trim();
  const referenceTemplateId = String(payload.referenceTemplateId || "").trim() || null;
  if (!prompt) {
    return NextResponse.json({ error: "Prompt wajib diisi" }, { status: 400 });
  }

  const admin = await requireAdminApiSession();
  if (admin.error) {
    return NextResponse.json(admin.error, { status: 401 });
  }

  try {
    // Ambil model aktif: provider dari DB → fallback env SUMOPOD_*.
    const { model, provider } = await getTemplateAiModel();

    if (!model) {
      return NextResponse.json(
        {
          error:
            "AI belum dikonfigurasi. Tambahkan provider AI di menu Pengaturan, atau set SUMOPOD_API_KEY di environment.",
        },
        { status: 503 },
      );
    }

    // Ambil ornamen dari manifest Supabase (jika ada) agar AI melihat aset terkini.
    // Bangun URL publik dari storagePath + infer tema dari nama untuk ornamen lama.
    const manifest = await readOrnamentManifest();
    const supabase = createServiceSupabaseClient();
    const manifestOrnaments = buildManifestOrnaments(manifest, supabase);

    // Sertakan palet custom admin supaya AI bisa memilihnya juga.
    const colorPalettes = await getAllColorPalettes();

    const systemPrompt = buildSystemPrompt({
      ornaments: manifestOrnaments,
      colorPalettes,
    });

    // Template acuan gaya (opsional): admin pilih template lain sebagai contoh
    // struktur section/ornamen/font/layout. AI meniru gayanya, bukan menyalin
    // mentah — aset tetap harus dari daftar valid.
    let finalPrompt = prompt;
    if (referenceTemplateId) {
      const reference = await getReferenceTemplateConfig(referenceTemplateId);
      if (reference) {
        finalPrompt = `${prompt}

## TEMPLATE ACUAN GAYA
Admin ingin hasil menyerupai template "${reference.name}" (id: ${reference.id}) berikut:
${JSON.stringify(reference.designConfig).slice(0, 18000)}

Instruksi: tiru GAYA template acuan ini — struktur section, pilihan & penempatan ornamen, font, layout cover, palet warna, dan widget yang dipakai. Lalu ciptakan variasi/desain baru yang sesuai prompt admin di atas. JANGAN menyalin id/src ornamen atau URL di luar daftar ORNAMEN/BACKGROUND TERSEDIA di system prompt — pilih aset yang tersedia dengan gaya serupa. Output tetap design_config JSON dengan struktur yang sama.`;
      }
    }

    const result = await generateText({
      model,
      system: systemPrompt,
      prompt: finalPrompt,
      temperature: 0.7,
    });

    const { designConfig: rawConfig, description, parseError } = parseAiOutput(result.text);

    if (parseError) {
      return NextResponse.json({ error: parseError }, { status: 502 });
    }

    const { config, warnings } = sanitizeDesignConfig(rawConfig);

    return NextResponse.json({
      source: "ai",
      provider: provider?.providerId || "unknown",
      data: {
        designConfig: config,
        description,
        warnings,
      },
    });
  } catch (error) {
    console.error("[ai-generate] error:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal generate template" },
      { status: 500 },
    );
  }
}
