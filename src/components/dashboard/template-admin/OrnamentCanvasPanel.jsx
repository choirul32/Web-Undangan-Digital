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
  const postPreviewSnapshot = () => {
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
  };

  useEffect(() => {
    postPreviewSnapshot();
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

  const keepPageScroll = (action) => {
    const scrollPosition = { x: window.scrollX, y: window.scrollY };
    const activeElement = document.activeElement;
    action();
    if (activeElement instanceof HTMLElement) {
      activeElement.blur();
    }
    const restoreScroll = () => window.scrollTo(scrollPosition.x, scrollPosition.y);
    window.requestAnimationFrame(() => {
      restoreScroll();
      window.requestAnimationFrame(restoreScroll);
    });
    window.setTimeout(restoreScroll, 80);
  };

  const handleReplay = (event) => {
    event.preventDefault();
    event.currentTarget.blur();
    keepPageScroll(() => setPreviewEntranceKey((k) => k + 1));
  };

  return (
    <div className="space-y-3 xl:sticky xl:top-4 xl:z-20">
      <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-3 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[var(--color-text)]">
                Canvas Preview
              </p>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={handleReplay}
                className="inline-flex h-7 items-center gap-1 rounded-md border border-[var(--color-accent-pale)] bg-white px-2 text-[11px] font-bold text-[var(--color-text)] hover:bg-[var(--color-bg)]"
              >
                <svg viewBox="0 0 20 20" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m7 5 8 5-8 5z" />
                </svg>
                Replay Animasi
              </button>
            </div>
            <p className="mt-1 text-xs font-semibold text-[var(--color-text)]">
              {activeDesignSection} section, {activeOrnaments.length} ornament
            </p>
          </div>
          <span className="rounded-full bg-[var(--color-bg)] px-2.5 py-1 text-[11px] font-black text-[var(--color-primary)]">
            412px
          </span>
        </div>
        <div className="mt-3 flex justify-center">
          <div className="relative w-full max-w-[300px]">
            <div className="relative rounded-[28px] border-2 border-[var(--color-primary)]/65 bg-[var(--color-primary)]/10 p-1.5 shadow-[0_12px_28px_rgba(15,23,42,0.14)]">
              <div className="absolute left-1/2 top-0 z-20 h-4 w-20 -translate-x-1/2 rounded-b-2xl bg-[var(--color-primary)]/70" />
              <div className="relative aspect-[9/16] overflow-hidden rounded-[23px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)]">
                <iframe
	                  ref={iframeRef}
	                  src={templatePreviewSrc}
	                  title={`Ornament ${activeDesignSection} preview`}
                    tabIndex={-1}
	                  className="h-full w-full border-0"
	                  onLoad={postPreviewSnapshot}
	                />
                <div className="pointer-events-none absolute inset-0 border border-dashed border-[var(--color-accent)]/45" />
              </div>
              <div className="mx-auto mt-1 h-1 w-12 rounded-full bg-[var(--color-primary)]/35" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
