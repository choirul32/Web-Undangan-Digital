"use client";

import React from "react";

// ============================================================
// choicePreviews — miniatur visual (SVG/CSS kecil) untuk
// VisualChoiceControl. Dipakai step editor (WidgetsStep,
// GlobalStyleStep, CoverStep) supaya pilihan layout/gaya/posisi
// terlihat langsung tanpa harus membayangkan dari nama.
// ============================================================

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function Frame({ children }) {
  return (
    <svg viewBox="0 0 48 32" className="h-full w-full max-w-[64px] text-[var(--dash-muted)]" aria-hidden="true">
      {children}
    </svg>
  );
}

// ---- Layout cards umum ----
export function previewLayoutCards() {
  return (
    <Frame>
      <rect x="6" y="6" width="16" height="20" rx="2" {...stroke} />
      <rect x="26" y="6" width="16" height="20" rx="2" {...stroke} />
    </Frame>
  );
}

export function previewLayoutMinimal() {
  return (
    <Frame>
      <rect x="10" y="8" width="28" height="4" rx="2" {...stroke} />
      <rect x="10" y="16" width="20" height="4" rx="2" {...stroke} />
      <circle cx="14" cy="26" r="1.6" {...stroke} />
      <circle cx="20" cy="26" r="1.6" {...stroke} />
      <circle cx="26" cy="26" r="1.6" {...stroke} />
    </Frame>
  );
}

export function previewLayoutStacked() {
  return (
    <Frame>
      <rect x="10" y="6" width="28" height="7" rx="2" {...stroke} />
      <rect x="10" y="15" width="28" height="7" rx="2" {...stroke} />
      <rect x="10" y="24" width="28" height="7" rx="2" {...stroke} />
    </Frame>
  );
}

export function previewLayoutTimeline() {
  return (
    <Frame>
      <path d="M14 6v22" {...stroke} />
      <circle cx="14" cy="10" r="2" {...stroke} />
      <rect x="18" y="8.5" width="16" height="3" rx="1.5" {...stroke} />
      <circle cx="14" cy="19" r="2" {...stroke} />
      <rect x="18" y="17.5" width="16" height="3" rx="1.5" {...stroke} />
    </Frame>
  );
}

export function previewLayoutGrid() {
  return (
    <Frame>
      <rect x="6" y="6" width="16" height="10" rx="2" {...stroke} />
      <rect x="26" y="6" width="16" height="10" rx="2" {...stroke} />
      <rect x="6" y="20" width="16" height="10" rx="2" {...stroke} />
      <rect x="26" y="20" width="16" height="10" rx="2" {...stroke} />
    </Frame>
  );
}

export function previewLayoutCarousel() {
  return (
    <Frame>
      <rect x="6" y="8" width="36" height="18" rx="2" {...stroke} />
      <circle cx="14" cy="26" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="24" cy="26" r="1.6" {...stroke} />
      <circle cx="34" cy="26" r="1.6" {...stroke} />
    </Frame>
  );
}

export function previewLayoutMasonry() {
  return (
    <Frame>
      <rect x="6" y="6" width="16" height="20" rx="2" {...stroke} />
      <rect x="26" y="6" width="16" height="9" rx="2" {...stroke} />
      <rect x="26" y="19" width="16" height="7" rx="2" {...stroke} />
    </Frame>
  );
}

export function previewLayoutSlider() {
  return (
    <Frame>
      <rect x="6" y="8" width="36" height="14" rx="2" {...stroke} />
      <path d="M14 18l-4-4 4-4" {...stroke} />
      <path d="M34 18l4-4-4-4" {...stroke} />
    </Frame>
  );
}

export function previewLayoutChat() {
  return (
    <Frame>
      <rect x="6" y="6" width="22" height="8" rx="3" {...stroke} />
      <rect x="20" y="18" width="22" height="8" rx="3" {...stroke} />
    </Frame>
  );
}

export function previewLayoutCircle() {
  return (
    <Frame>
      <circle cx="24" cy="12" r="7" {...stroke} />
      <rect x="12" y="24" width="24" height="4" rx="2" {...stroke} />
    </Frame>
  );
}

export function previewLayoutFlipClock() {
  return (
    <Frame>
      <rect x="8" y="8" width="32" height="16" rx="2" {...stroke} />
      <path d="M24 8v16" {...stroke} />
      <path d="M12 14h8M28 14h8" {...stroke} />
    </Frame>
  );
}

export function previewLayoutRing() {
  return (
    <Frame>
      <circle cx="24" cy="12" r="8" {...stroke} strokeWidth={2.2} />
      <rect x="12" y="24" width="24" height="4" rx="2" {...stroke} />
    </Frame>
  );
}

export function previewLayoutNeon() {
  return (
    <Frame>
      <rect x="8" y="10" width="32" height="12" rx="6" {...stroke} strokeWidth={2.4} />
      <circle cx="18" cy="16" r="2.4" {...stroke} />
    </Frame>
  );
}

export function previewLayoutBar() {
  return (
    <Frame>
      <rect x="6" y="22" width="36" height="6" rx="3" {...stroke} />
      <circle cx="14" cy="25" r="1.8" fill="currentColor" stroke="none" />
      <path d="M20 25h10" {...stroke} />
    </Frame>
  );
}

export function previewLayoutFloating() {
  return (
    <Frame>
      <circle cx="36" cy="10" r="6" {...stroke} />
      <path d="M36 13v2" {...stroke} />
    </Frame>
  );
}

export function previewLayoutForm() {
  return (
    <Frame>
      <rect x="10" y="6" width="28" height="4" rx="2" {...stroke} />
      <rect x="10" y="13" width="28" height="5" rx="2" {...stroke} />
      <rect x="10" y="21" width="18" height="5" rx="2" {...stroke} />
    </Frame>
  );
}

export function previewLayoutCard() {
  return (
    <Frame>
      <rect x="8" y="6" width="32" height="20" rx="3" {...stroke} />
      <rect x="12" y="10" width="12" height="3" rx="1.5" {...stroke} />
      <rect x="12" y="17" width="20" height="3" rx="1.5" {...stroke} />
    </Frame>
  );
}

// ---- Posisi (tombol musik, dst) ----
export function previewPosition(position = "bottom-right") {
  const positions = {
    "bottom-right": { align: "flex-end", justify: "flex-end" },
    "bottom-left": { align: "flex-end", justify: "flex-start" },
    "top-right": { align: "flex-start", justify: "flex-end" },
    "top-left": { align: "flex-start", justify: "flex-start" },
  };
  const style = positions[position] || positions["bottom-right"];

  return (
    <span className="flex h-full w-full items-stretch justify-stretch p-1.5">
      <span
        className="flex flex-1"
        style={{ alignItems: style.align, justifyContent: style.justify }}
      >
        <span className="h-3 w-3 rounded-full bg-[var(--dash-ink)]" />
      </span>
    </span>
  );
}

// ---- Bentuk foto ----
function PhotoShape({ children }) {
  return (
    <svg viewBox="0 0 48 32" className="h-full w-full max-w-[64px] text-[var(--dash-muted)]" aria-hidden="true">
      <rect x="6" y="6" width="36" height="20" rx="3" fill="var(--dash-fog)" stroke="currentColor" strokeWidth="1.4" />
      {children}
    </svg>
  );
}

export function previewPhotoArch() {
  return (
    <PhotoShape>
      <path d="M16 26v-6a8 8 0 0 1 16 0v6Z" fill="var(--dash-ink)" opacity="0.85" />
    </PhotoShape>
  );
}

export function previewPhotoCircle() {
  return (
    <PhotoShape>
      <circle cx="24" cy="15" r="7" fill="var(--dash-ink)" opacity="0.85" />
    </PhotoShape>
  );
}

export function previewPhotoSquare() {
  return (
    <PhotoShape>
      <rect x="17" y="8" width="14" height="14" rx="2" fill="var(--dash-ink)" opacity="0.85" />
    </PhotoShape>
  );
}

// ---- Jarak / spacing ----
function SpacingFrame({ gapClass }) {
  return (
    <svg viewBox="0 0 48 32" className="h-full w-full max-w-[64px] text-[var(--dash-muted)]" aria-hidden="true">
      <rect x="10" y="4" width="28" height="6" rx="1.5" {...stroke} />
      <rect x="10" y={gapClass.y1} width="28" height="6" rx="1.5" {...stroke} />
      <rect x="10" y={gapClass.y2} width="28" height="6" rx="1.5" {...stroke} />
    </svg>
  );
}

export function previewSpacingCompact() {
  return <SpacingFrame gapClass={{ y1: 12, y2: 20 }} />;
}

export function previewSpacingNormal() {
  return <SpacingFrame gapClass={{ y1: 14, y2: 24 }} />;
}

export function previewSpacingRoomy() {
  return <SpacingFrame gapClass={{ y1: 17, y2: 28 }} />;
}

// ---- Gaya sudut card ----
function CornerFrame({ radius }) {
  return (
    <svg viewBox="0 0 48 32" className="h-full w-full max-w-[64px] text-[var(--dash-muted)]" aria-hidden="true">
      <rect x="8" y="6" width="32" height="20" rx={radius} fill="var(--dash-fog)" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function previewCornerRounded() {
  return <CornerFrame radius={5} />;
}

export function previewCornerSharp() {
  return <CornerFrame radius={0} />;
}

export function previewCornerPill() {
  return <CornerFrame radius={10} />;
}

// ---- Animasi masuk ----
function AnimFrame({ children }) {
  return (
    <svg viewBox="0 0 48 32" className="h-full w-full max-w-[64px] text-[var(--dash-muted)]" aria-hidden="true">
      {children}
    </svg>
  );
}

export function previewAnimNone() {
  return (
    <AnimFrame>
      <rect x="10" y="10" width="28" height="12" rx="2" {...stroke} />
    </AnimFrame>
  );
}

export function previewAnimFadeUp() {
  return (
    <AnimFrame>
      <rect x="10" y="10" width="28" height="12" rx="2" opacity="0.35" {...stroke} />
      <rect x="10" y="6" width="28" height="12" rx="2" {...stroke} />
      <path d="M24 22v6" {...stroke} />
      <path d="m20 25 4 3 4-3" {...stroke} />
    </AnimFrame>
  );
}

export function previewAnimZoomIn() {
  return (
    <AnimFrame>
      <rect x="16" y="12" width="16" height="8" rx="2" opacity="0.3" {...stroke} />
      <rect x="10" y="7" width="28" height="18" rx="2" {...stroke} />
    </AnimFrame>
  );
}

export function previewAnimPop() {
  return (
    <AnimFrame>
      <rect x="10" y="7" width="28" height="18" rx="2" {...stroke} />
      <path d="M14 21v4M20 21v4M26 21v4" {...stroke} />
    </AnimFrame>
  );
}

export function previewAnimSlideLeft() {
  return (
    <AnimFrame>
      <rect x="20" y="8" width="20" height="16" rx="2" opacity="0.3" {...stroke} />
      <rect x="6" y="8" width="22" height="16" rx="2" {...stroke} />
      <path d="M14 16H6" {...stroke} />
    </AnimFrame>
  );
}

export function previewAnimSlideRight() {
  return (
    <AnimFrame>
      <rect x="8" y="8" width="20" height="16" rx="2" opacity="0.3" {...stroke} />
      <rect x="20" y="8" width="22" height="16" rx="2" {...stroke} />
      <path d="M28 16h8" {...stroke} />
    </AnimFrame>
  );
}

export function previewAnimFade() {
  return (
    <AnimFrame>
      <rect x="10" y="8" width="28" height="16" rx="2" opacity="0.35" {...stroke} />
      <rect x="10" y="8" width="28" height="16" rx="2" {...stroke} />
    </AnimFrame>
  );
}

// ---- Gaya tanggal cover ----
export function previewDateDot() {
  return (
    <AnimFrame>
      <rect x="10" y="10" width="16" height="12" rx="2" {...stroke} />
      <rect x="30" y="10" width="8" height="12" rx="2" {...stroke} />
      <circle cx="24" cy="16" r="1.6" {...stroke} />
    </AnimFrame>
  );
}

export function previewDateLine() {
  return (
    <AnimFrame>
      <rect x="10" y="10" width="16" height="12" rx="2" {...stroke} />
      <path d="M28 16h12" {...stroke} />
    </AnimFrame>
  );
}

export function previewDateStacked() {
  return (
    <AnimFrame>
      <rect x="10" y="8" width="14" height="4" rx="1.5" {...stroke} />
      <rect x="10" y="14" width="14" height="4" rx="1.5" {...stroke} />
      <rect x="10" y="20" width="14" height="4" rx="1.5" {...stroke} />
    </AnimFrame>
  );
}

export function previewDatePlain() {
  return (
    <AnimFrame>
      <rect x="10" y="13" width="28" height="6" rx="2" {...stroke} />
    </AnimFrame>
  );
}

export function previewDateBadge() {
  return (
    <AnimFrame>
      <rect x="10" y="8" width="28" height="16" rx="4" {...stroke} />
      <rect x="14" y="12" width="20" height="3" rx="1.5" {...stroke} />
      <rect x="14" y="17" width="14" height="3" rx="1.5" {...stroke} />
    </AnimFrame>
  );
}

export function previewDateColumns() {
  return (
    <AnimFrame>
      <rect x="10" y="8" width="12" height="16" rx="2" {...stroke} />
      <rect x="26" y="8" width="12" height="16" rx="2" {...stroke} />
    </AnimFrame>
  );
}

export function previewDateFullDay() {
  return (
    <AnimFrame>
      <rect x="8" y="8" width="32" height="4" rx="1.5" {...stroke} />
      <rect x="8" y="14" width="24" height="4" rx="1.5" {...stroke} />
      <rect x="8" y="20" width="18" height="4" rx="1.5" {...stroke} />
    </AnimFrame>
  );
}

export function previewDateBlock() {
  return (
    <AnimFrame>
      <rect x="10" y="6" width="28" height="20" rx="3" {...stroke} />
      <rect x="14" y="10" width="20" height="3" rx="1.5" {...stroke} />
      <rect x="14" y="15" width="20" height="3" rx="1.5" {...stroke} />
      <rect x="14" y="20" width="12" height="3" rx="1.5" {...stroke} />
    </AnimFrame>
  );
}

// ---- Layout cover ----
export function previewCoverCentered() {
  return (
    <svg viewBox="0 0 48 32" className="h-full w-full max-w-[64px] text-[var(--dash-muted)]" aria-hidden="true">
      <rect x="6" y="6" width="36" height="20" rx="3" fill="var(--dash-fog)" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="24" cy="13" r="5" fill="var(--dash-ink)" opacity="0.85" />
      <rect x="16" y="21" width="16" height="2.5" rx="1.25" fill="var(--dash-ink)" opacity="0.7" />
    </svg>
  );
}

export function previewCoverSplit() {
  return (
    <svg viewBox="0 0 48 32" className="h-full w-full max-w-[64px] text-[var(--dash-muted)]" aria-hidden="true">
      <rect x="6" y="6" width="36" height="20" rx="3" fill="var(--dash-fog)" stroke="currentColor" strokeWidth="1.4" />
      <rect x="10" y="9" width="13" height="14" rx="2" fill="var(--dash-ink)" opacity="0.85" />
      <rect x="26" y="11" width="12" height="2.5" rx="1.25" fill="var(--dash-ink)" opacity="0.7" />
      <rect x="26" y="16" width="9" height="2.5" rx="1.25" fill="var(--dash-ink)" opacity="0.5" />
    </svg>
  );
}

export function previewCoverStacked() {
  return (
    <svg viewBox="0 0 48 32" className="h-full w-full max-w-[64px] text-[var(--dash-muted)]" aria-hidden="true">
      <rect x="6" y="6" width="36" height="20" rx="3" fill="var(--dash-fog)" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="24" cy="11" r="4" fill="var(--dash-ink)" opacity="0.85" />
      <rect x="14" y="17" width="20" height="2.5" rx="1.25" fill="var(--dash-ink)" opacity="0.75" />
      <rect x="18" y="21.5" width="12" height="2.5" rx="1.25" fill="var(--dash-ink)" opacity="0.55" />
    </svg>
  );
}
