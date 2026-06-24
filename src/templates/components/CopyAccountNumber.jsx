"use client";

import { useState } from "react";

export default function CopyAccountNumber({ bank = "", number = "" }) {
  const [isCopied, setIsCopied] = useState(false);

  const copyNumber = async () => {
    const accountNumber = String(number);

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(accountNumber);
      } else {
        const input = document.createElement("textarea");
        input.value = accountNumber;
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        input.remove();
      }

      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 2200);
    } catch {
      setIsCopied(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2.5">
        <p className="gift-account-number min-w-0 break-all text-2xl font-black leading-none text-[var(--color-primary)]">
          {number}
        </p>
        <button
          type="button"
          onClick={copyNumber}
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--color-accent-pale)] bg-[var(--color-surface)] text-[var(--color-primary)] transition-colors hover:bg-[var(--color-section-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30"
          aria-label={`Copy nomor rekening ${bank}`}
          title="Copy nomor rekening"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </button>
      </div>
      {isCopied ? (
        <span
          role="status"
          className="mt-2 block text-xs font-bold text-[var(--color-accent)]"
        >
          Rekening dicopy
        </span>
      ) : null}
    </div>
  );
}
