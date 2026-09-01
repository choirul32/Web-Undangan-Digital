// ============================================================
// Style presets untuk generate ornamen via Replicate.
//
// PRINSIP UTAMA (hasil interview):
// - Subjek = motif UTAMA, bentuknya harus jelas dikenali
//   (joglo ya joglo, bunga ya bunga), bukan pelengkap dekorasi.
// - Hasil = SILUET MONOKROM (hitam pekat di background putih),
//   TANPA warna bawaan — warna akan diatur via metadata/CSS
//   di fase template (bisa hitam, putih, emas, atau warna tema).
// - Hindari kata "intricate/ornate/decorative" yang membuat model
//   menggambar ukiran generik alih-alih subjek.
// ============================================================

export const ORNAMENT_STYLE_PRESETS = [
  {
    id: "siluet",
    label: "Siluet / Umum",
    description: "Siluet bersih untuk subjek apa pun (rumah, bunga, gunung, dll)",
    promptTemplate:
      "Bold black silhouette of {subject} as the central motif, clean recognizable outline, flat vector style, designed for {corner_style}, solid black shape on pure white background, no colors, no gradient, no shading, no extra decorative patterns, sharp clean edges",
  },
  {
    id: "wayang",
    label: "Wayang",
    description: "Siluet wayang dengan detail khas",
    promptTemplate:
      "Bold black silhouette of {subject} in traditional Javanese wayang kulit style as the central motif, clean recognizable shape, designed for {corner_style}, solid black on pure white background, no colors, no gradient, no shading, sharp clean edges",
  },
  {
    id: "batik",
    label: "Batik",
    description: "Siluet dengan aksen motif batik",
    promptTemplate:
      "Bold black silhouette of {subject} as the central motif with subtle Indonesian batik pattern filling, clean recognizable outline, designed for {corner_style}, solid black on pure white background, no colors, no gradient, sharp clean edges",
  },
  {
    id: "kaligrafi",
    label: "Kaligrafi Islami",
    description: "Siluet kaligrafi / geometris islami",
    promptTemplate:
      "Bold black silhouette of {subject} with elegant Arabic calligraphy style, clean recognizable shape, designed for {corner_style}, solid black on pure white background, no colors, no gradient, no shading, sharp clean edges",
  },
  {
    id: "floral",
    label: "Floral",
    description: "Siluet bunga dan daun",
    promptTemplate:
      "Bold black silhouette of {subject} flowers and leaves as the central motif, clean recognizable shape, designed for {corner_style}, solid black on pure white background, no colors, no gradient, no shading, sharp clean edges",
  },
  {
    id: "tropical",
    label: "Tropis",
    description: "Siluet daun tropis",
    promptTemplate:
      "Bold black silhouette of {subject} tropical leaves as the central motif, clean recognizable shape, designed for {corner_style}, solid black on pure white background, no colors, no gradient, no shading, sharp clean edges",
  },
  {
    id: "royal",
    label: "Royal / Mewah",
    description: "Siluet dengan kesan mewah",
    promptTemplate:
      "Bold black silhouette of {subject} as the central motif, elegant royal style, clean recognizable outline, designed for {corner_style}, solid black on pure white background, no colors, no gradient, no shading, sharp clean edges",
  },
  {
    id: "modern",
    label: "Modern Minimalis",
    description: "Siluet garis bersih geometris",
    promptTemplate:
      "Bold black silhouette of {subject} as the central motif, modern minimalist geometric style, clean recognizable outline, designed for {corner_style}, solid black on pure white background, no colors, no gradient, no shading, sharp clean edges",
  },
  {
    id: "nature",
    label: "Alam / Rustic",
    description: "Siluet elemen alam",
    promptTemplate:
      "Bold black silhouette of {subject} as the central motif, natural rustic style, clean recognizable outline, designed for {corner_style}, solid black on pure white background, no colors, no gradient, no shading, sharp clean edges",
  },
  {
    id: "watercolor",
    label: "Watercolor",
    description: "Siluet dengan kesan lembut",
    promptTemplate:
      "Bold black silhouette of {subject} as the central motif, soft watercolor style, clean recognizable outline, designed for {corner_style}, solid black on pure white background, no colors, no gradient, no shading, sharp clean edges",
  },
];

// ---- Slot → deskripsi posisi untuk prompt ----
export const SLOT_PROMPT_HINTS = {
  "top-left": "placed in the top-left corner, oriented to fill the corner naturally",
  "top-right": "placed in the top-right corner, oriented to fill the corner naturally",
  "bottom-left": "placed in the bottom-left corner, oriented to fill the corner naturally",
  "bottom-right": "placed in the bottom-right corner, oriented to fill the corner naturally",
  "center-top": "placed as a top center divider ornament",
  "center-bottom": "placed as a bottom center divider ornament",
  "side-left": "placed along the left side edge",
  "side-right": "placed along the right side edge",
  "middle-left": "placed along the middle-left edge",
  "middle-right": "placed along the middle-right edge",
  center: "placed as a central emblem or medallion ornament",
  fill: "arranged as a repeating full-page background pattern",
};

export function getStylePreset(id) {
  return ORNAMENT_STYLE_PRESETS.find((preset) => preset.id === id) || ORNAMENT_STYLE_PRESETS[0];
}

/**
 * Bangun prompt final untuk FLUX berdasarkan preset gaya + subjek + slot.
 * Subjek selalu menjadi motif utama; gaya hanya aksen.
 * @param {object} params
 * @param {string} params.styleId id preset gaya
 * @param {string} params.subject deskripsi subjek (misal "rumah joglo")
 * @param {string} params.slot slot tujuan (misal "top-left")
 * @returns {string}
 */
export function buildOrnamentPrompt({ styleId, subject, slot = "top-left" }) {
  const preset = getStylePreset(styleId);
  const cornerStyle = SLOT_PROMPT_HINTS[slot] || SLOT_PROMPT_HINTS["top-left"];
  const subjectText = String(subject || "").trim();

  const prompt = preset.promptTemplate
    .replace("{subject}", subjectText || preset.label.toLowerCase())
    .replace("{corner_style}", cornerStyle);

  return prompt.trim();
}
