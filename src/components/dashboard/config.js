/**
 * Dashboard Configuration & Constants
 * Extracted from Dashboard.jsx for better maintainability
 */

import { defaultTemplateMetadata } from "../../data/templateAdminDefaults";

// Sample data imports (for reference in constants)
import { sampleInvitation } from "../../data/sampleInvitation";

// ===== INVITATIONS SAMPLE DATA =====
export const invitations = [
  {
    id: "INV-001",
    couple: "Dimas & Salsa",
    slug: "dimas-salsa",
    template: "Rana Kirana",
    category: "Adat",
    status: "Published",
    date: "12 Jun 2026",
    rsvp: 128,
    package: "Premium",
  },
  {
    id: "INV-002",
    couple: "Fahri & Nabila",
    slug: "fahri-nabila",
    template: "Sadajiwa",
    category: "Muslim",
    status: "Review",
    date: "22 Jun 2026",
    rsvp: 64,
    package: "Premium",
  },
  {
    id: "INV-003",
    couple: "Raka & Kirana",
    slug: "raka-kirana",
    template: "Nawasena",
    category: "Adat",
    status: "Draft",
    date: "03 Jul 2026",
    rsvp: 0,
    package: "Exclusive",
  },
  {
    id: "INV-004",
    couple: "Bagas & Ayu",
    slug: "bagas-ayu",
    template: "Melati Senja",
    category: "Modern",
    status: "Revision",
    date: "18 Jul 2026",
    rsvp: 42,
    package: "Basic",
  },
  {
    id: "INV-005",
    couple: "Rizky & Hana",
    slug: "rizky-hana",
    template: "Kidung",
    category: "Non Foto",
    status: "Published",
    date: "01 Agu 2026",
    rsvp: 216,
    package: "Premium",
  },
];

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
  "center",
];
export const ornamentObjectFitOptions = ["contain", "cover", "fill"];
export const ornamentAnimationOptions = ["none", "fade", "float", "sway", "pulse", "slow-rotate"];
export const ornamentLoopModeOptions = ["infinite", "once", "once-hide"];
export const ornamentExitAnimationOptions = ["fade-out", "zoom-out", "slide-left", "slide-down", "scale-down"];
export const ornamentParallaxOptions = ["none", "slow", "medium", "fast"];
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
export const countdownVariantOptions = ["cards", "minimal", "circle", "flip-clock", "ring", "neon-glow"];
export const eventVariantOptions = ["cards", "list", "elegant", "minimal", "corner-bracket"];
export const storyVariantOptions = ["card", "timeline", "stacked", "photo-album"];
export const storyAnimationOptions = ["fade-up", "zoom-in", "slide-left", "stagger", "heartbeat", "blur-to-clear", "scale-bounce", "flip"];
export const galleryVariantOptions = ["grid", "carousel", "masonry"];

// ===== COVER & OPENING OPTIONS =====
export const coverLayoutOptions = ["centered", "split", "minimal"];
export const coverDateVariantOptions = ["plain", "separator-dot", "separator-line", "stacked", "badge", "columns", "full-day", "block"];
export const coverOpeningAnimationOptions = ["none", "fade-up", "zoom-in", "slide-left", "pop-up"];
export const openingRevealAnimationOptions = ["fade", "zoom", "slide-up", "curtain", "gate", "paper"];
export const openingRevealBackgroundModeOptions = ["color", "image"];
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
  { id: "lora", label: "Lora", family: "'Lora', serif", vibe: "Warm serif" },
];

// ===== COLOR PALETTE PRESETS =====
export const colorPalettePresets = [
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
      countdown: { variant: "minimal" },
      events: { variant: "elegant", showIcon: true, showMaps: true },
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
      countdown: { variant: "circle" },
      events: { variant: "elegant", showIcon: false, showMaps: true },
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
      countdown: { variant: "cards" },
      events: { variant: "elegant", showIcon: true, showMaps: true },
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
      countdown: { variant: "circle" },
      events: { variant: "elegant", showIcon: true, showMaps: true },
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
];

// ===== TEMPLATE SECTIONS =====
export const standardTemplateSections = [
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
    label: "Mobile 430",
    frameClass: "h-[680px] max-w-[430px]",
    viewportWidth: 430,
    viewportHeight: 680,
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
  if (section === "countdown") {
    return "countdown";
  }

  if (section === "doa-ucapan") {
    return "doa-ucapan";
  }

  return section || "home";
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
  Review: "bg-[var(--color-accent)] text-[var(--color-primary)]",
  Revision: "bg-[var(--color-muted-strong)] text-[var(--color-primary)]",
  Draft: "bg-[var(--color-section-soft)] text-[var(--color-text)]",
};

// ===== ANIMATION VARIANTS =====
export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

// ===== FORM STEPS =====
export const formSteps = ["Template", "Mempelai", "Acara", "Fitur", "Review"];

// ===== INITIAL INVITATION FORM =====
export const initialInvitationForm = {
  template: "Standard",
  templateId: "standard",
  package: "Premium",
  slug: "dimas-salsa",
  groomName: "Dimas Pratama",
  groomNickname: "Dimas",
  brideName: "Salsa Kirana",
  brideNickname: "Salsa",
  quote: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup.",
  eventTitle: "Akad Nikah",
  eventDate: "2026-06-12",
  eventTime: "09:00",
  venue: "Gedung Serbaguna Nusantara",
  mapsUrl: "https://maps.google.com",
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
      label: "Published",
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

// Re-export sampleInvitation for components that need it
export { sampleInvitation };
