"use client";

import { useEffect, useMemo, useState } from "react";
import { readableTextColor } from "../../../lib/colorUtils";

function PalettePreviewCard({ palette, active, onApply, onDelete }) {
  const colors = palette.colors || {};
  const primary = colors.primary || "#111827";
  const accent = colors.accent || "#d2a84d";
  const text = colors.text || "#374151";
  const bg = colors.bg || "#fbf7ef";
  const surface = colors.surface || "#ffffff";
  const accentText = readableTextColor(accent);
  const isCustom = palette.source === "custom";

  return (
    <div
      className={`group relative overflow-hidden rounded-[14px] border-2 bg-white text-left transition-all ${
        active
          ? "border-[var(--color-accent)] shadow-md ring-2 ring-[var(--color-accent)]/20"
          : "border-[var(--dash-border)] hover:-translate-y-0.5 hover:shadow-md"
      }`}
    >
      {isCustom ? (
        <button
          type="button"
          onClick={() => onDelete?.(palette)}
          title="Hapus palet custom"
          aria-label={`Hapus palet ${palette.label}`}
          className="absolute right-2 top-2 z-10 rounded-full bg-black/45 p-1.5 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
        >
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l8 8M14 6l-8 8" strokeLinecap="round" />
          </svg>
        </button>
      ) : null}
      <button
        type="button"
        onClick={() => onApply?.(palette)}
        className="block w-full text-left"
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
                {isCustom ? " · Custom" : ""}
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
    </div>
  );
}

export default function ColorPalettePicker({
  palettes = [],
  activePaletteId = "",
  onApplyPalette,
  onGeneratePalette,
  onDeletePalette,
  isGenerating = false,
  generateError = "",
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [aiPrompt, setAiPrompt] = useState("");
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

  const submitGenerate = async () => {
    const trimmed = aiPrompt.trim();
    if (!trimmed || isGenerating) return;
    await onGeneratePalette?.(trimmed);
    setAiPrompt("");
  };

  return (
    <>
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--dash-muted)]">
        Palet Warna
      </p>
      <p className="mt-1 text-base font-semibold text-[var(--dash-ink)]">
        Pilih palet warna. Preview mini menunjukkan efek warna ke background, judul, teks, dan tombol.
      </p>

      {/* Generate palet dengan AI */}
      <div className="mt-4 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-fog)]/40 p-3">
        <p className="text-xs font-black uppercase tracking-[0.08em] text-[var(--dash-muted)]">
          Buat palet dengan AI
        </p>
        <p className="mt-1 text-xs font-semibold text-[var(--dash-muted)]">
          Deskripsikan nuansa/tema, AI akan membuat palet lalu menyimpannya ke daftar.
        </p>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            value={aiPrompt}
            onChange={(event) => setAiPrompt(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") submitGenerate();
            }}
            placeholder="Contoh: nuansa Jawa wayang emas-hitam elegan"
            className="w-full flex-1 rounded-lg border border-[var(--dash-border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--dash-ink)] outline-none placeholder:text-[var(--dash-subtle)] focus:border-[var(--color-accent)]"
          />
          <button
            type="button"
            onClick={submitGenerate}
            disabled={isGenerating || !aiPrompt.trim()}
            className="rounded-lg bg-[var(--dash-ink)] px-4 py-2 text-sm font-black text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isGenerating ? "Membuat..." : "Generate Palet"}
          </button>
        </div>
        {generateError ? (
          <p className="mt-2 text-xs font-bold text-red-600">{generateError}</p>
        ) : null}
      </div>

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
            onDelete={onDeletePalette}
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
