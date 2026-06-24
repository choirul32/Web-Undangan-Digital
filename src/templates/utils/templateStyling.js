import { motion } from "framer-motion";
import OrnamentLayer from "../components/OrnamentLayer";
import { getSectionOrnaments, getSectionStyleConfig } from "../designConfigs";

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export function sectionMotion(animation = "fade-up") {
  if (animation === "zoom-in") return { initial: { opacity: 0, scale: 0.96 }, whileInView: { opacity: 1, scale: 1 } };
  if (animation === "slide-left") return { initial: { opacity: 0, x: 30 }, whileInView: { opacity: 1, x: 0 } };
  if (animation === "pop-up") return { initial: { opacity: 0, scale: 0.9 }, whileInView: { opacity: 1, scale: 1 } };
  if (animation === "none") return { initial: false, whileInView: false };
  return { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 } };
}

export function spacingClass(preset = "normal") {
  if (preset === "compact") return "px-6 py-14 sm:px-8 lg:px-10";
  if (preset === "roomy") return "px-6 py-28 sm:px-8 lg:px-10";
  return "px-6 py-20 sm:px-8 lg:px-10";
}

export const FONT_FAMILIES = {
  playfair: "'Playfair Display', serif",
  cormorant: "'Cormorant Garamond', serif",
  "great-vibes": "'Great Vibes', cursive",
  dancing: "'Dancing Script', cursive",
  cinzel: "'Cinzel', serif",
  josefin: "'Josefin Sans', sans-serif",
  lora: "'Lora', serif",
  "alex-brush": "'Alex Brush', cursive",
  inter: "'Inter', sans-serif",
  poppins: "'Poppins', sans-serif",
  nunito: "'Nunito', sans-serif",
  "source-serif": "'Source Serif 4', serif",
  "dm-sans": "'DM Sans', sans-serif",
};

export function fontClass(preset = "default") {
  if (preset === "serif") return "font-serif";
  if (preset === "sans") return "font-sans";
  if (preset === "script") return "font-serif italic";
  return "";
}

export const CONTENT_SCALE_MAP = {
  small: 0.92,
  normal: 1,
  large: 1.08,
  xlarge: 1.16,
};

export function contentScaleValue(contentSize) {
  return CONTENT_SCALE_MAP[contentSize];
}

export function cssVars(styleConfig = {}) {
  const headingFamily = FONT_FAMILIES[styleConfig.headingFont] || undefined;
  const bodyFamily = FONT_FAMILIES[styleConfig.bodyFont] || undefined;
  const cardRadius = styleConfig.cardStyle === "sharp" ? "0px" : styleConfig.cardStyle === "pill" ? "24px" : "8px";
  const primaryColor = styleConfig.primaryColor || styleConfig.textColor || undefined;
  const textColor = styleConfig.textColor || styleConfig.primaryColor || undefined;
  const contentScale = contentScaleValue(styleConfig.contentSize);

  return {
    backgroundColor: styleConfig.backgroundColor || undefined,
    color: textColor,
    fontFamily: bodyFamily || undefined,
    "--color-primary": primaryColor,
    "--color-heading": primaryColor,
    "--color-text": textColor,
    "--color-accent": styleConfig.accentColor || undefined,
    "--font-heading": headingFamily || "inherit",
    "--card-radius": cardRadius,
    // Only emit when explicitly set so per-section frames don't reset the
    // global value inherited from the template root.
    "--content-scale": contentScale ? String(contentScale) : undefined,
  };
}

export function coverMotion(animation = "fade-up") {
  if (animation === "zoom-in") return { initial: { opacity: 0, scale: 0.96 }, animate: { opacity: 1, scale: 1 } };
  if (animation === "slide-left") return { initial: { opacity: 0, x: 26 }, animate: { opacity: 1, x: 0 } };
  if (animation === "pop-up") return { initial: { opacity: 0, scale: 0.88 }, animate: { opacity: 1, scale: 1 } };
  if (animation === "none") return { initial: false, animate: false };
  return { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 } };
}

export function revealExitMotion(animation = "fade") {
  if (animation === "zoom" || animation === "zoom-in") return { opacity: 0, scale: 1.16, filter: "blur(10px)" };
  if (animation === "slide-up") return { opacity: 0, y: "-100%" };
  if (animation === "paper" || animation === "pop-up") return { opacity: 0, scale: 0.9, y: -28 };
  if (animation === "none") return {};
  return { opacity: 0 };
}

export function guestBlockClass(style = "card") {
  if (style === "pill") return "mt-8 rounded-full border border-[var(--color-accent-pale)] bg-[var(--color-surface)]/88 px-7 py-4 shadow-xl shadow-[var(--color-primary)]/10 backdrop-blur";
  if (style === "minimal") return "mt-8 border-t border-[var(--color-accent-pale)] px-7 py-4";
  return "mt-8 rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)]/88 px-7 py-5 shadow-xl shadow-[var(--color-primary)]/10 backdrop-blur";
}

export function compactGuestBlockClass() {
  return "mt-4 rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)]/88 px-4 py-3 shadow-lg shadow-[var(--color-primary)]/8 backdrop-blur";
}

export function profileImageClass(config) {
  const shape = config.photoStyle === "circle" ? "aspect-square rounded-full" : config.photoStyle === "square" ? "aspect-[4/5] rounded-[8px]" : "aspect-[3/4] rounded-t-full rounded-b-[14px]";
  const border = config.borderEnabled ? "border-[6px] border-[var(--color-surface)]" : "";
  return `${shape} ${border} mx-auto w-52 object-cover shadow-xl shadow-[var(--color-primary)]/12`;
}

export function profileNameClass(config) {
  if (config.fontPreset === "sans") return "mt-5 text-2xl font-black text-[var(--color-primary)]";
  if (config.fontPreset === "script") return "mt-5 font-serif text-4xl italic text-[var(--color-primary)]";
  return "mt-5 font-serif text-3xl font-black text-[var(--color-primary)]";
}

export function normalizeEventExamples(events = []) {
  return events.filter(Boolean);
}

export function SectionTitle({ eyebrow, title, desc }) {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.28 }} variants={fadeUp} className="template-section-title relative z-10 mx-auto max-w-3xl text-center">
      {eyebrow ? <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--color-accent)]">{eyebrow}</p> : null}
      <h2 className={`template-section-title-heading text-4xl font-black leading-tight text-[var(--color-primary)] sm:text-5xl ${eyebrow ? "mt-3" : ""}`} style={{ fontFamily: "var(--font-heading)" }}>{title}</h2>
      {desc ? <p className="template-section-title-desc mt-4 text-lg font-semibold leading-8 text-[var(--color-text)]">{desc}</p> : null}
    </motion.div>
  );
}

export function SectionFrame({ section, designConfig, baseClassName = "", applySectionStyle = true, children }) {
  const styleConfig = getSectionStyleConfig(designConfig, section);
  const musicWidgetConfig = designConfig?.widgets?.music || {};
  const pulseSync = musicWidgetConfig.pulseSync || false;
  const pulseIntensity = musicWidgetConfig.pulseIntensity || "subtle";

  return (
    <motion.section {...sectionMotion(styleConfig.entranceAnimation)} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.6, ease: "easeOut" }} id={`section-${section}`} data-preview-section={section} className={`relative overflow-hidden ${spacingClass(styleConfig.spacingPreset)} ${fontClass(styleConfig.fontPreset)} ${baseClassName}`} style={applySectionStyle ? cssVars(styleConfig) : undefined}>
      {styleConfig.backgroundImage ? <img src={styleConfig.backgroundImage} alt="" className="absolute inset-0 z-0 h-full w-full object-cover opacity-[0.42]" /> : null}
      <OrnamentLayer ornaments={getSectionOrnaments(designConfig, section)} pulseSync={pulseSync} pulseIntensity={pulseIntensity} />
      {children}
    </motion.section>
  );
}

