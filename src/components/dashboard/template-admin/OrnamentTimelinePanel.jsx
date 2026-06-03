import React, { useEffect, useMemo, useState } from "react";

export default function OrnamentTimelinePanel({
  activeOrnaments,
  previewEntranceKey,
  setPreviewEntranceKey,
  timelineZoom,
  setTimelineZoom,
  timelineSnapEnabled,
  setTimelineSnapEnabled,
  timelineSnapUnit,
  setTimelineSnapUnit,
  timelineContainerRef,
  setSelectedOrnamentIndex,
  setTimelineInteraction,
  selectedOrnamentIndex,
}) {
  const [trackVisibility, setTrackVisibility] = useState([true, true, true, true]);
  const [trackLocked, setTrackLocked] = useState([false, false, false, false]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playheadSeconds, setPlayheadSeconds] = useState(0);
  const hiddenOrnamentIds = useMemo(
    () =>
      new Set(
        activeOrnaments
          .filter((o) => o.hidden)
          .map((o) => o.id),
      ),
    [activeOrnaments],
  );

  const timelineDuration = Math.max(
    20,
    ...activeOrnaments.map((o) => (o.timelinePosition ?? 0) + (o.duration ?? 2)),
  );
  const playhead = Math.max(0, Math.min(timelineDuration, playheadSeconds));
  const playheadPercent = Math.min(100, (playhead / timelineDuration) * 100);
  const trackLabels = ["Track 1", "Track 2", "Track 3", "Track 4"];
  const trackTint = ["#f5c5d4", "#f8d8ad", "#bfe8de", "#d2c4f4"];
  const rulerTicks = Array.from({ length: timelineDuration + 1 }, (_, t) => t);

  useEffect(() => {
    setPlayheadSeconds((current) => Math.min(current, timelineDuration));
  }, [timelineDuration]);

  useEffect(() => {
    if (!isPlaying) return undefined;
    const timer = window.setInterval(() => {
      setPlayheadSeconds((current) => {
        if (current >= timelineDuration) {
          setIsPlaying(false);
          return timelineDuration;
        }
        return Number((current + 0.1).toFixed(1));
      });
    }, 100);
    return () => window.clearInterval(timer);
  }, [isPlaying, timelineDuration]);

  const togglePlay = () => {
    if (!isPlaying && playheadSeconds >= timelineDuration) {
      setPlayheadSeconds(0);
    }
    setPreviewEntranceKey((k) => k + 1);
    setIsPlaying((current) => !current);
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    setPlayheadSeconds(0);
    setPreviewEntranceKey(0);
  };

  const stepPlayback = (delta) => {
    setIsPlaying(false);
    setPlayheadSeconds((current) =>
      Math.max(0, Math.min(timelineDuration, Number((current + delta).toFixed(1)))),
    );
  };

  const beginInteraction = (event, mode, ornament, ornamentIndex, trackIndex) => {
    const laneNode = timelineContainerRef.current;
    if (!laneNode) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const laneRect = laneNode.getBoundingClientRect();
    const occupancy = activeOrnaments.reduce((acc, item, index) => {
      const track = Math.max(0, Number(item.timelineTrack ?? 0));
      const start = Math.max(0, Number(item.timelinePosition ?? 0));
      const duration = Math.max(0.5, Number(item.duration ?? 2));
      if (!acc[track]) acc[track] = [];
      acc[track].push({ index, start, duration });
      return acc;
    }, {});
    event.preventDefault();
    event.stopPropagation();
    if (event.currentTarget?.setPointerCapture && event.pointerId != null) {
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {}
    }
    setSelectedOrnamentIndex(ornamentIndex);
    setTimelineInteraction({
      mode,
      ornamentIndex,
      trackCount: trackLabels.length,
      timelineDuration,
      startX: event.clientX,
      startY: event.clientY,
      initialStart: Math.max(0, Number(ornament.timelinePosition ?? 0)),
      initialDuration: Math.max(0.5, Number(ornament.duration ?? 2)),
      initialTrack: Math.max(0, Number(ornament.timelineTrack ?? trackIndex)),
      laneWidth: laneRect.width,
      trackOccupancy: occupancy,
    });
  };

  return (
    <div className="mt-5 rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-3">
      <div className="rounded-lg border border-black/10 bg-white">
        <div className="flex items-center justify-between border-b border-black/10 px-3 py-2">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 20 20" className="h-4 w-4 text-[var(--color-text)]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="12" height="3" rx="1" />
              <rect x="4" y="9" width="12" height="3" rx="1" />
              <rect x="4" y="14" width="12" height="3" rx="1" />
            </svg>
            <p className="text-sm font-black text-[var(--color-text)]">Timeline Animasi</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-black/10 text-[var(--color-text)] hover:bg-[var(--color-bg)]"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor">
                  <rect x="5" y="4.5" width="3.5" height="11" rx="1" />
                  <rect x="11.5" y="4.5" width="3.5" height="11" rx="1" />
                </svg>
              ) : (
                <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor"><path d="M6 4.5v11l8-5.5-8-5.5Z" /></svg>
              )}
            </button>
            <button
              type="button"
              onClick={stopPlayback}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-black/10 text-[var(--color-text)] hover:bg-[var(--color-bg)]"
              title="Stop"
            >
              <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor"><rect x="5" y="5" width="10" height="10" rx="1.5" /></svg>
            </button>
            <button
              type="button"
              onClick={() => stepPlayback(-1)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-black/10 text-[var(--color-text)] hover:bg-[var(--color-bg)]"
              title="Backward 1s"
            >
              <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor">
                <path d="M11.5 5.2v9.6L5 10l6.5-4.8Z" />
                <rect x="13.5" y="5.5" width="1.8" height="9" rx="0.8" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => stepPlayback(1)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-black/10 text-[var(--color-text)] hover:bg-[var(--color-bg)]"
              title="Forward 1s"
            >
              <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor">
                <path d="M8.5 5.2v9.6L15 10 8.5 5.2Z" />
                <rect x="4.7" y="5.5" width="1.8" height="9" rx="0.8" />
              </svg>
            </button>
            <span className="px-1 text-xs font-bold text-[var(--color-text)]/80">
              {playhead.toFixed(1)}s / {timelineDuration}s
            </span>
            <button type="button" onClick={() => setTimelineZoom((z) => Math.max(1, Number((z - 0.25).toFixed(2))))} className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-black/10 text-[var(--color-text)] hover:bg-[var(--color-bg)]" title="Zoom Out">-</button>
            <button type="button" onClick={() => setTimelineZoom((z) => Math.min(2.5, Number((z + 0.25).toFixed(2))))} className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-black/10 text-[var(--color-text)] hover:bg-[var(--color-bg)]" title="Zoom In">+</button>
            <button type="button" onClick={() => setTimelineSnapEnabled((v) => !v)} className="ml-1 flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text)]/85">
              <span className={`inline-flex h-4 w-7 rounded-full p-0.5 ${timelineSnapEnabled ? "bg-[var(--color-accent)]" : "bg-black/25"}`}>
                <span className={`h-3 w-3 rounded-full bg-white transition-transform ${timelineSnapEnabled ? "translate-x-3" : ""}`} />
              </span>
              Snap
            </button>
            <select
              value={String(timelineSnapUnit)}
              onChange={(event) => setTimelineSnapUnit(Number(event.target.value))}
              className="h-7 rounded-md border border-black/10 bg-white px-2 text-[11px] font-bold text-[var(--color-text)]"
              title="Snap Grid"
            >
              <option value="0.25">0.25s</option>
              <option value="0.5">0.5s</option>
              <option value="1">1s</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto px-3 pb-3 pt-2">
          <div className="min-w-[980px]">
            <div className="ml-[120px] mb-2 grid" style={{ width: `${timelineZoom * 100}%`, gridTemplateColumns: `repeat(${rulerTicks.length}, minmax(0, 1fr))` }}>
              {rulerTicks.map((tick) => (
                <span key={tick} className="text-[10px] font-bold text-[var(--color-text)]/60">
                  {tick}s
                </span>
              ))}
            </div>

            <div className="space-y-2">
              {trackLabels.map((trackLabel, trackIndex) => {
                const trackOrnaments = activeOrnaments
                  .map((ornament, idx) => ({ ornament, idx }))
                  .filter(({ ornament }) => (ornament.timelineTrack ?? 0) === trackIndex)
                  .filter(({ ornament }) => trackVisibility[trackIndex] && !hiddenOrnamentIds.has(ornament.id));
                return (
                  <div key={trackLabel} className="relative flex items-center gap-2">
                    <div className="flex w-[110px] items-center justify-between pr-2">
                      <span className="text-xs font-bold text-[var(--color-text)]">{trackLabel}</span>
                      <div className="flex items-center gap-1 text-[var(--color-text)]/50">
                        <button
                          type="button"
                          onClick={() =>
                            setTrackVisibility((prev) =>
                              prev.map((v, i) => (i === trackIndex ? !v : v)),
                            )
                          }
                          className="rounded p-0.5 hover:bg-black/5"
                          title={trackVisibility[trackIndex] ? "Hide track" : "Show track"}
                        >
                          {trackVisibility[trackIndex] ? (
                            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="3.2" /><path d="M2 10s3-5 8-5 8 5 8 5-3 5-8 5-8-5-8-5Z" /></svg>
                          ) : (
                            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m3 3 14 14" /><path d="M8.2 5.7A8.4 8.4 0 0 1 10 5c5 0 8 5 8 5a13.5 13.5 0 0 1-3 3.6" /><path d="M12.8 14.3A8.4 8.4 0 0 1 10 15c-5 0-8-5-8-5a13.6 13.6 0 0 1 4-4.2" /></svg>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setTrackLocked((prev) =>
                              prev.map((v, i) => (i === trackIndex ? !v : v)),
                            )
                          }
                          className="rounded p-0.5 hover:bg-black/5"
                          title={trackLocked[trackIndex] ? "Unlock track" : "Lock track"}
                        >
                          {trackLocked[trackIndex] ? (
                            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="8" width="10" height="8" rx="1.5" /><path d="M7 8V6a3 3 0 0 1 6 0v2" /></svg>
                          ) : (
                            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="8" width="10" height="8" rx="1.5" /><path d="M7 8V6a3 3 0 0 1 5.7-1.1" /></svg>
                          )}
                        </button>
                      </div>
                    </div>

                    <div ref={trackIndex === 0 ? timelineContainerRef : null} className="relative h-10 flex-1 overflow-hidden rounded border border-black/10 bg-[#fafafa] touch-none" style={{ width: `${timelineZoom * 100}%` }}>
                      <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${timelineDuration}, minmax(0, 1fr))` }}>
                        {Array.from({ length: timelineDuration }).map((_, i) => (
                          <div key={i} className="border-r border-black/5" />
                        ))}
                      </div>

                      <div className="absolute bottom-0 top-0 w-[2px] bg-red-500" style={{ left: `${playheadPercent}%` }} />
                      {trackIndex === 0 ? (
                        <div
                          className="absolute -top-1 -translate-x-1/2 rounded bg-red-500 px-1 py-[1px] text-[9px] font-bold text-white"
                          style={{ left: `${playheadPercent}%` }}
                        >
                          {playhead.toFixed(1)}s
                        </div>
                      ) : null}

                      {trackOrnaments.map(({ ornament, idx: realIndex }, idx) => {
                        const start = Math.max(0, Number(ornament.timelinePosition ?? 0));
                        const duration = Math.max(0.5, Number(ornament.duration ?? 2));
                        const left = (start / timelineDuration) * 100;
                        const width = Math.max(3, (duration / timelineDuration) * 100);
                        const selected = realIndex === selectedOrnamentIndex;
                        return (
                          <div
                            key={`${ornament.id || "ornament"}-${idx}`}
                            role="button"
                            tabIndex={0}
                            onClick={() => setSelectedOrnamentIndex(realIndex)}
                            onPointerDown={(event) => {
                              if (trackLocked[trackIndex]) return;
                              beginInteraction(event, "move", ornament, realIndex, trackIndex);
                            }}
                            className={`absolute top-1 h-8 rounded-md border px-3 text-left text-[10px] font-bold shadow-sm transition-shadow ${
                              selected ? "ring-2 ring-red-300" : ""
                            }`}
                            style={{
                              left: `${left}%`,
                              width: `${width}%`,
                              backgroundColor: trackTint[trackIndex],
                              borderColor: "rgba(0,0,0,0.15)",
                              color: "rgba(0,0,0,0.72)",
                              cursor: trackLocked[trackIndex] ? "not-allowed" : "grab",
                              opacity: trackLocked[trackIndex] ? 0.8 : 1,
                            }}
                          >
                            <button
                              type="button"
                              onPointerDown={(event) => {
                                if (trackLocked[trackIndex]) return;
                                beginInteraction(event, "resize-start", ornament, realIndex, trackIndex);
                              }}
                              className="absolute inset-y-0 left-0 w-2 rounded-l-md border-r border-black/15 hover:bg-black/10"
                              aria-label="Resize start"
                            />
                            <button
                              type="button"
                              onPointerDown={(event) => {
                                if (trackLocked[trackIndex]) return;
                                beginInteraction(event, "resize-end", ornament, realIndex, trackIndex);
                              }}
                              className="absolute inset-y-0 right-0 w-2 rounded-r-md border-l border-black/15 hover:bg-black/10"
                              aria-label="Resize end"
                            />
                            <div className="truncate">{(ornament.id || `Ornament ${idx + 1}`).replace("ornament-", "Ornament ")}</div>
                            <div className="text-[9px] font-semibold opacity-75">
                              {start}s - {Math.min(timelineDuration, start + duration)}s
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
