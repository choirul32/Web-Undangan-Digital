import { NextResponse } from "next/server";
import { generateText } from "ai";
import { requireAdminApiSession } from "../../../../lib/auth";
import { getTemplateAiModel } from "../../../../lib/ai/provider";
import { buildSystemPrompt } from "../../../../lib/ai/systemPrompt";
import { sanitizeDesignConfig } from "../../../../lib/ai/validateDesignConfig";
import { readOrnamentManifest, ORNAMENT_BUCKET } from "../../../../lib/ai/manifest";
import { normalizeCatalogOrnament } from "../../../../lib/ai/catalog";
import { createServiceSupabaseClient } from "../../../../lib/supabase/server";

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

// ---- Parser JSON toleran ----
// Model OpenAI-compatible sering membungkus JSON dalam markdown
// fence (```json ... ```) atau menambahkan teks lain. Kita cari
// blok JSON pertama yang valid.
function extractJson(text = "") {
  const trimmed = String(text).trim();

  // Coba parse langsung dulu
  try {
    return JSON.parse(trimmed);
  } catch {
    // lanjut cari blok
  }

  // Cari blok ```json ... ```
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1].trim());
    } catch {
      // lanjut
    }
  }

  // Cari objek JSON pertama: dari { pertama sampai } terakhir
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1));
    } catch {
      // gagal
    }
  }

  return null;
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

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const prompt = String(payload.prompt || "").trim();
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

    const systemPrompt = buildSystemPrompt({ ornaments: manifestOrnaments });

    const result = await generateText({
      model,
      system: systemPrompt,
      prompt,
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
