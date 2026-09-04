// ============================================================
// Parser JSON toleran untuk output model OpenAI-compatible.
// Model sering membungkus JSON dalam markdown fence (```json ... ```)
// atau menambahkan teks lain. Kita cari blok JSON pertama yang valid.
// ============================================================

export function extractJson(text = "") {
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
