// ============================================================
// Ornament Model — satu-satunya pemilik vocabulary ornament.
// Dipakai oleh renderer (OrnamentLayer), editor
// (OrnamentPropertiesPanel, OrnamentLayerPanel, TemplateAdmin),
// dan option lists (dashboard config).
//
// Jangan mendefinisikan slot/parallax/layer/track di tempat lain —
// kalau renderer dan editor beda, bug "editor benar, renderer beda"
// muncul tanpa ada yang menangkap.
// ============================================================

// ---- Slots ----
export const ornamentSlots = [
  "fill",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
  "center-top",
  "center-bottom",
  "side-left",
  "side-right",
  "middle-left",
  "middle-right",
  "center",
];

export const slotClasses = {
  fill: "inset-0",
  "top-left": "left-0 top-0",
  "top-right": "right-0 top-0",
  "bottom-left": "bottom-0 left-0",
  "bottom-right": "bottom-0 right-0",
  "center-top": "left-1/2 top-0",
  "center-bottom": "bottom-0 left-1/2",
  "side-left": "left-0 top-1/2",
  "side-right": "right-0 top-1/2",
  "middle-left": "left-0 top-1/2",
  "middle-right": "right-0 top-1/2",
  center: "left-1/2 top-1/2",
};

export const slotTransforms = {
  "center-top": "translateX(-50%)",
  "center-bottom": "translateX(-50%)",
  "side-left": "translateY(-50%)",
  "side-right": "translateY(-50%)",
  "middle-left": "translateY(-50%)",
  "middle-right": "translateY(-50%)",
  center: "translate(-50%, -50%)",
};

export const mirrorSlotMap = {
  "top-left": "top-right",
  "top-right": "top-left",
  "bottom-left": "bottom-right",
  "bottom-right": "bottom-left",
  "side-left": "side-right",
  "side-right": "side-left",
  "center-top": "center-top",
  "center-bottom": "center-bottom",
  center: "center",
  fill: "fill",
  "middle-left": "middle-right",
  "middle-right": "middle-left",
};

// ---- Parallax ----
// Nilai ini otoritas: renderer public memakainya. Editor preview
// harus pakai nilai yang sama supaya tidak beda 2x.
export const PARALLAX_SPEEDS = {
  none: 0,
  slow: 0.15,
  medium: 0.3,
  fast: 0.5,
};

export const ornamentParallaxOptions = ["none", "slow", "medium", "fast"];

export function getParallaxSpeed(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  return PARALLAX_SPEEDS[value] ?? 0;
}

// ---- Layer (zIndex) ----
// Threshold ini otoritas: zIndex < 0 = background (di belakang teks),
// zIndex >= 0 = foreground (di atas konten). Editor dan renderer
// harus pakai helper yang sama supaya tidak drift.
export function isForegroundLayer(zIndex = 0) {
  return Number(zIndex) >= 0;
}

export const ornamentLayerPresets = [
  {
    id: "behind",
    label: "Belakang teks",
    description: "Untuk tekstur/frame. Teks tetap berada di atas gambar.",
    zIndex: -1,
  },
  {
    id: "front",
    label: "Di atas teks",
    description: "Untuk foto/ornamen besar yang tidak boleh ketutup tulisan.",
    zIndex: 1,
  },
  {
    id: "top",
    label: "Paling depan",
    description: "Untuk aksen utama yang harus menang dari semua layer.",
    zIndex: 10,
  },
];

export function getOrnamentLayerPresetId(zIndex = 0) {
  if (Number(zIndex) < 0) return "behind";
  if (Number(zIndex) >= 10) return "top";
  return "front";
}

// ---- Timeline (track) ----
export const TRACK_COUNT = 4;
export const TRACK_BASE_DELAY = 0.5;
export const STAGGER_STEP = 0.2;

// ---- Size ----
export function sizeValue(value) {
  if (typeof value === "number") {
    return `${value}px`;
  }

  if (!value) return undefined;

  // If it's a string with unit (%, px, rem, etc), use as-is
  if (typeof value === "string" && /[%a-z]/i.test(value)) {
    return value;
  }

  // Numeric string without unit → treat as px
  const num = Number(value);
  if (Number.isFinite(num)) {
    return `${num}px`;
  }

  return value;
}
