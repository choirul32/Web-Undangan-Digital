"use client";

import React, { useId, useRef } from "react";

// ============================================================
// VisualChoiceControl — pilihan visual bergambar (radiogroup)
// menggantikan dropdown abstrak untuk pilihan yang bersifat
// visual (layout, gaya card, bentuk, posisi, animasi).
//
// Props:
//   value      — nilai aktif
//   options    — [{ value, label, description?, preview? }]
//                preview: JSX miniatur (SVG/CSS) atau string warna hex
//   onChange   — (value) => void
//   columns    — jumlah kolom (2 | 3 | 4, default 3)
//   size       — "sm" (padat) | "md" (default)
//   ariaLabel  — label untuk radiogroup
// ============================================================

function isHexColor(value) {
  return typeof value === "string" && /^#[0-9a-f]{3,8}$/i.test(value.trim());
}

export default function VisualChoiceControl({
  value,
  options = [],
  onChange,
  columns = 3,
  size = "md",
  ariaLabel = "Pilih tampilan",
}) {
  const groupId = useId();
  const containerRef = useRef(null);

  const handleKeyDown = (event) => {
    const currentIndex = options.findIndex((option) => option.value === value);
    if (currentIndex < 0) {
      return;
    }

    let nextIndex = -1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % options.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + options.length) % options.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = options.length - 1;
    }

    if (nextIndex < 0) {
      return;
    }

    event.preventDefault();
    const nextOption = options[nextIndex];
    onChange(nextOption.value);

    const nextButton = containerRef.current?.querySelector(
      `[data-choice-value="${CSS.escape(String(nextOption.value))}"]`,
    );
    nextButton?.focus();
  };

  return (
    <div
      ref={containerRef}
      role="radiogroup"
      aria-label={ariaLabel}
      className={`grid gap-1.5 ${columns === 2 ? "grid-cols-2" : columns === 4 ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-3"}`}
      onKeyDown={handleKeyDown}
    >
      {options.map((option) => {
        const isActive = option.value === value;
        const isColor = !option.preview && isHexColor(option.label);
        const buttonId = `${groupId}-${option.value}`;

        return (
          <button
            key={option.value}
            id={buttonId}
            type="button"
            role="radio"
            aria-checked={isActive}
            data-choice-value={option.value}
            onClick={() => onChange(option.value)}
            title={option.description || option.label}
            className={`group relative flex flex-col items-stretch rounded-xl border text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-1 ${
              isActive
                ? "border-[var(--dash-ink)] bg-[var(--dash-fog)] shadow-sm"
                : "border-[var(--dash-border)] bg-white hover:border-[var(--color-accent-pale)] hover:bg-[var(--dash-fog)]/60"
            } ${size === "sm" ? "p-1" : "p-1.5"}`}
          >
            {option.preview ? (
              <span
                aria-hidden="true"
                className={`pointer-events-none flex w-full items-center justify-center overflow-hidden rounded-lg border ${
                  isActive
                    ? "border-[var(--dash-ink)]/20 bg-white"
                    : "border-[var(--dash-border)] bg-white"
                } ${size === "sm" ? "h-9" : "h-10"}`}
              >
                {option.preview}
              </span>
            ) : isColor ? (
              <span
                aria-hidden="true"
                className={`h-8 w-full rounded-lg border border-black/10 ${size === "sm" ? "" : "h-9"}`}
                style={{ backgroundColor: option.label }}
              />
            ) : null}
            <span className={`min-w-0 truncate text-center text-[11px] font-bold leading-tight text-[var(--dash-ink)] ${size === "sm" ? "mt-1 px-0.5" : "mt-1.5 px-0.5"}`}>
              {option.label}
            </span>
            <span
              aria-hidden="true"
              className={`absolute right-1 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border text-[8px] font-black transition-colors ${
                isActive
                  ? "border-[var(--dash-ink)] bg-[var(--dash-ink)] text-white"
                  : "border-[var(--dash-border)] bg-white text-transparent"
              }`}
            >
              ✓
            </span>
          </button>
        );
      })}
    </div>
  );
}
