import { useMemo, useState } from "react";
import { normalizeDesignConfig } from "../../../templates/designConfigs";

// ============================================================
// useDesignConfig — state + patch API untuk designConfig.
// Dipisah dari TemplateAdmin supaya logic config tidak
// terkubur di komponen 2500+ baris.
//
// Semua patch adalah PURE FUNCTIONS (applyPatchWidget dst) yang
// menerima config + params dan mengembalikan config baru — mudah
// diuji tanpa DOM. Hook tinggal membungkusnya dengan state.
// ============================================================

// ---- Pure patch functions ----

export function applyPatchWidget(config, widgetKey, patch) {
  return {
    ...config,
    widgets: {
      ...(config.widgets || {}),
      [widgetKey]: {
        ...(config.widgets?.[widgetKey] || {}),
        ...patch,
      },
    },
  };
}

export function applyPatchSection(config, section, patch) {
  return {
    ...config,
    sections: {
      ...(config.sections || {}),
      [section]: {
        ...(config.sections?.[section] || {}),
        ...patch,
      },
    },
  };
}

export function applyPatchSectionAnimation(config, section, patch) {
  return {
    ...config,
    animations: {
      ...(config.animations || {}),
      sections: {
        ...(config.animations?.sections || {}),
        [section]: {
          ...(config.animations?.sections?.[section] || {}),
          ...patch,
        },
      },
    },
  };
}

export function applyPatchOrnament(config, section, index, field, value) {
  const ornaments = {
    ...(config.ornaments || {}),
    [section]: [...(config.ornaments?.[section] || [])],
  };
  const sectionOrnaments = ornaments[section];
  const targetIndex = Math.min(index, sectionOrnaments.length - 1);
  sectionOrnaments[targetIndex] = {
    ...sectionOrnaments[targetIndex],
    [field]: value,
  };

  return {
    ...config,
    ornaments,
  };
}

export function applyPatchOrnamentAtIndex(config, section, index, patch) {
  const sectionOrnaments = [...(config.ornaments?.[section] || [])];
  if (!sectionOrnaments[index]) {
    return config;
  }
  sectionOrnaments[index] = { ...sectionOrnaments[index], ...patch };

  return {
    ...config,
    ornaments: {
      ...(config.ornaments || {}),
      [section]: sectionOrnaments,
    },
  };
}

export function applyPatchOrnaments(config, section, patchOrUpdater) {
  const currentSectionOrnaments = config.ornaments?.[section] || [];
  const nextSectionOrnaments =
    typeof patchOrUpdater === "function"
      ? patchOrUpdater(currentSectionOrnaments)
      : patchOrUpdater;

  return {
    ...config,
    ornaments: {
      ...(config.ornaments || {}),
      [section]: nextSectionOrnaments,
    },
  };
}

export function applyToggleGlobalOrnamentExclusion(config, sectionName) {
  const currentExclusions = config.ornamentExclusions || {};
  const globalExclusions = Array.isArray(currentExclusions.global)
    ? currentExclusions.global
    : [];
  const nextGlobalExclusions = globalExclusions.includes(sectionName)
    ? globalExclusions.filter((item) => item !== sectionName)
    : [...globalExclusions, sectionName];

  return {
    ...config,
    ornamentExclusions: {
      ...currentExclusions,
      global: nextGlobalExclusions,
    },
  };
}

export function applyPatchOpeningSequenceAsset(config, fields) {
  return {
    ...config,
    widgets: {
      ...(config.widgets || {}),
      openingSequence: {
        ...(config.widgets?.openingSequence || {}),
        asset: {
          ...(config.widgets?.openingSequence?.asset || {}),
          ...fields,
        },
      },
    },
  };
}

// ---- Hook ----

export default function useDesignConfig({
  activeDesignSection = "home",
  selectedOrnamentIndex = 0,
  setManagerMessage = () => {},
} = {}) {
  const [designConfigText, setDesignConfigText] = useState("");

  const parsedDesignConfig = useMemo(() => {
    try {
      return normalizeDesignConfig(designConfigText.trim() ? JSON.parse(designConfigText) : {});
    } catch {
      return null;
    }
  }, [designConfigText]);

  const writeDesignConfig = (nextConfig) => {
    setDesignConfigText(JSON.stringify(nextConfig, null, 2));
    setManagerMessage("");
  };

  const guard = (fn) => {
    if (!parsedDesignConfig) {
      return;
    }
    writeDesignConfig(fn(parsedDesignConfig));
  };

  const patchWidget = (widgetKey, patch) => {
    guard((config) => applyPatchWidget(config, widgetKey, patch));
  };

  const patchSection = (section, patch) => {
    guard((config) => applyPatchSection(config, section, patch));
  };

  const patchGlobalSectionStyle = (patch) => {
    patchSection("global", patch);
  };

  const patchSectionAnimation = (patch) => {
    guard((config) => applyPatchSectionAnimation(config, activeDesignSection, patch));
  };

  const patchOrnament = (field, value) => {
    guard((config) =>
      applyPatchOrnament(config, activeDesignSection, selectedOrnamentIndex, field, value),
    );
  };

  const patchOrnamentAtIndex = (index, patch) => {
    guard((config) => applyPatchOrnamentAtIndex(config, activeDesignSection, index, patch));
  };

  const patchOrnaments = (patchOrUpdater) => {
    guard((config) => applyPatchOrnaments(config, activeDesignSection, patchOrUpdater));
  };

  const toggleGlobalOrnamentExclusion = (sectionName) => {
    guard((config) => applyToggleGlobalOrnamentExclusion(config, sectionName));
  };

  const patchOpeningSequenceAsset = (fields) => {
    guard((config) => applyPatchOpeningSequenceAsset(config, fields));
  };

  // ---- Bulk operations (presets) ----
  const writeDesignConfigPreset = (nextConfig, message) => {
    writeDesignConfig(nextConfig);
    if (message) {
      setManagerMessage(message);
    }
  };

  return {
    designConfigText,
    setDesignConfigText,
    parsedDesignConfig,
    writeDesignConfig,
    patchWidget,
    patchSection,
    patchGlobalSectionStyle,
    patchSectionAnimation,
    patchOrnament,
    patchOrnamentAtIndex,
    patchOrnaments,
    toggleGlobalOrnamentExclusion,
    patchOpeningSequenceAsset,
    writeDesignConfigPreset,
  };
}
