"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { sampleInvitation } from "../../data/sampleInvitation";
import { getDesignConfig, getSectionOrnaments } from "../designConfigs";
import OrnamentLayer from "../components/OrnamentLayer";
import CountdownTimer, {
  getCountdownTargetEvent,
  getCountdownWidgetConfig,
} from "../components/CountdownTimer";
import EventWidget, { getEventWidgetConfig } from "../components/EventWidget";
import StoryWidget, { getStoryWidgetConfig } from "../components/StoryWidget";
import GalleryWidget, { getGalleryWidgetConfig } from "../components/GalleryWidget";
import RSVPForm from "../components/RSVPForm";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const navItems = [
  ["Home", "#home"],
  ["Couple", "#couple"],
  ["Acara", "#acara"],
  ["Story", "#story"],
  ["RSVP", "#rsvp"],
];

function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-4 z-50 mx-auto flex w-[min(410px,calc(100%-20px))] items-center justify-between rounded-full border border-[#bdd0db] bg-white/88 px-3 py-2 shadow-2xl shadow-[#123760]/16 backdrop-blur">
      {navItems.map(([label, href]) => (
        <a
          key={href}
          href={href}
          className="rounded-full px-3 py-2 text-[10px] font-black uppercase tracking-[0.06em] text-[#123760] transition-colors hover:bg-[#123760] hover:text-white"
        >
          {label}
        </a>
      ))}
    </nav>
  );
}

function WatercolorSection({ id, children, soft = false, designConfig }) {
  const sectionVariant = soft ? "soft" : "default";
  const overlayClass =
    designConfig?.sections?.[sectionVariant]?.overlayClass ||
    (soft ? "bg-white/62" : "bg-[#fff8ee]/42");
  const ornaments = getSectionOrnaments(designConfig, id);

  return (
    <section id={id} className="relative overflow-hidden px-7 py-16 text-center text-[#173a5a]">
      <OrnamentLayer ornaments={ornaments} />
      <div className={`absolute inset-0 ${overlayClass}`} />
      <div className="relative z-10">{children}</div>
    </section>
  );
}

function SectionTitle({ eyebrow, title, desc }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={fadeUp}
      className="mx-auto max-w-sm"
    >
      {eyebrow ? (
        <p className="text-xs font-black uppercase tracking-[0.24em] text-[#6e91a8]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 font-serif text-[38px] italic leading-tight text-[#123760]">
        {title}
      </h2>
      {desc ? (
        <p className="mt-4 text-sm font-semibold leading-7 text-[#597286]">{desc}</p>
      ) : null}
    </motion.div>
  );
}

function EventCard({ event }) {
  return (
    <motion.article
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={fadeUp}
      className="rounded-[14px] border border-[#d4e0e7] bg-white/82 p-6 shadow-xl shadow-[#123760]/10"
    >
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[#6e91a8]">
        {event.title}
      </p>
      <h3 className="mt-3 font-serif text-3xl italic text-[#123760]">{event.date}</h3>
      <p className="mt-2 text-base font-black text-[#315a78]">{event.time}</p>
      <p className="mt-5 text-sm font-semibold leading-7 text-[#597286]">
        {event.venue}
        <br />
        {event.address}
      </p>
      <a
        href={event.mapsUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex rounded-full bg-[#123760] px-6 py-3 text-xs font-black uppercase tracking-[0.08em] text-white"
      >
        Buka Maps
      </a>
    </motion.article>
  );
}

function getCountdownClasses(variant = "cards") {
  if (variant === "minimal") {
    return {
      containerClassName: "mx-auto mt-8 grid max-w-xs grid-cols-4 gap-2",
      itemClassName: "px-1 py-2",
      valueClassName: "font-serif text-2xl leading-none text-[#123760]",
      labelClassName: "mt-1 text-[10px] font-black uppercase tracking-[0.08em] text-[#6e91a8]",
    };
  }

  if (variant === "circle") {
    return {
      containerClassName: "mx-auto mt-8 grid max-w-xs grid-cols-4 gap-3",
      itemClassName: "flex aspect-square flex-col items-center justify-center rounded-full border border-[#d4e0e7] bg-white/76 shadow-lg shadow-[#123760]/8",
      valueClassName: "font-serif text-2xl leading-none text-[#123760]",
      labelClassName: "mt-1 text-[9px] font-black uppercase tracking-[0.06em] text-[#6e91a8]",
    };
  }

  return {
    containerClassName: "mx-auto mt-8 grid max-w-xs grid-cols-4 gap-3",
    itemClassName: "rounded-[10px] border border-[#d4e0e7] bg-white/76 px-2 py-4 shadow-lg shadow-[#123760]/8",
    valueClassName: "font-serif text-2xl leading-none text-[#123760]",
    labelClassName: "mt-1 text-[10px] font-black uppercase tracking-[0.08em] text-[#6e91a8]",
  };
}

function getEventClasses(variant = "cards") {
  if (variant === "list") {
    return {
      container: "mt-8 divide-y divide-[#d4e0e7] rounded-[14px] border border-[#d4e0e7] bg-white/76 text-left shadow-xl shadow-[#123760]/8",
      item: "p-5",
      eyebrow: "text-xs font-black uppercase tracking-[0.22em] text-[#6e91a8]",
      title: "mt-2 font-serif text-2xl italic text-[#123760]",
      time: "mt-1 text-sm font-black text-[#315a78]",
      venue: "mt-3 text-sm font-black text-[#123760]",
      address: "mt-1 text-sm font-semibold leading-6 text-[#597286]",
      button: "mt-4 inline-flex rounded-full bg-[#123760] px-5 py-2.5 text-xs font-black uppercase tracking-[0.08em] text-white",
    };
  }

  if (variant === "elegant") {
    return {
      container: "mt-8 space-y-6",
      item: "rounded-t-full rounded-b-[18px] border border-[#d4e0e7] bg-white/82 px-6 pb-6 pt-10 shadow-xl shadow-[#123760]/10",
      eyebrow: "text-xs font-black uppercase tracking-[0.24em] text-[#6e91a8]",
      title: "mt-4 font-serif text-3xl italic text-[#123760]",
      time: "mt-2 text-base font-black text-[#315a78]",
      venue: "mt-5 text-sm font-black text-[#123760]",
      address: "mt-1 text-sm font-semibold leading-6 text-[#597286]",
      button: "mt-5 inline-flex rounded-full bg-[#123760] px-6 py-3 text-xs font-black uppercase tracking-[0.08em] text-white",
    };
  }

  return {
    container: "mt-9 space-y-5",
    item: "rounded-[14px] border border-[#d4e0e7] bg-white/82 p-6 shadow-xl shadow-[#123760]/10",
    eyebrow: "text-xs font-black uppercase tracking-[0.22em] text-[#6e91a8]",
    title: "mt-3 font-serif text-3xl italic text-[#123760]",
    time: "mt-2 text-base font-black text-[#315a78]",
    venue: "mt-5 text-sm font-black text-[#123760]",
    address: "mt-2 text-sm font-semibold leading-7 text-[#597286]",
    button: "mt-5 inline-flex rounded-full bg-[#123760] px-6 py-3 text-xs font-black uppercase tracking-[0.08em] text-white",
  };
}

function getStoryClasses(variant = "card") {
  if (variant === "timeline") {
    return {
      container: "relative mt-8 space-y-4 before:absolute before:left-3 before:top-0 before:h-full before:w-px before:bg-[#d4e0e7]",
      item: "relative rounded-[14px] border border-[#d4e0e7] bg-white/78 p-5 pl-8 text-left shadow-lg shadow-[#123760]/8 before:absolute before:left-2 before:top-7 before:h-3 before:w-3 before:rounded-full before:bg-[#123760]",
      year: "text-xs font-black uppercase tracking-[0.2em] text-[#6e91a8]",
      title: "mt-2 font-serif text-2xl italic text-[#123760]",
      description: "mt-2 text-sm font-semibold leading-7 text-[#597286]",
    };
  }

  if (variant === "stacked") {
    return {
      container: "mt-8 space-y-3",
      item: "border-b border-[#d4e0e7] px-2 py-4 text-left",
      year: "text-xs font-black uppercase tracking-[0.2em] text-[#6e91a8]",
      title: "mt-1 font-serif text-2xl italic text-[#123760]",
      description: "mt-2 text-sm font-semibold leading-7 text-[#597286]",
    };
  }

  return {
    container: "mt-8 space-y-4",
    item: "rounded-[14px] border border-[#d4e0e7] bg-white/78 p-5 text-left shadow-lg shadow-[#123760]/8",
    year: "text-xs font-black uppercase tracking-[0.2em] text-[#6e91a8]",
    title: "mt-2 font-serif text-2xl italic text-[#123760]",
    description: "mt-2 text-sm font-semibold leading-7 text-[#597286]",
  };
}

function getGalleryClasses(variant = "grid") {
  if (variant === "carousel") {
    return {
      container: "mt-8 flex snap-x gap-3 overflow-x-auto pb-2",
      item: "w-48 shrink-0 snap-center overflow-hidden rounded-[14px] border-[5px] border-white shadow-lg shadow-[#123760]/12",
      image: "aspect-[3/4] h-full w-full object-cover",
    };
  }

  if (variant === "masonry") {
    return {
      container: "mt-8 columns-2 gap-3 space-y-3",
      item: "mb-3 block w-full overflow-hidden rounded-[14px] border-[5px] border-white shadow-lg shadow-[#123760]/12",
      image: "w-full object-cover",
    };
  }

  return {
    container: "mt-8 grid grid-cols-2 gap-3",
    item: "overflow-hidden rounded-[14px] border-[5px] border-white shadow-lg shadow-[#123760]/12",
    image: "aspect-[3/4] h-full w-full object-cover",
  };
}

export default function BlueWatercolorMuslimTemplate({
  data = sampleInvitation,
  guestName,
  guestSlug,
}) {
  const [mounted, setMounted] = useState(false);
  const { couple } = data;
  const events = data.events?.length ? data.events : sampleInvitation.events;
  const story = data.story?.length ? data.story : sampleInvitation.story;
  const gallery = data.gallery?.length ? data.gallery : sampleInvitation.gallery;
  const accounts = data.bankAccounts?.length ? data.bankAccounts : sampleInvitation.bankAccounts;
  const designConfig = getDesignConfig("blue-watercolor-muslim", data.designConfig);
  const countdownConfig = getCountdownWidgetConfig(designConfig);
  const countdownClasses = getCountdownClasses(countdownConfig.variant);
  const eventWidgetConfig = getEventWidgetConfig(designConfig);
  const eventClasses = getEventClasses(eventWidgetConfig.variant);
  const storyWidgetConfig = getStoryWidgetConfig(designConfig);
  const storyClasses = getStoryClasses(storyWidgetConfig.variant);
  const galleryWidgetConfig = getGalleryWidgetConfig(designConfig);
  const galleryClasses = getGalleryClasses(galleryWidgetConfig.variant);

  const coupleTitle = `${couple.groomNickname} & ${couple.brideNickname}`;
  const initials = useMemo(
    () => `${couple.groomNickname?.[0] || "F"} & ${couple.brideNickname?.[0] || "N"}`,
    [couple.groomNickname, couple.brideNickname],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-[#fff5eb]">
        <div className="mx-auto min-h-screen w-full max-w-[430px] bg-[#fff8ee]" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#dbe7ee] text-[#123760]">
      <div className="mx-auto min-h-screen w-full max-w-[430px] overflow-hidden bg-[#fff8ee] shadow-2xl shadow-[#123760]/20">
        <section id="home" className="relative min-h-screen overflow-hidden px-7 py-10 text-center">
          <OrnamentLayer ornaments={getSectionOrnaments(designConfig, "home")} />
          <div className="absolute inset-0 bg-white/28" />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="relative z-10 flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center"
          >
            <p className="text-xs font-black uppercase tracking-[0.26em] text-[#6e91a8]">
              The Wedding Of
            </p>
            <img
              src="/assets/muslim-couple-blue.svg"
              alt={`Ilustrasi ${coupleTitle}`}
              className="mt-6 w-[310px] max-w-full drop-shadow-2xl"
            />
            <h1 className="mt-4 font-serif text-[46px] italic leading-none text-[#123760]">
              {coupleTitle}
            </h1>
            <p className="mt-5 text-xs font-black uppercase tracking-[0.22em] text-[#315a78]">
              {events[0]?.date || "Minggu, 31 Mei 2026"}
            </p>
            {guestName ? (
              <div className="mt-7 rounded-[12px] border border-[#d4e0e7] bg-white/72 px-6 py-4 shadow-xl shadow-[#123760]/8 backdrop-blur">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6e91a8]">
                  Kepada Yth.
                </p>
                <p className="mt-1 font-serif text-2xl italic text-[#123760]">{guestName}</p>
              </div>
            ) : null}
            <a
              href="#couple"
              className="mt-7 rounded-full bg-[#123760] px-8 py-4 text-sm font-black text-white shadow-xl shadow-[#123760]/20"
            >
              Buka Undangan
            </a>
          </motion.div>
        </section>

        <WatercolorSection id="date" soft designConfig={designConfig}>
          <p className="font-serif text-[56px] italic leading-none text-[#123760]">{initials}</p>
          <h2 className="mt-8 font-serif text-4xl italic text-[#123760]">Count The Date</h2>
          {countdownConfig.enabled ? (
            <CountdownTimer
              event={getCountdownTargetEvent(events, countdownConfig)}
              completeText={countdownConfig.completeText}
              {...countdownClasses}
            />
          ) : null}
        </WatercolorSection>

        <WatercolorSection id="couple" designConfig={designConfig}>
          <SectionTitle
            eyebrow="Mempelai"
            title="Bride & Groom"
            desc="Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan acara pernikahan kami."
          />
          <div className="mt-10 grid gap-5">
            <article className="rounded-[14px] border border-[#d4e0e7] bg-white/78 p-6 shadow-xl shadow-[#123760]/8">
              <h3 className="font-serif text-3xl italic text-[#123760]">{couple.brideName}</h3>
              <p className="mt-2 text-sm font-semibold text-[#597286]">Putri dari keluarga tercinta</p>
            </article>
            <article className="rounded-[14px] border border-[#d4e0e7] bg-white/78 p-6 shadow-xl shadow-[#123760]/8">
              <h3 className="font-serif text-3xl italic text-[#123760]">{couple.groomName}</h3>
              <p className="mt-2 text-sm font-semibold text-[#597286]">Putra dari keluarga tercinta</p>
            </article>
          </div>
        </WatercolorSection>

        <WatercolorSection id="acara" soft designConfig={designConfig}>
          <SectionTitle eyebrow="Detail Acara" title="Akad & Resepsi" />
          <EventWidget events={events} config={eventWidgetConfig} classes={eventClasses} />
        </WatercolorSection>

        <WatercolorSection id="story" designConfig={designConfig}>
          <SectionTitle eyebrow="Love Story" title="Perjalanan Kami" />
          <StoryWidget stories={story} config={storyWidgetConfig} classes={storyClasses} />
        </WatercolorSection>

        <WatercolorSection id="gallery" soft designConfig={designConfig}>
          <SectionTitle eyebrow="Gallery" title="Momen Bahagia" />
          <GalleryWidget
            images={gallery}
            coverImage={data.coverImage}
            config={galleryWidgetConfig}
            classes={galleryClasses}
          />
        </WatercolorSection>

        {data.features?.gift ? (
          <WatercolorSection id="gift" designConfig={designConfig}>
            <SectionTitle eyebrow="Wedding Gift" title="Amplop Digital" />
            <div className="mt-8 space-y-4">
              {accounts.map((account) => (
                <article
                  key={`${account.bank}-${account.number}`}
                  className="rounded-[14px] border border-[#d4e0e7] bg-white/82 p-5 shadow-lg shadow-[#123760]/8"
                >
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#6e91a8]">
                    {account.bank}
                  </p>
                  <p className="mt-3 font-serif text-2xl italic text-[#123760]">
                    {account.number}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#597286]">a.n. {account.name}</p>
                </article>
              ))}
            </div>
          </WatercolorSection>
        ) : null}

        {data.features?.rsvp ? (
          <section id="rsvp" className="bg-[#123760] px-6 pb-28 pt-14 text-center text-white">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#bdd0db]">
              RSVP
            </p>
            <h2 className="mt-3 font-serif text-4xl italic">Konfirmasi Kehadiran</h2>
            <p className="mt-3 text-sm font-semibold leading-7 text-white/72">
              Mohon konfirmasi kehadiran agar kami dapat menyiapkan acara dengan baik.
            </p>
            <RSVPForm
              invitationSlug={data.slug}
              guestSlug={guestSlug}
              guestName={guestName}
            />
          </section>
        ) : null}
      </div>
      <BottomNav />
    </main>
  );
}
