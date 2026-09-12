import { normalizeDesignConfig } from "./core";

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
