export const defaultDesignConfigs = {
  "blue-watercolor-muslim": {
    canvas: {
      maxWidth: 430,
      background: "#fff8ee",
    },
    sections: {
      default: {
        backgroundImage: "/assets/blue-watercolor-frame.svg",
        overlayClass: "bg-[#fff8ee]/42",
      },
      soft: {
        backgroundImage: "/assets/blue-watercolor-frame.svg",
        overlayClass: "bg-white/62",
      },
    },
    ornaments: {
      home: [
        {
          id: "home-frame",
          src: "/assets/blue-watercolor-frame.svg",
          slot: "fill",
          width: "100%",
          height: "100%",
          x: 0,
          y: 0,
          rotate: 0,
          opacity: 1,
          zIndex: 0,
          objectFit: "cover",
        },
      ],
      section: [
        {
          id: "section-frame",
          src: "/assets/blue-watercolor-frame.svg",
          slot: "fill",
          width: "100%",
          height: "100%",
          x: 0,
          y: 0,
          rotate: 0,
          opacity: 1,
          zIndex: 0,
          objectFit: "cover",
        },
      ],
    },
  },
};

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
  backgroundImage: "",
  backgroundColor: "",
  openingAnimation: "fade-up",
  guestBlockStyle: "card",
  revealEnabled: false,
  revealStyle: "curtain",
  revealText: "Buka Undangan",
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
};

export function getCoverSectionConfig(designConfig = {}) {
  const normalizedConfig = normalizeDesignConfig(designConfig);

  return {
    ...defaultCoverSectionConfig,
    ...(normalizedConfig.sections?.home || {}),
    ...(normalizedConfig.sections?.cover || {}),
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

  return {
    ...defaultSectionStyleConfig,
    ...(normalizedConfig.sections?.[sectionName] || {}),
  };
}
