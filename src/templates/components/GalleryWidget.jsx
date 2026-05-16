"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export const defaultGalleryWidgetConfig = {
  enabled: true,
  variant: "grid",
  limit: 6,
  includeCover: false,
  slideshowInterval: 4200,
};

export function getGalleryWidgetConfig(designConfig = {}) {
  return {
    ...defaultGalleryWidgetConfig,
    ...(designConfig.widgets?.gallery || {}),
  };
}

// ===== Fullscreen Viewer with Swipe =====
function FullscreenViewer({ images, activeIndex, onClose, onNavigate }) {
  const [direction, setDirection] = useState(0);
  const touchStart = useRef({ x: 0, y: 0 });
  const touchDelta = useRef(0);
  const isDragging = useRef(false);

  const currentImage = images[activeIndex];
  const total = images.length;

  const goNext = useCallback(() => {
    if (activeIndex < total - 1) {
      setDirection(1);
      onNavigate(activeIndex + 1);
    }
  }, [activeIndex, total, onNavigate]);

  const goPrev = useCallback(() => {
    if (activeIndex > 0) {
      setDirection(-1);
      onNavigate(activeIndex - 1);
    }
  }, [activeIndex, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight" || event.key === "ArrowDown") goNext();
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") goPrev();
    };

    window.addEventListener("keydown", handleKey);
    // Prevent body scroll
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [goNext, goPrev, onClose]);

  // Touch/swipe handlers
  const handleTouchStart = (event) => {
    touchStart.current = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
    isDragging.current = true;
    touchDelta.current = 0;
  };

  const handleTouchMove = (event) => {
    if (!isDragging.current) return;
    touchDelta.current = event.touches[0].clientX - touchStart.current.x;
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    const threshold = 60;

    if (touchDelta.current > threshold) {
      goPrev();
    } else if (touchDelta.current < -threshold) {
      goNext();
    }
    touchDelta.current = 0;
  };

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0, scale: 0.92 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0, scale: 0.92 }),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[200] flex flex-col bg-black/92 backdrop-blur-sm"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <p className="text-sm font-black text-white/80">
          {activeIndex + 1} / {total}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          aria-label="Tutup gallery"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Image area */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.img
            key={`viewer-${activeIndex}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeOut" }}
            src={currentImage}
            alt={`Gallery ${activeIndex + 1}`}
            className="max-h-full max-w-full rounded-lg object-contain"
            draggable={false}
          />
        </AnimatePresence>

        {/* Navigation arrows (desktop) */}
        {activeIndex > 0 ? (
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-4 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/25 md:flex"
            aria-label="Foto sebelumnya"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        ) : null}
        {activeIndex < total - 1 ? (
          <button
            type="button"
            onClick={goNext}
            className="absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/25 md:flex"
            aria-label="Foto selanjutnya"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        ) : null}
      </div>

      {/* Thumbnail strip */}
      {total > 1 ? (
        <div className="flex justify-center gap-2 overflow-x-auto px-5 py-4">
          {images.map((image, index) => (
            <button
              key={`thumb-${index}`}
              type="button"
              onClick={() => {
                setDirection(index > activeIndex ? 1 : -1);
                onNavigate(index);
              }}
              className={`h-12 w-12 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                index === activeIndex
                  ? "border-white shadow-lg shadow-white/20"
                  : "border-transparent opacity-50 hover:opacity-80"
              }`}
            >
              <img src={image} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}

      {/* Swipe hint (mobile) */}
      {total > 1 ? (
        <p className="pb-4 text-center text-xs font-semibold text-white/40 md:hidden">
          Geser untuk navigasi
        </p>
      ) : null}
    </motion.div>
  );
}

// ===== Swipeable Carousel =====
function CarouselGallery({ images, classes, onImageClick }) {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });

  const handleMouseDown = (event) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    dragStart.current = {
      x: event.pageX,
      scrollLeft: scrollRef.current.scrollLeft,
    };
  };

  const handleMouseMove = (event) => {
    if (!isDragging || !scrollRef.current) return;
    event.preventDefault();
    const dx = event.pageX - dragStart.current.x;
    scrollRef.current.scrollLeft = dragStart.current.scrollLeft - dx;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={scrollRef}
      className={`${classes.container || "mt-8 flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"} ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ scrollBehavior: isDragging ? "auto" : "smooth" }}
    >
      {images.map((image, index) => (
        <motion.button
          key={`${image}-${index}`}
          type="button"
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45, delay: index * 0.04 }}
          onClick={() => {
            if (!isDragging) onImageClick(index);
          }}
          className={`${classes.item || "w-64 shrink-0 snap-center"} select-none`}
        >
          <img
            src={image}
            alt={`Gallery ${index + 1}`}
            className={classes.image || "h-full w-full rounded-[8px] object-cover"}
            draggable={false}
          />
        </motion.button>
      ))}
    </div>
  );
}

function CinematicSlideshow({ images, config, onImageClick }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const total = images.length;
  const activeImage = images[activeIndex];
  const intervalMs = Math.max(2500, Number(config.slideshowInterval || 4200));

  const goTo = useCallback(
    (index) => {
      if (!total) return;
      setActiveIndex((index + total) % total);
    },
    [total]
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReduceMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener?.("change", updatePreference);
    return () => mediaQuery.removeEventListener?.("change", updatePreference);
  }, []);

  useEffect(() => {
    if (total <= 1 || isPaused || reduceMotion) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % total);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs, isPaused, reduceMotion, total]);

  return (
    <div
      className="mt-10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative overflow-hidden rounded-[28px] bg-[var(--color-primary)] shadow-2xl shadow-[var(--color-primary)]/18">
        <AnimatePresence mode="wait">
          <motion.button
            key={`${activeImage}-${activeIndex}`}
            type="button"
            initial={reduceMotion ? false : { opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            onClick={() => onImageClick(activeIndex)}
            className="group relative block aspect-[4/5] w-full overflow-hidden text-left sm:aspect-[16/10]"
            aria-label={`Buka foto ${activeIndex + 1}`}
          >
            <img
              src={activeImage}
              alt={`Gallery ${activeIndex + 1}`}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-white/70">
                Gallery Moment
              </p>
              <p className="mt-1 font-serif text-3xl font-black leading-none">
                {String(activeIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </p>
            </div>
          </motion.button>
        </AnimatePresence>

        {total > 1 ? (
          <>
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition hover:bg-white/25"
              aria-label="Foto sebelumnya"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition hover:bg-white/25"
              aria-label="Foto selanjutnya"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        ) : null}
      </div>

      {total > 1 ? (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={`${image}-nav-${index}`}
              type="button"
              onClick={() => goTo(index)}
              className={`h-14 w-14 shrink-0 overflow-hidden rounded-2xl border-2 transition ${
                index === activeIndex
                  ? "border-[var(--color-accent)] opacity-100"
                  : "border-transparent opacity-55 hover:opacity-85"
              }`}
              aria-label={`Pilih foto ${index + 1}`}
            >
              <img src={image} alt="" className="h-full w-full object-cover" draggable={false} />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

// ===== Main Gallery Widget =====
export default function GalleryWidget({
  images = [],
  coverImage,
  config = defaultGalleryWidgetConfig,
  classes = {},
}) {
  const [viewerIndex, setViewerIndex] = useState(null);

  if (!config.enabled) {
    return null;
  }

  const galleryImages = [
    ...(config.includeCover && coverImage ? [coverImage] : []),
    ...images,
  ].slice(0, Number(config.limit || images.length || 6));

  if (!galleryImages.length) {
    return null;
  }

  const isCarousel = config.variant === "carousel";
  const isSlideshow = config.variant === "cinematic-slideshow";
  const isViewerOpen = viewerIndex !== null;

  return (
    <>
      {isSlideshow ? (
        <CinematicSlideshow
          images={galleryImages}
          config={config}
          onImageClick={(index) => setViewerIndex(index)}
        />
      ) : isCarousel ? (
        <CarouselGallery
          images={galleryImages}
          classes={classes}
          onImageClick={(index) => setViewerIndex(index)}
        />
      ) : (
        <div className={classes.container || "mt-8 grid grid-cols-2 gap-3"}>
          {galleryImages.map((image, index) => (
            <motion.button
              key={`${image}-${index}`}
              type="button"
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: index * 0.04 }}
              onClick={() => setViewerIndex(index)}
              className={classes.item || ""}
            >
              <img
                src={image}
                alt={`Gallery ${index + 1}`}
                className={classes.image || "h-full w-full rounded-[8px] object-cover"}
              />
            </motion.button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {isViewerOpen ? (
          <FullscreenViewer
            images={galleryImages}
            activeIndex={viewerIndex}
            onClose={() => setViewerIndex(null)}
            onNavigate={(index) => setViewerIndex(index)}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
