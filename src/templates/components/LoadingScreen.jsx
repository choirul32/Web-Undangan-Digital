"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * LoadingScreen — progress dekoratif elegan di awal undangan.
 * - Progress naik halus sampai ~85% secara instan (kesan cepat)
 * - Lalu menunggu aset kunci (foto sampul) benar-benar selesai dimuat
 * - Teks "Memuat undangan..." + ornamen halus (garis bergerak)
 * - Hormati prefers-reduced-motion
 */
function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function LoadingScreen({ coverImage, onDone, minDuration = 1400 }) {
  const [progress, setProgress] = useState(0);
  const [hasCoverLoaded, setHasCoverLoaded] = useState(false);
  const reducedMotion = useRef(false);
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone?.();
  };

  // Animasi progress dekoratif — cepat ke 85%, lalu perlahan ke 95%
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    reducedMotion.current = prefersReducedMotion();

    if (reducedMotion.current) {
      setProgress(100);
      const timer = window.setTimeout(finish, 300);
      return () => window.clearTimeout(timer);
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now) => {
      const elapsed = now - start;
      // 0-85% dalam ~700ms (terasa cepat), 85-95% dalam sisa waktu
      let next;
      if (elapsed < 700) {
        next = Math.min(85, (elapsed / 700) * 85);
      } else {
        const slowProgress = Math.min(10, ((elapsed - 700) / 1600) * 10);
        next = 85 + slowProgress;
      }
      setProgress(Math.round(next));
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(raf);
  }, []);

  // Preload cover image — aset kunci yang wajib selesai
  useEffect(() => {
    if (typeof window === "undefined" || !coverImage) {
      setHasCoverLoaded(true);
      return undefined;
    }

    let cancelled = false;
    const img = new window.Image();
    img.onload = () => {
      if (!cancelled) setHasCoverLoaded(true);
    };
    img.onerror = () => {
      if (!cancelled) setHasCoverLoaded(true); // gagal load tidak memblokir
    };
    img.src = coverImage;

    return () => {
      cancelled = true;
    };
  }, [coverImage]);

  // Selesai: progress >= 95 (atau reduced motion) + cover loaded + durasi minimum
  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const minTimer = window.setTimeout(() => {
      if (progress >= 95 && hasCoverLoaded) {
        finish();
      }
    }, minDuration);

    // Jaring pengaman: maksimal 6 detik apa pun yang terjadi
    const safetyTimer = window.setTimeout(finish, 6000);

    return () => {
      window.clearTimeout(minTimer);
      window.clearTimeout(safetyTimer);
    };
  }, [progress, hasCoverLoaded, minDuration]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[var(--color-bg,#fbf7ef)]"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      aria-label="Membuka undangan"
    >
      {/* Animasi amplop membuka — float, flap buka-tutup, surat keluar */}
      <div className="loading-mail-container">
        <div className="loading-envelope-wrapper">
          <div className="loading-envelope-flap" />
          <div className="loading-letter">
            <div className="loading-line loading-line-1" />
            <div className="loading-line loading-line-2" />
            <div className="loading-line loading-line-3" />
          </div>
          <div className="loading-pocket-left" />
          <div className="loading-pocket-right" />
          <div className="loading-pocket-bottom" />
        </div>
      </div>

      <div className="loading-shadow" />

      <p className="mt-6 text-sm font-black uppercase tracking-[0.28em] text-[var(--color-primary)]">
        Membuka Undangan
      </p>
      <p className="mt-1.5 text-xs font-semibold text-[var(--color-primary)]/55">
        {progress}%
      </p>

      {/* Progress bar tipis & elegan */}
      <div className="mt-5 h-[3px] w-44 overflow-hidden rounded-full bg-[var(--color-accent)]/15">
        <motion.div
          className="h-full rounded-full bg-[var(--color-accent)]"
          animate={{ width: `${progress}%` }}
          transition={{ ease: "easeOut", duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
}
