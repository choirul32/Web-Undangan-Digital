import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import OpeningSequence, { OpeningSequenceAsset, OpeningSequenceAtmosphere } from "../components/OpeningSequence";
import { revealExitMotion } from "../utils/templateStyling";
import OrnamentLayer from "../components/OrnamentLayer";
import { getSectionOrnaments } from "../designConfigs";

// Pembungkus posisi vertikal per elemen konten pembuka.
// position: "" = otomatis (mengikuti contentPosition), lalu "top" | "center" | "bottom".
// Margin auto di flex column mendorong elemen ke posisi yang diminta; offsetY
// memberi geser halus tambahan (minus = naik).
function ElementPositioner({ position = "", offsetY = 0, children }) {
  const style = {};

  if (position === "top") {
    style.marginTop = 0;
    style.marginBottom = "auto";
  } else if (position === "bottom") {
    style.marginTop = "auto";
    style.marginBottom = 0;
  } else if (position === "center") {
    style.marginTop = "auto";
    style.marginBottom = "auto";
  }

  if (Number(offsetY)) {
    style.transform = `translateY(${Number(offsetY)}px)`;
  }

  return (
    <div className="flex w-full flex-col items-center" style={style}>
      {children}
    </div>
  );
}

export default function OpeningRevealOverlay({
  config,
  coverConfig,
  couple,
  coverImage,
  guestName,
  onOpen,
  framedPreview = false,
  designConfig,
}) {
  const [isOpening, setIsOpening] = useState(false);
  const [isNarrowViewport, setIsNarrowViewport] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const media = window.matchMedia("(max-width: 480px)");
    const updateViewportState = () => setIsNarrowViewport(media.matches);
    updateViewportState();
    media.addEventListener("change", updateViewportState);

    return () => media.removeEventListener("change", updateViewportState);
  }, []);

  if (!config.enabled) return null;

  const animation = config.animation || "fade";
  const isSplitAnimation = animation === "curtain" || animation === "gate";
  const defaultOpeningCoverImage = "/assets/CoverPasangan.png";
  const hasCustomOpeningCoverImage =
    Boolean(config.coverImage) && config.coverImage !== defaultOpeningCoverImage;
  const revealCoverImage = hasCustomOpeningCoverImage
    ? config.coverImage
    : coverImage || config.coverImage || coverConfig.coverImage || defaultOpeningCoverImage;
  const visualBackgroundMode = config.backgroundMode || "color";
  // Kalau foto cover tengah dimatikan, background mode "cover" tidak relevan
  // lagi — jatuhkan ke warna supaya foto cover tidak muncul sama sekali.
  const effectiveBackgroundMode =
    config.coverImageEnabled === false && visualBackgroundMode === "cover"
      ? "color"
      : visualBackgroundMode;
  const backgroundImage =
    effectiveBackgroundMode === "cover"
      ? revealCoverImage
      : effectiveBackgroundMode === "image"
        ? config.backgroundImage || coverConfig.backgroundImage
        : "";
  const backgroundColor = config.backgroundColor || coverConfig.backgroundColor || "#fbf7ef";
  const panelImage = backgroundImage;
  const ambientBackgroundImage = backgroundImage;
  const frameClass = animation === "gate" ? "border-x-[18px] border-[var(--color-accent)]/45" : animation === "paper" ? "bg-[var(--color-surface)]/88 backdrop-blur-sm" : "";
  const compactMode = framedPreview || isNarrowViewport;
  // Opening = photo-forward "sampul": full-bleed cover with a dark scrim and light
  // text. Reserved for non-split, non-paper animations (those keep their panel /
  // card treatment so text stays readable).
  const usePhotoBackdrop =
    Boolean(backgroundImage) && !isSplitAnimation && animation !== "paper";
  const headingColorClass = usePhotoBackdrop
    ? "text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]"
    : "text-[var(--color-heading)]";
  const eyebrowColorClass = usePhotoBackdrop ? "text-white/85" : "text-[var(--color-accent)]";
  const contentClass = animation === "paper"
    ? compactMode
      ? "rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)]/86 px-4 py-5 shadow-2xl shadow-[var(--color-primary)]/12 backdrop-blur"
      : "rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)]/86 px-6 py-8 shadow-2xl shadow-[var(--color-primary)]/12 backdrop-blur"
    : "";
  const overlaySpacingClass = compactMode ? "px-5 py-7" : "px-6 py-12";
  const overlayFrameClass = framedPreview
    ? "absolute inset-0 h-full min-h-screen"
    : "fixed inset-0 h-[100dvh] min-h-[100svh]";
  const contentWidthClass = compactMode ? "max-w-[350px]" : "max-w-3xl";
  const contentLayoutClass = compactMode
    ? "flex min-h-[calc(100svh-3.5rem)] flex-col items-center justify-center"
    : config.contentPosition === "split"
      ? "flex min-h-[calc(100svh-3.5rem)] flex-col items-center"
      : "flex min-h-[calc(100svh-3.5rem)] flex-col items-center justify-center";

  // Personalisasi ukuran & posisi dari designConfig (kosong = default render).
  const px = (value) => (value ? { fontSize: `${value}px` } : null);
  const titleFontSizeStyle = px(config.titleFontSize);
  const guestFontSizeStyle = px(config.guestFontSize);
  const buttonFontSizeStyle = px(config.buttonFontSize);
  const photoWidthStyle = config.photoWidth ? { width: `${config.photoWidth}px` } : null;
  const openingContentPositionClass =
    config.contentPosition === "top"
      ? "items-start pt-10"
      : config.contentPosition === "bottom"
        ? "items-end pb-10"
        : config.contentPosition === "split"
          ? "flex-col justify-between"
          : "items-center";
  const contentOffsetStyle = {
    ...(config.contentOffsetY ? { transform: `translateY(${Number(config.contentOffsetY)}px)` } : {}),
    ...(config.contentPaddingTop ? { paddingTop: `${Number(config.contentPaddingTop)}px` } : {}),
    ...(config.contentPaddingBottom ? { paddingBottom: `${Number(config.contentPaddingBottom)}px` } : {}),
    ...(config.contentMaxWidth ? { maxWidth: `${Number(config.contentMaxWidth)}px` } : {}),
  };
  // Jarak antar elemen: pakai gap bila diisi, kalau kosong biarkan margin class bawaan.
  const elementGapStyle = config.elementGap ? { gap: `${Number(config.elementGap)}px` } : null;

  const coverImageClass = `${compactMode
    ? "mx-auto mb-5 aspect-[3/4] w-36 rounded-t-full rounded-b-[14px]"
    : "mx-auto mb-7 aspect-[3/4] w-44 rounded-t-full rounded-b-[16px]"
  } object-cover shadow-2xl shadow-[var(--color-primary)]/18 ${usePhotoBackdrop ? "ring-4 ring-white/70" : ""}`;
  const eyebrowClass = compactMode
    ? "text-[10px] font-black uppercase tracking-[0.2em]"
    : "text-sm font-black uppercase tracking-[0.24em]";
  const titleClass = compactMode
    ? "mt-3 font-serif text-4xl font-black leading-none"
    : "mt-5 font-serif text-5xl font-black leading-none sm:text-7xl";
  const guestBoxClass = `${compactMode
    ? "mx-auto mt-5 max-w-[250px] px-5 py-4"
    : "mx-auto mt-8 max-w-md px-7 py-5"
  } rounded-[8px] border shadow-xl backdrop-blur ${
    usePhotoBackdrop
      ? "border-white/70 bg-black/42 shadow-black/20"
      : "border-[var(--color-accent-pale)] bg-[var(--color-surface)]/88 shadow-[var(--color-primary)]/10"
  }`;
  const guestBoxStyle = {
    ...(config.guestCardBgColor ? { backgroundColor: config.guestCardBgColor } : {}),
  };
  const guestEyebrowClass = compactMode
    ? `text-[10px] font-black uppercase tracking-[0.14em] ${usePhotoBackdrop ? "text-white/85" : "text-[var(--color-accent)]"}`
    : `text-sm font-black uppercase tracking-[0.16em] ${usePhotoBackdrop ? "text-white/85" : "text-[var(--color-accent)]"}`;
  const guestNameClass = compactMode
    ? `mt-1 text-lg font-black ${usePhotoBackdrop ? "text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]" : "text-[var(--color-primary)]"}`
    : `mt-2 text-2xl font-black ${usePhotoBackdrop ? "text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]" : "text-[var(--color-primary)]"}`;
  const buttonClass = compactMode
    ? "mt-6 rounded-2xl bg-[var(--color-primary)] px-6 py-3 text-sm font-black text-white shadow-xl shadow-[var(--color-primary)]/20"
    : "mt-9 rounded-2xl bg-[var(--color-primary)] px-8 py-4 text-base font-black text-white shadow-xl shadow-[var(--color-primary)]/20";
  const buttonStyle = {
    ...(config.buttonBgColor ? { backgroundColor: config.buttonBgColor } : {}),
    ...(config.buttonTextColor ? { color: config.buttonTextColor } : {}),
  };
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
    <motion.div exit={revealExitMotion(animation)} transition={{ duration: 0.72, ease: "easeInOut" }} className={`${overlayFrameClass} z-[120] flex items-center justify-center overflow-hidden ${overlaySpacingClass} text-center ${frameClass} ${openingContentPositionClass}`} style={{ backgroundColor }}>
      {isSplitAnimation ? (
        <>
          <motion.div initial={false} animate={isOpening ? { x: "-102%" } : { x: 0 }} transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }} className={`${splitPanelClass} left-0`} style={splitPanelStyle("left")} />
          <motion.div initial={false} animate={isOpening ? { x: "102%" } : { x: 0 }} transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }} className={`${splitPanelClass} right-0`} style={splitPanelStyle("right")} />
        </>
      ) : null}
      {usePhotoBackdrop ? (
        <>
          <img src={backgroundImage} alt="" className="absolute inset-0 z-0 h-full w-full object-cover" />
          <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-black/40 to-black/55" />
        </>
      ) : (
        <>
          {ambientBackgroundImage && !isSplitAnimation ? <img src={ambientBackgroundImage} alt="" className={`absolute inset-0 z-0 h-full w-full object-cover ${backgroundImage ? "opacity-[0.35]" : "opacity-[0.18]"}`} /> : null}
          <div className="absolute inset-0 z-[1] bg-[var(--color-bg)]/70" />
        </>
      )}
      <OrnamentLayer ornaments={getSectionOrnaments(designConfig, "opening")} />
      <OpeningSequenceAsset asset={config.asset} isOpening={isOpening} onSkip={handleOpen} />
      <OpeningSequenceAtmosphere config={config} isOpening={isOpening} />
      <OpeningSequence config={config} isOpening={isOpening} className={`relative z-10 mx-auto w-full ${contentWidthClass} ${contentLayoutClass} ${contentClass}`} style={{ ...contentOffsetStyle, ...elementGapStyle }}>
        {config.coverImageEnabled ? (
          <ElementPositioner position={config.photoPosition} offsetY={config.photoOffsetY}>
            <img src={revealCoverImage} alt={`${couple.groomNickname} dan ${couple.brideNickname}`} className={coverImageClass} style={photoWidthStyle} />
          </ElementPositioner>
        ) : null}
        <ElementPositioner position={config.titlePosition} offsetY={config.titleOffsetY}>
          <p className={`${eyebrowClass} ${eyebrowColorClass}`}>The Wedding Of</p>
          <h1 className={`${titleClass} ${headingColorClass}`} style={{ fontFamily: "var(--font-heading)", ...titleFontSizeStyle }}>{couple.groomNickname} & {couple.brideNickname}</h1>
        </ElementPositioner>
        <ElementPositioner position={config.guestPosition} offsetY={config.guestOffsetY}>
          <div className={guestBoxClass} style={guestBoxStyle}>
            <p className={guestEyebrowClass}>Kepada Yth.</p>
            <p className={guestNameClass} style={{ ...guestFontSizeStyle, ...(config.guestCardTextColor ? { color: config.guestCardTextColor } : {}) }}>{guestName || "Tamu Undangan"}</p>
          </div>
        </ElementPositioner>
        <ElementPositioner position={config.buttonPosition} offsetY={config.buttonOffsetY}>
          <button type="button" onClick={handleOpen} disabled={isOpening} className={buttonClass} style={{ ...buttonFontSizeStyle, ...buttonStyle }}>
            {config.buttonText || "Buka Undangan"}
          </button>
        </ElementPositioner>
      </OpeningSequence>
    </motion.div>
  );
}
