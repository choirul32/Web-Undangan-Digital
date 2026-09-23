import { templateSectionRegistry } from "./templateSectionRegistry";

// Urutan default = urutan registry (satu sumber kebenaran).
export const DEFAULT_SECTION_ORDER = templateSectionRegistry.map(
  (section) => section.id,
);

const knownSectionIds = () => new Set(DEFAULT_SECTION_ORDER);

/**
 * Ambil urutan section efektif dari designConfig.
 * - config kosong / tanpa canvas.sectionsOrder -> default registry.
 * - id tidak dikenal dibuang, duplikat digabung.
 * - section default yang hilang ditambah di belakang (config lama aman).
 */
export function getSectionsOrder(config = {}) {
  const raw = config?.canvas?.sectionsOrder;

  if (!Array.isArray(raw)) {
    return [...DEFAULT_SECTION_ORDER];
  }

  const known = knownSectionIds();
  const seen = new Set();
  const cleaned = [];

  for (const id of raw) {
    if (typeof id !== "string" || !known.has(id) || seen.has(id)) {
      continue;
    }
    seen.add(id);
    cleaned.push(id);
  }

  for (const id of DEFAULT_SECTION_ORDER) {
    if (!seen.has(id)) {
      seen.add(id);
      cleaned.push(id);
    }
  }

  return cleaned;
}

/**
 * Pindahkan satu section ke index tujuan. Pure, tidak mutasi input.
 * Index dijepit ke range valid. Section tak dikenal -> order asli.
 */
export function moveSectionInOrder(order = [], sectionId, toIndex = 0) {
  const current = Array.isArray(order) ? [...order] : [...DEFAULT_SECTION_ORDER];
  const fromIndex = current.indexOf(sectionId);

  if (fromIndex === -1) {
    return current;
  }

  const clamped = Math.max(0, Math.min(toIndex, current.length - 1));
  current.splice(fromIndex, 1);
  current.splice(clamped, 0, sectionId);

  return current;
}
