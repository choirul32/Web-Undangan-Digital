// ============================================================
// AI Asset Catalog — sumber vocabulary yang AI template generator
// boleh pakai. Semua nilai valid ditarik dari enumerasi yang sudah
// ada di renderer/editor (ornamentModel + dashboard/config.js),
// BUKAN didefinisikan ulang, supaya tidak drift.
// ============================================================

import { ornamentSlots, ornamentParallaxOptions, ornamentLayerPresets } from "../../templates/ornamentModel";
import {
  countdownVariantOptions,
  eventVariantOptions,
  storyVariantOptions,
  storyAnimationOptions,
  galleryVariantOptions,
  coverLayoutOptions,
  coverDateVariantOptions,
  coverOpeningAnimationOptions,
  openingRevealAnimationOptions,
  openingSequencePresetOptions,
  couplePhotoStyleOptions,
  musicVariantOptions,
  musicPositionOptions,
  coupleFontPresetOptions,
  sectionFontPresetOptions,
  sectionSpacingPresetOptions,
  sectionEntranceOptions,
  ornamentObjectFitOptions,
  ornamentAnimationOptions,
  ornamentEntranceOptions,
  colorPalettePresets,
  headingFontOptions,
  bodyFontOptions,
  templateStylePresets,
  smartThemeConcepts,
} from "../../components/dashboard/config";
import { defaultTemplateMetadata } from "../../data/templateAdminDefaults";

export const themeKeywords = {
  jawa: ["jawa", "adat", "tradisional", "keraton", "batik", "songket", "wayang"],
  wayang: ["wayang", "pewayangan", "golek", "kulit", "puppet", "shadow"],
  bali: ["bali", "hindu", "penjor", "barong", "kamboja"],
  sunda: ["sunda", "jaipong", "kujang", "megamendung"],
  islami: ["islami", "islam", "arabic", "kaligrafi", "mosque", "halal", "nikah"],
  floral: ["floral", "bunga", "flower", "rose", "peony", "bouquet", "leaf"],
  tropical: ["tropical", "tropis", "monstera", "palem", "frangipani", "kamboja"],
  modern: ["modern", "minimalis", "geometris", "clean", "kontemporer"],
  minimal: ["minimal", "simple", "bersih", "clean", "putih"],
  klasik: ["klasik", "classic", "elegant", "formal", "tradisional"],
  royal: ["royal", "mewah", "luxury", "gold", "emas", "istana", "king", "queen"],
  watercolor: ["watercolor", "aquarel", "cat air", "soft"],
  rustic: ["rustic", "country", "kayu", "natural", "boho"],
  elegant: ["elegant", "sophisticated", "refined", "premium"],
  nature: ["nature", "alam", "daun", "hutan", "green", "tumbuhan"],
};

export const ornamentThemes = Object.keys(themeKeywords);

// ---- Background statis dari public/assets/backgrounds ----
export const staticBackgroundCatalog = [
  {
    src: "/assets/backgrounds/black-rose-frame.jpg",
    name: "Black Rose Frame",
    themes: ["royal", "klasik", "elegant"],
    mood: "gelap",
  },
  {
    src: "/assets/backgrounds/blue-floral-frame.jpg",
    name: "Blue Floral Frame",
    themes: ["floral", "klasik"],
    mood: "terang",
  },
  {
    src: "/assets/backgrounds/green-watercolor-leaf.jpg",
    name: "Green Watercolor Leaf",
    themes: ["nature", "watercolor", "rustic"],
    mood: "terang",
  },
  {
    src: "/assets/backgrounds/paper-fan-blush.jpg",
    name: "Paper Fan Blush",
    themes: ["floral", "elegant"],
    mood: "terang",
  },
  {
    src: "/assets/backgrounds/soft-tropical-cream.jpg",
    name: "Soft Tropical Cream",
    themes: ["tropical", "minimal"],
    mood: "terang",
  },
  {
    src: "/assets/backgrounds/soft-watercolor-cream.jpg",
    name: "Soft Watercolor Cream",
    themes: ["watercolor", "minimal", "elegant"],
    mood: "terang",
  },
  {
    src: "/assets/backgrounds/tropical-frame-soft.jpg",
    name: "Tropical Frame Soft",
    themes: ["tropical", "nature"],
    mood: "terang",
  },
  {
    src: "/assets/backgrounds/tropical-leaf-yellow.jpg",
    name: "Tropical Leaf Yellow",
    themes: ["tropical", "nature"],
    mood: "terang",
  },
  {
    src: "/assets/nusantara-songket.svg",
    name: "Nusantara Songket",
    themes: ["jawa", "adat", "tradisional", "klasik"],
    mood: "terang",
  },
  {
    src: "/assets/template-adat-jawa-premium.png",
    name: "Adat Jawa Premium",
    themes: ["jawa", "adat", "tradisional"],
    mood: "terang",
  },
  {
    src: "/assets/blue-watercolor-frame.svg",
    name: "Blue Watercolor Frame",
    themes: ["watercolor", "floral", "minimal"],
    mood: "terang",
  },
];

// ---- Ornamen HANYA dari manifest (upload admin) ----
// Ornamen statis/bawaan tidak lagi dipakai — supaya AI hanya
// memakai aset yang benar-benar tersedia di toko.
export function normalizeCatalogOrnament(item = {}) {
  const themes = Array.isArray(item.theme)
    ? item.theme.map((t) => String(t).toLowerCase())
    : String(item.theme || "")
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

  const suggestedSlots = Array.isArray(item.suggestedSlots)
    ? item.suggestedSlots
    : String(item.suggestedSlots || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

  const visualProps = Array.isArray(item.visualProps)
    ? item.visualProps
    : String(item.visualProps || "")
        .split(",")
        .map((v) => v.trim().toLowerCase())
        .filter(Boolean);

  return {
    id: item.id || item.storagePath || item.name,
    src: item.src,
    name: item.name || item.id || "Ornamen",
    themes,
    suggestedSlots,
    visualProps,
    tags: String(item.tags || ""),
  };
}

// ---- Ornamen HANYA dari manifest (upload admin) ----
export function buildOrnamentCatalog(manifestOrnaments = []) {
  return (manifestOrnaments || [])
    .map(normalizeCatalogOrnament)
    .filter((ornament) => ornament.src);
}

// ---- Semua nilai valid untuk prompt AI ----
export function buildAiCatalog({ ornaments = [], backgrounds = staticBackgroundCatalog } = {}) {
  const ornamentCatalog = buildOrnamentCatalog(ornaments);
  const backgroundCatalog = (backgrounds || []).length
    ? backgrounds
    : staticBackgroundCatalog;

  return {
    ornamentSlots,
    ornamentParallaxOptions,
    ornamentLayerPresets: ornamentLayerPresets.map((preset) => ({
      id: preset.id,
      zIndex: preset.zIndex,
      description: preset.description,
    })),
    ornamentObjectFitOptions,
    ornamentAnimationOptions,
    ornamentEntranceOptions,
    countdownVariantOptions,
    eventVariantOptions,
    storyVariantOptions,
    storyAnimationOptions,
    galleryVariantOptions,
    coverLayoutOptions,
    coverDateVariantOptions,
    coverOpeningAnimationOptions,
    openingRevealAnimationOptions,
    openingSequencePresetOptions,
    couplePhotoStyleOptions,
    musicVariantOptions,
    musicPositionOptions,
    coupleFontPresetOptions,
    sectionFontPresetOptions,
    sectionSpacingPresetOptions,
    sectionEntranceOptions,
    colorPalettePresets: colorPalettePresets.map((palette) => ({
      id: palette.id,
      colors: palette.colors,
    })),
    headingFontOptions,
    bodyFontOptions,
    templateStylePresets: templateStylePresets.map((preset) => ({
      id: preset.id,
      label: preset.label,
      description: preset.description,
    })),
    smartThemeConcepts,
    themeKeywords,
    ornaments: ornamentCatalog,
    backgrounds: backgroundCatalog,
    exampleTemplates: defaultTemplateMetadata.map((template) => ({
      id: template.id,
      name: template.name,
      description: template.description,
      designConfig: template.designConfig || {},
    })),
  };
}
