"use client";

import { useState } from "react";

// Custom font dropdown that renders each option in its own typeface so the user
// can see the actual font shape before selecting (native <option> can't be
// styled per-font reliably across browsers).
export default function FontPicker({
  value = "",
  options = [],
  onChange,
  sampleText = "Dimas & Salsa",
  placeholder = "Default",
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((font) => font.id === value) || null;

  const choose = (id) => {
    onChange?.(id);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-[var(--dash-border)] bg-white px-3 py-2 text-left outline-none transition-colors hover:border-[var(--color-accent)] focus:border-[var(--color-accent)]"
      >
        <span className="min-w-0 flex-1 truncate">
          <span
            className="block truncate text-base text-[var(--dash-ink)]"
            style={selected ? { fontFamily: selected.family } : undefined}
          >
            {selected ? sampleText : placeholder}
          </span>
          {selected ? (
            <span className="block truncate text-[11px] font-medium text-[var(--dash-muted)]">
              {selected.label} · {selected.vibe}
            </span>
          ) : null}
        </span>
        <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-[var(--dash-muted)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m5 8 5 5 5-5" />
        </svg>
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-label="Tutup pilihan font"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 right-0 z-50 mt-1 max-h-72 overflow-y-auto rounded-xl border border-[var(--dash-border)] bg-white p-1 shadow-xl">
            <button
              type="button"
              onClick={() => choose("")}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-[var(--dash-fog)] ${
                value === "" ? "bg-[var(--dash-fog)]" : ""
              }`}
            >
              <span className="text-[var(--dash-ink)]">{placeholder}</span>
            </button>
            {options.map((font) => (
              <button
                key={font.id}
                type="button"
                onClick={() => choose(font.id)}
                className={`flex w-full flex-col items-start gap-0.5 rounded-lg px-3 py-2 text-left transition-colors hover:bg-[var(--dash-fog)] ${
                  value === font.id ? "bg-[var(--dash-fog)]" : ""
                }`}
              >
                <span
                  className="text-lg leading-tight text-[var(--dash-ink)]"
                  style={{ fontFamily: font.family }}
                >
                  {sampleText}
                </span>
                <span className="text-[11px] font-medium text-[var(--dash-muted)]">
                  {font.label} · {font.vibe}
                </span>
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
