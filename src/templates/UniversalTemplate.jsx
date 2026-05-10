"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { sampleInvitation } from "../data/sampleInvitation";
import {
  getCoupleSectionConfig,
  getCoverSectionConfig,
  getDesignConfig,
  getOpeningRevealConfig,
  getSectionOrnaments,
  getSectionStyleConfig,
} from "./designConfigs";
import CountdownTimer, {
  getCountdownTargetEvent,
  getCountdownWidgetConfig,
} from "./components/CountdownTimer";
import EventWidget, { getEventWidgetConfig } from "./components/EventWidget";
import { getGalleryWidgetConfig } from "./components/GalleryWidget";
import OrnamentLayer from "./components/OrnamentLayer";
import RSVPForm from "./components/RSVPForm";
import StoryWidget, { getStoryWidgetConfig } from "./components/StoryWidget";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

function sectionMotion(animation = "fade-up") {
  if (animation === "zoom-in") {
    return { initial: { opacity: 0, scale: 0.96 }, whileInView: { opacity: 1, scale: 1 } };
  }

  if (animation === "slide-left") {
    return { initial: { opacity: 0, x: 30 }, whileInView: { opacity: 1, x: 0 } };
  }

  if (animation === "pop-up") {
    return { initial: { opacity: 0, scale: 0.9 }, whileInView: { opacity: 1, scale: 1 } };
  }

  if (animation === "none") {
    return { initial: false, whileInView: false };
  }

  return { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 } };
}

function spacingClass(preset = "normal") {
  if (preset === "compact") {
    return "px-6 py-14 sm:px-8 lg:px-10";
  }

  if (preset === "roomy") {
    return "px-6 py-28 sm:px-8 lg:px-10";
  }

  return "px-6 py-20 sm:px-8 lg:px-10";
}

function fontClass(preset = "default") {
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

function cssVars(styleConfig = {}) {
  return {
    backgroundColor: styleConfig.backgroundColor || undefined,
    color: styleConfig.textColor || undefined,
    "--color-primary": styleConfig.textColor || undefined,
    "--color-heading": styleConfig.textColor || undefined,
    "--color-text": styleConfig.textColor || undefined,
    "--color-accent": styleConfig.accentColor || undefined,
  };
}

function SectionTitle({ eyebrow, title, desc }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.28 }}
      variants={fadeUp}
      className="relative z-10 mx-auto max-w-3xl text-center"
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

function SectionFrame({
  section,
  designConfig,
  baseClassName = "",
  applySectionStyle = true,
  children,
}) {
  const styleConfig = getSectionStyleConfig(designConfig, section);

  return (
    <motion.section
      {...sectionMotion(styleConfig.entranceAnimation)}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      id={`section-${section}`}
      data-preview-section={section}
      className={`relative overflow-hidden ${spacingClass(styleConfig.spacingPreset)} ${fontClass(styleConfig.fontPreset)} ${baseClassName}`}
      style={applySectionStyle ? cssVars(styleConfig) : undefined}
    >
      {styleConfig.backgroundImage ? (
        <img
          src={styleConfig.backgroundImage}
          alt=""
          className="absolute inset-0 z-0 h-full w-full object-cover opacity-[0.42]"
        />
      ) : null}
      <OrnamentLayer ornaments={getSectionOrnaments(designConfig, section)} />
      {children}
    </motion.section>
  );
}

function coverMotion(animation = "fade-up") {
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

function revealMotion(animation = "fade") {
  if (animation === "zoom" || animation === "zoom-in") {
    return { initial: { opacity: 0, scale: 1.04 }, animate: { opacity: 1, scale: 1 } };
  }

  if (animation === "slide-up") {
    return { initial: { opacity: 0, y: 34 }, animate: { opacity: 1, y: 0 } };
  }

  if (animation === "paper" || animation === "pop-up") {
    return { initial: { opacity: 0, scale: 0.92 }, animate: { opacity: 1, scale: 1 } };
  }

  if (animation === "none") {
    return { initial: false, animate: false };
  }

  return { initial: { opacity: 0 }, animate: { opacity: 1 } };
}

function revealExitMotion(animation = "fade") {
  if (animation === "zoom" || animation === "zoom-in") {
    return { opacity: 0, scale: 1.16, filter: "blur(10px)" };
  }

  if (animation === "slide-up") {
    return { opacity: 0, y: "-100%" };
  }

  if (animation === "paper" || animation === "pop-up") {
    return { opacity: 0, scale: 0.9, y: -28 };
  }

  if (animation === "none") {
    return {};
  }

  return { opacity: 0 };
}

function guestBlockClass(style = "card") {
  if (style === "pill") {
    return "mt-8 rounded-full border border-[var(--color-accent-pale)] bg-[var(--color-surface)]/88 px-7 py-4 shadow-xl shadow-[var(--color-primary)]/10 backdrop-blur";
  }

  if (style === "minimal") {
    return "mt-8 border-t border-[var(--color-accent-pale)] px-7 py-4";
  }

  return "mt-8 rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)]/88 px-7 py-5 shadow-xl shadow-[var(--color-primary)]/10 backdrop-blur";
}

function profileImageClass(config) {
  const shape =
    config.photoStyle === "circle"
      ? "aspect-square rounded-full"
      : config.photoStyle === "square"
        ? "aspect-[4/5] rounded-[8px]"
        : "aspect-[3/4] rounded-t-full rounded-b-[14px]";
  const border = config.borderEnabled ? "border-[6px] border-[var(--color-surface)]" : "";

  return `${shape} ${border} mx-auto w-52 object-cover shadow-xl shadow-[var(--color-primary)]/12`;
}

function profileNameClass(config) {
  if (config.fontPreset === "sans") {
    return "mt-5 text-2xl font-black text-[var(--color-primary)]";
  }

  if (config.fontPreset === "script") {
    return "mt-5 font-serif text-4xl italic text-[var(--color-primary)]";
  }

  return "mt-5 font-serif text-3xl font-black text-[var(--color-primary)]";
}

function countdownClasses(variant = "cards") {
  if (variant === "minimal") {
    return {
      container: "grid grid-cols-4 gap-2 border-y border-[var(--color-accent-pale)] py-4",
      item: "px-2 text-center",
      value: "text-2xl font-black text-[var(--color-primary)]",
      label: "mt-1 text-[10px] font-black uppercase tracking-[0.12em] text-[var(--color-text)]",
    };
  }

  if (variant === "circle") {
    return {
      container: "grid grid-cols-4 gap-3",
      item: "flex aspect-square flex-col items-center justify-center rounded-full border border-[var(--color-accent)] bg-[var(--color-surface)]/88 shadow-lg shadow-[var(--color-primary)]/8",
      value: "text-xl font-black text-[var(--color-primary)]",
      label: "mt-1 text-[9px] font-black uppercase tracking-[0.08em] text-[var(--color-text)]",
    };
  }

  if (variant === "flip-clock") {
    return {
      container: "grid grid-cols-4 gap-2 md:gap-4",
      item: "flex flex-col items-center",
      value: "text-3xl md:text-4xl font-black text-[var(--color-primary)]",
      label: "mt-1 text-[9px] font-black uppercase tracking-[0.1em] text-[var(--color-accent)]",
    };
  }

  if (variant === "ring") {
    return {
      container: "grid grid-cols-4 gap-3 md:gap-4",
      item: "flex flex-col items-center justify-center rounded-full border-4 border-[var(--color-accent)] bg-[var(--color-surface)] shadow-lg shadow-[var(--color-primary)]/10 aspect-square",
      value: "text-2xl md:text-3xl font-black text-[var(--color-primary)] leading-none",
      label: "text-[9px] md:text-[10px] font-black uppercase tracking-[0.08em] text-[var(--color-accent)] mt-1",
    };
  }

  if (variant === "neon-glow") {
    return {
      container: "grid grid-cols-4 gap-4",
      item: "flex flex-col items-center justify-center px-4 py-6",
      value: "text-4xl md:text-5xl font-black text-[var(--color-accent)] [text-shadow:_0_0_10px_var(--color-accent),_0_0_20px_var(--color-accent),_0_0_40px_var(--color-accent)]",
      label: "mt-2 text-[10px] font-black uppercase tracking-[0.12em] text-[var(--color-text)]",
    };
  }

  return {
    container: "grid grid-cols-4 gap-3",
    item: "rounded-[8px] bg-[var(--color-surface)]/90 px-3 py-4 shadow-lg shadow-[var(--color-primary)]/8",
    value: "text-2xl font-black text-[var(--color-primary)]",
    label: "mt-1 text-xs font-black uppercase tracking-[0.12em] text-[var(--color-text)]",
  };
}

function eventClasses(variant = "cards") {
  if (variant === "list") {
    return {
      container: "mt-10 divide-y divide-[var(--color-accent-pale)] rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] shadow-lg shadow-[var(--color-primary)]/8",
      icon: "mx-auto mt-8 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-accent)] text-[var(--color-accent)]",
      item: "p-6 text-center",
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
      container: "mx-auto mt-10 grid max-w-5xl justify-center gap-6 md:grid-cols-[minmax(0,28rem)_minmax(0,28rem)]",
      icon: "mx-auto mt-8 flex h-16 w-16 items-center justify-center rounded-t-full rounded-b-[10px] border border-[var(--color-accent)] bg-[var(--color-surface)] text-[var(--color-accent)] shadow-lg shadow-[var(--color-primary)]/8",
      item: "rounded-t-full rounded-b-[16px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] px-7 pb-7 pt-12 text-center shadow-lg shadow-[var(--color-primary)]/8",
      eyebrow: "text-sm font-black uppercase tracking-[0.16em] text-[var(--color-accent)]",
      title: "mt-4 text-3xl font-black text-[var(--color-primary)]",
      time: "mt-3 text-xl font-black text-[var(--color-primary-hover)]",
      venue: "mt-5 text-lg font-black text-[var(--color-primary)]",
      address: "mt-2 text-base font-semibold leading-7 text-[var(--color-text)]",
      button: "mt-6 inline-flex rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-base font-black text-white transition-colors hover:bg-[var(--color-primary-hover)]",
    };
  }

  if (variant === "minimal") {
    return {
      container: "mx-auto mt-10 grid max-w-4xl justify-center gap-8",
      icon: "flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent)] text-white",
      item: "flex flex-col items-center border-b border-[var(--color-accent-pale)] pb-8 text-center last:border-0",
      eyebrow: "text-xs font-black uppercase tracking-[0.2em] text-[var(--color-accent)]",
      title: "mt-3 text-xl font-black text-[var(--color-primary)]",
      time: "mt-2 text-base font-medium text-[var(--color-primary-hover)]",
      venue: "mt-3 text-sm font-semibold text-[var(--color-primary)]",
      address: "mt-1 text-sm text-[var(--color-text)]",
      button: "mt-4 text-sm font-black uppercase tracking-[0.1em] text-[var(--color-accent)] underline underline-offset-4",
    };
  }

  if (variant === "corner-bracket") {
    return {
      container: "mx-auto mt-10 grid max-w-5xl justify-center gap-6 md:grid-cols-[minmax(0,28rem)_minmax(0,28rem)]",
      icon: "mx-auto flex h-12 w-12 items-center justify-center border border-[var(--color-accent)] text-[var(--color-accent)]",
      item: "relative border border-[var(--color-accent-pale)] bg-[var(--color-surface)] p-7 text-center shadow-lg shadow-[var(--color-primary)]/8 before:absolute before:top-0 before:left-0 before:h-6 before:w-6 before:border-t-2 before:border-l-2 before:border-[var(--color-accent)] before:content-[''] after:absolute after:bottom-0 after:right-0 after:h-6 after:w-6 after:border-b-2 after:border-r-2 after:border-[var(--color-accent)] after:content-['']",
      eyebrow: "text-sm font-black uppercase tracking-[0.16em] text-[var(--color-accent)]",
      title: "mt-4 text-3xl font-black text-[var(--color-primary)]",
      time: "mt-3 text-xl font-black text-[var(--color-primary-hover)]",
      venue: "mt-5 text-lg font-black text-[var(--color-primary)]",
      address: "mt-2 text-base font-semibold leading-7 text-[var(--color-text)]",
      button: "mt-6 inline-flex rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-base font-black text-white transition-colors hover:bg-[var(--color-primary-hover)]",
    };
  }

  return {
    container: "mx-auto mt-10 grid max-w-5xl justify-center gap-6 md:grid-cols-[minmax(0,28rem)_minmax(0,28rem)]",
    icon: "mx-auto mt-8 flex h-14 w-14 items-center justify-center rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] text-[var(--color-accent)] shadow-lg shadow-[var(--color-primary)]/8",
    item: "rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] p-7 text-center shadow-lg shadow-[var(--color-primary)]/8",
    eyebrow: "text-sm font-black uppercase tracking-[0.16em] text-[var(--color-accent)]",
    title: "mt-3 text-3xl font-black text-[var(--color-primary)]",
    time: "mt-3 text-xl font-black text-[var(--color-primary-hover)]",
    venue: "mt-5 text-lg font-black text-[var(--color-primary)]",
    address: "mt-2 text-base font-semibold leading-7 text-[var(--color-text)]",
    button: "mt-6 inline-flex rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-base font-black text-white transition-colors hover:bg-[var(--color-primary-hover)]",
  };
}

function storyClasses(variant = "card") {
  if (variant === "timeline") {
    return {
      container: "relative mt-10 space-y-6 border-l-2 border-[var(--color-accent)]/45 pl-7",
      item: "relative rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] p-6 text-left shadow-lg shadow-[var(--color-primary)]/8",
      marker: "absolute -left-[38px] top-7 h-5 w-5 rounded-full border-[4px] border-[var(--color-section-soft)] bg-[var(--color-accent)] shadow-md shadow-[var(--color-primary)]/12",
      year: "text-sm font-black uppercase tracking-[0.16em] text-[var(--color-accent)]",
      title: "mt-3 text-2xl font-black text-[var(--color-primary)]",
      description: "mt-3 text-base font-semibold leading-7 text-[var(--color-text)]",
    };
  }

  if (variant === "stacked") {
    return {
      container: "mt-10 divide-y divide-[var(--color-accent-pale)] rounded-[8px] bg-[var(--color-surface)] shadow-lg shadow-[var(--color-primary)]/8",
      item: "p-6",
      year: "text-sm font-black uppercase tracking-[0.16em] text-[var(--color-accent)]",
      title: "mt-2 text-2xl font-black text-[var(--color-primary)]",
      description: "mt-3 text-base font-semibold leading-7 text-[var(--color-text)]",
    };
  }

  if (variant === "photo-album") {
    return {
      container: "mt-10 grid grid-cols-2 gap-4 md:grid-cols-3",
      item: "group relative aspect-[4/5] overflow-hidden rounded-[8px] bg-[var(--color-surface)] shadow-lg shadow-[var(--color-primary)]/8",
      year: "absolute bottom-2 left-2 rounded bg-[var(--color-accent)]/90 px-2 py-1 text-xs font-black text-white backdrop-blur-sm",
      title: "absolute bottom-2 right-2 text-right text-sm font-black text-white [text-shadow:_0_1px_3px_rgba(0,0,0,0.5)]",
      description: "sr-only",
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

function dummyGalleryClasses(variant = "grid") {
  if (variant === "carousel") {
    return {
      container: "mt-10 flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory",
      item: "flex aspect-[4/5] w-64 shrink-0 snap-center items-center justify-center rounded-[8px] border border-dashed border-[var(--color-accent)] bg-[var(--color-surface)] p-6 text-center shadow-lg shadow-[var(--color-primary)]/8",
    };
  }

  if (variant === "masonry") {
    return {
      container: "mt-10 columns-2 gap-5 space-y-5 md:columns-3",
      item: "mb-5 flex w-full break-inside-avoid items-center justify-center rounded-[8px] border border-dashed border-[var(--color-accent-pale)] bg-[var(--color-surface)] p-6 text-center shadow-lg shadow-[var(--color-primary)]/8",
    };
  }

  return {
    container: "mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
    item: "flex aspect-[4/5] items-center justify-center rounded-[8px] border border-dashed border-[var(--color-accent-pale)] bg-[var(--color-surface)] p-6 text-center shadow-lg shadow-[var(--color-primary)]/8",
  };
}

function dummyGallerySizeClass(variant, index) {
  if (variant !== "masonry") {
    return "";
  }

  const sizeClasses = ["h-72", "h-56", "h-80", "h-64", "h-96", "h-60"];
  return sizeClasses[index % sizeClasses.length];
}

function normalizeEventExamples(events = []) {
  if (events.length !== 1) {
    return events;
  }

  const [event] = events;

  return [
    {
      ...event,
      title: event.title === "Akad & Resepsi" ? "Akad Nikah" : event.title,
    },
    {
      ...event,
      title: "Resepsi",
      time: "11.00 - 14.00 WIB",
    },
  ];
}

function OpeningRevealOverlay({
  config,
  coverConfig,
  couple,
  guestName,
  onOpen,
}) {
  const [isOpening, setIsOpening] = useState(false);

  if (!config.enabled) {
    return null;
  }

  const animation = config.animation || "fade";
  const isSplitAnimation = animation === "curtain" || animation === "gate";
  const backgroundImage =
    config.backgroundMode === "image"
      ? config.backgroundImage || coverConfig.backgroundImage
      : "";
  const backgroundColor = config.backgroundColor || coverConfig.backgroundColor || "#fbf7ef";
  const revealCoverImage = "/assets/CoverPasangan.png";
  const panelImage = backgroundImage || (config.coverImageEnabled ? revealCoverImage : "");
  const frameClass =
    animation === "gate"
      ? "border-x-[18px] border-[var(--color-accent)]/45"
      : animation === "paper"
        ? "bg-[var(--color-surface)]/88 backdrop-blur-sm"
        : "";
  const contentClass =
    animation === "paper"
      ? "rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)]/86 px-6 py-8 shadow-2xl shadow-[var(--color-primary)]/12 backdrop-blur"
      : "";
  const splitPanelClass =
    animation === "gate"
      ? "absolute inset-y-0 z-[2] w-1/2 bg-[var(--color-surface)] shadow-2xl shadow-[var(--color-primary)]/15"
      : "absolute inset-y-0 z-[2] w-1/2 bg-[var(--color-primary)]/12 shadow-2xl shadow-[var(--color-primary)]/10";
  const splitPanelStyle = (side) =>
    panelImage
      ? {
          backgroundImage: `url(${panelImage})`,
          backgroundSize: "200% 100%",
          backgroundPosition: side === "left" ? "left center" : "right center",
          backgroundRepeat: "no-repeat",
        }
      : { backgroundColor };
  const handleOpen = () => {
    if (isOpening) {
      return;
    }

    setIsOpening(true);
    window.setTimeout(onOpen, isSplitAnimation ? 900 : 650);
  };

  return (
    <motion.div
      exit={revealExitMotion(animation)}
      transition={{ duration: 0.72, ease: "easeInOut" }}
      className={`fixed inset-0 z-[120] flex items-center justify-center overflow-hidden px-6 py-12 text-center ${frameClass}`}
      style={{ backgroundColor }}
    >
      {isSplitAnimation ? (
        <>
          <motion.div
            initial={false}
            animate={isOpening ? { x: "-102%" } : { x: 0 }}
            transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
            className={`${splitPanelClass} left-0`}
            style={splitPanelStyle("left")}
          />
          <motion.div
            initial={false}
            animate={isOpening ? { x: "102%" } : { x: 0 }}
            transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
            className={`${splitPanelClass} right-0`}
            style={splitPanelStyle("right")}
          />
        </>
      ) : null}
      {backgroundImage && !isSplitAnimation ? (
        <img
          src={backgroundImage}
          alt=""
          className="absolute inset-0 z-0 h-full w-full object-cover opacity-[0.35]"
        />
      ) : null}
      <div className="absolute inset-0 z-[1] bg-[var(--color-bg)]/70" />
      <motion.div
        {...revealMotion(animation)}
        animate={
          isOpening
            ? animation === "zoom"
              ? { opacity: 0, scale: 1.08 }
              : animation === "slide-up" || animation === "paper"
                ? { opacity: 0, y: -34 }
                : { opacity: 0 }
            : revealMotion(animation).animate
        }
        transition={{ duration: 0.68, ease: "easeOut" }}
        className={`relative z-10 mx-auto max-w-3xl ${contentClass}`}
      >
        {config.coverImageEnabled ? (
          <img
            src={revealCoverImage}
            alt={`${couple.groomNickname} dan ${couple.brideNickname}`}
            className="mx-auto mb-7 aspect-[3/4] w-44 rounded-t-full rounded-b-[16px] object-cover shadow-2xl shadow-[var(--color-primary)]/12"
          />
        ) : null}
        <p className="text-sm font-black uppercase tracking-[0.24em] text-[var(--color-accent)]">
          The Wedding Of
        </p>
        <h1 className="mt-5 font-serif text-5xl font-black leading-none text-[var(--color-heading)] sm:text-7xl">
          {couple.groomNickname} & {couple.brideNickname}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg font-semibold leading-8 text-[var(--color-text)]">
          {couple.quote}
        </p>
        <div className="mx-auto mt-8 max-w-md rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)]/88 px-7 py-5 shadow-xl shadow-[var(--color-primary)]/10 backdrop-blur">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-[var(--color-accent)]">
            Kepada Yth.
          </p>
          <p className="mt-2 text-2xl font-black text-[var(--color-primary)]">
            {guestName || "Tamu Undangan"}
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpen}
          disabled={isOpening}
          className="mt-9 rounded-2xl bg-[var(--color-primary)] px-8 py-4 text-base font-black text-white shadow-xl shadow-[var(--color-primary)]/20"
        >
          {config.buttonText || "Buka Undangan"}
        </button>
      </motion.div>
    </motion.div>
  );
}

function GiftSection({ accounts = [], designConfig }) {
  if (!accounts.length) {
    return null;
  }

  return (
    <SectionFrame section="gift" designConfig={designConfig} baseClassName="bg-[var(--color-surface)]">
      <div className="relative z-10 mx-auto max-w-5xl">
        <SectionTitle
          eyebrow="Amplop Digital"
          title="Doa restu adalah hadiah terbaik."
          desc="Bagi keluarga dan sahabat yang ingin mengirimkan tanda kasih, rekening tersedia di bawah ini."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {accounts.map((account) => (
            <motion.div
              key={`${account.bank}-${account.number}`}
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
            </motion.div>
          ))}
        </div>
      </div>
    </SectionFrame>
  );
}

export default function UniversalTemplate({
  data = sampleInvitation,
  guestName,
  guestSlug,
}) {
  const musicRef = useRef(null);
  const [isRevealOpen, setIsRevealOpen] = useState(false);
  const invitation = { ...sampleInvitation, ...data };
  const couple = invitation.couple || sampleInvitation.couple;
  const rawEvents = invitation.events?.length ? invitation.events : sampleInvitation.events;
  const events = normalizeEventExamples(rawEvents);
  const story = invitation.story?.length ? invitation.story : sampleInvitation.story;
  const designConfig = getDesignConfig(invitation.templateId, invitation.designConfig);
  const coverConfig = getCoverSectionConfig(designConfig);
  const openingRevealConfig = getOpeningRevealConfig(designConfig);
  const coupleConfig = getCoupleSectionConfig(designConfig);
  const countdownConfig = getCountdownWidgetConfig(designConfig);
  const eventConfig = getEventWidgetConfig(designConfig);
  const galleryConfig = getGalleryWidgetConfig(designConfig);
  const storyConfig = getStoryWidgetConfig(designConfig);
  const activeCountdownClasses = countdownClasses(countdownConfig.variant);
  const activeGalleryClasses = dummyGalleryClasses(galleryConfig.variant);
  const coverBackgroundColor = coverConfig.backgroundColor || "#fbf7ef";
  const coverBackgroundImage =
    coverConfig.backgroundMode === "image" ? coverConfig.backgroundImage : "";
  const dummyGalleryCards = Array.from({ length: 6 }, (_, index) => `Dummy Foto ${index + 1}`);
  const profileImages = [
    "/assets/CoverPasangan.png",
    "/assets/catin_wanita.jpg",
    "/assets/catin_pria.jpg",
  ];

  const startMusic = () => {
    if (!musicRef.current) {
      return;
    }

    const result = musicRef.current.play();
    if (result?.catch) {
      result.catch(() => {});
    }
  };

  const openInvitation = () => {
    setIsRevealOpen(true);

    if (openingRevealConfig.autoPlayMusic) {
      startMusic();
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rawSection = params.get("focusSection");

    if (!rawSection) {
      return;
    }

    const normalizedSection = rawSection === "acara"
      ? "events"
      : rawSection === "countdown"
        ? "home"
        : rawSection;
    const targetElement = document.querySelector(
      `[data-preview-section="${normalizedSection}"]`,
    );

    if (!targetElement) {
      return;
    }

    window.requestAnimationFrame(() => {
      targetElement.scrollIntoView({ block: "start", behavior: "smooth" });
    });
  }, [invitation.templateId]);

  return (
    <main
      className="min-h-screen bg-[var(--color-bg)] text-[var(--color-primary)]"
    >
      <AnimatePresence>
        {!isRevealOpen ? (
          <OpeningRevealOverlay
            config={openingRevealConfig}
            coverConfig={coverConfig}
            couple={couple}
            guestName={guestName}
            onOpen={openInvitation}
          />
        ) : null}
      </AnimatePresence>
      <section
        id="section-home"
        data-preview-section="home"
        className="relative isolate flex min-h-screen items-center justify-center overflow-hidden px-6 py-20 text-center"
        style={{ backgroundColor: coverBackgroundColor }}
      >
        {coverBackgroundImage ? (
          <img
            src={coverBackgroundImage}
            alt=""
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
        ) : null}
        <div className="absolute inset-0 -z-10 bg-[var(--color-bg)]/78" />
        <OrnamentLayer ornaments={getSectionOrnaments(designConfig, "home")} />
        <motion.div
          {...coverMotion(coverConfig.openingAnimation)}
          transition={{ duration: 0.72, ease: "easeOut" }}
          className={`relative z-10 mx-auto max-w-4xl ${
            coverConfig.layout === "split" ? "lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12 lg:text-left" : ""
          }`}
        >
          {coverConfig.photoEnabled && coverConfig.layout !== "minimal" ? (
            <img
              src={profileImages[0]}
              alt={`${couple.groomNickname} dan ${couple.brideNickname}`}
              className="mx-auto mb-8 aspect-[3/4] w-56 rounded-t-full rounded-b-[18px] object-cover shadow-2xl shadow-[var(--color-primary)]/12"
            />
          ) : null}
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[var(--color-accent)]">
              The Wedding Of
            </p>
            <h1 className="mt-5 font-serif text-5xl font-black leading-none text-[var(--color-heading)] sm:text-7xl">
              {couple.groomNickname} & {couple.brideNickname}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg font-semibold leading-8 text-[var(--color-text)]">
              {couple.quote}
            </p>
            {guestName && coverConfig.guestBlockStyle !== "hidden" ? (
              <div className={guestBlockClass(coverConfig.guestBlockStyle)}>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-[var(--color-accent)]">
                  Kepada Yth.
                </p>
                <p className="mt-2 text-2xl font-black text-[var(--color-primary)]">
                  {guestName}
                </p>
              </div>
            ) : null}
            {countdownConfig.enabled ? (
              <div className="mx-auto mt-9 max-w-xl">
                <CountdownTimer
                  event={getCountdownTargetEvent(events, countdownConfig)}
                  completeText={countdownConfig.completeText}
                  containerClassName={activeCountdownClasses.container}
                  itemClassName={activeCountdownClasses.item}
                  valueClassName={activeCountdownClasses.value}
                  labelClassName={activeCountdownClasses.label}
                />
              </div>
            ) : null}
            {invitation.features?.music && invitation.musicUrl ? (
              <button
                type="button"
                onClick={startMusic}
                className="mt-8 rounded-2xl bg-[var(--color-primary)] px-7 py-4 text-base font-black text-white"
              >
                Putar Musik
              </button>
            ) : null}
          </div>
        </motion.div>
      </section>

      <SectionFrame section="couple" designConfig={designConfig} baseClassName="bg-[var(--color-surface)]">
        <div className="relative z-10 mx-auto max-w-6xl">
          <SectionTitle eyebrow="Mempelai" title={`${couple.groomName} & ${couple.brideName}`} />
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {[
              { name: couple.brideName, image: profileImages[1], role: "Mempelai Wanita" },
              { name: couple.groomName, image: profileImages[2], role: "Mempelai Pria" },
            ].map((profile) => (
              <motion.article
                key={profile.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                variants={fadeUp}
                className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-7 text-center shadow-xl shadow-[var(--color-primary)]/8"
              >
                {coupleConfig.photoEnabled ? (
                  <img src={profile.image} alt={profile.name} className={profileImageClass(coupleConfig)} />
                ) : null}
                <h3 className={profileNameClass(coupleConfig)}>{profile.name}</h3>
                {coupleConfig.parentTextEnabled ? (
                  <p className="mt-3 text-base font-semibold text-[var(--color-text)]">
                    {profile.role}
                  </p>
                ) : null}
                {coupleConfig.instagramEnabled ? (
                  <a className="mt-5 inline-flex rounded-2xl bg-[var(--color-accent)] px-5 py-3 text-sm font-black text-[var(--color-primary)]">
                    Instagram
                  </a>
                ) : null}
              </motion.article>
            ))}
          </div>
        </div>
      </SectionFrame>

      <SectionFrame section="events" designConfig={designConfig} baseClassName="bg-[var(--color-bg)]">
        <div className="relative z-10 mx-auto max-w-6xl">
          <SectionTitle eyebrow="Acara" title="Detail hari bahagia" />
          <EventWidget events={events} config={eventConfig} classes={eventClasses(eventConfig.variant)} />
        </div>
      </SectionFrame>

      <SectionFrame section="story" designConfig={designConfig} baseClassName="bg-[var(--color-section-soft)]">
        <div className="relative z-10 mx-auto max-w-6xl">
          <SectionTitle eyebrow="Love Story" title="Cerita kami" />
          <StoryWidget stories={story} config={storyConfig} classes={storyClasses(storyConfig.variant)} />
        </div>
      </SectionFrame>

      <SectionFrame section="gallery" designConfig={designConfig} baseClassName="bg-[var(--color-bg)]">
        <div className="relative z-10 mx-auto max-w-6xl">
          <SectionTitle eyebrow="Gallery" title="Momen bahagia" />
          <div className={activeGalleryClasses.container}>
            {dummyGalleryCards.map((label, index) => (
              <div
                key={label}
                className={`${activeGalleryClasses.item} ${dummyGallerySizeClass(galleryConfig.variant, index)}`}
              >
                <p className="text-lg font-black text-[var(--color-primary)]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionFrame>

      {invitation.features?.gift ? (
        <GiftSection accounts={invitation.bankAccounts} designConfig={designConfig} />
      ) : null}

      {invitation.features?.rsvp ? (
        <SectionFrame
          section="rsvp"
          designConfig={designConfig}
          applySectionStyle={false}
          baseClassName="bg-[var(--color-primary)] text-white"
        >
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--color-accent-soft)]">
              RSVP
            </p>
            <h2 className="mt-3 text-4xl font-black leading-tight text-white sm:text-5xl">
              Konfirmasi kehadiran
            </h2>
            <RSVPForm
              invitationSlug={invitation.slug}
              guestSlug={guestSlug}
              guestName={guestName}
            />
          </div>
        </SectionFrame>
      ) : null}

      {invitation.features?.music && invitation.musicUrl ? (
        <audio ref={musicRef} className="hidden">
          <source src={invitation.musicUrl} />
        </audio>
      ) : null}
    </main>
  );
}
