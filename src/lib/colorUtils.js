// ============================================================
// Utilitas warna bersama — dipakai editor (ColorPalettePicker),
// validasi output AI palet, dan helper palet server.
// ============================================================

export function hexToRgb(color = "") {
  const normalized = String(color).replace("#", "").trim();
  if (!/^[0-9a-f]{6}$/i.test(normalized)) {
    return null;
  }

  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

export function isHexColor(value) {
  return typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value.trim());
}

// Pilih warna teks yang terbaca di atas background: gelap utk latar terang,
// putih utk latar gelap.
export function readableTextColor(background = "#ffffff") {
  const rgb = hexToRgb(background);
  if (!rgb) {
    return "#111827";
  }

  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness > 150 ? "#111827" : "#ffffff";
}

// ---- Cek kontras antara dua warna (WCAG simple, 0..1) ----
export function contrastRatio(foreground, background) {
  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);
  if (!fg || !bg) return null;

  const luminance = (rgb) => {
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((value) => {
      const normalized = value / 255;
      return normalized <= 0.03928
        ? normalized / 12.92
        : ((normalized + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const lighter = Math.max(luminance(fg), luminance(bg));
  const darker = Math.min(luminance(fg), luminance(bg));
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Pastikan palet aman dipakai: text kontras dgn bg, accent cukup beda dari bg.
 * Kalau text kurang kontras, pilih #111827 / #ffffff otomatis.
 * @param {{ primary?: string, accent?: string, text?: string, bg?: string, surface?: string }} colors
 * @returns {{ colors: object, warnings: string[] }}
 */
export function ensureContrast(colors = {}) {
  const warnings = [];
  const next = { ...colors };

  const cleanHex = (value, fallback) => {
    if (isHexColor(value)) return value.trim();
    warnings.push(`Warna "${value || "(kosong)"}" tidak valid — dipakai fallback.`);
    return fallback;
  };

  next.bg = cleanHex(next.bg, "#fbf7ef");
  next.surface = cleanHex(next.surface, "#ffffff");
  next.primary = cleanHex(next.primary, "#0f1f3d");
  next.accent = cleanHex(next.accent, "#c8a24a");

  // Text: pastikan kontras terhadap bg (min ~3.5). Kalau tidak, pilih otomatis.
  const text = cleanHex(next.text, readableTextColor(next.bg));
  const ratio = contrastRatio(text, next.bg);
  if (ratio === null || ratio < 3.5) {
    const autoText = readableTextColor(next.bg);
    warnings.push(
      `Warna teks ${next.text || "(kosong)"} kurang kontras dgn background — diganti ${autoText}.`,
    );
    next.text = autoText;
  } else {
    next.text = text;
  }

  return { colors: next, warnings };
}

// ---- Slug sederhana utk palette_id ----
export function slugifyPaletteId(value = "") {
  const slug = String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return slug || "palet-custom";
}
