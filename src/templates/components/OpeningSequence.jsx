"use client";

import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export const openingSequencePresets = {
  auto: {
    id: "auto",
    label: "Auto",
  },
  simple: {
    id: "simple",
    label: "Simple Reveal",
    duration: 0.58,
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -18 },
    ease: "easeOut",
  },
  "cinematic-soft": {
    id: "cinematic-soft",
    label: "Cinematic Soft",
    duration: 0.78,
    initial: { opacity: 0, y: 28, scale: 0.96, filter: "blur(10px)" },
    animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, y: -26, scale: 0.98, filter: "blur(8px)" },
    ease: [0.16, 1, 0.3, 1],
  },
  "paper-reveal": {
    id: "paper-reveal",
    label: "Paper Reveal",
    duration: 0.68,
    initial: { opacity: 0, y: 16, scale: 0.92, rotateX: 5 },
    animate: { opacity: 1, y: 0, scale: 1, rotateX: 0 },
    exit: { opacity: 0, y: -28, scale: 0.94, rotateX: -4 },
    ease: "easeOut",
  },
  "floral-bloom": {
    id: "floral-bloom",
    label: "Floral Bloom",
    duration: 0.82,
    initial: { opacity: 0, y: 24, scale: 0.94, filter: "blur(8px)" },
    animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, y: -24, scale: 1.03, filter: "blur(8px)" },
    ease: [0.16, 1, 0.3, 1],
    atmosphere: "floral",
  },
  "falling-petals": {
    id: "falling-petals",
    label: "Falling Petals",
    duration: 0.72,
    initial: { opacity: 0, y: 30, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -30, scale: 0.98 },
    ease: "easeOut",
    atmosphere: "petals",
  },
  "royal-gate": {
    id: "royal-gate",
    label: "Royal Gate",
    duration: 0.74,
    initial: { opacity: 0, y: 18, scale: 0.95, filter: "blur(6px)" },
    animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, y: -18, scale: 1.06, filter: "blur(8px)" },
    ease: [0.22, 1, 0.36, 1],
    atmosphere: "royal",
  },
  "wayang-shadow": {
    id: "wayang-shadow",
    label: "Wayang Shadow",
    duration: 0.78,
    initial: { opacity: 0, x: 18, filter: "blur(10px)" },
    animate: { opacity: 1, x: 0, filter: "blur(0px)" },
    exit: { opacity: 0, x: -18, filter: "blur(8px)" },
    ease: [0.16, 1, 0.3, 1],
    atmosphere: "shadow",
  },
};

export function getOpeningSequencePreset(config = {}) {
  const explicitPreset = config.sequencePreset || config.preset;

  if (explicitPreset && explicitPreset !== "auto" && openingSequencePresets[explicitPreset]) {
    return openingSequencePresets[explicitPreset];
  }

  if (config.animation === "paper") {
    return openingSequencePresets["paper-reveal"];
  }

  if (["curtain", "gate", "zoom"].includes(config.animation)) {
    return openingSequencePresets["cinematic-soft"];
  }

  return openingSequencePresets.simple;
}

const atmosphereItems = Array.from({ length: 10 }, (_, index) => index);

function firstImageSequenceFrame(asset = {}) {
  if (Array.isArray(asset.frames) && asset.frames.length > 0) {
    return asset.frames[0];
  }

  return asset.poster || asset.src || "";
}

function parseDataUrlJson(src = "") {
  if (!src.startsWith("data:")) {
    return null;
  }

  const [, payload = ""] = src.split(",");

  try {
    const decoded = src.includes(";base64,")
      ? window.atob(payload)
      : decodeURIComponent(payload);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function LottieOpeningAsset({ asset = {}, isOpening = false, fallbackImage = "", onError }) {
  const [animationData, setAnimationData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadAnimation = async () => {
      if (!asset.src) {
        onError?.();
        return;
      }

      setIsLoading(true);

      try {
        const inlineJson = parseDataUrlJson(asset.src);
        const nextAnimationData = inlineJson || (await fetch(asset.src).then((response) => {
          if (!response.ok) {
            throw new Error("Lottie fetch failed");
          }

          return response.json();
        }));

        if (isMounted) {
          setAnimationData(nextAnimationData);
        }
      } catch {
        if (isMounted) {
          onError?.();
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadAnimation();

    return () => {
      isMounted = false;
    };
  }, [asset.src, onError]);

  if (!animationData) {
    return fallbackImage ? (
      <motion.img
        src={fallbackImage}
        alt=""
        initial={{ opacity: 0 }}
        animate={isOpening ? { opacity: 0 } : { opacity: isLoading ? 0.18 : 0.34 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 z-[1] h-full w-full object-cover"
      />
    ) : null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.02 }}
      animate={isOpening ? { opacity: 0, scale: 1.06 } : { opacity: 0.46, scale: 1 }}
      transition={{ duration: Number(asset.duration || 4), delay: Number(asset.delay || 0), ease: "easeOut" }}
      className="absolute inset-0 z-[1] h-full w-full"
    >
      <Lottie
        animationData={animationData}
        loop={Boolean(asset.loop)}
        autoplay
        className="h-full w-full object-cover"
        rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
      />
    </motion.div>
  );
}

export function OpeningSequenceAsset({ asset = {}, isOpening = false, onSkip }) {
  const shouldReduceMotion = useReducedMotion();
  const [hasError, setHasError] = useState(false);
  const type = asset.type || "motion";
  const poster = asset.poster || "";
  const src = asset.src || "";
  const shouldShowFallback = shouldReduceMotion || hasError;
  const showSkip = Boolean(asset.skippable && onSkip && !isOpening);

  if (type === "motion" || (!src && !poster)) {
    return null;
  }

  const fallbackImage = type === "image-sequence" ? firstImageSequenceFrame(asset) : poster;
  const commonClass = "absolute inset-0 z-[1] h-full w-full object-cover opacity-45";

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
      {type === "video" && src && !shouldShowFallback ? (
        <motion.video
          src={src}
          poster={poster || undefined}
          autoPlay
          muted
          playsInline
          loop={Boolean(asset.loop)}
          preload="metadata"
          onError={() => setHasError(true)}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={isOpening ? { opacity: 0, scale: 1.08 } : { opacity: 0.45, scale: 1 }}
          transition={{ duration: Number(asset.duration || 4), delay: Number(asset.delay || 0), ease: "easeOut" }}
          className={commonClass}
        />
      ) : null}

      {type === "image-sequence" && fallbackImage ? (
        <motion.img
          src={fallbackImage}
          alt=""
          onError={() => setHasError(true)}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={isOpening ? { opacity: 0, scale: 1.08 } : { opacity: shouldReduceMotion ? 0.24 : 0.42, scale: 1 }}
          transition={{ duration: Number(asset.duration || 4), delay: Number(asset.delay || 0), ease: "easeOut" }}
          className={commonClass}
        />
      ) : null}

      {type === "lottie" && src && !shouldShowFallback ? (
        <LottieOpeningAsset
          asset={asset}
          isOpening={isOpening}
          fallbackImage={fallbackImage}
          onError={() => setHasError(true)}
        />
      ) : null}

      {(type === "video" || type === "lottie") && shouldShowFallback && fallbackImage ? (
        <motion.img
          src={fallbackImage}
          alt=""
          initial={{ opacity: 0 }}
          animate={isOpening ? { opacity: 0 } : { opacity: 0.34 }}
          transition={{ duration: 0.3 }}
          className={commonClass}
        />
      ) : null}

      {showSkip ? (
        <button
          type="button"
          onClick={onSkip}
          className="pointer-events-auto absolute right-5 top-5 z-[12] rounded-full border border-white/25 bg-black/35 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-white backdrop-blur transition-colors hover:bg-black/55"
        >
          Skip
        </button>
      ) : null}
    </div>
  );
}

export function OpeningSequenceAtmosphere({ config = {}, isOpening = false }) {
  const shouldReduceMotion = useReducedMotion();
  const preset = getOpeningSequencePreset(config);

  if (shouldReduceMotion || !preset.atmosphere) {
    return null;
  }

  if (preset.atmosphere === "royal") {
    return (
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scaleY: 0.7 }}
          animate={isOpening ? { opacity: 0, scaleY: 1.15 } : { opacity: 0.5, scaleY: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute left-6 top-10 h-[70%] w-px bg-[var(--color-accent)]/60"
        />
        <motion.div
          initial={{ opacity: 0, scaleY: 0.7 }}
          animate={isOpening ? { opacity: 0, scaleY: 1.15 } : { opacity: 0.5, scaleY: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute right-6 top-10 h-[70%] w-px bg-[var(--color-accent)]/60"
        />
      </div>
    );
  }

  if (preset.atmosphere === "shadow") {
    return (
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: -36 }}
          animate={isOpening ? { opacity: 0, x: -80 } : { opacity: 0.22, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute left-[-10%] top-[18%] h-48 w-48 rounded-full bg-[var(--color-primary)] blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, x: 36 }}
          animate={isOpening ? { opacity: 0, x: 80 } : { opacity: 0.18, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute right-[-10%] bottom-[16%] h-56 w-56 rounded-full bg-[var(--color-accent)] blur-3xl"
        />
      </div>
    );
  }

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
      {atmosphereItems.map((item) => {
        const left = 8 + ((item * 11) % 86);
        const delay = item * 0.08;
        const size = preset.atmosphere === "floral" ? 18 + (item % 4) * 7 : 10 + (item % 5) * 5;
        const duration = preset.atmosphere === "floral" ? 1.6 + (item % 3) * 0.2 : 2 + (item % 4) * 0.25;

        return (
          <motion.span
            key={item}
            initial={{ opacity: 0, y: preset.atmosphere === "floral" ? 40 : -40, rotate: 0 }}
            animate={
              isOpening
                ? { opacity: 0, y: -60, rotate: 120 }
                : {
                    opacity: preset.atmosphere === "floral" ? 0.28 : 0.36,
                    y: preset.atmosphere === "floral" ? [24, -12, 14] : [-40, 120],
                    rotate: preset.atmosphere === "floral" ? [0, 16, -10] : [0, 160],
                  }
            }
            transition={{ delay, duration, repeat: isOpening ? 0 : Infinity, repeatType: "mirror", ease: "easeInOut" }}
            className="absolute rounded-full bg-[var(--color-accent)]/70"
            style={{
              left: `${left}%`,
              top: preset.atmosphere === "floral" ? `${18 + (item % 5) * 12}%` : "-8%",
              width: size,
              height: size * (preset.atmosphere === "floral" ? 0.7 : 1.25),
              borderRadius: preset.atmosphere === "floral" ? "999px 999px 999px 4px" : "999px 999px 999px 0",
            }}
          />
        );
      })}
    </div>
  );
}

export default function OpeningSequence({ config = {}, isOpening = false, className = "", children }) {
  const shouldReduceMotion = useReducedMotion();
  const preset = getOpeningSequencePreset(config);
  const safePreset = shouldReduceMotion
    ? {
        ...preset,
        duration: 0.18,
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        ease: "easeOut",
      }
    : preset;

  return (
    <motion.div
      initial={safePreset.initial}
      animate={isOpening ? safePreset.exit : safePreset.animate}
      transition={{ duration: safePreset.duration, ease: safePreset.ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
