"use client";

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
      <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
              Publish
            </p>
            <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
              Final check sebelum publish. Advanced config opsional.
            </p>
          </div>
          <button
            type="button"
            onClick={onToggleAdvanced}
            className="rounded-xl border border-[var(--color-accent-pale)] bg-white px-4 py-2 text-sm font-black text-[var(--color-primary)]"
          >
            {isAdvancedOpen ? "Sembunyikan Advanced" : "Tampilkan Advanced"}
          </button>
        </div>

        <div className="mt-4 rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-4">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
            Status Publikasi
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  templateDraft.status === "active" ? "bg-[var(--color-wa)]" : "bg-[var(--color-accent)]"
                }`}
              />
              <p className="text-sm font-bold text-[var(--color-text)]">
                {templateDraft.status === "active" ? "Published" : "Draft / Hidden"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onChangeStatus("hidden")}
                className={`rounded-lg border px-3 py-1.5 text-xs font-black ${
                  templateDraft.status === "hidden"
                    ? "border-[var(--color-primary)] bg-[var(--color-bg)] text-[var(--color-primary)]"
                    : "border-[var(--color-accent-pale)] bg-white text-[var(--color-text)]"
                }`}
              >
                Draft
              </button>
              <button
                type="button"
                onClick={() => onChangeStatus("active")}
                className={`rounded-lg border px-3 py-1.5 text-xs font-black ${
                  templateDraft.status === "active"
                    ? "border-[var(--color-wa)] bg-[var(--color-wa)] text-white"
                    : "border-[var(--color-accent-pale)] bg-white text-[var(--color-text)]"
                }`}
              >
                Publish
              </button>
            </div>
          </div>
          <p className="mt-2 text-xs font-semibold text-[var(--color-text)]/75">
            Simpan perubahan untuk menerapkan status terbaru.
          </p>
        </div>

        <div className="mt-4 rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-4">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
            Quality Guard
          </p>
          {templateQualityWarnings.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {templateQualityWarnings.map((warning) => (
                <li
                  key={warning}
                  className="rounded-xl border border-[var(--color-accent-pale)] bg-[var(--color-bg)] px-3 py-2 text-sm font-bold text-[var(--color-text)]"
                >
                  {warning}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 rounded-xl bg-[var(--color-bg)] px-3 py-2 text-sm font-bold text-[var(--color-text)]">
              Tidak ada warning utama. Template aman untuk disimpan sebagai active.
            </p>
          )}
        </div>

        {isAdvancedOpen ? (
          <div className="mt-4">
            <label className="block">
              <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                Design Config JSON
              </span>
              <textarea
                value={designConfigText}
                onChange={(event) => {
                  onDesignConfigChange(event.target.value);
                  onResetMessage?.();
                }}
                rows={10}
                spellCheck={false}
                className="mt-2 w-full rounded-2xl border border-[var(--color-accent-pale)] bg-[#111827] px-4 py-3 font-mono text-sm leading-6 text-white outline-none focus:border-[var(--color-accent)]"
              />
            </label>
          </div>
        ) : null}
      </div>
    </div>
  );
}

