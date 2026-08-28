"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  getParallaxSpeed,
  isForegroundLayer,
  mirrorSlotMap,
  sizeValue,
  slotClasses,
  slotTransforms,
  STAGGER_STEP,
  TRACK_BASE_DELAY,
  TRACK_COUNT,
} from "../ornamentModel";

function secondsValue(value, fallback) {
  const number = Number(value);
  return `${Number.isFinite(number) ? number : fallback}s`;
}

function animationName(value) {
  if (!value || value === "none") {
    return "none";
  }

  return `ornament-${value}`;
}

function entranceName(value) {
  if (!value || value === "none") {
    return "none";
  }

  return `ornament-entrance-${value}`;
}

function OrnamentImage({ ornament, animation, animationDelay, loopMode = "infinite" }) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Reset state when src changes
  useEffect(() => {
    setHasError(false);
    setIsLoading(true);
  }, [ornament.src]);

  if (hasError || !ornament.src) {
    return (
      <div
        className="flex h-full w-full items-center justify-center rounded-[8px] border border-dashed border-[var(--color-accent)]/35 bg-[var(--color-muted)]/18"
      >
        <span className="text-[10px] font-black uppercase tracking-wider text-[var(--color-text)]/40">
          No Image
        </span>
      </div>
    );
  }

  const iterationCount = loopMode === "infinite" ? "infinite" : "1";

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 animate-pulse rounded-[8px] bg-[var(--color-muted)]/16" />
      )}
      <img
        src={ornament.src}
        alt=""
        className="nusa-ornament-animated block h-full w-full"
        style={{
          objectFit: ornament.objectFit || "contain",
          animationName: animationName(animation),
          animationDuration: secondsValue(ornament.duration, 6),
          animationDelay: secondsValue(animationDelay, 0),
          animationTimingFunction: "ease-in-out",
          animationIterationCount: iterationCount,
          animationFillMode: loopMode !== "infinite" ? "forwards" : undefined,
        }}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </>
  );
}

// Wrapper for once-hide: shows ornament, then applies exit animation after visibleDuration
function OnceHideWrapper({ children, visibleDuration = 3, exitAnimation = "fade-out", entranceDuration = 0.8, entranceDelay = 0 }) {
  const [exiting, setExiting] = useState(false);
  const totalDelay = (entranceDelay + entranceDuration + visibleDuration) * 1000;

  useEffect(() => {
    const timer = setTimeout(() => setExiting(true), totalDelay);
    return () => clearTimeout(timer);
  }, [totalDelay]);

  return (
    <span
      className="block h-full w-full"
      style={exiting ? {
        animationName: `ornament-exit-${exitAnimation.replace("exit-", "")}`,
        animationDuration: "0.8s",
        animationTimingFunction: "ease-in",
        animationFillMode: "forwards",
      } : undefined}
    >
      {children}
    </span>
  );
}

// Track-based timeline configuration (constants dari ornamentModel)
function useParallax(hasParallaxOrnaments) {
  const containerRef = useRef(null);
  const scrollY = useRef(0);
  const ticking = useRef(false);

  const updateParallax = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Calculate how far the section is scrolled relative to viewport center
    const sectionCenter = rect.top + rect.height / 2;
    const offset = (viewportHeight / 2 - sectionCenter) / viewportHeight;

    // Update CSS custom property on the container
    container.style.setProperty("--parallax-offset", offset.toFixed(4));
    ticking.current = false;
  }, []);

  useEffect(() => {
    if (!hasParallaxOrnaments) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        window.requestAnimationFrame(updateParallax);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial calculation
    updateParallax();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasParallaxOrnaments, updateParallax]);

  return containerRef;
}

export default function OrnamentLayer({ ornaments = [], className = "", pulseSync = false, pulseIntensity = "subtle" }) {
  const visibleOrnaments = useMemo(
    () => ornaments.filter((ornament) => !ornament.hidden && ornament.src),
    [ornaments],
  );

  // Check if any ornament has parallax
  const hasParallaxOrnaments = useMemo(
    () => visibleOrnaments.some((o) => o.parallax && o.parallax !== "none"),
    [visibleOrnaments],
  );

  const containerRef = useParallax(hasParallaxOrnaments);

  // Process ornaments with track-based timeline
  const processedOrnaments = useMemo(() => {
    if (!visibleOrnaments.length) return [];

    // Group ornaments by track
    const trackGroups = {};
    for (let i = 0; i < TRACK_COUNT; i++) {
      trackGroups[i] = [];
    }
    
    visibleOrnaments.forEach((ornament, index) => {
      const track = ornament.timelineTrack ?? 0;
      trackGroups[track].push({ ornament, originalIndex: index });
    });

    // Sort each track by timelinePosition
    Object.keys(trackGroups).forEach((track) => {
      trackGroups[track].sort((a, b) =>
        (a.ornament.timelinePosition ?? 0) - (b.ornament.timelinePosition ?? 0)
      );
    });

    // Calculate entrance delay based on track and position
    return visibleOrnaments.map((ornament, index) => {
      const track = ornament.timelineTrack ?? 0;
      const position = ornament.timelinePosition ?? 0;
      
      // Find index within track
      const trackIndex = trackGroups[track].findIndex(
        (item) => item.originalIndex === index
      );
      
      // Calculate delay: track offset + position offset + stagger within track
      const trackDelay = track * TRACK_BASE_DELAY;
      const positionDelay = position;
      const staggerDelay = trackIndex * STAGGER_STEP;
      
      const timelineEntranceDelay = Math.max(0, trackDelay + positionDelay + staggerDelay);
      
      return {
        ...ornament,
        _timelineEntranceDelay: timelineEntranceDelay,
        _track: track,
        _position: position,
      };
    });
  }, [visibleOrnaments]);

  if (!visibleOrnaments.length) {
    return null;
  }

  // Split ornaments so non-negative zIndex can render above the content layer.
  const backgroundOrnaments = processedOrnaments.filter((o) => !isForegroundLayer(o.zIndex));
  const foregroundOrnaments = processedOrnaments.filter((o) => isForegroundLayer(o.zIndex));

  const renderOrnamentList = (list) => list.flatMap((ornament) => {
    const sequence = ornament.sequence || {};
    const slot = ornament.slot || "top-left";
    const flipScale = (ornament.flip || ornament.mirror) ? -1 : 1;
    const anchorTransform = slotTransforms[slot] || "";
    const entrance =
      ornament.entrance && ornament.entrance !== "none"
        ? ornament.entrance
        : sequence.entrance || "none";
    const animation =
      ornament.animation && ornament.animation !== "none"
        ? ornament.animation
        : sequence.animation || "none";
    // Use timeline-aware entrance delay
    const entranceDelay = ornament._timelineEntranceDelay ?? ornament.entranceDelay ?? 0;
    const animationDelay = ornament.delay ?? sequence.animationDelay ?? 0;

    // Parallax config
    const parallaxPreset = ornament.parallax || "none";
    const parallaxSpeed = getParallaxSpeed(parallaxPreset);
    const parallaxDirection = ornament.parallaxDirection || "vertical";
    const hasParallax = parallaxSpeed > 0;

    // Build transform — parallax uses CSS calc with custom property
    const baseTranslate = `translate(${sizeValue(ornament.x) || "0px"}, ${sizeValue(ornament.y) || "0px"})`;
    const parallaxTranslate = hasParallax
      ? parallaxDirection === "horizontal"
        ? `translateX(calc(var(--parallax-offset, 0) * ${parallaxSpeed * 100}px))`
        : `translateY(calc(var(--parallax-offset, 0) * ${parallaxSpeed * 100}px))`
      : "";
    const transform = `${anchorTransform} ${baseTranslate} ${parallaxTranslate} rotate(${ornament.rotate || 0}deg) scaleX(${flipScale})`.trim();

    const sharedStyle = {
      "--ornament-opacity": ornament.opacity ?? 1,
      width: sizeValue(ornament.width),
      height: sizeValue(ornament.height),
      opacity: ornament.opacity ?? 1,
      zIndex: ornament.zIndex ?? 0,
      animationName: entranceName(entrance),
      animationDuration: secondsValue(ornament.entranceDuration, 0.8),
      animationDelay: secondsValue(entranceDelay, 0),
      animationTimingFunction:
        ornament.easing || (entrance === "pop-up" ? "cubic-bezier(.2,.8,.2,1)" : "ease-out"),
      animationFillMode: "both",
      transition: hasParallax ? "transform 0.1s linear" : undefined,
    };

    const loopMode = ornament.loopMode || "infinite";
    const visibleDuration = ornament.visibleDuration ?? 3;
    const exitAnimation = ornament.exitAnimation || "fade-out";

    const imageElement = (
      <OrnamentImage
        key={`${ornament.id}-${ornament.src}`}
        ornament={ornament}
        animation={animation}
        animationDelay={animationDelay}
        loopMode={loopMode}
      />
    );

    const elements = [
      <span
        key={ornament.id}
        className={`absolute nusa-ornament-entrance ${slotClasses[slot] || slotClasses["top-left"]}${pulseSync ? " ornament-pulse-sync" : ""}${hasParallax ? " will-change-transform" : ""}${loopMode === "once-hide" ? " nusa-ornament-once-hide" : ""}`}
        data-pulse={pulseSync ? pulseIntensity : undefined}
        style={{ ...sharedStyle, transform }}
      >
        {loopMode === "once-hide" ? (
          <OnceHideWrapper
            visibleDuration={visibleDuration}
            exitAnimation={exitAnimation}
            entranceDuration={ornament.entranceDuration ?? 0.8}
            entranceDelay={entranceDelay}
          >
            {imageElement}
          </OnceHideWrapper>
        ) : imageElement}
      </span>,
    ];

    // Mirror duplicate: render a second copy on the opposite horizontal side
    if (ornament.mirrorDuplicate) {
      // Mirror entrance animation (flip horizontal direction)
      const mirrorEntranceMap = {
        "slide-left": "slide-right",
        "slide-right": "slide-left",
      };
      const mirrorEntrance = mirrorEntranceMap[entrance] || entrance;
      const mirrorSlot = mirrorSlotMap[slot] || slot;
      const mirrorAnchorTransform = slotTransforms[mirrorSlot] || "";
      // Flip X position and scaleX for the duplicate
      const mirrorX = -(Number(ornament.x) || 0);
      const mirrorBaseTranslate = `translate(${sizeValue(mirrorX) || "0px"}, ${sizeValue(ornament.y) || "0px"})`;
      const mirrorParallaxTranslate = hasParallax
        ? parallaxDirection === "horizontal"
          ? `translateX(calc(var(--parallax-offset, 0) * ${parallaxSpeed * -100}px))`
          : `translateY(calc(var(--parallax-offset, 0) * ${parallaxSpeed * 100}px))`
        : "";
      const mirrorTransform = `${mirrorAnchorTransform} ${mirrorBaseTranslate} ${mirrorParallaxTranslate} rotate(${-(ornament.rotate || 0)}deg) scaleX(${-flipScale})`.trim();
      const mirrorStyle = {
        ...sharedStyle,
        animationName: entranceName(mirrorEntrance),
        transform: mirrorTransform,
      };

      elements.push(
        <span
          key={`${ornament.id}-mirror`}
          className={`absolute nusa-ornament-entrance ${slotClasses[mirrorSlot] || slotClasses["top-right"]}${pulseSync ? " ornament-pulse-sync" : ""}${hasParallax ? " will-change-transform" : ""}${loopMode === "once-hide" ? " nusa-ornament-once-hide" : ""}`}
          data-pulse={pulseSync ? pulseIntensity : undefined}
          style={mirrorStyle}
        >
          {loopMode === "once-hide" ? (
            <OnceHideWrapper
              visibleDuration={visibleDuration}
              exitAnimation={exitAnimation}
              entranceDuration={ornament.entranceDuration ?? 0.8}
              entranceDelay={entranceDelay}
            >
              <OrnamentImage
                key={`${ornament.id}-mirror-${ornament.src}`}
                ornament={ornament}
                animation={animation}
                animationDelay={animationDelay}
                loopMode={loopMode}
              />
            </OnceHideWrapper>
          ) : (
            <OrnamentImage
              key={`${ornament.id}-mirror-${ornament.src}`}
              ornament={ornament}
              animation={animation}
              animationDelay={animationDelay}
              loopMode={loopMode}
            />
          )}
        </span>,
      );
    }

    return elements;
  });

  return (
    <div ref={containerRef} className={`pointer-events-none absolute inset-0 ${className}`}>
      <div className="absolute inset-0 z-[5] overflow-hidden">
        <style>{`
        @keyframes ornament-fade {
          0%, 100% { opacity: var(--ornament-opacity); }
          50% { opacity: calc(var(--ornament-opacity) * 0.46); }
        }
        @keyframes ornament-float {
          0%, 100% { translate: 0 0; }
          50% { translate: 0 -8px; }
        }
        @keyframes ornament-sway {
          0%, 100% { rotate: 0deg; }
          50% { rotate: 4deg; }
        }
        @keyframes ornament-pulse {
          0%, 100% { scale: 1; }
          50% { scale: 1.045; }
        }
        @keyframes ornament-slow-rotate {
          from { rotate: 0deg; }
          to { rotate: 360deg; }
        }
        @keyframes ornament-entrance-fade-in {
          from { opacity: 0; }
          to { opacity: var(--ornament-opacity); }
        }
        @keyframes ornament-entrance-fade-up {
          from { opacity: 0; translate: 0 18px; }
          to { opacity: var(--ornament-opacity); translate: 0 0; }
        }
        @keyframes ornament-entrance-zoom-in {
          from { opacity: 0; scale: 0.88; }
          to { opacity: var(--ornament-opacity); scale: 1; }
        }
        @keyframes ornament-entrance-pop-up {
          0% { opacity: 0; scale: 0.7; }
          72% { opacity: var(--ornament-opacity); scale: 1.08; }
          100% { opacity: var(--ornament-opacity); scale: 1; }
        }
        @keyframes ornament-entrance-slide-left {
          from { opacity: 0; translate: 24px 0; }
          to { opacity: var(--ornament-opacity); translate: 0 0; }
        }
        @keyframes ornament-entrance-slide-right {
          from { opacity: 0; translate: -24px 0; }
          to { opacity: var(--ornament-opacity); translate: 0 0; }
        }
        @keyframes ornament-entrance-drop-in {
          from { opacity: 0; translate: 0 -28px; }
          to { opacity: var(--ornament-opacity); translate: 0 0; }
        }
        @keyframes ornament-exit-fade-out {
          from { opacity: var(--ornament-opacity); }
          to { opacity: 0; }
        }
        @keyframes ornament-exit-zoom-out {
          from { opacity: var(--ornament-opacity); scale: 1; }
          to { opacity: 0; scale: 0.8; }
        }
        @keyframes ornament-exit-slide-left {
          from { opacity: var(--ornament-opacity); translate: 0 0; }
          to { opacity: 0; translate: -24px 0; }
        }
        @keyframes ornament-exit-slide-down {
          from { opacity: var(--ornament-opacity); translate: 0 0; }
          to { opacity: 0; translate: 0 24px; }
        }
        @keyframes ornament-exit-scale-down {
          from { opacity: var(--ornament-opacity); scale: 1; }
          to { opacity: 0; scale: 0.5; }
        }
        @media (prefers-reduced-motion: reduce) {
          .nusa-ornament-animated,
          .nusa-ornament-entrance {
            animation: none !important;
          }
          .will-change-transform {
            will-change: auto !important;
            transition: none !important;
          }
        }
      `}</style>
        {renderOrnamentList(backgroundOrnaments)}
      </div>
      {foregroundOrnaments.length > 0 ? (
        <div className="absolute inset-0 z-[20] overflow-hidden">
          {renderOrnamentList(foregroundOrnaments)}
        </div>
      ) : null}
    </div>
  );
}
