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
  const openingOverlayConfig = { ...openingRevealConfig, sequencePreset: openingSequenceConfig.preset, asset: openingSequenceConfig.asset };
  const personalizedGuestName = invitation.features?.guestName === false ? "" : guestName;
  const coupleConfig = getCoupleSectionConfig(designConfig);
  const countdownConfig = getCountdownWidgetConfig(designConfig);
  const eventConfig = getEventWidgetConfig(designConfig);
  const galleryConfig = getGalleryWidgetConfig(designConfig);
  const storyConfig = getStoryWidgetConfig(designConfig);
  const musicConfig = getMusicWidgetConfig(designConfig);
  const profileImages = ["/assets/CoverPasangan.png", "/assets/catin_wanita.jpg", "/assets/catin_pria.jpg"];
  const coupleProfileImages = {
    bride: profileImages[1],
    groom: profileImages[2],
  };

  const { previewFocusSection, previewSectionOnly, shouldRenderSection } = usePreviewSectionFilter(invitation.templateId);
  const isCompactHomePreview =
    framedPreview || (previewSectionOnly && previewFocusSection === "home") || isNarrowViewport;

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const media = window.matchMedia("(max-width: 480px)");
    const updateViewportState = () => setIsNarrowViewport(media.matches);

    updateViewportState();
    media.addEventListener("change", updateViewportState);

    return () => media.removeEventListener("change", updateViewportState);
  }, []);

  const startMusic = ({ fadeIn = true } = {}) => {
    const audio = musicRef.current;
    if (!audio) return;

    if (musicFadeRef.current) {
      window.clearInterval(musicFadeRef.current);
      musicFadeRef.current = null;
    }

    const targetVolume = 1;
    if (fadeIn) audio.volume = 0;

    const result = audio.play();
    if (result?.catch) {
      result.catch(() => {
        audio.volume = targetVolume;
      });
    }

    if (!fadeIn) {
      audio.volume = targetVolume;
      return;
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
  };

  const openInvitation = () => {
    setIsRevealOpen(true);
    if (openingOverlayConfig.autoPlayMusic) startMusic({ fadeIn: true });
  };

  useEffect(() => {
    if (openingOverlayConfig.enabled) return;
    if (!musicConfig.enabled && !invitation.features?.music) return;

    let hasPlayed = false;
    const handleInteraction = () => {
      if (hasPlayed) return;
      hasPlayed = true;
      startMusic({ fadeIn: true });
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };

    window.addEventListener("scroll", handleInteraction, { once: true, passive: true });
    window.addEventListener("touchstart", handleInteraction, { once: true, passive: true });

    return () => {
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, [openingOverlayConfig.enabled, musicConfig.enabled, invitation.features?.music]);

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
            guestName={personalizedGuestName}
            onOpen={openInvitation}
            framedPreview={framedPreview}
          />
        ) : null}
      </AnimatePresence>

      {shouldRenderSection("home") ? (
        <HomeSection
          designConfig={designConfig}
          coverConfig={coverConfig}
          couple={couple}
          events={events}
          personalizedGuestName={personalizedGuestName}
          profileImages={profileImages}
          isCompactHomePreview={isCompactHomePreview}
        />
      ) : null}

      {shouldRenderSection("couple") ? <CoupleSection designConfig={designConfig} couple={couple} coupleConfig={coupleConfig} profileImages={coupleProfileImages} /> : null}
      {shouldRenderSection("acara") ? <EventSection designConfig={designConfig} events={events} eventConfig={eventConfig} /> : null}
      {shouldRenderSection("countdown") ? <CountdownSection designConfig={designConfig} events={events} countdownConfig={countdownConfig} /> : null}
      {shouldRenderSection("story") ? <StorySection designConfig={designConfig} story={story} storyConfig={storyConfig} /> : null}
      {shouldRenderSection("gallery") ? <GallerySection designConfig={designConfig} invitation={invitation} galleryConfig={galleryConfig} /> : null}
      {shouldRenderSection("gift") && invitation.features?.gift ? <GiftSection accounts={invitation.bankAccounts} designConfig={designConfig} /> : null}
      {shouldRenderSection("rsvp") ? <RsvpSection designConfig={designConfig} invitation={invitation} personalizedGuestName={personalizedGuestName} guestSlug={guestSlug} /> : null}
      {shouldRenderSection("doa-ucapan") ? <WishesSection designConfig={designConfig} /> : null}

      {!previewSectionOnly && (invitation.features?.music || musicConfig.enabled) ? (
        <MusicPlayer
          musicUrl={invitation.musicUrl || ""}
          musicTitle={invitation.musicTitle || "Wedding Music"}
          audioRef={musicRef}
          config={musicConfig}
        />
      ) : null}
    </main>
  );
}

