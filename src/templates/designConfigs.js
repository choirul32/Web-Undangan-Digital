import { defaultTemplateMetadata } from "../data/templateAdminDefaults";
import { defaultCountdownWidgetConfig, getCountdownWidgetConfig } from "./components/CountdownTimer";
import { defaultEventWidgetConfig, getEventWidgetConfig } from "./components/EventWidget";
import { defaultGalleryWidgetConfig, getGalleryWidgetConfig } from "./components/GalleryWidget";
import { defaultStoryWidgetConfig, getStoryWidgetConfig } from "./components/StoryWidget";
import { getMusicWidgetConfig } from "./components/MusicPlayer";

export const defaultDesignConfigs = Object.fromEntries(
  defaultTemplateMetadata.map((template) => [
    template.id,
    template.designConfig || {},
  ]),
);

// --- Single source of truth untuk default widget configs ---
// Renderer memakai getter ini (via widget component files), editor (TemplateAdmin)
// memakai yang sama supaya tidak ada dua daftar default yang bisa drift.

export {
  defaultCountdownWidgetConfig,
  getCountdownWidgetConfig,
  defaultEventWidgetConfig,
  getEventWidgetConfig,
  defaultGalleryWidgetConfig,
  getGalleryWidgetConfig,
  defaultStoryWidgetConfig,
  getStoryWidgetConfig,
};

// Musik: MusicPlayer meng-hardcode defaults di dalam komponen; getter-nya tetap dipakai.
export { getMusicWidgetConfig };

// Editor-only defaults: key ini TIDAK dibaca oleh renderer public —
// cuma dipakai panel editor untuk validasi/pra-isi. Tetap ditaruh di sini
// agar semua default widget berada di satu tempat.
export const defaultGiftWidgetConfig = {
  enabled: true,
  variant: "cards",
  copyButton: true,
  showQr: false,
  hasFallbackAccounts: true,
};

export const defaultRsvpWidgetConfig = {
  enabled: true,
  variant: "form",
  showPax: true,
  showMessage: true,
  requireGuestName: false,
  hasInvitationSlug: true,
};

const emptyDesignConfig = {
  canvas: {},
  sections: {},
  ornaments: {},
  ornamentExclusions: {},
  widgets: {},
  animations: {},
};

export function normalizeDesignConfig(config = {}) {
  const safeConfig = config || {};

  return {
    ...safeConfig,
    canvas: safeConfig.canvas || {},
    sections: safeConfig.sections || {},
    ornaments: safeConfig.ornaments || {},
    ornamentExclusions: safeConfig.ornamentExclusions || {},
    widgets: safeConfig.widgets || {},
    animations: safeConfig.animations || {},
  };
}

function mergeNestedConfigGroup(baseGroup = {}, overrideGroup = {}) {
  const keys = new Set([
    ...Object.keys(baseGroup || {}),
    ...Object.keys(overrideGroup || {}),
  ]);

  return [...keys].reduce((merged, key) => {
    const baseValue = baseGroup?.[key];
    const overrideValue = overrideGroup?.[key];

    if (
      baseValue &&
      overrideValue &&
      typeof baseValue === "object" &&
      typeof overrideValue === "object" &&
      !Array.isArray(baseValue) &&
      !Array.isArray(overrideValue)
    ) {
      merged[key] = {
        ...baseValue,
        ...overrideValue,
      };
      return merged;
    }

    merged[key] = overrideValue ?? baseValue;
    return merged;
  }, {});
}

export function mergeDesignConfigs(baseConfig = {}, overrideConfig = {}) {
  const normalizedBase = normalizeDesignConfig(baseConfig);
  const normalizedOverride = normalizeDesignConfig(overrideConfig);

  return {
    ...emptyDesignConfig,
    ...normalizedBase,
    ...normalizedOverride,
    canvas: {
      ...normalizedBase.canvas,
      ...normalizedOverride.canvas,
    },
    sections: mergeNestedConfigGroup(normalizedBase.sections, normalizedOverride.sections),
    ornaments: {
      ...normalizedBase.ornaments,
      ...normalizedOverride.ornaments,
    },
    ornamentExclusions: {
      ...normalizedBase.ornamentExclusions,
      ...normalizedOverride.ornamentExclusions,
    },
    widgets: mergeNestedConfigGroup(normalizedBase.widgets, normalizedOverride.widgets),
    animations: mergeNestedConfigGroup(normalizedBase.animations, normalizedOverride.animations),
  };
}

export function getDesignConfig(templateId, overrideConfig = {}) {
  const baseConfig = defaultDesignConfigs[templateId] || {};

  return mergeDesignConfigs(baseConfig, overrideConfig);
}

export function getSectionOrnaments(designConfig, sectionName) {
  const normalizedConfig = normalizeDesignConfig(designConfig);
  const ornaments = normalizedConfig.ornaments;
  const globalExcludedSections = new Set(normalizedConfig.ornamentExclusions?.global || []);
  const sectionSequence = normalizedConfig.animations?.sections?.[sectionName] || {};
  const applySequence = (items = []) =>
    items.map((ornament, index) => {
      if (!sectionSequence.enabled) {
        return ornament;
      }

      return {
        ...ornament,
        sequence: {
          entrance: sectionSequence.entrancePreset || ornament.entrance,
          animation: sectionSequence.loopPreset || ornament.animation,
          entranceDelay: Number(sectionSequence.entranceDelay || 0) + index * Number(sectionSequence.staggerStep || 0),
          animationDelay: Number(sectionSequence.loopDelay || 0) + index * Number(sectionSequence.staggerStep || 0),
        },
      };
    });

  const sectionOrnaments =
    sectionName === "global"
      ? ornaments.global || []
      : [
          ...(globalExcludedSections.has(sectionName) ? [] : ornaments.global || []),
          ...(ornaments.section || []),
          ...(sectionName && sectionName !== "section" ? ornaments[sectionName] || [] : []),
        ];

  return sectionSequence.enabled ? applySequence(sectionOrnaments) : sectionOrnaments;
}

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
  // Personalisasi ukuran & posisi (px / offset). Nilai null/kosong = pakai default render.
  nameFontSize: "", // px — ukuran nama pasangan
  dateFontSize: "", // px — ukuran tanggal
  quoteFontSize: "", // px — ukuran kutipan
  contentPosition: "center", // center | top | bottom
  contentOffsetY: 0, // px — geser konten naik (-) / turun (+)
  photoWidth: "", // px — lebar foto cover
  photoOffsetY: 0, // px — geser foto naik (-) / turun (+)
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
  // Personalisasi ukuran & posisi layar pembuka
  titleFontSize: "", // px — ukuran nama pasangan
  guestFontSize: "", // px — ukuran nama tamu
  buttonFontSize: "", // px — ukuran teks tombol
  contentPosition: "center", // center | top | bottom
  contentOffsetY: 0, // px — geser konten naik (-) / turun (+)
  photoWidth: "", // px — lebar foto tengah
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
  backgroundParallax: "none", // none | slow | medium | fast
  backgroundOverlay: 0, // 0-90 (kegelapan overlay biar teks terbaca)
  textColor: "",
  accentColor: "",
  fontPreset: "default",
  spacingPreset: "normal",
  entranceAnimation: "fade-up",
  useGlobal: true,
};

export function getCoverSectionConfig(designConfig = {}) {
  const normalizedConfig = normalizeDesignConfig(designConfig);

  return {
    ...defaultCoverSectionConfig,
    ...(normalizedConfig.sections?.home || {}),
    ...(normalizedConfig.sections?.cover || {}),
  };
}

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

export function getCoupleSectionConfig(designConfig = {}) {
  const normalizedConfig = normalizeDesignConfig(designConfig);

  return {
    ...defaultCoupleSectionConfig,
    ...(normalizedConfig.sections?.couple || {}),
  };
}

export function getSectionStyleConfig(designConfig = {}, sectionName = "") {
  const normalizedConfig = normalizeDesignConfig(designConfig);
  const globalStyle = normalizedConfig.sections?.global || {};
  const sectionStyle = normalizedConfig.sections?.[sectionName] || {};
  const useGlobal = sectionStyle.useGlobal !== false;

  const localStyle = sectionName === "global"
    ? sectionStyle
    : useGlobal
    ? { useGlobal: true }
    : sectionStyle;

  return {
    ...defaultSectionStyleConfig,
    ...(useGlobal ? globalStyle : {}),
    ...localStyle,
  };
}
