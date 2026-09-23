"use client";

import React, { useMemo } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { templateSectionRegistry } from "../../../templates/templateSectionRegistry";
import { getSectionsOrder } from "../../../templates/sectionsOrder";

// ============================================================
// SectionOrderPanel — urutan tampil section undangan.
// Admin bisa drag (pointer + keyboard) atau pakai tombol naik/turun.
// Perubahan disimpan ke designConfig.canvas.sectionsOrder dan
// langsung kebaca renderer via resolvePreviewState.
// ============================================================

const sectionLabels = Object.fromEntries(
  templateSectionRegistry.map((section) => [section.id, section.label]),
);

function SortableRow({ id, label, index, total, onMove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const moveUp = (event) => {
    event.stopPropagation();
    onMove(id, index - 1);
  };

  const moveDown = (event) => {
    event.stopPropagation();
    onMove(id, index + 1);
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 rounded-xl border bg-white px-3 py-2 ${
        isDragging
          ? "border-[var(--color-accent)] shadow-lg"
          : "border-[var(--dash-border)]"
      }`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label={`Geser ${label}`}
        title="Tahan lalu geser untuk ubah urutan"
        className="flex h-8 w-8 shrink-0 cursor-grab items-center justify-center rounded-lg text-[var(--dash-muted)] transition-colors hover:bg-[var(--dash-fog)] active:cursor-grabbing"
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <circle cx="7" cy="5" r="1.6" />
          <circle cx="13" cy="5" r="1.6" />
          <circle cx="7" cy="10" r="1.6" />
          <circle cx="13" cy="10" r="1.6" />
          <circle cx="7" cy="15" r="1.6" />
          <circle cx="13" cy="15" r="1.6" />
        </svg>
      </button>
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--dash-fog)] text-[11px] font-black text-[var(--dash-ink)]">
        {index + 1}
      </span>
      <span className="min-w-0 flex-1 truncate text-sm font-bold text-[var(--dash-ink)]">
        {label}
      </span>
      <span className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={moveUp}
          disabled={index === 0}
          aria-label={`Pindah ${label} ke atas`}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--dash-muted)] transition-colors hover:bg-[var(--dash-fog)] disabled:opacity-30"
        >
          ▲
        </button>
        <button
          type="button"
          onClick={moveDown}
          disabled={index === total - 1}
          aria-label={`Pindah ${label} ke bawah`}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--dash-muted)] transition-colors hover:bg-[var(--dash-fog)] disabled:opacity-30"
        >
          ▼
        </button>
      </span>
    </li>
  );
}

export default function SectionOrderPanel({ parsedDesignConfig, patchSectionsOrder }) {
  const order = useMemo(
    () => getSectionsOrder(parsedDesignConfig || {}),
    [parsedDesignConfig],
  );
  // Custom = ada order tersimpan DAN beda dari bawaan. Kalau reset
  // menyimpan urutan bawaan, tombol reset hilang — sesuai makna "bawaan".
  const defaultOrder = useMemo(() => getSectionsOrder({}), []);
  const storedOrder = parsedDesignConfig?.canvas?.sectionsOrder;
  const isCustom =
    Array.isArray(storedOrder) &&
    (storedOrder.length !== defaultOrder.length ||
      storedOrder.some((id, index) => id !== defaultOrder[index]));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const persist = (nextOrder) => {
    patchSectionsOrder?.(nextOrder);
  };

  const handleMove = (sectionId, toIndex) => {
    const clamped = Math.max(0, Math.min(toIndex, order.length - 1));
    const fromIndex = order.indexOf(sectionId);
    if (fromIndex === -1 || fromIndex === clamped) {
      return;
    }
    persist(arrayMove(order, fromIndex, clamped));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }
    const fromIndex = order.indexOf(active.id);
    const toIndex = order.indexOf(over.id);
    if (fromIndex === -1 || toIndex === -1) {
      return;
    }
    persist(arrayMove(order, fromIndex, toIndex));
  };

  const handleReset = () => {
    patchSectionsOrder?.(undefined);
  };

  return (
    <div className="rounded-xl border border-[var(--dash-border)] bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--dash-muted)]">
            Urutan Section
          </p>
          <p className="mt-1 text-xs font-semibold leading-5 text-[var(--dash-muted)]">
            Geser untuk ubah urutan tampil di undangan. Tanpa order custom, renderer
            pakai urutan bawaan.
          </p>
        </div>
        {isCustom ? (
          <button
            type="button"
            onClick={handleReset}
            className="rounded-full px-3 py-1.5 text-[11px] font-black text-[var(--dash-muted)] ring-1 ring-[var(--dash-border)] transition-colors hover:bg-[var(--dash-fog)]"
          >
            Kembalikan bawaan
          </button>
        ) : null}
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          <ul className="mt-3 space-y-2">
            {order.map((sectionId, index) => (
              <SortableRow
                key={sectionId}
                id={sectionId}
                label={sectionLabels[sectionId] || sectionId}
                index={index}
                total={order.length}
                onMove={handleMove}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}
