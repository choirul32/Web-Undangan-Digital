export function countdownPreviewClasses(variant = "cards") {
  if (variant === "minimal") {
    return {
      container: "grid grid-cols-4 gap-2 border-y border-[var(--color-accent-pale)] py-4",
      item: "px-2 text-center",
      value: "text-2xl font-black text-[var(--color-primary)]",
      label: "mt-1 text-[10px] font-black uppercase tracking-[0.12em] text-[var(--color-text)]",
    };
  }

  if (variant === "circle") {
    return {
      container: "grid grid-cols-4 gap-3",
      item: "flex aspect-square flex-col items-center justify-center rounded-full border border-[var(--color-accent)] bg-white shadow-lg shadow-[var(--color-primary)]/8",
      value: "text-xl font-black text-[var(--color-primary)]",
      label: "mt-1 text-[9px] font-black uppercase tracking-[0.08em] text-[var(--color-text)]",
    };
  }

  if (variant === "flip-clock") {
    return {
      container: "grid grid-cols-4 gap-2 md:gap-4",
      item: "flex flex-col items-center",
      value: "text-3xl md:text-4xl font-black text-[var(--color-primary)] [text-shadow:_0_2px_4px_rgba(0,0,0,0.1)]",
      label: "mt-1 text-[9px] font-black uppercase tracking-[0.1em] text-[var(--color-accent)]",
    };
  }

  if (variant === "ring") {
    return {
      container: "grid grid-cols-4 gap-3 md:gap-4",
      item: "flex flex-col items-center justify-center rounded-full border-4 border-[var(--color-accent)] bg-white shadow-lg shadow-[var(--color-primary)]/10 aspect-square",
      value: "text-2xl md:text-3xl font-black text-[var(--color-primary)] leading-none",
      label: "text-[9px] md:text-[10px] font-black uppercase tracking-[0.08em] text-[var(--color-accent)] mt-1",
    };
  }

  if (variant === "neon-glow") {
    return {
      container: "grid grid-cols-4 gap-4",
      item: "flex flex-col items-center justify-center px-4 py-6",
      value: "text-4xl md:text-5xl font-black text-[var(--color-accent)] [text-shadow:_0_0_10px_var(--color-accent),_0_0_20px_var(--color-accent),_0_0_40px_var(--color-accent)]",
      label: "mt-2 text-[10px] font-black uppercase tracking-[0.12em] text-[var(--color-text)]",
    };
  }

  return {
    container: "grid grid-cols-4 gap-3",
    item: "rounded-[8px] bg-white px-3 py-4 text-center shadow-lg shadow-[var(--color-primary)]/8",
    value: "text-2xl font-black text-[var(--color-primary)]",
    label: "mt-1 text-xs font-black uppercase tracking-[0.12em] text-[var(--color-text)]",
  };
}

export function WidgetPreviewShell({ title, label, enabled = true, children }) {
  return (
    <div className={`rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-section-soft)] p-4 ${enabled ? "" : "opacity-55"}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-text)]">
          {title}
        </p>
        <p className="text-xs font-black text-[var(--color-accent)]">
          {enabled ? label : "disabled"}
        </p>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function coverPreviewMotionClass(animation = "fade-up") {
  if (animation === "zoom-in") {
    return "scale-95";
  }

  if (animation === "slide-left") {
    return "translate-x-2";
  }

  if (animation === "pop-up") {
    return "scale-90";
  }

  return "";
}

export function couplePreviewImageClass(config = {}) {
  const shape =
    config.photoStyle === "circle"
      ? "aspect-square rounded-full"
      : config.photoStyle === "square"
        ? "aspect-[4/5] rounded-[8px]"
        : "aspect-[3/4] rounded-t-full rounded-b-md";
  const border = config.borderEnabled ? "border-4 border-white" : "";

  return `${shape} ${border} mx-auto w-16 object-cover shadow-sm`;
}

export function couplePreviewNameClass(config = {}) {
  if (config.fontPreset === "sans") {
    return "mt-2 text-sm font-black text-[var(--color-primary)]";
  }

  if (config.fontPreset === "script") {
    return "mt-2 font-serif text-lg italic text-[var(--color-primary)]";
  }

  return "mt-2 font-serif text-base font-black text-[var(--color-primary)]";
}

export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function parseOrnamentSize(value) {
  if (typeof value === "number") {
    return `${value}px`;
  }
  if (typeof value === "string") {
    if (value === "auto" || value === "contain" || value === "cover" || value === "inherit") {
      return value;
    }
    if (value.endsWith("px") || value.endsWith("%") || value.endsWith("em") || value.endsWith("rem") || value.startsWith("calc")) {
      return value;
    }
    return `${value}px`;
  }
  return "100px";
}

export function slugifyTemplateId(value) {
  return (value || "template-baru")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
