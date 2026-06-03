import { motion } from "framer-motion";
import OrnamentLayer from "../components/OrnamentLayer";
import { coverMotion, compactGuestBlockClass, guestBlockClass } from "../utils/templateStyling";
import { getSectionOrnaments } from "../designConfigs";

export function CoverDateDisplay({ date, variant = "separator-dot" }) {
  const d = new Date(date);
  const day = d.getDate();
  const monthLong = d.toLocaleDateString("id-ID", { month: "long" });
  const year = d.getFullYear();
  return (
    <p className="mt-5 text-lg font-black tracking-[0.12em] text-[var(--color-primary)]">
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
}) {
  const coverBackgroundColor = coverConfig.backgroundColor || "#fbf7ef";
  const coverBackgroundImage = coverConfig.backgroundMode === "image" ? coverConfig.backgroundImage : "";

  return (
    <section id="section-home" data-preview-section="home" className={`relative isolate flex min-h-screen items-center justify-center overflow-hidden px-6 text-center ${isCompactHomePreview ? "py-6" : "py-20"}`} style={{ backgroundColor: coverBackgroundColor }}>
      {coverBackgroundImage ? <img src={coverBackgroundImage} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" /> : null}
      <div className="absolute inset-0 -z-10 bg-[var(--color-bg)]/78" />
      <OrnamentLayer ornaments={getSectionOrnaments(designConfig, "home")} />
      <motion.div {...coverMotion(coverConfig.openingAnimation)} transition={{ duration: 0.72, ease: "easeOut" }} className={`relative z-10 mx-auto max-w-4xl ${coverConfig.layout === "split" ? "lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-12 lg:text-left" : ""} ${isCompactHomePreview ? "max-w-[290px]" : ""}`}>
        {coverConfig.photoEnabled && coverConfig.layout !== "minimal" ? (
          <img src={profileImages[0]} alt={`${couple.groomNickname} dan ${couple.brideNickname}`} className={`mx-auto aspect-[3/4] rounded-t-full rounded-b-[18px] object-cover shadow-2xl shadow-[var(--color-primary)]/12 ${isCompactHomePreview ? "mb-3 w-32" : "mb-8 w-56"}`} />
        ) : null}
        <div>
          <p className={`${isCompactHomePreview ? "text-[10px] tracking-[0.18em]" : "text-sm tracking-[0.24em]"} font-black uppercase text-[var(--color-accent)]`}>The Wedding Of</p>
          <h1 className={`mt-4 font-serif font-black leading-none text-[var(--color-heading)] ${isCompactHomePreview ? "text-[30px] sm:text-[34px]" : "text-5xl sm:text-7xl"}`} style={{ fontFamily: "var(--font-heading)" }}>
            {couple.groomNickname} & {couple.brideNickname}
          </h1>
          {events[0]?.date ? <CoverDateDisplay date={events[0].date} variant={coverConfig.dateVariant || "separator-dot"} /> : null}
          <p className={`mx-auto max-w-2xl font-semibold text-[var(--color-text)] ${isCompactHomePreview ? "mt-2 text-[13px] leading-5" : "mt-5 text-lg leading-8"}`}>{couple.quote}</p>
          {coverConfig.guestBlockStyle !== "hidden" ? (
            <div className={isCompactHomePreview ? compactGuestBlockClass() : guestBlockClass(coverConfig.guestBlockStyle)}>
              <p className={`font-black uppercase tracking-[0.16em] text-[var(--color-accent)] ${isCompactHomePreview ? "text-[11px]" : "text-sm"}`}>Kepada Yth.</p>
              <p className={`mt-1.5 font-black text-[var(--color-primary)] ${isCompactHomePreview ? "text-base" : "text-2xl"}`}>{personalizedGuestName || "Tamu Undangan"}</p>
            </div>
          ) : null}
        </div>
      </motion.div>
    </section>
  );
}

