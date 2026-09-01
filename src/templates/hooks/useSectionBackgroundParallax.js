"use client";

import { useEffect } from "react";

/**
 * Global scroll listener untuk background parallax section.
 * Mencari semua elemen [data-background-parallax], lalu update
 * --section-bg-offset berdasarkan posisi section relatif viewport.
 * Ringan: pakai rAF throttle + hanya elemen yang punya parallax.
 */
export default function useSectionBackgroundParallax() {
  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return undefined;

    let ticking = false;

    const update = () => {
      ticking = false;
      const viewportHeight = window.innerHeight;
      const sections = document.querySelectorAll("[data-background-parallax]");

      sections.forEach((section) => {
        const speed = Number(section.dataset.backgroundParallax || 0);
        if (!speed) return;

        const rect = section.getBoundingClientRect();
        // Berapa jauh section sudah melewati viewport (0 = di atas, 1 = di bawah)
        const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
        const clamped = Math.max(0, Math.min(1, progress));
        // Offset: dari -speed (saat muncul) ke +speed (saat lewat)
        const offset = (clamped - 0.5) * speed * 2;
        section.style.setProperty("--section-bg-offset", `${offset}px`);
      });
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
  }, []);
}
