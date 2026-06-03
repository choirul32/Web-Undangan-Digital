import React, { useEffect, useRef } from "react";

export default function OrnamentCanvasPanel({
  activeDesignSection,
  activeOrnaments,
  previewEntranceKey,
  setPreviewEntranceKey,
  validationWarnings,
  templatePreviewSrc,
  previewSnapshot,
}) {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!previewSnapshot || !iframeRef.current?.contentWindow) {
      return;
    }

    iframeRef.current.contentWindow.postMessage(
      {
        type: "nusa-invite:editor-preview-update",
        payload: previewSnapshot,
      },
      window.location.origin,
    );
  }, [previewSnapshot]);

  useEffect(() => {
    if (!iframeRef.current?.contentWindow) {
      return;
    }

    iframeRef.current.contentWindow.postMessage(
      {
        type: "nusa-invite:editor-preview-replay",
      },
      window.location.origin,
    );
  }, [previewEntranceKey]);

  return (
    <div className="space-y-4">
      <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-4 xl:sticky xl:top-24">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-text)]">
                Canvas Preview
              </p>
              <button
                onClick={() => setPreviewEntranceKey((k) => k + 1)}
                className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[var(--color-accent-pale)] bg-white px-2.5 text-xs font-bold text-[var(--color-text)] hover:bg-[var(--color-bg)]"
              >
                <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m7 5 8 5-8 5z" />
                </svg>
                Replay Animasi
              </button>
            </div>
            <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">
              {activeDesignSection} section, {activeOrnaments.length} ornament
            </p>
          </div>
          <span className="rounded-full bg-[var(--color-bg)] px-3 py-1 text-xs font-black text-[var(--color-primary)]">
            430px
          </span>
        </div>
        <div className="mt-4 flex justify-center">
          <div className="relative w-full max-w-[360px]">
            <div className="relative rounded-[34px] border-[3px] border-[var(--color-primary)]/65 bg-[var(--color-primary)]/10 p-1.5 shadow-[0_14px_34px_rgba(15,23,42,0.18)]">
              <div className="absolute left-1/2 top-0 z-20 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-[var(--color-primary)]/70" />
              <div className="relative aspect-[9/16] overflow-hidden rounded-[28px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)]">
                <iframe
                  ref={iframeRef}
                  src={templatePreviewSrc}
                  title={`Ornament ${activeDesignSection} preview`}
                  className="h-full w-full border-0"
                />
                <div className="pointer-events-none absolute inset-0 border border-dashed border-[var(--color-accent)]/45" />
              </div>
              <div className="mx-auto mt-1.5 h-1 w-14 rounded-full bg-[var(--color-primary)]/35" />
            </div>
          </div>
        </div>
      </div>

      {validationWarnings.length > 0 ? (
        <div className="rounded-[8px] border border-[var(--color-accent)] bg-[var(--color-accent)]/10 p-4">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-primary)]">
            Validation Warnings
          </p>
          <ul className="mt-3 space-y-2">
            {validationWarnings.map((warning) => (
              <li key={warning} className="text-sm font-semibold leading-6 text-[var(--color-text)]">
                {warning}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-4">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-text)]">
            Validation
          </p>
          <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">
            Tidak ada warning untuk section ini.
          </p>
        </div>
      )}
    </div>
  );
}
