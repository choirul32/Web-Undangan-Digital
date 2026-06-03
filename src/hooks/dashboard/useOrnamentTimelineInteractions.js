import { useEffect } from "react";

export default function useOrnamentTimelineInteractions({
  timelineInteraction,
  setTimelineInteraction,
  timelineSnapEnabled,
  timelineSnapUnit,
  updateOrnamentAtIndex,
  editorStep,
  selectedOrnament,
  selectedOrnamentIndex,
  activeOrnaments,
}) {
  useEffect(() => {
    if (!timelineInteraction) return undefined;

    const onPointerMove = (event) => {
      const {
        mode,
        ornamentIndex,
        trackCount,
        timelineDuration,
        startX,
        startY,
        initialStart,
        initialDuration,
        initialTrack,
        laneWidth,
        trackOccupancy,
      } = timelineInteraction;
      if (!laneWidth || laneWidth <= 0) return;

      const secondsPerPixel = timelineDuration / laneWidth;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      const snapUnit = timelineSnapEnabled ? timelineSnapUnit : 0.1;
      const snap = (value) => Math.round(value / snapUnit) * snapUnit;
      const deltaSeconds = dx * secondsPerPixel;

      let nextStart = initialStart;
      let nextDuration = initialDuration;
      let nextTrack = initialTrack;
      const getBoundsForTrack = (track, probeStart) => {
        const clips = (trackOccupancy?.[track] || [])
          .filter((item) => item.index !== ornamentIndex)
          .sort((a, b) => a.start - b.start);
        let previousEnd = 0;
        let nextStartBound = timelineDuration;
        for (let i = 0; i < clips.length; i += 1) {
          const clip = clips[i];
          if (clip.start + clip.duration <= probeStart) {
            previousEnd = Math.max(previousEnd, clip.start + clip.duration);
          }
          if (clip.start >= probeStart + 0.0001) {
            nextStartBound = Math.min(nextStartBound, clip.start);
            break;
          }
        }
        return { previousEnd, nextStartBound };
      };

      if (mode === "move") {
        nextStart = snap(initialStart + deltaSeconds);
        nextTrack = Math.max(
          0,
          Math.min(trackCount - 1, initialTrack + Math.round(dy / 44)),
        );
        const { previousEnd, nextStartBound } = getBoundsForTrack(nextTrack, nextStart);
        const maxStart = Math.min(timelineDuration - nextDuration, nextStartBound - nextDuration);
        nextStart = Math.max(previousEnd, Math.min(maxStart, nextStart));
      } else if (mode === "resize-start") {
        const rawStart = snap(initialStart + deltaSeconds);
        const { previousEnd } = getBoundsForTrack(initialTrack, rawStart);
        const maxStart = initialStart + initialDuration - 0.5;
        nextStart = Math.max(previousEnd, Math.min(maxStart, rawStart));
        nextDuration = snap(initialDuration - (nextStart - initialStart));
        nextDuration = Math.max(0.5, Math.min(timelineDuration, nextDuration));
      } else if (mode === "resize-end") {
        const { nextStartBound } = getBoundsForTrack(initialTrack, initialStart);
        nextDuration = snap(initialDuration + deltaSeconds);
        const maxDuration = Math.min(timelineDuration - initialStart, Math.max(0.5, nextStartBound - initialStart));
        nextDuration = Math.max(0.5, Math.min(maxDuration, nextDuration));
      }

      updateOrnamentAtIndex(ornamentIndex, {
        timelinePosition: Number(nextStart.toFixed(2)),
        duration: Number(nextDuration.toFixed(2)),
        timelineTrack: nextTrack,
      });
    };

    const onPointerUp = () => {
      setTimelineInteraction(null);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [timelineInteraction, timelineSnapEnabled, timelineSnapUnit, setTimelineInteraction, updateOrnamentAtIndex]);

  useEffect(() => {
    if (editorStep !== 6 || !selectedOrnament) return undefined;
    const onKeyDown = (event) => {
      if (event.target && ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName)) return;
      const isLeft = event.key === "ArrowLeft";
      const isRight = event.key === "ArrowRight";
      if (!isLeft && !isRight) return;
      event.preventDefault();
      const unit = timelineSnapEnabled ? timelineSnapUnit : 0.1;
      const delta = (isRight ? 1 : -1) * unit;
      const currentStart = Number(selectedOrnament.timelinePosition ?? 0);
      const currentDuration = Math.max(0.5, Number(selectedOrnament.duration ?? 2));
      const timelineDuration = Math.max(
        20,
        ...activeOrnaments.map((o) => (o.timelinePosition ?? 0) + (o.duration ?? 2)),
      );
      const nextStart = Math.max(0, Math.min(timelineDuration - currentDuration, currentStart + delta));
      updateOrnamentAtIndex(selectedOrnamentIndex, { timelinePosition: Number(nextStart.toFixed(2)) });
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    editorStep,
    selectedOrnament,
    selectedOrnamentIndex,
    activeOrnaments,
    timelineSnapEnabled,
    timelineSnapUnit,
    updateOrnamentAtIndex,
  ]);
}
