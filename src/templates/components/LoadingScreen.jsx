"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * LoadingScreen — layar pembuka undangan.
 * - Bar progress indeterminate (bergerak terus) — tidak memakai angka persen
 *   buatan yang bisa terlihat "macet" (mis. diam di 95%) padahal masih nunggu.
 * - Layar hilang setelah cover termuat + durasi minimum; ada jaring pengaman.
 * - Hormati prefers-reduced-motion
 */
function prefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function LoadingScreen({ coverImage, onDone, minDuration = 1400 }) {
  const [hasCoverLoaded, setHasCoverLoaded] = useState(false);
  const reducedMotion = useRef(false);
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone?.();
  };

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    reducedMotion.current = prefersReducedMotion();

    if (reducedMotion.current) {
      const timer = window.setTimeout(finish, 300);
      return () => window.clearTimeout(timer);
    }

    return undefined;
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

  // Durasi minimum sudah lewat — ditandai state terpisah.
  const [minDurationPassed, setMinDurationPassed] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || doneRef.current) return undefined;
    const timer = window.setTimeout(() => setMinDurationPassed(true), minDuration);
    return () => window.clearTimeout(timer);
  }, [minDuration]);

  // Selesai: cover loaded + durasi minimum sudah lewat.
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    if (doneRef.current) return undefined;

    if (hasCoverLoaded && minDurationPassed) {
      finish();
      return undefined;
    }

    // Jaring pengaman: maksimal 8 detik apa pun yang terjadi
    const safetyTimer = window.setTimeout(finish, 8000);
    return () => window.clearTimeout(safetyTimer);
  }, [hasCoverLoaded, minDurationPassed]);

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

      {/* Bar progress indeterminate — tidak mengklaim persentase palsu */}
      <div
        className="mt-5 h-[3px] w-44 overflow-hidden rounded-full bg-[var(--color-accent)]/15"
        role="progressbar"
        aria-label="Memuat"
      >
        <div className="loading-bar-indeterminate h-full rounded-full bg-[var(--color-accent)]" />
      </div>
    </motion.div>
  );
}
