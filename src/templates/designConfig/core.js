import { defaultTemplateMetadata } from "../../data/templateAdminDefaults";

export const defaultDesignConfigs = Object.fromEntries(
  defaultTemplateMetadata.map((template) => [
    template.id,
    template.designConfig || {},
  ]),
);

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
