/**
 * Reusable Form Controls
 * Extracted from Dashboard.jsx for better maintainability
 */

import React, { useRef } from "react";
import {
  Alert,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Select,
  Textarea,
  TextInput as FlowbiteTextInput,
  Toast,
  ToggleSwitch,
} from "flowbite-react";

const controlBaseClassName =
  "block w-full border bg-white font-semibold text-[var(--dash-ink)] transition-colors placeholder:font-medium placeholder:text-[var(--dash-subtle)] hover:border-[var(--color-accent-pale)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 dark:bg-white dark:text-[var(--dash-ink)]";

const flowbiteTextInputTheme = {
  base: "w-full",
  field: {
    input: {
      base: controlBaseClassName,
      colors: {
        gray: "border-[var(--dash-border)] !bg-white !text-[var(--dash-ink)]",
      },
      sizes: {
        sm: "rounded-lg px-3 py-2 text-sm",
        md: "rounded-xl px-3 py-2.5 text-sm",
      },
    },
  },
};

const flowbiteSelectTheme = {
  base: "w-full",
  field: {
    select: {
      base: `${controlBaseClassName} appearance-none pr-10`,
      colors: {
        gray: "border-[var(--dash-border)] !bg-white !text-[var(--dash-ink)]",
      },
      sizes: {
        md: "rounded-xl px-3.5 py-2.5 text-sm",
      },
    },
  },
};

const dashboardButtonTheme = {
  base: "relative inline-flex items-center justify-center rounded-md text-center font-semibold transition-colors focus:outline-none focus:ring-4",
  size: {
    sm: "min-h-9 px-3 py-2 text-sm",
    md: "min-h-10 px-4 py-2.5 text-sm",
  },
  color: {
    primary:
      "bg-[var(--dash-ink)] text-white hover:bg-[var(--dash-dark)] focus:ring-[var(--color-accent)]/25",
    secondary:
      "border border-[var(--dash-border)] bg-white text-[var(--dash-ink)] hover:bg-[var(--dash-fog)] focus:ring-[var(--color-accent)]/20",
    danger:
      "bg-red-700 text-white hover:bg-red-800 focus:ring-red-200",
    inverse:
      "bg-white text-[var(--dash-ink)] hover:bg-[var(--dash-fog)] focus:ring-white/25",
    ghost:
      "border border-white/20 bg-white/10 text-white hover:bg-white/20 focus:ring-white/20",
  },
};

const dashboardModalTheme = {
  root: {
    show: {
      on: "flex bg-slate-950/25 backdrop-blur-[1px]",
      off: "hidden",
    },
  },
  content: {
    base: "relative h-full w-full p-4 md:h-auto",
    inner:
      "relative flex max-h-[90dvh] flex-col overflow-hidden rounded-[14px] border border-slate-200 !bg-white text-slate-900 shadow-2xl shadow-slate-950/15 dark:!bg-white dark:text-slate-900",
  },
  header: {
    base: "flex items-start justify-between border-b border-slate-200 !bg-white p-5 dark:border-slate-200 dark:!bg-white",
    title: "text-xl font-semibold !text-slate-900 dark:!text-slate-900",
    close: {
      base: "ms-auto inline-flex items-center rounded-lg border border-slate-200 !bg-white p-2 text-sm !text-slate-500 transition-colors hover:!bg-slate-100 hover:!text-slate-900 focus:ring-2 focus:ring-slate-200 dark:border-slate-200 dark:!bg-white dark:!text-slate-500 dark:hover:!bg-slate-100 dark:hover:!text-slate-900",
      icon: "h-5 w-5",
    },
  },
  body: {
    base: "flex-1 overflow-auto !bg-white p-6 dark:!bg-white",
  },
  footer: {
    base: "flex items-center gap-2 border-t border-slate-200 !bg-slate-50 p-5 dark:border-slate-200 dark:!bg-slate-50",
  },
};

export function DashboardButton({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className = "",
  ...props
}) {
  return (
    <Button
      {...props}
      color={variant}
      size={size}
      disabled={disabled || loading}
      theme={dashboardButtonTheme}
      className={className}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
        />
      ) : null}
      {children}
    </Button>
  );
}

export function StatusToast({ message, tone = "info", onDismiss }) {
  if (!message) {
    return null;
  }

  const toneClasses = {
    info: "bg-[var(--dash-fog)] text-[var(--dash-ink)]",
    success: "bg-emerald-100 text-emerald-700",
    error: "bg-red-100 text-red-700",
  };

  return (
    <Toast className="max-w-xl border border-[var(--dash-border)] bg-white shadow-sm">
      <span
        className={`mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-black ${
          toneClasses[tone] || toneClasses.info
        }`}
      >
        {tone === "success" ? "OK" : tone === "error" ? "!" : "i"}
      </span>
      <span className="text-sm font-medium text-[var(--dash-ink)]">{message}</span>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="ml-auto rounded-md px-2 py-1 text-sm font-bold text-[var(--dash-muted)] hover:bg-[var(--dash-fog)]"
          aria-label="Tutup notifikasi"
        >
          x
        </button>
      ) : null}
    </Toast>
  );
}

export function ValidationAlert({ title = "Periksa kembali data", errors = [] }) {
  if (!errors.length) {
    return null;
  }

  return (
    <Alert
      color="failure"
      className="border border-red-200 bg-red-50 text-red-800"
    >
      <span className="font-semibold">{title}</span>
      <ul className="list-disc space-y-1 pl-5">
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
    </Alert>
  );
}

export function ConfirmationModal({
  show,
  title,
  description,
  confirmLabel = "Konfirmasi",
  cancelLabel = "Batal",
  loading = false,
  danger = false,
  onConfirm,
  onClose,
}) {
  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Modal
      show={show}
      size="md"
      dismissible={!loading}
      onClose={handleClose}
      theme={dashboardModalTheme}
      className="z-[200]"
    >
      <ModalHeader>
        <span className="text-slate-900">{title}</span>
      </ModalHeader>
      <ModalBody>
        <div className="flex items-start gap-4">
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg font-black ${
              danger
                ? "bg-red-50 text-red-600 ring-1 ring-red-100"
                : "bg-[var(--dash-fog)] text-[var(--dash-ink)]"
            }`}
            aria-hidden="true"
          >
            {danger ? "!" : "i"}
          </span>
          <div className="text-sm font-medium leading-6 text-slate-700">
            {description}
          </div>
        </div>
      </ModalBody>
      <ModalFooter className="justify-end">
        <DashboardButton
          type="button"
          variant="secondary"
          disabled={loading}
          onClick={handleClose}
        >
          {cancelLabel}
        </DashboardButton>
        <DashboardButton
          type="button"
          variant={danger ? "danger" : "primary"}
          loading={loading}
          onClick={onConfirm}
        >
          {loading ? "Memproses..." : confirmLabel}
        </DashboardButton>
      </ModalFooter>
    </Modal>
  );
}

/**
 * Field wrapper component with label
 */
export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

/**
 * Standard text input component
 */
export function TextInput({ className = "", ...props }) {
  return (
    <FlowbiteTextInput
      {...props}
      sizing="md"
      theme={flowbiteTextInputTheme}
      className={className}
    />
  );
}

function formatReadableDate(value) {
  if (!value) {
    return "";
  }

  const [year, month, day] = String(value).split("-").map(Number);
  if (!year || !month || !day) {
    return "";
  }

  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

export function DateInput({
  value,
  onChange,
  placeholder = "Pilih tanggal acara",
  className = "",
  ...props
}) {
  const readableDate = formatReadableDate(value);
  const inputRef = useRef(null);

  const openPicker = () => {
    const input = inputRef.current;
    if (!input) {
      return;
    }

    if (typeof input.showPicker === "function") {
      input.showPicker();
      return;
    }

    input.focus();
    input.click();
  };

  return (
    <button
      type="button"
      onClick={openPicker}
      className={`group relative flex min-h-[46px] cursor-pointer items-center justify-between gap-3 rounded-xl border border-[var(--dash-border)] bg-white px-3 py-2.5 text-sm transition-colors hover:border-[var(--color-accent-pale)] focus-within:border-[var(--color-accent)] focus-within:ring-2 focus-within:ring-[var(--color-accent)]/20 ${className}`}
    >
      <span className="min-w-0">
        <span
          className={`block truncate font-semibold ${
            readableDate ? "text-[var(--dash-ink)]" : "text-[var(--dash-subtle)]"
          }`}
        >
          {readableDate || placeholder}
        </span>
        {value ? (
          <span className="mt-0.5 block text-xs font-medium text-[var(--dash-muted)]">
            Format tersimpan: {value}
          </span>
        ) : null}
      </span>
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 shrink-0 text-[var(--dash-muted)]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
      <input
        {...props}
        ref={inputRef}
        type="date"
        value={value || ""}
        onChange={onChange}
        className="sr-only"
        tabIndex={-1}
        aria-label={placeholder}
      />
    </button>
  );
}

function normalizeTimeForInput(value = "") {
  const match = String(value).match(/(\d{1,2})[.:](\d{2})/);
  if (!match) {
    return "";
  }

  return `${match[1].padStart(2, "0")}:${match[2]}`;
}

function formatTimeForDisplay(value = "") {
  if (!value) {
    return "";
  }

  return value.replace(":", ".");
}

function parseEventTimeValue(value = "") {
  const raw = String(value).trim();
  const timezone = raw.match(/\b(WIB|WITA|WIT)\b/i)?.[1]?.toUpperCase() || "WIB";
  const withoutTimezone = raw.replace(/\b(WIB|WITA|WIT)\b/i, "").trim();
  const [startText = "", endText = ""] = withoutTimezone
    .replace(/^pukul\s*:?\s*/i, "")
    .split(/\s*[-–—]\s*/);

  return {
    startTime: normalizeTimeForInput(startText),
    endTime: normalizeTimeForInput(endText),
    timezone,
  };
}

function buildEventTimeValue({ startTime, endTime, timezone }) {
  const start = formatTimeForDisplay(startTime);
  const end = formatTimeForDisplay(endTime);
  const zone = timezone || "WIB";

  if (start && end) {
    return `${start} - ${end} ${zone}`;
  }

  if (start) {
    return `${start} ${zone}`;
  }

  return "";
}

export function EventTimeInput({
  value,
  onChange,
  className = "",
}) {
  const parsed = parseEventTimeValue(value);

  const updateTime = (field, nextValue) => {
    onChange(
      buildEventTimeValue({
        ...parsed,
        [field]: nextValue,
      }),
    );
  };

  return (
    <div className={`grid gap-3 sm:grid-cols-[1fr_1fr_110px] ${className}`}>
      <Field label="Jam Mulai">
        <FlowbiteTextInput
          type="time"
          value={parsed.startTime}
          onChange={(event) => updateTime("startTime", event.target.value)}
          sizing="md"
          theme={flowbiteTextInputTheme}
        />
      </Field>
      <Field label="Jam Selesai">
        <FlowbiteTextInput
          type="time"
          value={parsed.endTime}
          onChange={(event) => updateTime("endTime", event.target.value)}
          sizing="md"
          theme={flowbiteTextInputTheme}
        />
      </Field>
      <Field label="Zona">
        <SelectInput
          value={parsed.timezone}
          onChange={(event) => updateTime("timezone", event.target.value)}
        >
          <option value="WIB">WIB</option>
          <option value="WITA">WITA</option>
          <option value="WIT">WIT</option>
        </SelectInput>
      </Field>
      <p className="text-xs font-medium text-[var(--dash-muted)] sm:col-span-3">
        Pratinjau: {value ? `Pukul : ${value}` : "Pilih jam mulai dan jam selesai"}
      </p>
    </div>
  );
}

/**
 * Standard select input component
 */
export function SelectInput({ className = "", ...props }) {
  return (
    <Select
      {...props}
      sizing="md"
      theme={flowbiteSelectTheme}
      className={className}
    />
  );
}

/**
 * Toggle field component for boolean options
 */
export function ToggleField({ checked, label, desc, onChange }) {
  return (
    <div
      className={`flex items-start justify-between gap-4 rounded-[14px] border p-4 transition-colors ${
        checked
          ? "border-[var(--dash-ink)] bg-[var(--dash-fog)]"
          : "border-[var(--dash-border)] bg-white hover:bg-[var(--dash-fog)]"
      }`}
    >
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-[var(--dash-ink)]">
          {label}
        </span>
        <span className="mt-1 block text-sm font-medium leading-6 text-[var(--dash-muted)]">
          {desc}
        </span>
      </span>
      <ToggleSwitch
        checked={checked}
        label=""
        onChange={onChange}
        className="mt-0.5 shrink-0"
        theme={{
          toggle: {
            checked: {
              color: {
                default:
                  "bg-[var(--dash-ink)] group-focus:ring-[var(--color-accent)]/25",
              },
            },
          },
        }}
      />
    </div>
  );
}

/**
 * Mini input variant for compact forms
 */
export function MiniInput(props) {
  return (
    <FlowbiteTextInput
      {...props}
      sizing="sm"
      theme={flowbiteTextInputTheme}
    />
  );
}

/**
 * Textarea variant for multi-line input
 */
export function TextAreaInput({ rows = 4, className = "", ...props }) {
  return (
    <Textarea
      {...props}
      rows={rows}
      className={`${controlBaseClassName} rounded-xl border-[var(--dash-border)] px-3 py-2.5 text-sm leading-6 ${className}`}
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

export function DashboardPanel({
  eyebrow,
  title,
  description,
  children,
  className = "",
  bodyClassName = "",
}) {
  return (
    <section
      className={`overflow-hidden rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-canvas)] shadow-[var(--dash-shadow)] ${className}`}
    >
      <div className="border-b border-[var(--dash-border)] px-5 py-4">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-1 text-2xl font-semibold text-[var(--dash-ink)]">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-sm font-medium text-[var(--dash-muted)]">
            {description}
          </p>
        ) : null}
      </div>
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

export function DashboardCard({ children, className = "" }) {
  return (
    <article
      className={`rounded-[14px] border border-[var(--dash-border)] bg-white p-5 ${className}`}
    >
      {children}
    </article>
  );
}
