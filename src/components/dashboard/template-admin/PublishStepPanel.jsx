"use client";

import { DashboardButton, TextAreaInput } from "../FormControls";

export default function PublishStepPanel({
  visible,
  templateDraft,
  isAdvancedOpen,
  onToggleAdvanced,
  onChangeStatus,
  templateQualityWarnings,
  designConfigText,
  onDesignConfigChange,
  onResetMessage,
}) {
  if (!visible || !templateDraft) {
    return null;
  }

  return (
    <div id="template-advanced" className="scroll-mt-24 md:col-span-2">
      <div className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-fog)]/45 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--dash-muted)]">
              Publikasi
            </p>
            <p className="mt-1 text-base font-semibold text-[var(--dash-ink)]">
              Cek akhir sebelum publikasi. Konfigurasi lanjutan bersifat opsional.
            </p>
          </div>
          <DashboardButton
            type="button"
            onClick={onToggleAdvanced}
            variant="secondary"
          >
            {isAdvancedOpen ? "Sembunyikan lanjutan" : "Tampilkan lanjutan"}
          </DashboardButton>
        </div>

        <div className="mt-4 rounded-[14px] border border-[var(--dash-border)] bg-white p-4">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--dash-muted)]">
            Status Publikasi
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  templateDraft.status === "active" ? "bg-[var(--color-wa)]" : "bg-[var(--color-accent)]"
                }`}
              />
              <p className="text-sm font-bold text-[var(--dash-ink)]">
                {templateDraft.status === "active" ? "Terpublikasi" : "Draft / Disembunyikan"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <DashboardButton
                type="button"
                onClick={() => onChangeStatus("hidden")}
                variant={templateDraft.status === "hidden" ? "primary" : "secondary"}
                size="sm"
              >
                Draft
              </DashboardButton>
              <DashboardButton
                type="button"
                onClick={() => onChangeStatus("active")}
                variant={templateDraft.status === "active" ? "primary" : "secondary"}
                size="sm"
              >
                Publikasikan
              </DashboardButton>
            </div>
          </div>
          <p className="mt-2 text-xs font-semibold text-[var(--dash-muted)]">
            Simpan perubahan untuk menerapkan status terbaru.
          </p>
        </div>

        <div className="mt-4 rounded-[14px] border border-[var(--dash-border)] bg-white p-4">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--dash-muted)]">
            Pemeriksaan Kualitas
          </p>
          {templateQualityWarnings.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {templateQualityWarnings.map((warning) => (
                <li
                  key={warning}
                  className="rounded-xl border border-[var(--dash-border)] bg-[var(--dash-fog)] px-3 py-2 text-sm font-bold text-[var(--dash-ink)]"
                >
                  {warning}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 rounded-xl bg-[var(--dash-fog)] px-3 py-2 text-sm font-bold text-[var(--dash-ink)]">
              Tidak ada peringatan utama. Template aman untuk disimpan sebagai aktif.
            </p>
          )}
        </div>

        {isAdvancedOpen ? (
          <div className="mt-4">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--dash-muted)]">
                JSON Konfigurasi Desain
              </span>
              <TextAreaInput
                value={designConfigText}
                onChange={(event) => {
                  onDesignConfigChange(event.target.value);
                  onResetMessage?.();
                }}
                rows={10}
                spellCheck={false}
                className="mt-2 border-slate-800 !bg-[#111827] font-mono text-white"
              />
            </label>
          </div>
        ) : null}
      </div>
    </div>
  );
}
