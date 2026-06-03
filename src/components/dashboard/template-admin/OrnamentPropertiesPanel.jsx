import React, { useMemo, useState } from "react";

function MiniInput({ label, value, onChange, type = "text", step }) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-[var(--color-text)]/70">{label}</span>
      <input
        type={type}
        step={step}
        value={value ?? ""}
        onChange={(event) => {
          if (type === "number") {
            const raw = event.target.value;
            onChange(raw === "" ? 0 : Number(raw));
            return;
          }
          onChange(event.target.value);
        }}
        className="mt-1.5 h-10 w-full rounded-lg border border-[var(--color-accent-pale)] bg-white px-3 text-sm font-semibold text-[var(--color-text)] outline-none focus:border-[var(--color-accent)]"
      />
    </label>
  );
}

export default function OrnamentPropertiesPanel({
  selectedOrnament,
  updateOrnament,
  updateSelectedOrnamentFile,
  dynamicOrnamentAssets,
  applyOrnamentAsset,
  ornamentEntranceOptions,
  ornamentLoopModeOptions,
  ornamentExitAnimationOptions,
  ornamentParallaxDirectionOptions,
}) {
  const [showAllAssets, setShowAllAssets] = useState(false);

  if (!selectedOrnament) {
    return (
      <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-6 text-center">
        <p className="text-base font-black text-[var(--color-primary)]">Pilih atau tambah ornament dulu.</p>
      </div>
    );
  }

  const parallaxNumeric = useMemo(() => {
    if (typeof selectedOrnament.parallax === "number") return selectedOrnament.parallax;
    if (selectedOrnament.parallax === "slow") return 0.08;
    if (selectedOrnament.parallax === "medium") return 0.16;
    if (selectedOrnament.parallax === "fast") return 0.24;
    return 0;
  }, [selectedOrnament.parallax]);

  const displayedAssets = showAllAssets
    ? dynamicOrnamentAssets
    : dynamicOrnamentAssets.slice(0, 6);

  return (
    <div className="rounded-[10px] border border-[var(--color-accent-pale)] bg-white p-4">
      <p className="mb-3 text-sm font-black text-[var(--color-text)]">Properti Ornamen</p>

      <div className="grid gap-3 md:grid-cols-[1fr_120px]">
        <label className="block">
          <span className="text-xs font-bold text-[var(--color-text)]/70">ID Ornamen</span>
          <input
            value={selectedOrnament.id || ""}
            onChange={(e) => updateOrnament("id", e.target.value)}
            className="mt-1.5 h-10 w-full rounded-lg border border-[var(--color-accent-pale)] bg-white px-3 text-sm font-semibold text-[var(--color-text)] outline-none focus:border-[var(--color-accent)]"
          />
        </label>
        <div>
          <span className="text-xs font-bold text-[var(--color-text)]/70">Slot Posisi</span>
          <div className="mt-1.5 grid grid-cols-3 gap-1 rounded-lg border border-[var(--color-accent-pale)] p-1">
            {["top-left", "center-top", "top-right", "side-left", "center", "side-right", "bottom-left", "center-bottom", "bottom-right"].map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => updateOrnament("slot", slot)}
                className={`h-6 rounded text-[10px] font-bold ${
                  selectedOrnament.slot === slot
                    ? "bg-[var(--color-accent)] text-white"
                    : "bg-[var(--color-bg)] text-[var(--color-text)]/70"
                }`}
              >
                {slot === "center"
                  ? "C"
                  : slot
                      .split("-")
                      .map((p) => p[0]?.toUpperCase())
                      .join("")}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <MiniInput
          label="Lebar (W)"
          type="number"
          value={parseInt(selectedOrnament.width, 10) || 0}
          onChange={(v) => updateOrnament("width", `${v || 0}px`)}
        />
        <MiniInput
          label="Tinggi (H)"
          type="number"
          value={parseInt(selectedOrnament.height, 10) || 0}
          onChange={(v) => updateOrnament("height", `${v || 0}px`)}
        />
        <MiniInput
          label="Posisi X"
          type="number"
          value={selectedOrnament.x || 0}
          onChange={(v) => updateOrnament("x", v)}
        />
        <MiniInput
          label="Posisi Y"
          type="number"
          value={selectedOrnament.y || 0}
          onChange={(v) => updateOrnament("y", v)}
        />
        <MiniInput
          label="Rotate (°)"
          type="number"
          value={selectedOrnament.rotate || 0}
          onChange={(v) => updateOrnament("rotate", v)}
        />
        <MiniInput
          label="Z-index"
          type="number"
          value={selectedOrnament.zIndex || 1}
          onChange={(v) => updateOrnament("zIndex", v)}
        />
      </div>

      <div className="mt-3">
        <span className="text-xs font-bold text-[var(--color-text)]/70">Opacity (%)</span>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="w-8 text-sm font-bold text-[var(--color-text)]">
            {Math.round((selectedOrnament.opacity ?? 1) * 100)}
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round((selectedOrnament.opacity ?? 1) * 100)}
            onChange={(e) => updateOrnament("opacity", Number(e.target.value) / 100)}
            className="h-1.5 w-full accent-[var(--color-accent)]"
          />
        </div>
      </div>

      <div className="mt-4 border-t border-[var(--color-accent-pale)] pt-4">
        <p className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">Animasi</p>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <label>
            <span className="text-xs font-bold text-[var(--color-text)]/70">Entrance</span>
            <select
              value={selectedOrnament.entrance || "none"}
              onChange={(e) => updateOrnament("entrance", e.target.value)}
              className="mt-1.5 h-10 w-full rounded-lg border border-[var(--color-accent-pale)] bg-white px-3 text-sm font-semibold text-[var(--color-text)]"
            >
              {ornamentEntranceOptions.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="text-xs font-bold text-[var(--color-text)]/70">Loop Mode</span>
            <select
              value={selectedOrnament.loopMode || "infinite"}
              onChange={(e) => updateOrnament("loopMode", e.target.value)}
              className="mt-1.5 h-10 w-full rounded-lg border border-[var(--color-accent-pale)] bg-white px-3 text-sm font-semibold text-[var(--color-text)]"
            >
              {ornamentLoopModeOptions.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="text-xs font-bold text-[var(--color-text)]/70">Exit Animation</span>
            <select
              value={selectedOrnament.exitAnimation || "fade-out"}
              onChange={(e) => updateOrnament("exitAnimation", e.target.value)}
              className="mt-1.5 h-10 w-full rounded-lg border border-[var(--color-accent-pale)] bg-white px-3 text-sm font-semibold text-[var(--color-text)]"
            >
              {ornamentExitAnimationOptions.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>
          <MiniInput
            label="Durasi (s)"
            type="number"
            step="0.1"
            value={selectedOrnament.entranceDuration ?? 0.8}
            onChange={(v) => updateOrnament("entranceDuration", Math.max(0.1, Number(v || 0.1)))}
          />
          <MiniInput
            label="Delay (s)"
            type="number"
            step="0.1"
            value={selectedOrnament.entranceDelay ?? 0}
            onChange={(v) => updateOrnament("entranceDelay", Math.max(0, Number(v || 0)))}
          />
          <label>
            <span className="text-xs font-bold text-[var(--color-text)]/70">Easing</span>
            <select
              value={selectedOrnament.easing || "ease-out"}
              onChange={(e) => updateOrnament("easing", e.target.value)}
              className="mt-1.5 h-10 w-full rounded-lg border border-[var(--color-accent-pale)] bg-white px-3 text-sm font-semibold text-[var(--color-text)]"
            >
              <option value="linear">Linear</option>
              <option value="ease-in-out">Ease In Out</option>
              <option value="ease-out">Ease Out</option>
              <option value="cubic-bezier(.2,.8,.2,1)">Ease Out Cubic</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mt-4 border-t border-[var(--color-accent-pale)] pt-4">
        <p className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">Efek</p>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <label className="flex h-10 items-center justify-between rounded-lg border border-[var(--color-accent-pale)] px-3 text-sm font-semibold text-[var(--color-text)]">
            Flip
            <input
              type="checkbox"
              checked={Boolean(selectedOrnament.flip)}
              onChange={(e) => updateOrnament("flip", e.target.checked)}
            />
          </label>
          <label className="flex h-10 items-center justify-between rounded-lg border border-[var(--color-accent-pale)] px-3 text-sm font-semibold text-[var(--color-text)]">
            Mirror
            <input
              type="checkbox"
              checked={Boolean(selectedOrnament.mirrorDuplicate)}
              onChange={(e) => updateOrnament("mirrorDuplicate", e.target.checked)}
            />
          </label>
          <MiniInput
            label="Parallax Speed"
            type="number"
            step="0.01"
            value={parallaxNumeric}
            onChange={(v) => updateOrnament("parallax", Math.max(0, Number(v || 0)))}
          />
          <label>
            <span className="text-xs font-bold text-[var(--color-text)]/70">Arah</span>
            <select
              value={selectedOrnament.parallaxDirection || "vertical"}
              onChange={(e) => updateOrnament("parallaxDirection", e.target.value)}
              className="mt-1.5 h-10 w-full rounded-lg border border-[var(--color-accent-pale)] bg-white px-3 text-sm font-semibold text-[var(--color-text)]"
            >
              {ornamentParallaxDirectionOptions.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-4 border-t border-[var(--color-accent-pale)] pt-4">
        <p className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">Aset Ornamen</p>
        <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] gap-2">
          <label className="flex min-h-[96px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[var(--color-accent-pale)] bg-[var(--color-bg)] px-3 py-2 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={(event) => updateSelectedOrnamentFile(event.target.files?.[0])}
              className="hidden"
            />
            <span className="text-xs font-bold text-[var(--color-text)]">Drag & drop file di sini</span>
            <span className="mt-1 text-[11px] font-medium text-[var(--color-text)]/65">
              atau klik untuk upload PNG, WEBP, SVG
            </span>
          </label>
          <button
            type="button"
            onClick={() => setShowAllAssets((current) => !current)}
            className="flex min-h-[96px] w-16 flex-col items-center justify-center rounded-lg border border-[var(--color-accent-pale)] bg-white text-[var(--color-text)] hover:bg-[var(--color-bg)]"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="3" width="5.5" height="5.5" rx="1" />
              <rect x="11.5" y="3" width="5.5" height="5.5" rx="1" />
              <rect x="3" y="11.5" width="5.5" height="5.5" rx="1" />
              <rect x="11.5" y="11.5" width="5.5" height="5.5" rx="1" />
            </svg>
            <span className="mt-1 text-[11px] font-bold">{showAllAssets ? "Tutup" : "Lihat"}</span>
            <span className="text-[11px] font-bold">{showAllAssets ? "Ringkas" : "Semua"}</span>
          </button>
        </div>
        {dynamicOrnamentAssets.length > 0 ? (
          <div className="mt-2 flex items-center gap-2 overflow-x-auto pb-1">
            {displayedAssets.map((asset) => (
              <button
                key={asset.storagePath || asset.id}
                type="button"
                onClick={() => applyOrnamentAsset(asset)}
                className="group relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-[var(--color-accent-pale)] bg-white"
              >
                <img src={asset.src} alt="" className="h-full w-full object-cover" />
                <span className="absolute right-1 top-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-black/55 text-[10px] font-black text-white opacity-0 transition-opacity group-hover:opacity-100">
                  ×
                </span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

