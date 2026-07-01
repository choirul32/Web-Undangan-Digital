"use client";

import { DashboardButton } from "../FormControls";

export default function TemplateSaveBar({ onPreview, onSave, isSaving }) {
  return (
    <div className="sticky bottom-0 z-40 mt-6 border-t border-[var(--dash-border)] bg-white/95 px-4 py-3 shadow-[0_-12px_30px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <DashboardButton
          type="button"
          onClick={onPreview}
          variant="secondary"
        >
          Pratinjau
        </DashboardButton>
        <DashboardButton
          type="button"
          onClick={onSave}
          loading={isSaving}
        >
          {isSaving ? "Menyimpan..." : "Simpan"}
        </DashboardButton>
      </div>
    </div>
  );
}
