import React from "react";
import {
  DashboardButton,
  Field,
  SelectInput,
  TextInput,
} from "../FormControls";

export default function OrnamentLayerPanel({
  activeDesignSection,
  setActiveDesignSection,
  setSelectedOrnamentIndex,
  designSectionNames,
  ornamentSearchQuery,
  setOrnamentSearchQuery,
  addOrnament,
  activeOrnaments,
  selectedOrnamentIndex,
  updateOrnamentAtIndex,
  duplicateOrnamentAtIndex,
  removeOrnamentAtIndex,
  reorderSelectedOrnament,
}) {
  return (
    <div className="overflow-hidden rounded-[14px] border border-[var(--dash-border)] bg-white shadow-[var(--dash-shadow)] xl:sticky xl:top-4 xl:flex xl:max-h-[calc(100vh-6.5rem)] xl:flex-col">
      <div className="flex items-center justify-between border-b border-[var(--dash-border)] px-3 py-2.5">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 text-[var(--color-text)]/70" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="4" y="4" width="12" height="3" rx="1" />
            <rect x="4" y="8.5" width="12" height="3" rx="1" />
            <rect x="4" y="13" width="12" height="3" rx="1" />
          </svg>
          <p className="text-xs font-extrabold text-[var(--dash-ink)]">Layer / Ornamen</p>
        </div>
        <svg viewBox="0 0 20 20" className="h-4 w-4 text-[var(--color-text)]/60" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m6 8 4 4 4-4" />
        </svg>
      </div>
      <div className="space-y-2.5 p-3 xl:min-h-0 xl:overflow-y-auto">
        <Field label="Section">
          <SelectInput
            value={activeDesignSection}
            onChange={(event) => {
              setActiveDesignSection(event.target.value);
              setSelectedOrnamentIndex(0);
            }}
          >
            {designSectionNames.map((sectionName) => (
              <option key={sectionName}>{sectionName}</option>
            ))}
          </SelectInput>
        </Field>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <svg viewBox="0 0 20 20" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text)]/50" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="9" cy="9" r="5.5" />
              <path d="m13 13 4 4" />
            </svg>
            <TextInput
              value={ornamentSearchQuery}
              onChange={(event) => setOrnamentSearchQuery(event.target.value)}
              placeholder="Cari ornamen..."
              className="[&_input]:pl-8"
            />
          </div>
          <DashboardButton type="button" variant="secondary" size="sm" className="h-10 w-10 !p-0">
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 6h12M6 10h8M8 14h4" />
            </svg>
          </DashboardButton>
        </div>

        <DashboardButton
          type="button"
          onClick={addOrnament}
          className="w-full"
        >
          <span className="text-base leading-none">+</span> Tambah Ornamen
        </DashboardButton>

        <div className="max-h-[360px] space-y-1 overflow-auto pr-1 xl:max-h-[calc(100vh-21rem)]">
          {activeOrnaments
            .map((ornament, index) => ({ ornament, index }))
            .filter(({ ornament }) => {
              if (!ornamentSearchQuery.trim()) return true;
              const q = ornamentSearchQuery.toLowerCase();
              return String(ornament.id || "").toLowerCase().includes(q);
            })
            .map(({ ornament, index }) => {
              const isSelected = selectedOrnamentIndex === index;
              const hasImage = Boolean(ornament.src);
              return (
                <div
                  key={ornament.id || index}
                  className={`flex items-center gap-1.5 rounded-md px-1.5 py-1.5 ${isSelected ? "bg-[var(--color-accent)]/10" : "hover:bg-[var(--color-bg)]"}`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedOrnamentIndex(index)}
                    className="flex min-w-0 flex-1 items-center gap-2 rounded-md text-left focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
                  >
                    <span className="inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded border border-[var(--color-accent-pale)] bg-white">
                      {hasImage ? (
                        <img src={ornament.src} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <svg viewBox="0 0 20 20" className="h-4 w-4 text-[var(--color-text)]/40" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <rect x="3.5" y="3.5" width="13" height="13" rx="2" />
                          <path d="m6 13 3-3 2 2 3-3 2 2" />
                        </svg>
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-bold text-[var(--color-text)]">
                        {ornament.id || `Ornamen ${index + 1}`}
                      </span>
                      <span className="block text-[10px] font-medium text-[var(--color-text)]/60">Ornamen</span>
                    </span>
                  </button>
                  <div className="flex items-center gap-1 text-[var(--color-text)]/70">
                    <button
                      type="button"
                      title="Visibility"
                      onClick={() => updateOrnamentAtIndex(index, { hidden: !Boolean(ornament.hidden) })}
                      className="flex h-6 w-6 items-center justify-center rounded hover:bg-black/5"
                    >
                      {ornament.hidden ? (
                        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m3 3 14 14" /><path d="M8.2 5.7A8.4 8.4 0 0 1 10 5c5 0 8 5 8 5a13.5 13.5 0 0 1-3 3.6" /><path d="M12.8 14.3A8.4 8.4 0 0 1 10 15c-5 0-8-5-8-5a13.6 13.6 0 0 1 4-4.2" /></svg>
                      ) : (
                        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="10" cy="10" r="2.7" /><path d="M2 10s3-5 8-5 8 5 8 5-3 5-8 5-8-5-8-5Z" /></svg>
                      )}
                    </button>
                    <button
                      type="button"
                      title="Lock"
                      onClick={() => updateOrnamentAtIndex(index, { locked: !Boolean(ornament.locked) })}
                      className="flex h-6 w-6 items-center justify-center rounded hover:bg-black/5"
                    >
                      <svg viewBox="0 0 20 20" className={`h-4 w-4 ${ornament.locked ? "text-[var(--color-accent)]" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.8">
                        <rect x="5" y="8" width="10" height="8" rx="1.5" />
                        <path d="M7 8V6a3 3 0 0 1 6 0v2" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      title="Duplicate"
                      onClick={(e) => { e.stopPropagation(); duplicateOrnamentAtIndex(index); }}
                      className="flex h-6 w-6 items-center justify-center rounded hover:bg-black/5"
                    >
                      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="7" y="7" width="9" height="9" rx="2" /><rect x="4" y="4" width="9" height="9" rx="2" /></svg>
                    </button>
                    <button
                      type="button"
                      title="Hapus"
                      onClick={(e) => { e.stopPropagation(); removeOrnamentAtIndex(index); }}
                      className="flex h-6 w-6 items-center justify-center rounded text-red-500 hover:bg-red-50"
                    >
                      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 5h14" /><path d="M7 5V3h6v2" /><path d="M6 5l1 11h6l1-11" /><path d="M9 8v6" /><path d="M11 8v6" /></svg>
                    </button>
                  </div>
                </div>
              );
            })}
          {activeOrnaments.length === 0 ? (
            <p className="rounded-lg bg-[var(--color-bg)] px-3 py-2 text-sm font-medium text-[var(--color-text)]/70">
              Belum ada ornament di section ini.
            </p>
          ) : null}
        </div>

        <div className="flex items-center justify-between border-t border-[var(--dash-border)] pt-2">
          <span className="text-xs font-medium text-[var(--color-text)]/60">{activeOrnaments.length} item</span>
          <DashboardButton
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => reorderSelectedOrnament("front")}
          >
            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m6 7 4 4 4-4" /><path d="m6 11 4 4 4-4" /></svg>
            Atur Urutan
          </DashboardButton>
        </div>
      </div>
    </div>
  );
}
