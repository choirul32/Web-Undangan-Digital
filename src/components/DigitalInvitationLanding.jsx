"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { mergeTemplateOverrides } from "../data/templateAdminDefaults";
import { readDefaultTemplateThumbnail } from "../lib/templateThumbnail";

const whatsappUrl =
  "https://wa.me/6282226551246?text=Halo%20admin,%20saya%20mau%20lihat%20katalog%20undangan%20digital";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.08,
    },
  },
};

const stats = [
  { value: "500+", label: "Kabar bahagia disebar" },
  { value: "20K+", label: "Tamu menerima undangan" },
  { value: "1 hari", label: "Estimasi pengerjaan" },
  { value: "24 jam", label: "Bantuan admin" },
];

const features = [
  { icon: "guest", title: "Nama Tamu", desc: "Link undangan bisa dibuat personal untuk setiap tamu." },
  { icon: "rsvp", title: "RSVP", desc: "Pantau konfirmasi hadir agar acara lebih mudah disiapkan." },
  { icon: "event", title: "Akad & Resepsi", desc: "Detail acara bisa dipisah rapi untuk setiap rangkaian." },
  { icon: "gift", title: "Amplop", desc: "Terima wedding gift digital dengan rekening dan QRIS." },
  { icon: "gallery", title: "Gallery", desc: "Tampilkan foto dan video prewedding terbaik kalian." },
  { icon: "quote", title: "Doa & Quotes", desc: "Tambahkan kutipan atau doa yang sesuai dengan konsep acara." },
  { icon: "story", title: "Love Story", desc: "Ceritakan perjalanan cinta dari awal sampai hari bahagia." },
  { icon: "photobox", title: "Photobox Online", desc: "Tamu foto langsung di web, hasilnya tampil di galeri undangan." },
];

const trustItems = ["Gratis konsultasi", "Revisi dibantu", "Selesai 1 hari"];

const heroSlides = [];

const catalogItems = [];
const catalogTabs = [];

const defaultPlans = [
  {
    name: "Basic",
    priceKey: "basic",
    defaultPrice: "Rp 45.000",
    desc: "Untuk undangan simpel yang tetap rapi dan siap dibagikan.",
    features: [
      "Nama tamu personal",
      "RSVP kehadiran",
      "Detail acara",
      "Profil mempelai",
      "Google Maps",
      "Gallery foto",
      "Masa aktif 3 bulan",
    ],
  },
  {
    name: "Premium",
    priceKey: "premium",
    defaultPrice: "Rp 90.000",
    desc: "Paket paling pas untuk undangan lengkap dan interaktif.",
    featured: true,
    features: [
      "Semua fitur Basic",
      "Amplop digital",
      "Love story",
      "Backsound music",
      "Revisi lebih banyak",
      "Masa aktif lebih lama",
    ],
  },
  {
    name: "Exclusive",
    priceKey: "exclusive",
    defaultPrice: "Rp 149.000",
    desc: "Untuk tampilan lebih personal dengan layanan prioritas.",
    features: [
      "Semua fitur Premium",
      "Photobox online untuk tamu",
      "Video cover cinematic",
      "Template exclusive",
      "Unlimited revisi",
      "Masa aktif 1 tahun",
    ],
  },
];

const steps = [
  ["Pilih desain", "Cari template yang paling cocok dengan konsep acara."],
  ["Kirim data", "Admin bantu input nama, acara, foto, musik, dan lokasi."],
  ["Preview revisi", "Cek hasil undangan dan minta revisi bila diperlukan."],
  ["Siap sebar", "Link undangan siap dibagikan ke WhatsApp dan media sosial."],
];

const faqs = [
  ["Apakah bisa revisi?", "Bisa. Revisi konten dan detail acara dibantu sampai undangan siap dipakai."],
  ["Berapa lama pengerjaan?", "Umumnya 1 hari kerja setelah data dan foto lengkap dikirim."],
  ["Bisa ganti foto dan musik?", "Bisa. Foto gallery dan backsound dapat disesuaikan dengan selera kalian."],
  ["Pembayarannya kapan?", "Bisa konsultasi dulu dengan admin, lalu lanjut sesuai paket yang dipilih."],
];

function LineIcon({ name, className = "h-6 w-6" }) {
  const props = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  if (name === "guest") {
    return <svg {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="9.5" cy="7" r="4" /><path d="M17 11l2 2 4-5" /></svg>;
  }
  if (name === "rsvp") {
    return <svg {...props}><path d="M4 4h16v16H4z" /><path d="m8 12 2.4 2.4L16 9" /></svg>;
  }
  if (name === "event") {
    return <svg {...props}><path d="M8 2v4" /><path d="M16 2v4" /><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M3 10h18" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /></svg>;
  }
  if (name === "gift") {
    return <svg {...props}><rect x="3" y="8" width="18" height="13" rx="2" /><path d="M12 8v13" /><path d="M3 12h18" /><path d="M7.5 8A2.5 2.5 0 1 1 12 6a2.5 2.5 0 1 1 4.5 2" /></svg>;
  }
  if (name === "gallery") {
    return <svg {...props}><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="8.5" cy="10" r="1.5" /><path d="m21 15-4-4-5 5-2-2-4 5" /></svg>;
  }
  if (name === "quote") {
    return <svg {...props}><path d="M8 12H5a3 3 0 0 1 3-3V7a5 5 0 0 0-5 5v5h5v-5Z" /><path d="M19 12h-3a3 3 0 0 1 3-3V7a5 5 0 0 0-5 5v5h5v-5Z" /></svg>;
  }
  if (name === "story") {
    return <svg {...props}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" /><path d="M9 7h7" /><path d="M9 11h5" /></svg>;
  }
  if (name === "photobox") {
    return <svg {...props}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z" /><circle cx="12" cy="13" r="3.5" /></svg>;
  }
  if (name === "check") {
    return <svg {...props}><path d="m5 12 4 4L19 6" /></svg>;
  }
  return <svg {...props}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
}

function SectionHeader({ eyebrow, title, desc }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      variants={staggerContainer}
        className="mx-auto max-w-3xl text-center"
    >
      <motion.p
        variants={fadeUp}
        className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]"
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        variants={fadeUp}
        className="mt-3 text-3xl font-black leading-tight tracking-normal text-[var(--color-primary)] sm:text-4xl"
      >
        {title}
      </motion.h2>
      {desc ? (
        <motion.p
          variants={fadeUp}
          className="mt-4 text-base leading-8 text-[var(--color-text)] sm:text-lg"
        >
          {desc}
        </motion.p>
      ) : null}
    </motion.div>
  );
}

function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[var(--color-accent-pale)]/45 bg-[var(--color-bg)]/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <a href="#home" className="text-xl font-black tracking-normal text-[var(--color-primary)]">
          NusaInvite
        </a>
        <div className="hidden items-center gap-7 text-sm font-black text-[var(--color-text)] md:flex">
          <a className="transition-colors hover:text-[var(--color-accent)]" href="#fitur">
            Fitur
          </a>
          <a className="transition-colors hover:text-[var(--color-accent)]" href="#katalog">
            Katalog
          </a>
          <a className="transition-colors hover:text-[var(--color-accent)]" href="#harga">
            Harga
          </a>
          <a className="transition-colors hover:text-[var(--color-accent)]" href="#faq">
            FAQ
          </a>
        </div>
        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-lg bg-[var(--color-wa)] px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-[var(--color-wa)]/20 transition-colors hover:bg-[var(--color-wa-hover)] sm:px-5"
        >
          Chat Admin
        </motion.a>
      </nav>
    </header>
  );
}

function HeroCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [slides, setSlides] = useState(heroSlides);
  const currentSlide = slides[activeSlide] || null;

  useEffect(() => {
    let isMounted = true;

    fetch("/api/templates")
      .then((response) => response.json())
      .then((result) => {
        if (!isMounted || !Array.isArray(result.data)) {
          return;
        }

        const defaultThumbnail = readDefaultTemplateThumbnail();
        const mappedSlides = mergeTemplateOverrides(result.data)
          .map((template) => ({
            title: template.name,
            desc: template.description || `Template kategori ${template.category || "Custom"}.`,
            image: template.image || defaultThumbnail,
          }));

        if (mappedSlides.length > 0) {
          setSlides(mappedSlides);
          setActiveSlide(0);
        }
      })
      .catch(() => {
        setSlides([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (slides.length <= 1) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 3800);

    return () => window.clearInterval(timer);
  }, [slides]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.75, ease: "easeOut", delay: 0.25 }}
      className="flex justify-center lg:justify-end"
    >
      <div className="relative w-full max-w-[11rem] sm:max-w-[19rem] lg:max-w-sm">
        <div className="relative overflow-hidden rounded-[28px] border-[10px] border-[var(--color-primary)] bg-[var(--color-muted)] shadow-2xl shadow-[var(--color-primary)]/20">
          <div className="absolute left-1/2 top-0 z-30 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-[var(--color-primary)]" />
          <div className="relative aspect-[9/16] w-full">
            <AnimatePresence mode="wait">
              {currentSlide ? (
                <motion.img
                  key={currentSlide.image}
                  src={currentSlide.image}
                  alt={`Preview undangan tema ${currentSlide.title}`}
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.65, ease: "easeOut" }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <motion.div
                  key="empty-slide"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-[var(--color-muted)]"
                />
              )}
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/78 via-[var(--color-primary)]/8 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 z-10 p-5 text-white sm:p-6">
              <AnimatePresence mode="wait">
                {currentSlide ? (
                  <motion.div
                    key={currentSlide.title}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.38, ease: "easeOut" }}
                  >
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-accent-soft)]">
                      Tema Undangan
                    </p>
                    <h3 className="mt-2 text-2xl font-black sm:text-3xl">
                      {currentSlide.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-white/90">
                      {currentSlide.desc}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty-slide-caption"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.38, ease: "easeOut" }}
                  >
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-accent-soft)]">
                      Tema Undangan
                    </p>
                    <h3 className="mt-2 text-2xl font-black sm:text-3xl">Belum Ada Template</h3>
                    <p className="mt-2 text-sm font-semibold leading-6 text-white/90">
                      Buat template baru dari Template Manager untuk menampilkan carousel.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="absolute -right-4 top-8 z-20 rounded-lg border border-[var(--color-accent-pale)] bg-[var(--color-surface)] px-3 py-2 text-[var(--color-primary)] shadow-xl shadow-[var(--color-primary)]/12 sm:-right-8 sm:top-10 sm:px-4 sm:py-3">
          <p className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">Mulai dari</p>
          <p className="mt-1 text-lg font-black leading-none sm:text-2xl">Rp 45K</p>
        </div>

        <div className="absolute -left-5 bottom-10 z-20 rounded-lg bg-[var(--color-accent)] px-3 py-2 text-[var(--color-primary)] shadow-xl shadow-[var(--color-accent)]/20 sm:-left-8 sm:bottom-12 sm:px-4 sm:py-3">
          <p className="text-xs font-black sm:text-sm">Akad + RSVP</p>
          <p className="text-xs font-semibold text-[var(--color-primary)]/80">
            Siap dibagikan
          </p>
        </div>

        <div className="mt-5 flex justify-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              aria-label={`Tampilkan slide ${slide.title}`}
              onClick={() => setActiveSlide(index)}
              className={`h-2.5 rounded-full transition-all ${
                index === activeSlide
                  ? "w-8 bg-[var(--color-primary)]"
                  : "w-2.5 bg-[var(--color-accent-pale)] hover:bg-[var(--color-accent)]"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function HeroSection() {
  return (
    <section
      id="home"
      className="relative isolate overflow-hidden bg-[var(--color-bg)] pt-16"
    >
      <img
        src="/assets/nusantara-hero-bg.svg"
        alt="Background ornamen undangan digital Modern Nusantara Premium"
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
        className="absolute inset-0 -z-20 h-full w-full object-cover opacity-20"
      />
      <div className="absolute inset-0 -z-10 bg-[var(--color-bg)]/94" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-[var(--color-bg)] to-transparent" />

      <div className="mx-auto grid max-w-7xl items-center gap-5 px-5 py-6 sm:gap-8 sm:px-8 sm:py-12 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[0.95fr_1.05fr] lg:px-10 lg:py-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-2xl text-center lg:text-left"
        >
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-2 lg:justify-start">
            {["Undangan digital premium", "Selesai 1 hari"].map((item) => (
              <span
                key={item}
                className="rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-surface)]/90 px-3 py-1.5 text-xs font-black uppercase tracking-[0.08em] text-[var(--color-primary-hover)] shadow-sm backdrop-blur"
              >
                {item}
              </span>
            ))}
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="mt-5 text-3xl font-black leading-tight tracking-normal text-[var(--color-heading)] sm:text-5xl lg:text-[3.45rem]"
          >
            Undangan digital premium yang terasa personal.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--color-text)] sm:text-lg sm:leading-8 lg:mx-0"
          >
            Template dibuat untuk tampil bagus di layar HP tamu, lengkap dengan
            RSVP, amplop digital, QRIS, gallery, maps, musik, dan nama tamu
            personal.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-6 flex flex-wrap justify-center gap-3 sm:mt-8 lg:justify-start">
            <motion.a
              href="#katalog"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 360, damping: 20 }}
              className="rounded-lg bg-[var(--color-primary)] px-6 py-3.5 text-sm font-black text-white shadow-xl shadow-[var(--color-primary)]/20 transition-colors hover:bg-[var(--color-primary-hover)] sm:text-base"
            >
              Lihat Katalog
            </motion.a>
            <motion.a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 360, damping: 20 }}
              className="rounded-lg bg-[var(--color-accent)] px-6 py-3.5 text-sm font-black text-[var(--color-primary)] shadow-xl shadow-[var(--color-accent)]/18 transition-colors hover:bg-[var(--color-accent-soft)] sm:text-base"
            >
              Pesan Sekarang
            </motion.a>
          </motion.div>
          <motion.div
            variants={fadeUp}
            className="mt-5 hidden flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm font-bold text-[var(--color-text)] sm:flex lg:justify-start"
          >
            {["Preview sebelum publish", "Katalog siap pakai", "Dibantu admin"].map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                {item}
              </span>
            ))}
          </motion.div>
          <motion.div
            variants={fadeUp}
            className="mx-auto mt-8 hidden max-w-xl grid-cols-3 overflow-hidden rounded-[8px] border border-slate-200 bg-white text-left shadow-xl shadow-slate-900/5 sm:grid lg:mx-0"
          >
            {[
              ["500+", "undangan"],
              ["20K+", "tamu"],
              ["24 jam", "support"],
            ].map(([value, label]) => (
              <div key={label} className="border-r border-slate-200 px-4 py-3 last:border-r-0 sm:px-5 sm:py-4">
                <p className="text-lg font-black text-[var(--color-primary)] sm:text-2xl">{value}</p>
                <p className="mt-1 text-[11px] font-black uppercase tracking-[0.08em] text-[var(--color-text)]">
                  {label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <HeroCarousel />
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={staggerContainer}
      className="bg-[var(--color-bg)] px-6 pb-16 sm:px-8 lg:px-10"
    >
      <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <motion.div
            key={item.label}
            variants={fadeUp}
            className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] px-6 py-6 text-center shadow-lg shadow-[var(--color-primary)]/8"
          >
            <p className="text-4xl font-black text-[var(--color-primary)]">{item.value}</p>
            <p className="mt-2 text-base font-bold text-[var(--color-text)]">
              {item.label}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

function FeaturesSection() {
  return (
    <section id="fitur" className="relative overflow-hidden bg-[var(--color-surface)] px-5 py-24 sm:px-8 lg:px-10">
      <div className="songket-line absolute inset-x-0 top-0 h-2 opacity-60" />
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Fitur Lengkap"
          title="Kebutuhan undangan modern, tetap dekat dengan rasa acara keluarga."
          desc="Dari akad, resepsi, sampai kirim nama tamu personal, semua dibuat praktis tanpa menghilangkan kesan sakral."
        />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer}
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-xl hover:shadow-slate-900/8"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--color-accent-pale)] bg-[var(--color-section-soft)] text-[var(--color-primary)]">
                <LineIcon name={feature.icon} />
              </div>
              <h3 className="mt-5 text-lg font-black text-[var(--color-primary)]">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--color-text)]">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CatalogCard({ item }) {
  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="group overflow-hidden rounded-[8px] border border-slate-200 bg-white shadow-lg shadow-slate-900/6 transition-shadow hover:shadow-2xl hover:shadow-slate-900/12"
    >
      <div className="relative flex min-h-[25rem] items-center justify-center bg-slate-100 px-6 py-7">
        <div className="absolute left-4 top-4 rounded-md bg-white/94 px-3 py-1.5 text-xs font-black text-[var(--color-primary-hover)] shadow-sm backdrop-blur">
          {item.style || "Template"}
        </div>
        <div className="absolute right-4 top-4 rounded-md bg-[var(--color-primary)] px-3 py-1.5 text-xs font-black text-white shadow-sm">
          {item.badge}
        </div>
        <div className="relative aspect-[9/16] w-full max-w-[13.5rem] overflow-hidden rounded-[24px] border-[8px] border-[var(--color-primary)] bg-[var(--color-bg)] shadow-2xl shadow-[var(--color-primary)]/18">
          <div className="absolute left-1/2 top-0 z-20 h-4 w-20 -translate-x-1/2 rounded-b-2xl bg-[var(--color-primary)]" />
          <img
            src={item.image}
            alt={`Preview template undangan ${item.title}`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-black text-[var(--color-primary)]">{item.title}</h3>
        <div className="mt-2 flex items-end gap-3">
          <p className="text-xl font-black text-[var(--color-primary)]">{item.price}</p>
          {item.oldPrice ? (
            <p className="pb-0.5 text-sm font-bold text-[var(--color-text)] line-through">
              {item.oldPrice}
            </p>
          ) : null}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <motion.a
            href={item.previewUrl || "#katalog"}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-center text-sm font-black text-[var(--color-text)] transition-colors hover:bg-slate-50"
          >
            Preview
          </motion.a>
          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-lg bg-[var(--color-accent)] px-4 py-2.5 text-center text-sm font-black text-[var(--color-primary)] transition-colors hover:bg-[var(--color-accent-soft)]"
          >
            Pesan
          </motion.a>
        </div>
      </div>
    </motion.article>
  );
}

function CatalogSection() {
  const [landingCatalogItems, setLandingCatalogItems] = useState(catalogItems);
  const activeCatalogTabs = Array.from(
    new Set([
      ...catalogTabs,
      ...landingCatalogItems.map((item) => item.category).filter(Boolean),
    ]),
  );
  const [activeCatalog, setActiveCatalog] = useState(activeCatalogTabs[0] || "");
  const filteredItems = landingCatalogItems.filter(
    (item) => item.category === activeCatalog,
  );

  useEffect(() => {
    let isMounted = true;

    fetch("/api/templates")
      .then((response) => response.json())
      .then((result) => {
        if (!isMounted || !Array.isArray(result.data)) {
          return;
        }

        const defaultThumbnail = readDefaultTemplateThumbnail();
        const mappedItems = mergeTemplateOverrides(result.data)
          .map((template) => ({
            title: template.name,
            category: template.category,
            style: template.category,
            badge: template.badge || "Ready",
            price: template.price || "Rp 99.000",
            oldPrice: "",
            image: template.image || defaultThumbnail,
            previewUrl: template.previewUrl || "/preview",
          }));

        setLandingCatalogItems(mappedItems);

        if (!mappedItems.some((item) => item.category === activeCatalog)) {
          setActiveCatalog(mappedItems[0]?.category || "");
        }
      })
      .catch(() => {
        setLandingCatalogItems([]);
        setActiveCatalog("");
      });

    return () => {
      isMounted = false;
    };
  }, [activeCatalog]);

  return (
    <section id="katalog" className="relative overflow-hidden bg-[var(--color-bg)] px-5 py-24 sm:px-8 lg:px-10">
      <div className="nusantara-pattern absolute inset-0 opacity-8" />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Katalog"
          title="Pilih desain dengan rasa lokal yang tetap modern."
          desc="Filter berdasarkan gaya favorit: Modern, Adat, Non Foto, atau Muslim. Harga promo sudah termasuk bantuan setup dari admin."
        />

        {activeCatalogTabs.length > 0 ? (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="mt-10 flex flex-wrap justify-center gap-3"
          >
            {activeCatalogTabs.map((tab) => {
              const total = landingCatalogItems.filter(
                (item) => item.category === tab,
              ).length;
              const isActive = activeCatalog === tab;

              return (
                <motion.button
                  key={tab}
                  type="button"
                  variants={fadeUp}
                  whileHover={{ y: -2, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveCatalog(tab)}
                  className={`rounded-lg border px-4 py-2.5 text-sm font-black transition-colors ${
                    isActive
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/16"
                      : "border-[var(--color-accent-pale)] bg-[var(--color-surface)] text-[var(--color-primary-hover)] hover:border-[var(--color-accent)] hover:bg-white"
                  }`}
                >
                  {tab}
                  <span
                    className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                      isActive
                        ? "bg-[var(--color-accent)] text-[var(--color-primary)]"
                        : "bg-[var(--color-muted-strong)] text-[var(--color-primary-hover)]"
                    }`}
                  >
                    {total}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        ) : null}

        <motion.div
          key={activeCatalog}
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <CatalogCard key={item.title} item={item} />
            ))
          ) : (
            <p className="col-span-full rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] px-5 py-6 text-center text-base font-semibold text-[var(--color-text)]">
              Belum ada template di katalog. Buat template baru dari Template Manager.
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function PricingSection() {
  const [plans, setPlans] = React.useState(defaultPlans);

  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem("nusa-invite:platform-settings");
      if (!stored) return;
      const parsed = JSON.parse(stored);
      const prices = parsed?.packagePrices;
      if (!prices) return;

      setPlans(defaultPlans.map((plan) => ({
        ...plan,
        price: prices[plan.priceKey] || plan.defaultPrice,
      })));
    } catch {
      // fallback ke default
    }
  }, []);

  return (
    <section id="harga" className="bg-[var(--color-surface)] px-5 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Pricelist"
          title="Paket jelas untuk lamaran, akad, sampai resepsi."
          desc="Calon pelanggan bisa langsung membandingkan fitur dan memilih paket tanpa perlu menebak biaya."
        />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
          variants={staggerContainer}
          className="mt-14 grid gap-8 lg:grid-cols-3"
        >
          {plans.map((plan) => (
            <motion.article
              key={plan.name}
              variants={fadeUp}
              whileHover={{ y: -8 }}
              className={`relative rounded-[8px] border p-7 shadow-xl transition-shadow ${
                plan.featured
                  ? "border-[var(--color-accent)] bg-[var(--color-primary)] text-white shadow-[var(--color-accent)]/20 lg:-mt-6 lg:mb-6"
                  : "border-[var(--color-accent-pale)] bg-[var(--color-muted)] text-[var(--color-primary)] shadow-[var(--color-primary)]/12"
              }`}
            >
              {plan.featured ? (
                <span className="absolute right-5 top-5 rounded-md bg-[var(--color-accent)] px-3 py-1.5 text-xs font-black text-[var(--color-primary)]">
                  Best Seller
                </span>
              ) : null}
              <h3 className="text-2xl font-black">{plan.name}</h3>
              <p
                className={`mt-3 text-base leading-7 ${
                  plan.featured ? "text-white/90" : "text-[var(--color-text)]"
                }`}
              >
                {plan.desc}
              </p>
              <p className="mt-7 text-4xl font-black">{plan.price || plan.defaultPrice}</p>
              <ul className="mt-7 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className={`text-base font-bold ${
                      plan.featured ? "text-white/92" : "text-[var(--color-text)]"
                    }`}
                  >
                    <span className="mr-2 inline-flex h-4 w-4 translate-y-0.5 items-center justify-center text-[var(--color-accent)]">
                      <LineIcon name="check" className="h-4 w-4" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              <motion.a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                className="mt-8 block rounded-lg bg-[var(--color-accent)] px-5 py-3.5 text-center text-sm font-black text-[var(--color-primary)] transition-colors hover:bg-[var(--color-accent-soft)]"
              >
                Pesan Paket
              </motion.a>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function StepsSection() {
  return (
    <section className="bg-[var(--color-section-soft)] px-5 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Cara Order"
          title="Prosesnya simpel, tetap rapi untuk kebutuhan acara keluarga."
        />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="mt-14 grid gap-6 md:grid-cols-4"
        >
          {steps.map(([title, desc], index) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] p-7 shadow-lg shadow-[var(--color-primary)]/10"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--color-primary)] text-base font-black text-white">
                {index + 1}
              </div>
              <h3 className="mt-5 text-xl font-black text-[var(--color-primary)]">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--color-text)]">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section id="faq" className="bg-[var(--color-bg)] px-5 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          eyebrow="FAQ"
          title="Pertanyaan yang sering muncul sebelum kabar bahagia disebar."
        />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="mt-12 space-y-5"
        >
          {faqs.map(([question, answer]) => (
            <motion.details
              key={question}
              variants={fadeUp}
              className="group rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] p-6 shadow-md shadow-[var(--color-primary)]/8 transition-shadow hover:shadow-xl hover:shadow-[var(--color-primary)]/12 sm:p-8"
            >
              <summary className="cursor-pointer list-none text-lg font-black leading-snug text-[var(--color-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] sm:text-xl">
                {question}
              </summary>
              <p className="mt-5 text-base leading-8 text-[var(--color-text)]">{answer}</p>
            </motion.details>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <motion.section
      id="pesan"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      variants={staggerContainer}
      className="relative overflow-hidden bg-[var(--color-primary)] px-5 py-20 text-white sm:px-8 lg:px-10"
    >
      <div className="nusantara-pattern absolute inset-0 opacity-10" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-10 lg:flex-row lg:items-center">
        <div className="max-w-3xl">
          <motion.p
            variants={fadeUp}
            className="text-base font-black uppercase tracking-[0.16em] text-[var(--color-accent-soft)]"
          >
            Konsultasi Gratis
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-3 text-3xl font-black leading-tight tracking-normal sm:text-4xl"
          >
            Masih bingung pilih konsep? Chat admin dan minta rekomendasi desain Nusantara yang paling pas.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-white/82"
          >
            Konsultasi desain, paket, dan estimasi pengerjaan bisa langsung
            lewat WhatsApp sebelum pesan.
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-base font-bold text-white/86"
          >
            {trustItems.map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                {item}
              </span>
            ))}
          </motion.div>
        </div>
        <motion.a
          variants={fadeUp}
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 360, damping: 20 }}
          className="rounded-lg bg-[var(--color-wa)] px-6 py-3.5 text-base font-black text-white shadow-xl shadow-[var(--color-wa)]/25 transition-colors hover:bg-[var(--color-wa-hover)]"
        >
          Chat Admin Sekarang
        </motion.a>
      </div>
    </motion.section>
  );
}

function FloatingWhatsapp() {
  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.97 }}
      className="fixed bottom-5 right-5 z-50 rounded-lg bg-[var(--color-wa)] px-4 py-3 text-sm font-black text-white shadow-2xl shadow-[var(--color-wa)]/25 transition-colors hover:bg-[var(--color-wa-hover)]"
    >
      Chat Admin
    </motion.a>
  );
}

export default function DigitalInvitationLanding() {
  return (
    <main
      className="min-h-screen bg-[var(--color-bg)] font-sans text-[var(--color-primary)]"
      style={{
        "--color-primary": "#12213f",
        "--color-primary-dark": "#081224",
        "--color-primary-hover": "#1c3159",
        "--color-accent": "#c9a24d",
        "--color-accent-soft": "#dfbd67",
        "--color-accent-pale": "#e4d2a3",
        "--color-bg": "#f8fafc",
        "--color-surface": "#ffffff",
        "--color-muted": "#eef2f7",
        "--color-muted-strong": "#e4e8ef",
        "--color-section-soft": "#f3efe7",
        "--color-text": "#475569",
        "--color-heading": "#0b1730",
      }}
    >
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <CatalogSection />
      <PricingSection />
      <StepsSection />
      <FAQSection />
      <FinalCTA />
      <FloatingWhatsapp />
    </main>
  );
}
