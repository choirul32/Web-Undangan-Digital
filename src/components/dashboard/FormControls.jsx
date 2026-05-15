/**
 * Reusable Form Controls
 * Extracted from Dashboard.jsx for better maintainability
 */

import React from "react";

/**
 * Field wrapper component with label
 */
export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
        {label}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

/**
 * Standard text input component
 */
export function TextInput(props) {
  return (
    <input
      {...props}
      className="w-full rounded-2xl border border-[var(--color-accent-pale)] bg-white px-4 py-3 text-base font-bold text-[var(--color-primary)] outline-none transition-colors placeholder:text-[var(--color-text)]/40 focus:border-[var(--color-accent)]"
    />
  );
}

/**
 * Standard select input component
 */
export function SelectInput(props) {
  return (
    <select
      {...props}
      className="w-full rounded-2xl border border-[var(--color-accent-pale)] bg-white px-4 py-3 text-base font-bold text-[var(--color-primary)] outline-none transition-colors focus:border-[var(--color-accent)]"
    />
  );
}

/**
 * Toggle field component for boolean options
 */
export function ToggleField({ checked, label, desc, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`rounded-[8px] border p-4 text-left transition-colors ${
        checked
          ? "border-[var(--color-accent)] bg-[var(--color-muted)]"
          : "border-[var(--color-accent-pale)] bg-white hover:bg-[var(--color-bg)]"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-1 h-5 w-5 rounded-md border ${
            checked
              ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
              : "border-[var(--color-accent-pale)] bg-white"
          }`}
        />
        <span>
          <span className="block text-base font-black text-[var(--color-primary)]">
            {label}
          </span>
          <span className="mt-1 block text-sm font-semibold leading-6 text-[var(--color-text)]">
            {desc}
          </span>
        </span>
      </div>
    </button>
  );
}

/**
 * Mini input variant for compact forms
 */
export function MiniInput(props) {
  return (
    <input
      {...props}
      className="w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-bold text-[var(--color-primary)] outline-none transition-colors placeholder:text-[var(--color-text)]/40 focus:border-[var(--color-accent)]"
    />
  );
}

/**
 * Textarea variant for multi-line input
 */
export function TextAreaInput({ rows = 4, className = "", ...props }) {
  return (
    <textarea
      {...props}
      rows={rows}
      className={`w-full rounded-2xl border border-[var(--color-accent-pale)] bg-white px-4 py-3 text-base font-bold leading-7 text-[var(--color-primary)] outline-none transition-colors placeholder:text-[var(--color-text)]/40 focus:border-[var(--color-accent)] ${className}`}
    />
  );
}

/**
 * Form section divider with optional title
 */
export function FormSection({ title, children, className = "" }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {title && (
        <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
          {title}
        </p>
      )}
      {children}
    </div>
  );
}
