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
      <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
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
      className="w-full rounded-lg border border-[var(--dash-border)] bg-white px-3 py-2.5 text-sm font-medium text-[var(--dash-ink)] outline-none transition-colors placeholder:text-[var(--dash-subtle)] focus:border-[var(--dash-ink)]"
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
      className="w-full rounded-lg border border-[var(--dash-border)] bg-white px-3 py-2.5 text-sm font-medium text-[var(--dash-ink)] outline-none transition-colors focus:border-[var(--dash-ink)]"
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
      className={`rounded-[14px] border p-4 text-left transition-colors ${
        checked
          ? "border-[var(--dash-ink)] bg-[var(--dash-fog)]"
          : "border-[var(--dash-border)] bg-white hover:bg-[var(--dash-fog)]"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-1 h-5 w-5 rounded-md border ${
            checked
              ? "border-[var(--dash-ink)] bg-[var(--dash-ink)]"
              : "border-[var(--dash-border)] bg-white"
          }`}
        />
        <span>
          <span className="block text-sm font-semibold text-[var(--dash-ink)]">
            {label}
          </span>
          <span className="mt-1 block text-sm font-medium leading-6 text-[var(--dash-muted)]">
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
      className="w-full rounded-lg border border-[var(--dash-border)] bg-white px-3 py-2 text-sm font-medium text-[var(--dash-ink)] outline-none transition-colors placeholder:text-[var(--dash-subtle)] focus:border-[var(--dash-ink)]"
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
      className={`w-full rounded-lg border border-[var(--dash-border)] bg-white px-3 py-2.5 text-sm font-medium leading-6 text-[var(--dash-ink)] outline-none transition-colors placeholder:text-[var(--dash-subtle)] focus:border-[var(--dash-ink)] ${className}`}
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
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
          {title}
        </p>
      )}
      {children}
    </div>
  );
}
