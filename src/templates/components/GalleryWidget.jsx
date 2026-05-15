"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export const defaultGalleryWidgetConfig = {
  enabled: true,
  variant: "grid",
  limit: 6,
  includeCover: false,
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
  const isViewerOpen = viewerIndex !== null;

  return (
    <>
      {isCarousel ? (
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
