import { SectionFrame, SectionTitle } from "../utils/templateStyling";
import CountdownTimer, { getCountdownTargetEvent } from "../components/CountdownTimer";
import EventWidget from "../components/EventWidget";
import StoryWidget from "../components/StoryWidget";
import GalleryWidget from "../components/GalleryWidget";
import RSVPForm from "../components/RSVPForm";
import { countdownClasses, eventClasses, galleryClasses, storyClasses } from "../utils/templateSectionClasses";

export function EventSection({ designConfig, events, eventConfig }) {
  return (
    <SectionFrame section="acara" designConfig={designConfig} baseClassName="bg-[var(--color-bg)]">
      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionTitle eyebrow="Acara" title="Detail hari bahagia" />
        <EventWidget events={events} config={eventConfig} classes={eventClasses(eventConfig.variant)} />
      </div>
    </SectionFrame>
  );
}

export function CountdownSection({ designConfig, events, countdownConfig }) {
  if (!countdownConfig.enabled) return null;
  const activeCountdownClasses = countdownClasses(countdownConfig.variant);
  return (
    <SectionFrame section="countdown" designConfig={designConfig} baseClassName="bg-[var(--color-surface)]">
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <SectionTitle eyebrow="Hitung Mundur" title="Menuju hari bahagia" />
        <div className="mx-auto mt-10 max-w-xl">
          <CountdownTimer
            event={getCountdownTargetEvent(events, countdownConfig)}
            completeText={countdownConfig.completeText}
            containerClassName={activeCountdownClasses.container}
            itemClassName={activeCountdownClasses.item}
            valueClassName={activeCountdownClasses.value}
            labelClassName={activeCountdownClasses.label}
          />
        </div>
      </div>
    </SectionFrame>
  );
}

export function StorySection({ designConfig, story, storyConfig }) {
  return (
    <SectionFrame section="story" designConfig={designConfig} baseClassName="bg-[var(--color-section-soft)]">
      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionTitle eyebrow="Love Story" title="Cerita kami" />
        <StoryWidget stories={story} config={storyConfig} classes={storyClasses(storyConfig.variant)} />
      </div>
    </SectionFrame>
  );
}

export function GallerySection({ designConfig, invitation, galleryConfig }) {
  return (
    <SectionFrame section="gallery" designConfig={designConfig} baseClassName="bg-[var(--color-bg)]">
      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionTitle eyebrow="Gallery" title="Momen bahagia" />
        <GalleryWidget images={invitation.gallery || []} coverImage={invitation.coverImage} config={galleryConfig} classes={galleryClasses(galleryConfig.variant)} />
      </div>
    </SectionFrame>
  );
}

export function RsvpSection({ designConfig, invitation, personalizedGuestName, guestSlug }) {
  if (!invitation.features?.rsvp) return null;

  return (
    <SectionFrame section="rsvp" designConfig={designConfig} applySectionStyle={false} baseClassName="bg-[var(--color-primary)] text-white">
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--color-accent-soft)]">RSVP</p>
        <h2 className="mt-3 text-4xl font-black leading-tight text-white sm:text-5xl">Konfirmasi kehadiran</h2>
        <RSVPForm invitationSlug={invitation.slug} guestSlug={personalizedGuestName ? guestSlug : undefined} guestName={personalizedGuestName} />
      </div>
    </SectionFrame>
  );
}

