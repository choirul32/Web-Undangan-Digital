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
import RSVPForm from "../components/RSVPForm";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Date", href: "#date" },
  { label: "Couple", href: "#couple" },
  { label: "Acara", href: "#acara" },
  { label: "RSVP", href: "#rsvp" },
];

function formatEventDate(event) {
  return event?.date || "Minggu, 31 Mei 2026";
}

function TemplateOrnaments({ designConfig, section }) {
  return <OrnamentLayer ornaments={getSectionOrnaments(designConfig, section)} />;
}

function OrnamentPair({ className = "" }) {
  return (
    <div className={`pointer-events-none absolute inset-x-0 flex justify-between ${className}`}>
      <img src="/assets/jawa-wing-ornament.svg" alt="" className="w-36 -translate-x-7" />
      <img
        src="/assets/jawa-wing-ornament.svg"
        alt=""
        className="w-36 translate-x-7 scale-x-[-1]"
      />
    </div>
  );
}

function TopPattern() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-16 overflow-hidden">
      <div className="h-full bg-[url('/assets/nusantara-songket.svg')] bg-[length:180px_180px] bg-top opacity-[0.18]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-[#d6c7a7]" />
    </div>
  );
}

function JasmineCluster({ className = "" }) {
  return (
    <div className={`pointer-events-none absolute ${className}`}>
      <div className="relative h-28 w-28">
        <span className="absolute left-8 top-8 h-16 w-5 -rotate-45 rounded-full bg-[#80906f]" />
        <span className="absolute left-12 top-10 h-14 w-5 rotate-12 rounded-full bg-[#a3ad86]" />
        {[0, 1, 2, 3].map((item) => (
          <span
            key={item}
            className="absolute h-10 w-10 rounded-full border border-[#b89a55] bg-[#fff9ea]"
            style={{
              left: `${34 + Math.cos(item * 1.57) * 17}px`,
              top: `${34 + Math.sin(item * 1.57) * 13}px`,
              transform: `rotate(${item * 38}deg)`,
              borderRadius: "56% 44% 58% 42%",
            }}
          />
        ))}
        <span className="absolute left-[47px] top-[45px] h-5 w-5 rounded-full bg-[#d6b46a]" />
      </div>
    </div>
  );
}

function BatikFrameCover({ couple, events, heroImage }) {
  const firstEvent = events[0] || {};
  const dateParts = ["JUMAT", "24", "MARET"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative z-10 flex min-h-screen items-center px-5 py-8"
    >
      <div className="relative mx-auto min-h-[720px] w-full max-w-[360px] overflow-hidden rounded-[14px] border-[14px] border-[#34261e] bg-[#fdf6dc] shadow-2xl shadow-black/18">
        <div className="absolute inset-[-10px] bg-[url('/assets/nusantara-songket.svg')] bg-[length:220px_220px] opacity-45" />
        <div className="absolute inset-[14px] border border-[#c9a45c] bg-[#fff8df]" />
        <div className="absolute inset-[22px] border border-[#d8bc78]" />
        <div className="absolute inset-[34px] bg-[radial-gradient(circle_at_center,#fffdf2_0,#fff8df_58%,#f5e9bf_100%)]" />
        <div className="absolute inset-[34px] bg-[url('/assets/nusantara-hero-bg.svg')] bg-cover opacity-[0.04]" />

        <img
          src="/assets/jawa-leaf-ornament.svg"
          alt=""
          className="absolute left-1/2 top-2 z-10 w-20 -translate-x-1/2 opacity-80"
        />
        <JasmineCluster className="-right-3 top-12 z-20 rotate-12" />
        <JasmineCluster className="-left-6 bottom-24 z-20 -rotate-12 scale-90" />
        <JasmineCluster className="-right-5 bottom-8 z-20 rotate-6" />

        <div className="relative z-10 flex min-h-[720px] flex-col items-center px-8 pb-9 pt-24 text-center">
          <div className="relative">
            <div className="absolute -inset-3 rounded-t-full border-[3px] border-[#d0ad62]" />
            <div className="relative aspect-[3/4] w-[155px] overflow-hidden rounded-t-full border border-[#b7904f] bg-[#dfe0da] shadow-inner">
              <img
                src={heroImage}
                alt={`${couple.groomNickname} dan ${couple.brideNickname}`}
                className="h-full w-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-[#eef0ec]/45" />
              <div className="absolute inset-0 flex items-center justify-center text-[#9b9b92]">
                <span className="text-3xl">▧</span>
              </div>
            </div>
          </div>

          <h1 className="mt-10 font-serif text-[48px] italic leading-none text-[#a88443]">
            {couple.groomNickname?.[0] || "D"} & {couple.brideNickname?.[0] || "S"}
          </h1>
          <div className="mt-6 grid w-[230px] grid-cols-[1fr_70px_1fr] items-center text-[#4a3c31]">
            <p className="border-r border-[#b69a65] pr-4 text-xs font-semibold uppercase tracking-[0.12em]">
              {dateParts[0]}
            </p>
            <p className="font-serif text-[42px] leading-none">{dateParts[1]}</p>
            <p className="border-l border-[#b69a65] pl-4 text-xs font-semibold uppercase tracking-[0.12em]">
              {dateParts[2]}
            </p>
          </div>

          <p className="mt-7 max-w-[230px] text-xs font-semibold uppercase leading-5 tracking-[0.08em] text-[#4f463d]">
            {firstEvent.venue || "SIAWEN, LOCATION"}
            <br />
            {firstEvent.address || "BOURI3NS OKKANA, KAROJN"}
          </p>
          <p className="mt-6 max-w-[230px] font-serif text-base italic leading-5 text-[#776348]">
            The Wedding of
            <br />
            {couple.groomNickname} and {couple.brideNickname}
          </p>
        </div>

        <img
          src="/assets/jawa-leaf-ornament.svg"
          alt=""
          className="absolute bottom-0 left-1/2 z-10 w-20 -translate-x-1/2 rotate-180 opacity-80"
        />
      </div>
    </motion.div>
  );
}

function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-4 z-50 mx-auto flex w-[min(390px,calc(100%-24px))] items-center justify-between rounded-full border border-[#ded1b7] bg-white/92 px-3 py-2 shadow-2xl shadow-black/18 backdrop-blur">
      {navItems.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="rounded-full px-3 py-2 text-[11px] font-black text-[#31261f] transition-colors hover:bg-[#31261f] hover:text-white"
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}

function SectionTitle({ eyebrow, title }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={fadeUp}
      className="text-center"
    >
      {eyebrow ? (
        <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#9e9275]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-2 font-serif text-[34px] leading-tight text-[#31261f]">
        {title}
      </h2>
    </motion.div>
  );
}

function CoupleProfile({ image, name, role }) {
  return (
    <motion.article
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={fadeUp}
      className="mx-auto max-w-[300px] text-center"
    >
      <img
        src={image}
        alt={name}
        className="mx-auto aspect-[3/4] w-[230px] rounded-[10px] border border-[#e5dcc8] object-cover shadow-xl shadow-black/18"
      />
      <h3 className="mt-10 font-serif text-3xl leading-tight text-[#31261f]">{name}</h3>
      <p className="mt-2 text-sm font-semibold text-[#6b6258]">{role}</p>
      <p className="mt-5 text-base font-bold leading-7 text-[#31261f]">
        Bapak Lorem Ipsum
        <br />
        dan Ibu Lorem Ipsum
      </p>
      <a
        href="https://instagram.com"
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex bg-[#171717] px-8 py-2 text-xs font-black text-white"
      >
        @Instagram
      </a>
    </motion.article>
  );
}

function getCountdownClasses(variant = "minimal") {
  if (variant === "cards") {
    return {
      containerClassName: "mt-5 grid grid-cols-4 gap-2",
      itemClassName: "rounded-[8px] border border-[#ded1b7] bg-white/70 px-2 py-3 text-center shadow-lg shadow-black/6",
      valueClassName: "font-serif text-2xl leading-none text-[#31261f]",
      labelClassName: "mt-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#6b6258]",
    };
  }

  if (variant === "circle") {
    return {
      containerClassName: "mt-5 grid grid-cols-4 gap-2",
      itemClassName: "flex aspect-square flex-col items-center justify-center rounded-full border border-[#ded1b7] bg-white/70 text-center shadow-lg shadow-black/6",
      valueClassName: "font-serif text-2xl leading-none text-[#31261f]",
      labelClassName: "mt-1 text-[9px] font-bold uppercase tracking-[0.06em] text-[#6b6258]",
    };
  }

  return {
    containerClassName: "mt-5 grid grid-cols-4 gap-2",
    itemClassName: "text-center",
    valueClassName: "font-serif text-2xl leading-none text-[#31261f]",
    labelClassName: "mt-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#6b6258]",
  };
}

function getEventClasses(variant = "cards") {
  if (variant === "list") {
    return {
      container: "mt-9 divide-y divide-[#ded1b7] rounded-[10px] border border-[#ded1b7] bg-white/78 text-left shadow-lg shadow-black/8",
      item: "p-5",
      eyebrow: "text-[11px] font-black uppercase tracking-[0.22em] text-[#9e9275]",
      title: "mt-2 font-serif text-2xl text-[#31261f]",
      time: "mt-1 text-sm font-black text-[#6b6258]",
      venue: "mt-4 text-sm font-black text-[#31261f]",
      address: "mt-1 text-sm font-semibold leading-6 text-[#6b6258]",
      button: "mt-4 inline-flex bg-[#171717] px-6 py-2.5 text-xs font-black text-white",
    };
  }

  if (variant === "elegant") {
    return {
      container: "mt-9 space-y-6",
      item: "rounded-t-full rounded-b-[16px] border border-[#ded1b7] bg-white/78 px-6 pb-6 pt-10 text-center shadow-lg shadow-black/8",
      eyebrow: "text-[11px] font-black uppercase tracking-[0.22em] text-[#9e9275]",
      title: "mt-4 font-serif text-3xl text-[#31261f]",
      time: "mt-2 text-base font-black text-[#6b6258]",
      venue: "mt-5 text-base font-black text-[#31261f]",
      address: "mt-2 text-sm font-semibold leading-6 text-[#6b6258]",
      button: "mt-5 inline-flex bg-[#171717] px-8 py-3 text-xs font-black text-white",
    };
  }

  return {
    container: "mt-9 space-y-5",
    item: "rounded-[10px] border border-[#ded1b7] bg-white/78 p-5 text-center shadow-lg shadow-black/8",
    eyebrow: "text-[11px] font-black uppercase tracking-[0.22em] text-[#9e9275]",
    title: "mt-3 font-serif text-3xl text-[#31261f]",
    time: "mt-2 text-base font-black text-[#6b6258]",
    venue: "mt-5 text-base font-black text-[#31261f]",
    address: "mt-2 text-sm font-semibold leading-6 text-[#6b6258]",
    button: "mt-5 inline-flex bg-[#171717] px-8 py-3 text-xs font-black text-white",
  };
}

export default function AdatJawaMobileTemplate({
  data = sampleInvitation,
  guestName,
  guestSlug,
}) {
  const [isMounted, setIsMounted] = useState(false);
  const { couple } = data;
  const events = data.events?.length ? data.events : sampleInvitation.events;
  const gallery = data.gallery?.length ? data.gallery : sampleInvitation.gallery;
  const accounts = data.bankAccounts?.length ? data.bankAccounts : sampleInvitation.bankAccounts;
  const designConfig = getDesignConfig("adat-jawa-mobile", data.designConfig);
  const countdownConfig = getCountdownWidgetConfig(designConfig);
  const countdownClasses = getCountdownClasses(countdownConfig.variant);
  const eventWidgetConfig = getEventWidgetConfig(designConfig);
  const eventClasses = getEventClasses(eventWidgetConfig.variant);

  const heroImage = data.coverImage || gallery[0] || "/assets/nusantara-adat.svg";
  const brideImage = gallery[1] || heroImage;
  const groomImage = gallery[2] || heroImage;

  const initials = useMemo(
    () => `${couple.groomNickname?.[0] || "D"} | ${couple.brideNickname?.[0] || "M"}`,
    [couple.groomNickname, couple.brideNickname],
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <main className="min-h-screen bg-[#f8f5ef]">
        <div className="mx-auto min-h-screen w-full max-w-[430px] bg-[#fbf8f2]" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#e9e2d6] text-[#31261f]">
      <div className="mx-auto min-h-screen w-full max-w-[430px] overflow-hidden bg-[#fbf8f2] shadow-2xl shadow-black/20">
        <section
          id="home"
          className="relative min-h-screen overflow-hidden text-center"
        >
          <TopPattern />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#fbf7e8_0,#eee7d6_48%,#d6ccb8_100%)]" />
          <div className="absolute inset-0 bg-[url('/assets/template-adat-jawa-premium.png')] bg-cover bg-center opacity-[0.16] blur-[1px]" />
          <div className="absolute inset-0 bg-[#f5eddb]/70" />
          <TemplateOrnaments designConfig={designConfig} section="home" />
          <BatikFrameCover couple={couple} events={events} heroImage={heroImage} />
        </section>

        <section id="date" className="relative px-7 py-14 text-center">
          <div className="absolute inset-0 bg-[url('/assets/nusantara-hero-bg.svg')] bg-cover opacity-[0.05]" />
          <TemplateOrnaments designConfig={designConfig} section="date" />
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
            className="relative z-10"
          >
            <p className="font-serif text-[54px] italic leading-none text-[#31261f]">
              {initials}
            </p>
            <h2 className="mt-10 font-serif text-4xl text-[#31261f]">Count The Date</h2>
            {countdownConfig.enabled ? (
              <CountdownTimer
                event={getCountdownTargetEvent(events, countdownConfig)}
                completeText={countdownConfig.completeText}
                {...countdownClasses}
              />
            ) : null}
            <img
              src={heroImage}
              alt="Foto pasangan"
              className="mx-auto mt-10 aspect-[3/4] w-[280px] rounded-[10px] border border-[#e5dcc8] object-cover shadow-xl shadow-black/18"
            />
          </motion.div>
        </section>

        <section id="couple" className="relative px-7 py-14 text-center">
          <div className="absolute inset-0 bg-[url('/assets/nusantara-hero-bg.svg')] bg-cover opacity-[0.04]" />
          <TemplateOrnaments designConfig={designConfig} section="couple" />
          <div className="relative z-10">
            <SectionTitle title="Bride & Groom" />
            <p className="mx-auto mt-5 max-w-[310px] text-sm font-semibold leading-7 text-[#6b6258]">
              Tanpa mengurangi rasa hormat, kami bermaksud mengundang Bapak/Ibu/Saudara/i
              untuk menghadiri acara pernikahan kami.
            </p>

            <div className="mt-14 space-y-16">
              <CoupleProfile
                image={brideImage}
                name={couple.brideName}
                role="Putri dari"
              />
              <img
                src="/assets/jawa-leaf-ornament.svg"
                alt=""
                className="mx-auto w-20 opacity-90"
              />
              <CoupleProfile
                image={groomImage}
                name={couple.groomName}
                role="Putra dari"
              />
            </div>
          </div>
        </section>

        <section id="acara" className="relative px-7 py-14">
          <div className="absolute inset-0 bg-[#f4efe7]" />
          <TemplateOrnaments designConfig={designConfig} section="acara" />
          <div className="relative z-10">
            <SectionTitle eyebrow="Detail Acara" title="Save The Date" />
            <EventWidget events={events} config={eventWidgetConfig} classes={eventClasses} />
          </div>
        </section>

        <section id="gift" className="relative px-7 py-14 text-center">
          <TemplateOrnaments designConfig={designConfig} section="gift" />
          <div className="relative z-10">
          <SectionTitle eyebrow="Wedding Gift" title="Amplop Digital" />
          <div className="mt-8 space-y-4">
            {accounts.map((account) => (
              <article
                key={`${account.bank}-${account.number}`}
                className="rounded-[10px] border border-[#ded1b7] bg-white p-5 shadow-lg shadow-black/8"
              >
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9e9275]">
                  {account.bank}
                </p>
                <p className="mt-3 font-serif text-2xl text-[#31261f]">{account.number}</p>
                <p className="mt-1 text-sm font-semibold text-[#6b6258]">a.n. {account.name}</p>
              </article>
            ))}
          </div>
          </div>
        </section>

        {data.features?.rsvp ? (
          <section id="rsvp" className="relative bg-[#31261f] px-6 pb-28 pt-14 text-center text-white">
            <TemplateOrnaments designConfig={designConfig} section="rsvp" />
            <div className="relative z-10">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#d6c7a7]">
              RSVP
            </p>
            <h2 className="mt-3 font-serif text-4xl">Konfirmasi Kehadiran</h2>
            <p className="mt-3 text-sm font-semibold leading-7 text-white/72">
              Mohon konfirmasi kehadiran agar kami dapat menyiapkan acara dengan baik.
            </p>
            <RSVPForm
              invitationSlug={data.slug}
              guestSlug={guestSlug}
              guestName={guestName}
            />
            </div>
          </section>
        ) : null}
      </div>
      <BottomNav />
    </main>
  );
}
