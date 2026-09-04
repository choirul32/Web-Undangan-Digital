import { NextResponse } from "next/server";
import { generateText } from "ai";
import { requireAdminApiSession } from "../../../../lib/auth";
import { getTemplateAiModel } from "../../../../lib/ai/provider";
import { extractJson } from "../../../../lib/ai/extractJson";
import {
  getAllColorPalettes,
  normalizePaletteInput,
  persistCustomPalette,
} from "../../../../lib/colorPalettes";
import { slugifyPaletteId } from "../../../../lib/colorUtils";

function parsePaletteOutput(text = "") {
  const parsed = extractJson(text);

  if (!parsed || typeof parsed !== "object") {
    return { error: "AI tidak menghasilkan JSON valid." };
  }

  // Terima { palette: {...} } atau langsung objek palet.
  const palette =
    parsed.palette && typeof parsed.palette === "object" ? parsed.palette : parsed;

  const label =
    String(palette.label || palette.name || "").trim() || "Palet AI Custom";

  const colors =
    palette.colors && typeof palette.colors === "object" ? palette.colors : {};

  return {
    data: {
      label,
      description: String(palette.description || "").trim(),
      colors: {
        primary: colors.primary || colors.primaryColor || "",
        accent: colors.accent || colors.accentColor || "",
        text: colors.text || colors.textColor || "",
        bg: colors.bg || colors.backgroundColor || colors.background || "",
        surface: colors.surface || colors.surfaceColor || colors.card || "",
      },
    },
  };
}

// Pastikan palette_id unik terhadap preset statis & palet custom yang ada.
function uniquePaletteId(baseLabel, existingIds) {
  const base = slugifyPaletteId(baseLabel);
  const used = new Set(existingIds.map((id) => String(id).toLowerCase()));
  if (!used.has(base)) return base;

  let counter = 2;
  let candidate = `${base}-${counter}`;
  while (used.has(candidate)) {
    counter += 1;
    candidate = `${base}-${counter}`;
  }
  return candidate;
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
    const { model } = await getTemplateAiModel();
    if (!model) {
      return NextResponse.json(
        {
          error:
            "AI belum dikonfigurasi. Tambahkan provider AI di menu Pengaturan, atau set SUMOPOD_API_KEY di environment.",
        },
        { status: 503 },
      );
    }

    const systemPrompt = `Kamu adalah spesialis palet warna untuk undangan digital pernikahan Indonesia (Jawa, Bali, Sunda, Islami, modern, dll).

Tugas: ubah deskripsi admin menjadi SATU palet warna yang serasi dan siap dipakai renderer.

## ATURAN
1. Keluarkan HANYA satu objek JSON valid (tanpa markdown fence, tanpa teks lain) dengan bentuk:
{
  "label": "Nama singkat palet (maks 4 kata, bahasa Indonesia, misal: Jawa Wayang Emas)",
  "description": "1 kalimat keterangan palet",
  "colors": {
    "primary": "#rrggbb",
    "accent": "#rrggbb",
    "text": "#rrggbb",
    "bg": "#rrggbb",
    "surface": "#rrggbb"
  }
}
2. Semua warna HARUS hex 6 digit (#rrggbb), TANPA transparansi.
3. "bg" = latar halaman (umumnya terang/krem/putih atau gelap tergantung tema). "surface" = warna card/permukaan (lebih terang dari bg kalau bg gelap, atau putih kalem kalau bg terang). "primary" = warna utama teks/judul/heading. "accent" = warna aksen (tombol, garis, ornamen). "text" = warna teks isi — PASTIKAN kontras cukup dengan "bg" (teks gelap utk bg terang, teks terang utk bg gelap).
4. Pilih warna yang mencerminkan deskripsi: sebutkan nuansa spesifik (emas, hijau daun, biru malam, krem, dsb). Hindari warna mencolok yang tidak serasi. Utamakan kombinasi elegan yang umum di undangan Indonesia.
5. JANGAN tambahkan field lain di luar contoh di atas. JANGAN bungkus dengan teks lain.`;

    const result = await generateText({
      model,
      system: systemPrompt,
      prompt,
      temperature: 0.8,
    });

    const { data, error } = parsePaletteOutput(result.text);
    if (error) {
      return NextResponse.json({ error }, { status: 502 });
    }

    // Normalisasi kontras & validasi hex.
    const normalized = normalizePaletteInput(data);
    if (normalized.error) {
      return NextResponse.json({ error: normalized.error }, { status: 502 });
    }

    // Id unik terhadap preset + custom yang sudah ada.
    const existing = await getAllColorPalettes();
    const paletteId = uniquePaletteId(
      normalized.data.label,
      existing.map((palette) => palette.id),
    );

    const saved = await persistCustomPalette({
      ...normalized.data,
      paletteId,
    });

    if (saved.error) {
      const isConfigError = saved.error === "Production database is not configured";
      return NextResponse.json(
        { error: saved.error },
        { status: isConfigError ? 503 : 500 },
      );
    }

    return NextResponse.json({
      source: "ai",
      data: saved.data,
      warnings: normalized.warnings || [],
    });
  } catch (error) {
    console.error("[ai-palette-generate] error:", error);
    return NextResponse.json(
      { error: error?.message || "Gagal generate palet" },
      { status: 500 },
    );
  }
}
