"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { emptyInvitation } from "../data/emptyInvitation";
import MusicPlayer from "./components/MusicPlayer";
import LoadingScreen from "./components/LoadingScreen";
import FloatingActions from "./components/FloatingActions";
import GlobalBackground from "./components/GlobalBackground";
import { cssVars, normalizeEventExamples } from "./utils/templateStyling";
import { resolvePreviewState } from "./utils/previewState";
import { DEFAULT_SECTION_ORDER } from "./sectionsOrder";
import usePreviewSectionFilter from "./hooks/usePreviewSectionFilter";
import useSectionBackgroundParallax from "./hooks/useSectionBackgroundParallax";
import OpeningRevealOverlay from "./sections/OpeningRevealOverlay";
import HomeSection from "./sections/HomeSection";
import { CoupleSection, GiftSection, WishesSection } from "./sections/BaseSections";
import { CountdownSection, EventSection, GallerySection, RsvpSection, StorySection } from "./sections/WidgetSections";

export default function UniversalTemplate({
  data = emptyInvitation,
  guestName,
  guestSlug,
  framedPreview = false,
  previewOpening = false,
  previewMode = false,
  previewSectionOnly: initialPreviewSectionOnly = false,
  previewFocusSection: initialPreviewFocusSection = null,
  disableOpeningOverlay = false,
}) {
  const musicRef = useRef(null);
  const musicFadeRef = useRef(null);
  const [isNarrowViewport, setIsNarrowViewport] = useState(false);
  const [isRevealOpen, setIsRevealOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(
    () =>
      !framedPreview &&
      typeof window !== "undefined" &&
      // Loading tampil di mode publik & preview editor (bukan framed mini-preview)
      !initialPreviewSectionOnly,
  );

  const invitation = { ...emptyInvitation, ...data };
  const couple = invitation.couple || emptyInvitation.couple;
  const events = normalizeEventExamples(invitation.events || []);
  const story = invitation.story || [];

  const { previewFocusSection, previewSectionOnly, shouldRenderSection } = usePreviewSectionFilter(
    invitation.templateId,
    initialPreviewSectionOnly,
    initialPreviewFocusSection,
  );
  // Keputusan render terkonsentrasi di satu Seam (previewState.js) —
  // UniversalTemplate tinggal render keputusan, tidak merumuskan sendiri.
  const {
    designConfig,
    sectionsOrder,
    globalStyleConfig,
    coverConfig,
    openingOverlayConfig,
    personalizedGuestName,
    coupleConfig,
    countdownConfig,
    eventConfig,
    galleryConfig,
    storyConfig,
    musicConfig,
    shouldDelayInvitationContent: shouldDelayFromOverlay,
    showHomeGuestGreeting,
    shouldRenderWishes,
    shouldRenderGift,
    shouldRenderMusic,
  } = resolvePreviewState({
    invitation,
    guestName,
    previewOpening,
    disableOpeningOverlay,
    previewSectionOnly,
    previewFocusSection,
    shouldRenderSection,
  });
  const bridePhoto = couple.bridePhoto || "/assets/catin_wanita.jpg";
  const groomPhoto = couple.groomPhoto || "/assets/catin_pria.jpg";
  const coverPhoto = invitation.coverImage || "/assets/CoverPasangan.png";
  const profileImages = [coverPhoto, bridePhoto, groomPhoto];
  const coupleProfileImages = {
    bride: bridePhoto,
    groom: groomPhoto,
  };
  // Cover asli invitation (nullable) — dipakai HomeSection untuk hero background
  // saat template mematikan foto utama (photoEnabled: false).
  const invitationCoverImage = invitation.coverImage || null;

  const isCompactHomePreview =
    framedPreview || (previewSectionOnly && previewFocusSection === "home") || isNarrowViewport;
  const shouldDelayInvitationContent = shouldDelayFromOverlay && !isRevealOpen;

  const renderSectionById = (sectionId) => {
    if (shouldDelayInvitationContent) {
      return null;
    }

    switch (sectionId) {
      case "home":
        return shouldRenderSection("home") ? (
          <HomeSection
            key="home"
            designConfig={designConfig}
            coverConfig={coverConfig}
            couple={couple}
            events={events}
            personalizedGuestName={personalizedGuestName}
            profileImages={profileImages}
            invitationCoverImage={invitationCoverImage}
            isCompactHomePreview={isCompactHomePreview}
            showGuestGreeting={showHomeGuestGreeting}
          />
        ) : null;
      case "couple":
        return shouldRenderSection("couple") ? (
          <CoupleSection
            key="couple"
            designConfig={designConfig}
            couple={couple}
            coupleConfig={coupleConfig}
            profileImages={coupleProfileImages}
          />
        ) : null;
      case "acara":
        return shouldRenderSection("acara") ? (
          <EventSection
            key="acara"
            designConfig={designConfig}
            events={events}
            eventConfig={eventConfig}
          />
        ) : null;
      case "countdown":
        return shouldRenderSection("countdown") ? (
          <CountdownSection
            key="countdown"
            designConfig={designConfig}
            events={events}
            countdownConfig={countdownConfig}
          />
        ) : null;
      case "story":
        return shouldRenderSection("story") ? (
          <StorySection
            key="story"
            designConfig={designConfig}
            story={story}
            storyConfig={storyConfig}
          />
        ) : null;
      case "gallery":
        return shouldRenderSection("gallery") ? (
          <GallerySection
            key="gallery"
            designConfig={designConfig}
            invitation={invitation}
            galleryConfig={galleryConfig}
          />
        ) : null;
      case "gift":
        return shouldRenderGift ? (
          <GiftSection
            key="gift"
            accounts={invitation.bankAccounts}
            designConfig={designConfig}
            qrisImage={invitation.qrisImage}
          />
        ) : null;
      case "rsvp":
        return shouldRenderSection("rsvp") ? (
          <RsvpSection
            key="rsvp"
            designConfig={designConfig}
            invitation={invitation}
            personalizedGuestName={personalizedGuestName}
            guestSlug={guestSlug}
            preview={previewSectionOnly || previewMode}
          />
        ) : null;
      case "doa-ucapan":
        return shouldRenderWishes ? (
          <WishesSection
            key="doa-ucapan"
            designConfig={designConfig}
            slug={invitation.slug}
            preview={previewSectionOnly || previewMode}
          />
        ) : null;
      default:
        return null;
    }
  };

  const orderedSections =
    Array.isArray(sectionsOrder) && sectionsOrder.length > 0
      ? sectionsOrder
      : DEFAULT_SECTION_ORDER;

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const media = window.matchMedia("(max-width: 480px)");
    const updateViewportState = () => setIsNarrowViewport(media.matches);

    updateViewportState();
    media.addEventListener("change", updateViewportState);

    return () => media.removeEventListener("change", updateViewportState);
  }, []);

  // Background parallax per-section (poin 4)
  useSectionBackgroundParallax();

  const startMusic = async ({ fadeIn = true, attempt = 0 } = {}) => {
    const audio = musicRef.current;
    if (!audio) {
      if (attempt < 8 && typeof window !== "undefined") {
        await new Promise((resolve) => window.setTimeout(resolve, 80));
        return startMusic({ fadeIn, attempt: attempt + 1 });
      }
      return false;
    }

    if (musicFadeRef.current) {
      window.clearInterval(musicFadeRef.current);
      musicFadeRef.current = null;
    }

    const targetVolume = 1;
    if (fadeIn) audio.volume = 0;
    audio.muted = false;

    try {
      await audio.play();
    } catch {
      audio.volume = targetVolume;
      return false;
    }

    if (!fadeIn) {
      audio.volume = targetVolume;
      return true;
    }

    const step = 0.06;
    musicFadeRef.current = window.setInterval(() => {
      if (!musicRef.current || musicRef.current.paused) {
        if (musicRef.current) musicRef.current.volume = targetVolume;
        window.clearInterval(musicFadeRef.current);
        musicFadeRef.current = null;
        return;
      }

      const nextVolume = Math.min(targetVolume, musicRef.current.volume + step);
      musicRef.current.volume = nextVolume;

      if (nextVolume >= targetVolume) {
        window.clearInterval(musicFadeRef.current);
        musicFadeRef.current = null;
      }
    }, 90);

    return true;
  };

  const openInvitation = () => {
    setIsRevealOpen(true);
    if (openingOverlayConfig.autoPlayMusic) startMusic({ fadeIn: true });
  };

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    if (!openingOverlayConfig.enabled || isRevealOpen) return undefined;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isRevealOpen, openingOverlayConfig.enabled]);

  useEffect(() => () => {
    if (musicFadeRef.current) window.clearInterval(musicFadeRef.current);
  }, []);

  return (
    <main className={`relative min-h-screen bg-[var(--color-bg)] text-[var(--color-primary)] ${framedPreview ? "framed-preview-mobile" : ""}`} style={cssVars(globalStyleConfig)}>
      {/* Background global menempel (parallax) — section di atasnya bisa transparan */}
      <GlobalBackground
        backgroundImage={globalStyleConfig.backgroundImage}
        parallax={globalStyleConfig.backgroundParallax}
        overlay={globalStyleConfig.backgroundOverlay}
      />

      <AnimatePresence>
        {isLoading ? (
          <LoadingScreen
            coverImage={coverPhoto}
            onDone={() => setIsLoading(false)}
            minDuration={previewMode ? 600 : 1400}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {!isRevealOpen && !isLoading ? (
          <OpeningRevealOverlay
            config={openingOverlayConfig}
            coverConfig={coverConfig}
            couple={couple}
            coverImage={invitation.coverImage}
            guestName={personalizedGuestName}
          onOpen={openInvitation}
          framedPreview={framedPreview}
          designConfig={designConfig}
        />
        ) : null}
      </AnimatePresence>

      {orderedSections.map((sectionId) => renderSectionById(sectionId))}

      {shouldRenderMusic ? (
        <MusicPlayer
          musicUrl={invitation.musicUrl || ""}
          musicTitle={invitation.musicTitle || "Wedding Music"}
          audioRef={musicRef}
          config={musicConfig}
          autoPlayOnInteraction={!openingOverlayConfig.enabled || isRevealOpen}
        />
      ) : null}

      {!previewSectionOnly ? (
        <FloatingActions isRevealOpen={isRevealOpen || !openingOverlayConfig.enabled} />
      ) : null}
    </main>
  );
}
