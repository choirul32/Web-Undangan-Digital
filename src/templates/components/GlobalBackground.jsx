"use client";

import React, { useEffect, useRef } from "react";
import { getParallaxSpeed } from "../ornamentModel";

/**
 * GlobalBackground — satu layer background menempel di seluruh halaman.
 * Gambar dari sections.global.backgroundImage, bergerak pelan (parallax)
 * saat scroll. Section-section di atasnya bisa transparan sehingga
 * background ini terlihat menyambung — pola undangan premium.
 *
 * Props:
 * - backgroundImage: URL gambar (kosong = tidak render)
 * - parallax: "none" | "slow" | "medium" | "fast"
 * - overlay: 0-90 (kegelapan overlay biar teks terbaca)
 *
 * Rasio gerak memakai vocabulary ornament yang sama
 * (ornamentModel.getParallaxSpeed): slow 0.12, medium 0.22, fast 0.35.
 * Sengaja TIDAK memakai PARALLAX_SPEEDS mentah (0.15/0.3/0.5) —
 * background full-page bergerak lebih pelan dari ornament agar
 * tidak mabuk di HP entry-level (ADR-0001).
 */
const GLOBAL_PARALLAX_SPEEDS = { none: 0, slow: 0.12, medium: 0.22, fast: 0.35 };

export function getGlobalParallaxSpeed(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (value in GLOBAL_PARALLAX_SPEEDS) {
    return GLOBAL_PARALLAX_SPEEDS[value];
  }
  return getParallaxSpeed(value);
}

export default function GlobalBackground({ backgroundImage, backgroundColor, parallax = "none", overlay = 0 }) {
  const ref = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const el = ref.current;
    if (!el) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return undefined;

    const speed = getGlobalParallaxSpeed(parallax);
    if (!speed) return undefined;

    let ticking = false;
    const update = () => {
      ticking = false;
      // Geser background berdasarkan posisi scroll relatif tinggi halaman
      const offset = window.scrollY * speed;
      el.style.transform = `translate3d(0, ${offset}px, 0)`;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [parallax]);

  if (!backgroundImage) return null;

  const overlayOpacity = Math.min(90, Math.max(0, Number(overlay) || 0)) / 100;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Gambar: lebih tinggi dari viewport supaya parallax tidak bolong */}
      <div
        ref={ref}
        className="absolute inset-0 will-change-transform"
        style={
          parallax && parallax !== "none"
            ? { top: "-15%", height: "130%" }
            : undefined
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={backgroundImage}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
      {overlayOpacity > 0 ? (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity})` }}
        />
      ) : null}
    </div>
  );
}
