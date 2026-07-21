"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { emptyInvitation } from "../data/emptyInvitation";
import {
  getCoupleSectionConfig,
  getCoverSectionConfig,
  getDesignConfig,
  getOpeningRevealConfig,
  getOpeningSequenceConfig,
} from "./designConfigs";
import MusicPlayer, { getMusicWidgetConfig } from "./components/MusicPlayer";
import { getCountdownWidgetConfig } from "./components/CountdownTimer";
import { getEventWidgetConfig } from "./components/EventWidget";
import { getGalleryWidgetConfig } from "./components/GalleryWidget";
import { getStoryWidgetConfig } from "./components/StoryWidget";
import { cssVars, normalizeEventExamples } from "./utils/templateStyling";
import usePreviewSectionFilter from "./hooks/usePreviewSectionFilter";
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

  const invitation = { ...emptyInvitation, ...data };
  const couple = invitation.couple || emptyInvitation.couple;
  const events = normalizeEventExamples(invitation.events || []);
  const story = invitation.story || [];

  const designConfig = getDesignConfig(invitation.templateId, invitation.designConfig);
  const globalStyleConfig = designConfig?.sections?.global || {};
  const coverConfig = getCoverSectionConfig(designConfig);
  const openingRevealConfig = getOpeningRevealConfig(designConfig);
  const openingSequenceConfig = getOpeningSequenceConfig(designConfig);
  const { previewFocusSection, previewSectionOnly, shouldRenderSection } = usePreviewSectionFilter(
    invitation.templateId,
    initialPreviewSectionOnly,
    initialPreviewFocusSection,
  );
  const shouldDisableOpeningOverlay = disableOpeningOverlay || previewSectionOnly;
  const openingOverlayConfig = {
    ...openingRevealConfig,
    enabled: previewOpening ? true : shouldDisableOpeningOverlay ? false : openingRevealConfig.enabled,
    sequencePreset: openingSequenceConfig.preset,
    asset: openingSequenceConfig.asset,
  };
  const personalizedGuestName = invitation.features?.guestName === false ? "" : guestName;
  const coupleConfig = getCoupleSectionConfig(designConfig);
  const countdownConfig = getCountdownWidgetConfig(designConfig);
  const eventConfig = getEventWidgetConfig(designConfig);
  const galleryConfig = getGalleryWidgetConfig(designConfig);
  const storyConfig = getStoryWidgetConfig(designConfig);
  const musicConfig = getMusicWidgetConfig(designConfig);
  const bridePhoto = couple.bridePhoto || "/assets/catin_wanita.jpg";
  const groomPhoto = couple.groomPhoto || "/assets/catin_pria.jpg";
  const coverPhoto = invitation.coverImage || "/assets/CoverPasangan.png";
  const profileImages = [coverPhoto, bridePhoto, groomPhoto];
  const coupleProfileImages = {
    bride: bridePhoto,
    groom: groomPhoto,
  };

  const isCompactHomePreview =
    framedPreview || (previewSectionOnly && previewFocusSection === "home") || isNarrowViewport;
  const shouldDelayInvitationContent = openingOverlayConfig.enabled && !isRevealOpen;
  const showHomeGuestGreeting = !openingOverlayConfig.enabled;

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const media = window.matchMedia("(max-width: 480px)");
    const updateViewportState = () => setIsNarrowViewport(media.matches);

    updateViewportState();
    media.addEventListener("change", updateViewportState);

    return () => media.removeEventListener("change", updateViewportState);
  }, []);

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
      <AnimatePresence>
        {!isRevealOpen ? (
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

      {!shouldDelayInvitationContent && shouldRenderSection("home") ? (
        <HomeSection
          designConfig={designConfig}
          coverConfig={coverConfig}
          couple={couple}
          events={events}
          personalizedGuestName={personalizedGuestName}
          profileImages={profileImages}
          isCompactHomePreview={isCompactHomePreview}
          showGuestGreeting={showHomeGuestGreeting}
        />
      ) : null}

      {!shouldDelayInvitationContent && shouldRenderSection("couple") ? <CoupleSection designConfig={designConfig} couple={couple} coupleConfig={coupleConfig} profileImages={coupleProfileImages} /> : null}
      {!shouldDelayInvitationContent && shouldRenderSection("acara") ? <EventSection designConfig={designConfig} events={events} eventConfig={eventConfig} /> : null}
      {!shouldDelayInvitationContent && shouldRenderSection("countdown") ? <CountdownSection designConfig={designConfig} events={events} countdownConfig={countdownConfig} /> : null}
      {!shouldDelayInvitationContent && shouldRenderSection("story") ? <StorySection designConfig={designConfig} story={story} storyConfig={storyConfig} /> : null}
      {!shouldDelayInvitationContent && shouldRenderSection("gallery") ? <GallerySection designConfig={designConfig} invitation={invitation} galleryConfig={galleryConfig} /> : null}
      {!shouldDelayInvitationContent && shouldRenderSection("gift") && invitation.features?.gift ? <GiftSection accounts={invitation.bankAccounts} designConfig={designConfig} qrisImage={invitation.qrisImage} /> : null}
      {!shouldDelayInvitationContent && shouldRenderSection("rsvp") ? (
        <RsvpSection
          designConfig={designConfig}
          invitation={invitation}
          personalizedGuestName={personalizedGuestName}
          guestSlug={guestSlug}
          preview={previewSectionOnly || previewMode}
        />
      ) : null}
      {!shouldDelayInvitationContent &&
      shouldRenderSection("doa-ucapan") &&
      (!invitation.features?.rsvp || previewFocusSection === "doa-ucapan") ? (
        <WishesSection designConfig={designConfig} slug={invitation.slug} preview={previewSectionOnly || previewMode} />
      ) : null}

      {!previewSectionOnly && (invitation.features?.music || musicConfig.enabled) ? (
        <MusicPlayer
          musicUrl={invitation.musicUrl || ""}
          musicTitle={invitation.musicTitle || "Wedding Music"}
          audioRef={musicRef}
          config={musicConfig}
          autoPlayOnInteraction={!openingOverlayConfig.enabled || isRevealOpen}
        />
      ) : null}
    </main>
  );
}
