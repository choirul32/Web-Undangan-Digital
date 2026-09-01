import { useMemo, useRef, useState } from "react";
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

const HISTORY_LIMIT = 50;

export default function useDesignConfig({
  activeDesignSection = "home",
  selectedOrnamentIndex = 0,
  setManagerMessage = () => {},
} = {}) {
  const [designConfigText, setDesignConfigText] = useState("");

  // Riwayat undo/redo. Setiap writeDesignConfig yang bukan redo/undo
  // akan mendorong state lama ke undoStack dan membersihkan redoStack.
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const historyRef = useRef({ undo: [], redo: [] });

  const parsedDesignConfig = useMemo(() => {
    try {
      return normalizeDesignConfig(designConfigText.trim() ? JSON.parse(designConfigText) : {});
    } catch {
      return null;
    }
  }, [designConfigText]);

  const writeDesignConfig = (nextConfig, options = {}) => {
    const { record = true } = options;
    const nextText = JSON.stringify(nextConfig, null, 2);

    if (record && designConfigText) {
      const nextUndo = [...historyRef.current.undo, designConfigText].slice(-HISTORY_LIMIT);
      historyRef.current.undo = nextUndo;
      historyRef.current.redo = [];
      setUndoStack(nextUndo);
      setRedoStack([]);
    }

    setDesignConfigText(nextText);
    setManagerMessage("");
  };

  const undo = () => {
    const prev = historyRef.current.undo[historyRef.current.undo.length - 1];
    if (prev === undefined) {
      return;
    }
    historyRef.current.redo = [...historyRef.current.redo, designConfigText].slice(-HISTORY_LIMIT);
    historyRef.current.undo = historyRef.current.undo.slice(0, -1);
    setRedoStack(historyRef.current.redo);
    setUndoStack(historyRef.current.undo);
    setDesignConfigText(prev);
    setManagerMessage("");
  };

  const redo = () => {
    const next = historyRef.current.redo[historyRef.current.redo.length - 1];
    if (next === undefined) {
      return;
    }
    historyRef.current.undo = [...historyRef.current.undo, designConfigText].slice(-HISTORY_LIMIT);
    historyRef.current.redo = historyRef.current.redo.slice(0, -1);
    setUndoStack(historyRef.current.undo);
    setRedoStack(historyRef.current.redo);
    setDesignConfigText(next);
    setManagerMessage("");
  };

  const resetHistory = () => {
    historyRef.current.undo = [];
    historyRef.current.redo = [];
    setUndoStack([]);
    setRedoStack([]);
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
    undo,
    redo,
    resetHistory,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
  };
}
