import { useState } from "react";
import { motion } from "framer-motion";
import OpeningSequence, { OpeningSequenceAsset, OpeningSequenceAtmosphere } from "../components/OpeningSequence";
import { revealExitMotion } from "../utils/templateStyling";

export default function OpeningRevealOverlay({
  config,
  coverConfig,
  couple,
  guestName,
  onOpen,
  framedPreview = false,
}) {
  const [isOpening, setIsOpening] = useState(false);
  if (!config.enabled) return null;

  const animation = config.animation || "fade";
  const isSplitAnimation = animation === "curtain" || animation === "gate";
  const backgroundImage = config.backgroundMode === "image" ? config.backgroundImage || coverConfig.backgroundImage : "";
  const backgroundColor = config.backgroundColor || coverConfig.backgroundColor || "#fbf7ef";
  const revealCoverImage = "/assets/CoverPasangan.png";
  const panelImage = backgroundImage || (config.coverImageEnabled ? revealCoverImage : "");
  const frameClass = animation === "gate" ? "border-x-[18px] border-[var(--color-accent)]/45" : animation === "paper" ? "bg-[var(--color-surface)]/88 backdrop-blur-sm" : "";
  const contentClass = animation === "paper" ? "rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)]/86 px-6 py-8 shadow-2xl shadow-[var(--color-primary)]/12 backdrop-blur" : "";
  const splitPanelClass = animation === "gate" ? "absolute inset-y-0 z-[2] w-1/2 bg-[var(--color-surface)] shadow-2xl shadow-[var(--color-primary)]/15" : "absolute inset-y-0 z-[2] w-1/2 bg-[var(--color-primary)]/12 shadow-2xl shadow-[var(--color-primary)]/10";

  const splitPanelStyle = (side) =>
    panelImage
      ? { backgroundImage: `url(${panelImage})`, backgroundSize: "200% 100%", backgroundPosition: side === "left" ? "left center" : "right center", backgroundRepeat: "no-repeat" }
      : { backgroundColor };

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    window.setTimeout(onOpen, isSplitAnimation ? 900 : 650);
  };

  return (
    <motion.div exit={revealExitMotion(animation)} transition={{ duration: 0.72, ease: "easeInOut" }} className={`${framedPreview ? "absolute inset-x-0 top-0 h-screen" : "fixed inset-0"} z-[120] flex items-center justify-center overflow-hidden px-6 py-12 text-center ${frameClass}`} style={{ backgroundColor }}>
      {isSplitAnimation ? (
        <>
          <motion.div initial={false} animate={isOpening ? { x: "-102%" } : { x: 0 }} transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }} className={`${splitPanelClass} left-0`} style={splitPanelStyle("left")} />
          <motion.div initial={false} animate={isOpening ? { x: "102%" } : { x: 0 }} transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }} className={`${splitPanelClass} right-0`} style={splitPanelStyle("right")} />
        </>
      ) : null}
      {backgroundImage && !isSplitAnimation ? <img src={backgroundImage} alt="" className="absolute inset-0 z-0 h-full w-full object-cover opacity-[0.35]" /> : null}
      <div className="absolute inset-0 z-[1] bg-[var(--color-bg)]/70" />
      <OpeningSequenceAsset asset={config.asset} isOpening={isOpening} onSkip={handleOpen} />
      <OpeningSequenceAtmosphere config={config} isOpening={isOpening} />
      <OpeningSequence config={config} isOpening={isOpening} className={`relative z-10 mx-auto max-w-3xl ${contentClass}`}>
        {config.coverImageEnabled ? <img src={revealCoverImage} alt={`${couple.groomNickname} dan ${couple.brideNickname}`} className="mx-auto mb-7 aspect-[3/4] w-44 rounded-t-full rounded-b-[16px] object-cover shadow-2xl shadow-[var(--color-primary)]/12" /> : null}
        <p className="text-sm font-black uppercase tracking-[0.24em] text-[var(--color-accent)]">The Wedding Of</p>
        <h1 className="mt-5 font-serif text-5xl font-black leading-none text-[var(--color-heading)] sm:text-7xl" style={{ fontFamily: "var(--font-heading)" }}>{couple.groomNickname} & {couple.brideNickname}</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg font-semibold leading-8 text-[var(--color-text)]">{couple.quote}</p>
        <div className="mx-auto mt-8 max-w-md rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)]/88 px-7 py-5 shadow-xl shadow-[var(--color-primary)]/10 backdrop-blur">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-[var(--color-accent)]">Kepada Yth.</p>
          <p className="mt-2 text-2xl font-black text-[var(--color-primary)]">{guestName || "Tamu Undangan"}</p>
        </div>
        <button type="button" onClick={handleOpen} disabled={isOpening} className="mt-9 rounded-2xl bg-[var(--color-primary)] px-8 py-4 text-base font-black text-white shadow-xl shadow-[var(--color-primary)]/20">
          {config.buttonText || "Buka Undangan"}
        </button>
      </OpeningSequence>
    </motion.div>
  );
}

