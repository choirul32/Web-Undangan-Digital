import { ensureContrast } from "./colorUtils";

// ============================================================
// applyPalette — satu-satunya pemilik pemetaan palet warna
// ke designConfig (Seam untuk TemplateAdmin.applyColorPalette,
// AI template generator, dan validasi palet).
//
// Pure function: (designConfig, palette) -> designConfig baru.
// Warna palet dilewatkan ensureContrast dulu supaya palet
// custom/AI yang kontrasnya buruk dikoreksi SEBELUM menimpa
// semua section — bukan setelah teks tidak terbaca di preview.
//
// Pemetaan (dipertahankan dari TemplateAdmin):
// - sections.global <- bg/primary/text/accent/surface palet
// - semua section non-global di-reset: useGlobal:true +
//   warna palet (bg/text/accent/surface)
// - palette: palette.id dicatat di root designConfig
// ============================================================

export function paletteToSectionColors(palette) {
  const rawColors = palette?.colors && typeof palette.colors === "object" ? palette.colors : {};
  const { colors, warnings } = ensureContrast(rawColors);

  return {
    colors: {
      backgroundColor: colors.bg,
      primaryColor: colors.primary,
      textColor: colors.text,
      accentColor: colors.accent,
      surfaceColor: colors.surface,
    },
    warnings,
  };
}

export function applyPaletteToDesignConfig(designConfig = {}, palette) {
  if (!palette) {
    return designConfig;
  }

  const { colors } = paletteToSectionColors(palette);
  const nextSections = { ...(designConfig.sections || {}) };
  nextSections.global = {
    ...(nextSections.global || {}),
    ...colors,
  };

  Object.keys(nextSections)
    .filter((sectionKey) => sectionKey !== "global")
    .forEach((sectionKey) => {
      const prevSection = nextSections[sectionKey] || {};
      nextSections[sectionKey] = {
        ...prevSection,
        useGlobal: true,
        ...colors,
      };
    });

  return {
    ...designConfig,
    sections: nextSections,
    palette: palette.id,
  };
}
