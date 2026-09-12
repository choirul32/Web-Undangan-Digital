import { normalizeDesignConfig } from "./core";

export const defaultCoverSectionConfig = {
  photoEnabled: true,
  photoStyle: "arch",
  layout: "centered",
  backgroundMode: "color",
  backgroundImage: "",
  backgroundColor: "",
  openingAnimation: "fade-up",
  guestBlockStyle: "card",
  dateVariant: "separator-dot",
  nameFontSize: "",
  dateFontSize: "",
  quoteFontSize: "",
  contentPosition: "center",
  contentOffsetY: 0,
  photoWidth: "",
  photoOffsetY: 0,
  guestCardBgColor: "",
  guestCardTextColor: "",
  guestOffsetY: 0,
};

export const defaultOpeningRevealConfig = {
  enabled: false,
  buttonText: "Buka Undangan",
  coverImageEnabled: true,
  coverImage: "/assets/CoverPasangan.png",
  backgroundMode: "color",
  backgroundImage: "",
  backgroundColor: "",
  animation: "fade",
  sequencePreset: "auto",
  autoPlayMusic: true,
  titleFontSize: "",
  guestFontSize: "",
  buttonFontSize: "",
  contentPosition: "center",
  contentOffsetY: 0,
  photoWidth: "",
  photoPosition: "",
  titlePosition: "",
  guestPosition: "",
  buttonPosition: "",
  photoOffsetY: 0,
  titleOffsetY: 0,
  buttonOffsetY: 0,
  contentPaddingTop: "",
  contentPaddingBottom: "",
  contentMaxWidth: "",
  elementGap: "",
  guestCardBgColor: "",
  guestCardTextColor: "",
  guestOffsetY: 0,
  buttonBgColor: "",
  buttonTextColor: "",
};

export const defaultOpeningSequenceConfig = {
  enabled: true,
  preset: "auto",
  asset: {
    type: "motion",
    src: "",
    poster: "",
    duration: 4,
    delay: 0,
    loop: false,
    skippable: true,
    fallbackPreset: "auto",
    entranceTiming: "with-content",
  },
};

export function getCoverSectionConfig(designConfig = {}) {
  const normalizedConfig = normalizeDesignConfig(designConfig);

  return {
    ...defaultCoverSectionConfig,
    ...(normalizedConfig.sections?.home || {}),
    ...(normalizedConfig.sections?.cover || {}),
  };
}

// Legacy animation map — FROZEN. Jangan tambah key baru di sini;
// template lama yang masih menyimpan revealAnimation lawas tetap
// terbaca, template baru wajib memakai nama animation final.
function normalizeOpeningRevealAnimation(animation = "") {
  const animationMap = {
    "fade-up": "fade",
    "zoom-in": "zoom",
    "slide-left": "curtain",
    "pop-up": "paper",
    "card-fade": "fade",
    wayang: "curtain",
  };

  return animationMap[animation] || animation || defaultOpeningRevealConfig.animation;
}

export function getOpeningRevealConfig(designConfig = {}) {
  const normalizedConfig = normalizeDesignConfig(designConfig);
  // LEGACY (frozen): sections.home.reveal* adalah format template lama
  // sebelum widgets.openingReveal ada. Tetap dibaca agar preview lama
  // tidak rusak; JANGAN menulis format ini dari editor baru.
  const legacyHomeConfig = normalizedConfig.sections?.home || {};
  const widgetConfig = normalizedConfig.widgets?.openingReveal || {};
  const sequenceConfig = normalizedConfig.widgets?.openingSequence || {};
  const animation =
    widgetConfig.animation ||
    widgetConfig.variant ||
    legacyHomeConfig.revealAnimation ||
    legacyHomeConfig.revealStyle ||
    legacyHomeConfig.openingAnimation ||
    defaultOpeningRevealConfig.animation;

  return {
    ...defaultOpeningRevealConfig,
    enabled: legacyHomeConfig.revealEnabled ?? defaultOpeningRevealConfig.enabled,
    buttonText: legacyHomeConfig.revealText || defaultOpeningRevealConfig.buttonText,
    coverImageEnabled: legacyHomeConfig.revealCoverImageEnabled ?? defaultOpeningRevealConfig.coverImageEnabled,
    coverImage: legacyHomeConfig.revealCoverImage || defaultOpeningRevealConfig.coverImage,
    backgroundMode: legacyHomeConfig.revealBackgroundMode || defaultOpeningRevealConfig.backgroundMode,
    backgroundImage: legacyHomeConfig.revealBackgroundImage || defaultOpeningRevealConfig.backgroundImage,
    backgroundColor: legacyHomeConfig.revealBackgroundColor || defaultOpeningRevealConfig.backgroundColor,
    ...widgetConfig,
    sequencePreset:
      sequenceConfig.preset ||
      sequenceConfig.sequencePreset ||
      widgetConfig.sequencePreset ||
      defaultOpeningRevealConfig.sequencePreset,
    animation: normalizeOpeningRevealAnimation(animation),
  };
}

export function getOpeningSequenceConfig(designConfig = {}) {
  const normalizedConfig = normalizeDesignConfig(designConfig);
  const revealConfig = normalizedConfig.widgets?.openingReveal || {};
  const sequenceConfig = normalizedConfig.widgets?.openingSequence || {};

  return {
    ...defaultOpeningSequenceConfig,
    enabled: revealConfig.enabled ?? defaultOpeningSequenceConfig.enabled,
    preset:
      sequenceConfig.preset ||
      sequenceConfig.sequencePreset ||
      revealConfig.sequencePreset ||
      defaultOpeningSequenceConfig.preset,
    asset: {
      ...defaultOpeningSequenceConfig.asset,
      ...(sequenceConfig.asset || {}),
    },
  };
}
