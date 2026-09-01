"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  slotClasses,
  slotTransforms,
  sizeValue,
} from "../../../templates/ornamentModel";

// ============================================================
// OrnamentDragOverlay — lapisan transparan di atas canvas preview
// (OrnamentCanvasPanel) yang membungkus posisi tiap ornamen aktif
// dengan geometri yang SAMA dengan renderer (OrnamentLayer):
//   slot anchor (slotClasses) + slot transform + translate(x,y)
//   + width/height.
//
// Admin bisa:
//   - klik ornamen → seleksi sinkron dengan layer panel
//   - drag ornamen → update x/y (round ke integer, live)
//   - snap ke slot terdekat saat drag selesai (opsi slot bersih)
//
// Overlay render di luar iframe, jadi drag tidak terhalang
// pointer events milik halaman preview.
// ============================================================

const DEFAULT_WIDTH = 160;
const DEFAULT_HEIGHT = 160;

function parsePx(value, fallback) {
  if (value === "" || value === null || value === undefined) {
    return fallback;
  }
  const num = typeof value === "number" ? value : Number.parseFloat(String(value));
  return Number.isFinite(num) ? num : fallback;
}

function getSlotAnchorStyle(slot) {
  // Sama dengan slotClasses di ornamentModel: posisi anchor kotak.
  const base = { position: "absolute" };
  switch (slot) {
    case "fill":
      return { ...base, inset: 0 };
    case "top-left":
      return { ...base, left: 0, top: 0 };
    case "top-right":
      return { ...base, right: 0, top: 0 };
    case "bottom-left":
      return { ...base, bottom: 0, left: 0 };
    case "bottom-right":
      return { ...base, bottom: 0, right: 0 };
    case "center-top":
      return { ...base, left: "50%", top: 0, transform: "translateX(-50%)" };
    case "center-bottom":
      return { ...base, bottom: 0, left: "50%", transform: "translateX(-50%)" };
    case "side-left":
    case "middle-left":
      return { ...base, left: 0, top: "50%", transform: "translateY(-50%)" };
    case "side-right":
    case "middle-right":
      return { ...base, right: 0, top: "50%", transform: "translateY(-50%)" };
    case "center":
      return { ...base, left: "50%", top: "50%", transform: "translate(-50%, -50%)" };
    default:
      return { ...base, left: 0, top: 0 };
  }
}

// Hitung posisi (left/top) dalam px relatif container, dengan asumsi
// container berukuran 412x732 (canvas preview). Ini mencerminkan
// renderer: slot anchor + translate(x,y).
function getOrnamentPosition(ornament, containerWidth, containerHeight) {
  const slot = ornament.slot || "top-left";
  const x = parsePx(ornament.x, 0);
  const y = parsePx(ornament.y, 0);
  const width = parsePx(ornament.width, DEFAULT_WIDTH);
  const height = parsePx(ornament.height, DEFAULT_HEIGHT);

  let left = 0;
  let top = 0;

  switch (slot) {
    case "fill":
      return { left: 0, top: 0, width: containerWidth, height: containerHeight };
    case "top-right":
      left = containerWidth - width + x;
      top = y;
      break;
    case "bottom-left":
      left = x;
      top = containerHeight - height + y;
      break;
    case "bottom-right":
      left = containerWidth - width + x;
      top = containerHeight - height + y;
      break;
    case "center-top":
      left = (containerWidth - width) / 2 + x;
      top = y;
      break;
    case "center-bottom":
      left = (containerWidth - width) / 2 + x;
      top = containerHeight - height + y;
      break;
    case "side-left":
    case "middle-left":
      left = x;
      top = (containerHeight - height) / 2 + y;
      break;
    case "side-right":
    case "middle-right":
      left = containerWidth - width + x;
      top = (containerHeight - height) / 2 + y;
      break;
    case "center":
      left = (containerWidth - width) / 2 + x;
      top = (containerHeight - height) / 2 + y;
      break;
    case "top-left":
    default:
      left = x;
      top = y;
      break;
  }

  return { left, top, width, height };
}

// Balikkan: dari posisi (left/top) yang dihasilkan drag, cari x/y
// untuk slot tertentu.
function positionToOffset(slot, left, top, width, height, containerWidth, containerHeight) {
  switch (slot) {
    case "fill":
      return { x: 0, y: 0 };
    case "top-right":
      return { x: Math.round(left - (containerWidth - width)), y: Math.round(top) };
    case "bottom-left":
      return { x: Math.round(left), y: Math.round(top - (containerHeight - height)) };
    case "bottom-right":
      return {
        x: Math.round(left - (containerWidth - width)),
        y: Math.round(top - (containerHeight - height)),
      };
    case "center-top":
      return { x: Math.round(left - (containerWidth - width) / 2), y: Math.round(top) };
    case "center-bottom":
      return {
        x: Math.round(left - (containerWidth - width) / 2),
        y: Math.round(top - (containerHeight - height)),
      };
    case "side-left":
    case "middle-left":
      return { x: Math.round(left), y: Math.round(top - (containerHeight - height) / 2) };
    case "side-right":
    case "middle-right":
      return {
        x: Math.round(left - (containerWidth - width)),
        y: Math.round(top - (containerHeight - height) / 2),
      };
    case "center":
      return {
        x: Math.round(left - (containerWidth - width) / 2),
        y: Math.round(top - (containerHeight - height) / 2),
      };
    case "top-left":
    default:
      return { x: Math.round(left), y: Math.round(top) };
  }
}

// Slot yang "dekat" dengan posisi tengah/tepi kotak — dipakai untuk snap.
function findNearestSlot(centerX, centerY, width, height, containerWidth, containerHeight) {
  const candidates = [
    { slot: "top-left", cx: width / 2, cy: height / 2 },
    { slot: "top-right", cx: containerWidth - width / 2, cy: height / 2 },
    { slot: "bottom-left", cx: width / 2, cy: containerHeight - height / 2 },
    { slot: "bottom-right", cx: containerWidth - width / 2, cy: containerHeight - height / 2 },
    { slot: "center-top", cx: containerWidth / 2, cy: height / 2 },
    { slot: "center-bottom", cx: containerWidth / 2, cy: containerHeight - height / 2 },
    { slot: "side-left", cx: width / 2, cy: containerHeight / 2 },
    { slot: "side-right", cx: containerWidth - width / 2, cy: containerHeight / 2 },
    { slot: "center", cx: containerWidth / 2, cy: containerHeight / 2 },
  ];

  const SLOT_SNAP_THRESHOLD = 26;
  let nearest = null;
  let nearestDistance = Infinity;

  candidates.forEach((candidate) => {
    const distance = Math.hypot(candidate.cx - centerX, candidate.cy - centerY);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = candidate;
    }
  });

  return nearestDistance <= SLOT_SNAP_THRESHOLD ? nearest.slot : null;
}

const SLOT_LABELS = {
  "top-left": "Kiri atas",
  "top-right": "Kanan atas",
  "bottom-left": "Kiri bawah",
  "bottom-right": "Kanan bawah",
  "center-top": "Tengah atas",
  "center-bottom": "Tengah bawah",
  "side-left": "Kiri tengah",
  "side-right": "Kanan tengah",
  center: "Tengah",
  fill: "Penuh",
};

export default function OrnamentDragOverlay({
  ornaments = [],
  selectedIndex = -1,
  onSelect,
  onMove,
  onSnap,
  onDragEnd,
  containerWidth = 412,
  containerHeight = 732,
  disabled = false,
}) {
  const overlayRef = useRef(null);
  const dragState = useRef(null);
  const [draggingIndex, setDraggingIndex] = useState(-1);

  const visibleOrnaments = useMemo(
    () => ornaments.filter((ornament) => !ornament.hidden && ornament.src),
    [ornaments],
  );

  const getOverlayRect = () => {
    const rect = overlayRef.current?.getBoundingClientRect();
    return rect || { left: 0, top: 0, width: containerWidth, height: containerHeight };
  };

  const handlePointerDown = (event, index) => {
    if (disabled) {
      return;
    }

    const ornament = visibleOrnaments[index];
    if (!ornament) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    onSelect?.(index);

    const rect = getOverlayRect();
    const scaleX = rect.width / containerWidth;
    const scaleY = rect.height / containerHeight;
    const { left, top, width, height } = getOrnamentPosition(
      ornament,
      containerWidth,
      containerHeight,
    );

    // Simpan state awal drag (dalam koordinat container 412x732).
    dragState.current = {
      index,
      slot: ornament.slot || "top-left",
      width,
      height,
      startLeft: left,
      startTop: top,
      lastLeft: left,
      lastTop: top,
      startPointerX: event.clientX,
      startPointerY: event.clientY,
      scaleX,
      scaleY,
    };

    setDraggingIndex(index);

    const handlePointerMove = (moveEvent) => {
      const state = dragState.current;
      if (!state) {
        return;
      }

      const deltaX = (moveEvent.clientX - state.startPointerX) / state.scaleX;
      const deltaY = (moveEvent.clientY - state.startPointerY) / state.scaleY;
      const nextLeft = state.startLeft + deltaX;
      const nextTop = state.startTop + deltaY;
      state.lastLeft = nextLeft;
      state.lastTop = nextTop;
      const offset = positionToOffset(
        state.slot,
        nextLeft,
        nextTop,
        state.width,
        state.height,
        containerWidth,
        containerHeight,
      );
      onMove?.(state.index, offset.x, offset.y);
    };

    const handlePointerUp = () => {
      const state = dragState.current;
      dragState.current = null;
      setDraggingIndex(-1);

      if (state) {
        // Pakai posisi terakhir drag (lebih akurat daripada closure render awal).
        const { left, top, width, height } = {
          left: state.lastLeft,
          top: state.lastTop,
          width: state.width,
          height: state.height,
        };
        const nearestSlot = findNearestSlot(
          left + width / 2,
          top + height / 2,
          width,
          height,
          containerWidth,
          containerHeight,
        );
        if (nearestSlot && nearestSlot !== state.slot) {
          const offset = positionToOffset(
            nearestSlot,
            left,
            top,
            width,
            height,
            containerWidth,
            containerHeight,
          );
          onSnap?.(state.index, nearestSlot, offset.x, offset.y);
        }
        onDragEnd?.();
      }

      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  if (!visibleOrnaments.length) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      className={`absolute inset-0 z-40 overflow-hidden ${disabled ? "pointer-events-none" : ""}`}
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    >
      {visibleOrnaments.map((ornament, index) => {
        const position = getOrnamentPosition(ornament, containerWidth, containerHeight);
        const isSelected = index === selectedIndex;
        const isDragging = index === draggingIndex;
        const isFill = (ornament.slot || "top-left") === "fill";

        return (
          <div
            key={ornament.id || index}
            data-ornament-id={ornament.id || index}
            className="absolute"
            style={{
              left: position.left,
              top: position.top,
              width: position.width,
              height: position.height,
            }}
          >
            <button
              type="button"
              tabIndex={-1}
              onPointerDown={(event) => handlePointerDown(event, index)}
              className={`group relative block h-full w-full cursor-move touch-none select-none ${
                isDragging ? "z-20" : ""
              }`}
              style={{
                pointerEvents: "auto",
              }}
              aria-label={`Ornamen ${ornament.id || index + 1} — geser untuk mengubah posisi`}
            >
              {/* Ring seleksi + zona klik */}
              <span
                className={`absolute inset-0 rounded-sm border-2 transition-colors ${
                  isSelected
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)]/8"
                    : "border-transparent group-hover:border-[var(--color-accent)]/55"
                }`}
              />
              {/* Label nama ornamen */}
              {!isFill ? (
                <span
                  className={`absolute -top-2.5 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide shadow-sm ${
                    isSelected
                      ? "bg-[var(--color-accent)] text-white"
                      : "bg-[var(--dash-ink)]/85 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  }`}
                >
                  {ornament.id || `Ornamen ${index + 1}`}
                </span>
              ) : null}
              {/* Handle resize (visual, fase berikutnya) */}
              {!isFill && isSelected ? (
                <span className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-sm border border-white bg-[var(--color-accent)] shadow" />
              ) : null}
              {/* Crosshair posisi */}
              {isSelected && !isFill ? (
                <span className="pointer-events-none absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)]" />
              ) : null}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export { SLOT_LABELS };
