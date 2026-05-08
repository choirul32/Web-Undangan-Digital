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

const jsonAssets = {
  heroBg: "https://haribahagia.info/wp-content/uploads/2023/05/nbccbb-scaled-1-2.jpg",
  sectionBg: "https://haribahagia.info/wp-content/uploads/2023/05/vdbvnv-scaled-1-3.jpg",
  eventBg: "https://haribahagia.info/wp-content/uploads/2023/05/vxvxvx-scaled-1-3.jpg",
  giftBg: "https://haribahagia.info/wp-content/uploads/2023/05/bccbbbbb-scaled-1-3.jpg",
  ornament: "https://haribahagia.info/wp-content/uploads/2023/05/jfshfcj-3.png",
  bride: "https://haribahagia.info/wp-content/uploads/2023/05/ncn-1-4.png",
  groom: "https://haribahagia.info/wp-content/uploads/2023/05/gcbvvn-4.png",
  eventIcon: "https://haribahagia.info/wp-content/uploads/2023/05/ICON-22-3-1-2.png",
  bcaLogo: "https://haribahagia.info/wp-content/uploads/2023/05/logo-bcapng-32694-1-2.png",
  gallery: [
    "https://haribahagia.info/wp-content/uploads/2023/05/mmz-12-scaled-1-2.jpg",
    "https://haribahagia.info/wp-content/uploads/2023/05/mmz-cetak-9494-scaled-1-2.jpg",
    "https://haribahagia.info/wp-content/uploads/2023/05/mmz-10-scaled-1-2.jpg",
    "https://haribahagia.info/wp-content/uploads/2023/05/mmz-13-scaled-1-2.jpg",
    "https://haribahagia.info/wp-content/uploads/2023/05/mmz-14-scaled-1-2.jpg",
    "https://haribahagia.info/wp-content/uploads/2023/05/mmz-18-scaled-1-2.jpg",
  ],
};

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const navItems = [
  ["Home", "#undangan"],
  ["Mempelai", "#mempelai"],
  ["Acara", "#acara"],
  ["Gallery", "#gallery"],
  ["RSVP", "#ucapan"],
];

function htmlToPlainText(text = "") {
  return text.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "").trim();
}

function Section({
  id,
  children,
  background,
  dark = false,
  className = "",
  designConfig,
  sectionName,
}) {
  const ornaments = getSectionOrnaments(designConfig, sectionName || id);

  return (
    <section
      id={id}
      className={`relative overflow-hidden px-7 py-16 text-center ${
        dark ? "text-white" : "text-[#593131]"
      } ${className}`}
    >
      {background ? (
        <img src={background} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : null}
      <div
        className={`absolute inset-0 ${
          dark ? "bg-[#663636]/86" : "bg-[#fff8f2]/86"
        }`}
      />
      <div className="absolute inset-0 bg-[url('/assets/nusantara-hero-bg.svg')] bg-cover opacity-[0.05]" />
      <OrnamentLayer ornaments={ornaments} />
      <div className="relative z-10">{children}</div>
    </section>
  );
}

function SectionTitle({ label, title, dark = false }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={fadeUp}
    >
      {label ? (
        <p
          className={`text-xs font-black uppercase tracking-[0.24em] ${
            dark ? "text-white/72" : "text-[#9c7770]"
          }`}
        >
          {label}
        </p>
      ) : null}
      <h2
        className={`mt-2 font-serif text-[38px] italic leading-tight ${
          dark ? "text-white" : "text-[#593131]"
        }`}
      >
        {title}
      </h2>
    </motion.div>
  );
}

function CoupleCard({ image, name, desc }) {
  return (
    <motion.article
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={fadeUp}
      className="mx-auto max-w-[300px]"
    >
      <img
        src={image}
        alt={name}
        className="mx-auto w-[230px] rounded-t-full rounded-b-[18px] border-[6px] border-white object-cover shadow-2xl shadow-[#663636]/20"
      />
      <h3 className="mt-7 font-serif text-3xl italic leading-tight text-[#663636]">{name}</h3>
      <p className="mt-3 text-sm font-semibold leading-7 text-[#755a54]">{desc}</p>
    </motion.article>
  );
}

function CopyButton({ value, label }) {
  const [copied, setCopied] = useState(false);

  const copyValue = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={copyValue}
      className="mt-4 rounded-full bg-[#663636] px-6 py-3 text-xs font-black uppercase tracking-[0.08em] text-white shadow-lg shadow-[#663636]/18"
    >
      {copied ? "Tersalin" : label}
    </button>
  );
}

function getCountdownClasses(variant = "cards") {
  if (variant === "minimal") {
    return {
      containerClassName: "mx-auto mt-7 grid max-w-xs grid-cols-4 gap-2",
      itemClassName: "px-1 py-2",
      valueClassName: "font-serif text-2xl leading-none text-[#663636]",
      labelClassName: "mt-1 text-[10px] font-black uppercase tracking-[0.08em] text-[#8a6660]",
    };
  }

  if (variant === "circle") {
    return {
      containerClassName: "mx-auto mt-7 grid max-w-xs grid-cols-4 gap-3",
      itemClassName: "flex aspect-square flex-col items-center justify-center rounded-full bg-white/78 shadow-lg shadow-black/6",
      valueClassName: "font-serif text-2xl leading-none text-[#663636]",
      labelClassName: "mt-1 text-[9px] font-black uppercase tracking-[0.06em] text-[#8a6660]",
    };
  }

  return {
    containerClassName: "mx-auto mt-7 grid max-w-xs grid-cols-4 gap-3",
    itemClassName: "rounded-[8px] bg-white/78 px-2 py-3 shadow-lg shadow-black/6",
    valueClassName: "font-serif text-2xl leading-none text-[#663636]",
    labelClassName: "mt-1 text-[10px] font-black uppercase tracking-[0.08em] text-[#8a6660]",
  };
}

function getEventClasses(variant = "cards") {
  if (variant === "list") {
    return {
      icon: "mx-auto mt-7 w-14 opacity-80",
      container: "mt-8 divide-y divide-[#eadbd4] rounded-[12px] border border-[#eadbd4] bg-white/82 text-left shadow-xl shadow-[#663636]/10",
      item: "p-5",
      eyebrow: "font-serif text-2xl italic text-[#663636]",
      title: "mt-3 text-sm font-black uppercase tracking-[0.14em] text-[#8a6660]",
      time: "mt-2 text-lg font-black text-[#663636]",
      venue: "mt-4 text-sm font-black text-[#663636]",
      address: "mt-1 text-sm font-semibold leading-7 text-[#755a54]",
      button: "mt-4 inline-flex rounded-full bg-[#663636] px-6 py-3 text-xs font-black uppercase tracking-[0.08em] text-white",
    };
  }

  if (variant === "elegant") {
    return {
      icon: "mx-auto mt-7 w-16 opacity-80",
      container: "mt-8 space-y-6",
      item: "rounded-t-full rounded-b-[18px] border border-[#eadbd4] bg-white/82 px-6 pb-6 pt-10 shadow-xl shadow-[#663636]/10",
      eyebrow: "font-serif text-3xl italic text-[#663636]",
      title: "mt-4 text-sm font-black uppercase tracking-[0.14em] text-[#8a6660]",
      time: "mt-2 text-lg font-black text-[#663636]",
      venue: "mt-5 text-sm font-black text-[#663636]",
      address: "mt-2 text-sm font-semibold leading-7 text-[#755a54]",
      button: "mt-5 inline-flex rounded-full bg-[#663636] px-6 py-3 text-xs font-black uppercase tracking-[0.08em] text-white",
    };
  }

  return {
    icon: "mx-auto mt-7 w-16 opacity-80",
    container: "mt-8 space-y-5",
    item: "rounded-[12px] border border-[#eadbd4] bg-white/82 p-6 shadow-xl shadow-[#663636]/10",
    eyebrow: "font-serif text-3xl italic text-[#663636]",
    title: "mt-4 text-sm font-black uppercase tracking-[0.14em] text-[#8a6660]",
    time: "mt-2 text-lg font-black text-[#663636]",
    venue: "mt-5 text-sm font-semibold leading-7 text-[#755a54]",
    address: "text-sm font-semibold leading-7 text-[#755a54]",
    button: "mt-5 inline-flex rounded-full bg-[#663636] px-6 py-3 text-xs font-black uppercase tracking-[0.08em] text-white",
  };
}

function getStoryClasses(variant = "card") {
  if (variant === "timeline") {
    return {
      container: "relative mt-8 space-y-5 before:absolute before:left-3 before:top-0 before:h-full before:w-px before:bg-[#eadbd4]",
      item: "relative rounded-[12px] bg-white/82 p-5 pl-8 text-left shadow-lg shadow-[#663636]/8 before:absolute before:left-2 before:top-7 before:h-3 before:w-3 before:rounded-full before:bg-[#663636]",
      year: "text-xs font-black uppercase tracking-[0.18em] text-[#9c7770]",
      title: "mt-2 font-serif text-2xl italic text-[#663636]",
      description: "mt-2 text-sm font-semibold leading-7 text-[#755a54]",
    };
  }

  if (variant === "stacked") {
    return {
      container: "mt-8 space-y-3",
      item: "border-b border-[#eadbd4] px-2 py-4 text-left",
      year: "text-xs font-black uppercase tracking-[0.18em] text-[#9c7770]",
      title: "mt-2 font-serif text-2xl italic text-[#663636]",
      description: "mt-2 text-sm font-semibold leading-7 text-[#755a54]",
    };
  }

  return {
    container: "mt-8 space-y-5",
    item: "rounded-[12px] bg-white/82 p-5 text-left shadow-lg shadow-[#663636]/8",
    year: "text-xs font-black uppercase tracking-[0.18em] text-[#9c7770]",
    title: "mt-2 font-serif text-2xl italic text-[#663636]",
    description: "mt-2 text-sm font-semibold leading-7 text-[#755a54]",
  };
}

function getGalleryClasses(variant = "grid") {
  if (variant === "carousel") {
    return {
      container: "mt-8 flex snap-x gap-3 overflow-x-auto pb-2",
      item: "w-48 shrink-0 snap-center overflow-hidden rounded-[10px] border-[4px] border-white shadow-lg shadow-[#663636]/12",
      image: "aspect-[3/4] h-full w-full object-cover",
    };
  }

  if (variant === "masonry") {
    return {
      container: "mt-8 columns-2 gap-3 space-y-3",
      item: "mb-3 block w-full overflow-hidden rounded-[10px] border-[4px] border-white shadow-lg shadow-[#663636]/12",
      image: "w-full object-cover",
    };
  }

  return {
    container: "mt-8 grid grid-cols-2 gap-3",
    item: "overflow-hidden rounded-[10px] border-[4px] border-white shadow-lg shadow-[#663636]/12",
    image: "aspect-[3/4] h-full w-full object-cover",
  };
}

function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-4 z-50 mx-auto flex w-[min(430px,calc(100%-18px))] items-center justify-between rounded-full border border-[#e2d1cb] bg-white/92 px-2 py-2 shadow-2xl shadow-black/16 backdrop-blur">
      {navItems.map(([label, href]) => (
        <a
          key={href}
          href={href}
          className="rounded-full px-3 py-2 text-[10px] font-black text-[#663636] transition-colors hover:bg-[#663636] hover:text-white"
        >
          {label}
        </a>
      ))}
    </nav>
  );
}

export default function WatercolorPremiumTemplate({
  data = sampleInvitation,
  guestName,
  guestSlug,
}) {
  const [mounted, setMounted] = useState(false);
  const { couple } = data;
  const events = data.events?.length ? data.events : sampleInvitation.events;
  const story = data.story?.length ? data.story : sampleInvitation.story;
  const gallery = data.gallery?.length ? data.gallery : jsonAssets.gallery;
  const accounts = data.bankAccounts?.length ? data.bankAccounts : sampleInvitation.bankAccounts;
  const designConfig = getDesignConfig("watercolor-premium", data.designConfig);
  const countdownConfig = getCountdownWidgetConfig(designConfig);
  const countdownClasses = getCountdownClasses(countdownConfig.variant);
  const eventWidgetConfig = getEventWidgetConfig(designConfig);
  const eventClasses = getEventClasses(eventWidgetConfig.variant);
  const storyWidgetConfig = getStoryWidgetConfig(designConfig);
  const storyClasses = getStoryClasses(storyWidgetConfig.variant);
  const galleryWidgetConfig = getGalleryWidgetConfig(designConfig);
  const galleryClasses = getGalleryClasses(galleryWidgetConfig.variant);

  const weddingDate = events[0]?.date || "Selasa, 22 Februari 2022";
  const coupleTitle = `${couple.groomNickname} & ${couple.brideNickname}`;
  const initials = useMemo(
    () => `${couple.groomNickname?.[0] || "F"} & ${couple.brideNickname?.[0] || "S"}`,
    [couple.groomNickname, couple.brideNickname],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-[#f3e8df]">
        <div className="mx-auto min-h-screen w-full max-w-[500px] bg-[#fff8f2]" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#e7d8cf] text-[#593131]">
      <div className="mx-auto min-h-screen w-full max-w-[500px] overflow-hidden bg-[#fff8f2] shadow-2xl shadow-black/20">
        <Section
          id="undangan"
          background={data.coverImage || jsonAssets.heroBg}
          className="min-h-screen"
          designConfig={designConfig}
          sectionName="home"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center"
          >
            <p className="text-sm font-semibold tracking-[0.08em] text-[#755a54]">
              You're invited to the wedding of
            </p>
            <img src={jsonAssets.ornament} alt="" className="mt-5 w-36 opacity-95" />
            <h1 className="mt-5 font-serif text-[46px] italic leading-tight text-[#663636]">
              {coupleTitle}
            </h1>
            <p className="mt-5 text-xs font-black uppercase tracking-[0.22em] text-[#755a54]">
              {weddingDate}
            </p>
            {countdownConfig.enabled ? (
              <CountdownTimer
                event={getCountdownTargetEvent(events, countdownConfig)}
                completeText={countdownConfig.completeText}
                {...countdownClasses}
              />
            ) : null}
            {guestName ? (
              <div className="mt-7 rounded-[8px] border border-[#e0ccc4] bg-white/70 px-5 py-4 shadow-lg shadow-black/6">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#9c7770]">
                  Kepada Yth.
                </p>
                <p className="mt-1 font-serif text-2xl italic text-[#663636]">{guestName}</p>
              </div>
            ) : null}
          </motion.div>
        </Section>

        <Section dark background={null} className="bg-[#663636] py-12" designConfig={designConfig} sectionName="quote">
          <p className="mx-auto max-w-sm text-sm font-semibold leading-8 text-white/86">
            "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan
            pasangan-pasangan untukmu agar kamu merasa tenteram kepadanya."
          </p>
          <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-white/66">
            Q.S Ar-Rum
          </p>
        </Section>

        <Section id="mempelai" background={jsonAssets.sectionBg} designConfig={designConfig} sectionName="couple">
          <p className="mx-auto max-w-sm text-sm font-semibold leading-8 text-[#755a54]">
            Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud
            menyelenggarakan syukuran pernikahan putra-putri kami.
          </p>
          <div className="mt-10 space-y-12">
            <CoupleCard
              image={gallery[1] || jsonAssets.bride}
              name={couple.brideName}
              desc="Putri dari Bapak Lorem Ipsum dan Ibu Lorem Ipsum"
            />
            <p className="font-serif text-5xl italic text-[#663636]">&</p>
            <CoupleCard
              image={gallery[2] || jsonAssets.groom}
              name={couple.groomName}
              desc="Putra dari Bapak Lorem Ipsum dan Ibu Lorem Ipsum"
            />
          </div>
        </Section>

        <Section id="acara" background={jsonAssets.eventBg} designConfig={designConfig}>
          <SectionTitle label="Acara" title="Akad & Resepsi" />
          <EventWidget
            events={events}
            config={eventWidgetConfig}
            classes={eventClasses}
            iconSrc={jsonAssets.eventIcon}
            mapsLabel="View location"
          />
        </Section>

        <Section background={jsonAssets.sectionBg} designConfig={designConfig} sectionName="story">
          <SectionTitle title="Love Story" />
          <StoryWidget stories={story} config={storyWidgetConfig} classes={storyClasses} />
        </Section>

        <Section id="gallery" background={jsonAssets.eventBg} designConfig={designConfig}>
          <SectionTitle title="Wedding Gallery" />
          <GalleryWidget
            images={gallery}
            coverImage={data.coverImage}
            config={galleryWidgetConfig}
            classes={galleryClasses}
          />
        </Section>

        <Section background={null} designConfig={designConfig} sectionName="protocol">
          <SectionTitle label="Health Protocols" title="Tetap nyaman dan aman" />
          <div className="mt-8 grid grid-cols-3 gap-3">
            {["Cuci tangan", "Gunakan masker", "Jaga jarak", "Hindari kerumunan", "Hand sanitizer", "Sehat selalu"].map(
              (item) => (
                <div key={item} className="rounded-[8px] bg-white p-3 shadow-lg shadow-[#663636]/8">
                  <p className="text-xs font-black leading-5 text-[#663636]">{item}</p>
                </div>
              ),
            )}
          </div>
        </Section>

        <Section id="gift" dark background={jsonAssets.giftBg} designConfig={designConfig}>
          <SectionTitle title="Wedding Gift" dark />
          <p className="mx-auto mt-5 max-w-sm text-sm font-semibold leading-8 text-white/82">
            Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Jika memberi
            adalah tanda kasih, Anda dapat mengirim kado secara cashless.
          </p>
          <div className="mt-8 space-y-4">
            {accounts.map((account) => (
              <article key={`${account.bank}-${account.number}`} className="rounded-[12px] bg-white p-5 text-[#663636]">
                <img src={jsonAssets.bcaLogo} alt="" className="mx-auto h-8 object-contain" />
                <p className="mt-4 font-serif text-2xl italic">{account.bank}</p>
                <p className="mt-2 text-xl font-black">{account.number}</p>
                <p className="mt-1 text-sm font-semibold text-[#755a54]">a.n. {account.name}</p>
                <CopyButton value={account.number} label="Copy No. Rekening" />
              </article>
            ))}
          </div>
        </Section>

        <Section id="ucapan" background={jsonAssets.heroBg} designConfig={designConfig} sectionName="rsvp">
          <p className="mx-auto max-w-sm text-sm font-semibold leading-8 text-[#755a54]">
            Tiada yang dapat kami ungkapkan selain rasa terima kasih dari hati yang tulus
            apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.
          </p>
          <img src={jsonAssets.ornament} alt="" className="mx-auto mt-8 w-28 opacity-90" />
          <h2 className="mt-5 font-serif text-[40px] italic text-[#663636]">{coupleTitle}</h2>
          <p className="mt-3 text-xs font-black uppercase tracking-[0.2em] text-[#755a54]">
            {weddingDate}
          </p>
          {data.features?.rsvp ? (
            <div className="mt-8 rounded-[12px] bg-[#663636] p-5 text-white">
              <p className="font-serif text-3xl italic">Berikan Ucapan</p>
              <RSVPForm
                invitationSlug={data.slug}
                guestSlug={guestSlug}
                guestName={guestName}
              />
            </div>
          ) : null}
        </Section>

        {data.features?.music && data.musicUrl ? (
          <audio controls className="fixed bottom-24 right-4 z-50 w-48">
            <source src={data.musicUrl} />
          </audio>
        ) : null}
      </div>
      <BottomNav />
    </main>
  );
}
