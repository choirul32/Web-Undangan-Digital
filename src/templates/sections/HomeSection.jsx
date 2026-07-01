import { motion } from "framer-motion";
import OrnamentLayer from "../components/OrnamentLayer";
import { coverMotion } from "../utils/templateStyling";
import { getSectionOrnaments } from "../designConfigs";

export function CoverDateDisplay({ date, variant = "separator-dot", compact = false }) {
  const d = new Date(date);
  const day = d.getDate();
  const weekday = d.toLocaleDateString("id-ID", { weekday: "long" });
  const monthLong = d.toLocaleDateString("id-ID", { month: "long" });
  const monthShort = d.toLocaleDateString("id-ID", { month: "short" });
  const year = d.getFullYear();
  const baseTextClass = `font-black text-[var(--color-primary)] ${
    compact ? "text-[12px]" : "text-lg"
  }`;
  const smallTextClass = compact ? "text-[9px]" : "text-xs";

  if (variant === "plain") {
    return <p className={`${baseTextClass} mt-3 tracking-[0.08em]`}>{day} {monthLong} {year}</p>;
  }

  if (variant === "separator-line") {
    return (
      <div className="mt-3 flex items-center justify-center gap-3">
        <span className="h-px w-8 bg-[var(--color-accent)]" />
        <p className={`${baseTextClass} tracking-[0.08em]`}>{day} {monthLong} {year}</p>
        <span className="h-px w-8 bg-[var(--color-accent)]" />
      </div>
    );
  }

  if (variant === "stacked") {
    return (
      <div className="mt-3 text-center">
        <p className={`font-black leading-none text-[var(--color-primary)] ${compact ? "text-3xl" : "text-5xl"}`}>{day}</p>
        <p className={`${smallTextClass} mt-1 font-black uppercase tracking-[0.22em] text-[var(--color-accent)]`}>{monthLong}</p>
        <p className={`${smallTextClass} mt-0.5 font-bold tracking-[0.12em] text-[var(--color-text)]`}>{year}</p>
      </div>
    );
  }

  if (variant === "badge") {
    return (
      <div className="mx-auto mt-3 inline-flex rounded-full border border-[var(--color-accent-pale)] bg-[var(--color-surface)]/88 px-4 py-2 shadow-lg shadow-[var(--color-primary)]/8">
        <p className={`${smallTextClass} font-black uppercase tracking-[0.14em] text-[var(--color-primary)]`}>
          {day} {monthLong} {year}
        </p>
      </div>
    );
  }

  if (variant === "columns") {
    return (
      <div className="mx-auto mt-3 grid max-w-[220px] grid-cols-3 divide-x divide-[var(--color-accent-pale)] border-y border-[var(--color-accent-pale)] py-2">
        <p className={`${smallTextClass} font-black uppercase tracking-[0.16em] text-[var(--color-accent)]`}>{monthShort}</p>
        <p className={`font-black leading-none text-[var(--color-primary)] ${compact ? "text-xl" : "text-2xl"}`}>{day}</p>
        <p className={`${smallTextClass} font-black tracking-[0.12em] text-[var(--color-accent)]`}>{year}</p>
      </div>
    );
  }

  if (variant === "full-day") {
    return (
      <div className="mt-3 text-center">
        <p className={`${smallTextClass} font-black uppercase tracking-[0.22em] text-[var(--color-accent)]`}>{weekday}</p>
        <div className="mt-1 flex items-center justify-center gap-3">
          <span className="h-px w-7 bg-[var(--color-accent-pale)]" />
          <p className={`${baseTextClass} tracking-[0.08em]`}>{day} {monthLong} {year}</p>
          <span className="h-px w-7 bg-[var(--color-accent-pale)]" />
        </div>
      </div>
    );
  }

  if (variant === "block") {
    return (
      <div className="mx-auto mt-3 grid max-w-[230px] grid-cols-3 divide-x divide-[var(--color-accent-pale)] rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)]/88 py-2 shadow-lg shadow-[var(--color-primary)]/8">
        <div>
          <p className={`font-black leading-none text-[var(--color-primary)] ${compact ? "text-lg" : "text-2xl"}`}>{day}</p>
          <p className={`${smallTextClass} mt-1 font-bold uppercase tracking-[0.14em] text-[var(--color-accent)]`}>Tgl</p>
        </div>
        <div>
          <p className={`font-black leading-none text-[var(--color-primary)] ${compact ? "text-lg" : "text-2xl"}`}>{monthShort}</p>
          <p className={`${smallTextClass} mt-1 font-bold uppercase tracking-[0.14em] text-[var(--color-accent)]`}>Bln</p>
        </div>
        <div>
          <p className={`font-black leading-none text-[var(--color-primary)] ${compact ? "text-lg" : "text-2xl"}`}>{year}</p>
          <p className={`${smallTextClass} mt-1 font-bold uppercase tracking-[0.14em] text-[var(--color-accent)]`}>Thn</p>
        </div>
      </div>
    );
  }

  return (
    <p
      className={`font-black tracking-[0.12em] text-[var(--color-primary)] ${
        compact ? "mt-3 text-[12px]" : "mt-5 text-lg"
      }`}
    >
      {day} <span className="text-[var(--color-accent)]">·</span> {monthLong} <span className="text-[var(--color-accent)]">·</span> {year}
    </p>
  );
}

export default function HomeSection({
  designConfig,
  coverConfig,
  couple,
  events,
  personalizedGuestName,
  profileImages,
  isCompactHomePreview,
  showGuestGreeting = true,
}) {
  const coverBackgroundColor = coverConfig.backgroundColor || "#fbf7ef";
  const coverBackgroundImage = coverConfig.backgroundMode === "image" ? coverConfig.backgroundImage : "";
  const photoStyle = coverConfig.photoStyle || "arch";
  const photoShapeClass =
    photoStyle === "circle"
      ? "aspect-square rounded-full"
      : photoStyle === "square"
        ? "aspect-[4/5] rounded-[8px]"
        : coverConfig.layout === "stacked"
          ? "aspect-[4/3] rounded-[18px]"
          : "aspect-[3/4] rounded-t-full rounded-b-[18px]";
  const compactPhotoSizeClass =
    photoStyle === "circle"
      ? "mb-2 w-24 sm:w-28"
      : coverConfig.layout === "stacked"
        ? "mb-2 w-32 sm:w-40"
        : "mb-2 w-20 sm:w-24";
  const fullPhotoSizeClass =
    photoStyle === "circle"
      ? "mb-4 w-36 sm:mb-8 sm:w-52"
      : coverConfig.layout === "stacked"
        ? "mb-4 w-48 sm:mb-8 sm:w-80"
        : "mb-4 w-28 sm:mb-8 sm:w-56";

  return (
    <section
      id="section-home"
      data-preview-section="home"
      className={`relative isolate flex items-center justify-center overflow-hidden px-6 text-center ${
        isCompactHomePreview ? "min-h-[100svh] py-4 px-3" : "min-h-screen py-20"
      }`}
      style={{ backgroundColor: coverBackgroundColor }}
    >
      {coverBackgroundImage ? <img src={coverBackgroundImage} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" /> : null}
      <div className="absolute inset-0 -z-10 bg-[var(--color-bg)]/78" />
      <OrnamentLayer ornaments={getSectionOrnaments(designConfig, "home")} />
      <motion.div
        {...coverMotion(coverConfig.openingAnimation)}
        transition={{ duration: 0.72, ease: "easeOut" }}
        className={`relative z-10 mx-auto max-w-4xl ${
          coverConfig.layout === "split"
            ? "lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12 lg:text-left"
            : ""
        } ${isCompactHomePreview ? "max-w-[220px] scale-[0.74] origin-center sm:max-w-[260px] sm:scale-[0.84]" : ""}`}
      >
        {coverConfig.photoEnabled ? (
          <img
            src={profileImages[0]}
            alt={`${couple.groomNickname} dan ${couple.brideNickname}`}
            className={`mx-auto object-cover shadow-2xl shadow-[var(--color-primary)]/12 ${
              photoShapeClass
            } ${
              isCompactHomePreview
                ? compactPhotoSizeClass
                : fullPhotoSizeClass
            }`}
          />
        ) : null}
        <div>
          <p
            className={`${
              isCompactHomePreview ? "text-[9px] tracking-[0.2em]" : "text-sm tracking-[0.24em]"
            } font-black uppercase text-[var(--color-accent)]`}
          >
            The Wedding Of
          </p>
          <h1
            className={`mt-2 font-serif font-black leading-[0.94] text-[var(--color-heading)] ${
              isCompactHomePreview ? "text-[22px] sm:text-[26px]" : "text-4xl sm:text-7xl"
            }`}
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {couple.groomNickname} & {couple.brideNickname}
          </h1>
          {events[0]?.date ? (
            <div className={isCompactHomePreview ? "mt-3" : "mt-6 sm:mt-8"}>
              <p
                className={`font-black uppercase tracking-[0.2em] text-[var(--color-accent)] ${
                  isCompactHomePreview ? "text-[8px]" : "text-[10px] sm:text-xs"
                }`}
              >
                Save The Date
              </p>
              <div className={isCompactHomePreview ? "scale-110" : "scale-110 sm:scale-125"}>
                <CoverDateDisplay
                  date={events[0].date}
                  variant={coverConfig.dateVariant || "separator-dot"}
                  compact={isCompactHomePreview}
                />
              </div>
            </div>
          ) : null}
          {couple.quote ? (
            <p
              className={`mx-auto max-w-2xl font-semibold italic text-[var(--color-text)] ${
                isCompactHomePreview
                  ? "mt-3 text-[11px] leading-4"
                  : "mt-6 text-sm leading-6 sm:mt-7 sm:text-lg sm:leading-8"
              }`}
            >
              &ldquo;{couple.quote}&rdquo;
            </p>
          ) : null}
          {coverConfig.guestBlockStyle !== "hidden" && showGuestGreeting ? (
            <div
              className={
                isCompactHomePreview
                  ? "mt-3 rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)]/88 px-3 py-2 shadow-lg shadow-[var(--color-primary)]/8 backdrop-blur"
                  : "mt-6 mx-auto w-full max-w-[18rem] rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)]/88 px-4 py-3 shadow-lg shadow-[var(--color-primary)]/8 backdrop-blur sm:mt-8 sm:max-w-sm sm:px-7 sm:py-5 sm:shadow-xl sm:shadow-[var(--color-primary)]/10"
              }
            >
              <p
                className={`font-black uppercase tracking-[0.16em] text-[var(--color-accent)] ${
                  isCompactHomePreview ? "text-[9px]" : "text-[10px] sm:text-sm"
                }`}
              >
                Kepada Yth.
              </p>
              <p
                className={`mt-1.5 font-black text-[var(--color-primary)] ${
                  isCompactHomePreview ? "text-[13px]" : "text-base sm:text-2xl"
                }`}
              >
                {personalizedGuestName || "Tamu Undangan"}
              </p>
            </div>
          ) : null}
        </div>
      </motion.div>
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-1 text-[var(--color-primary)] ${
          isCompactHomePreview ? "pb-3" : "pb-6 sm:pb-8"
        }`}
      >
        <span
          className={`font-black uppercase tracking-[0.2em] text-[var(--color-accent)] ${
            isCompactHomePreview ? "text-[7px]" : "text-[9px] sm:text-[10px]"
          }`}
        >
          Scroll
        </span>
        <motion.svg
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          viewBox="0 0 24 24"
          className={isCompactHomePreview ? "h-4 w-4" : "h-5 w-5"}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </motion.svg>
      </div>
    </section>
  );
}
