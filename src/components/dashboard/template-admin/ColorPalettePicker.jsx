"use client";

import { useEffect, useMemo, useState } from "react";

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
      <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
        Color Palette
      </p>
      <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
        Pilih palette warna. 1 klik apply ke seluruh undangan.
      </p>
      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Cari palette..."
            className="w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-semibold text-[var(--color-primary)] outline-none placeholder:text-[var(--color-text)]/50 focus:border-[var(--color-accent)]"
          />
        </div>
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={safePage <= 1}
            className="rounded-lg border border-[var(--color-accent-pale)] bg-white px-3 py-1.5 text-xs font-black text-[var(--color-primary)] disabled:opacity-40"
          >
            Prev
          </button>
          <p className="min-w-[84px] text-center text-xs font-black text-[var(--color-text)]">
            {safePage} / {totalPages}
          </p>
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={safePage >= totalPages}
            className="rounded-lg border border-[var(--color-accent-pale)] bg-white px-3 py-1.5 text-xs font-black text-[var(--color-primary)] disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {visiblePalettes.map((palette) => (
          <button
            key={palette.id}
            type="button"
            onClick={() => onApplyPalette?.(palette)}
            className={`rounded-xl border-2 p-3 text-left transition-all hover:shadow-md ${
              activePaletteId === palette.id
                ? "border-[var(--color-accent)] shadow-md"
                : "border-[var(--color-accent-pale)]"
            }`}
          >
            <div className="flex gap-1.5">
              <span
                className="h-5 w-5 rounded-full border border-black/10"
                style={{ backgroundColor: palette.colors.primary }}
              />
              <span
                className="h-5 w-5 rounded-full border border-black/10"
                style={{ backgroundColor: palette.colors.accent }}
              />
              <span
                className="h-5 w-5 rounded-full border border-black/10"
                style={{ backgroundColor: palette.colors.bg }}
              />
            </div>
            <p className="mt-2 text-xs font-black text-[var(--color-primary)]">{palette.label}</p>
          </button>
        ))}
      </div>
      {visiblePalettes.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-[var(--color-accent-pale)] bg-white px-4 py-3 text-sm font-semibold text-[var(--color-text)]/70">
          Palette tidak ditemukan.
        </p>
      ) : null}
    </>
  );
}

