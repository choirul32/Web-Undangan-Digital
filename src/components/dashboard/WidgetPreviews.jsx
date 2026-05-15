"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// ============================================================================
// Widget Preview Components
// Used in TemplateAdminPage for live preview of widget configurations
// ============================================================================

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

export function CountdownWidgetPreview({ variant = "cards", enabled = true }) {
  const classes = countdownPreviewClasses(variant);
  const [timeLeft, setTimeLeft] = useState({ days: 30, hours: 8, minutes: 32, seconds: 45 });

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);
    targetDate.setHours(targetDate.getHours() + 8);

    const updateCountdown = () => {
      const now = new Date();
      const diff = Math.max(0, targetDate.getTime() - now.getTime());
      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n) => String(n).padStart(2, "0");
  const previewItems = [
    [pad(timeLeft.days), "Hari"],
    [pad(timeLeft.hours), "Jam"],
    [pad(timeLeft.minutes), "Menit"],
    [pad(timeLeft.seconds), "Detik"],
  ];

  return (
    <div className={`rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-section-soft)] p-4 ${enabled ? "" : "opacity-55"}`}>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-text)]">
          Live Preview
        </p>
        <p className="text-xs font-black text-[var(--color-accent)]">
          {enabled ? variant : "disabled"}
        </p>
      </div>
      <div className="mt-4">
        <div className={classes.container}>
          {previewItems.map(([value, label]) => (
            <div key={label} className={classes.item}>
              <p className={classes.value}>{value}</p>
              <p className={classes.label}>{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
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

export function StoryWidgetPreview({ variant = "card", animation = "fade-up", enabled = true }) {
  const items = [
    { year: "2021", title: "Bertemu" },
    { year: "2024", title: "Lamaran" },
    { year: "2026", title: "Menikah" },
  ];

  const getAnimationProps = (anim, index) => {
    if (anim === "zoom-in") {
      return {
        initial: { opacity: 0, scale: 0.94 },
        whileInView: { opacity: 1, scale: 1 },
        viewport: { once: true, amount: 0.25 },
      };
    }
    if (anim === "slide-left") {
      return {
        initial: { opacity: 0, x: 24 },
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true, amount: 0.25 },
      };
    }
    if (anim === "stagger") {
      return {
        initial: { opacity: 0, x: -30 },
        whileInView: { opacity: 1, x: 0 },
        transition: { delay: index * 0.15, duration: 0.5, ease: "easeOut" },
        viewport: { once: true, amount: 0.25 },
      };
    }
    if (anim === "heartbeat") {
      return {
        initial: { opacity: 0, scale: 0.85 },
        whileInView: { opacity: 1, scale: 1 },
        transition: { delay: index * 0.1, duration: 0.4, ease: "easeOut" },
        viewport: { once: true, amount: 0.25 },
      };
    }
    if (anim === "blur-to-clear") {
      return {
        initial: { opacity: 0, filter: "blur(12px)" },
        whileInView: { opacity: 1, filter: "blur(0px)" },
        transition: { delay: index * 0.08, duration: 0.6, ease: "easeOut" },
        viewport: { once: true, amount: 0.25 },
      };
    }
    if (anim === "scale-bounce") {
      return {
        initial: { opacity: 0, scale: 0.5 },
        whileInView: { opacity: 1, scale: 1 },
        transition: { delay: index * 0.1, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] },
        viewport: { once: true, amount: 0.25 },
      };
    }
    if (anim === "flip") {
      return {
        initial: { opacity: 0, rotateY: 90 },
        whileInView: { opacity: 1, rotateY: 0 },
        transition: { delay: index * 0.1, duration: 0.6, ease: "easeOut" },
        viewport: { once: true, amount: 0.25 },
      };
    }
    return {
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, amount: 0.25 },
    };
  };

  const renderStoryItem = (item, index) => {
    const animProps = getAnimationProps(animation, index);
    return (
      <motion.div
        key={item.year}
        {...animProps}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative rounded-[8px] bg-white p-3 shadow-sm"
      >
        <p className="text-[10px] font-black text-[var(--color-accent)]">{item.year}</p>
        <p className="mt-1 text-sm font-black text-[var(--color-primary)]">{item.title}</p>
      </motion.div>
    );
  };

  const animationKey = `${variant}-${animation}`;

  if (variant === "timeline") {
    return (
      <WidgetPreviewShell title="Live Preview" label={variant} enabled={enabled}>
        <div key={animationKey} className="space-y-3 border-l-2 border-[var(--color-accent)]/50 pl-4">
          {items.map((item, index) => (
            <div key={item.year} className="relative">
              <span className="absolute -left-[23px] top-4 h-3 w-3 rounded-full bg-[var(--color-accent)]" />
              {renderStoryItem(item, index)}
            </div>
          ))}
        </div>
      </WidgetPreviewShell>
    );
  }

  if (variant === "stacked") {
    return (
      <WidgetPreviewShell title="Live Preview" label={variant} enabled={enabled}>
        <div key={animationKey} className="divide-y divide-[var(--color-accent-pale)] rounded-[8px] bg-white shadow-sm">
          {items.map((item, index) => renderStoryItem(item, index))}
        </div>
      </WidgetPreviewShell>
    );
  }

  if (variant === "photo-album") {
    return (
      <WidgetPreviewShell title="Live Preview" label={variant} enabled={enabled}>
        <div key={animationKey} className="grid grid-cols-3 gap-2">
          {items.map((item, index) => (
            <motion.div
              key={item.year}
              {...getAnimationProps(animation, index)}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="group relative aspect-[4/5] overflow-hidden rounded-[8px] bg-white shadow-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-accent-pale)]">
                <span className="text-2xl font-black text-[var(--color-accent)]/30">📷</span>
              </div>
              <p className="absolute bottom-2 left-2 rounded bg-[var(--color-accent)]/90 px-2 py-1 text-xs font-black text-white backdrop-blur-sm">
                {item.year}
              </p>
              <p className="absolute bottom-2 right-2 text-right text-xs font-black text-white [text-shadow:_0_1px_3px_rgba(0,0,0,0.5)]">
                {item.title}
              </p>
            </motion.div>
          ))}
        </div>
      </WidgetPreviewShell>
    );
  }

  return (
    <WidgetPreviewShell title="Live Preview" label={variant} enabled={enabled}>
      <div key={animationKey} className="grid grid-cols-3 gap-2">
        {items.map((item, index) => renderStoryItem(item, index))}
      </div>
    </WidgetPreviewShell>
  );
}

export function GalleryWidgetPreview({ variant = "grid", enabled = true }) {
  const items = Array.from({ length: 6 }, (_, index) => index + 1);

  if (variant === "carousel") {
    return (
      <WidgetPreviewShell title="Live Preview" label={variant} enabled={enabled}>
        <div className="flex gap-2 overflow-hidden">
          {items.slice(0, 4).map((item) => (
            <div key={item} className="flex aspect-[4/5] w-20 shrink-0 items-center justify-center rounded-[8px] border border-dashed border-[var(--color-accent)] bg-white text-xs font-black text-[var(--color-primary)]">
              {item}
            </div>
          ))}
        </div>
      </WidgetPreviewShell>
    );
  }

  if (variant === "masonry") {
    return (
      <WidgetPreviewShell title="Live Preview" label={variant} enabled={enabled}>
        <div className="columns-3 gap-2 space-y-2">
          {items.map((item) => (
            <div
              key={item}
              className={`${item % 3 === 0 ? "h-20" : item % 2 === 0 ? "h-14" : "h-16"} flex break-inside-avoid items-center justify-center rounded-[8px] border border-dashed border-[var(--color-accent-pale)] bg-white text-xs font-black text-[var(--color-primary)]`}
            >
              {item}
            </div>
          ))}
        </div>
      </WidgetPreviewShell>
    );
  }

  return (
    <WidgetPreviewShell title="Live Preview" label={variant} enabled={enabled}>
      <div className="grid grid-cols-3 gap-2">
        {items.map((item) => (
          <div key={item} className="flex aspect-[4/5] items-center justify-center rounded-[8px] border border-dashed border-[var(--color-accent-pale)] bg-white text-xs font-black text-[var(--color-primary)]">
            {item}
          </div>
        ))}
      </div>
    </WidgetPreviewShell>
  );
}

export function EventWidgetPreview({ variant = "cards", enabled = true, showMaps = true, showIcon = true }) {
  const items = ["Akad", "Resepsi"];
  const cardContent = (title) => (
    <>
      <p className="text-[10px] font-black uppercase tracking-[0.1em] text-[var(--color-accent)]">{title}</p>
      <p className="mt-1 text-sm font-black text-[var(--color-primary)]">12 Jun 2026</p>
      <p className="mt-1 text-xs font-black text-[var(--color-primary)]">09.00 WIB</p>
      {showMaps ? (
        <span className="mt-2 inline-flex rounded-lg bg-[var(--color-primary)] px-3 py-1 text-[10px] font-black text-white">
          Maps
        </span>
      ) : null}
    </>
  );

  if (variant === "list") {
    return (
      <WidgetPreviewShell title="Live Preview" label={variant} enabled={enabled}>
        {showIcon ? <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--color-accent)] text-[var(--color-accent)] text-lg font-black">♥</div> : null}
        <div className="divide-y divide-[var(--color-accent-pale)] rounded-[8px] bg-white text-center shadow-sm">
          {items.map((item) => (
            <div key={item} className="p-3">{cardContent(item)}</div>
          ))}
        </div>
      </WidgetPreviewShell>
    );
  }

  if (variant === "elegant") {
    return (
      <WidgetPreviewShell title="Live Preview" label={variant} enabled={enabled}>
        {showIcon ? <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-t-full rounded-b-md border-2 border-[var(--color-accent)] bg-white text-[var(--color-accent)] text-lg font-black">♥</div> : null}
        <div className="grid grid-cols-2 gap-2">
          {items.map((item) => (
            <div key={item} className="rounded-t-full rounded-b-[8px] border border-[var(--color-accent-pale)] bg-white px-2 pb-3 pt-6 text-center shadow-sm">
              {cardContent(item)}
            </div>
          ))}
        </div>
      </WidgetPreviewShell>
    );
  }

  if (variant === "minimal") {
    return (
      <WidgetPreviewShell title="Live Preview" label={variant} enabled={enabled}>
        {showIcon ? <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent)] text-white text-lg font-black">♥</div> : null}
        <div className="space-y-6 border-b border-[var(--color-accent-pale)] pb-6 text-center last:border-0 last:pb-0">
          {items.map((item) => (
            <div key={item} className="flex flex-col items-center">
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[var(--color-accent)]">{item}</p>
              <p className="mt-2 text-sm font-black text-[var(--color-primary)]">12 Jun 2026</p>
              <p className="mt-1 text-xs text-[var(--color-primary-hover)]">09.00 WIB</p>
            </div>
          ))}
        </div>
      </WidgetPreviewShell>
    );
  }

  if (variant === "corner-bracket") {
    return (
      <WidgetPreviewShell title="Live Preview" label={variant} enabled={enabled}>
        {showIcon ? <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center border-2 border-[var(--color-accent)] text-[var(--color-accent)] text-lg font-black">♥</div> : null}
        <div className="grid grid-cols-2 gap-2">
          {items.map((item) => (
            <div key={item} className="relative border border-[var(--color-accent-pale)] bg-white p-3 text-center shadow-sm before:absolute before:top-0 before:left-0 before:h-4 before:w-4 before:border-t-2 before:border-l-2 before:border-[var(--color-accent)] before:content-[''] after:absolute after:bottom-0 after:right-0 after:h-4 after:w-4 after:border-b-2 after:border-r-2 after:border-[var(--color-accent)] after:content-['']">
              {cardContent(item)}
            </div>
          ))}
        </div>
      </WidgetPreviewShell>
    );
  }

  return (
    <WidgetPreviewShell title="Live Preview" label={variant} enabled={enabled}>
      {showIcon ? <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-[8px] border-2 border-[var(--color-accent-pale)] bg-white text-[var(--color-accent)] text-lg font-black">♥</div> : null}
      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => (
          <div key={item} className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-3 text-center shadow-sm">
            {cardContent(item)}
          </div>
        ))}
      </div>
    </WidgetPreviewShell>
  );
}

export function OpeningRevealPreview({ config = {} }) {
  const enabled = Boolean(config.enabled);
  const animation = config.animation || "fade";
  const backgroundColor = config.backgroundColor || "#fbf7ef";
  const useImageBackground = config.backgroundMode === "image";
  const coverImageEnabled = config.coverImageEnabled !== false;
  const isSplit = animation === "curtain" || animation === "gate";
  const panelStyle = useImageBackground
    ? {
        backgroundImage: `url(${config.backgroundImage || "/assets/CoverPasangan.png"})`,
        backgroundSize: "200% 100%",
        backgroundRepeat: "no-repeat",
      }
    : { backgroundColor };

  return (
    <WidgetPreviewShell title="Live Preview" label={animation} enabled={enabled}>
      <div
        className="relative flex aspect-[4/5] min-h-[220px] items-center justify-center overflow-hidden rounded-[8px] border border-[var(--color-accent-pale)] px-4 py-5 text-center"
        style={{ backgroundColor }}
      >
        {useImageBackground && !isSplit ? (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-35"
            style={{ backgroundImage: `url(${config.backgroundImage || "/assets/CoverPasangan.png"})` }}
          />
        ) : null}
        {isSplit ? (
          <>
            <div
              className={`absolute inset-y-0 left-0 w-1/2 ${animation === "gate" ? "border-r border-[var(--color-accent)]/35 bg-white" : "bg-[var(--color-primary)]/10"}`}
              style={{ ...panelStyle, backgroundPosition: "left center" }}
            />
            <div
              className={`absolute inset-y-0 right-0 w-1/2 ${animation === "gate" ? "border-l border-[var(--color-accent)]/35 bg-white" : "bg-[var(--color-primary)]/10"}`}
              style={{ ...panelStyle, backgroundPosition: "right center" }}
            />
          </>
        ) : null}
        <div className="absolute inset-0 bg-white/55" />
        <div className={`relative z-10 mx-auto max-w-[220px] ${animation === "paper" ? "rounded-[8px] border border-[var(--color-accent-pale)] bg-white/80 p-3 shadow-sm" : ""}`}>
          {coverImageEnabled ? (
            <img
              src="/assets/CoverPasangan.png"
              alt=""
              className="mx-auto mb-3 aspect-[3/4] w-16 rounded-t-full rounded-b-md object-cover shadow-sm"
            />
          ) : null}
          <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[var(--color-accent)]">
            The Wedding Of
          </p>
          <p className="mt-1 font-serif text-xl font-black leading-none text-[var(--color-primary)]">
            Dimas & Salsa
          </p>
          <div className="mx-auto mt-3 rounded-[8px] border border-[var(--color-accent-pale)] bg-white/80 px-3 py-2">
            <p className="text-[9px] font-black uppercase tracking-[0.1em] text-[var(--color-accent)]">
              Kepada Yth.
            </p>
            <p className="mt-1 text-xs font-black text-[var(--color-primary)]">
              Tamu Undangan
            </p>
          </div>
          <span className="mt-3 inline-flex rounded-xl bg-[var(--color-primary)] px-4 py-2 text-[10px] font-black text-white">
            {config.buttonText || "Buka Undangan"}
          </span>
        </div>
      </div>
    </WidgetPreviewShell>
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

export function CoverSectionPreview({ config = {} }) {
  const backgroundColor = config.backgroundColor || "#fbf7ef";
  const useImageBackground = config.backgroundMode === "image";
  const layout = config.layout || "centered";
  const dateVariant = config.dateVariant || "separator-dot";
  const guestBlockStyle = config.guestBlockStyle || "card";
  const openingAnimation = config.openingAnimation || "fade-up";

  // Simple date display matching variants
  const renderDate = () => {
    if (dateVariant === "plain") {
      return <p className="mt-1.5 text-[8px] font-black text-[var(--color-primary)]">12 Juni 2026</p>;
    }
    if (dateVariant === "separator-dot") {
      return <p className="mt-1.5 text-[8px] font-black text-[var(--color-primary)]">12 <span className="text-[var(--color-accent)]">·</span> Juni <span className="text-[var(--color-accent)]">·</span> 2026</p>;
    }
    if (dateVariant === "separator-line") {
      return (
        <div className="mt-1.5 flex items-center justify-center gap-1.5">
          <span className="h-px w-4 bg-[var(--color-accent)]" />
          <p className="text-[8px] font-black text-[var(--color-primary)]">12 Juni 2026</p>
          <span className="h-px w-4 bg-[var(--color-accent)]" />
        </div>
      );
    }
    if (dateVariant === "stacked") {
      return (
        <div className="mt-1.5 text-center">
          <p className="text-lg font-black leading-none text-[var(--color-primary)]">12</p>
          <p className="text-[7px] font-black uppercase tracking-wider text-[var(--color-accent)]">Juni</p>
          <p className="text-[7px] text-[var(--color-text)]">2026</p>
        </div>
      );
    }
    if (dateVariant === "badge") {
      return (
        <div className="mx-auto mt-1.5 inline-flex rounded-full border border-[var(--color-accent-pale)] bg-white/80 px-2.5 py-1">
          <p className="text-[7px] font-black text-[var(--color-primary)]">12 Juni 2026</p>
        </div>
      );
    }
    if (dateVariant === "columns") {
      return (
        <div className="mx-auto mt-1.5 flex items-center justify-center gap-0">
          <span className="border-r border-[var(--color-accent-pale)] px-1.5 text-[7px] font-black text-[var(--color-accent)]">Jun</span>
          <span className="border-r border-[var(--color-accent-pale)] px-1.5 text-sm font-black text-[var(--color-primary)]">12</span>
          <span className="px-1.5 text-[7px] font-black text-[var(--color-accent)]">2026</span>
        </div>
      );
    }
    if (dateVariant === "full-day") {
      return (
        <div className="mt-1.5 text-center">
          <p className="text-[7px] font-black uppercase tracking-wider text-[var(--color-accent)]">Jumat</p>
          <div className="flex items-center justify-center gap-1">
            <span className="h-px w-3 bg-[var(--color-accent-pale)]" />
            <p className="text-[8px] font-black text-[var(--color-primary)]">12 Juni 2026</p>
            <span className="h-px w-3 bg-[var(--color-accent-pale)]" />
          </div>
        </div>
      );
    }
    if (dateVariant === "block") {
      return (
        <div className="mx-auto mt-1.5 grid max-w-[120px] grid-cols-3 divide-x divide-[var(--color-accent-pale)] rounded border border-[var(--color-accent-pale)] bg-white/80 py-1">
          <div className="text-center"><p className="text-[9px] font-black text-[var(--color-primary)]">12</p></div>
          <div className="text-center"><p className="text-[9px] font-black text-[var(--color-primary)]">Jun</p></div>
          <div className="text-center"><p className="text-[9px] font-black text-[var(--color-primary)]">2026</p></div>
        </div>
      );
    }
    return <p className="mt-1.5 text-[8px] font-black text-[var(--color-primary)]">12 · Juni · 2026</p>;
  };

  const renderGuestBlock = () => {
    if (guestBlockStyle === "hidden") return null;
    const blockClass = guestBlockStyle === "pill"
      ? "mt-2 rounded-full border border-[var(--color-accent-pale)] bg-white/80 px-3 py-1"
      : guestBlockStyle === "minimal"
        ? "mt-2 border-t border-[var(--color-accent-pale)] px-2 py-1"
        : "mt-2 rounded border border-[var(--color-accent-pale)] bg-white/80 px-3 py-1.5";
    return (
      <div className={blockClass}>
        <p className="text-[6px] font-black uppercase tracking-wider text-[var(--color-accent)]">Kepada Yth.</p>
        <p className="text-[8px] font-black text-[var(--color-primary)]">Tamu Undangan</p>
      </div>
    );
  };

  return (
    <WidgetPreviewShell title="Live Preview" label={`${layout} · ${dateVariant}`} enabled>
      <motion.div
        key={`cover-${openingAnimation}-${dateVariant}`}
        initial={{ opacity: 0, y: openingAnimation === "fade-up" ? 12 : 0, scale: openingAnimation === "zoom-in" || openingAnimation === "pop-up" ? 0.92 : 1 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative flex aspect-[9/16] min-h-[280px] items-center justify-center overflow-hidden rounded-[16px] border-[3px] border-[var(--color-primary)]/70 px-4 py-5 text-center"
        style={{ backgroundColor }}
      >
        {useImageBackground ? (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-35"
            style={{ backgroundImage: `url(${config.backgroundImage || "/assets/CoverPasangan.png"})` }}
          />
        ) : null}
        <div className="absolute inset-0 bg-white/55" />
        <div
          className={`relative z-10 mx-auto grid max-w-[250px] gap-2 ${layout === "split" ? "grid-cols-[0.8fr_1fr] items-center text-left" : "text-center"}`}
        >
          {config.photoEnabled && layout !== "minimal" ? (
            <img
              src="/assets/CoverPasangan.png"
              alt=""
              className="mx-auto aspect-[3/4] w-14 rounded-t-full rounded-b-md object-cover shadow-sm"
            />
          ) : null}
          <div className={layout === "split" && config.photoEnabled ? "" : "col-span-full"}>
            <p className="text-[7px] font-black uppercase tracking-[0.16em] text-[var(--color-accent)]">
              The Wedding Of
            </p>
            <p className="mt-1 font-serif text-lg font-black leading-none text-[var(--color-primary)]">
              Dimas & Salsa
            </p>
            {renderDate()}
            <p className="mx-auto mt-1.5 max-w-[180px] text-[7px] font-semibold leading-tight text-[var(--color-text)]">
              Dan di antara tanda-tanda kekuasaan-Nya...
            </p>
            {renderGuestBlock()}
          </div>
        </div>
      </motion.div>
    </WidgetPreviewShell>
  );
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

export function CoupleSectionPreview({ config = {} }) {
  const profiles = [
    ["Salsa Kirana", "/assets/catin_wanita.jpg", "Mempelai Wanita"],
    ["Dimas Pratama", "/assets/catin_pria.jpg", "Mempelai Pria"],
  ];

  return (
    <WidgetPreviewShell title="Live Preview" label={config.photoStyle || "arch"} enabled>
      <div className="grid grid-cols-2 gap-2">
        {profiles.map(([name, image, role]) => (
          <div key={name} className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-3 text-center shadow-sm">
            {config.photoEnabled ? (
              <img src={image} alt="" className={couplePreviewImageClass(config)} />
            ) : null}
            <p className={couplePreviewNameClass(config)}>{name}</p>
            {config.parentTextEnabled ? (
              <p className="mt-1 text-[10px] font-semibold text-[var(--color-text)]">
                {role}
              </p>
            ) : null}
            {config.instagramEnabled ? (
              <span className="mt-2 inline-flex rounded-lg bg-[var(--color-accent)] px-2 py-1 text-[9px] font-black text-[var(--color-primary)]">
                Instagram
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </WidgetPreviewShell>
  );
}

export function OrnamentSectionCanvasPreview({ section = "home", styleConfig = {} }) {
  const bgColor = styleConfig.backgroundColor || "#f8f5ef";
  const textColor = styleConfig.textColor || "#0f2a52";
  const accentColor = styleConfig.accentColor || "#d2a84d";
  const label = section === "acara" ? "events" : section;

  if (label === "home") {
    return (
      <div className="relative h-full w-full p-4" style={{ backgroundColor: bgColor, color: textColor }}>
        <div className="mx-auto mt-8 max-w-[220px] text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.14em]" style={{ color: accentColor }}>
            The Wedding Of
          </p>
          <p className="mt-2 font-serif text-xl font-black">Dimas & Salsa</p>
          <div className="mx-auto mt-4 max-w-[170px] rounded-[8px] border bg-white/75 px-3 py-2 text-xs font-black">
            Kepada Yth. Tamu Undangan
          </div>
        </div>
      </div>
    );
  }

  if (label === "couple") {
    return (
      <div className="h-full w-full p-4" style={{ backgroundColor: bgColor, color: textColor }}>
        <div className="mt-6 grid grid-cols-2 gap-2">
          {["Mempelai Wanita", "Mempelai Pria"].map((item) => (
            <div key={item} className="rounded-[8px] border bg-white/75 p-3 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-[var(--color-bg)]" />
              <p className="mt-2 text-[11px] font-black">{item}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (label === "events") {
    return (
      <div className="h-full w-full p-4" style={{ backgroundColor: bgColor, color: textColor }}>
        <div className="mt-5 space-y-2">
          {["Akad Nikah", "Resepsi"].map((item) => (
            <div key={item} className="rounded-[8px] border bg-white/78 p-3 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.1em]" style={{ color: accentColor }}>
                {item}
              </p>
              <p className="mt-1 text-xs font-black">12 Juni 2026 • 09:00</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (label === "story") {
    return (
      <div className="h-full w-full p-4" style={{ backgroundColor: bgColor, color: textColor }}>
        <div className="mt-4 space-y-2 border-l-2 border-[var(--color-accent)]/50 pl-4">
          {["2021", "2024", "2026"].map((year, index) => (
            <div key={year} className="relative">
              <span className="absolute -left-[21px] top-3 h-2.5 w-2.5 rounded-full bg-[var(--color-accent)]" />
              <div className="rounded-[8px] border bg-white/75 p-2">
                <p className="text-[9px] font-black" style={{ color: accentColor }}>{year}</p>
                <p className="text-[10px] font-black">{["Bertemu", "Lamaran", "Menikah"][index]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (label === "gallery") {
    return (
      <div className="h-full w-full p-4" style={{ backgroundColor: bgColor, color: textColor }}>
        <div className="mt-4 grid grid-cols-3 gap-1.5">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="aspect-square rounded-[4px] border border-dashed border-[var(--color-accent)]/40 bg-white/60" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full p-4" style={{ backgroundColor: bgColor, color: textColor }}>
      <div className="flex h-full items-center justify-center">
        <p className="text-xs font-black uppercase tracking-[0.1em]" style={{ color: accentColor }}>
          {section}
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// Utility Functions
// ============================================================================

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

export function MusicPlayerPreview({ variant = "floating", position = "bottom-right", enabled = true, showTrackInfo = true, showProgress = true, pulseSync = false }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(35);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 2));
    }, 300);
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!enabled) {
    return (
      <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-section-soft)] p-4 opacity-55">
        <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-text)]">
          Music Preview
        </p>
        <p className="mt-2 text-xs font-black text-[var(--color-accent)]">disabled</p>
      </div>
    );
  }

  // Position classes for the player inside the phone frame
  const posClasses = {
    "bottom-right": "bottom-3 right-3",
    "bottom-left": "bottom-3 left-3",
    "top-right": "top-10 right-3",
    "top-left": "top-10 left-3",
  }[position] || "bottom-3 right-3";

  const barPosClass = position.includes("top") ? "top-8" : "bottom-0";

  // Floating player widget
  const FloatingWidget = () => (
    <div className={`absolute ${posClasses} z-10`}>
      <div className="flex items-center gap-2 rounded-full border border-[var(--color-accent-pale)]/60 bg-white/95 py-1.5 pl-1.5 pr-3 shadow-lg backdrop-blur-sm" style={{ fontSize: "0px" }}>
        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white"
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z" /></svg>
          )}
        </button>
        <div className="min-w-0">
          {showTrackInfo ? (
            <p className="truncate text-[8px] font-black leading-tight text-[var(--color-primary)]">Wedding Music</p>
          ) : null}
          {showProgress ? (
            <div className="mt-0.5 h-[3px] w-16 overflow-hidden rounded-full bg-[var(--color-accent-pale)]">
              <div className="h-full rounded-full bg-[var(--color-accent)] transition-all" style={{ width: `${progress}%` }} />
            </div>
          ) : null}
        </div>
        {isPlaying ? (
          <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0 text-[var(--color-accent)]" fill="currentColor">
            <rect x="4" y="10" width="3" height="10" rx="1.5"><animate attributeName="height" values="10;16;10" dur="0.8s" repeatCount="indefinite" /><animate attributeName="y" values="10;7;10" dur="0.8s" repeatCount="indefinite" /></rect>
            <rect x="10.5" y="6" width="3" height="14" rx="1.5"><animate attributeName="height" values="14;8;14" dur="0.6s" repeatCount="indefinite" /><animate attributeName="y" values="6;10;6" dur="0.6s" repeatCount="indefinite" /></rect>
            <rect x="17" y="8" width="3" height="12" rx="1.5"><animate attributeName="height" values="12;18;12" dur="0.7s" repeatCount="indefinite" /><animate attributeName="y" values="8;4;8" dur="0.7s" repeatCount="indefinite" /></rect>
          </svg>
        ) : null}
      </div>
    </div>
  );

  // Minimal player widget (just a circle button)
  const MinimalWidget = () => (
    <div className={`absolute ${posClasses} z-10`}>
      <button
        type="button"
        onClick={() => setIsPlaying(!isPlaying)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-accent-pale)]/60 bg-white/95 text-[var(--color-primary)] shadow-lg backdrop-blur-sm"
      >
        {isPlaying ? (
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z" /></svg>
        )}
        {isPlaying ? (
          <span className="absolute inset-0 animate-ping rounded-full border-2 border-[var(--color-accent)] opacity-30" />
        ) : null}
        {showProgress && isPlaying ? (
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="16" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeDasharray={`${(progress / 100) * 100.5} 100.5`} strokeLinecap="round" opacity="0.6" />
          </svg>
        ) : null}
      </button>
    </div>
  );

  // Bar player widget
  const BarWidget = () => (
    <div className={`absolute ${barPosClass} left-0 right-0 z-10 border-t border-[var(--color-accent-pale)]/40 bg-white/95 px-3 py-2 backdrop-blur-sm`}>
      {showProgress ? (
        <div className="absolute left-0 right-0 top-0 h-[2px] bg-[var(--color-accent-pale)]">
          <div className="h-full bg-[var(--color-accent)] transition-all" style={{ width: `${progress}%` }} />
        </div>
      ) : null}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white"
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="currentColor"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="currentColor"><path d="M8 5.14v14l11-7-11-7z" /></svg>
          )}
        </button>
        {showTrackInfo ? (
          <div className="min-w-0 flex-1">
            <p className="truncate text-[8px] font-black text-[var(--color-primary)]">Wedding Music</p>
            <p className="text-[7px] font-semibold text-[var(--color-text)]">1:12 / 3:45</p>
          </div>
        ) : null}
        {isPlaying ? (
          <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0 text-[var(--color-accent)]" fill="currentColor">
            <rect x="4" y="10" width="3" height="10" rx="1.5"><animate attributeName="height" values="10;16;10" dur="0.8s" repeatCount="indefinite" /><animate attributeName="y" values="10;7;10" dur="0.8s" repeatCount="indefinite" /></rect>
            <rect x="10.5" y="6" width="3" height="14" rx="1.5"><animate attributeName="height" values="14;8;14" dur="0.6s" repeatCount="indefinite" /><animate attributeName="y" values="6;10;6" dur="0.6s" repeatCount="indefinite" /></rect>
            <rect x="17" y="8" width="3" height="12" rx="1.5"><animate attributeName="height" values="12;18;12" dur="0.7s" repeatCount="indefinite" /><animate attributeName="y" values="8;4;8" dur="0.7s" repeatCount="indefinite" /></rect>
          </svg>
        ) : null}
      </div>
    </div>
  );

  return (
    <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-section-soft)] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-text)]">
          Live Preview
        </p>
        <p className="text-xs font-black text-[var(--color-accent)]">{variant}</p>
      </div>
      {/* Phone frame mockup */}
      <div className="mx-auto mt-4 w-[180px]">
        <div className="relative overflow-hidden rounded-[20px] border-[3px] border-[var(--color-primary)]/80 bg-[var(--color-bg)] shadow-xl">
          {/* Notch */}
          <div className="mx-auto h-5 w-16 rounded-b-lg bg-[var(--color-primary)]/80" />
          {/* Screen content */}
          <div className="relative h-[300px] overflow-hidden">
            {/* Fake invitation content */}
            <div className="flex h-full flex-col items-center justify-center px-4 text-center">
              <p className="text-[7px] font-black uppercase tracking-[0.2em] text-[var(--color-accent)]">The Wedding Of</p>
              <p className="mt-1 font-serif text-sm font-black text-[var(--color-primary)]">Dimas & Salsa</p>
              <p className="mt-2 text-[7px] font-semibold text-[var(--color-text)]">12 Juni 2026</p>
              {/* Fake ornament dots for pulse sync demo */}
              {pulseSync ? (
                <div className="mt-4 flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-3 w-3 rounded-full bg-[var(--color-accent)]/40"
                      style={{
                        animation: isPlaying ? `music-pulse-subtle 1.8s ease-in-out ${i * 0.3}s infinite` : "none",
                      }}
                    />
                  ))}
                </div>
              ) : null}
            </div>
            {/* Player widget positioned inside the phone */}
            {variant === "floating" ? <FloatingWidget /> : null}
            {variant === "minimal" ? <MinimalWidget /> : null}
            {variant === "bar" ? <BarWidget /> : null}
          </div>
          {/* Home indicator */}
          <div className="mx-auto mb-2 mt-1 h-1 w-10 rounded-full bg-[var(--color-primary)]/30" />
        </div>
      </div>
      {pulseSync ? (
        <p className="mt-3 text-center text-[10px] font-black text-[var(--color-wa)]">♫ Ornament pulse sync aktif</p>
      ) : null}
    </div>
  );
}
