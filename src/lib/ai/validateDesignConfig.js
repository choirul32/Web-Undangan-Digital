// ============================================================
// Validasi design_config hasil generate AI.
// Tujuan: output AI TIDAK BOLEH memuat nilai yang tidak dikenal
// renderer. Semua nilai divalidasi terhadap enumerasi yang sama
// dengan yang dipakai editor (dari catalog.js).
// ============================================================

import { ornamentSlots, ornamentParallaxOptions } from "../../templates/ornamentModel";
import { getSectionsOrder } from "../../templates/sectionsOrder";
import {
  countdownVariantOptions,
  eventVariantOptions,
  storyVariantOptions,
  storyAnimationOptions,
  galleryVariantOptions,
  coverLayoutOptions,
  coverDateVariantOptions,
  coverOpeningAnimationOptions,
  openingRevealAnimationOptions,
  openingSequencePresetOptions,
  couplePhotoStyleOptions,
  musicVariantOptions,
  musicPositionOptions,
  coupleFontPresetOptions,
  sectionFontPresetOptions,
  sectionSpacingPresetOptions,
  sectionEntranceOptions,
  ornamentObjectFitOptions,
  ornamentAnimationOptions,
  ornamentEntranceOptions,
  colorPalettePresets,
} from "../../components/dashboard/config";

const KNOWN_SECTIONS = new Set([
  "global",
  "home",
  "cover",
  "couple",
  "acara",
  "events",
  "countdown",
  "story",
  "gallery",
  "gift",
  "rsvp",
  "doa-ucapan",
  "opening",
  "section",
]);

const KNOWN_WIDGETS = new Set([
  "openingReveal",
  "openingSequence",
  "countdown",
  "events",
  "story",
  "gallery",
  "music",
  "gift",
  "rsvp",
]);

const paletteIds = new Set(colorPalettePresets.map((palette) => palette.id));

function isHexColor(value) {
  return typeof value === "string" && /^#[0-9a-fA-F]{3,8}$/.test(value.trim());
}

function isImagePath(value) {
  return (
    typeof value === "string" &&
    (value.startsWith("/assets/") ||
      value.startsWith("http://") ||
      value.startsWith("https://") ||
      value.startsWith("data:image/"))
  );
}

function isNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function sanitizeOrnament(ornament = {}) {
  const cleaned = { ...ornament };

  if (!ornamentSlots.includes(cleaned.slot)) {
    delete cleaned.slot;
  }
  if (cleaned.zIndex !== undefined && !isNumber(cleaned.zIndex)) {
    delete cleaned.zIndex;
  }
  if (cleaned.opacity !== undefined && !isNumber(cleaned.opacity)) {
    delete cleaned.opacity;
  }
  if (cleaned.width !== undefined && !isNumber(cleaned.width)) {
    delete cleaned.width;
  }
  if (cleaned.rotate !== undefined && !isNumber(cleaned.rotate)) {
    delete cleaned.rotate;
  }
  if (cleaned.parallax !== undefined && !ornamentParallaxOptions.includes(cleaned.parallax)) {
    delete cleaned.parallax;
  }
  if (cleaned.animation !== undefined && !ornamentAnimationOptions.includes(cleaned.animation)) {
    delete cleaned.animation;
  }
  if (cleaned.entrance !== undefined && !ornamentEntranceOptions.includes(cleaned.entrance)) {
    delete cleaned.entrance;
  }
  if (cleaned.objectFit !== undefined && !ornamentObjectFitOptions.includes(cleaned.objectFit)) {
    delete cleaned.objectFit;
  }
  if (cleaned.src && !isImagePath(cleaned.src)) {
    delete cleaned.src;
  }

  return cleaned;
}

function sanitizeSectionStyle(style = {}) {
  const cleaned = { ...style };

  if (cleaned.fontPreset !== undefined && !sectionFontPresetOptions.includes(cleaned.fontPreset)) {
    delete cleaned.fontPreset;
  }
  if (cleaned.spacingPreset !== undefined && !sectionSpacingPresetOptions.includes(cleaned.spacingPreset)) {
    delete cleaned.spacingPreset;
  }
  if (cleaned.entranceAnimation !== undefined && !sectionEntranceOptions.includes(cleaned.entranceAnimation)) {
    delete cleaned.entranceAnimation;
  }
  if (cleaned.backgroundColor && !isHexColor(cleaned.backgroundColor)) {
    delete cleaned.backgroundColor;
  }
  if (cleaned.textColor && !isHexColor(cleaned.textColor)) {
    delete cleaned.textColor;
  }
  if (cleaned.accentColor && !isHexColor(cleaned.accentColor)) {
    delete cleaned.accentColor;
  }
  if (cleaned.backgroundImage && !isImagePath(cleaned.backgroundImage)) {
    delete cleaned.backgroundImage;
  }

  return cleaned;
}

function sanitizeWidgets(widgets = {}) {
  const cleaned = { ...widgets };
  const variantMap = {
    countdown: countdownVariantOptions,
    events: eventVariantOptions,
    story: storyVariantOptions,
    gallery: galleryVariantOptions,
    music: musicVariantOptions,
  };

  for (const [widgetName, widgetConfig] of Object.entries(cleaned)) {
    if (!KNOWN_WIDGETS.has(widgetName) || !isObject(widgetConfig)) {
      delete cleaned[widgetName];
      continue;
    }

    const variants = variantMap[widgetName];
    if (variants && widgetConfig.variant !== undefined && !variants.includes(widgetConfig.variant)) {
      delete cleaned[widgetName].variant;
    }

    if (widgetName === "story" && widgetConfig.animation !== undefined && !storyAnimationOptions.includes(widgetConfig.animation)) {
      delete cleaned[widgetName].animation;
    }

    if (widgetName === "openingReveal") {
      if (widgetConfig.animation !== undefined && !openingRevealAnimationOptions.includes(widgetConfig.animation)) {
        delete cleaned[widgetName].animation;
      }
      if (widgetConfig.backgroundMode !== undefined && !["color", "cover", "image"].includes(widgetConfig.backgroundMode)) {
        delete cleaned[widgetName].backgroundMode;
      }
    }

    if (widgetName === "openingSequence" && widgetConfig.preset !== undefined && !openingSequencePresetOptions.includes(widgetConfig.preset)) {
      delete cleaned[widgetName].preset;
    }

    if (widgetName === "music") {
      if (widgetConfig.position !== undefined && !musicPositionOptions.includes(widgetConfig.position)) {
        delete cleaned[widgetName].position;
      }
      if (widgetConfig.pulseIntensity !== undefined && !["subtle", "medium", "strong"].includes(widgetConfig.pulseIntensity)) {
        delete cleaned[widgetName].pulseIntensity;
      }
    }
  }

  return cleaned;
}

function sanitizeCanvas(canvas = {}, warnings = []) {
  if (!isObject(canvas)) {
    return {};
  }

  const cleaned = { ...canvas };

  if (cleaned.sectionsOrder !== undefined) {
    if (!Array.isArray(cleaned.sectionsOrder)) {
      delete cleaned.sectionsOrder;
      warnings.push("canvas.sectionsOrder dilewati (bukan array).");
    } else {
      const before = cleaned.sectionsOrder;
      const after = getSectionsOrder({ canvas: { sectionsOrder: before } });
      const isClean =
        before.length === after.length &&
        before.every((id, index) => id === after[index]);
      if (!isClean) {
        warnings.push(
          "canvas.sectionsOrder dibersihkan (id tak dikenal/duplikat dibuang, yang hilang dilengkapi).",
        );
      }
      cleaned.sectionsOrder = after;
    }
  }

  return cleaned;
}

function sanitizeSections(sections = {}) {
  const cleaned = { ...sections };

  for (const [sectionName, sectionConfig] of Object.entries(cleaned)) {
    if (!KNOWN_SECTIONS.has(sectionName)) {
      delete cleaned[sectionName];
      continue;
    }

    if (isObject(sectionConfig)) {
      cleaned[sectionName] = sanitizeSectionStyle(sectionConfig);
    }
  }

  return cleaned;
}

/**
 * Validasi & bersihkan design_config hasil AI.
 * - Membuang field/objek yang tidak dikenal (mencegah renderer error)
 * - Memvalidasi nilai terhadap enumerasi yang ada
 * - Menjamin shape inti selalu ada (canvas/sections/ornaments/widgets/animations)
 * @param {object} input design_config mentah dari AI
 * @returns {{ config: object, warnings: string[] }}
 */
export function sanitizeDesignConfig(input = {}) {
  const warnings = [];
  const source = isObject(input) ? input : {};

  const config = {
    canvas: sanitizeCanvas(source.canvas, warnings),
    sections: sanitizeSections(source.sections || {}),
    ornaments: {},
    ornamentExclusions: isObject(source.ornamentExclusions) ? source.ornamentExclusions : {},
    widgets: sanitizeWidgets(source.widgets || {}),
    animations: isObject(source.animations) ? source.animations : {},
  };

  const rawOrnaments = source.ornaments || {};
  if (isObject(rawOrnaments)) {
    for (const [sectionName, ornamentList] of Object.entries(rawOrnaments)) {
      const normalizedSection = sectionName.toLowerCase() === "global" ? "global" : sectionName;

      if (!KNOWN_SECTIONS.has(normalizedSection) || !Array.isArray(ornamentList)) {
        warnings.push(`Ornamen section "${sectionName}" dilewati (bukan section dikenal).`);
        continue;
      }

      config.ornaments[normalizedSection] = ornamentList
        .filter(isObject)
        .map(sanitizeOrnament)
        .filter((ornament) => ornament.src);
    }
  }

  // widget countdown butuh nilai valid; flag ringan kalau kosong
  if (!config.widgets.countdown || !config.widgets.countdown.variant) {
    warnings.push("Widget countdown tidak memiliki variant — renderer memakai default.");
  }

  return { config, warnings };
}
