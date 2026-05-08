"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { mergeTemplateOverrides } from "../data/templateAdminDefaults";

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
  ["Nama Tamu", "Link undangan bisa dibuat personal untuk setiap tamu."],
  ["RSVP", "Pantau konfirmasi hadir agar acara lebih mudah disiapkan."],
  ["Akad & Resepsi", "Detail acara bisa dipisah rapi untuk setiap rangkaian."],
  ["Amplop", "Terima wedding gift digital dengan data rekening."],
  ["Gallery", "Tampilkan foto dan video prewedding terbaik kalian."],
  ["Doa & Quotes", "Tambahkan kutipan atau doa yang sesuai dengan konsep acara."],
  ["Love Story", "Ceritakan perjalanan cinta dari awal sampai hari bahagia."],
  ["QR Check In", "Cocok untuk penerimaan tamu yang lebih rapi."],
];

const trustItems = ["Gratis konsultasi", "Revisi dibantu", "Selesai 1 hari"];

const heroSlides = [
  {
    title: "Modern Jawa",
    desc: "Batik, melati, dan aksen gold untuk nuansa adat Jawa premium.",
    image: "/assets/template-adat-jawa-premium.png",
  },
  {
    title: "Songket Luxe",
    desc: "Nuansa kain tradisional dengan tampilan premium.",
    image: "/assets/nusantara-songket.svg",
  },
  {
    title: "Bali Botanical",
    desc: "Hijau tropis, bunga lokal, dan kesan intimate.",
    image: "/assets/nusantara-botanical.svg",
  },
  {
    title: "Adat Jawa",
    desc: "Frame wayang modern dengan detail floral yang elegan.",
    image: "/assets/template-adat-jawa-premium.png",
  },
];

const catalogItems = [
  {
    title: "Sekar Arum",
    category: "Modern",
    style: "Modern Jawa",
    badge: "Best Seller",
    price: "Rp 90.000",
    oldPrice: "Rp 159.000",
    image: "/assets/nusantara-jawa.svg",
  },
  {
    title: "Rana Kirana",
    category: "Adat",
    style: "Songket Luxe",
    badge: "Premium",
    price: "Rp 129.000",
    oldPrice: "Rp 199.000",
    image: "/assets/nusantara-songket.svg",
  },
  {
    title: "Sadajiwa",
    category: "Muslim",
    style: "Modern Muslim",
    badge: "Favorit",
    price: "Rp 99.000",
    oldPrice: "Rp 169.000",
    image: "/assets/nusantara-muslim.svg",
  },
  {
    title: "Melati Senja",
    category: "Modern",
    style: "Botanical",
    badge: "New",
    price: "Rp 109.000",
    oldPrice: "Rp 179.000",
    image: "/assets/nusantara-botanical.svg",
  },
  {
    title: "Nawasena",
    category: "Adat",
    style: "Adat Jawa",
    badge: "Custom",
    price: "Rp 149.000",
    oldPrice: "Rp 229.000",
    image: "/assets/template-adat-jawa-premium.png",
  },
  {
    title: "Larasati",
    category: "Non Foto",
    style: "Premium Motion",
    badge: "Motion",
    price: "Rp 189.000",
    oldPrice: "Rp 299.000",
    image: "/assets/nusantara-premium.svg",
  },
  {
    title: "Arunika",
    category: "Modern",
    style: "Clean Elegant",
    badge: "New",
    price: "Rp 99.000",
    oldPrice: "Rp 169.000",
    image: "/assets/nusantara-premium.svg",
  },
  {
    title: "Kirana Ayu",
    category: "Modern",
    style: "Royal Navy",
    badge: "Favorit",
    price: "Rp 119.000",
    oldPrice: "Rp 189.000",
    image: "/assets/nusantara-botanical.svg",
  },
  {
    title: "Cakrawala",
    category: "Modern",
    style: "Minimal Premium",
    badge: "Simple",
    price: "Rp 89.000",
    oldPrice: "Rp 149.000",
    image: "/assets/nusantara-jawa.svg",
  },
  {
    title: "Puspawarna",
    category: "Modern",
    style: "Floral Modern",
    badge: "Soft",
    price: "Rp 109.000",
    oldPrice: "Rp 179.000",
    image: "/assets/nusantara-botanical.svg",
  },
  {
    title: "Srikandi",
    category: "Adat",
    style: "Jawa Klasik",
    badge: "Adat",
    price: "Rp 139.000",
    oldPrice: "Rp 219.000",
    image: "/assets/nusantara-jawa.svg",
  },
  {
    title: "Rangkiang",
    category: "Adat",
    style: "Minang Luxe",
    badge: "Gold",
    price: "Rp 159.000",
    oldPrice: "Rp 249.000",
    image: "/assets/nusantara-songket.svg",
  },
  {
    title: "Puri Dewata",
    category: "Adat",
    style: "Bali Elegant",
    badge: "Premium",
    price: "Rp 149.000",
    oldPrice: "Rp 229.000",
    image: "/assets/nusantara-botanical.svg",
  },
  {
    title: "Parahyangan",
    category: "Adat",
    style: "Sunda Chic",
    badge: "Custom",
    price: "Rp 129.000",
    oldPrice: "Rp 199.000",
    image: "/assets/nusantara-adat.svg",
  },
  {
    title: "Sakinah",
    category: "Muslim",
    style: "Soft Islamic",
    badge: "Favorit",
    price: "Rp 99.000",
    oldPrice: "Rp 169.000",
    image: "/assets/nusantara-muslim.svg",
  },
  {
    title: "Azzahra",
    category: "Muslim",
    style: "Mosque Arch",
    badge: "New",
    price: "Rp 109.000",
    oldPrice: "Rp 179.000",
    image: "/assets/nusantara-muslim.svg",
  },
  {
    title: "Qalbun",
    category: "Muslim",
    style: "Minimal Akad",
    badge: "Simple",
    price: "Rp 89.000",
    oldPrice: "Rp 149.000",
    image: "/assets/nusantara-premium.svg",
  },
  {
    title: "Mawaddah",
    category: "Muslim",
    style: "Elegant Gold",
    badge: "Premium",
    price: "Rp 129.000",
    oldPrice: "Rp 199.000",
    image: "/assets/nusantara-songket.svg",
  },
  {
    title: "Kidung",
    category: "Non Foto",
    style: "Typography",
    badge: "No Photo",
    price: "Rp 79.000",
    oldPrice: "Rp 129.000",
    image: "/assets/nusantara-premium.svg",
  },
  {
    title: "Aksara",
    category: "Non Foto",
    style: "Letterpress",
    badge: "Clean",
    price: "Rp 89.000",
    oldPrice: "Rp 149.000",
    image: "/assets/nusantara-songket.svg",
  },
  {
    title: "Ruang Rasa",
    category: "Non Foto",
    style: "Minimal Text",
    badge: "Simple",
    price: "Rp 79.000",
    oldPrice: "Rp 129.000",
    image: "/assets/nusantara-muslim.svg",
  },
  {
    title: "Temaram",
    category: "Non Foto",
    style: "Classic Card",
    badge: "Elegant",
    price: "Rp 99.000",
    oldPrice: "Rp 169.000",
    image: "/assets/nusantara-adat.svg",
  },
];

const catalogTabs = ["Modern", "Adat", "Non Foto", "Muslim"];

const plans = [
  {
    name: "Basic",
    price: "Rp 45.000",
    desc: "Untuk undangan simpel yang tetap rapi dan siap dibagikan.",
    features: ["Detail acara", "Profil mempelai", "Google Maps", "Gallery foto", "Masa aktif 3 bulan"],
  },
  {
    name: "Premium",
    price: "Rp 90.000",
    desc: "Paket paling pas untuk undangan lengkap dan interaktif.",
    featured: true,
    features: [
      "Semua fitur Basic",
      "Custom nama tamu",
      "RSVP kehadiran",
      "Amplop digital",
      "Love story",
      "Backsound music",
    ],
  },
  {
    name: "Exclusive",
    price: "Rp 149.000",
    desc: "Untuk tampilan lebih personal dengan layanan prioritas.",
    features: [
      "Semua fitur Premium",
      "QR check in",
      "Video gallery",
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

function SectionHeader({ eyebrow, title, desc }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      variants={staggerContainer}
        className="mx-auto max-w-4xl text-center"
    >
      <motion.p
        variants={fadeUp}
        className="text-base font-black uppercase tracking-[0.16em] text-[var(--color-accent)]"
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        variants={fadeUp}
        className="mt-3 text-4xl font-black leading-tight tracking-normal text-[var(--color-primary)] sm:text-5xl"
      >
        {title}
      </motion.h2>
      {desc ? (
        <motion.p
          variants={fadeUp}
          className="mt-5 text-lg leading-8 text-[var(--color-text)]"
        >
          {desc}
        </motion.p>
      ) : null}
    </motion.div>
  );
}

function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[var(--color-accent-pale)]/45 bg-[var(--color-muted)]/82 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-10">
        <a href="#home" className="text-2xl font-black tracking-normal text-[var(--color-primary)]">
          NusaInvite
        </a>
        <div className="hidden items-center gap-9 text-lg font-black text-[var(--color-text)] md:flex">
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
          className="rounded-2xl bg-[var(--color-wa)] px-6 py-3.5 text-lg font-black text-white shadow-lg shadow-[var(--color-wa)]/20 transition-colors hover:bg-[var(--color-wa-hover)]"
        >
          Chat Admin
        </motion.a>
      </nav>
    </header>
  );
}

function HeroCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const currentSlide = heroSlides[activeSlide];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 3800);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.75, ease: "easeOut", delay: 0.25 }}
      className="hidden justify-end lg:flex"
    >
      <div className="relative w-full max-w-md">
        <div className="absolute -left-3 top-8 z-20 rounded-2xl border border-[var(--color-accent-soft)]/70 bg-[var(--color-accent)] px-5 py-4 text-[var(--color-primary)] shadow-2xl shadow-[var(--color-primary)]/25">
          <p className="text-base font-black uppercase tracking-[0.1em] text-[var(--color-primary-hover)]">
            Mulai dari
          </p>
          <p className="mt-1 text-4xl font-black leading-none text-[var(--color-primary)]">
            Rp 45K
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[24px] border-[8px] border-[var(--color-primary)] bg-[var(--color-muted)] shadow-2xl shadow-[var(--color-primary)]/25">
          <div className="songket-line absolute inset-x-0 top-0 z-20 h-3 opacity-70" />
          <div className="relative h-[600px] w-full">
            <AnimatePresence mode="wait">
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
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/82 via-[var(--color-primary)]/8 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 z-10 p-7 text-white">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.38, ease: "easeOut" }}
                >
                  <p className="text-base font-black uppercase tracking-[0.12em] text-[var(--color-accent-soft)]">
                    Tema Undangan
                  </p>
                  <h3 className="mt-2 text-4xl font-black">
                    {currentSlide.title}
                  </h3>
                  <p className="mt-2 text-base font-semibold leading-7 text-white/92">
                    {currentSlide.desc}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="absolute -right-4 bottom-14 z-20 rounded-2xl bg-[var(--color-accent)] px-5 py-4 text-white shadow-xl shadow-[var(--color-accent)]/25">
          <p className="text-base font-black">Akad + RSVP</p>
          <p className="text-sm font-semibold text-white/90">
            Siap dibagikan
          </p>
        </div>

        <div className="mt-5 flex justify-center gap-2">
          {heroSlides.map((slide, index) => (
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
      className="relative isolate overflow-hidden bg-[var(--color-bg)] pt-20"
    >
      <img
        src="/assets/nusantara-hero-bg.svg"
        alt="Background ornamen undangan digital Modern Nusantara Premium"
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[var(--color-bg)]/95 via-[var(--color-muted-strong)]/82 to-[var(--color-accent)]/14" />
      <div className="nusantara-pattern absolute inset-0 -z-10 opacity-18" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-36 bg-gradient-to-t from-[var(--color-bg)] to-transparent" />

      <div className="mx-auto grid min-h-[88vh] max-w-7xl items-center gap-14 px-6 py-16 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-2xl"
        >
          <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
            {["Diskon 50%", "Nuansa Nusantara", "Selesai 1 hari"].map((item) => (
              <span
                key={item}
                className="rounded-full border border-[var(--color-accent)]/35 bg-[var(--color-muted)]/86 px-4 py-2 text-base font-black text-[var(--color-primary-hover)] shadow-sm backdrop-blur"
              >
                {item}
              </span>
            ))}
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="mt-6 text-4xl font-black leading-tight tracking-normal text-[var(--color-heading)] sm:text-5xl lg:text-6xl"
          >
            Undangan digital elegan dengan sentuhan Nusantara modern.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-2xl text-lg leading-8 text-[var(--color-text)] sm:text-xl"
          >
            Sebar kabar bahagia dengan desain yang hangat, rapi, dan terasa
            Indonesia. Lengkap dengan RSVP, amplop digital, akad-resepsi, maps,
            gallery, dan custom nama tamu.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap gap-4">
            <motion.a
              href="#katalog"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 360, damping: 20 }}
              className="rounded-2xl bg-[var(--color-primary)] px-7 py-4 text-base font-black text-white shadow-xl shadow-[var(--color-primary)]/25 transition-colors hover:bg-[var(--color-primary-hover)]"
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
              className="rounded-2xl bg-[var(--color-accent)] px-7 py-4 text-base font-black text-[var(--color-primary)] shadow-xl shadow-[var(--color-accent)]/20 transition-colors hover:bg-[var(--color-accent-soft)]"
            >
              Pesan Sekarang
            </motion.a>
          </motion.div>
          <motion.div
            variants={fadeUp}
            className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-base font-bold text-[var(--color-text)]"
          >
            {trustItems.map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                {item}
              </span>
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
    <section id="fitur" className="relative overflow-hidden bg-[var(--color-surface)] px-6 py-20 sm:px-8 lg:px-10">
      <div className="songket-line absolute inset-x-0 top-0 h-3 opacity-80" />
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
          {features.map(([title, desc]) => (
            <motion.div
              key={title}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-6 shadow-sm transition-shadow hover:shadow-xl hover:shadow-[var(--color-primary)]/12"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-muted-strong)] text-base font-black text-[var(--color-primary)]">
                {title.slice(0, 2).toUpperCase()}
              </div>
              <h3 className="mt-5 text-xl font-black text-[var(--color-primary)]">
                {title}
              </h3>
              <p className="mt-3 text-base leading-7 text-[var(--color-text)]">{desc}</p>
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
      whileHover={{ y: -8, scale: 1.025 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="group overflow-hidden rounded-[8px] bg-[var(--color-surface)] shadow-lg shadow-[var(--color-primary)]/10 ring-1 ring-[var(--color-accent-pale)] transition-shadow hover:shadow-2xl hover:shadow-[var(--color-primary)]/18"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-bg)]">
        <img
          src={item.image}
          alt={`Preview template undangan ${item.title}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/68 via-transparent to-transparent opacity-80" />
        <span className="absolute left-4 top-4 rounded-full bg-[var(--color-muted)]/94 px-3 py-1.5 text-sm font-black text-[var(--color-primary-hover)] shadow-sm backdrop-blur">
          {item.style}
        </span>
        <span className="absolute right-4 top-4 rounded-full bg-[var(--color-primary)] px-3 py-1.5 text-sm font-black text-white shadow-sm">
          {item.badge}
        </span>
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
            className="rounded-xl border border-[var(--color-accent-pale)] bg-[var(--color-surface)] px-4 py-2.5 text-center text-sm font-black text-[var(--color-text)] transition-colors hover:bg-white"
          >
            Preview
          </motion.a>
          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-xl bg-[var(--color-accent)] px-4 py-2.5 text-center text-sm font-black text-[var(--color-primary)] transition-colors hover:bg-[var(--color-accent-soft)]"
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
  const [activeCatalog, setActiveCatalog] = useState(activeCatalogTabs[0]);
  const filteredItems = landingCatalogItems.filter(
    (item) => item.category === activeCatalog,
  );

  useEffect(() => {
    let isMounted = true;

    fetch("/api/templates")
      .then((response) => response.json())
      .then((result) => {
        if (!isMounted || !Array.isArray(result.data) || result.data.length === 0) {
          return;
        }

        const mappedItems = mergeTemplateOverrides(result.data)
          .map((template) => ({
            title: template.name,
            category: template.category,
            style: template.category,
            badge: template.badge || "Ready",
            price: template.price || "Rp 99.000",
            oldPrice: "",
            image: template.image || "/assets/nusantara-premium.svg",
            previewUrl: template.previewUrl || "/preview",
          }));

        setLandingCatalogItems(mappedItems);

        if (!mappedItems.some((item) => item.category === activeCatalog)) {
          setActiveCatalog(mappedItems[0]?.category || catalogTabs[0]);
        }
      })
      .catch(() => {
        setLandingCatalogItems(catalogItems);
      });

    return () => {
      isMounted = false;
    };
  }, [activeCatalog]);

  return (
    <section id="katalog" className="relative overflow-hidden bg-[var(--color-bg)] px-6 py-24 sm:px-8 lg:px-10">
      <div className="nusantara-pattern absolute inset-0 opacity-14" />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Katalog"
          title="Pilih desain dengan rasa lokal yang tetap modern."
          desc="Filter berdasarkan gaya favorit: Modern, Adat, Non Foto, atau Muslim. Harga promo sudah termasuk bantuan setup dari admin."
        />

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
                className={`rounded-2xl border px-5 py-3 text-base font-black transition-colors ${
                  isActive
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/16"
                    : "border-[var(--color-accent-pale)] bg-[var(--color-surface)] text-[var(--color-primary-hover)] hover:border-[var(--color-accent)] hover:bg-white"
                }`}
              >
                {tab}
                <span
                  className={`ml-2 rounded-full px-2 py-0.5 text-sm ${
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

        <motion.div
          key={activeCatalog}
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredItems.map((item) => (
            <CatalogCard key={item.title} item={item} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="harga" className="bg-[var(--color-surface)] px-6 py-24 sm:px-8 lg:px-10">
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
                <span className="absolute right-5 top-5 rounded-full bg-[var(--color-accent)] px-3 py-1.5 text-sm font-black text-[var(--color-primary)]">
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
              <p className="mt-7 text-4xl font-black">{plan.price}</p>
              <ul className="mt-7 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className={`text-base font-bold ${
                      plan.featured ? "text-white/92" : "text-[var(--color-text)]"
                    }`}
                  >
                    <span className="mr-2 text-[var(--color-accent)]">OK</span>
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
                className={`mt-8 block rounded-2xl px-5 py-4 text-center text-base font-black transition-colors ${
                  plan.featured
                    ? "bg-[var(--color-accent)] text-[var(--color-primary)] hover:bg-[var(--color-accent-soft)]"
                    : "bg-[var(--color-accent)] text-[var(--color-primary)] hover:bg-[var(--color-accent-soft)]"
                }`}
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
    <section className="bg-[var(--color-section-soft)] px-6 py-24 sm:px-8 lg:px-10">
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
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-base font-black text-white">
                {index + 1}
              </div>
              <h3 className="mt-5 text-2xl font-black text-[var(--color-primary)]">
                {title}
              </h3>
              <p className="mt-3 text-base leading-7 text-[var(--color-text)]">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section id="faq" className="bg-[var(--color-bg)] px-6 py-24 sm:px-8 lg:px-10">
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
              className="group rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] p-8 shadow-md shadow-[var(--color-primary)]/8 transition-shadow hover:shadow-xl hover:shadow-[var(--color-primary)]/12"
            >
              <summary className="cursor-pointer list-none text-xl font-black leading-snug text-[var(--color-primary)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]">
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
      className="relative overflow-hidden bg-[var(--color-primary)] px-6 py-20 text-white sm:px-8 lg:px-10"
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
            className="mt-3 text-4xl font-black leading-tight tracking-normal sm:text-5xl"
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
          className="rounded-2xl bg-[var(--color-wa)] px-8 py-4 text-lg font-black text-white shadow-xl shadow-[var(--color-wa)]/25 transition-colors hover:bg-[var(--color-wa-hover)]"
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
      className="fixed bottom-5 right-5 z-50 rounded-2xl bg-[var(--color-wa)] px-5 py-4 text-base font-black text-white shadow-2xl shadow-[var(--color-wa)]/25 transition-colors hover:bg-[var(--color-wa-hover)]"
    >
      Chat Admin
    </motion.a>
  );
}

export default function DigitalInvitationLanding() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] font-sans text-[var(--color-primary)]">
      <Navbar />
      <HeroSection />
      <StatsSection />
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


