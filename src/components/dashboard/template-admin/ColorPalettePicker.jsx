"use client";

import { useEffect, useMemo, useState } from "react";

function hexToRgb(color = "") {
  const normalized = color.replace("#", "").trim();
  if (!/^[0-9a-f]{6}$/i.test(normalized)) {
    return null;
  }

  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function readableTextColor(background = "#ffffff") {
  const rgb = hexToRgb(background);
  if (!rgb) {
    return "#111827";
  }

  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness > 150 ? "#111827" : "#ffffff";
}

function PalettePreviewCard({ palette, active, onApply }) {
  const colors = palette.colors || {};
  const primary = colors.primary || "#111827";
  const accent = colors.accent || "#d2a84d";
  const text = colors.text || "#374151";
  const bg = colors.bg || "#fbf7ef";
  const surface = colors.surface || "#ffffff";
  const accentText = readableTextColor(accent);

  return (
    <button
      type="button"
      onClick={() => onApply?.(palette)}
      className={`overflow-hidden rounded-[14px] border-2 bg-white text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${
        active
          ? "border-[var(--color-accent)] shadow-md ring-2 ring-[var(--color-accent)]/20"
          : "border-[var(--dash-border)]"
      }`}
    >
      <div
        className="p-3"
        style={{
          backgroundColor: bg,
          color: text,
        }}
      >
        <div
          className="rounded-xl border p-3 shadow-sm"
          style={{
            backgroundColor: surface,
            borderColor: `${accent}55`,
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p
                className="text-[10px] font-black uppercase tracking-[0.16em]"
                style={{ color: accent }}
              >
                The Wedding Of
              </p>
              <p
                className="mt-1 font-serif text-xl font-black leading-none"
                style={{ color: primary }}
              >
                Wulan & Irul
              </p>
            </div>
            {active ? (
              <span
                className="rounded-full px-2 py-1 text-[10px] font-black"
                style={{ backgroundColor: accent, color: accentText }}
              >
                Dipakai
              </span>
            ) : null}
          </div>
          <p className="mt-3 text-xs font-semibold leading-5" style={{ color: text }}>
            Contoh teks undangan dan tombol akan mengikuti warna ini.
          </p>
          <span
            className="mt-3 inline-flex rounded-full px-3 py-1.5 text-[11px] font-black"
            style={{ backgroundColor: primary, color: readableTextColor(primary) }}
          >
            Buka Undangan
          </span>
        </div>
      </div>
      <div className="border-t border-[var(--dash-border)] bg-white p-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-black text-[var(--dash-ink)]">{palette.label}</p>
            <p className="mt-1 text-[11px] font-semibold text-[var(--dash-muted)]">
              Primary, accent, background, surface
            </p>
          </div>
          <div className="flex shrink-0 gap-1">
            {[
              ["Primary", primary],
              ["Accent", accent],
              ["Bg", bg],
              ["Surface", surface],
            ].map(([label, color]) => (
              <span
                key={label}
                title={`${label}: ${color}`}
                className="h-5 w-5 rounded-full border border-black/10"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>
    </button>
  );
}

export default function ColorPalettePicker({
  palettes = [],
  activePaletteId = "",
  onApplyPalette,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const filteredPalettes = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();
    if (!keyword) return palettes;
    return palettes.filter((palette) => {
      const haystack = `${palette.id} ${palette.label}`.toLowerCase();
      return haystack.includes(keyword);
    });
  }, [palettes, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredPalettes.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const visiblePalettes = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredPalettes.slice(start, start + pageSize);
  }, [filteredPalettes, safePage]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  return (
    <>
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--dash-muted)]">
        Palet Warna
      </p>
      <p className="mt-1 text-base font-semibold text-[var(--dash-ink)]">
        Pilih palet warna. Preview mini menunjukkan efek warna ke background, judul, teks, dan tombol.
      </p>
      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Cari palet..."
            className="w-full rounded-xl border border-[var(--dash-border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--dash-ink)] outline-none placeholder:text-[var(--dash-subtle)] focus:border-[var(--color-accent)]"
          />
        </div>
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={safePage <= 1}
            className="rounded-lg border border-[var(--dash-border)] bg-white px-3 py-1.5 text-xs font-black text-[var(--dash-ink)] disabled:opacity-40"
          >
            Sebelumnya
          </button>
          <p className="min-w-[84px] text-center text-xs font-black text-[var(--dash-muted)]">
            {safePage} / {totalPages}
          </p>
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={safePage >= totalPages}
            className="rounded-lg border border-[var(--dash-border)] bg-white px-3 py-1.5 text-xs font-black text-[var(--dash-ink)] disabled:opacity-40"
          >
            Berikutnya
          </button>
        </div>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visiblePalettes.map((palette) => (
          <PalettePreviewCard
            key={palette.id}
            palette={palette}
            active={activePaletteId === palette.id}
            onApply={onApplyPalette}
          />
        ))}
      </div>
      {visiblePalettes.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-[var(--dash-border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--dash-muted)]">
          Palet tidak ditemukan.
        </p>
      ) : null}
    </>
  );
}
