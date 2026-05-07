import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const whatsappUrl =
  "https://wa.me/6285817171713?text=Halo%20admin,%20saya%20mau%20lihat%20katalog%20undangan%20digital";

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

const heroSlides = [
  {
    title: "Modern Jawa",
    desc: "Ivory, terracotta, dan aksen emas untuk acara yang hangat.",
    image: "/assets/nusantara-jawa.svg",
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
    title: "Adat Chic",
    desc: "Sentuhan adat yang tetap bersih dan modern.",
    image: "/assets/nusantara-adat.svg",
  },
];

const catalogItems = [
  {
    title: "Sekar Arum",
    category: "Modern Jawa",
    badge: "Best Seller",
    price: "Rp 90.000",
    oldPrice: "Rp 159.000",
    image: "/assets/nusantara-jawa.svg",
  },
  {
    title: "Rana Kirana",
    category: "Songket Luxe",
    badge: "Premium",
    price: "Rp 129.000",
    oldPrice: "Rp 199.000",
    image: "/assets/nusantara-songket.svg",
  },
  {
    title: "Sadajiwa",
    category: "Modern Muslim",
    badge: "Favorit",
    price: "Rp 99.000",
    oldPrice: "Rp 169.000",
    image: "/assets/nusantara-muslim.svg",
  },
  {
    title: "Melati Senja",
    category: "Botanical",
    badge: "New",
    price: "Rp 109.000",
    oldPrice: "Rp 179.000",
    image: "/assets/nusantara-botanical.svg",
  },
  {
    title: "Nawasena",
    category: "Adat Chic",
    badge: "Custom",
    price: "Rp 149.000",
    oldPrice: "Rp 229.000",
    image: "/assets/nusantara-adat.svg",
  },
  {
    title: "Larasati",
    category: "Premium Motion",
    badge: "Motion",
    price: "Rp 189.000",
    oldPrice: "Rp 299.000",
    image: "/assets/nusantara-premium.svg",
  },
];

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
        className="text-base font-black uppercase tracking-[0.16em] text-[#9b6a13]"
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        variants={fadeUp}
        className="mt-3 text-4xl font-black leading-tight tracking-normal text-[#2f2a28] sm:text-5xl"
      >
        {title}
      </motion.h2>
      {desc ? (
        <motion.p
          variants={fadeUp}
          className="mt-5 text-xl leading-9 text-[#4f4a42]"
        >
          {desc}
        </motion.p>
      ) : null}
    </motion.div>
  );
}

function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[#d7c7a5]/45 bg-[#fffaf0]/82 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-10">
        <a href="#home" className="text-2xl font-black tracking-normal text-[#2f2a28]">
          NusaInvite
        </a>
        <div className="hidden items-center gap-9 text-lg font-black text-[#4f4a42] md:flex">
          <a className="transition-colors hover:text-[#b96b4a]" href="#fitur">
            Fitur
          </a>
          <a className="transition-colors hover:text-[#b96b4a]" href="#katalog">
            Katalog
          </a>
          <a className="transition-colors hover:text-[#b96b4a]" href="#harga">
            Harga
          </a>
          <a className="transition-colors hover:text-[#b96b4a]" href="#faq">
            FAQ
          </a>
        </div>
        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-2xl bg-[#2f2a28] px-6 py-3.5 text-lg font-black text-white shadow-lg shadow-[#2f2a28]/15 transition-colors hover:bg-[#171311]"
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
        <div className="absolute -left-6 top-8 z-20 rounded-2xl bg-[#fffaf0]/94 px-5 py-4 shadow-xl shadow-[#7b5a31]/15 backdrop-blur">
          <p className="text-sm font-black uppercase tracking-[0.12em] text-[#9b6a13]">
            Mulai dari
          </p>
          <p className="mt-1 text-3xl font-black text-[#2f2a28]">Rp 45K</p>
        </div>

        <div className="relative overflow-hidden rounded-[24px] border-[8px] border-[#2f2a28] bg-[#fffaf0] shadow-2xl shadow-[#5f4030]/25">
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
            <div className="absolute inset-0 bg-gradient-to-t from-[#2f2a28]/82 via-[#2f2a28]/8 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 z-10 p-7 text-white">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.38, ease: "easeOut" }}
                >
                  <p className="text-base font-black uppercase tracking-[0.12em] text-[#f6d98f]">
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

        <div className="absolute -right-4 bottom-14 z-20 rounded-2xl bg-[#7d8f69] px-5 py-4 text-white shadow-xl shadow-[#7d8f69]/25">
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
                  ? "w-8 bg-[#b96b4a]"
                  : "w-2.5 bg-[#d7c7a5] hover:bg-[#b98724]"
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
      className="relative isolate overflow-hidden bg-[#fff8f1] pt-20"
    >
      <img
        src="/assets/nusantara-hero-bg.svg"
        alt="Background ornamen undangan digital Modern Nusantara Premium"
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#fff8f1]/95 via-[#fff4e7]/82 to-[#7d8f69]/14" />
      <div className="nusantara-pattern absolute inset-0 -z-10 opacity-18" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-36 bg-gradient-to-t from-[#fff8f1] to-transparent" />

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
                className="rounded-full border border-[#b98724]/35 bg-[#fffaf0]/86 px-4 py-2 text-base font-black text-[#754b12] shadow-sm backdrop-blur"
              >
                {item}
              </span>
            ))}
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="mt-6 text-5xl font-black leading-tight tracking-normal text-[#241f1d] sm:text-6xl lg:text-7xl"
          >
            Undangan digital elegan dengan sentuhan Nusantara modern.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-2xl text-xl leading-9 text-[#4f4a42] sm:text-2xl"
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
              className="rounded-2xl bg-[#b96b4a] px-8 py-4 text-lg font-black text-white shadow-xl shadow-[#b96b4a]/25 transition-colors hover:bg-[#9e583d]"
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
              className="rounded-2xl border border-[#b98724]/45 bg-[#fffaf0]/90 px-8 py-4 text-lg font-black text-[#7a5216] shadow-lg shadow-[#7b5a31]/10 backdrop-blur transition-colors hover:bg-white"
            >
              Pesan Sekarang
            </motion.a>
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
      className="bg-[#fff8f1] px-6 pb-16 sm:px-8 lg:px-10"
    >
      <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <motion.div
            key={item.label}
            variants={fadeUp}
            className="rounded-[8px] border border-[#d7c7a5] bg-[#fffdf8] px-6 py-6 text-center shadow-lg shadow-[#9a7b5f]/8"
          >
            <p className="text-4xl font-black text-[#b96b4a]">{item.value}</p>
            <p className="mt-2 text-base font-bold text-[#4f4a42]">
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
    <section id="fitur" className="relative overflow-hidden bg-[#fffdf8] px-6 py-20 sm:px-8 lg:px-10">
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
              className="rounded-[8px] border border-[#d7c7a5] bg-[#fff8f1] p-6 shadow-sm transition-shadow hover:shadow-xl hover:shadow-[#b96b4a]/12"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#dfe6d5] text-base font-black text-[#52613f]">
                {title.slice(0, 2).toUpperCase()}
              </div>
              <h3 className="mt-5 text-xl font-black text-[#2f2a28]">
                {title}
              </h3>
              <p className="mt-3 text-base leading-7 text-[#4f4a42]">{desc}</p>
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
      className="group overflow-hidden rounded-[8px] bg-[#fffdf8] shadow-xl shadow-[#9a7b5f]/12 ring-1 ring-[#cdbb95] transition-shadow hover:shadow-2xl hover:shadow-[#b96b4a]/20"
    >
      <div className="relative aspect-[5/4] overflow-hidden bg-[#fff8f1]">
        <img
          src={item.image}
          alt={`Preview template undangan ${item.title}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2f2a28]/68 via-transparent to-transparent opacity-80" />
        <span className="absolute left-4 top-4 rounded-full bg-[#fffaf0]/94 px-3 py-1.5 text-sm font-black text-[#7a5216] shadow-sm backdrop-blur">
          {item.category}
        </span>
        <span className="absolute right-4 top-4 rounded-full bg-[#b96b4a] px-3 py-1.5 text-sm font-black text-white shadow-sm">
          {item.badge}
        </span>
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-black text-[#2f2a28]">{item.title}</h3>
        <div className="mt-2 flex items-end gap-3">
          <p className="text-3xl font-black text-[#b96b4a]">{item.price}</p>
          <p className="pb-1 text-base font-bold text-[#776c62] line-through">
            {item.oldPrice}
          </p>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <motion.a
            href="#katalog"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-xl border border-[#d7c7a5] bg-white px-4 py-3.5 text-center text-lg font-black text-[#4f4a42] transition-colors hover:bg-[#fff8f1]"
          >
            Preview
          </motion.a>
          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-xl bg-[#2f2a28] px-4 py-3.5 text-center text-lg font-black text-white transition-colors hover:bg-[#171311]"
          >
            Pesan
          </motion.a>
        </div>
      </div>
    </motion.article>
  );
}

function CatalogSection() {
  return (
    <section id="katalog" className="relative overflow-hidden bg-[#fff8f1] px-6 py-24 sm:px-8 lg:px-10">
      <div className="nusantara-pattern absolute inset-0 opacity-14" />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Katalog"
          title="Pilih desain dengan rasa lokal yang tetap modern."
          desc="Ada gaya modern Jawa, songket luxe, botanical tropis, sampai adat chic. Harga promo sudah termasuk bantuan setup dari admin."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer}
          className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {catalogItems.map((item) => (
            <CatalogCard key={item.title} item={item} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="harga" className="bg-[#fffdf8] px-6 py-24 sm:px-8 lg:px-10">
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
              className={`relative rounded-[8px] border p-8 shadow-xl transition-shadow ${
                plan.featured
                  ? "border-[#b98724] bg-[#2f2a28] text-white shadow-[#b98724]/20 lg:-mt-6 lg:mb-6"
                  : "border-[#cdbb95] bg-[#fffaf0] text-[#2f2a28] shadow-[#9a7b5f]/12"
              }`}
            >
              {plan.featured ? (
                <span className="absolute right-5 top-5 rounded-full bg-[#b96b4a] px-3 py-1.5 text-sm font-black text-white">
                  Best Seller
                </span>
              ) : null}
              <h3 className="text-3xl font-black">{plan.name}</h3>
              <p
                className={`mt-3 text-base leading-7 ${
                  plan.featured ? "text-white/90" : "text-[#4f4a42]"
                }`}
              >
                {plan.desc}
              </p>
              <p className="mt-7 text-5xl font-black">{plan.price}</p>
              <ul className="mt-7 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className={`text-base font-bold ${
                      plan.featured ? "text-white/92" : "text-[#4f4a42]"
                    }`}
                  >
                    <span className="mr-2 text-[#b98724]">OK</span>
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
                className={`mt-8 block rounded-2xl px-5 py-4 text-center text-lg font-black transition-colors ${
                  plan.featured
                    ? "bg-[#b96b4a] text-white hover:bg-[#9e583d]"
                    : "bg-[#2f2a28] text-white hover:bg-[#171311]"
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
    <section className="bg-[#e7eddd] px-6 py-24 sm:px-8 lg:px-10">
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
              className="rounded-[8px] border border-[#cdbb95] bg-[#fffdf8] p-7 shadow-lg shadow-[#9a7b5f]/10"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2f2a28] text-base font-black text-white">
                {index + 1}
              </div>
              <h3 className="mt-5 text-2xl font-black text-[#2f2a28]">
                {title}
              </h3>
              <p className="mt-3 text-base leading-7 text-[#4f4a42]">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section id="faq" className="bg-[#fff8f1] px-6 py-24 sm:px-8 lg:px-10">
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
              className="group rounded-[8px] border border-[#cdbb95] bg-[#fffdf8] p-8 shadow-md shadow-[#9a7b5f]/8 transition-shadow hover:shadow-xl hover:shadow-[#9a7b5f]/12"
            >
              <summary className="cursor-pointer list-none text-2xl font-black leading-snug text-[#2f2a28] outline-none focus-visible:ring-2 focus-visible:ring-[#b98724]">
                {question}
              </summary>
              <p className="mt-5 text-lg leading-8 text-[#4f4a42]">{answer}</p>
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
      className="relative overflow-hidden bg-[#2f2a28] px-6 py-24 text-white sm:px-8 lg:px-10"
    >
      <div className="nusantara-pattern absolute inset-0 opacity-10" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-10 lg:flex-row lg:items-center">
        <div className="max-w-3xl">
          <motion.p
            variants={fadeUp}
            className="text-base font-black uppercase tracking-[0.16em] text-[#f1d49c]"
          >
            Konsultasi Gratis
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-3 text-5xl font-black leading-tight tracking-normal sm:text-6xl"
          >
            Masih bingung pilih konsep? Chat admin dan minta rekomendasi desain Nusantara yang paling pas.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-2xl text-xl font-semibold leading-9 text-white/82"
          >
            Konsultasi desain, paket, dan estimasi pengerjaan bisa langsung
            lewat WhatsApp sebelum pesan.
          </motion.p>
        </div>
        <motion.a
          variants={fadeUp}
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 360, damping: 20 }}
          className="rounded-2xl bg-[#b96b4a] px-10 py-5 text-xl font-black text-white shadow-xl shadow-[#b96b4a]/20 transition-colors hover:bg-[#9e583d]"
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
      className="fixed bottom-5 right-5 z-50 rounded-2xl bg-[#1f8f4d] px-5 py-4 text-base font-black text-white shadow-2xl shadow-[#1f8f4d]/25 transition-colors hover:bg-[#16713c]"
    >
      Chat Admin
    </motion.a>
  );
}

export default function DigitalInvitationLanding() {
  return (
    <main className="min-h-screen bg-[#fff8f1] font-sans text-[#2f2a28]">
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
