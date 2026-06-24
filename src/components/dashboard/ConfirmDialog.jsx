"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ConfirmDialog – reusable modal konfirmasi sebelum aksi destruktif.
 *
 * Props:
 *  open        boolean   – apakah dialog tampil
 *  title       string    – judul dialog
 *  message     string    – pesan konfirmasi
 *  confirmLabel string   – label tombol konfirmasi (default: "Ya, Hapus")
 *  cancelLabel  string   – label tombol batal (default: "Batal")
 *  variant     "danger"|"warning"  – warna tombol confirm
 *  onConfirm   () => void
 *  onCancel    () => void
 */
export default function ConfirmDialog({
  open = false,
  title = "Konfirmasi",
  message = "Tindakan ini tidak bisa dibatalkan.",
  confirmLabel = "Ya, Hapus",
  cancelLabel = "Batal",
  variant = "danger",
  onConfirm,
  onCancel,
}) {
  const cancelRef = useRef(null);

  // Fokus ke tombol Batal saat dialog terbuka (accessibility)
  useEffect(() => {
    if (open) {
      setTimeout(() => cancelRef.current?.focus(), 50);
    }
  }, [open]);

  // Tutup dengan Escape
  useEffect(() => {
    if (!open) return undefined;
    const handleKey = (event) => {
      if (event.key === "Escape") onCancel?.();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onCancel]);

  const confirmClass =
    variant === "danger"
      ? "rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
      : "rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400";

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="confirm-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onCancel}
          />

          {/* Dialog Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl border border-[var(--dash-border)] bg-[var(--dash-canvas)] shadow-2xl"
          >
            {/* Icon strip */}
            <div className={`px-6 pt-6 pb-0 ${variant === "danger" ? "text-red-500" : "text-amber-500"}`}>
              <span className={`inline-flex h-11 w-11 items-center justify-center rounded-full ${variant === "danger" ? "bg-red-50" : "bg-amber-50"}`}>
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {variant === "danger" ? (
                    <>
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </>
                  ) : (
                    <>
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </>
                  )}
                </svg>
              </span>
            </div>

            <div className="px-6 pb-6 pt-4">
              <h2
                id="confirm-dialog-title"
                className="text-lg font-semibold text-[var(--dash-ink)]"
              >
                {title}
              </h2>
              <p className="mt-2 text-sm font-medium leading-6 text-[var(--dash-muted)]">
                {message}
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  ref={cancelRef}
                  type="button"
                  onClick={onCancel}
                  className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-canvas)] px-4 py-2.5 text-sm font-semibold text-[var(--dash-ink)] transition-colors hover:bg-[var(--dash-fog)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-ink)]/20"
                >
                  {cancelLabel}
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  className={confirmClass}
                >
                  {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
