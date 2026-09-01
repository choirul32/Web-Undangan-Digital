/**
 * Dashboard Configuration & Constants
 * Extracted from Dashboard.jsx for better maintainability
 */

import { defaultTemplateMetadata } from "../../data/templateAdminDefaults";

// ===== TEMPLATES =====
export const templates = defaultTemplateMetadata.map((metadata, index) => {
  return {
    orders: [34, 28, 24, 19][index] || 12,
    ...metadata,
    image: metadata.image || "/assets/nusantara-premium.svg",
    previewUrl:
      metadata.previewUrl ||
      `/preview?templateId=${encodeURIComponent(metadata.id)}`,
    supportedFeatures: metadata.supportedFeatures || [],
    rendererType: metadata.rendererType || "config",
  };
});

// ===== TEMPLATE OPTIONS =====
export const templateCategoryOptions = ["Basic", "Standard", "Premium", "Adat"];
export const templateBadgeOptions = ["New", "Best Seller", "Premium", "Favorite", "Promo", "Limited", "Custom"];
export const templateCategories = [
  "Semua",
  ...Array.from(new Set([...templateCategoryOptions, ...templates.map((template) => template.category)])),
];

// ===== ORNAMENT OPTIONS =====
// Slots dan parallax bersumber dari ornamentModel (satu vocabulary
// dengan renderer). Jangan definisikan ulang di sini.
export { ornamentSlots, ornamentParallaxOptions } from "../../templates/ornamentModel";
export const ornamentObjectFitOptions = ["contain", "cover", "fill"];
export const ornamentAnimationOptions = ["none", "fade", "float", "sway", "pulse", "slow-rotate"];
export const ornamentLoopModeOptions = ["infinite", "once", "once-hide"];
export const ornamentExitAnimationOptions = ["fade-out", "zoom-out", "slide-left", "slide-down", "scale-down"];
export const ornamentParallaxDirectionOptions = ["vertical", "horizontal"];
export const ornamentEntranceOptions = [
  "none",
  "fade-in",
  "fade-up",
  "zoom-in",
  "pop-up",
  "slide-left",
  "slide-right",
  "drop-in",
];
export const ornamentTimelineTrackOptions = [0, 1, 2, 3];
export const ornamentMaxRasterFileSize = 1024 * 1024;

// ===== WIDGET VARIANT OPTIONS =====
// Hanya varian yang benar-benar diimplementasikan renderer public.
// EventWidget public tidak branching variant (hanya cards/list); StoryWidget hanya
// chapter-scroll & chat-style; sisanya fallback ke classes default.
export const countdownVariantOptions = ["cards", "minimal", "circle", "flip-clock", "ring", "neon-glow"];
export const eventVariantOptions = ["cards", "list"];
export const storyVariantOptions = ["card", "timeline", "stacked", "chapter-scroll", "chat-style"];
export const storyAnimationOptions = ["fade-up", "zoom-in", "slide-left", "stagger", "heartbeat", "blur-to-clear", "scale-bounce", "flip"];
export const galleryVariantOptions = ["grid", "carousel", "masonry", "cinematic-slideshow"];

// ===== COVER & OPENING OPTIONS =====
export const coverLayoutOptions = ["centered", "split", "stacked"];
export const coverDateVariantOptions = ["plain", "separator-dot", "separator-line", "stacked", "badge", "columns", "full-day", "block"];
export const coverOpeningAnimationOptions = ["none", "fade-up", "zoom-in", "slide-left", "pop-up"];
export const openingRevealAnimationOptions = ["fade", "zoom", "slide-up", "curtain", "gate", "paper"];
export const openingSequencePresetOptions = [
  "auto",
  "simple",
  "cinematic-soft",
  "floral-bloom",
  "falling-petals",
  "royal-gate",
  "paper-reveal",
  "wayang-shadow",
];
export const openingRevealBackgroundModeOptions = ["color", "cover", "image"];
export const coverBackgroundModeOptions = ["color", "image"];
export const couplePhotoStyleOptions = ["circle", "arch", "square"];

// ===== MUSIC WIDGET OPTIONS =====
export const musicVariantOptions = ["floating", "bar", "minimal"];
export const musicPositionOptions = ["bottom-right", "bottom-left", "top-right", "top-left"];
export const musicPulseIntensityOptions = ["subtle", "medium", "strong"];

// ===== FONT & SPACING PRESETS =====
export const coupleFontPresetOptions = ["serif", "sans", "script"];
export const sectionFontPresetOptions = ["default", "serif", "sans", "script"];
export const sectionSpacingPresetOptions = ["compact", "normal", "roomy"];
export const sectionEntranceOptions = ["none", "fade-up", "zoom-in", "slide-left", "pop-up"];

// ===== HEADING & BODY FONT OPTIONS =====
export const headingFontOptions = [
  { id: "playfair", label: "Playfair Display", family: "'Playfair Display', serif", vibe: "Elegant klasik" },
  { id: "cormorant", label: "Cormorant Garamond", family: "'Cormorant Garamond', serif", vibe: "Romantic serif" },
  { id: "great-vibes", label: "Great Vibes", family: "'Great Vibes', cursive", vibe: "Script mewah" },
  { id: "dancing", label: "Dancing Script", family: "'Dancing Script', cursive", vibe: "Script casual" },
  { id: "cinzel", label: "Cinzel", family: "'Cinzel', serif", vibe: "Royal formal" },
  { id: "bodoni-moda", label: "Bodoni Moda", family: "'Bodoni Moda', serif", vibe: "High-contrast elegan" },
  { id: "josefin", label: "Josefin Sans", family: "'Josefin Sans', sans-serif", vibe: "Modern clean" },
  { id: "lora", label: "Lora", family: "'Lora', serif", vibe: "Warm serif" },
  { id: "alex-brush", label: "Alex Brush", family: "'Alex Brush', cursive", vibe: "Calligraphy" },
];

export const bodyFontOptions = [
  { id: "inter", label: "Inter", family: "'Inter', sans-serif", vibe: "Modern default" },
  { id: "poppins", label: "Poppins", family: "'Poppins', sans-serif", vibe: "Friendly" },
  { id: "nunito", label: "Nunito", family: "'Nunito', sans-serif", vibe: "Soft rounded" },
  { id: "source-serif", label: "Source Serif 4", family: "'Source Serif 4', serif", vibe: "Readable serif" },
  { id: "dm-sans", label: "DM Sans", family: "'DM Sans', sans-serif", vibe: "Clean geometric" },
  { id: "montserrat", label: "Montserrat", family: "'Montserrat', sans-serif", vibe: "Modern sans" },
  { id: "lora", label: "Lora", family: "'Lora', serif", vibe: "Warm serif" },
];

// ===== COLOR PALETTE PRESETS =====
export const colorPalettePresets = [
  {
    id: "blue-java",
    label: "Blue Java",
    colors: { primary: "#ddbe82", accent: "#ddbe82", text: "#ffffff", bg: "#091932", surface: "#0f2442" },
  },
  {
    id: "royal-navy-gold",
    label: "Royal Navy Gold",
    colors: { primary: "#0f1f3d", accent: "#c8a24a", text: "#374151", bg: "#fbf7ef", surface: "#fffaf2" },
  },
  {
    id: "sage-garden",
    label: "Sage Garden",
    colors: { primary: "#485c43", accent: "#bd9850", text: "#3f453d", bg: "#faf7ef", surface: "#fffdf6" },
  },
  {
    id: "blush-rose",
    label: "Blush Rose",
    colors: { primary: "#5a2d3a", accent: "#d4917a", text: "#4a3840", bg: "#fff5f5", surface: "#fffafa" },
  },
  {
    id: "terracotta",
    label: "Terracotta",
    colors: { primary: "#7f3f2a", accent: "#b99346", text: "#463c35", bg: "#fff7ef", surface: "#fffaf4" },
  },
  {
    id: "midnight-blue",
    label: "Midnight Blue",
    colors: { primary: "#1a2744", accent: "#8ba4c4", text: "#374151", bg: "#f5f8fc", surface: "#fafcff" },
  },
  {
    id: "emerald-gold",
    label: "Emerald Gold",
    colors: { primary: "#0d3b2e", accent: "#c9a24d", text: "#37413d", bg: "#fbf8ef", surface: "#fffdf6" },
  },
  {
    id: "dusty-mauve",
    label: "Dusty Mauve",
    colors: { primary: "#6b4c5e", accent: "#c9a87c", text: "#4a4045", bg: "#fdf8f6", surface: "#fffbf9" },
  },
  {
    id: "monochrome",
    label: "Monochrome",
    colors: { primary: "#1a1a1a", accent: "#666666", text: "#374151", bg: "#ffffff", surface: "#fafafa" },
  },
  {
    id: "midnight-neon",
    label: "Midnight Neon",
    colors: { primary: "#0b1026", accent: "#00e5ff", text: "#1b2430", bg: "#eefbff", surface: "#ffffff" },
  },
  {
    id: "sunset-punch",
    label: "Sunset Punch",
    colors: { primary: "#5a1f14", accent: "#ff6a00", text: "#3f2a24", bg: "#fff3e8", surface: "#fffaf5" },
  },
  {
    id: "royal-violet",
    label: "Royal Violet",
    colors: { primary: "#2a1147", accent: "#9f5cff", text: "#2c2237", bg: "#f6f1ff", surface: "#ffffff" },
  },
  {
    id: "jade-flame",
    label: "Jade Flame",
    colors: { primary: "#0f3a2d", accent: "#ff4d2d", text: "#1f3a34", bg: "#f2fffa", surface: "#ffffff" },
  },
  {
    id: "ocean-cobalt",
    label: "Ocean Cobalt",
    colors: { primary: "#0e2a66", accent: "#2f80ff", text: "#1f2f4a", bg: "#eef4ff", surface: "#ffffff" },
  },
  {
    id: "crimson-ink",
    label: "Crimson Ink",
    colors: { primary: "#3b0d14", accent: "#e11d48", text: "#3a2027", bg: "#fff1f4", surface: "#ffffff" },
  },
  {
    id: "forest-lime",
    label: "Forest Lime",
    colors: { primary: "#173b12", accent: "#84cc16", text: "#2a3c23", bg: "#f7ffe9", surface: "#ffffff" },
  },
  {
    id: "opal-teal-coral",
    label: "Opal Teal Coral",
    colors: { primary: "#073b4c", accent: "#ef476f", text: "#18343d", bg: "#edfdfb", surface: "#ffffff" },
  },
  {
    id: "charcoal-copper",
    label: "Charcoal Copper",
    colors: { primary: "#1f2933", accent: "#c46a2b", text: "#26323f", bg: "#f4f1ec", surface: "#ffffff" },
  },
  {
    id: "pearl-lavender-mint",
    label: "Pearl Lavender Mint",
    colors: { primary: "#4c2f7a", accent: "#2fbf9f", text: "#312a45", bg: "#f7f2ff", surface: "#ffffff" },
  },
  {
    id: "indigo-marigold",
    label: "Indigo Marigold",
    colors: { primary: "#312e81", accent: "#f59e0b", text: "#2d2f55", bg: "#f1f5ff", surface: "#ffffff" },
  },
  {
    id: "ruby-cream-olive",
    label: "Ruby Cream Olive",
    colors: { primary: "#7f1d1d", accent: "#6b8e23", text: "#3f2a2a", bg: "#fff8e7", surface: "#ffffff" },
  },
  {
    id: "tropical-emerald",
    label: "Tropical Emerald",
    colors: { primary: "#064e3b", accent: "#f97316", text: "#173d34", bg: "#ecfdf5", surface: "#ffffff" },
  },
  {
    id: "editorial-black-ivory",
    label: "Editorial Black Ivory",
    colors: { primary: "#0b0b0f", accent: "#b45309", text: "#222222", bg: "#fffaf0", surface: "#ffffff" },
  },
  {
    id: "sky-berry",
    label: "Sky Berry",
    colors: { primary: "#075985", accent: "#be185d", text: "#16364a", bg: "#f0f9ff", surface: "#ffffff" },
  },
  {
    id: "matcha-plum",
    label: "Matcha Plum",
    colors: { primary: "#365314", accent: "#9333ea", text: "#2f3d28", bg: "#f7fee7", surface: "#ffffff" },
  },
  {
    id: "sandstone-aqua",
    label: "Sandstone Aqua",
    colors: { primary: "#78350f", accent: "#0891b2", text: "#3d332b", bg: "#fffbeb", surface: "#ffffff" },
  },
  {
    id: "noir-rose",
    label: "Noir Rose",
    colors: { primary: "#111827", accent: "#f43f5e", text: "#1f2937", bg: "#fdf2f8", surface: "#ffffff" },
  },
  {
    id: "ceramic-blue",
    label: "Ceramic Blue",
    colors: { primary: "#164e63", accent: "#38bdf8", text: "#1c3b48", bg: "#ecfeff", surface: "#ffffff" },
  },
];

// ===== ANIMATION PRESETS =====
export const sectionAnimationPresets = [
  {
    id: "fade-sequence",
    label: "Fade Sequence",
    entrancePreset: "fade-in",
    loopPreset: "none",
    staggerStep: 0.15,
  },
  {
    id: "float-sequence",
    label: "Float Sequence",
    entrancePreset: "fade-up",
    loopPreset: "float",
    staggerStep: 0.18,
  },
  {
    id: "pop-sequence",
    label: "Pop Sequence",
    entrancePreset: "pop-up",
    loopPreset: "pulse",
    staggerStep: 0.12,
  },
  {
    id: "side-reveal",
    label: "Side Reveal",
    entrancePreset: "slide-right",
    loopPreset: "sway",
    staggerStep: 0.2,
  },
  {
    id: "watercolor-bloom",
    label: "Watercolor Bloom",
    entrancePreset: "zoom-in",
    loopPreset: "float",
    staggerStep: 0.22,
  },
  {
    id: "wayang-entrance",
    label: "Wayang Entrance",
    entrancePreset: "slide-left",
    loopPreset: "sway",
    staggerStep: 0.18,
  },
];

// ===== TEMPLATE STYLE PRESETS =====
export const templateStylePresets = [
  {
    id: "classic",
    label: "Classic",
    description: "Klasik serif, cream-gold, opening lembut, dan ornament formal.",
    sectionStyle: {
      fontPreset: "serif",
      spacingPreset: "roomy",
      entranceAnimation: "fade-up",
      backgroundColor: "#fbf7ef",
      textColor: "#4a3a2a",
      accentColor: "#d8a44d",
    },
    animation: {
      enabled: true,
      preset: "fade-sequence",
      entrancePreset: "fade-in",
      loopPreset: "none",
      staggerStep: 0.14,
    },
    widgets: {
      openingReveal: { enabled: true, animation: "curtain", backgroundMode: "color", backgroundColor: "#fbf7ef" },
      openingSequence: { preset: "cinematic-soft" },
      countdown: { variant: "minimal" },
      events: { variant: "cards", showIcon: true, showMaps: true },
      story: { variant: "timeline", animation: "fade-up" },
      gallery: { variant: "grid", includeCover: true },
    },
    cover: {
      openingAnimation: "fade-up",
      dateVariant: "separator-dot",
    },
    ornaments: {
      home: [
        { id: "classic-top", src: "/assets/blue-watercolor-frame.svg", slot: "top-left", width: 150, x: -10, y: -8, opacity: 0.42, animation: "none", entrance: "fade-in", zIndex: 1 },
        { id: "classic-bottom", src: "/assets/blue-watercolor-frame.svg", slot: "bottom-right", width: 150, x: 10, y: 8, rotate: 180, opacity: 0.38, animation: "none", entrance: "fade-in", zIndex: 1 },
      ],
    },
  },
  {
    id: "royal",
    label: "Royal",
    description: "Navy-gold, opening gate, typography tegas, dan ornament simetris.",
    sectionStyle: {
      fontPreset: "serif",
      spacingPreset: "roomy",
      entranceAnimation: "pop-up",
      backgroundImage: "/assets/backgrounds/black-rose-frame.jpg",
      backgroundColor: "#101a2f",
      textColor: "#f8fafc",
      accentColor: "#f5d06f",
    },
    animation: {
      enabled: true,
      preset: "pop-sequence",
      entrancePreset: "pop-up",
      loopPreset: "pulse",
      staggerStep: 0.12,
    },
    widgets: {
      openingReveal: { enabled: true, animation: "gate", backgroundMode: "color", backgroundColor: "#101a2f" },
      openingSequence: { preset: "royal-gate" },
      countdown: { variant: "circle" },
      events: { variant: "cards", showIcon: true, showMaps: true },
      story: { variant: "card", animation: "zoom-in" },
      gallery: { variant: "carousel", includeCover: true },
    },
    cover: {
      openingAnimation: "pop-up",
      dateVariant: "badge",
    },
    ornaments: {
      home: [
        { id: "royal-left", src: "/assets/blue-watercolor-frame.svg", slot: "middle-left", width: 130, x: -18, y: 0, opacity: 0.32, animation: "pulse", entrance: "pop-up", zIndex: 1 },
        { id: "royal-right", src: "/assets/blue-watercolor-frame.svg", slot: "middle-right", width: 130, x: 18, y: 0, rotate: 180, opacity: 0.32, animation: "pulse", entrance: "pop-up", zIndex: 1 },
      ],
    },
  },
  {
    id: "floral",
    label: "Floral",
    description: "Soft blush, bloom opening, ornament floating, dan gallery masonry.",
    sectionStyle: {
      fontPreset: "serif",
      spacingPreset: "normal",
      entranceAnimation: "zoom-in",
      backgroundImage: "/assets/backgrounds/paper-fan-blush.jpg",
      backgroundColor: "#fff5f1",
      textColor: "#5c3d38",
      accentColor: "#d9897f",
    },
    animation: {
      enabled: true,
      preset: "float-sequence",
      entrancePreset: "fade-up",
      loopPreset: "float",
      staggerStep: 0.18,
    },
    widgets: {
      openingReveal: { enabled: true, animation: "paper", backgroundMode: "color", backgroundColor: "#fff5f1" },
      openingSequence: { preset: "floral-bloom" },
      countdown: { variant: "cards" },
      events: { variant: "cards", showIcon: true, showMaps: true },
      story: { variant: "card", animation: "stagger" },
      gallery: { variant: "masonry", includeCover: true },
    },
    cover: {
      openingAnimation: "zoom-in",
      dateVariant: "separator-line",
    },
    ornaments: {
      home: [
        { id: "floral-top", src: "/assets/blue-watercolor-frame.svg", slot: "top-right", width: 170, x: 10, y: -12, opacity: 0.48, animation: "float", entrance: "fade-up", zIndex: 1 },
        { id: "floral-bottom", src: "/assets/blue-watercolor-frame.svg", slot: "bottom-left", width: 160, x: -10, y: 12, rotate: 180, opacity: 0.44, animation: "float", delay: 0.3, entrance: "fade-up", zIndex: 1 },
      ],
    },
  },
  {
    id: "minimal",
    label: "Minimal",
    description: "Bersih, ringan, compact, opening optional, dan fokus typography.",
    sectionStyle: {
      fontPreset: "sans",
      spacingPreset: "compact",
      entranceAnimation: "fade-up",
      backgroundColor: "#ffffff",
      textColor: "#26211b",
      accentColor: "#8a6f4d",
    },
    animation: {
      enabled: false,
      preset: "fade-sequence",
      entrancePreset: "fade-in",
      loopPreset: "none",
      staggerStep: 0.12,
    },
    widgets: {
      openingReveal: { enabled: false, animation: "fade", backgroundMode: "color", backgroundColor: "#ffffff" },
      openingSequence: { preset: "simple" },
      countdown: { variant: "minimal" },
      events: { variant: "list", showIcon: false, showMaps: true },
      story: { variant: "stacked", animation: "fade-up" },
      gallery: { variant: "grid", includeCover: false },
    },
    cover: {
      openingAnimation: "fade-up",
      guestBlockStyle: "hidden",
      dateVariant: "plain",
    },
    ornaments: {
      home: [],
    },
  },
  {
    id: "cinematic",
    label: "Cinematic",
    description: "Roomy, dramatic entrance, falling petals, carousel, dan story stagger.",
    sectionStyle: {
      fontPreset: "sans",
      spacingPreset: "roomy",
      entranceAnimation: "pop-up",
      backgroundImage: "/assets/backgrounds/green-watercolor-leaf.jpg",
      backgroundColor: "#eef5ef",
      textColor: "#223429",
      accentColor: "#6f8f7a",
    },
    animation: {
      enabled: true,
      preset: "pop-sequence",
      entrancePreset: "pop-up",
      loopPreset: "float",
      staggerStep: 0.16,
    },
    widgets: {
      openingReveal: { enabled: true, animation: "curtain", backgroundMode: "color", backgroundColor: "#eef5ef" },
      openingSequence: { preset: "falling-petals" },
      countdown: { variant: "minimal" },
      events: { variant: "list", showIcon: true, showMaps: true },
      story: { variant: "stacked", animation: "stagger" },
      gallery: { variant: "carousel", includeCover: true },
    },
    cover: {
      openingAnimation: "zoom-in",
      dateVariant: "full-day",
    },
    ornaments: {
      home: [
        { id: "cinematic-top", src: "/assets/blue-watercolor-frame.svg", slot: "top-left", width: 190, x: -18, y: -18, opacity: 0.28, animation: "float", entrance: "fade-in", zIndex: 1 },
        { id: "cinematic-bottom", src: "/assets/blue-watercolor-frame.svg", slot: "bottom-right", width: 190, x: 18, y: 18, rotate: 180, opacity: 0.26, animation: "float", delay: 0.4, entrance: "fade-in", zIndex: 1 },
      ],
    },
  },
  {
    id: "elegant-fade",
    label: "Elegant Fade",
    description: "Serif, spacing lega, transisi halus, dan widget minimal.",
    sectionStyle: {
      fontPreset: "serif",
      spacingPreset: "roomy",
      entranceAnimation: "fade-up",
      backgroundColor: "",
      accentColor: "#d8a44d",
    },
    animation: {
      enabled: true,
      preset: "fade-sequence",
      entrancePreset: "fade-in",
      loopPreset: "none",
      staggerStep: 0.14,
    },
    widgets: {
      openingReveal: { enabled: true, animation: "curtain" },
      openingSequence: { preset: "cinematic-soft" },
      countdown: { variant: "minimal" },
      events: { variant: "cards", showIcon: true, showMaps: true },
      story: { variant: "timeline", animation: "fade-up" },
      gallery: { variant: "grid", includeCover: true },
    },
    cover: {
      openingAnimation: "fade-up",
    },
  },
  {
    id: "floral-float",
    label: "Floral Float",
    description: "Nuansa floral lembut dengan ornament float.",
    sectionStyle: {
      fontPreset: "serif",
      spacingPreset: "normal",
      entranceAnimation: "zoom-in",
      backgroundImage: "/assets/backgrounds/paper-fan-blush.jpg",
      accentColor: "#d9897f",
    },
    animation: {
      enabled: true,
      preset: "float-sequence",
      entrancePreset: "fade-up",
      loopPreset: "float",
      staggerStep: 0.18,
    },
    widgets: {
      openingReveal: { enabled: true, animation: "paper" },
      openingSequence: { preset: "floral-bloom" },
      countdown: { variant: "cards" },
      events: { variant: "cards", showIcon: true, showMaps: true },
      story: { variant: "card", animation: "stagger" },
      gallery: { variant: "masonry", includeCover: true },
    },
    cover: {
      openingAnimation: "zoom-in",
    },
  },
  {
    id: "watercolor-bloom",
    label: "Watercolor Bloom",
    description: "Background watercolor dan reveal paper.",
    sectionStyle: {
      fontPreset: "serif",
      spacingPreset: "roomy",
      entranceAnimation: "zoom-in",
      backgroundImage: "/assets/backgrounds/soft-watercolor-cream.jpg",
      accentColor: "#cfa064",
    },
    animation: {
      enabled: true,
      preset: "watercolor-bloom",
      entrancePreset: "zoom-in",
      loopPreset: "float",
      staggerStep: 0.22,
    },
    widgets: {
      openingReveal: { enabled: true, animation: "paper" },
      openingSequence: { preset: "floral-bloom" },
      countdown: { variant: "circle" },
      events: { variant: "cards", showIcon: false, showMaps: true },
      story: { variant: "stacked", animation: "fade-up" },
      gallery: { variant: "carousel", includeCover: true },
    },
    cover: {
      openingAnimation: "pop-up",
    },
  },
  {
    id: "wayang-reveal",
    label: "Wayang Reveal",
    description: "Opening wayang, side reveal, dan aksen adat.",
    sectionStyle: {
      fontPreset: "serif",
      spacingPreset: "roomy",
      entranceAnimation: "slide-left",
      backgroundColor: "#fff8ee",
      accentColor: "#c08a2c",
    },
    animation: {
      enabled: true,
      preset: "wayang-entrance",
      entrancePreset: "slide-left",
      loopPreset: "sway",
      staggerStep: 0.18,
    },
    widgets: {
      openingReveal: { enabled: true, animation: "curtain" },
      openingSequence: { preset: "wayang-shadow" },
      countdown: { variant: "cards" },
      events: { variant: "cards", showIcon: true, showMaps: true },
      story: { variant: "timeline", animation: "slide-left" },
      gallery: { variant: "grid", includeCover: true },
    },
    cover: {
      openingAnimation: "slide-left",
    },
  },
  {
    id: "royal-gate",
    label: "Royal Gate",
    description: "Opening gate, warna tegas, dan layout elegan.",
    sectionStyle: {
      fontPreset: "serif",
      spacingPreset: "roomy",
      entranceAnimation: "fade-up",
      backgroundImage: "/assets/backgrounds/black-rose-frame.jpg",
      textColor: "#f8fafc",
      accentColor: "#f5d06f",
    },
    animation: {
      enabled: true,
      preset: "pop-sequence",
      entrancePreset: "pop-up",
      loopPreset: "pulse",
      staggerStep: 0.12,
    },
    widgets: {
      openingReveal: { enabled: true, animation: "gate" },
      openingSequence: { preset: "royal-gate" },
      countdown: { variant: "circle" },
      events: { variant: "cards", showIcon: true, showMaps: true },
      story: { variant: "card", animation: "zoom-in" },
      gallery: { variant: "carousel", includeCover: true },
    },
    cover: {
      openingAnimation: "pop-up",
    },
  },
  {
    id: "cinematic-scroll",
    label: "Cinematic Scroll",
    description: "Section roomy, animasi pop, dan gallery carousel.",
    sectionStyle: {
      fontPreset: "sans",
      spacingPreset: "roomy",
      entranceAnimation: "pop-up",
      backgroundImage: "/assets/backgrounds/green-watercolor-leaf.jpg",
      accentColor: "#6f8f7a",
    },
    animation: {
      enabled: true,
      preset: "pop-sequence",
      entrancePreset: "pop-up",
      loopPreset: "float",
      staggerStep: 0.16,
    },
    widgets: {
      openingReveal: { enabled: true, animation: "curtain" },
      openingSequence: { preset: "falling-petals" },
      countdown: { variant: "minimal" },
      events: { variant: "list", showIcon: true, showMaps: true },
      story: { variant: "stacked", animation: "stagger" },
      gallery: { variant: "carousel", includeCover: true },
    },
    cover: {
      openingAnimation: "zoom-in",
    },
  },
  {
    id: "islamic-serene",
    label: "Islamic Serene",
    description: "Nuansa hijau-gold, typography formal, opening lembut, dan layout bersih.",
    sectionStyle: {
      fontPreset: "serif",
      spacingPreset: "roomy",
      entranceAnimation: "fade-up",
      backgroundColor: "#f7f4ea",
      textColor: "#17362b",
      accentColor: "#b7984f",
    },
    animation: {
      enabled: true,
      preset: "fade-sequence",
      entrancePreset: "fade-in",
      loopPreset: "none",
      staggerStep: 0.16,
    },
    widgets: {
      openingReveal: { enabled: true, animation: "curtain", backgroundMode: "color" },
      openingSequence: { preset: "cinematic-soft" },
      countdown: { variant: "minimal" },
      events: { variant: "cards", showIcon: false, showMaps: true },
      story: { variant: "timeline", animation: "fade-up" },
      gallery: { variant: "grid", includeCover: true },
    },
    cover: {
      openingAnimation: "fade-up",
      dateVariant: "separator-line",
    },
  },
  {
    id: "minimal-premium",
    label: "Minimal Premium",
    description: "Bersih, ringan, compact, dan fokus typography.",
    sectionStyle: {
      fontPreset: "sans",
      spacingPreset: "compact",
      entranceAnimation: "fade-up",
      backgroundColor: "#ffffff",
      accentColor: "#8a6f4d",
    },
    animation: {
      enabled: false,
      preset: "fade-sequence",
      entrancePreset: "fade-in",
      loopPreset: "none",
      staggerStep: 0.12,
    },
    widgets: {
      openingReveal: { enabled: false, animation: "fade" },
      openingSequence: { preset: "simple" },
      countdown: { variant: "minimal" },
      events: { variant: "list", showIcon: false, showMaps: true },
      story: { variant: "stacked", animation: "fade-up" },
      gallery: { variant: "grid", includeCover: false },
    },
    cover: {
      openingAnimation: "fade-up",
      guestBlockStyle: "hidden",
    },
  },
  {
    id: "blue-java",
    label: "Blue Java",
    description: "Adat Jawa elegan biru tua + emas, serif tinggi, spacing lega, dan motif songket.",
    sectionStyle: {
      fontPreset: "serif",
      spacingPreset: "roomy",
      entranceAnimation: "fade-up",
      backgroundColor: "#091932",
      backgroundImage: "",
      backgroundOverlay: 38,
      textColor: "#ffffff",
      accentColor: "#ddbe82",
      headingFont: "bodoni-moda",
      bodyFont: "montserrat",
    },
    animation: {
      enabled: true,
      preset: "fade-sequence",
      entrancePreset: "fade-in",
      loopPreset: "none",
      staggerStep: 0.16,
    },
    widgets: {
      openingReveal: { enabled: true, animation: "curtain", backgroundMode: "color", backgroundColor: "#091932" },
      openingSequence: { preset: "cinematic-soft" },
      countdown: { variant: "minimal" },
      events: { variant: "cards", showIcon: true, showMaps: true },
      story: { variant: "timeline", animation: "fade-up" },
      gallery: { variant: "grid", includeCover: true },
    },
    cover: {
      openingAnimation: "fade-up",
      dateVariant: "separator-dot",
    },
    ornaments: {
      home: [],
    },
  },
];

export const smartThemeConcepts = [
  {
    id: "jawa-biru",
    label: "Jawa Biru Elegan",
    description: "Biru tua + emas, serif tinggi, opening lembut, dan nuansa adat Jawa.",
    presetId: "blue-java",
  },
  {
    id: "adat-jawa",
    label: "Adat Jawa",
    description: "Nuansa adat, side reveal, serif formal, dan ornament wayang.",
    presetId: "wayang-reveal",
  },
  {
    id: "modern-luxury",
    label: "Modern Luxury",
    description: "Gelap elegan, gold accent, opening gate, dan gallery carousel.",
    presetId: "royal",
  },
  {
    id: "floral-soft",
    label: "Floral Soft",
    description: "Blush floral, paper reveal, ornament floating, dan masonry gallery.",
    presetId: "floral",
  },
  {
    id: "islamic-elegant",
    label: "Islamic Elegant",
    description: "Hijau-gold, typography formal, opening lembut, dan layout bersih.",
    presetId: "islamic-serene",
  },
];

// ===== TEMPLATE SECTIONS =====
export const standardTemplateSections = [
  "opening",
  "home",
  "couple",
  "acara",
  "countdown",
  "story",
  "gallery",
  "gift",
  "rsvp",
  "doa-ucapan",
];
export const templateSectionPresets = templates.reduce(
  (presets, template) => ({
    ...presets,
    [template.id]: standardTemplateSections,
  }),
  {},
);

// ===== PREVIEW VIEWPORTS =====
export const templatePreviewViewports = {
  mobile: {
    label: "Samsung A54",
    frameClass: "h-[915px] max-w-[412px]",
    viewportWidth: 412,
    viewportHeight: 915,
    scale: 1,
  },
  tablet: {
    label: "Tablet",
    frameClass: "h-[720px] max-w-[640px]",
    viewportWidth: 768,
    viewportHeight: 980,
    scale: 0.78,
  },
  desktop: {
    label: "Desktop scaled",
    frameClass: "h-[760px] max-w-full",
    viewportWidth: 1280,
    viewportHeight: 900,
    scale: 0.58,
  },
};

// ===== HELPER FUNCTIONS =====
export function mapDesignSectionToPreviewSection(section = "home") {
  const normalized = String(section || "home").toLowerCase().trim();

  const aliases = {
    home: "home",
    cover: "home",
    opening: "home",
    couple: "couple",
    mempelai: "couple",
    acara: "acara",
    event: "acara",
    events: "acara",
    countdown: "countdown",
    story: "story",
    "love-story": "story",
    gallery: "gallery",
    gift: "gift",
    rsvp: "rsvp",
    doa: "doa-ucapan",
    ucapan: "doa-ucapan",
    "doa-ucapan": "doa-ucapan",
  };

  return aliases[normalized] || "home";
}

// ===== ACTIVITIES =====
export const activities = [
  "RSVP baru dari keluarga Dimas & Salsa",
  "Fahri & Nabila mengirim revisi data acara",
  "Template Kidung dipilih untuk undangan baru",
  "Rizky & Hana mencapai 200+ RSVP",
];

// ===== STATUS STYLES =====
export const statusStyles = {
  Published: "bg-[var(--color-wa)] text-white",
  Terpublikasi: "bg-[var(--color-wa)] text-white",
  published: "bg-[var(--color-wa)] text-white",
  archived: "bg-[var(--color-primary)] text-white",
  Review: "bg-[var(--color-accent)] text-[var(--color-primary)]",
  review: "bg-[var(--color-accent)] text-[var(--color-primary)]",
  Revision: "bg-[var(--color-muted-strong)] text-[var(--color-primary)]",
  revision: "bg-[var(--color-muted-strong)] text-[var(--color-primary)]",
  Draft: "bg-[var(--color-section-soft)] text-[var(--color-text)]",
  draft: "bg-[var(--color-section-soft)] text-[var(--color-text)]",
  inquiry: "bg-[var(--color-section-soft)] text-[var(--color-text)]",
  waiting_payment: "bg-[var(--color-accent)] text-[var(--color-primary)]",
  unpaid: "bg-[var(--color-section-soft)] text-[var(--color-text)]",
  waiting_confirmation: "bg-[var(--color-accent)] text-[var(--color-primary)]",
  paid: "bg-[var(--color-wa)] text-white",
  in_progress: "bg-[var(--color-muted-strong)] text-[var(--color-primary)]",
  approved: "bg-[var(--color-wa)] text-white",
  completed: "bg-[var(--color-wa)] text-white",
  cancelled: "bg-[var(--color-primary)] text-white",
  refunded: "bg-[var(--color-primary)] text-white",
};

// ===== ANIMATION VARIANTS =====
export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

// ===== FORM STEPS =====
export const formSteps = [
  "Order",
  "Template",
  "Mempelai",
  "Fitur",
  "Tinjau",
];

// ===== INITIAL INVITATION FORM =====
export const initialInvitationForm = {
  customerName: "",
  customerWhatsapp: "",
  orderStatus: "inquiry",
  paymentStatus: "unpaid",
  orderAmount: "",
  orderDeadline: "",
  conceptNotes: "",
  paymentNotes: "Pembayaran manual via transfer bank.",
  template: "Standard",
  templateId: "standard",
  package: "Premium",
  slug: "",
  groomName: "",
  groomNickname: "",
  groomParents: "",
  groomInstagram: "",
  brideName: "",
  brideNickname: "",
  brideParents: "",
  brideInstagram: "",
  quote: "",
  rsvp: true,
  gift: true,
  music: true,
  guestName: true,
};

// ===== UTILITY FUNCTIONS =====
export const formatNumber = (value) => new Intl.NumberFormat("id-ID").format(Number(value || 0));

export function buildDashboardMetrics(stats) {
  return [
    {
      label: "Total Undangan",
      value: formatNumber(stats.invitations),
      detail: `${formatNumber(stats.activeThisMonth)} aktif bulan ini`,
    },
    {
      label: "RSVP Masuk",
      value: formatNumber(stats.rsvps),
      detail: `${formatNumber(stats.rsvpPax)} total pax tercatat`,
    },
    {
      label: "Terpublikasi",
      value: formatNumber(stats.published),
      detail: "Siap dibagikan ke tamu",
    },
    {
      label: "Revisi",
      value: formatNumber(stats.revision),
      detail: `${formatNumber(stats.guests)} tamu tersimpan`,
    },
  ];
}
