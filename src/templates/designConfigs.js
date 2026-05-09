export const defaultDesignConfigs = {};

const emptyDesignConfig = {
  canvas: {},
  sections: {},
  ornaments: {},
  widgets: {},
  animations: {},
};

export function normalizeDesignConfig(config = {}) {
  return {
    ...config,
    canvas: config.canvas || {},
    sections: config.sections || {},
    ornaments: config.ornaments || {},
    widgets: config.widgets || {},
    animations: config.animations || {},
  };
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
    sections: {
      ...normalizedBase.sections,
      ...normalizedOverride.sections,
    },
    ornaments: {
      ...normalizedBase.ornaments,
      ...normalizedOverride.ornaments,
    },
    widgets: {
      ...normalizedBase.widgets,
      ...normalizedOverride.widgets,
    },
    animations: {
      ...normalizedBase.animations,
      ...normalizedOverride.animations,
    },
  };
}

export function getDesignConfig(templateId, overrideConfig = {}) {
  const baseConfig = defaultDesignConfigs[templateId] || {};

  return mergeDesignConfigs(baseConfig, overrideConfig);
}

export function getSectionOrnaments(designConfig, sectionName) {
  const normalizedConfig = normalizeDesignConfig(designConfig);
  const ornaments = normalizedConfig.ornaments;
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

  return [
    ...(ornaments.section || []),
    ...(sectionName && sectionName !== "section" ? ornaments[sectionName] || [] : []),
  ].map((ornament, index, allOrnaments) => {
    if (!sectionSequence.enabled) {
      return ornament;
    }

    return applySequence(allOrnaments)[index];
  });
}

export const defaultCoverSectionConfig = {
  photoEnabled: true,
  layout: "centered",
  backgroundMode: "color",
  backgroundImage: "",
  backgroundColor: "",
  openingAnimation: "fade-up",
  guestBlockStyle: "card",
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
  autoPlayMusic: true,
};

export const defaultCoupleSectionConfig = {
  photoEnabled: true,
  borderEnabled: true,
  photoStyle: "arch",
  fontPreset: "serif",
  parentTextEnabled: true,
  instagramEnabled: false,
};

export const defaultSectionStyleConfig = {
  backgroundColor: "",
  backgroundImage: "",
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
    animation: normalizeOpeningRevealAnimation(animation),
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
