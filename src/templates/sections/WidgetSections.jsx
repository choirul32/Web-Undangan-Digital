import { SectionFrame, SectionTitle } from "../utils/templateStyling";
import CountdownTimer, { getCountdownTargetEvent } from "../components/CountdownTimer";
import EventWidget from "../components/EventWidget";
import StoryWidget from "../components/StoryWidget";
import GalleryWidget from "../components/GalleryWidget";
import RSVPForm from "../components/RSVPForm";
import { WishesSection } from "./BaseSections";
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

export function RsvpSection({ designConfig, invitation, personalizedGuestName, guestSlug, preview = false }) {
  if (!invitation.features?.rsvp) return null;

  return (
    <SectionFrame section="rsvp" designConfig={designConfig} baseClassName="bg-[var(--color-section-soft)]">
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--color-accent)]">
          Kehadiran & Doa
        </p>
        <h2 className="template-section-title-heading mt-3 font-serif text-4xl font-black leading-tight text-[var(--color-heading)] sm:text-5xl">
          Konfirmasi Kehadiran
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base font-semibold leading-7 text-[var(--color-text)]/75">
          Silakan konfirmasi kehadiran dan tuliskan doa terbaik untuk kedua mempelai.
        </p>
        <div className="mx-auto max-w-3xl">
          <RSVPForm invitationSlug={invitation.slug} guestSlug={personalizedGuestName ? guestSlug : undefined} guestName={personalizedGuestName} />
        </div>
        <WishesSection
          designConfig={designConfig}
          slug={invitation.slug}
          preview={preview}
          framed={false}
        />
      </div>
    </SectionFrame>
  );
}

