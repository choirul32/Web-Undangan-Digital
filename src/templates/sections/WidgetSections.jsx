import { SectionFrame, SectionTitle } from "../utils/templateStyling";
import CountdownTimer, {
  getCountdownTargetEvent,
  parseCountdownTargetDate,
} from "../components/CountdownTimer";
import EventWidget from "../components/EventWidget";
import StoryWidget from "../components/StoryWidget";
import GalleryWidget from "../components/GalleryWidget";
import RSVPForm from "../components/RSVPForm";
import { WishesSection } from "./BaseSections";
import { countdownClasses, eventClasses, galleryClasses, storyClasses } from "../utils/templateSectionClasses";

const calendarMonthFormatter = new Intl.DateTimeFormat("id-ID", { month: "short" });
const calendarDateFormatter = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatGoogleCalendarDate(date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function getSaveTheDateUrl(event, targetDate) {
  if (!event || !targetDate) return "";

  const endDate = new Date(targetDate.getTime() + 2 * 60 * 60 * 1000);
  const title = event.title || "Acara Pernikahan";
  const location = [event.venue, event.address].filter(Boolean).join(", ");
  const details = "Simpan tanggal acara pernikahan ini agar tidak terlewat.";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${formatGoogleCalendarDate(targetDate)}/${formatGoogleCalendarDate(endDate)}`,
    details,
    location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function CountdownCalendarCard({ event }) {
  const targetDate = parseCountdownTargetDate(event);

  if (!event || !targetDate) return null;

  const month = calendarMonthFormatter.format(targetDate).replace(".", "");
  const day = String(targetDate.getDate()).padStart(2, "0");
  const fullDate = calendarDateFormatter.format(targetDate);
  const saveDateUrl = getSaveTheDateUrl(event, targetDate);

  return (
    <div className="mx-auto mt-6 flex max-w-md items-center gap-4 rounded-[8px] border border-[var(--color-accent-pale)] bg-white/78 p-4 text-left shadow-lg shadow-[var(--color-primary)]/8">
      <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] text-center">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
            {month}
          </p>
          <p className="text-2xl font-black leading-none text-[var(--color-primary)]">
            {day}
          </p>
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
          Save the Date
        </p>
        <p className="mt-1 truncate text-sm font-black text-[var(--color-primary)]">
          {event.title || "Acara Pernikahan"}
        </p>
        <p className="mt-1 text-xs font-semibold leading-5 text-[var(--color-text)]/75">
          {fullDate}
        </p>
        {event.venue ? (
          <p className="truncate text-xs font-semibold leading-5 text-[var(--color-text)]/55">
            {event.venue}
          </p>
        ) : null}
      </div>
      <div className="shrink-0">
        {saveDateUrl ? (
          <a
            href={saveDateUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-full bg-[var(--color-accent)] px-3 py-2 text-xs font-black text-[var(--color-primary)] shadow-md shadow-[var(--color-primary)]/8 transition-transform hover:-translate-y-0.5"
          >
            Simpan
          </a>
        ) : null}
      </div>
    </div>
  );
}

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
  const targetEvent = getCountdownTargetEvent(events, countdownConfig);
  return (
    <SectionFrame section="countdown" designConfig={designConfig} baseClassName="bg-[var(--color-surface)]">
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <SectionTitle eyebrow="Hitung Mundur" title="Menuju hari bahagia" />
        <CountdownCalendarCard event={targetEvent} />
        <div className="mx-auto mt-10 max-w-xl">
          <CountdownTimer
            event={targetEvent}
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

