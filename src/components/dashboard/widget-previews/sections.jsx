"use client";

import { motion } from "framer-motion";
import { OpeningSequenceAsset } from "../../../templates/components/OpeningSequence";
import { WidgetPreviewShell, coverPreviewMotionClass, couplePreviewImageClass, couplePreviewNameClass, parseOrnamentSize } from "./shared";

export function OpeningRevealPreview({ config = {} }) {
  const enabled = Boolean(config.enabled);
  const animation = config.animation || "fade";
  const backgroundColor = config.backgroundColor || "#fbf7ef";
  const useImageBackground = config.backgroundMode === "image";
  const coverImageEnabled = config.coverImageEnabled !== false;
  const openingAsset = config.asset || {};
  const hasOpeningAsset = Boolean(
    openingAsset.type &&
      openingAsset.type !== "motion" &&
      (openingAsset.src || openingAsset.poster || openingAsset.frames?.length),
  );
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
        {hasOpeningAsset ? (
          <>
            <OpeningSequenceAsset asset={openingAsset} isOpening={false} />
            <span className="absolute left-3 top-3 z-20 rounded-full bg-black/45 px-3 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-white backdrop-blur">
              Asset {openingAsset.type}
            </span>
          </>
        ) : null}
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
          {config.photoEnabled ? (
            <img
              src="/assets/CoverPasangan.png"
              alt=""
              className={`mx-auto object-cover shadow-sm ${
                layout === "stacked"
                  ? "aspect-[4/3] w-24 rounded-md"
                  : "aspect-[3/4] w-14 rounded-t-full rounded-b-md"
              }`}
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

export function CoupleSectionPreview({ config = {} }) {
  const profiles = [
    {
      name: "Salsa Kirana",
      image: "/assets/catin_wanita.jpg",
      role: "Mempelai Wanita",
      parentLabel: "Putri dari",
      parents: "Bapak Hasan & Ibu Wulan",
    },
    {
      name: "Dimas Pratama",
      image: "/assets/catin_pria.jpg",
      role: "Mempelai Pria",
      parentLabel: "Putra dari",
      parents: "Bapak Anwar & Ibu Lestari",
    },
  ];

  return (
    <WidgetPreviewShell title="Live Preview" label={config.photoStyle || "arch"} enabled>
      <div className="grid grid-cols-2 gap-3">
        {profiles.map((profile) => (
          <div key={profile.name} className="rounded-[12px] border border-[var(--color-accent-pale)] bg-white p-3 text-center shadow-sm">
            <p className="mb-2 text-[8px] font-black uppercase tracking-[0.16em] text-[var(--color-accent)]">
              {profile.role}
            </p>
            {config.photoEnabled ? (
              <img src={profile.image} alt="" className={couplePreviewImageClass(config)} />
            ) : null}
            <p className={couplePreviewNameClass(config)}>{profile.name}</p>
            {config.parentTextEnabled ? (
              <div className="mx-auto mt-2 max-w-[130px] border-t border-[var(--color-accent-pale)] pt-2">
                <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-[var(--color-accent)]">
                  {profile.parentLabel}
                </p>
                <p className="mt-1 text-[10px] font-semibold leading-4 text-[var(--color-text)]">
                  {profile.parents}
                </p>
              </div>
            ) : null}
            {config.instagramEnabled ? (
              <span className="mt-3 inline-flex rounded-lg bg-[var(--color-accent)] px-2 py-1 text-[9px] font-black text-[var(--color-primary)]">
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
