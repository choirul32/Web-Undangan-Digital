"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Get music widget config from designConfig
 */
export function getMusicWidgetConfig(designConfig = {}) {
  const widgets = designConfig?.widgets || {};
  return {
    enabled: true,
    variant: "floating", // floating | bar | minimal
    position: "bottom-right", // bottom-right | bottom-left | top-right | top-left
    showTrackInfo: true,
    showProgress: true,
    pulseSync: false, // ornament pulse sync
    pulseIntensity: "subtle", // subtle | medium | strong
    autoLoop: true,
    ...widgets.music,
  };
}

// CSS class for ornament pulse sync (applied to body when music is playing)
const PULSE_SYNC_CLASS = "music-pulse-active";

function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function formatTime(seconds) {
  if (!seconds || !Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function PlayerIcon({ isPlaying, variant }) {
  if (isPlaying) {
    // Animated equalizer bars
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
        <rect x="4" y="10" width="3" height="10" rx="1.5">
          <animate attributeName="height" values="10;16;10" dur="0.8s" repeatCount="indefinite" />
          <animate attributeName="y" values="10;7;10" dur="0.8s" repeatCount="indefinite" />
        </rect>
        <rect x="10.5" y="6" width="3" height="14" rx="1.5">
          <animate attributeName="height" values="14;8;14" dur="0.6s" repeatCount="indefinite" />
          <animate attributeName="y" values="6;10;6" dur="0.6s" repeatCount="indefinite" />
        </rect>
        <rect x="17" y="8" width="3" height="12" rx="1.5">
          <animate attributeName="height" values="12;18;12" dur="0.7s" repeatCount="indefinite" />
          <animate attributeName="y" values="8;4;8" dur="0.7s" repeatCount="indefinite" />
        </rect>
      </svg>
    );
  }

  // Play icon
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M8 5.14v14l11-7-11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
    </svg>
  );
}

/**
 * Floating Music Player - polished, minimal, premium feel
 */
export default function MusicPlayer({
  musicUrl,
  musicTitle = "Wedding Music",
  audioRef,
  config = {},
  onPlayStateChange,
}) {
  const internalRef = useRef(null);
  const ref = audioRef || internalRef;
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const progressInterval = useRef(null);

  const musicConfig = {
    variant: "floating",
    position: "bottom-right",
    showTrackInfo: true,
    showProgress: true,
    pulseSync: false,
    pulseIntensity: "subtle",
    autoLoop: true,
    ...config,
  };

  const audioSrc = musicUrl || "/assets/musics/Muara reff.mp3";

  const togglePlay = useCallback(() => {
    if (!ref.current) return;

    if (isPlaying) {
      ref.current.pause();
    } else {
      const result = ref.current.play();
      if (result?.catch) {
        result.catch(() => {});
      }
    }
  }, [isPlaying, ref]);

  useEffect(() => {
    const audio = ref.current;
    if (!audio) return;

    const handlePlay = () => {
      setIsPlaying(true);
      onPlayStateChange?.(true);
      if (musicConfig.pulseSync && !prefersReducedMotion()) {
        document.documentElement.classList.add(PULSE_SYNC_CLASS);
      }
    };

    const handlePause = () => {
      setIsPlaying(false);
      onPlayStateChange?.(false);
      document.documentElement.classList.remove(PULSE_SYNC_CLASS);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onPlayStateChange?.(false);
      document.documentElement.classList.remove(PULSE_SYNC_CLASS);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);

    // Set loop
    audio.loop = musicConfig.autoLoop;

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      document.documentElement.classList.remove(PULSE_SYNC_CLASS);
    };
  }, [ref, musicConfig.pulseSync, musicConfig.autoLoop, onPlayStateChange]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Don't render if explicitly disabled
  if (musicConfig.enabled === false) {
    return null;
  }

  const positionClass = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-24 right-6",
    "top-left": "top-24 left-6",
  }[musicConfig.position] || "bottom-6 right-6";

  if (musicConfig.variant === "minimal") {
    return (
      <>
        <audio ref={ref} preload="metadata">
          <source src={audioSrc} />
        </audio>
        <motion.button
          type="button"
          onClick={togglePlay}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 20 }}
          className={`template-music-player fixed ${positionClass} z-[100] flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-accent-pale)] bg-[var(--color-surface)]/95 text-[var(--color-primary)] shadow-xl shadow-[var(--color-primary)]/15 backdrop-blur-md transition-colors hover:bg-[var(--color-accent)] hover:text-[var(--color-primary)]`}
          aria-label={isPlaying ? "Pause musik" : "Putar musik"}
        >
          {isPlaying ? <PauseIcon /> : <PlayerIcon isPlaying={false} />}
          {isPlaying ? (
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-[var(--color-accent)]"
              animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          ) : null}
        </motion.button>
      </>
    );
  }

  if (musicConfig.variant === "bar") {
    return (
      <>
        <audio ref={ref} preload="metadata">
          <source src={audioSrc} />
        </audio>
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 200, damping: 24 }}
          className="fixed bottom-0 left-0 right-0 z-[100] border-t border-[var(--color-accent-pale)] bg-[var(--color-surface)]/95 px-5 py-3 backdrop-blur-xl"
        >
          {musicConfig.showProgress ? (
            <div className="absolute left-0 right-0 top-0 h-[3px] bg-[var(--color-accent-pale)]">
              <motion.div
                className="h-full bg-[var(--color-accent)]"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          ) : null}
          <div className="mx-auto flex max-w-3xl items-center gap-4">
            <button
              type="button"
              onClick={togglePlay}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white transition-colors hover:bg-[var(--color-primary-hover)]"
              aria-label={isPlaying ? "Pause musik" : "Putar musik"}
            >
              {isPlaying ? <PauseIcon /> : <PlayerIcon isPlaying={false} />}
            </button>
            {musicConfig.showTrackInfo ? (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black text-[var(--color-primary)]">
                  {musicTitle}
                </p>
                <p className="text-xs font-semibold text-[var(--color-text)]">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </p>
              </div>
            ) : null}
            {isPlaying ? (
              <div className="shrink-0 text-[var(--color-accent)]">
                <PlayerIcon isPlaying={true} />
              </div>
            ) : null}
          </div>
        </motion.div>
      </>
    );
  }

  // Default: floating variant
  return (
    <>
      <audio ref={ref} preload="metadata">
        <source src={audioSrc} />
      </audio>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 20 }}
        className={`template-music-player fixed ${positionClass} z-[100]`}
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="expanded"
              initial={{ width: 48, opacity: 0.8 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 48, opacity: 0.8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex items-center gap-3 rounded-full border border-[var(--color-accent-pale)] bg-[var(--color-surface)]/95 py-2 pl-2 pr-5 shadow-xl shadow-[var(--color-primary)]/15 backdrop-blur-xl"
            >
              <button
                type="button"
                onClick={togglePlay}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white transition-colors hover:bg-[var(--color-primary-hover)]"
                aria-label={isPlaying ? "Pause musik" : "Putar musik"}
              >
                {isPlaying ? <PauseIcon /> : <PlayerIcon isPlaying={false} />}
              </button>
              <div className="min-w-0">
                {musicConfig.showTrackInfo ? (
                  <p className="max-w-[140px] truncate text-xs font-black text-[var(--color-primary)]">
                    {musicTitle}
                  </p>
                ) : null}
                {musicConfig.showProgress ? (
                  <div className="mt-1.5 h-1 w-28 overflow-hidden rounded-full bg-[var(--color-accent-pale)]">
                    <div
                      className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                ) : null}
                {musicConfig.showTrackInfo ? (
                  <p className="mt-1 text-[10px] font-semibold text-[var(--color-text)]">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="ml-1 text-[var(--color-text)] hover:text-[var(--color-primary)]"
                aria-label="Tutup player"
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="collapsed"
              type="button"
              onClick={() => setIsExpanded(true)}
              className="relative flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-accent-pale)] bg-[var(--color-surface)]/95 text-[var(--color-primary)] shadow-xl shadow-[var(--color-primary)]/15 backdrop-blur-xl transition-colors hover:bg-[var(--color-accent)] hover:text-[var(--color-primary)]"
              aria-label="Buka music player"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              <PlayerIcon isPlaying={isPlaying} variant={musicConfig.variant} />
              {isPlaying ? (
                <motion.span
                  className="absolute inset-0 rounded-full border-2 border-[var(--color-accent)]"
                  animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                />
              ) : null}
              {musicConfig.showProgress && duration > 0 ? (
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48">
                  <circle
                    cx="24"
                    cy="24"
                    r="22"
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth="2"
                    strokeDasharray={`${(progress / 100) * 138.2} 138.2`}
                    strokeLinecap="round"
                    opacity="0.7"
                  />
                </svg>
              ) : null}
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
