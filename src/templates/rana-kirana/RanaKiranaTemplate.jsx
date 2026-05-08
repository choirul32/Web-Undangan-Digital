"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { sampleInvitation } from "../../data/sampleInvitation";
import {
  getCoverSectionConfig,
  getCoupleSectionConfig,
  getDesignConfig,
  getSectionOrnaments,
  getSectionStyleConfig,
} from "../designConfigs";
import OrnamentLayer from "../components/OrnamentLayer";
import EventWidget, { getEventWidgetConfig } from "../components/EventWidget";
import StoryWidget, { getStoryWidgetConfig } from "../components/StoryWidget";
import GalleryWidget, { getGalleryWidgetConfig } from "../components/GalleryWidget";
import RSVPForm from "../components/RSVPForm";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

function SectionTitle({ eyebrow, title, desc }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeUp}
      className="mx-auto max-w-3xl text-center"
    >
      <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--color-accent)]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-4xl font-black leading-tight text-[var(--color-primary)] sm:text-5xl">
        {title}
      </h2>
      {desc ? (
        <p className="mt-4 text-lg font-semibold leading-8 text-[var(--color-text)]">
          {desc}
        </p>
      ) : null}
    </motion.div>
  );
}

function TemplateOrnaments({ designConfig, section }) {
  return <OrnamentLayer ornaments={getSectionOrnaments(designConfig, section)} />;
}

function getSectionMotion(animation = "fade-up") {
  if (animation === "zoom-in") {
    return { initial: { opacity: 0, scale: 0.96 }, whileInView: { opacity: 1, scale: 1 } };
  }

  if (animation === "slide-left") {
    return { initial: { opacity: 0, x: 32 }, whileInView: { opacity: 1, x: 0 } };
  }

  if (animation === "pop-up") {
    return { initial: { opacity: 0, scale: 0.9 }, whileInView: { opacity: 1, scale: 1 } };
  }

  if (animation === "none") {
    return { initial: false, whileInView: false };
  }

  return { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 } };
}

function getSectionSpacingClass(preset = "normal") {
  if (preset === "compact") {
    return "px-6 py-14 sm:px-8 lg:px-10";
  }

  if (preset === "roomy") {
    return "px-6 py-28 sm:px-8 lg:px-10";
  }

  return "px-6 py-20 sm:px-8 lg:px-10";
}

function getSectionFontClass(preset = "default") {
  if (preset === "serif") {
    return "font-serif";
  }

  if (preset === "sans") {
    return "font-sans";
  }

  if (preset === "script") {
    return "font-serif italic";
  }

  return "";
}

function getSectionStyle(styleConfig = {}) {
  return {
    backgroundColor: styleConfig.backgroundColor || undefined,
    color: styleConfig.textColor || undefined,
    "--color-text": styleConfig.textColor || undefined,
    "--color-primary": styleConfig.textColor || undefined,
    "--color-heading": styleConfig.textColor || undefined,
    "--color-accent": styleConfig.accentColor || undefined,
  };
}

function SectionFrame({
  as = "section",
  id,
  section,
  designConfig,
  baseClassName = "",
  children,
}) {
  const styleConfig = getSectionStyleConfig(designConfig, section);
  const Component = motion[as] || motion.section;

  return (
    <Component
      id={id}
      {...getSectionMotion(styleConfig.entranceAnimation)}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`relative overflow-hidden ${getSectionSpacingClass(styleConfig.spacingPreset)} ${getSectionFontClass(styleConfig.fontPreset)} ${baseClassName}`}
      style={getSectionStyle(styleConfig)}
    >
      {styleConfig.backgroundImage ? (
        <img
          src={styleConfig.backgroundImage}
          alt=""
          className="absolute inset-0 z-0 h-full w-full object-cover opacity-45"
        />
      ) : null}
      <TemplateOrnaments designConfig={designConfig} section={section} />
      {children}
    </Component>
  );
}

function getEventClasses(variant = "cards") {
  if (variant === "list") {
    return {
      container: "mt-10 divide-y divide-[var(--color-accent-pale)] rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] shadow-lg shadow-[var(--color-primary)]/8",
      item: "p-6 text-left",
      eyebrow: "text-sm font-black uppercase tracking-[0.16em] text-[var(--color-accent)]",
      title: "mt-2 text-2xl font-black text-[var(--color-primary)]",
      time: "mt-2 text-lg font-black text-[var(--color-primary-hover)]",
      venue: "mt-4 text-base font-black text-[var(--color-primary)]",
      address: "mt-1 text-base font-semibold leading-7 text-[var(--color-text)]",
      button: "mt-5 inline-flex rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-base font-black text-white transition-colors hover:bg-[var(--color-primary-hover)]",
    };
  }

  if (variant === "elegant") {
    return {
      container: "mt-10 grid gap-6 md:grid-cols-2",
      item: "rounded-t-full rounded-b-[16px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] px-7 pb-7 pt-12 text-center shadow-lg shadow-[var(--color-primary)]/8",
      eyebrow: "text-sm font-black uppercase tracking-[0.16em] text-[var(--color-accent)]",
      title: "mt-4 text-3xl font-black text-[var(--color-primary)]",
      time: "mt-3 text-xl font-black text-[var(--color-primary-hover)]",
      venue: "mt-5 text-lg font-black text-[var(--color-primary)]",
      address: "mt-2 text-base font-semibold leading-7 text-[var(--color-text)]",
      button: "mt-6 inline-flex rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-base font-black text-white transition-colors hover:bg-[var(--color-primary-hover)]",
    };
  }

  return {
    container: "mt-10 grid gap-6 md:grid-cols-2",
    item: "rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] p-7 text-center shadow-lg shadow-[var(--color-primary)]/8",
    eyebrow: "text-sm font-black uppercase tracking-[0.16em] text-[var(--color-accent)]",
    title: "mt-3 text-3xl font-black text-[var(--color-primary)]",
    time: "mt-3 text-xl font-black text-[var(--color-primary-hover)]",
    venue: "mt-5 text-lg font-black text-[var(--color-primary)]",
    address: "mt-2 text-base font-semibold leading-7 text-[var(--color-text)]",
    button: "mt-6 inline-flex rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-base font-black text-white transition-colors hover:bg-[var(--color-primary-hover)]",
  };
}

function getStoryClasses(variant = "card") {
  if (variant === "timeline") {
    return {
      container: "relative mt-10 grid gap-5 md:grid-cols-3",
      item: "rounded-[8px] bg-[var(--color-surface)] p-6 shadow-lg shadow-[var(--color-primary)]/8",
      year: "text-sm font-black uppercase tracking-[0.16em] text-[var(--color-accent)]",
      title: "mt-3 text-2xl font-black text-[var(--color-primary)]",
      description: "mt-3 text-base font-semibold leading-7 text-[var(--color-text)]",
    };
  }

  if (variant === "stacked") {
    return {
      container: "mt-10 divide-y divide-[var(--color-accent-pale)] rounded-[8px] bg-[var(--color-surface)]",
      item: "p-6",
      year: "text-sm font-black uppercase tracking-[0.16em] text-[var(--color-accent)]",
      title: "mt-2 text-2xl font-black text-[var(--color-primary)]",
      description: "mt-3 text-base font-semibold leading-7 text-[var(--color-text)]",
    };
  }

  return {
    container: "mt-10 grid gap-5 md:grid-cols-3",
    item: "rounded-[8px] bg-[var(--color-surface)] p-6 shadow-lg shadow-[var(--color-primary)]/8",
    year: "text-sm font-black uppercase tracking-[0.16em] text-[var(--color-accent)]",
    title: "mt-3 text-2xl font-black text-[var(--color-primary)]",
    description: "mt-3 text-base font-semibold leading-7 text-[var(--color-text)]",
  };
}

function getGalleryClasses(variant = "grid") {
  if (variant === "carousel") {
    return {
      container: "mt-10 flex snap-x gap-5 overflow-x-auto pb-3",
      item: "w-64 shrink-0 snap-center overflow-hidden rounded-[8px] border border-[var(--color-accent-pale)] shadow-lg shadow-[var(--color-primary)]/8",
      image: "aspect-[4/5] h-full w-full object-cover",
    };
  }

  if (variant === "masonry") {
    return {
      container: "mt-10 columns-2 gap-5 space-y-5 md:columns-3",
      item: "mb-5 block w-full overflow-hidden rounded-[8px] border border-[var(--color-accent-pale)] shadow-lg shadow-[var(--color-primary)]/8",
      image: "w-full object-cover",
    };
  }

  return {
    container: "mt-10 grid gap-5 md:grid-cols-3",
    item: "overflow-hidden rounded-[8px] border border-[var(--color-accent-pale)] shadow-lg shadow-[var(--color-primary)]/8",
    image: "aspect-[4/5] h-full w-full object-cover",
  };
}

function GiftSection({ accounts, designConfig }) {
  return (
    <SectionFrame
      section="gift"
      designConfig={designConfig}
      baseClassName="bg-[var(--color-surface)]"
    >
      <div className="relative z-10 mx-auto max-w-5xl">
        <SectionTitle
          eyebrow="Amplop Digital"
          title="Doa restu adalah hadiah terbaik."
          desc="Bagi keluarga dan sahabat yang ingin mengirimkan tanda kasih, rekening tersedia di bawah ini."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {accounts.map((account) => (
            <motion.div
              key={account.number}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-6 shadow-lg shadow-[var(--color-primary)]/8"
            >
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[var(--color-accent)]">
                {account.bank}
              </p>
              <p className="mt-3 text-2xl font-black text-[var(--color-primary)]">
                {account.number}
              </p>
              <p className="mt-2 text-base font-semibold text-[var(--color-text)]">
                a.n. {account.name}
              </p>
              <button className="mt-5 rounded-2xl bg-[var(--color-accent)] px-5 py-3 text-base font-black text-[var(--color-primary)]">
                Salin Nomor
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionFrame>
  );
}

function getVisualThemeStyle(theme = {}) {
  return {
    "--color-bg": theme.bg,
    "--color-surface": theme.surface,
    "--color-section-soft": theme.sectionSoft,
    "--color-primary": theme.primary,
    "--color-primary-hover": theme.primary,
    "--color-heading": theme.heading,
    "--color-text": theme.text,
    "--color-accent": theme.accent,
    "--color-accent-soft": theme.accentSoft,
    "--color-accent-pale": theme.accentPale,
    fontFamily: theme.fontFamily,
  };
}

function getCoverMotion(animation = "fade-up") {
  if (animation === "zoom-in") {
    return { initial: { opacity: 0, scale: 0.96 }, animate: { opacity: 1, scale: 1 } };
  }

  if (animation === "slide-left") {
    return { initial: { opacity: 0, x: 26 }, animate: { opacity: 1, x: 0 } };
  }

  if (animation === "pop-up") {
    return { initial: { opacity: 0, scale: 0.88 }, animate: { opacity: 1, scale: 1 } };
  }

  if (animation === "none") {
    return { initial: false, animate: false };
  }

  return { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 } };
}

function getRevealPanelClass(style = "curtain", side = "left") {
  if (style === "gate" || style === "wayang") {
    return side === "left"
      ? "origin-left rounded-r-[36px] bg-[var(--color-primary)]"
      : "origin-right rounded-l-[36px] bg-[var(--color-primary)]";
  }

  if (style === "paper") {
    return "bg-[var(--color-surface)]";
  }

  return side === "left"
    ? "origin-left bg-[var(--color-primary)]"
    : "origin-right bg-[var(--color-primary)]";
}

function CoverReveal({ config, couple, onOpen }) {
  const [isOpen, setIsOpen] = useState(!config.revealEnabled);
  const [isRevealing, setIsRevealing] = useState(false);

  if (!config.revealEnabled || isOpen) {
    return null;
  }

  const isPaper = config.revealStyle === "paper";
  const isWayang = config.revealStyle === "wayang";

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-primary)] text-center text-white"
    >
      <motion.div
        initial={{ x: 0, rotate: 0 }}
        animate={{ x: isRevealing ? "-102%" : 0, rotate: isRevealing && isPaper ? -4 : 0 }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
        className={`absolute inset-y-0 left-0 w-1/2 ${getRevealPanelClass(config.revealStyle, "left")}`}
      />
      <motion.div
        initial={{ x: 0, rotate: 0 }}
        animate={{ x: isRevealing ? "102%" : 0, rotate: isRevealing && isPaper ? 4 : 0 }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
        className={`absolute inset-y-0 right-0 w-1/2 ${getRevealPanelClass(config.revealStyle, "right")}`}
      />
      {isWayang ? (
        <>
          <motion.div
            animate={{ x: [-8, 8, -8], rotate: [-2, 2, -2] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-8 top-16 h-44 w-20 rounded-t-full bg-white/10"
          />
          <motion.div
            animate={{ x: [8, -8, 8], rotate: [2, -2, 2] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-16 right-8 h-44 w-20 rounded-t-full bg-white/10"
          />
        </>
      ) : null}
      <div className="relative z-10 mx-auto max-w-sm px-6">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--color-accent-soft)]">
          The Wedding Of
        </p>
        <h2 className="mt-4 text-5xl font-black leading-none">
          {couple.groomNickname} & {couple.brideNickname}
        </h2>
        <button
          type="button"
          onClick={() => {
            onOpen?.();
            setIsRevealing(true);
            window.setTimeout(() => setIsOpen(true), 850);
          }}
          className="mt-8 rounded-2xl bg-[var(--color-accent)] px-8 py-4 text-base font-black text-[var(--color-primary)] shadow-xl shadow-black/20"
        >
          {config.revealText || "Buka Undangan"}
        </button>
      </div>
    </motion.div>
  );
}

function getGuestBlockClass(style = "card") {
  if (style === "pill") {
    return "mt-8 rounded-full border border-[var(--color-accent-pale)] bg-[var(--color-surface)]/88 px-7 py-4 shadow-xl shadow-[var(--color-primary)]/10 backdrop-blur";
  }

  if (style === "minimal") {
    return "mt-8 border-t border-[var(--color-accent-pale)] px-7 py-4";
  }

  return "mt-8 rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)]/88 px-7 py-5 shadow-xl shadow-[var(--color-primary)]/10 backdrop-blur";
}

function getCoupleImageClass(config) {
  const shape =
    config.photoStyle === "circle"
      ? "rounded-full aspect-square"
      : config.photoStyle === "square"
        ? "rounded-[8px] aspect-[4/5]"
        : "rounded-t-full rounded-b-[14px] aspect-[3/4]";
  const border = config.borderEnabled
    ? "border-[6px] border-[var(--color-surface)]"
    : "";

  return `${shape} ${border} mx-auto w-52 object-cover shadow-xl shadow-[var(--color-primary)]/12`;
}

function getCoupleNameClass(config) {
  if (config.fontPreset === "sans") {
    return "mt-5 text-2xl font-black text-[var(--color-primary)]";
  }

  if (config.fontPreset === "script") {
    return "mt-5 font-serif text-4xl italic text-[var(--color-primary)]";
  }

  return "mt-5 font-serif text-3xl font-black text-[var(--color-primary)]";
}

export default function RanaKiranaTemplate({
  data = sampleInvitation,
  guestName,
  guestSlug,
}) {
  const { couple } = data;
  const visualThemeStyle = Object.keys(data.visualTheme || {}).length > 0
    ? getVisualThemeStyle(data.visualTheme)
    : undefined;
  const designConfig = getDesignConfig(data.templateId || "rana-kirana", data.designConfig);
  const musicRef = useRef(null);
  const coverConfig = getCoverSectionConfig(designConfig);
  const coupleConfig = getCoupleSectionConfig(designConfig);
  const eventWidgetConfig = getEventWidgetConfig(designConfig);
  const eventClasses = getEventClasses(eventWidgetConfig.variant);
  const storyWidgetConfig = getStoryWidgetConfig(designConfig);
  const storyClasses = getStoryClasses(storyWidgetConfig.variant);
  const galleryWidgetConfig = getGalleryWidgetConfig(designConfig);
  const galleryClasses = getGalleryClasses(galleryWidgetConfig.variant);
  const galleryImages = data.gallery?.length ? data.gallery : sampleInvitation.gallery;
  const coverImage = coverConfig.backgroundImage || data.coverImage || "/assets/nusantara-hero-bg.svg";
  const coupleFallbackImage = data.coverImage || galleryImages?.[0] || "/assets/nusantara-hero-bg.svg";
  const startMusic = () => {
    if (!musicRef.current) {
      return;
    }

    const playResult = musicRef.current.play();
    if (playResult?.catch) {
      playResult.catch(() => {});
    }
  };

  return (
    <main
      style={visualThemeStyle}
      className="min-h-screen bg-[var(--color-bg)] text-[var(--color-primary)]"
    >
      <CoverReveal config={coverConfig} couple={couple} onOpen={startMusic} />
      <section
        className="relative isolate min-h-screen overflow-hidden px-6 py-20 sm:px-8 lg:px-10"
        style={{ backgroundColor: coverConfig.backgroundColor || undefined }}
      >
        <img
          src={coverImage}
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--color-bg)]/88 via-[var(--color-bg)]/74 to-[var(--color-bg)]" />
        <TemplateOrnaments designConfig={designConfig} section="home" />
        <motion.div
          {...getCoverMotion(coverConfig.openingAnimation)}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className={`mx-auto flex min-h-[calc(100vh-10rem)] max-w-4xl flex-col items-center justify-center text-center ${
            coverConfig.layout === "split" ? "lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:text-left" : ""
          }`}
        >
          {coverConfig.photoEnabled ? (
            <img
              src={coupleFallbackImage}
              alt={`${couple.groomNickname} dan ${couple.brideNickname}`}
              className={`mb-8 w-56 object-cover shadow-2xl shadow-[var(--color-primary)]/12 ${
                coverConfig.layout === "minimal" ? "hidden" : "rounded-t-full rounded-b-[18px]"
              }`}
            />
          ) : null}
          <div>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-base font-black uppercase tracking-[0.22em] text-[var(--color-accent)]"
          >
            The Wedding Of
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mt-5 text-6xl font-black leading-none text-[var(--color-heading)] sm:text-8xl"
          >
            {couple.groomNickname} & {couple.brideNickname}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="mt-8 max-w-2xl text-xl font-semibold leading-9 text-[var(--color-text)]"
          >
            {couple.quote}
          </motion.p>
          {guestName && coverConfig.guestBlockStyle !== "hidden" ? (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
              className={getGuestBlockClass(coverConfig.guestBlockStyle)}
            >
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[var(--color-accent)]">
                Kepada Yth.
              </p>
              <p className="mt-2 text-2xl font-black text-[var(--color-primary)]">
                {guestName}
              </p>
            </motion.div>
          ) : null}
          <motion.a
            href="#acara"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.32 }}
            className="mt-10 rounded-2xl bg-[var(--color-accent)] px-8 py-4 text-lg font-black text-[var(--color-primary)] shadow-xl shadow-[var(--color-accent)]/20"
          >
            Buka Undangan
          </motion.a>
          </div>
        </motion.div>
      </section>

      <SectionFrame
        section="couple"
        designConfig={designConfig}
        baseClassName="bg-[var(--color-surface)]"
      >
        <div className="relative z-10 mx-auto max-w-5xl">
          <SectionTitle
            eyebrow="Mempelai"
            title={`${couple.groomName} & ${couple.brideName}`}
            desc="Dengan penuh rasa syukur, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[{ name: couple.brideName, image: galleryImages?.[1] || coupleFallbackImage, role: "Putri dari" }, { name: couple.groomName, image: galleryImages?.[2] || coupleFallbackImage, role: "Putra dari" }].map((profile) => (
              <article key={profile.name} className="rounded-[8px] bg-white/58 p-6 text-center">
                {coupleConfig.photoEnabled ? (
                  <img src={profile.image} alt={profile.name} className={getCoupleImageClass(coupleConfig)} />
                ) : null}
                <h3 className={getCoupleNameClass(coupleConfig)}>{profile.name}</h3>
                {coupleConfig.parentTextEnabled ? (
                  <p className="mt-3 text-base font-semibold leading-7 text-[var(--color-text)]">
                    {profile.role} Bapak/Ibu tercinta
                  </p>
                ) : null}
                {coupleConfig.instagramEnabled ? (
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-black text-white"
                  >
                    Instagram
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </SectionFrame>

      <SectionFrame id="acara" section="acara" designConfig={designConfig}>
        <div className="relative z-10 mx-auto max-w-6xl">
          <SectionTitle eyebrow="Detail Acara" title="Akad dan resepsi" />
          <EventWidget events={data.events} config={eventWidgetConfig} classes={eventClasses} />
        </div>
      </SectionFrame>

      <SectionFrame
        section="story"
        designConfig={designConfig}
        baseClassName="bg-[var(--color-section-soft)]"
      >
        <div className="relative z-10 mx-auto max-w-6xl">
          <SectionTitle eyebrow="Love Story" title="Cerita singkat kami" />
          <StoryWidget stories={data.story} config={storyWidgetConfig} classes={storyClasses} />
        </div>
      </SectionFrame>

      <SectionFrame section="gallery" designConfig={designConfig}>
        <div className="relative z-10 mx-auto max-w-6xl">
          <SectionTitle eyebrow="Gallery" title="Momen bahagia" />
          <GalleryWidget
            images={galleryImages}
            coverImage={data.coverImage}
            config={galleryWidgetConfig}
            classes={galleryClasses}
          />
        </div>
      </SectionFrame>

      {data.features.music && data.musicUrl ? (
        <SectionFrame
          section="music"
          designConfig={designConfig}
          baseClassName="bg-[var(--color-surface)]"
        >
          <div className="relative z-10 mx-auto max-w-3xl rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-6 text-center shadow-lg shadow-[var(--color-primary)]/8">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[var(--color-accent)]">
              Backsound
            </p>
            <audio ref={musicRef} controls className="mt-4 w-full">
              <source src={data.musicUrl} />
            </audio>
          </div>
        </SectionFrame>
      ) : null}

      {data.features.gift ? (
        <GiftSection accounts={data.bankAccounts} designConfig={designConfig} />
      ) : null}

      {data.features.rsvp ? (
        <SectionFrame section="rsvp" designConfig={designConfig}>
          <div className="relative z-10 mx-auto max-w-3xl rounded-[8px] bg-[var(--color-primary)] p-8 text-center text-white shadow-xl shadow-[var(--color-primary)]/16">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[var(--color-accent-soft)]">
              RSVP
            </p>
            <h2 className="mt-3 text-4xl font-black">Konfirmasi kehadiran</h2>
            <p className="mt-4 text-lg font-semibold leading-8 text-white/78">
              Mohon konfirmasi kehadiran agar kami dapat menyiapkan acara dengan lebih baik.
            </p>
            <RSVPForm
              invitationSlug={data.slug}
              guestSlug={guestSlug}
              guestName={guestName}
            />
          </div>
        </SectionFrame>
      ) : null}
    </main>
  );
}
