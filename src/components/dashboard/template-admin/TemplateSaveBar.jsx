"use client";

export default function TemplateSaveBar({ onPreview, onSave, isSaving }) {
  return (
    <div className="sticky bottom-0 mt-6 border-t border-[var(--color-accent-pale)] bg-white/95 px-4 py-3 backdrop-blur">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          onClick={onPreview}
          className="rounded-xl border border-[var(--color-accent-pale)] bg-white px-4 py-2 text-sm font-black text-[var(--color-primary)]"
        >
          Preview
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-4 py-2 text-sm font-black text-[var(--color-primary)] disabled:opacity-60"
        >
          {isSaving ? (
            <>
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 animate-spin"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12a9 9 0 1 1-2.64-6.36" />
              </svg>
              Menyimpan...
            </>
          ) : (
            "Simpan"
          )}
        </button>
      </div>
    </div>
  );
}

