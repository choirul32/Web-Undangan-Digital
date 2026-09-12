import { normalizeDesignConfig } from "./core";

export const defaultCoupleSectionConfig = {
  photoEnabled: true,
  borderEnabled: true,
  photoStyle: "arch",
  fontPreset: "serif",
  parentTextEnabled: true,
  instagramEnabled: false,
  cardEnabled: true,
  cardBackgroundMode: "color",
  cardBackgroundColor: "#ffffff",
  cardBackgroundImage: "",
};

export const defaultSectionStyleConfig = {
  backgroundColor: "",
  backgroundImage: "",
  backgroundParallax: "none",
  backgroundOverlay: 0,
  textColor: "",
  accentColor: "",
  surfaceColor: "",
  fontPreset: "default",
  spacingPreset: "normal",
  entranceAnimation: "fade-up",
  useGlobal: true,
};

export function getCoupleSectionConfig(designConfig = {}) {
  const normalizedConfig = normalizeDesignConfig(designConfig);

  return {
    ...defaultCoupleSectionConfig,
    ...(normalizedConfig.sections?.couple || {}),
  };
}

// Properti style non-latar yang boleh di-override per-section MESKIPUN section
// masih "ikut global" (useGlobal=true). Latar (warna/gambar) tetap sepenuhnya
// dikontrol global kecuali useGlobalBackground=false.
const LOCAL_SECTION_STYLE_KEYS = [
  "textColor",
  "accentColor",
  "surfaceColor",
  "fontPreset",
  "spacingPreset",
  "entranceAnimation",
  "cardStyle",
  "cardRadius",
  "cardBorderWidth",
  "cardBorderColor",
  "cardShadow",
  "cardPadding",
  "contentSize",
  "headingFont",
  "bodyFont",
  "primaryColor",
];

export function getSectionStyleConfig(designConfig = {}, sectionName = "") {
  const normalizedConfig = normalizeDesignConfig(designConfig);
  const globalStyle = normalizedConfig.sections?.global || {};
  const sectionStyle = normalizedConfig.sections?.[sectionName] || {};
  const useGlobal = sectionStyle.useGlobal !== false;

  const localOverride = useGlobal
    ? LOCAL_SECTION_STYLE_KEYS.reduce((acc, key) => {
        if (sectionStyle[key] !== undefined && sectionStyle[key] !== "") {
          acc[key] = sectionStyle[key];
        }
        return acc;
      }, {})
    : sectionStyle;

  return {
    ...defaultSectionStyleConfig,
    ...(useGlobal ? globalStyle : {}),
    ...localOverride,
  };
}
