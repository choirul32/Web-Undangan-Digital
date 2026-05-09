"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { createInvitationFromDashboardForm } from "../data/sampleInvitation";
import { getStoredInvitationDraft, sampleInvitation } from "../data/sampleInvitation";
import {
  addStoredDeletedTemplateId,
  defaultTemplateMetadata,
  getStoredDeletedTemplateIds,
  getStoredTemplateOverrides,
  mergeTemplateOverrides,
  upsertStoredTemplateOverride,
} from "../data/templateAdminDefaults";
import InvitationRenderer from "../templates/InvitationRenderer";
import OrnamentLayer from "../templates/components/OrnamentLayer";
import {
  getCoupleSectionConfig,
  getCoverSectionConfig,
  getOpeningRevealConfig,
  getSectionOrnaments,
  getSectionStyleConfig,
  normalizeDesignConfig,
} from "../templates/designConfigs";

const invitations = [
  {
    id: "INV-001",
    couple: "Dimas & Salsa",
    slug: "dimas-salsa",
    template: "Rana Kirana",
    category: "Adat",
    status: "Published",
    date: "12 Jun 2026",
    rsvp: 128,
    package: "Premium",
  },
  {
    id: "INV-002",
    couple: "Fahri & Nabila",
    slug: "fahri-nabila",
    template: "Sadajiwa",
    category: "Muslim",
    status: "Review",
    date: "22 Jun 2026",
    rsvp: 64,
    package: "Premium",
  },
  {
    id: "INV-003",
    couple: "Raka & Kirana",
    slug: "raka-kirana",
    template: "Nawasena",
    category: "Adat",
    status: "Draft",
    date: "03 Jul 2026",
    rsvp: 0,
    package: "Exclusive",
  },
  {
    id: "INV-004",
    couple: "Bagas & Ayu",
    slug: "bagas-ayu",
    template: "Melati Senja",
    category: "Modern",
    status: "Revision",
    date: "18 Jul 2026",
    rsvp: 42,
    package: "Basic",
  },
  {
    id: "INV-005",
    couple: "Rizky & Hana",
    slug: "rizky-hana",
    template: "Kidung",
    category: "Non Foto",
    status: "Published",
    date: "01 Agu 2026",
    rsvp: 216,
    package: "Premium",
  },
];

const templates = defaultTemplateMetadata.map((metadata, index) => {
  return {
    orders: [34, 28, 24, 19][index] || 12,
    ...metadata,
    image: metadata.image || "/assets/nusantara-premium.svg",
    previewUrl:
      metadata.previewUrl ||
      `/preview?templateId=${encodeURIComponent(metadata.id)}`,
    supportedFeatures: metadata.supportedFeatures || [],
    rendererType: metadata.rendererType || "config",
  };
});

const templateCategoryOptions = ["Basic", "Standard", "Premium", "Adat"];
const templateBadgeOptions = ["New", "Best Seller", "Premium", "Favorite", "Promo", "Limited", "Custom"];
const templateCategories = ["Semua", ...Array.from(new Set([...templateCategoryOptions, ...templates.map((template) => template.category)]))];
const ornamentSlots = [
  "fill",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
  "center-top",
  "center-bottom",
  "side-left",
  "side-right",
  "center",
];
const ornamentObjectFitOptions = ["contain", "cover", "fill"];
const ornamentAnimationOptions = ["none", "fade", "float", "sway", "pulse", "slow-rotate"];
const ornamentEntranceOptions = [
  "none",
  "fade-in",
  "fade-up",
  "zoom-in",
  "pop-up",
  "slide-left",
  "slide-right",
  "drop-in",
];
const ornamentMaxRasterFileSize = 1024 * 1024;
const countdownVariantOptions = ["cards", "minimal", "circle"];
const eventVariantOptions = ["cards", "list", "elegant"];
const storyVariantOptions = ["card", "timeline", "stacked"];
const storyAnimationOptions = ["fade-up", "zoom-in", "slide-left", "stagger"];
const galleryVariantOptions = ["grid", "carousel", "masonry"];
const coverLayoutOptions = ["centered", "split", "minimal"];
const coverOpeningAnimationOptions = ["none", "fade-up", "zoom-in", "slide-left", "pop-up"];
const openingRevealAnimationOptions = ["fade", "zoom", "slide-up", "curtain", "gate", "paper"];
const openingRevealBackgroundModeOptions = ["color", "image"];
const coverBackgroundModeOptions = ["color", "image"];
const guestBlockStyleOptions = ["card", "pill", "minimal", "hidden"];
const couplePhotoStyleOptions = ["circle", "arch", "square"];
const coupleFontPresetOptions = ["serif", "sans", "script"];
const sectionFontPresetOptions = ["default", "serif", "sans", "script"];
const sectionSpacingPresetOptions = ["compact", "normal", "roomy"];
const sectionEntranceOptions = ["none", "fade-up", "zoom-in", "slide-left", "pop-up"];
const sectionAnimationPresets = [
  {
    id: "fade-sequence",
    label: "Fade Sequence",
    entrancePreset: "fade-in",
    loopPreset: "none",
    staggerStep: 0.15,
  },
  {
    id: "float-sequence",
    label: "Float Sequence",
    entrancePreset: "fade-up",
    loopPreset: "float",
    staggerStep: 0.18,
  },
  {
    id: "pop-sequence",
    label: "Pop Sequence",
    entrancePreset: "pop-up",
    loopPreset: "pulse",
    staggerStep: 0.12,
  },
  {
    id: "side-reveal",
    label: "Side Reveal",
    entrancePreset: "slide-right",
    loopPreset: "sway",
    staggerStep: 0.2,
  },
  {
    id: "watercolor-bloom",
    label: "Watercolor Bloom",
    entrancePreset: "zoom-in",
    loopPreset: "float",
    staggerStep: 0.22,
  },
  {
    id: "wayang-entrance",
    label: "Wayang Entrance",
    entrancePreset: "slide-left",
    loopPreset: "sway",
    staggerStep: 0.18,
  },
];
const templateStylePresets = [
  {
    id: "elegant-fade",
    label: "Elegant Fade",
    description: "Serif, spacing lega, transisi halus, dan widget minimal.",
    sectionStyle: {
      fontPreset: "serif",
      spacingPreset: "roomy",
      entranceAnimation: "fade-up",
      backgroundColor: "",
      accentColor: "#d8a44d",
    },
    animation: {
      enabled: true,
      preset: "fade-sequence",
      entrancePreset: "fade-in",
      loopPreset: "none",
      staggerStep: 0.14,
    },
    widgets: {
      openingReveal: { enabled: true, animation: "curtain" },
      countdown: { variant: "minimal" },
      events: { variant: "elegant", showIcon: true, showMaps: true },
      story: { variant: "timeline", animation: "fade-up" },
      gallery: { variant: "grid", includeCover: true },
    },
    cover: {
      openingAnimation: "fade-up",
      guestBlockStyle: "minimal",
    },
  },
  {
    id: "floral-float",
    label: "Floral Float",
    description: "Nuansa floral lembut dengan ornament float.",
    sectionStyle: {
      fontPreset: "serif",
      spacingPreset: "normal",
      entranceAnimation: "zoom-in",
      backgroundImage: "/assets/backgrounds/paper-fan-blush.jpg",
      accentColor: "#d9897f",
    },
    animation: {
      enabled: true,
      preset: "float-sequence",
      entrancePreset: "fade-up",
      loopPreset: "float",
      staggerStep: 0.18,
    },
    widgets: {
      openingReveal: { enabled: true, animation: "paper" },
      countdown: { variant: "cards" },
      events: { variant: "cards", showIcon: true, showMaps: true },
      story: { variant: "card", animation: "stagger" },
      gallery: { variant: "masonry", includeCover: true },
    },
    cover: {
      openingAnimation: "zoom-in",
      guestBlockStyle: "card",
    },
  },
  {
    id: "watercolor-bloom",
    label: "Watercolor Bloom",
    description: "Background watercolor dan reveal paper.",
    sectionStyle: {
      fontPreset: "serif",
      spacingPreset: "roomy",
      entranceAnimation: "zoom-in",
      backgroundImage: "/assets/backgrounds/soft-watercolor-cream.jpg",
      accentColor: "#cfa064",
    },
    animation: {
      enabled: true,
      preset: "watercolor-bloom",
      entrancePreset: "zoom-in",
      loopPreset: "float",
      staggerStep: 0.22,
    },
    widgets: {
      openingReveal: { enabled: true, animation: "paper" },
      countdown: { variant: "circle" },
      events: { variant: "elegant", showIcon: false, showMaps: true },
      story: { variant: "stacked", animation: "fade-up" },
      gallery: { variant: "carousel", includeCover: true },
    },
    cover: {
      openingAnimation: "pop-up",
      guestBlockStyle: "pill",
    },
  },
  {
    id: "wayang-reveal",
    label: "Wayang Reveal",
    description: "Opening wayang, side reveal, dan aksen adat.",
    sectionStyle: {
      fontPreset: "serif",
      spacingPreset: "roomy",
      entranceAnimation: "slide-left",
      backgroundColor: "#fff8ee",
      accentColor: "#c08a2c",
    },
    animation: {
      enabled: true,
      preset: "wayang-entrance",
      entrancePreset: "slide-left",
      loopPreset: "sway",
      staggerStep: 0.18,
    },
    widgets: {
      openingReveal: { enabled: true, animation: "curtain" },
      countdown: { variant: "cards" },
      events: { variant: "elegant", showIcon: true, showMaps: true },
      story: { variant: "timeline", animation: "slide-left" },
      gallery: { variant: "grid", includeCover: true },
    },
    cover: {
      openingAnimation: "slide-left",
      guestBlockStyle: "card",
    },
  },
  {
    id: "royal-gate",
    label: "Royal Gate",
    description: "Opening gate, warna tegas, dan layout elegan.",
    sectionStyle: {
      fontPreset: "serif",
      spacingPreset: "roomy",
      entranceAnimation: "fade-up",
      backgroundImage: "/assets/backgrounds/black-rose-frame.jpg",
      textColor: "#f8fafc",
      accentColor: "#f5d06f",
    },
    animation: {
      enabled: true,
      preset: "pop-sequence",
      entrancePreset: "pop-up",
      loopPreset: "pulse",
      staggerStep: 0.12,
    },
    widgets: {
      openingReveal: { enabled: true, animation: "gate" },
      countdown: { variant: "circle" },
      events: { variant: "elegant", showIcon: true, showMaps: true },
      story: { variant: "card", animation: "zoom-in" },
      gallery: { variant: "carousel", includeCover: true },
    },
    cover: {
      openingAnimation: "pop-up",
      guestBlockStyle: "pill",
    },
  },
  {
    id: "cinematic-scroll",
    label: "Cinematic Scroll",
    description: "Section roomy, animasi pop, dan gallery carousel.",
    sectionStyle: {
      fontPreset: "sans",
      spacingPreset: "roomy",
      entranceAnimation: "pop-up",
      backgroundImage: "/assets/backgrounds/green-watercolor-leaf.jpg",
      accentColor: "#6f8f7a",
    },
    animation: {
      enabled: true,
      preset: "pop-sequence",
      entrancePreset: "pop-up",
      loopPreset: "float",
      staggerStep: 0.16,
    },
    widgets: {
      openingReveal: { enabled: true, animation: "curtain" },
      countdown: { variant: "minimal" },
      events: { variant: "list", showIcon: true, showMaps: true },
      story: { variant: "stacked", animation: "stagger" },
      gallery: { variant: "carousel", includeCover: true },
    },
    cover: {
      openingAnimation: "zoom-in",
      guestBlockStyle: "minimal",
    },
  },
  {
    id: "minimal-premium",
    label: "Minimal Premium",
    description: "Bersih, ringan, compact, dan fokus typography.",
    sectionStyle: {
      fontPreset: "sans",
      spacingPreset: "compact",
      entranceAnimation: "fade-up",
      backgroundColor: "#ffffff",
      accentColor: "#8a6f4d",
    },
    animation: {
      enabled: false,
      preset: "fade-sequence",
      entrancePreset: "fade-in",
      loopPreset: "none",
      staggerStep: 0.12,
    },
    widgets: {
      openingReveal: { enabled: false, animation: "fade" },
      countdown: { variant: "minimal" },
      events: { variant: "list", showIcon: false, showMaps: true },
      story: { variant: "stacked", animation: "fade-up" },
      gallery: { variant: "grid", includeCover: false },
    },
    cover: {
      openingAnimation: "fade-up",
      guestBlockStyle: "hidden",
    },
  },
];
const standardTemplateSections = [
  "home",
  "couple",
  "acara",
  "countdown",
  "story",
  "gallery",
  "gift",
  "rsvp",
  "doa-ucapan",
];
const templateSectionPresets = templates.reduce(
  (presets, template) => ({
    ...presets,
    [template.id]: standardTemplateSections,
  }),
  {},
);
const templatePreviewViewports = {
  mobile: {
    label: "Mobile 430",
    frameClass: "h-[680px] max-w-[430px]",
    viewportWidth: 430,
    viewportHeight: 680,
    scale: 1,
  },
  tablet: {
    label: "Tablet",
    frameClass: "h-[720px] max-w-[640px]",
    viewportWidth: 768,
    viewportHeight: 980,
    scale: 0.78,
  },
  desktop: {
    label: "Desktop scaled",
    frameClass: "h-[760px] max-w-full",
    viewportWidth: 1280,
    viewportHeight: 900,
    scale: 0.58,
  },
};

function mapDesignSectionToPreviewSection(section = "home") {
  if (section === "acara") {
    return "events";
  }

  if (section === "countdown") {
    return "home";
  }

  if (section === "doa-ucapan") {
    return "rsvp";
  }

  return section || "home";
}

const activities = [
  "RSVP baru dari keluarga Dimas & Salsa",
  "Fahri & Nabila mengirim revisi data acara",
  "Template Kidung dipilih untuk undangan baru",
  "Rizky & Hana mencapai 200+ RSVP",
];

const statusStyles = {
  Published: "bg-[var(--color-wa)] text-white",
  Review: "bg-[var(--color-accent)] text-[var(--color-primary)]",
  Revision: "bg-[var(--color-muted-strong)] text-[var(--color-primary)]",
  Draft: "bg-[var(--color-section-soft)] text-[var(--color-text)]",
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const formatNumber = (value) => new Intl.NumberFormat("id-ID").format(Number(value || 0));

function buildDashboardMetrics(stats) {
  return [
    {
      label: "Total Undangan",
      value: formatNumber(stats.invitations),
      detail: `${formatNumber(stats.activeThisMonth)} aktif bulan ini`,
    },
    {
      label: "RSVP Masuk",
      value: formatNumber(stats.rsvps),
      detail: `${formatNumber(stats.rsvpPax)} total pax tercatat`,
    },
    {
      label: "Published",
      value: formatNumber(stats.published),
      detail: "Siap dibagikan ke tamu",
    },
    {
      label: "Revisi",
      value: formatNumber(stats.revision),
      detail: `${formatNumber(stats.guests)} tamu tersimpan`,
    },
  ];
}

const formSteps = ["Template", "Mempelai", "Acara", "Fitur", "Review"];

const initialInvitationForm = {
  template: "Standard",
  templateId: "standard",
  package: "Premium",
  slug: "dimas-salsa",
  groomName: "Dimas Pratama",
  groomNickname: "Dimas",
  brideName: "Salsa Kirana",
  brideNickname: "Salsa",
  quote: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup.",
  eventTitle: "Akad Nikah",
  eventDate: "2026-06-12",
  eventTime: "09:00",
  venue: "Gedung Serbaguna Nusantara",
  mapsUrl: "https://maps.google.com",
  rsvp: true,
  gift: true,
  music: true,
  guestName: true,
};

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
        {label}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function TextInput(props) {
  return (
    <input
      {...props}
      className="w-full rounded-2xl border border-[var(--color-accent-pale)] bg-white px-4 py-3 text-base font-bold text-[var(--color-primary)] outline-none transition-colors placeholder:text-[var(--color-text)]/40 focus:border-[var(--color-accent)]"
    />
  );
}

function SelectInput(props) {
  return (
    <select
      {...props}
      className="w-full rounded-2xl border border-[var(--color-accent-pale)] bg-white px-4 py-3 text-base font-bold text-[var(--color-primary)] outline-none transition-colors focus:border-[var(--color-accent)]"
    />
  );
}

function ToggleField({ checked, label, desc, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`rounded-[8px] border p-4 text-left transition-colors ${
        checked
          ? "border-[var(--color-accent)] bg-[var(--color-muted)]"
          : "border-[var(--color-accent-pale)] bg-white hover:bg-[var(--color-bg)]"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-1 h-5 w-5 rounded-md border ${
            checked
              ? "border-[var(--color-primary)] bg-[var(--color-primary)]"
              : "border-[var(--color-accent-pale)] bg-white"
          }`}
        />
        <span>
          <span className="block text-base font-black text-[var(--color-primary)]">
            {label}
          </span>
          <span className="mt-1 block text-sm font-semibold leading-6 text-[var(--color-text)]">
            {desc}
          </span>
        </span>
      </div>
    </button>
  );
}

function Sidebar({ activePage = "overview" }) {
  const menu = [
    { label: "Overview", page: "overview", href: "/dashboard" },
    { label: "Undangan", page: "invitations", href: "/dashboard/invitations", count: 5 },
    { label: "Template", page: "templates", href: "/dashboard/templates" },
    { label: "RSVP", page: "rsvps", href: "/dashboard/rsvps" },
    { label: "Tamu", page: "guests", href: "/dashboard/guests" },
    { label: "Media", page: "media", href: "/dashboard/media" },
    { label: "Konten", page: "content", href: "/dashboard/content" },
    { label: "Pengaturan", page: "settings", href: "/dashboard/settings" },
  ];

  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-[var(--color-accent-pale)]/55 bg-[var(--color-primary)] px-6 py-7 text-white lg:block">
      <a href="/" className="block text-2xl font-black">
        NusaInvite
      </a>
      <p className="mt-2 text-sm font-semibold text-white/62">Admin Workspace</p>

      <nav className="mt-10 space-y-2">
        {menu.map((item) => (
          <a
            key={item.page}
            href={item.href}
            className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-base font-black transition-colors ${
              activePage === item.page
                ? "bg-[var(--color-accent)] text-[var(--color-primary)]"
                : "text-white/78 hover:bg-white/8 hover:text-white"
            }`}
          >
            {item.label}
            {item.count ? (
              <span className="rounded-full bg-white/12 px-2 py-0.5 text-xs">{item.count}</span>
            ) : null}
          </a>
        ))}
      </nav>

      <div className="mt-10 rounded-[8px] border border-white/12 bg-white/8 p-5">
        <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent-soft)]">
          Next Step
        </p>
        <p className="mt-3 text-lg font-black">Hubungkan Supabase</p>
        <p className="mt-2 text-sm leading-6 text-white/68">
          Auth, database, storage foto, RSVP, dan publikasi slug akan masuk di fase berikutnya.
        </p>
      </div>
    </aside>
  );
}

function MetricCard({ label, value, detail }) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] p-6 shadow-lg shadow-[var(--color-primary)]/8"
    >
      <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent)]">
        {label}
      </p>
      <p className="mt-3 text-4xl font-black text-[var(--color-primary)]">{value}</p>
      <p className="mt-2 text-base font-semibold text-[var(--color-text)]">{detail}</p>
    </motion.div>
  );
}

function InvitationTable() {
  const [items, setItems] = useState(invitations);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/invitations")
      .then((response) => response.json())
      .then((result) => {
        if (isMounted && Array.isArray(result.data) && result.data.length > 0) {
          setItems(result.data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setItems(invitations);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <motion.section
      variants={fadeUp}
      className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] shadow-xl shadow-[var(--color-primary)]/8"
    >
      <div className="flex flex-col gap-4 border-b border-[var(--color-accent-pale)] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-[var(--color-primary)]">Undangan Terbaru</h2>
          <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
            Kelola draft, revisi, preview, dan undangan yang sudah publish.
          </p>
        </div>
        <button className="rounded-2xl bg-[var(--color-accent)] px-5 py-3 text-base font-black text-[var(--color-primary)] transition-colors hover:bg-[var(--color-accent-soft)]">
          Buat Undangan
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left">
          <thead className="bg-[var(--color-muted)] text-sm uppercase tracking-[0.12em] text-[var(--color-text)]">
            <tr>
              <th className="px-6 py-4">Pasangan</th>
              <th className="px-6 py-4">Template</th>
              <th className="px-6 py-4">Tanggal</th>
              <th className="px-6 py-4">RSVP</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-accent-pale)]/65">
            {items.map((item) => (
              <tr key={item.id} className="transition-colors hover:bg-[var(--color-bg)]">
                <td className="px-6 py-5">
                  <p className="text-lg font-black text-[var(--color-primary)]">{item.couple}</p>
                  <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">/u/{item.slug}</p>
                </td>
                <td className="px-6 py-5">
                  <p className="font-black text-[var(--color-primary)]">{item.template}</p>
                  <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">{item.category} | {item.package}</p>
                </td>
                <td className="px-6 py-5 font-bold text-[var(--color-text)]">{item.date}</td>
                <td className="px-6 py-5 font-black text-[var(--color-primary)]">{item.rsvp}</td>
                <td className="px-6 py-5">
                  <span className={`rounded-full px-3 py-1.5 text-sm font-black ${statusStyles[item.status]}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex gap-2">
                    <button className="rounded-xl border border-[var(--color-accent-pale)] px-3 py-2 text-sm font-black text-[var(--color-text)] hover:bg-white">
                      Edit
                    </button>
                    <button className="rounded-xl bg-[var(--color-primary)] px-3 py-2 text-sm font-black text-white hover:bg-[var(--color-primary-hover)]">
                      Preview
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
}

function QuickCreateCard() {
  const [selectedTemplate, setSelectedTemplate] = useState("standard");

  return (
    <motion.section
      variants={fadeUp}
      className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-primary)] p-6 text-white shadow-xl shadow-[var(--color-primary)]/12"
    >
      <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent-soft)]">
        Quick Create
      </p>
      <h2 className="mt-3 text-2xl font-black">Draft undangan baru</h2>
      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="text-sm font-black text-white/72">Nama pasangan</span>
          <input
            className="mt-2 w-full rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-base font-bold text-white outline-none placeholder:text-white/36 focus:border-[var(--color-accent)]"
            placeholder="Contoh: Dimas & Salsa"
          />
        </label>
        <label className="block">
          <span className="text-sm font-black text-white/72">Template</span>
          <select
            value={selectedTemplate}
            onChange={(event) => setSelectedTemplate(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-base font-bold text-white outline-none focus:border-[var(--color-accent)]"
          >
            {templates.map((template) => (
              <option
                key={template.id}
                value={template.id}
                className="text-[var(--color-primary)]"
              >
                {template.name}
              </option>
            ))}
          </select>
        </label>
        <button className="w-full rounded-2xl bg-[var(--color-accent)] px-5 py-4 text-base font-black text-[var(--color-primary)] transition-colors hover:bg-[var(--color-accent-soft)]">
          Buat Draft
        </button>
      </div>
    </motion.section>
  );
}

function TemplateHighlights() {
  return (
    <motion.section
      variants={fadeUp}
      className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] p-6 shadow-lg shadow-[var(--color-primary)]/8"
    >
      <h2 className="text-2xl font-black text-[var(--color-primary)]">Template Terlaris</h2>
      <div className="mt-5 space-y-4">
        {templates.map((template) => (
          <div key={template.name} className="flex items-center gap-4">
            <img
              src={template.image}
              alt={`Preview ${template.name}`}
              className="h-16 w-14 rounded-[8px] border border-[var(--color-accent-pale)] object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="font-black text-[var(--color-primary)]">{template.name}</p>
              <p className="text-sm font-semibold text-[var(--color-text)]">{template.category}</p>
            </div>
            <p className="text-lg font-black text-[var(--color-accent)]">{template.orders}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

function ActivityFeed() {
  return (
    <motion.section
      variants={fadeUp}
      className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] p-6 shadow-lg shadow-[var(--color-primary)]/8"
    >
      <h2 className="text-2xl font-black text-[var(--color-primary)]">Aktivitas</h2>
      <div className="mt-5 space-y-4">
        {activities.map((activity) => (
          <div key={activity} className="flex gap-3">
            <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
            <p className="text-base font-semibold leading-7 text-[var(--color-text)]">{activity}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

function GuestManager() {
  const [guests, setGuests] = useState(sampleInvitation.guests);
  const [guestName, setGuestName] = useState("");
  const [guestGroup, setGuestGroup] = useState("Keluarga");
  const [copyMessage, setCopyMessage] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    fetch("/api/guests?invitationSlug=dimas-salsa")
      .then((response) => response.json())
      .then((result) => {
        if (isMounted && Array.isArray(result.data)) {
          setGuests(result.data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setGuests(sampleInvitation.guests);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const createSlug = (name) =>
    name
      .toLowerCase()
      .trim()
      .replace(/&/g, "dan")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const addGuest = async () => {
    if (!guestName.trim()) {
      return;
    }

    const newGuest = {
      name: guestName.trim(),
      slug: createSlug(guestName),
      group: guestGroup,
      rsvpStatus: "Belum RSVP",
      pax: 0,
    };

    setGuests((current) => [newGuest, ...current]);
    setGuestName("");
    setSaveMessage("Menyimpan tamu...");

    try {
      const response = await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationSlug: "dimas-salsa",
          name: newGuest.name,
          slug: newGuest.slug,
          group: newGuest.group,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menyimpan tamu");
      }

      setSaveMessage(
        result.source === "supabase"
          ? "Tamu tersimpan ke Supabase."
          : "Tamu ditambahkan sementara. Supabase belum dikonfigurasi.",
      );
    } catch (error) {
      setSaveMessage(error.message || "Tamu ditambahkan secara lokal.");
    }
  };

  const copyGuestLink = async (guest) => {
    const link = `${window.location.origin}/u/dimas-salsa/to/${guest.slug}`;

    try {
      await window.navigator.clipboard.writeText(link);
      setCopyMessage(`Link ${guest.name} disalin.`);
    } catch {
      setCopyMessage(link);
    }
  };

  return (
    <motion.section
      variants={fadeUp}
      className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] shadow-xl shadow-[var(--color-primary)]/8"
    >
      <div className="border-b border-[var(--color-accent-pale)] px-6 py-5">
        <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
          Guest Manager
        </p>
        <h2 className="mt-2 text-2xl font-black text-[var(--color-primary)]">
          Link personal tamu
        </h2>
        <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
          Buat link custom seperti /u/dimas-salsa/to/bapak-andi.
        </p>
      </div>

      <div className="grid gap-4 border-b border-[var(--color-accent-pale)] p-6 md:grid-cols-[1fr_180px_auto]">
        <TextInput
          value={guestName}
          onChange={(event) => setGuestName(event.target.value)}
          placeholder="Nama tamu, contoh: Bapak Andi"
        />
        <SelectInput
          value={guestGroup}
          onChange={(event) => setGuestGroup(event.target.value)}
        >
          <option>Keluarga</option>
          <option>Teman</option>
          <option>Kantor</option>
          <option>VIP</option>
        </SelectInput>
        <button
          type="button"
          onClick={addGuest}
          className="rounded-2xl bg-[var(--color-accent)] px-5 py-3 text-base font-black text-[var(--color-primary)] hover:bg-[var(--color-accent-soft)]"
        >
          Tambah Tamu
        </button>
      </div>

      {copyMessage ? (
        <p className="px-6 pt-5 text-sm font-bold text-[var(--color-wa)]">
          {copyMessage}
        </p>
      ) : null}
      {saveMessage ? (
        <p className="px-6 pt-3 text-sm font-bold text-[var(--color-text)]">
          {saveMessage}
        </p>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead className="bg-[var(--color-muted)] text-sm uppercase tracking-[0.12em] text-[var(--color-text)]">
            <tr>
              <th className="px-6 py-4">Nama</th>
              <th className="px-6 py-4">Group</th>
              <th className="px-6 py-4">RSVP</th>
              <th className="px-6 py-4">Link</th>
              <th className="px-6 py-4">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-accent-pale)]/65">
            {guests.map((guest) => (
              <tr key={guest.slug} className="hover:bg-[var(--color-bg)]">
                <td className="px-6 py-5">
                  <p className="text-lg font-black text-[var(--color-primary)]">
                    {guest.name}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">
                    {guest.slug}
                  </p>
                </td>
                <td className="px-6 py-5 font-bold text-[var(--color-text)]">
                  {guest.group}
                </td>
                <td className="px-6 py-5">
                  <span className="rounded-full bg-[var(--color-section-soft)] px-3 py-1.5 text-sm font-black text-[var(--color-text)]">
                    {guest.rsvpStatus}
                  </span>
                </td>
                <td className="px-6 py-5 text-sm font-semibold text-[var(--color-text)]">
                  /u/dimas-salsa/to/{guest.slug}
                </td>
                <td className="px-6 py-5">
                  <button
                    type="button"
                    onClick={() => copyGuestLink(guest)}
                    className="rounded-xl bg-[var(--color-primary)] px-3 py-2 text-sm font-black text-white hover:bg-[var(--color-primary-hover)]"
                  >
                    Copy Link
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
}

function RSVPManager() {
  const [rsvps, setRsvps] = useState(sampleInvitation.rsvps);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/rsvps?invitationSlug=dimas-salsa")
      .then((response) => response.json())
      .then((result) => {
        if (isMounted && Array.isArray(result.data)) {
          setRsvps(result.data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setRsvps(sampleInvitation.rsvps);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const totalPax = rsvps.reduce((total, item) => total + Number(item.pax || 0), 0);
  const attending = rsvps.filter((item) => item.attendance === "hadir").length;
  const exportCsv = () => {
    const headers = ["Nama", "Status", "Pax", "Ucapan", "Waktu"];
    const rows = rsvps.map((item) => [
      item.guestName,
      item.attendance === "hadir" ? "Hadir" : "Tidak Hadir",
      item.pax,
      item.message || "",
      item.createdAt ? new Date(item.createdAt).toLocaleString("id-ID") : "",
    ]);
    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "rsvp-dimas-salsa.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.section
      variants={fadeUp}
      className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] shadow-xl shadow-[var(--color-primary)]/8"
    >
      <div className="flex flex-col gap-4 border-b border-[var(--color-accent-pale)] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
            RSVP Manager
          </p>
          <h2 className="mt-2 text-2xl font-black text-[var(--color-primary)]">
            Konfirmasi kehadiran
          </h2>
          <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
            {attending} tamu hadir, total estimasi {totalPax} pax.
          </p>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          className="rounded-2xl border border-[var(--color-accent-pale)] bg-white px-5 py-3 text-base font-black text-[var(--color-text)]"
        >
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead className="bg-[var(--color-muted)] text-sm uppercase tracking-[0.12em] text-[var(--color-text)]">
            <tr>
              <th className="px-6 py-4">Nama</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Pax</th>
              <th className="px-6 py-4">Ucapan</th>
              <th className="px-6 py-4">Waktu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-accent-pale)]/65">
            {rsvps.map((item, index) => (
              <tr key={`${item.guestName}-${index}`} className="hover:bg-[var(--color-bg)]">
                <td className="px-6 py-5 text-lg font-black text-[var(--color-primary)]">
                  {item.guestName}
                </td>
                <td className="px-6 py-5">
                  <span
                    className={`rounded-full px-3 py-1.5 text-sm font-black ${
                      item.attendance === "hadir"
                        ? "bg-[var(--color-wa)] text-white"
                        : "bg-[var(--color-section-soft)] text-[var(--color-text)]"
                    }`}
                  >
                    {item.attendance === "hadir" ? "Hadir" : "Tidak Hadir"}
                  </span>
                </td>
                <td className="px-6 py-5 font-black text-[var(--color-primary)]">
                  {item.pax}
                </td>
                <td className="max-w-sm px-6 py-5 text-base font-semibold leading-7 text-[var(--color-text)]">
                  {item.message || "-"}
                </td>
                <td className="px-6 py-5 text-sm font-semibold text-[var(--color-text)]">
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleString("id-ID")
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
}

function MediaManager() {
  const [mediaItems, setMediaItems] = useState([]);
  const [mediaType, setMediaType] = useState("image");
  const [title, setTitle] = useState("Gallery");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    fetch("/api/media?invitationSlug=dimas-salsa")
      .then((response) => response.json())
      .then((result) => {
        if (isMounted && Array.isArray(result.data)) {
          setMediaItems(result.data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setMediaItems([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const uploadMedia = async () => {
    if (!file) {
      setMessage("Pilih file dulu.");
      return;
    }

    const formData = new FormData();
    formData.append("invitationSlug", "dimas-salsa");
    formData.append("mediaType", mediaType);
    formData.append("title", title);
    formData.append("file", file);

    setMessage("Mengupload media...");

    try {
      const response = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload gagal");
      }

      setMediaItems((current) => [result.data, ...current]);
      setFile(null);
      setMessage(
        result.source === "supabase"
          ? "Media berhasil diupload."
          : "Media dummy ditambahkan. Supabase belum dikonfigurasi.",
      );
    } catch (error) {
      setMessage(error.message || "Upload gagal.");
    }
  };

  return (
    <motion.section
      variants={fadeUp}
      className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] shadow-xl shadow-[var(--color-primary)]/8"
    >
      <div className="border-b border-[var(--color-accent-pale)] px-6 py-5">
        <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
          Media Manager
        </p>
        <h2 className="mt-2 text-2xl font-black text-[var(--color-primary)]">
          Cover, gallery, dan backsound
        </h2>
        <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
          Upload media ke Supabase Storage bucket invitation-media.
        </p>
      </div>

      <div className="grid gap-4 border-b border-[var(--color-accent-pale)] p-6 lg:grid-cols-[160px_1fr_1fr_auto]">
        <SelectInput value={mediaType} onChange={(event) => setMediaType(event.target.value)}>
          <option value="cover">Cover</option>
          <option value="image">Gallery</option>
          <option value="music">Music</option>
          <option value="video">Video</option>
        </SelectInput>
        <TextInput
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Judul media"
        />
        <input
          type="file"
          accept={mediaType === "music" ? "audio/*" : mediaType === "video" ? "video/*" : "image/*"}
          onChange={(event) => setFile(event.target.files?.[0] || null)}
          className="rounded-2xl border border-[var(--color-accent-pale)] bg-white px-4 py-3 text-sm font-bold text-[var(--color-text)]"
        />
        <button
          type="button"
          onClick={uploadMedia}
          className="rounded-2xl bg-[var(--color-accent)] px-5 py-3 text-base font-black text-[var(--color-primary)] hover:bg-[var(--color-accent-soft)]"
        >
          Upload
        </button>
      </div>

      {message ? (
        <p className="px-6 pt-5 text-sm font-bold text-[var(--color-text)]">{message}</p>
      ) : null}

      <div className="grid gap-5 p-6 sm:grid-cols-2 xl:grid-cols-3">
        {mediaItems.map((item) => (
          <article
            key={item.id || item.url}
            className="overflow-hidden rounded-[8px] border border-[var(--color-accent-pale)] bg-white shadow-lg shadow-[var(--color-primary)]/8"
          >
            {item.mediaType === "music" ? (
              <div className="p-5">
                <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent)]">
                  Music
                </p>
                <p className="mt-2 text-lg font-black text-[var(--color-primary)]">
                  {item.title}
                </p>
                <audio controls className="mt-4 w-full">
                  <source src={item.url} />
                </audio>
              </div>
            ) : (
              <>
                <img
                  src={item.url}
                  alt={item.title || "Media undangan"}
                  className="aspect-[4/3] w-full bg-[var(--color-bg)] object-cover"
                />
                <div className="p-5">
                  <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent)]">
                    {item.mediaType}
                  </p>
                  <p className="mt-2 text-lg font-black text-[var(--color-primary)]">
                    {item.title}
                  </p>
                </div>
              </>
            )}
          </article>
        ))}
      </div>
    </motion.section>
  );
}

function MultiEventManager() {
  const [events, setEvents] = useState(sampleInvitation.events);
  const [form, setForm] = useState({
    title: "Akad Nikah",
    eventDate: "2026-06-12",
    eventTime: "09.00 WIB",
    venue: "Gedung Serbaguna Nusantara",
    address: "Jl. Melati Raya No. 12, Bandung",
    mapsUrl: "https://maps.google.com",
  });
  const [message, setMessage] = useState("");

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const addEvent = async () => {
    const newEvent = { ...form, date: form.eventDate, time: form.eventTime };
    setEvents((current) => [...current, newEvent]);
    setMessage("Menyimpan acara...");

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationSlug: "dimas-salsa", ...form }),
      });
      const result = await response.json();
      setMessage(
        result.source === "supabase"
          ? "Acara tersimpan ke Supabase."
          : "Acara ditambahkan sementara. Supabase belum dikonfigurasi.",
      );
    } catch {
      setMessage("Acara ditambahkan secara lokal.");
    }
  };

  return (
    <motion.section
      variants={fadeUp}
      className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] shadow-xl shadow-[var(--color-primary)]/8"
    >
      <div className="border-b border-[var(--color-accent-pale)] px-6 py-5">
        <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
          Multiple Events
        </p>
        <h2 className="mt-2 text-2xl font-black text-[var(--color-primary)]">
          Rangkaian acara
        </h2>
      </div>
      <div className="grid gap-4 border-b border-[var(--color-accent-pale)] p-6 md:grid-cols-2">
        <TextInput value={form.title} onChange={(event) => updateForm("title", event.target.value)} placeholder="Judul acara" />
        <TextInput type="date" value={form.eventDate} onChange={(event) => updateForm("eventDate", event.target.value)} />
        <TextInput value={form.eventTime} onChange={(event) => updateForm("eventTime", event.target.value)} placeholder="Jam acara" />
        <TextInput value={form.venue} onChange={(event) => updateForm("venue", event.target.value)} placeholder="Venue" />
        <TextInput value={form.address} onChange={(event) => updateForm("address", event.target.value)} placeholder="Alamat" />
        <TextInput value={form.mapsUrl} onChange={(event) => updateForm("mapsUrl", event.target.value)} placeholder="Google Maps URL" />
        <button
          type="button"
          onClick={addEvent}
          className="rounded-2xl bg-[var(--color-accent)] px-5 py-3 text-base font-black text-[var(--color-primary)] md:col-span-2"
        >
          Tambah Acara
        </button>
      </div>
      {message ? <p className="px-6 pt-5 text-sm font-bold text-[var(--color-text)]">{message}</p> : null}
      <div className="grid gap-5 p-6 md:grid-cols-2">
        {events.map((event, index) => (
          <article key={`${event.title}-${index}`} className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-5">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent)]">{event.title}</p>
            <h3 className="mt-2 text-xl font-black text-[var(--color-primary)]">{event.date || event.eventDate}</h3>
            <p className="mt-2 font-bold text-[var(--color-text)]">{event.time || event.eventTime}</p>
            <p className="mt-3 font-black text-[var(--color-primary)]">{event.venue}</p>
            <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">{event.address}</p>
          </article>
        ))}
      </div>
    </motion.section>
  );
}

function StoryManager() {
  const [stories, setStories] = useState(sampleInvitation.story);
  const [form, setForm] = useState({
    year: "2026",
    title: "Hari Bahagia",
    description: "Kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan mendoakan.",
  });
  const [message, setMessage] = useState("");

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const addStory = async () => {
    const newStory = { year: form.year, title: form.title, desc: form.description };
    setStories((current) => [...current, newStory]);
    setMessage("Menyimpan cerita...");

    try {
      const response = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationSlug: "dimas-salsa", ...form }),
      });
      const result = await response.json();
      setMessage(
        result.source === "supabase"
          ? "Story tersimpan ke Supabase."
          : "Story ditambahkan sementara. Supabase belum dikonfigurasi.",
      );
    } catch {
      setMessage("Story ditambahkan secara lokal.");
    }
  };

  return (
    <motion.section
      variants={fadeUp}
      className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] shadow-xl shadow-[var(--color-primary)]/8"
    >
      <div className="border-b border-[var(--color-accent-pale)] px-6 py-5">
        <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
          Love Story
        </p>
        <h2 className="mt-2 text-2xl font-black text-[var(--color-primary)]">
          Cerita pasangan
        </h2>
      </div>
      <div className="grid gap-4 border-b border-[var(--color-accent-pale)] p-6 md:grid-cols-[160px_1fr]">
        <TextInput value={form.year} onChange={(event) => updateForm("year", event.target.value)} placeholder="Tahun" />
        <TextInput value={form.title} onChange={(event) => updateForm("title", event.target.value)} placeholder="Judul cerita" />
        <textarea
          value={form.description}
          onChange={(event) => updateForm("description", event.target.value)}
          rows={4}
          className="rounded-2xl border border-[var(--color-accent-pale)] bg-white px-4 py-3 text-base font-bold leading-7 text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)] md:col-span-2"
        />
        <button
          type="button"
          onClick={addStory}
          className="rounded-2xl bg-[var(--color-accent)] px-5 py-3 text-base font-black text-[var(--color-primary)] md:col-span-2"
        >
          Tambah Story
        </button>
      </div>
      {message ? <p className="px-6 pt-5 text-sm font-bold text-[var(--color-text)]">{message}</p> : null}
      <div className="grid gap-5 p-6 md:grid-cols-3">
        {stories.map((story, index) => (
          <article key={`${story.title}-${index}`} className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-5">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent)]">{story.year}</p>
            <h3 className="mt-2 text-xl font-black text-[var(--color-primary)]">{story.title}</h3>
            <p className="mt-3 text-sm font-semibold leading-6 text-[var(--color-text)]">{story.desc || story.description}</p>
          </article>
        ))}
      </div>
    </motion.section>
  );
}

function BankAccountManager() {
  const [accounts, setAccounts] = useState(sampleInvitation.bankAccounts);
  const [form, setForm] = useState({
    bank: "BCA",
    accountName: "Dimas Pratama",
    accountNumber: "1234567890",
  });
  const [message, setMessage] = useState("");

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const addAccount = async () => {
    const newAccount = {
      bank: form.bank,
      name: form.accountName,
      number: form.accountNumber,
    };
    setAccounts((current) => [...current, newAccount]);
    setMessage("Menyimpan rekening...");

    try {
      const response = await fetch("/api/bank-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationSlug: "dimas-salsa", ...form }),
      });
      const result = await response.json();
      setMessage(
        result.source === "supabase"
          ? "Rekening tersimpan ke Supabase."
          : "Rekening ditambahkan sementara. Supabase belum dikonfigurasi.",
      );
    } catch {
      setMessage("Rekening ditambahkan secara lokal.");
    }
  };

  return (
    <motion.section
      variants={fadeUp}
      className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] shadow-xl shadow-[var(--color-primary)]/8"
    >
      <div className="border-b border-[var(--color-accent-pale)] px-6 py-5">
        <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
          Bank Accounts
        </p>
        <h2 className="mt-2 text-2xl font-black text-[var(--color-primary)]">
          Amplop digital
        </h2>
      </div>
      <div className="grid gap-4 border-b border-[var(--color-accent-pale)] p-6 md:grid-cols-[160px_1fr_1fr_auto]">
        <TextInput value={form.bank} onChange={(event) => updateForm("bank", event.target.value)} placeholder="Bank" />
        <TextInput value={form.accountName} onChange={(event) => updateForm("accountName", event.target.value)} placeholder="Nama rekening" />
        <TextInput value={form.accountNumber} onChange={(event) => updateForm("accountNumber", event.target.value)} placeholder="Nomor rekening" />
        <button
          type="button"
          onClick={addAccount}
          className="rounded-2xl bg-[var(--color-accent)] px-5 py-3 text-base font-black text-[var(--color-primary)]"
        >
          Tambah
        </button>
      </div>
      {message ? <p className="px-6 pt-5 text-sm font-bold text-[var(--color-text)]">{message}</p> : null}
      <div className="grid gap-5 p-6 md:grid-cols-2">
        {accounts.map((account, index) => (
          <article key={`${account.bank}-${index}`} className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-5">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent)]">{account.bank}</p>
            <h3 className="mt-2 text-2xl font-black text-[var(--color-primary)]">{account.number}</h3>
            <p className="mt-2 text-base font-semibold text-[var(--color-text)]">a.n. {account.name}</p>
          </article>
        ))}
      </div>
    </motion.section>
  );
}

function ContentManagers() {
  return (
    <>
      <MultiEventManager />
      <StoryManager />
      <BankAccountManager />
    </>
  );
}

function InvitationFormPanel() {
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState(initialInvitationForm);
  const [saveMessage, setSaveMessage] = useState("");

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const saveDraft = async () => {
    const invitationDraft = createInvitationFromDashboardForm(form);
    window.localStorage.setItem("nusa-invite:draft", JSON.stringify(invitationDraft));

    try {
      const response = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, status: "draft" }),
      });
      const result = await response.json();

      setSaveMessage(
        result.source === "supabase"
          ? "Draft tersimpan ke Supabase."
          : "Draft lokal tersimpan. Supabase belum dikonfigurasi.",
      );
    } catch {
      setSaveMessage("Draft lokal tersimpan. API belum tersedia.");
    }
  };

  const openPreview = async () => {
    await saveDraft();
    window.open("/preview", "_blank", "noopener,noreferrer");
  };

  const renderStep = () => {
    if (activeStep === 0) {
      return (
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Template">
            <SelectInput
              value={form.templateId}
              onChange={(event) => {
                const selected = templates.find(
                  (template) => template.id === event.target.value,
                );
                updateForm("templateId", event.target.value);
                updateForm("template", selected?.name || "Rana Kirana");
              }}
            >
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field label="Paket">
            <SelectInput
              value={form.package}
              onChange={(event) => updateForm("package", event.target.value)}
            >
              <option>Basic</option>
              <option>Premium</option>
              <option>Exclusive</option>
            </SelectInput>
          </Field>
          <Field label="Slug Public">
            <TextInput
              value={form.slug}
              onChange={(event) => updateForm("slug", event.target.value)}
              placeholder="dimas-salsa"
            />
          </Field>
          <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-5">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent)]">
              Public URL
            </p>
            <p className="mt-2 break-all text-lg font-black text-[var(--color-primary)]">
              /u/{form.slug || "slug-undangan"}
            </p>
          </div>
        </div>
      );
    }

    if (activeStep === 1) {
      return (
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Nama Mempelai Pria">
            <TextInput
              value={form.groomName}
              onChange={(event) => updateForm("groomName", event.target.value)}
            />
          </Field>
          <Field label="Panggilan Pria">
            <TextInput
              value={form.groomNickname}
              onChange={(event) => updateForm("groomNickname", event.target.value)}
            />
          </Field>
          <Field label="Nama Mempelai Wanita">
            <TextInput
              value={form.brideName}
              onChange={(event) => updateForm("brideName", event.target.value)}
            />
          </Field>
          <Field label="Panggilan Wanita">
            <TextInput
              value={form.brideNickname}
              onChange={(event) => updateForm("brideNickname", event.target.value)}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Quote / Doa Pembuka">
              <textarea
                value={form.quote}
                onChange={(event) => updateForm("quote", event.target.value)}
                rows={4}
                className="w-full rounded-2xl border border-[var(--color-accent-pale)] bg-white px-4 py-3 text-base font-bold leading-7 text-[var(--color-primary)] outline-none transition-colors placeholder:text-[var(--color-text)]/40 focus:border-[var(--color-accent)]"
              />
            </Field>
          </div>
        </div>
      );
    }

    if (activeStep === 2) {
      return (
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Judul Acara">
            <TextInput
              value={form.eventTitle}
              onChange={(event) => updateForm("eventTitle", event.target.value)}
            />
          </Field>
          <Field label="Tanggal">
            <TextInput
              type="date"
              value={form.eventDate}
              onChange={(event) => updateForm("eventDate", event.target.value)}
            />
          </Field>
          <Field label="Jam">
            <TextInput
              type="time"
              value={form.eventTime}
              onChange={(event) => updateForm("eventTime", event.target.value)}
            />
          </Field>
          <Field label="Lokasi">
            <TextInput
              value={form.venue}
              onChange={(event) => updateForm("venue", event.target.value)}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Google Maps URL">
              <TextInput
                value={form.mapsUrl}
                onChange={(event) => updateForm("mapsUrl", event.target.value)}
              />
            </Field>
          </div>
        </div>
      );
    }

    if (activeStep === 3) {
      return (
        <div className="grid gap-4 md:grid-cols-2">
          <ToggleField
            checked={form.rsvp}
            label="RSVP"
            desc="Aktifkan form konfirmasi kehadiran tamu."
            onChange={(value) => updateForm("rsvp", value)}
          />
          <ToggleField
            checked={form.gift}
            label="Amplop Digital"
            desc="Tampilkan rekening atau e-wallet untuk wedding gift."
            onChange={(value) => updateForm("gift", value)}
          />
          <ToggleField
            checked={form.music}
            label="Backsound"
            desc="Tambahkan musik latar untuk undangan publik."
            onChange={(value) => updateForm("music", value)}
          />
          <ToggleField
            checked={form.guestName}
            label="Custom Nama Tamu"
            desc="Buat link personal untuk setiap tamu undangan."
            onChange={(value) => updateForm("guestName", value)}
          />
        </div>
      );
    }

    return (
      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-5">
          <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent)]">
            Ringkasan Data
          </p>
          <dl className="mt-4 grid gap-4 text-base sm:grid-cols-2">
            <div>
              <dt className="font-black text-[var(--color-primary)]">Pasangan</dt>
              <dd className="mt-1 font-semibold text-[var(--color-text)]">
                {form.groomNickname} & {form.brideNickname}
              </dd>
            </div>
            <div>
              <dt className="font-black text-[var(--color-primary)]">Template</dt>
              <dd className="mt-1 font-semibold text-[var(--color-text)]">
                {form.template} | {form.package}
              </dd>
            </div>
            <div>
              <dt className="font-black text-[var(--color-primary)]">Acara</dt>
              <dd className="mt-1 font-semibold text-[var(--color-text)]">
                {form.eventTitle}, {form.eventDate} {form.eventTime}
              </dd>
            </div>
            <div>
              <dt className="font-black text-[var(--color-primary)]">Fitur</dt>
              <dd className="mt-1 font-semibold text-[var(--color-text)]">
                {[form.rsvp && "RSVP", form.gift && "Amplop", form.music && "Music", form.guestName && "Nama Tamu"]
                  .filter(Boolean)
                  .join(", ")}
              </dd>
            </div>
          </dl>
        </div>
        <div className="rounded-[8px] bg-[var(--color-primary)] p-5 text-white">
          <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent-soft)]">
            Preview URL
          </p>
          <p className="mt-3 break-all text-lg font-black">/u/{form.slug}</p>
          <button
            type="button"
            onClick={saveDraft}
            className="mt-5 w-full rounded-2xl bg-[var(--color-accent)] px-4 py-3 text-base font-black text-[var(--color-primary)] hover:bg-[var(--color-accent-soft)]"
          >
            Simpan Draft
          </button>
          <button
            type="button"
            onClick={openPreview}
            className="mt-3 w-full rounded-2xl bg-white px-4 py-3 text-base font-black text-[var(--color-primary)] hover:bg-[var(--color-bg)]"
          >
            Preview Undangan
          </button>
        </div>
      </div>
    );
  };

  return (
    <motion.section
      variants={fadeUp}
      className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] shadow-xl shadow-[var(--color-primary)]/8"
    >
      <div className="border-b border-[var(--color-accent-pale)] px-6 py-5">
        <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
          Create / Edit
        </p>
        <h2 className="mt-2 text-2xl font-black text-[var(--color-primary)]">
          Form data undangan
        </h2>
        <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
          Struktur form ini disiapkan agar nanti langsung bisa disimpan ke tabel undangan.
        </p>
      </div>

      <div className="border-b border-[var(--color-accent-pale)] px-6 py-4">
        <div className="flex flex-wrap gap-3">
          {formSteps.map((step, index) => (
            <button
              key={step}
              type="button"
              onClick={() => setActiveStep(index)}
              className={`rounded-2xl border px-4 py-2 text-sm font-black transition-colors ${
                activeStep === index
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                  : "border-[var(--color-accent-pale)] bg-white text-[var(--color-text)] hover:border-[var(--color-accent)]"
              }`}
            >
              {index + 1}. {step}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">{renderStep()}</div>

      <div className="flex items-center justify-between gap-3 border-t border-[var(--color-accent-pale)] px-6 py-5">
        <button
          type="button"
          disabled={activeStep === 0}
          onClick={() => setActiveStep((current) => Math.max(0, current - 1))}
          className="rounded-2xl border border-[var(--color-accent-pale)] bg-white px-5 py-3 text-base font-black text-[var(--color-text)] transition-colors hover:bg-[var(--color-bg)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Sebelumnya
        </button>
        <div className="flex flex-wrap items-center justify-end gap-3">
          {saveMessage ? (
            <p className="text-sm font-bold text-[var(--color-wa)]">{saveMessage}</p>
          ) : null}
          {activeStep === formSteps.length - 1 ? (
            <button
              type="button"
              onClick={openPreview}
              className="rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-base font-black text-white transition-colors hover:bg-[var(--color-primary-hover)]"
            >
              Preview
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => {
              if (activeStep === formSteps.length - 1) {
                saveDraft();
                return;
              }
              setActiveStep((current) => Math.min(formSteps.length - 1, current + 1));
            }}
            className="rounded-2xl bg-[var(--color-accent)] px-5 py-3 text-base font-black text-[var(--color-primary)] transition-colors hover:bg-[var(--color-accent-soft)]"
          >
            {activeStep === formSteps.length - 1 ? "Simpan Draft" : "Lanjut"}
          </button>
        </div>
      </div>
    </motion.section>
  );
}

function LogoutButton() {
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <button
      type="button"
      onClick={logout}
      className="rounded-2xl border border-[var(--color-accent-pale)] bg-[var(--color-surface)] px-4 py-3 text-sm font-black text-[var(--color-text)] transition-colors hover:bg-white"
    >
      Logout
    </button>
  );
}

const pageMeta = {
  overview: {
    eyebrow: "Dashboard",
    title: "Kelola undangan digital",
  },
  invitations: {
    eyebrow: "Undangan",
    title: "Data undangan & draft",
  },
  templates: {
    eyebrow: "Template",
    title: "Katalog template admin",
  },
  rsvps: {
    eyebrow: "RSVP",
    title: "Konfirmasi kehadiran",
  },
  guests: {
    eyebrow: "Tamu",
    title: "Guest manager",
  },
  media: {
    eyebrow: "Media",
    title: "Media undangan",
  },
  settings: {
    eyebrow: "Pengaturan",
    title: "Pengaturan workspace",
  },
  content: {
    eyebrow: "Konten",
    title: "Acara, love story, dan amplop",
  },
};

function TemplateStatusPill({ status }) {
  const isActive = status === "active";
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.08em] ${
        isActive
          ? "bg-[var(--color-wa)] text-white"
          : "bg-[var(--color-section-soft)] text-[var(--color-text)]"
      }`}
    >
      {isActive ? "Active" : "Hidden"}
    </span>
  );
}

function MiniInput({ label, value, onChange, type = "text", step }) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
        {label}
      </span>
      <input
        type={type}
        step={step}
        value={value ?? ""}
        onChange={(event) =>
          onChange(type === "number" ? Number(event.target.value) : event.target.value)
        }
        className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
      />
    </label>
  );
}

function countdownPreviewClasses(variant = "cards") {
  if (variant === "minimal") {
    return {
      container: "grid grid-cols-4 gap-2 border-y border-[var(--color-accent-pale)] py-4",
      item: "px-2 text-center",
      value: "text-2xl font-black text-[var(--color-primary)]",
      label: "mt-1 text-[10px] font-black uppercase tracking-[0.12em] text-[var(--color-text)]",
    };
  }

  if (variant === "circle") {
    return {
      container: "grid grid-cols-4 gap-3",
      item: "flex aspect-square flex-col items-center justify-center rounded-full border border-[var(--color-accent)] bg-white shadow-lg shadow-[var(--color-primary)]/8",
      value: "text-xl font-black text-[var(--color-primary)]",
      label: "mt-1 text-[9px] font-black uppercase tracking-[0.08em] text-[var(--color-text)]",
    };
  }

  return {
    container: "grid grid-cols-4 gap-3",
    item: "rounded-[8px] bg-white px-3 py-4 text-center shadow-lg shadow-[var(--color-primary)]/8",
    value: "text-2xl font-black text-[var(--color-primary)]",
    label: "mt-1 text-xs font-black uppercase tracking-[0.12em] text-[var(--color-text)]",
  };
}

function CountdownWidgetPreview({ variant = "cards", enabled = true }) {
  const classes = countdownPreviewClasses(variant);
  const previewItems = [
    ["45", "Hari"],
    ["08", "Jam"],
    ["32", "Menit"],
    ["18", "Detik"],
  ];

  return (
    <div className={`rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-section-soft)] p-4 ${enabled ? "" : "opacity-55"}`}>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-text)]">
          Live Preview
        </p>
        <p className="text-xs font-black text-[var(--color-accent)]">
          {enabled ? variant : "disabled"}
        </p>
      </div>
      <div className="mt-4">
        <div className={classes.container}>
          {previewItems.map(([value, label]) => (
            <div key={label} className={classes.item}>
              <p className={classes.value}>{value}</p>
              <p className={classes.label}>{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WidgetPreviewShell({ title, label, enabled = true, children }) {
  return (
    <div className={`rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-section-soft)] p-4 ${enabled ? "" : "opacity-55"}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-text)]">
          {title}
        </p>
        <p className="text-xs font-black text-[var(--color-accent)]">
          {enabled ? label : "disabled"}
        </p>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function StoryWidgetPreview({ variant = "card", enabled = true }) {
  const items = [
    ["2021", "Bertemu"],
    ["2024", "Lamaran"],
    ["2026", "Menikah"],
  ];

  if (variant === "timeline") {
    return (
      <WidgetPreviewShell title="Live Preview" label={variant} enabled={enabled}>
        <div className="space-y-3 border-l-2 border-[var(--color-accent)]/50 pl-4">
          {items.map(([year, title]) => (
            <div key={year} className="relative rounded-[8px] bg-white p-3 shadow-sm">
              <span className="absolute -left-[23px] top-4 h-3 w-3 rounded-full bg-[var(--color-accent)]" />
              <p className="text-[10px] font-black text-[var(--color-accent)]">{year}</p>
              <p className="mt-1 text-sm font-black text-[var(--color-primary)]">{title}</p>
            </div>
          ))}
        </div>
      </WidgetPreviewShell>
    );
  }

  if (variant === "stacked") {
    return (
      <WidgetPreviewShell title="Live Preview" label={variant} enabled={enabled}>
        <div className="divide-y divide-[var(--color-accent-pale)] rounded-[8px] bg-white shadow-sm">
          {items.map(([year, title]) => (
            <div key={year} className="p-3">
              <p className="text-[10px] font-black text-[var(--color-accent)]">{year}</p>
              <p className="mt-1 text-sm font-black text-[var(--color-primary)]">{title}</p>
            </div>
          ))}
        </div>
      </WidgetPreviewShell>
    );
  }

  return (
    <WidgetPreviewShell title="Live Preview" label={variant} enabled={enabled}>
      <div className="grid grid-cols-3 gap-2">
        {items.map(([year, title]) => (
          <div key={year} className="rounded-[8px] bg-white p-3 text-center shadow-sm">
            <p className="text-[10px] font-black text-[var(--color-accent)]">{year}</p>
            <p className="mt-1 text-xs font-black text-[var(--color-primary)]">{title}</p>
          </div>
        ))}
      </div>
    </WidgetPreviewShell>
  );
}

function GalleryWidgetPreview({ variant = "grid", enabled = true }) {
  const items = Array.from({ length: 6 }, (_, index) => index + 1);

  if (variant === "carousel") {
    return (
      <WidgetPreviewShell title="Live Preview" label={variant} enabled={enabled}>
        <div className="flex gap-2 overflow-hidden">
          {items.slice(0, 4).map((item) => (
            <div key={item} className="flex aspect-[4/5] w-20 shrink-0 items-center justify-center rounded-[8px] border border-dashed border-[var(--color-accent)] bg-white text-xs font-black text-[var(--color-primary)]">
              {item}
            </div>
          ))}
        </div>
      </WidgetPreviewShell>
    );
  }

  if (variant === "masonry") {
    return (
      <WidgetPreviewShell title="Live Preview" label={variant} enabled={enabled}>
        <div className="columns-3 gap-2 space-y-2">
          {items.map((item) => (
            <div
              key={item}
              className={`${item % 3 === 0 ? "h-20" : item % 2 === 0 ? "h-14" : "h-16"} flex break-inside-avoid items-center justify-center rounded-[8px] border border-dashed border-[var(--color-accent-pale)] bg-white text-xs font-black text-[var(--color-primary)]`}
            >
              {item}
            </div>
          ))}
        </div>
      </WidgetPreviewShell>
    );
  }

  return (
    <WidgetPreviewShell title="Live Preview" label={variant} enabled={enabled}>
      <div className="grid grid-cols-3 gap-2">
        {items.map((item) => (
          <div key={item} className="flex aspect-[4/5] items-center justify-center rounded-[8px] border border-dashed border-[var(--color-accent-pale)] bg-white text-xs font-black text-[var(--color-primary)]">
            {item}
          </div>
        ))}
      </div>
    </WidgetPreviewShell>
  );
}

function EventWidgetPreview({ variant = "cards", enabled = true, showMaps = true, showIcon = true }) {
  const items = ["Akad", "Resepsi"];
  const cardContent = (title) => (
    <>
      <p className="text-[10px] font-black uppercase tracking-[0.1em] text-[var(--color-accent)]">{title}</p>
      <p className="mt-1 text-sm font-black text-[var(--color-primary)]">12 Jun 2026</p>
      <p className="mt-1 text-xs font-black text-[var(--color-primary)]">09.00 WIB</p>
      {showMaps ? (
        <span className="mt-2 inline-flex rounded-lg bg-[var(--color-primary)] px-3 py-1 text-[10px] font-black text-white">
          Maps
        </span>
      ) : null}
    </>
  );

  if (variant === "list") {
    return (
      <WidgetPreviewShell title="Live Preview" label={variant} enabled={enabled}>
        {showIcon ? <div className="mx-auto mb-3 h-8 w-8 rounded-full border border-[var(--color-accent)]" /> : null}
        <div className="divide-y divide-[var(--color-accent-pale)] rounded-[8px] bg-white text-center shadow-sm">
          {items.map((item) => (
            <div key={item} className="p-3">{cardContent(item)}</div>
          ))}
        </div>
      </WidgetPreviewShell>
    );
  }

  if (variant === "elegant") {
    return (
      <WidgetPreviewShell title="Live Preview" label={variant} enabled={enabled}>
        {showIcon ? <div className="mx-auto mb-3 h-9 w-9 rounded-t-full rounded-b-md border border-[var(--color-accent)] bg-white" /> : null}
        <div className="grid grid-cols-2 gap-2">
          {items.map((item) => (
            <div key={item} className="rounded-t-full rounded-b-[8px] border border-[var(--color-accent-pale)] bg-white px-2 pb-3 pt-6 text-center shadow-sm">
              {cardContent(item)}
            </div>
          ))}
        </div>
      </WidgetPreviewShell>
    );
  }

  return (
    <WidgetPreviewShell title="Live Preview" label={variant} enabled={enabled}>
      {showIcon ? <div className="mx-auto mb-3 h-8 w-8 rounded-[8px] border border-[var(--color-accent-pale)] bg-white" /> : null}
      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => (
          <div key={item} className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-3 text-center shadow-sm">
            {cardContent(item)}
          </div>
        ))}
      </div>
    </WidgetPreviewShell>
  );
}

function OpeningRevealPreview({ config = {} }) {
  const enabled = Boolean(config.enabled);
  const animation = config.animation || "fade";
  const backgroundColor = config.backgroundColor || "#fbf7ef";
  const useImageBackground = config.backgroundMode === "image";
  const coverImageEnabled = config.coverImageEnabled !== false;
  const isSplit = animation === "curtain" || animation === "gate";
  const panelStyle = useImageBackground
    ? {
        backgroundImage: `url(${config.backgroundImage || "/assets/CoverPasangan.png"})`,
        backgroundSize: "200% 100%",
        backgroundRepeat: "no-repeat",
      }
    : { backgroundColor };

  return (
    <WidgetPreviewShell title="Live Preview" label={animation} enabled={enabled}>
      <div
        className="relative flex aspect-[4/5] min-h-[220px] items-center justify-center overflow-hidden rounded-[8px] border border-[var(--color-accent-pale)] px-4 py-5 text-center"
        style={{ backgroundColor }}
      >
        {useImageBackground && !isSplit ? (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-35"
            style={{ backgroundImage: `url(${config.backgroundImage || "/assets/CoverPasangan.png"})` }}
          />
        ) : null}
        {isSplit ? (
          <>
            <div
              className={`absolute inset-y-0 left-0 w-1/2 ${animation === "gate" ? "border-r border-[var(--color-accent)]/35 bg-white" : "bg-[var(--color-primary)]/10"}`}
              style={{ ...panelStyle, backgroundPosition: "left center" }}
            />
            <div
              className={`absolute inset-y-0 right-0 w-1/2 ${animation === "gate" ? "border-l border-[var(--color-accent)]/35 bg-white" : "bg-[var(--color-primary)]/10"}`}
              style={{ ...panelStyle, backgroundPosition: "right center" }}
            />
          </>
        ) : null}
        <div className="absolute inset-0 bg-white/55" />
        <div className={`relative z-10 mx-auto max-w-[220px] ${animation === "paper" ? "rounded-[8px] border border-[var(--color-accent-pale)] bg-white/80 p-3 shadow-sm" : ""}`}>
          {coverImageEnabled ? (
            <img
              src="/assets/CoverPasangan.png"
              alt=""
              className="mx-auto mb-3 aspect-[3/4] w-16 rounded-t-full rounded-b-md object-cover shadow-sm"
            />
          ) : null}
          <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[var(--color-accent)]">
            The Wedding Of
          </p>
          <p className="mt-1 font-serif text-xl font-black leading-none text-[var(--color-primary)]">
            Dimas & Salsa
          </p>
          <div className="mx-auto mt-3 rounded-[8px] border border-[var(--color-accent-pale)] bg-white/80 px-3 py-2">
            <p className="text-[9px] font-black uppercase tracking-[0.1em] text-[var(--color-accent)]">
              Kepada Yth.
            </p>
            <p className="mt-1 text-xs font-black text-[var(--color-primary)]">
              Tamu Undangan
            </p>
          </div>
          <span className="mt-3 inline-flex rounded-xl bg-[var(--color-primary)] px-4 py-2 text-[10px] font-black text-white">
            {config.buttonText || "Buka Undangan"}
          </span>
        </div>
      </div>
    </WidgetPreviewShell>
  );
}

function coverPreviewMotionClass(animation = "fade-up") {
  if (animation === "zoom-in") {
    return "scale-95";
  }

  if (animation === "slide-left") {
    return "translate-x-2";
  }

  if (animation === "pop-up") {
    return "scale-90";
  }

  return "";
}

function CoverSectionPreview({ config = {} }) {
  const backgroundColor = config.backgroundColor || "#fbf7ef";
  const useImageBackground = config.backgroundMode === "image";
  const layout = config.layout || "centered";
  const showGuest = config.guestBlockStyle !== "hidden";

  return (
    <WidgetPreviewShell title="Live Preview" label={layout} enabled>
      <div
        className="relative flex aspect-[4/5] min-h-[220px] items-center justify-center overflow-hidden rounded-[8px] border border-[var(--color-accent-pale)] px-4 py-5 text-center"
        style={{ backgroundColor }}
      >
        {useImageBackground ? (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-35"
            style={{ backgroundImage: `url(${config.backgroundImage || "/assets/CoverPasangan.png"})` }}
          />
        ) : null}
        <div className="absolute inset-0 bg-white/55" />
        <div
          className={`relative z-10 mx-auto grid max-w-[250px] gap-3 ${layout === "split" ? "grid-cols-[0.8fr_1fr] items-center text-left" : "text-center"} ${coverPreviewMotionClass(config.openingAnimation)}`}
        >
          {config.photoEnabled && layout !== "minimal" ? (
            <img
              src="/assets/CoverPasangan.png"
              alt=""
              className="mx-auto aspect-[3/4] w-16 rounded-t-full rounded-b-md object-cover shadow-sm"
            />
          ) : null}
          <div className={layout === "split" && config.photoEnabled ? "" : "col-span-full"}>
            <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[var(--color-accent)]">
              The Wedding Of
            </p>
            <p className="mt-1 font-serif text-xl font-black leading-none text-[var(--color-primary)]">
              Dimas & Salsa
            </p>
            {showGuest ? (
              <div className={`mx-auto mt-3 max-w-[170px] px-3 py-2 ${config.guestBlockStyle === "minimal" ? "border-t border-[var(--color-accent-pale)]" : config.guestBlockStyle === "pill" ? "rounded-full border border-[var(--color-accent-pale)] bg-white/80" : "rounded-[8px] border border-[var(--color-accent-pale)] bg-white/80"}`}>
                <p className="text-[9px] font-black uppercase tracking-[0.1em] text-[var(--color-accent)]">
                  Kepada Yth.
                </p>
                <p className="mt-1 text-xs font-black text-[var(--color-primary)]">
                  Tamu Undangan
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </WidgetPreviewShell>
  );
}

function couplePreviewImageClass(config = {}) {
  const shape =
    config.photoStyle === "circle"
      ? "aspect-square rounded-full"
      : config.photoStyle === "square"
        ? "aspect-[4/5] rounded-[8px]"
        : "aspect-[3/4] rounded-t-full rounded-b-md";
  const border = config.borderEnabled ? "border-4 border-white" : "";

  return `${shape} ${border} mx-auto w-16 object-cover shadow-sm`;
}

function couplePreviewNameClass(config = {}) {
  if (config.fontPreset === "sans") {
    return "mt-2 text-sm font-black text-[var(--color-primary)]";
  }

  if (config.fontPreset === "script") {
    return "mt-2 font-serif text-lg italic text-[var(--color-primary)]";
  }

  return "mt-2 font-serif text-base font-black text-[var(--color-primary)]";
}

function CoupleSectionPreview({ config = {} }) {
  const profiles = [
    ["Salsa Kirana", "/assets/catin_wanita.jpg", "Mempelai Wanita"],
    ["Dimas Pratama", "/assets/catin_pria.jpg", "Mempelai Pria"],
  ];

  return (
    <WidgetPreviewShell title="Live Preview" label={config.photoStyle || "arch"} enabled>
      <div className="grid grid-cols-2 gap-2">
        {profiles.map(([name, image, role]) => (
          <div key={name} className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-3 text-center shadow-sm">
            {config.photoEnabled ? (
              <img src={image} alt="" className={couplePreviewImageClass(config)} />
            ) : null}
            <p className={couplePreviewNameClass(config)}>{name}</p>
            {config.parentTextEnabled ? (
              <p className="mt-1 text-[10px] font-semibold text-[var(--color-text)]">
                {role}
              </p>
            ) : null}
            {config.instagramEnabled ? (
              <span className="mt-2 inline-flex rounded-lg bg-[var(--color-accent)] px-2 py-1 text-[9px] font-black text-[var(--color-primary)]">
                Instagram
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </WidgetPreviewShell>
  );
}

function OrnamentSectionCanvasPreview({ section = "home", styleConfig = {} }) {
  const bgColor = styleConfig.backgroundColor || "#f8f5ef";
  const textColor = styleConfig.textColor || "#0f2a52";
  const accentColor = styleConfig.accentColor || "#d2a84d";
  const label = section === "acara" ? "events" : section;

  if (label === "home") {
    return (
      <div className="relative h-full w-full p-4" style={{ backgroundColor: bgColor, color: textColor }}>
        <div className="mx-auto mt-8 max-w-[220px] text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.14em]" style={{ color: accentColor }}>
            The Wedding Of
          </p>
          <p className="mt-2 font-serif text-xl font-black">Dimas & Salsa</p>
          <div className="mx-auto mt-4 max-w-[170px] rounded-[8px] border bg-white/75 px-3 py-2 text-xs font-black">
            Kepada Yth. Tamu Undangan
          </div>
        </div>
      </div>
    );
  }

  if (label === "couple") {
    return (
      <div className="h-full w-full p-4" style={{ backgroundColor: bgColor, color: textColor }}>
        <div className="mt-6 grid grid-cols-2 gap-2">
          {["Mempelai Wanita", "Mempelai Pria"].map((item) => (
            <div key={item} className="rounded-[8px] border bg-white/75 p-3 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-[var(--color-bg)]" />
              <p className="mt-2 text-[11px] font-black">{item}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (label === "events") {
    return (
      <div className="h-full w-full p-4" style={{ backgroundColor: bgColor, color: textColor }}>
        <div className="mt-5 space-y-2">
          {["Akad Nikah", "Resepsi"].map((item) => (
            <div key={item} className="rounded-[8px] border bg-white/78 p-3 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.1em]" style={{ color: accentColor }}>
                {item}
              </p>
              <p className="mt-1 text-xs font-black">12 Juni 2026 • 09:00</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full p-4" style={{ backgroundColor: bgColor, color: textColor }}>
      <div className="mt-8 rounded-[8px] border bg-white/78 p-4 text-center">
        <p className="text-xs font-black uppercase tracking-[0.12em]" style={{ color: accentColor }}>
          {label} section
        </p>
        <p className="mt-2 text-[11px] font-semibold text-[var(--color-text)]">
          Preview konteks section untuk penempatan ornament
        </p>
      </div>
    </div>
  );
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function parseOrnamentSize(value) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value !== "string") {
    return 0;
  }

  const match = value.match(/^(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : 0;
}

function slugifyTemplateId(value) {
  return (value || "template-baru")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function TemplateAdminPage() {
  const editorSteps = [
    { id: 1, label: "Basic" },
    { id: 2, label: "Style" },
    { id: 3, label: "Opening" },
    { id: 4, label: "Widgets" },
    { id: 5, label: "Ornaments" },
    { id: 6, label: "Preview" },
    { id: 7, label: "Publish" },
  ];
  const [items, setItems] = useState(templates);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingTemplateId, setEditingTemplateId] = useState(null);
  const [templateDraft, setTemplateDraft] = useState(null);
  const [designConfigText, setDesignConfigText] = useState("");
  const [activeDesignSection, setActiveDesignSection] = useState("home");
  const [selectedOrnamentIndex, setSelectedOrnamentIndex] = useState(0);
  const [managerMessage, setManagerMessage] = useState("");
  const [templateSource, setTemplateSource] = useState("registry");
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [isUploadingOrnament, setIsUploadingOrnament] = useState(false);
  const [dynamicOrnamentAssets, setDynamicOrnamentAssets] = useState([]);
  const [isLoadingOrnamentAssets, setIsLoadingOrnamentAssets] = useState(false);
  const [previewViewport, setPreviewViewport] = useState("mobile");
  const [templatePreviewTick, setTemplatePreviewTick] = useState(0);
  const [uploadValidationWarning, setUploadValidationWarning] = useState("");
  const [selectedTemplatePreset, setSelectedTemplatePreset] = useState(templateStylePresets[0].id);
  const [editorStep, setEditorStep] = useState(1);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/templates?scope=admin")
      .then((response) => response.json())
      .then((result) => {
        if (isMounted && Array.isArray(result.data) && result.data.length > 0) {
          setItems((currentItems) =>
            mergeTemplateOverrides(result.data.map((template) => {
              const registryTemplate =
                currentItems.find((item) => item.id === template.id) ||
                templates.find((item) => item.id === template.id) ||
                {};

              return {
                ...registryTemplate,
                ...template,
                image: template.image || registryTemplate.image,
                previewUrl: template.previewUrl || registryTemplate.previewUrl || "/preview",
                supportedFeatures:
                  template.supportedFeatures || registryTemplate.supportedFeatures || [],
              };
            })),
          );
          setTemplateSource(result.source || "api");
        } else if (isMounted) {
          setItems(mergeTemplateOverrides(templates));
        }
      })
      .catch(() => {
        if (isMounted) {
          setItems(mergeTemplateOverrides(templates));
          setTemplateSource("registry");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!templateDraft?.id) {
      setDynamicOrnamentAssets([]);
      return undefined;
    }

    let isMounted = true;
    setIsLoadingOrnamentAssets(true);

    fetch(`/api/templates/ornaments/upload?templateId=${encodeURIComponent(templateDraft.id)}`)
      .then((response) => response.json())
      .then((result) => {
        if (isMounted && Array.isArray(result.data)) {
          setDynamicOrnamentAssets(result.data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setDynamicOrnamentAssets([]);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingOrnamentAssets(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [templateDraft?.id]);

  const filteredTemplates = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items.filter((template) => {
      const matchesCategory =
        activeCategory === "Semua" || template.category === activeCategory;
      const matchesStatus = statusFilter === "all" || template.status === statusFilter;
      const matchesQuery =
        !normalizedQuery ||
        template.name.toLowerCase().includes(normalizedQuery) ||
        template.id.toLowerCase().includes(normalizedQuery) ||
        template.category.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesStatus && matchesQuery;
    });
  }, [activeCategory, items, query, statusFilter]);

  const counts = useMemo(
    () => ({
      total: items.length,
      active: items.filter((template) => template.status === "active").length,
      hidden: items.filter((template) => template.status === "hidden").length,
    }),
    [items],
  );

  const parsedDesignConfig = useMemo(() => {
    try {
      return normalizeDesignConfig(designConfigText.trim() ? JSON.parse(designConfigText) : {});
    } catch {
      return null;
    }
  }, [designConfigText]);

  const designSectionNames = useMemo(() => {
    const names = Array.from(
      new Set([
        ...Object.keys(parsedDesignConfig?.ornaments || {}),
        ...Object.keys(parsedDesignConfig?.sections || {}),
      ]),
    );
    return names.length > 0 ? names : ["home"];
  }, [parsedDesignConfig]);

  const activeOrnaments = parsedDesignConfig?.ornaments?.[activeDesignSection] || [];
  const previewOrnaments = useMemo(
    () => getSectionOrnaments(parsedDesignConfig || {}, activeDesignSection),
    [parsedDesignConfig, activeDesignSection],
  );
  const selectedOrnament =
    activeOrnaments[selectedOrnamentIndex] || activeOrnaments[0] || null;
  const activePreviewViewport =
    templatePreviewViewports[previewViewport] || templatePreviewViewports.mobile;
  const validationWarnings = useMemo(() => {
    if (!templateDraft || !parsedDesignConfig) {
      return [];
    }

    const warnings = [];
    const presetSections = templateSectionPresets[templateDraft.id] || [];
    const animatedOrnaments = activeOrnaments.filter(
      (ornament) =>
        ornament.animation && ornament.animation !== "none" ||
        ornament.entrance && ornament.entrance !== "none",
    );

    if (!presetSections.includes(activeDesignSection) && activeDesignSection !== "section") {
      warnings.push(
        `Section "${activeDesignSection}" belum termasuk preset template ini. Ornament mungkin tidak tampil di template publik.`,
      );
    }

    if (activeOrnaments.length > 12) {
      warnings.push(
        `Section "${activeDesignSection}" punya ${activeOrnaments.length} ornament. Pertimbangkan kurangi ke 12 atau kurang agar mobile tetap ringan.`,
      );
    }

    if (animatedOrnaments.length > 5) {
      warnings.push(
        `Section "${activeDesignSection}" punya ${animatedOrnaments.length} ornament bergerak. Batasi sekitar 5 agar animasi tetap halus.`,
      );
    }

    activeOrnaments.forEach((ornament, index) => {
      const label = ornament.id || `Ornament ${index + 1}`;
      const opacity = Number(ornament.opacity ?? 1);
      const width = parseOrnamentSize(ornament.width);

      if (!ornament.src) {
        warnings.push(`${label}: SRC masih kosong, ornament tidak akan tampil.`);
      }

      if (!Number.isFinite(opacity) || opacity < 0 || opacity > 1) {
        warnings.push(`${label}: opacity sebaiknya di antara 0 dan 1.`);
      }

      if (width > 860) {
        warnings.push(`${label}: width ${width}px cukup besar untuk canvas mobile. Cek lagi di Mobile 430.`);
      }
    });

    if (uploadValidationWarning) {
      warnings.push(uploadValidationWarning);
    }

    return warnings;
  }, [
    activeDesignSection,
    activeOrnaments,
    parsedDesignConfig,
    templateDraft,
    uploadValidationWarning,
  ]);
  const countdownWidgetConfig = {
    enabled: true,
    eventIndex: 0,
    variant: "cards",
    completeText: "Acara sedang berlangsung",
    ...(parsedDesignConfig?.widgets?.countdown || {}),
  };
  const eventWidgetConfig = {
    enabled: true,
    variant: "cards",
    showMaps: true,
    showIcon: true,
    ...(parsedDesignConfig?.widgets?.events || {}),
  };
  const storyWidgetConfig = {
    enabled: true,
    variant: "card",
    animation: "fade-up",
    ...(parsedDesignConfig?.widgets?.story || {}),
  };
  const galleryWidgetConfig = {
    enabled: true,
    variant: "grid",
    limit: 6,
    includeCover: false,
    ...(parsedDesignConfig?.widgets?.gallery || {}),
  };
  const coverSectionConfig = getCoverSectionConfig(parsedDesignConfig || {});
  const openingRevealWidgetConfig = getOpeningRevealConfig(parsedDesignConfig || {});
  const coupleSectionConfig = getCoupleSectionConfig(parsedDesignConfig || {});
  const globalSectionStyleConfig = getSectionStyleConfig(parsedDesignConfig || {}, "global");
  const activeSectionStyleConfig = getSectionStyleConfig(
    parsedDesignConfig || {},
    activeDesignSection,
  );
  const sectionAnimationConfig = {
    enabled: false,
    preset: "fade-sequence",
    entrancePreset: "fade-in",
    loopPreset: "none",
    entranceDelay: 0,
    loopDelay: 0,
    staggerStep: 0.15,
    ...(parsedDesignConfig?.animations?.sections?.[activeDesignSection] || {}),
  };
  const activeTemplatePreset =
    templateStylePresets.find((preset) => preset.id === selectedTemplatePreset) ||
    templateStylePresets[0];
  const selectedBadgeOption = templateBadgeOptions.includes(templateDraft?.badge)
    ? templateDraft?.badge
    : "Custom";
  const previewFocusSection = useMemo(
    () => mapDesignSectionToPreviewSection(activeDesignSection),
    [activeDesignSection],
  );
  const templatePreviewSrc = useMemo(() => {
    const previewTemplateId = templateDraft?.id || sampleInvitation.templateId;
    return `/preview?templateId=${encodeURIComponent(previewTemplateId)}&editorPreview=1&focusSection=${encodeURIComponent(previewFocusSection)}&previewTick=${templatePreviewTick}`;
  }, [previewFocusSection, templateDraft?.id, templatePreviewTick]);

  useEffect(() => {
    if (!templateDraft) {
      return;
    }

    try {
      const previewSnapshot = {
        id: templateDraft.id,
        image: templateDraft.image,
        designConfig: parsedDesignConfig || {},
      };
      window.sessionStorage.setItem(
        "nusa-invite:editor-preview-template",
        JSON.stringify(previewSnapshot),
      );
    } catch {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setTemplatePreviewTick((current) => current + 1);
    }, 120);

    return () => window.clearTimeout(timeoutId);
  }, [parsedDesignConfig, templateDraft]);

  const openEditorPreview = () => {
    if (!templateDraft) {
      return;
    }

    let nextConfig = {};
    try {
      nextConfig = normalizeDesignConfig(
        designConfigText.trim() ? JSON.parse(designConfigText) : {},
      );
    } catch {
      setManagerMessage("Design config JSON belum valid.");
      return;
    }

    try {
      const previewSnapshot = {
        id: templateDraft.id,
        image: templateDraft.image,
        designConfig: nextConfig,
      };
      window.sessionStorage.setItem(
        "nusa-invite:editor-preview-template",
        JSON.stringify(previewSnapshot),
      );
    } catch {
      setManagerMessage("Gagal menyiapkan editor preview.");
      return;
    }

    const previewUrl = `/preview?templateId=${encodeURIComponent(templateDraft.id)}&editorPreview=1`;
    window.open(previewUrl, "_blank", "noopener,noreferrer");
  };

  const writeDesignConfig = (nextConfig) => {
    setDesignConfigText(JSON.stringify(nextConfig, null, 2));
    setManagerMessage("");
  };

  const ensurePresetSections = (templateId, config = {}) => {
    const presetSections = templateSectionPresets[templateId] || standardTemplateSections;
    const normalizedConfig = normalizeDesignConfig(config);
    const currentOrnaments = normalizedConfig.ornaments || {};
    const currentSections = normalizedConfig.sections || {};

    return {
      ...normalizedConfig,
      ornaments: presetSections.reduce(
        (ornaments, section) => ({
          ...ornaments,
          [section]: currentOrnaments[section] || [],
        }),
        {},
      ),
      sections: presetSections.reduce(
        (sections, section) => ({
          ...sections,
          [section]: currentSections[section] || {},
        }),
        {},
      ),
    };
  };

  const updateOrnament = (field, value) => {
    if (!parsedDesignConfig || !selectedOrnament) {
      return;
    }

    const ornaments = {
      ...(parsedDesignConfig.ornaments || {}),
      [activeDesignSection]: [...activeOrnaments],
    };
    const index = Math.min(selectedOrnamentIndex, ornaments[activeDesignSection].length - 1);
    ornaments[activeDesignSection][index] = {
      ...ornaments[activeDesignSection][index],
      [field]: value,
    };

    writeDesignConfig({
      ...parsedDesignConfig,
      ornaments,
    });
  };

  const updateCountdownWidget = (field, value) => {
    if (!parsedDesignConfig) {
      return;
    }

    writeDesignConfig({
      ...parsedDesignConfig,
      widgets: {
        ...(parsedDesignConfig.widgets || {}),
        countdown: {
          ...countdownWidgetConfig,
          [field]: value,
        },
      },
    });
  };

  const updateEventWidget = (field, value) => {
    if (!parsedDesignConfig) {
      return;
    }

    writeDesignConfig({
      ...parsedDesignConfig,
      widgets: {
        ...(parsedDesignConfig.widgets || {}),
        events: {
          ...eventWidgetConfig,
          [field]: value,
        },
      },
    });
  };

  const updateStoryWidget = (field, value) => {
    if (!parsedDesignConfig) {
      return;
    }

    writeDesignConfig({
      ...parsedDesignConfig,
      widgets: {
        ...(parsedDesignConfig.widgets || {}),
        story: {
          ...storyWidgetConfig,
          [field]: value,
        },
      },
    });
  };

  const updateGalleryWidget = (field, value) => {
    if (!parsedDesignConfig) {
      return;
    }

    writeDesignConfig({
      ...parsedDesignConfig,
      widgets: {
        ...(parsedDesignConfig.widgets || {}),
        gallery: {
          ...galleryWidgetConfig,
          [field]: value,
        },
      },
    });
  };

  const updateOpeningRevealWidget = (field, value) => {
    if (!parsedDesignConfig) {
      return;
    }

    writeDesignConfig({
      ...parsedDesignConfig,
      widgets: {
        ...(parsedDesignConfig.widgets || {}),
        openingReveal: {
          ...openingRevealWidgetConfig,
          [field]: value,
        },
      },
    });
  };

  const updateOpeningRevealImage = async (field, file) => {
    if (!file || !parsedDesignConfig) {
      return;
    }

    const previewUrl = await readFileAsDataUrl(file);
    updateOpeningRevealWidget(field, previewUrl);
  };

  const updateCoverBackgroundImage = async (file) => {
    if (!file || !parsedDesignConfig) {
      return;
    }

    const previewUrl = await readFileAsDataUrl(file);
    updateTemplateSectionConfig("home", "backgroundImage", previewUrl);
  };

  const updateTemplateSectionConfig = (section, field, value) => {
    if (!parsedDesignConfig) {
      return;
    }

    writeDesignConfig({
      ...parsedDesignConfig,
      sections: {
        ...(parsedDesignConfig.sections || {}),
        [section]: {
          ...(parsedDesignConfig.sections?.[section] || {}),
          [field]: value,
        },
      },
    });
  };

  const updateGlobalSectionStyle = (field, value) => {
    updateTemplateSectionConfig("global", field, value);
  };

  const toggleSectionOverride = (section, enabled) => {
    updateTemplateSectionConfig(section, "useGlobal", !enabled);
  };

  const updateSectionAnimation = (field, value) => {
    if (!parsedDesignConfig) {
      return;
    }

    writeDesignConfig({
      ...parsedDesignConfig,
      animations: {
        ...(parsedDesignConfig.animations || {}),
        sections: {
          ...(parsedDesignConfig.animations?.sections || {}),
          [activeDesignSection]: {
            ...sectionAnimationConfig,
            [field]: value,
          },
        },
      },
    });
  };

  const applySectionAnimationPreset = (presetId) => {
    const preset =
      sectionAnimationPresets.find((item) => item.id === presetId) ||
      sectionAnimationPresets[0];

    if (!parsedDesignConfig || !preset) {
      return;
    }

    writeDesignConfig({
      ...parsedDesignConfig,
      animations: {
        ...(parsedDesignConfig.animations || {}),
        sections: {
          ...(parsedDesignConfig.animations?.sections || {}),
          [activeDesignSection]: {
            ...sectionAnimationConfig,
            enabled: true,
            preset: preset.id,
            entrancePreset: preset.entrancePreset,
            loopPreset: preset.loopPreset,
            staggerStep: preset.staggerStep,
          },
        },
      },
    });
  };

  const applyTemplateStylePreset = (scope = "template") => {
    if (!parsedDesignConfig || !activeTemplatePreset) {
      return;
    }

    const targetSections =
      scope === "section" ? [activeDesignSection] : standardTemplateSections;
    const nextSections = { ...(parsedDesignConfig.sections || {}) };
    const nextAnimations = {
      ...(parsedDesignConfig.animations || {}),
      sections: {
        ...(parsedDesignConfig.animations?.sections || {}),
      },
    };

    if (scope === "template") {
      nextSections.global = {
        ...(nextSections.global || {}),
        ...activeTemplatePreset.sectionStyle,
      };
    }

    targetSections.forEach((section) => {
      nextSections[section] = {
        ...(nextSections[section] || {}),
        ...activeTemplatePreset.sectionStyle,
        useGlobal: false,
        ...(section === "home" ? activeTemplatePreset.cover : {}),
      };
      nextAnimations.sections[section] = {
        ...(nextAnimations.sections[section] || {}),
        ...activeTemplatePreset.animation,
      };
    });

    writeDesignConfig({
      ...parsedDesignConfig,
      preset: activeTemplatePreset.id,
      sections: nextSections,
      widgets: {
        ...(parsedDesignConfig.widgets || {}),
        openingReveal: {
          ...openingRevealWidgetConfig,
          ...(activeTemplatePreset.widgets.openingReveal || {}),
        },
        countdown: {
          ...countdownWidgetConfig,
          ...(activeTemplatePreset.widgets.countdown || {}),
        },
        events: {
          ...eventWidgetConfig,
          ...(activeTemplatePreset.widgets.events || {}),
        },
        story: {
          ...storyWidgetConfig,
          ...(activeTemplatePreset.widgets.story || {}),
        },
        gallery: {
          ...galleryWidgetConfig,
          ...(activeTemplatePreset.widgets.gallery || {}),
        },
      },
      animations: nextAnimations,
    });
    setManagerMessage(
      scope === "section"
        ? `${activeTemplatePreset.label} diterapkan ke section ${activeDesignSection}.`
        : `${activeTemplatePreset.label} diterapkan ke template.`,
    );
  };

  const addOrnament = () => {
    const baseConfig = parsedDesignConfig || {};
    const section = activeDesignSection || "home";
    const nextOrnament = {
      id: `ornament-${Date.now()}`,
      src: "/assets/blue-watercolor-frame.svg",
      slot: "top-left",
      width: 160,
      height: "",
      x: 0,
      y: 0,
      rotate: 0,
      opacity: 1,
      zIndex: 1,
      objectFit: "contain",
      mirror: false,
      entrance: "fade-in",
      entranceDuration: 0.8,
      entranceDelay: 0,
      animation: "none",
      duration: 6,
      delay: 0,
    };
    const sectionOrnaments = [...(baseConfig.ornaments?.[section] || []), nextOrnament];

    writeDesignConfig({
      ...baseConfig,
      ornaments: {
        ...(baseConfig.ornaments || {}),
        [section]: sectionOrnaments,
      },
    });
    setSelectedOrnamentIndex(sectionOrnaments.length - 1);
  };

  const removeOrnament = () => {
    if (!parsedDesignConfig || !activeOrnaments.length) {
      return;
    }

    const nextOrnaments = activeOrnaments.filter(
      (_, index) => index !== selectedOrnamentIndex,
    );

    writeDesignConfig({
      ...parsedDesignConfig,
      ornaments: {
        ...(parsedDesignConfig.ornaments || {}),
        [activeDesignSection]: nextOrnaments,
      },
    });
    setSelectedOrnamentIndex(0);
  };

  const reorderSelectedOrnament = (mode) => {
    if (!parsedDesignConfig || !selectedOrnament || activeOrnaments.length < 2) {
      return;
    }

    const currentIndex = activeOrnaments.findIndex(
      (ornament, index) =>
        index === selectedOrnamentIndex || ornament.id === selectedOrnament.id,
    );

    if (currentIndex < 0) {
      return;
    }

    let nextIndex = currentIndex;
    if (mode === "up") {
      nextIndex = Math.min(activeOrnaments.length - 1, currentIndex + 1);
    }
    if (mode === "down") {
      nextIndex = Math.max(0, currentIndex - 1);
    }
    if (mode === "front") {
      nextIndex = activeOrnaments.length - 1;
    }
    if (mode === "back") {
      nextIndex = 0;
    }

    if (nextIndex === currentIndex) {
      return;
    }

    const nextOrnaments = [...activeOrnaments];
    const [movedOrnament] = nextOrnaments.splice(currentIndex, 1);
    nextOrnaments.splice(nextIndex, 0, movedOrnament);

    const normalizedOrnaments = nextOrnaments.map((ornament, index) => ({
      ...ornament,
      zIndex: index + 1,
    }));

    writeDesignConfig({
      ...parsedDesignConfig,
      ornaments: {
        ...(parsedDesignConfig.ornaments || {}),
        [activeDesignSection]: normalizedOrnaments,
      },
    });
    setSelectedOrnamentIndex(nextIndex);
  };

  const duplicateOrnament = () => {
    if (!parsedDesignConfig || !selectedOrnament) {
      return;
    }

    const section = activeDesignSection || "home";
    const nextOrnament = {
      ...selectedOrnament,
      id: `${selectedOrnament.id || "ornament"}-copy-${Date.now()}`,
      x: Number(selectedOrnament.x || 0) + 12,
      y: Number(selectedOrnament.y || 0) + 12,
    };
    const nextOrnaments = [...activeOrnaments, nextOrnament];

    writeDesignConfig({
      ...parsedDesignConfig,
      ornaments: {
        ...(parsedDesignConfig.ornaments || {}),
        [section]: nextOrnaments,
      },
    });
    setSelectedOrnamentIndex(nextOrnaments.length - 1);
  };

  const updateSelectedOrnamentFile = async (file) => {
    if (!file || !templateDraft?.id || !selectedOrnament) {
      return;
    }

    if (
      ["image/png", "image/webp"].includes(file.type) &&
      file.size > ornamentMaxRasterFileSize
    ) {
      setUploadValidationWarning(
        `${file.name} berukuran ${(file.size / 1024 / 1024).toFixed(2)} MB. Untuk ornament PNG/WebP, usahakan maksimal 1 MB atau pakai SVG/WebP terkompres.`,
      );
    } else {
      setUploadValidationWarning("");
    }

    const previewUrl = await readFileAsDataUrl(file);
    updateOrnament("src", previewUrl);
    setIsUploadingOrnament(true);
    setManagerMessage("");

    try {
      const formData = new FormData();
      formData.append("templateId", templateDraft.id);
      formData.append("section", activeDesignSection || "home");
      formData.append("ornamentId", selectedOrnament.id || "ornament");
      formData.append("file", file);

      const response = await fetch("/api/templates/ornaments/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal upload ornament");
      }

      const assetUrl = result.source === "supabase" ? result.data.url : previewUrl;

      updateOrnament("src", assetUrl);
      setDynamicOrnamentAssets((currentAssets) => {
        const nextAsset = {
          id: result.data.storagePath || `local-${Date.now()}`,
          name: file.name?.replace(/\.[^.]+$/, "") || `${selectedOrnament.id || "Ornament"} Upload`,
          src: assetUrl,
          storagePath: result.data.storagePath || "",
          source: result.source,
        };

        return [
          nextAsset,
          ...currentAssets.filter((asset) => asset.id !== nextAsset.id),
        ];
      });
      setManagerMessage(
        result.source === "supabase"
          ? "Ornament berhasil diupload ke Supabase Storage."
          : "Ornament preview lokal aktif. Supabase belum dikonfigurasi.",
      );
    } catch (error) {
      setManagerMessage(error.message || "Gagal upload ornament.");
    } finally {
      setIsUploadingOrnament(false);
    }
  };

  const applyOrnamentAsset = (asset) => {
    if (!selectedOrnament) {
      return;
    }

    updateOrnament("src", asset.src);
    setManagerMessage(`${asset.name} dipakai untuk ornament aktif.`);
  };

  const deleteDynamicOrnamentAsset = async (asset) => {
    if (!asset.storagePath) {
      setDynamicOrnamentAssets((currentAssets) =>
        currentAssets.filter((item) => item.id !== asset.id),
      );
      setManagerMessage("Asset lokal dihapus dari library sementara.");
      return;
    }

    setDynamicOrnamentAssets((currentAssets) =>
      currentAssets.filter((item) => item.storagePath !== asset.storagePath),
    );
    setManagerMessage("Menghapus asset ornament...");

    try {
      const response = await fetch("/api/templates/ornaments/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storagePath: asset.storagePath }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menghapus asset");
      }

      setManagerMessage(
        result.source === "supabase"
          ? "Asset ornament berhasil dihapus dari Storage."
          : "Asset ornament dihapus dari library sementara.",
      );
    } catch (error) {
      setDynamicOrnamentAssets((currentAssets) => [asset, ...currentAssets]);
      setManagerMessage(error.message || "Gagal menghapus asset ornament.");
    }
  };

  const persistTemplate = async (template) => {
    const response = await fetch("/api/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(template),
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Gagal menyimpan template");
    }

    return result;
  };

  const deleteTemplate = async (template) => {
    if (!template?.id) {
      return;
    }

    const confirmed = window.confirm(`Hapus template "${template.name}" dari katalog?`);
    if (!confirmed) {
      return;
    }

    const previousItems = items;

    setItems((currentItems) => currentItems.filter((item) => item.id !== template.id));
    if (editingTemplateId === template.id) {
      cancelEditTemplate();
    }
    setManagerMessage("Menghapus template...");

    try {
      const response = await fetch("/api/templates", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: template.id }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menghapus template");
      }

      if (result.source !== "supabase") {
        addStoredDeletedTemplateId(template.id);
      }

      setTemplateSource(result.source || templateSource);
      setManagerMessage(
        result.source === "supabase"
          ? "Template berhasil dihapus dari Supabase."
          : "Template dihapus dari katalog lokal.",
      );
    } catch (error) {
      setItems(previousItems);
      setManagerMessage(error.message || "Gagal menghapus template.");
    }
  };

  const toggleTemplateStatus = async (templateId) => {
    const targetTemplate = items.find((template) => template.id === templateId);
    if (!targetTemplate) {
      return;
    }

    const nextTemplate = {
      ...targetTemplate,
      status: targetTemplate.status === "active" ? "hidden" : "active",
    };

    setItems((currentItems) =>
      currentItems.map((template) =>
        template.id === templateId ? nextTemplate : template,
      ),
    );

    try {
      const result = await persistTemplate(nextTemplate);
      setTemplateSource(result.source || templateSource);
      setManagerMessage(
        result.source === "supabase"
          ? "Status template tersimpan ke Supabase."
          : "Status template tersimpan sementara. Supabase belum dikonfigurasi.",
      );
    } catch (error) {
      setManagerMessage(error.message);
    }
  };

  const startEditTemplate = (template) => {
    const designConfig = ensurePresetSections(template.id, template.designConfig || {});
    const firstSection = templateSectionPresets[template.id]?.[0] || Object.keys(designConfig.ornaments || {})[0] || "home";

    setEditingTemplateId(template.id);
    setTemplateDraft({ ...template, designConfig });
    setDesignConfigText(JSON.stringify(designConfig, null, 2));
    setActiveDesignSection(firstSection);
    setSelectedOrnamentIndex(0);
    setEditorStep(1);
    setIsAdvancedOpen(false);
    setManagerMessage("");
  };

  const startCreateTemplate = () => {
    const baseId = "template-baru";
    const reservedIds = new Set([
      ...items.map((template) => template.id),
      ...getStoredTemplateOverrides().map((template) => template.id),
      ...getStoredDeletedTemplateIds(),
    ]);
    let nextId = baseId;
    let counter = 2;

    while (reservedIds.has(nextId)) {
      nextId = `${baseId}-${counter}`;
      counter += 1;
    }

    const designConfig = ensurePresetSections(nextId, {});
    const nextTemplate = {
      id: nextId,
      name: "Template Baru",
      category: "Standard",
      price: "Rp 99.000",
      badge: "New",
      status: "hidden",
      description: "Template custom baru.",
      image: "/assets/backgrounds/soft-watercolor-cream.jpg",
      previewUrl: `/preview?templateId=${encodeURIComponent(nextId)}`,
      supportedFeatures: ["rsvp", "gift", "music", "guestName", "gallery", "story"],
      designConfig,
      sortOrder: items.length + 1,
    };

    setEditingTemplateId(null);
    setTemplateDraft(nextTemplate);
    setDesignConfigText(JSON.stringify(designConfig, null, 2));
    setActiveDesignSection("home");
    setSelectedOrnamentIndex(0);
    setEditorStep(1);
    setIsAdvancedOpen(false);
    setManagerMessage("Template baru dibuat sebagai draft. Simpan metadata untuk masuk katalog.");
  };

  const updateTemplateDraft = (field, value) => {
    setTemplateDraft((current) => {
      if (!current) {
        return current;
      }

      if (
        field === "name" &&
        !editingTemplateId &&
        (!current.id || current.id.startsWith("template-baru"))
      ) {
        const nextId = slugifyTemplateId(value);
        return {
          ...current,
          name: value,
          id: nextId,
          previewUrl: `/preview?templateId=${encodeURIComponent(nextId)}`,
        };
      }

      if (field === "id") {
        const nextId = slugifyTemplateId(value);
        return {
          ...current,
          id: nextId,
          previewUrl: `/preview?templateId=${encodeURIComponent(nextId)}`,
        };
      }

      return { ...current, [field]: value };
    });
    setManagerMessage("");
  };

  const updateTemplateThumbnail = async (file) => {
    if (!file) {
      return;
    }

    const previewUrl = await readFileAsDataUrl(file);
    updateTemplateDraft("image", previewUrl);

    if (!templateDraft?.id) {
      return;
    }

    setIsUploadingThumbnail(true);
    setManagerMessage("");

    try {
      const formData = new FormData();
      formData.append("templateId", templateDraft.id);
      formData.append("file", file);

      const response = await fetch("/api/templates/thumbnail", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal upload thumbnail");
      }

      if (result.source === "supabase" && result?.data?.url) {
        updateTemplateDraft("image", result.data.url);
      }
      setManagerMessage(
        result.source === "supabase"
          ? "Thumbnail berhasil diupload ke Supabase Storage."
          : "Thumbnail preview lokal aktif. Supabase belum dikonfigurasi.",
      );
    } catch (error) {
      setManagerMessage(error.message);
    } finally {
      setIsUploadingThumbnail(false);
    }
  };

  const cancelEditTemplate = () => {
    setEditingTemplateId(null);
    setTemplateDraft(null);
    setDesignConfigText("");
    setActiveDesignSection("home");
    setSelectedOrnamentIndex(0);
    setEditorStep(1);
    setIsAdvancedOpen(false);
    setManagerMessage("");
  };

  const saveTemplateDraft = async () => {
    if (!templateDraft) {
      return;
    }

    if (!templateDraft.id || !templateDraft.name || !templateDraft.category) {
      setManagerMessage("Template ID, nama, dan kategori wajib diisi.");
      return;
    }

    const duplicateTemplate = items.find(
      (template) => template.id === templateDraft.id && template.id !== editingTemplateId,
    );
    if (duplicateTemplate) {
      setManagerMessage(`Template ID "${templateDraft.id}" sudah dipakai.`);
      return;
    }

    let parsedDesignConfig = {};
    try {
      parsedDesignConfig = normalizeDesignConfig(
        designConfigText.trim() ? JSON.parse(designConfigText) : {},
      );
    } catch {
      setManagerMessage("Design config JSON belum valid.");
      return;
    }

    const draftToSave = {
      ...templateDraft,
      previewUrl:
        templateDraft.previewUrl ||
        `/preview?templateId=${encodeURIComponent(templateDraft.id)}`,
      designConfig: parsedDesignConfig,
    };

    setIsSavingTemplate(true);

    setItems((currentItems) => {
      if (editingTemplateId) {
        return currentItems.map((template) =>
          template.id === editingTemplateId ? { ...template, ...draftToSave } : template,
        );
      }

      return [draftToSave, ...currentItems.filter((template) => template.id !== draftToSave.id)];
    });

    try {
      const result = await persistTemplate(draftToSave);
      if (result.source !== "supabase") {
        upsertStoredTemplateOverride(draftToSave);
      }
      setItems((currentItems) => {
        const nextTemplate = { ...draftToSave, ...result.data };

        if (editingTemplateId) {
          return currentItems.map((template) =>
            template.id === editingTemplateId ? { ...template, ...nextTemplate } : template,
          );
        }

        return [
          nextTemplate,
          ...currentItems.filter((template) => template.id !== nextTemplate.id),
        ];
      });
      setTemplateSource(result.source || templateSource);
      setEditingTemplateId(null);
      setTemplateDraft(null);
      setDesignConfigText("");
      setActiveDesignSection("home");
      setSelectedOrnamentIndex(0);
      setEditorStep(1);
      setIsAdvancedOpen(false);
      setManagerMessage(
        result.source === "supabase"
          ? "Template tersimpan ke Supabase."
          : "Template tersimpan ke katalog lokal. Supabase belum dikonfigurasi.",
      );
    } catch (error) {
      setManagerMessage(error.message);
    } finally {
      setIsSavingTemplate(false);
    }
  };

  return (
    <motion.section
        variants={fadeUp}
        className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] p-6 shadow-xl shadow-[var(--color-primary)]/8"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-[var(--color-primary)]">Template Manager</h2>
            <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
              {templateDraft
                ? "Edit template dengan workflow terfokus."
                : "Kelola katalog template, status, preview, dan metadata penjualan."}
            </p>
            <p className="mt-2 text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent)]">
              Source: {templateSource}
            </p>
          </div>
          {templateDraft ? (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={openEditorPreview}
                className="rounded-2xl border border-[var(--color-accent-pale)] bg-white px-5 py-3 text-base font-black text-[var(--color-primary)]"
              >
                Preview
              </button>
              <button
                type="button"
                onClick={saveTemplateDraft}
                disabled={isSavingTemplate}
                className="rounded-2xl bg-[var(--color-accent)] px-5 py-3 text-base font-black text-[var(--color-primary)] disabled:opacity-60"
              >
                {isSavingTemplate ? "Menyimpan..." : "Simpan"}
              </button>
              <button
                type="button"
                onClick={cancelEditTemplate}
                className="rounded-2xl border border-[var(--color-accent-pale)] bg-white px-5 py-3 text-base font-black text-[var(--color-primary)]"
              >
                Katalog
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={startCreateTemplate}
              className="rounded-2xl bg-[var(--color-accent)] px-5 py-3 text-base font-black text-[var(--color-primary)]"
            >
              Tambah Template
            </button>
          )}
        </div>

        {!templateDraft ? (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-4">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-accent)]">
              Total Template
            </p>
            <p className="mt-2 text-3xl font-black text-[var(--color-primary)]">{counts.total}</p>
          </div>
          <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-4">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-accent)]">
              Active
            </p>
            <p className="mt-2 text-3xl font-black text-[var(--color-primary)]">{counts.active}</p>
          </div>
          <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-4">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-accent)]">
              Hidden
            </p>
            <p className="mt-2 text-3xl font-black text-[var(--color-primary)]">{counts.hidden}</p>
          </div>
        </div>
        ) : null}

        {!templateDraft ? (
        <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_220px_180px]">
          <Field label="Search Template">
            <TextInput
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari nama, kategori, atau template ID"
            />
          </Field>
          <Field label="Kategori">
            <SelectInput
              value={activeCategory}
              onChange={(event) => setActiveCategory(event.target.value)}
            >
              {templateCategories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </SelectInput>
          </Field>
          <Field label="Status">
            <SelectInput
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">Semua</option>
              <option value="active">Active</option>
              <option value="hidden">Hidden</option>
            </SelectInput>
          </Field>
        </div>
        ) : null}

        {managerMessage ? (
          <p className="mt-5 rounded-[8px] bg-[var(--color-section-soft)] px-4 py-3 text-sm font-black text-[var(--color-primary)]">
            {managerMessage}
          </p>
        ) : null}

        {templateDraft ? (
          <div className="mt-6 rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-5 shadow-lg shadow-[var(--color-primary)]/8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
                  Edit Metadata
                </p>
                <h3 className="mt-2 text-2xl font-black text-[var(--color-primary)]">
                  {editingTemplateId ? templateDraft.name : "Template Baru"}
                </h3>
                <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">
                  {templateDraft.id}
                </p>
              </div>
              <img
                src={templateDraft.image}
                alt={`Preview ${templateDraft.name}`}
                className="aspect-[4/5] w-28 rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] object-cover"
              />
            </div>

            <div className="mt-5 rounded-[8px] border border-[var(--color-accent-pale)] bg-white/95 p-3 shadow-lg shadow-[var(--color-primary)]/8 backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent)]">
                  Step {editorStep} / {editorSteps.length}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditorStep((current) => Math.max(1, current - 1))}
                    disabled={editorStep === 1}
                    className="rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-1.5 text-xs font-black text-[var(--color-primary)] disabled:opacity-40"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setEditorStep((current) => Math.min(editorSteps.length, current + 1))
                    }
                    disabled={editorStep === editorSteps.length}
                    className="rounded-xl bg-[var(--color-primary)] px-3 py-1.5 text-xs font-black text-white disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
              <div className="mt-3 h-2 rounded-full bg-[var(--color-bg)]">
                <div
                  className="h-2 rounded-full bg-[var(--color-accent)] transition-all duration-300"
                  style={{ width: `${(editorStep / editorSteps.length) * 100}%` }}
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {editorSteps.map((step) => (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setEditorStep(step.id)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-black transition-colors ${
                      editorStep === step.id
                        ? "bg-[var(--color-primary)] text-white"
                        : "border border-[var(--color-accent-pale)] bg-white text-[var(--color-primary)]"
                    }`}
                  >
                    {step.label}
                  </button>
                ))}
              </div>
            </div>

            <div id="template-basic" className={`mt-5 scroll-mt-24 ${editorStep === 1 ? "" : "hidden"}`}>
              <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-5">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
                    Basic
                  </p>
                  <h4 className="text-2xl font-black text-[var(--color-primary)]">
                    {editingTemplateId ? "Edit Template" : "Buat Template Baru"}
                  </h4>
                </div>
                <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_300px]">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Template ID">
                      <TextInput
                        value={templateDraft.id}
                        onChange={(event) => updateTemplateDraft("id", event.target.value)}
                        disabled={Boolean(editingTemplateId)}
                      />
                    </Field>
                    <Field label="Nama Template">
                      <TextInput
                        value={templateDraft.name}
                        onChange={(event) => updateTemplateDraft("name", event.target.value)}
                      />
                    </Field>
                    <Field label="Kategori">
                      <SelectInput
                        value={templateDraft.category}
                        onChange={(event) => updateTemplateDraft("category", event.target.value)}
                      >
                        {templateCategoryOptions.map((category) => (
                          <option key={category}>{category}</option>
                        ))}
                      </SelectInput>
                    </Field>
                    <Field label="Harga">
                      <TextInput
                        value={templateDraft.price}
                        onChange={(event) => updateTemplateDraft("price", event.target.value)}
                      />
                    </Field>
                    <Field label="Badge">
                      <SelectInput
                        value={selectedBadgeOption}
                        onChange={(event) => {
                          const nextValue = event.target.value;
                          updateTemplateDraft("badge", nextValue === "Custom" ? "" : nextValue);
                        }}
                      >
                        {templateBadgeOptions.map((badgeOption) => (
                          <option key={badgeOption} value={badgeOption}>
                            {badgeOption}
                          </option>
                        ))}
                      </SelectInput>
                    </Field>
                    <Field label="Status">
                      <SelectInput
                        value={templateDraft.status}
                        onChange={(event) => updateTemplateDraft("status", event.target.value)}
                      >
                        <option value="active">Active</option>
                        <option value="hidden">Hidden</option>
                      </SelectInput>
                    </Field>
                    <div className="md:col-span-2">
                      <Field label="Preview URL">
                        <TextInput
                          value={templateDraft.previewUrl || ""}
                          onChange={(event) => updateTemplateDraft("previewUrl", event.target.value)}
                        />
                      </Field>
                    </div>
                    <div className="md:col-span-2">
                      <Field label="Deskripsi">
                        <textarea
                          value={templateDraft.description}
                          onChange={(event) => updateTemplateDraft("description", event.target.value)}
                          rows={4}
                          className="w-full rounded-2xl border border-[var(--color-accent-pale)] bg-white px-4 py-3 text-base font-bold leading-7 text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                        />
                      </Field>
                    </div>
                    {selectedBadgeOption === "Custom" ? (
                      <div className="md:col-span-2">
                        <Field label="Badge Custom">
                          <TextInput
                            value={templateDraft.badge || ""}
                            onChange={(event) => updateTemplateDraft("badge", event.target.value)}
                            placeholder="Contoh: Editor Pick"
                          />
                        </Field>
                      </div>
                    ) : null}
                  </div>
                  <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-4">
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-text)]">
                      Thumbnail
                    </p>
                    <img
                      src={templateDraft.image}
                      alt={`Preview ${templateDraft.name}`}
                      className="mt-3 aspect-[4/5] w-full rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] object-cover"
                    />
                    <div className="mt-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => updateTemplateThumbnail(event.target.files?.[0])}
                        className="w-full rounded-2xl border border-[var(--color-accent-pale)] bg-white px-4 py-3 text-sm font-bold text-[var(--color-primary)] outline-none file:mr-4 file:rounded-xl file:border-0 file:bg-[var(--color-primary)] file:px-4 file:py-2 file:text-sm file:font-black file:text-white"
                      />
                      {isUploadingThumbnail ? (
                        <p className="mt-2 text-sm font-black text-[var(--color-accent)]">
                          Mengupload thumbnail...
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div id="template-preset" className={`scroll-mt-24 md:col-span-2 ${editorStep === 2 ? "" : "hidden"}`}>
                <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-5">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
                        Preset System
                      </p>
                      <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
                        Apply style cepat untuk entrance, widget, typography, background, dan reveal.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => applyTemplateStylePreset("template")}
                        className="rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-black text-white"
                      >
                        Apply Template
                      </button>
                      <button
                        type="button"
                        onClick={() => applyTemplateStylePreset("section")}
                        className="rounded-xl border border-[var(--color-accent-pale)] bg-white px-4 py-2 text-sm font-black text-[var(--color-primary)]"
                      >
                        Apply Section
                      </button>
                    </div>
                  </div>
                  <div className="mt-5 grid gap-4 md:grid-cols-[260px_1fr]">
                    <label className="block">
                      <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                        Preset
                      </span>
                      <select
                        value={selectedTemplatePreset}
                        onChange={(event) => setSelectedTemplatePreset(event.target.value)}
                        className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                      >
                        {templateStylePresets.map((preset) => (
                          <option key={preset.id} value={preset.id}>
                            {preset.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-4">
                      <p className="text-base font-black text-[var(--color-primary)]">
                        {activeTemplatePreset.label}
                      </p>
                      <p className="mt-1 text-sm font-semibold leading-6 text-[var(--color-text)]">
                        {activeTemplatePreset.description}
                      </p>
                      <div className="mt-4 grid gap-3 md:grid-cols-[160px_1fr]">
                        <div
                          className="relative overflow-hidden rounded-[8px] border border-[var(--color-accent-pale)]"
                          style={{
                            backgroundColor: activeTemplatePreset.sectionStyle.backgroundColor || "#f8f5ef",
                          }}
                        >
                          {activeTemplatePreset.sectionStyle.backgroundImage ? (
                            <img
                              src={activeTemplatePreset.sectionStyle.backgroundImage}
                              alt=""
                              className="absolute inset-0 h-full w-full object-cover opacity-60"
                            />
                          ) : null}
                          <div className="relative z-10 p-3">
                            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[var(--color-primary)]">
                              Mini Preview
                            </p>
                            <p
                              className="mt-2 text-sm font-black"
                              style={{
                                color: activeTemplatePreset.sectionStyle.textColor || "#1f2937",
                              }}
                            >
                              {activeTemplatePreset.label}
                            </p>
                            <p className="mt-2 text-xs font-semibold text-[var(--color-text)]">
                              {activeTemplatePreset.widgets.gallery?.variant || "grid"} / {activeTemplatePreset.widgets.events?.variant || "cards"}
                            </p>
                          </div>
                        </div>
                        <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-3 text-xs font-semibold text-[var(--color-text)]">
                          Entrance: <strong>{activeTemplatePreset.sectionStyle.entranceAnimation}</strong><br />
                          Font: <strong>{activeTemplatePreset.sectionStyle.fontPreset}</strong><br />
                          Spacing: <strong>{activeTemplatePreset.sectionStyle.spacingPreset}</strong><br />
                          Opening: <strong>{activeTemplatePreset.widgets.openingReveal?.animation || "off"}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div id="template-cover" className={`scroll-mt-24 md:col-span-2 ${editorStep === 2 ? "" : "hidden"}`}>
                <div className="mb-5 rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-5">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
                        Section Style
                      </p>
                      <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
                        Atur style global dan override per section tanpa masuk ke editor ornament.
                      </p>
                    </div>
                    <label className="block min-w-[220px]">
                      <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                        Section
                      </span>
                      <select
                        value={activeDesignSection}
                        onChange={(event) => {
                          setActiveDesignSection(event.target.value);
                          setSelectedOrnamentIndex(0);
                        }}
                        className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                      >
                        {designSectionNames.map((sectionName) => (
                          <option key={sectionName}>{sectionName}</option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="mt-5 grid gap-5 lg:grid-cols-[300px_1fr]">
                    <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-4">
                      <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-text)]">
                        Global Style
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                        <MiniInput
                          label="Global BG"
                          value={globalSectionStyleConfig.backgroundColor}
                          onChange={(value) => updateGlobalSectionStyle("backgroundColor", value)}
                        />
                        <MiniInput
                          label="Global Text"
                          value={globalSectionStyleConfig.textColor}
                          onChange={(value) => updateGlobalSectionStyle("textColor", value)}
                        />
                      </div>
                    </div>

                    <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-text)]">
                            {activeDesignSection} Override
                          </p>
                          <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">
                            Aktifkan override kalau section ini perlu style berbeda dari global.
                          </p>
                        </div>
                        <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-[var(--color-bg)] px-3 py-2">
                          <input
                            type="checkbox"
                            checked={activeSectionStyleConfig.useGlobal === false}
                            onChange={(event) =>
                              toggleSectionOverride(activeDesignSection, event.target.checked)
                            }
                            className="h-4 w-4"
                          />
                          <span className="text-sm font-black text-[var(--color-primary)]">
                            Override
                          </span>
                        </label>
                      </div>

                      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        <MiniInput
                          label="BG Color"
                          value={activeSectionStyleConfig.backgroundColor}
                          onChange={(value) =>
                            updateTemplateSectionConfig(activeDesignSection, "backgroundColor", value)
                          }
                        />
                        <MiniInput
                          label="Text Color"
                          value={activeSectionStyleConfig.textColor}
                          onChange={(value) =>
                            updateTemplateSectionConfig(activeDesignSection, "textColor", value)
                          }
                        />
                        <MiniInput
                          label="Accent"
                          value={activeSectionStyleConfig.accentColor}
                          onChange={(value) =>
                            updateTemplateSectionConfig(activeDesignSection, "accentColor", value)
                          }
                        />
                        <MiniInput
                          label="BG Image"
                          value={activeSectionStyleConfig.backgroundImage}
                          onChange={(value) =>
                            updateTemplateSectionConfig(activeDesignSection, "backgroundImage", value)
                          }
                        />
                      </div>

                      <div className="mt-4 grid gap-3 md:grid-cols-3">
                        <label className="block">
                          <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                            Font Preset
                          </span>
                          <select
                            value={activeSectionStyleConfig.fontPreset}
                            onChange={(event) =>
                              updateTemplateSectionConfig(activeDesignSection, "fontPreset", event.target.value)
                            }
                            className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                          >
                            {sectionFontPresetOptions.map((preset) => (
                              <option key={preset} value={preset}>
                                {preset}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="block">
                          <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                            Spacing
                          </span>
                          <select
                            value={activeSectionStyleConfig.spacingPreset}
                            onChange={(event) =>
                              updateTemplateSectionConfig(activeDesignSection, "spacingPreset", event.target.value)
                            }
                            className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                          >
                            {sectionSpacingPresetOptions.map((preset) => (
                              <option key={preset} value={preset}>
                                {preset}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="block">
                          <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                            Entrance
                          </span>
                          <select
                            value={activeSectionStyleConfig.entranceAnimation}
                            onChange={(event) =>
                              updateTemplateSectionConfig(activeDesignSection, "entranceAnimation", event.target.value)
                            }
                            className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                          >
                            {sectionEntranceOptions.map((animation) => (
                              <option key={animation} value={animation}>
                                {animation}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-5">
                  <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
                    Cover Section
                  </p>
                  <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
                    Atur cover utama, foto, background, animasi konten, dan style nama tamu.
                  </p>
                  <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
                    <div className="grid gap-4 md:grid-cols-3">
                      <label className="mt-6 flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                        <input
                          type="checkbox"
                          checked={Boolean(coverSectionConfig.photoEnabled)}
                          onChange={(event) =>
                            updateTemplateSectionConfig("home", "photoEnabled", event.target.checked)
                          }
                          className="h-4 w-4"
                        />
                        <span className="text-sm font-black text-[var(--color-primary)]">
                          Foto aktif
                        </span>
                      </label>
                      <label className="block">
                        <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                          Layout
                        </span>
                        <select
                          value={coverSectionConfig.layout}
                          onChange={(event) =>
                            updateTemplateSectionConfig("home", "layout", event.target.value)
                          }
                          className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                        >
                          {coverLayoutOptions.map((layout) => (
                            <option key={layout} value={layout}>
                              {layout}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block">
                        <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                          Opening Animation
                        </span>
                        <select
                          value={coverSectionConfig.openingAnimation}
                          onChange={(event) =>
                            updateTemplateSectionConfig("home", "openingAnimation", event.target.value)
                          }
                          className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                        >
                          {coverOpeningAnimationOptions.map((animation) => (
                            <option key={animation} value={animation}>
                              {animation}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block">
                        <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                          Guest Block
                        </span>
                        <select
                          value={coverSectionConfig.guestBlockStyle}
                          onChange={(event) =>
                            updateTemplateSectionConfig("home", "guestBlockStyle", event.target.value)
                          }
                          className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                        >
                          {guestBlockStyleOptions.map((style) => (
                            <option key={style} value={style}>
                              {style}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block">
                        <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                          Background
                        </span>
                        <select
                          value={coverSectionConfig.backgroundMode || "color"}
                          onChange={(event) =>
                            updateTemplateSectionConfig("home", "backgroundMode", event.target.value)
                          }
                          className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                        >
                          {coverBackgroundModeOptions.map((mode) => (
                            <option key={mode} value={mode}>
                              {mode}
                            </option>
                          ))}
                        </select>
                      </label>
                      {coverSectionConfig.backgroundMode === "image" ? (
                        <label className="block">
                          <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                            Background Image
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => updateCoverBackgroundImage(event.target.files?.[0])}
                            className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--color-primary)] file:px-3 file:py-2 file:text-sm file:font-black file:text-white focus:border-[var(--color-accent)]"
                          />
                        </label>
                      ) : (
                        <label className="block">
                          <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                            Background Color
                          </span>
                          <input
                            type="color"
                            value={coverSectionConfig.backgroundColor || "#fbf7ef"}
                            onChange={(event) =>
                              updateTemplateSectionConfig("home", "backgroundColor", event.target.value)
                            }
                            className="mt-2 h-11 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white p-1 outline-none focus:border-[var(--color-accent)]"
                          />
                        </label>
                      )}
                    </div>
                    <CoverSectionPreview config={coverSectionConfig} />
                  </div>
                </div>
              </div>
              <div id="template-couple" className={`scroll-mt-24 md:col-span-2 ${editorStep === 2 ? "" : "hidden"}`}>
                <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-5">
                  <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
                    Couple Section
                  </p>
                  <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
                    Atur foto mempelai, border foto, font, teks orang tua, dan tombol Instagram.
                  </p>
                  <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
                    <div className="grid gap-4 md:grid-cols-3">
                      <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                        <input
                          type="checkbox"
                          checked={Boolean(coupleSectionConfig.photoEnabled)}
                          onChange={(event) =>
                            updateTemplateSectionConfig("couple", "photoEnabled", event.target.checked)
                          }
                          className="h-4 w-4"
                        />
                        <span className="text-sm font-black text-[var(--color-primary)]">
                          Foto aktif
                        </span>
                      </label>
                      <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                        <input
                          type="checkbox"
                          checked={Boolean(coupleSectionConfig.borderEnabled)}
                          onChange={(event) =>
                            updateTemplateSectionConfig("couple", "borderEnabled", event.target.checked)
                          }
                          className="h-4 w-4"
                        />
                        <span className="text-sm font-black text-[var(--color-primary)]">
                          Border foto
                        </span>
                      </label>
                      <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                        <input
                          type="checkbox"
                          checked={Boolean(coupleSectionConfig.parentTextEnabled)}
                          onChange={(event) =>
                            updateTemplateSectionConfig("couple", "parentTextEnabled", event.target.checked)
                          }
                          className="h-4 w-4"
                        />
                        <span className="text-sm font-black text-[var(--color-primary)]">
                          Teks orang tua
                        </span>
                      </label>
                      <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                        <input
                          type="checkbox"
                          checked={Boolean(coupleSectionConfig.instagramEnabled)}
                          onChange={(event) =>
                            updateTemplateSectionConfig("couple", "instagramEnabled", event.target.checked)
                          }
                          className="h-4 w-4"
                        />
                        <span className="text-sm font-black text-[var(--color-primary)]">
                          Instagram
                        </span>
                      </label>
                      <label className="block">
                        <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                          Photo Style
                        </span>
                        <select
                          value={coupleSectionConfig.photoStyle}
                          onChange={(event) =>
                            updateTemplateSectionConfig("couple", "photoStyle", event.target.value)
                          }
                          className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                        >
                          {couplePhotoStyleOptions.map((style) => (
                            <option key={style} value={style}>
                              {style}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block">
                        <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                          Font Preset
                        </span>
                        <select
                          value={coupleSectionConfig.fontPreset}
                          onChange={(event) =>
                            updateTemplateSectionConfig("couple", "fontPreset", event.target.value)
                          }
                          className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                        >
                          {coupleFontPresetOptions.map((preset) => (
                            <option key={preset} value={preset}>
                              {preset}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <CoupleSectionPreview config={coupleSectionConfig} />
                  </div>
                </div>
              </div>
              <div id="template-opening-reveal" className={`scroll-mt-24 md:col-span-2 ${editorStep === 3 ? "" : "hidden"}`}>
                <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-5">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
                        Opening Reveal
                      </p>
                      <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
                        Overlay pembuka sebelum undangan tampil, berisi judul cover, nama tamu, dan tombol buka.
                      </p>
                    </div>
                    <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-4 py-3">
                      <input
                        type="checkbox"
                        checked={Boolean(openingRevealWidgetConfig.enabled)}
                        onChange={(event) => updateOpeningRevealWidget("enabled", event.target.checked)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm font-black text-[var(--color-primary)]">
                        Reveal aktif
                      </span>
                    </label>
                  </div>

                  <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
                    <div className="grid gap-4 md:grid-cols-3">
                      <label className="block">
                        <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                          Opening Animation
                        </span>
                        <select
                          value={openingRevealWidgetConfig.animation}
                          onChange={(event) => updateOpeningRevealWidget("animation", event.target.value)}
                          className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                        >
                          {openingRevealAnimationOptions.map((animation) => (
                            <option key={animation} value={animation}>
                              {animation}
                            </option>
                          ))}
                        </select>
                      </label>
                      <MiniInput
                        label="Button Text"
                        value={openingRevealWidgetConfig.buttonText}
                        onChange={(value) => updateOpeningRevealWidget("buttonText", value)}
                      />
                      <label className="mt-6 flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                        <input
                          type="checkbox"
                          checked={openingRevealWidgetConfig.coverImageEnabled !== false}
                          onChange={(event) =>
                            updateOpeningRevealWidget("coverImageEnabled", event.target.checked)
                          }
                          className="h-4 w-4"
                        />
                        <span className="text-sm font-black text-[var(--color-primary)]">
                          Cover image aktif
                        </span>
                      </label>
                      <label className="block">
                        <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                          Background
                        </span>
                        <select
                          value={openingRevealWidgetConfig.backgroundMode}
                          onChange={(event) =>
                            updateOpeningRevealWidget("backgroundMode", event.target.value)
                          }
                          className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                        >
                          {openingRevealBackgroundModeOptions.map((mode) => (
                            <option key={mode} value={mode}>
                              {mode}
                            </option>
                          ))}
                        </select>
                      </label>
                      {openingRevealWidgetConfig.backgroundMode === "image" ? (
                      <label className="block">
                        <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                          Background Image
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) =>
                            updateOpeningRevealImage("backgroundImage", event.target.files?.[0])
                          }
                          className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--color-primary)] file:px-3 file:py-2 file:text-sm file:font-black file:text-white focus:border-[var(--color-accent)]"
                        />
                      </label>
                      ) : (
                      <label className="block">
                        <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                          Background Color
                        </span>
                        <input
                          type="color"
                          value={openingRevealWidgetConfig.backgroundColor || "#fbf7ef"}
                          onChange={(event) =>
                            updateOpeningRevealWidget("backgroundColor", event.target.value)
                          }
                          className="mt-2 h-11 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white p-1 outline-none focus:border-[var(--color-accent)]"
                        />
                      </label>
                      )}
                      <label className="mt-6 flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                        <input
                          type="checkbox"
                          checked={Boolean(openingRevealWidgetConfig.autoPlayMusic)}
                          onChange={(event) => updateOpeningRevealWidget("autoPlayMusic", event.target.checked)}
                          className="h-4 w-4"
                        />
                        <span className="text-sm font-black text-[var(--color-primary)]">
                          Auto play musik
                        </span>
                      </label>
                    </div>
                    <OpeningRevealPreview config={openingRevealWidgetConfig} />
                  </div>
                </div>
              </div>
              <div id="template-widgets" className={`scroll-mt-24 md:col-span-2 ${editorStep === 4 ? "" : "hidden"}`}>
                <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-5">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
                        Countdown Widget
                      </p>
                      <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
                        Atur countdown real-time yang dipakai template ini.
                      </p>
                    </div>
                    <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-4 py-3">
                      <input
                        type="checkbox"
                        checked={Boolean(countdownWidgetConfig.enabled)}
                        onChange={(event) => updateCountdownWidget("enabled", event.target.checked)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm font-black text-[var(--color-primary)]">
                        Countdown aktif
                      </span>
                    </label>
                  </div>

                  <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
                    <div className="grid gap-4 md:grid-cols-3">
                      <label className="block">
                        <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                          Target Event
                        </span>
                        <select
                          value={countdownWidgetConfig.eventIndex}
                          onChange={(event) =>
                            updateCountdownWidget("eventIndex", Number(event.target.value))
                          }
                          className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                        >
                          {[0, 1, 2].map((eventIndex) => (
                            <option key={eventIndex} value={eventIndex}>
                              Event {eventIndex + 1}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block">
                        <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                          Variant
                        </span>
                        <select
                          value={countdownWidgetConfig.variant}
                          onChange={(event) => updateCountdownWidget("variant", event.target.value)}
                          className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                        >
                          {countdownVariantOptions.map((variant) => (
                            <option key={variant} value={variant}>
                              {variant}
                            </option>
                          ))}
                        </select>
                      </label>
                      <MiniInput
                        label="Complete Text"
                        value={countdownWidgetConfig.completeText}
                        onChange={(value) => updateCountdownWidget("completeText", value)}
                      />
                    </div>
                    <CountdownWidgetPreview
                      variant={countdownWidgetConfig.variant}
                      enabled={Boolean(countdownWidgetConfig.enabled)}
                    />
                  </div>
                </div>
              </div>
              <div className={`md:col-span-2 ${editorStep === 4 ? "" : "hidden"}`}>
                <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-5">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
                        Love Story Widget
                      </p>
                      <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
                        Atur style timeline dan animasi item love story.
                      </p>
                    </div>
                    <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-4 py-3">
                      <input
                        type="checkbox"
                        checked={Boolean(storyWidgetConfig.enabled)}
                        onChange={(event) => updateStoryWidget("enabled", event.target.checked)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm font-black text-[var(--color-primary)]">
                        Story aktif
                      </span>
                    </label>
                  </div>
                  <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="block">
                        <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                          Variant
                        </span>
                        <select
                          value={storyWidgetConfig.variant}
                          onChange={(event) => updateStoryWidget("variant", event.target.value)}
                          className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                        >
                          {storyVariantOptions.map((variant) => (
                            <option key={variant} value={variant}>
                              {variant}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block">
                        <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                          Animation
                        </span>
                        <select
                          value={storyWidgetConfig.animation}
                          onChange={(event) => updateStoryWidget("animation", event.target.value)}
                          className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                        >
                          {storyAnimationOptions.map((animation) => (
                            <option key={animation} value={animation}>
                              {animation}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <StoryWidgetPreview
                      variant={storyWidgetConfig.variant}
                      enabled={Boolean(storyWidgetConfig.enabled)}
                    />
                  </div>
                </div>
              </div>
              <div className={`md:col-span-2 ${editorStep === 4 ? "" : "hidden"}`}>
                <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-5">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
                        Gallery Widget
                      </p>
                      <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
                        Atur layout gallery, jumlah foto, cover ordering, dan fullscreen viewer.
                      </p>
                    </div>
                    <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-4 py-3">
                      <input
                        type="checkbox"
                        checked={Boolean(galleryWidgetConfig.enabled)}
                        onChange={(event) => updateGalleryWidget("enabled", event.target.checked)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm font-black text-[var(--color-primary)]">
                        Gallery aktif
                      </span>
                    </label>
                  </div>
                  <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
                    <div className="grid gap-4 md:grid-cols-3">
                      <label className="block">
                        <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                          Variant
                        </span>
                        <select
                          value={galleryWidgetConfig.variant}
                          onChange={(event) => updateGalleryWidget("variant", event.target.value)}
                          className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                        >
                          {galleryVariantOptions.map((variant) => (
                            <option key={variant} value={variant}>
                              {variant}
                            </option>
                          ))}
                        </select>
                      </label>
                      <MiniInput
                        label="Limit"
                        type="number"
                        value={galleryWidgetConfig.limit}
                        onChange={(value) => updateGalleryWidget("limit", value)}
                      />
                      <label className="mt-6 flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                        <input
                          type="checkbox"
                          checked={Boolean(galleryWidgetConfig.includeCover)}
                          onChange={(event) => updateGalleryWidget("includeCover", event.target.checked)}
                          className="h-4 w-4"
                        />
                        <span className="text-sm font-black text-[var(--color-primary)]">
                          Cover di awal
                        </span>
                      </label>
                    </div>
                    <GalleryWidgetPreview
                      variant={galleryWidgetConfig.variant}
                      enabled={Boolean(galleryWidgetConfig.enabled)}
                    />
                  </div>
                </div>
              </div>
              <div className={`md:col-span-2 ${editorStep === 4 ? "" : "hidden"}`}>
                <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-5">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
                        Event Widget
                      </p>
                      <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
                        Atur tampilan multi-event, tombol maps, dan icon section acara.
                      </p>
                    </div>
                    <label className="flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-4 py-3">
                      <input
                        type="checkbox"
                        checked={Boolean(eventWidgetConfig.enabled)}
                        onChange={(event) => updateEventWidget("enabled", event.target.checked)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm font-black text-[var(--color-primary)]">
                        Event aktif
                      </span>
                    </label>
                  </div>

                  <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
                    <div className="grid gap-4 md:grid-cols-3">
                      <label className="block">
                        <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                          Variant
                        </span>
                        <select
                          value={eventWidgetConfig.variant}
                          onChange={(event) => updateEventWidget("variant", event.target.value)}
                          className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                        >
                          {eventVariantOptions.map((variant) => (
                            <option key={variant} value={variant}>
                              {variant}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="mt-6 flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                        <input
                          type="checkbox"
                          checked={Boolean(eventWidgetConfig.showMaps)}
                          onChange={(event) => updateEventWidget("showMaps", event.target.checked)}
                          className="h-4 w-4"
                        />
                        <span className="text-sm font-black text-[var(--color-primary)]">
                          Tampilkan Maps
                        </span>
                      </label>
                      <label className="mt-6 flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                        <input
                          type="checkbox"
                          checked={Boolean(eventWidgetConfig.showIcon)}
                          onChange={(event) => updateEventWidget("showIcon", event.target.checked)}
                          className="h-4 w-4"
                        />
                        <span className="text-sm font-black text-[var(--color-primary)]">
                          Tampilkan Icon
                        </span>
                      </label>
                    </div>
                    <EventWidgetPreview
                      variant={eventWidgetConfig.variant}
                      enabled={Boolean(eventWidgetConfig.enabled)}
                      showMaps={Boolean(eventWidgetConfig.showMaps)}
                      showIcon={Boolean(eventWidgetConfig.showIcon)}
                    />
                  </div>
                </div>
              </div>
              <div id="template-ornaments" className={`scroll-mt-24 md:col-span-2 ${editorStep === 5 ? "" : "hidden"}`}>
                <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-5">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
                        Ornament Editor
                      </p>
                      <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
                        Edit posisi ornament berdasarkan canvas 430px.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={addOrnament}
                        className="rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-black text-white"
                      >
                        Tambah Ornament
                      </button>
                      <button
                        type="button"
                        onClick={removeOrnament}
                        disabled={!selectedOrnament}
                        className="rounded-xl border border-[var(--color-accent-pale)] bg-white px-4 py-2 text-sm font-black text-[var(--color-primary)] disabled:opacity-45"
                      >
                        Hapus
                      </button>
                      <button
                        type="button"
                        onClick={duplicateOrnament}
                        disabled={!selectedOrnament}
                        className="rounded-xl border border-[var(--color-accent-pale)] bg-white px-4 py-2 text-sm font-black text-[var(--color-primary)] disabled:opacity-45"
                      >
                        Duplicate
                      </button>
                    </div>
                  </div>

                  {parsedDesignConfig ? (
                    <div className="mt-5 grid gap-5 xl:grid-cols-[280px_minmax(320px,1fr)_360px]">
                      <div className="space-y-4">
                        <Field label="Section">
                          <SelectInput
                            value={activeDesignSection}
                            onChange={(event) => {
                              setActiveDesignSection(event.target.value);
                              setSelectedOrnamentIndex(0);
                            }}
                          >
                            {designSectionNames.map((sectionName) => (
                              <option key={sectionName}>{sectionName}</option>
                            ))}
                          </SelectInput>
                        </Field>
                        <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-3">
                          <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-text)]">
                            Section Sequence
                          </p>
                          <label className="mt-3 flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-[var(--color-bg)] px-3 py-2">
                            <input
                              type="checkbox"
                              checked={Boolean(sectionAnimationConfig.enabled)}
                              onChange={(event) =>
                                updateSectionAnimation("enabled", event.target.checked)
                              }
                              className="h-4 w-4"
                            />
                            <span className="text-sm font-black text-[var(--color-primary)]">
                              Aktifkan sequence
                            </span>
                          </label>
                          <label className="mt-3 block">
                            <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                              Preset
                            </span>
                            <select
                              value={sectionAnimationConfig.preset}
                              onChange={(event) => applySectionAnimationPreset(event.target.value)}
                              className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                            >
                              {sectionAnimationPresets.map((preset) => (
                                <option key={preset.id} value={preset.id}>
                                  {preset.label}
                                </option>
                              ))}
                            </select>
                          </label>
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <MiniInput
                              label="Stagger"
                              type="number"
                              step="0.05"
                              value={sectionAnimationConfig.staggerStep}
                              onChange={(value) => updateSectionAnimation("staggerStep", value)}
                            />
                            <MiniInput
                              label="Start Delay"
                              type="number"
                              step="0.1"
                              value={sectionAnimationConfig.entranceDelay}
                              onChange={(value) => updateSectionAnimation("entranceDelay", value)}
                            />
                          </div>
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <label className="block">
                              <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                                Entrance
                              </span>
                              <select
                                value={sectionAnimationConfig.entrancePreset}
                                onChange={(event) =>
                                  updateSectionAnimation("entrancePreset", event.target.value)
                                }
                                className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                              >
                                {ornamentEntranceOptions.map((entrance) => (
                                  <option key={entrance} value={entrance}>
                                    {entrance}
                                  </option>
                                ))}
                              </select>
                            </label>
                            <label className="block">
                              <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                                Loop
                              </span>
                              <select
                                value={sectionAnimationConfig.loopPreset}
                                onChange={(event) =>
                                  updateSectionAnimation("loopPreset", event.target.value)
                                }
                                className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                              >
                                {ornamentAnimationOptions.map((animation) => (
                                  <option key={animation} value={animation}>
                                    {animation}
                                  </option>
                                ))}
                              </select>
                            </label>
                          </div>
                        </div>

                        <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-3">
                          <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-text)]">
                            Ornament
                          </p>
                          <div className="mt-3 space-y-2">
                            {activeOrnaments.map((ornament, index) => (
                              <button
                                key={ornament.id || index}
                                type="button"
                                onClick={() => setSelectedOrnamentIndex(index)}
                                className={`w-full rounded-xl px-3 py-2 text-left text-sm font-black transition-colors ${
                                  selectedOrnamentIndex === index
                                    ? "bg-[var(--color-primary)] text-white"
                                    : "bg-[var(--color-bg)] text-[var(--color-primary)]"
                                }`}
                              >
                                {ornament.id || `Ornament ${index + 1}`}
                              </button>
                            ))}
                            {activeOrnaments.length === 0 ? (
                              <p className="text-sm font-semibold text-[var(--color-text)]">
                                Belum ada ornament di section ini.
                              </p>
                            ) : null}
                          </div>
                        </div>

                      </div>

                      <div className="space-y-4">
                        <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-4 xl:sticky xl:top-24">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-text)]">
                                Canvas Preview
                              </p>
                              <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">
                                {activeDesignSection} section, {activeOrnaments.length} ornament
                              </p>
                            </div>
                            <span className="rounded-full bg-[var(--color-bg)] px-3 py-1 text-xs font-black text-[var(--color-primary)]">
                              430px
                            </span>
                          </div>
                          <div className="mt-4 flex justify-center">
                            <div className="relative aspect-[9/16] w-full max-w-[360px] overflow-hidden rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] shadow-inner">
                              <OrnamentSectionCanvasPreview
                                section={activeDesignSection}
                                styleConfig={activeSectionStyleConfig}
                              />
                              <OrnamentLayer ornaments={previewOrnaments} />
                              <div className="absolute inset-0 border border-dashed border-[var(--color-accent)]/50" />
                              <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 rounded-[8px] bg-white/78 p-3 text-center text-xs font-black uppercase tracking-[0.12em] text-[var(--color-text)]">
                                {activeDesignSection} Section
                              </div>
                            </div>
                          </div>
                        </div>

                        {validationWarnings.length > 0 ? (
                          <div className="rounded-[8px] border border-[var(--color-accent)] bg-[var(--color-accent)]/10 p-4">
                            <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-primary)]">
                              Validation Warnings
                            </p>
                            <ul className="mt-3 space-y-2">
                              {validationWarnings.map((warning) => (
                                <li
                                  key={warning}
                                  className="text-sm font-semibold leading-6 text-[var(--color-text)]"
                                >
                                  {warning}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-4">
                            <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-text)]">
                              Validation
                            </p>
                            <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">
                              Tidak ada warning untuk section ini.
                            </p>
                          </div>
                        )}
                      </div>

                      {selectedOrnament ? (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                          <div className="md:col-span-2 xl:col-span-1">
                            <MiniInput
                              label="ID"
                              value={selectedOrnament.id}
                              onChange={(value) => updateOrnament("id", value)}
                            />
                          </div>
                          <div className="md:col-span-2 xl:col-span-1">
                            <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-3">
                              <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-text)]">
                                Layer Controls
                              </p>
                              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                                <button
                                  type="button"
                                  onClick={() => reorderSelectedOrnament("down")}
                                  disabled={selectedOrnamentIndex <= 0}
                                  className="rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] disabled:opacity-45"
                                >
                                  Move Down
                                </button>
                                <button
                                  type="button"
                                  onClick={() => reorderSelectedOrnament("up")}
                                  disabled={selectedOrnamentIndex >= activeOrnaments.length - 1}
                                  className="rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] disabled:opacity-45"
                                >
                                  Move Up
                                </button>
                                <button
                                  type="button"
                                  onClick={() => reorderSelectedOrnament("back")}
                                  disabled={selectedOrnamentIndex <= 0}
                                  className="rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] disabled:opacity-45"
                                >
                                  Send Back
                                </button>
                                <button
                                  type="button"
                                  onClick={() => reorderSelectedOrnament("front")}
                                  disabled={selectedOrnamentIndex >= activeOrnaments.length - 1}
                                  className="rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] disabled:opacity-45"
                                >
                                  Bring Front
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="md:col-span-2 xl:col-span-1">
                            <MiniInput
                              label="SRC"
                              value={selectedOrnament.src}
                              onChange={(value) => updateOrnament("src", value)}
                            />
                            <div className="mt-3">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(event) =>
                                  updateSelectedOrnamentFile(event.target.files?.[0])
                                }
                                className="w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-bold text-[var(--color-primary)] outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--color-primary)] file:px-3 file:py-2 file:text-xs file:font-black file:text-white"
                              />
                              {isUploadingOrnament ? (
                                <p className="mt-2 text-sm font-black text-[var(--color-accent)]">
                                  Mengupload ornament...
                                </p>
                              ) : null}
                            </div>
                            <div className="mt-4 rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-3">
                              <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--color-text)]">
                                Uploaded Ornament
                              </p>
                              {isLoadingOrnamentAssets ? (
                                <p className="mt-2 text-xs font-bold text-[var(--color-text)]">
                                  Memuat asset upload...
                                </p>
                              ) : null}
                              {dynamicOrnamentAssets.length > 0 ? (
                                <div className="mt-3">
                                  <p className="text-[11px] font-black uppercase tracking-[0.12em] text-[var(--color-accent)]">
                                    Uploaded
                                  </p>
                                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                                    {dynamicOrnamentAssets.map((asset) => (
                                      <div
                                        key={asset.storagePath || asset.id}
                                        className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-2"
                                      >
                                        <button
                                          type="button"
                                          onClick={() => applyOrnamentAsset(asset)}
                                          className="block w-full text-left"
                                        >
                                          <span className="flex aspect-square items-center justify-center overflow-hidden rounded-md bg-[var(--color-bg)]">
                                            <img
                                              src={asset.src}
                                              alt=""
                                              className="h-full w-full object-contain"
                                            />
                                          </span>
                                          <span className="mt-2 block truncate text-xs font-black text-[var(--color-primary)]">
                                            {asset.name}
                                          </span>
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => deleteDynamicOrnamentAsset(asset)}
                                          className="mt-2 w-full rounded-lg border border-[var(--color-accent-pale)] px-2 py-1 text-xs font-black text-[var(--color-text)] hover:bg-[var(--color-bg)]"
                                        >
                                          Hapus
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ) : null}
                              {dynamicOrnamentAssets.length === 0 && !isLoadingOrnamentAssets ? (
                                <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">
                                  Belum ada ornament upload untuk template ini.
                                </p>
                              ) : null}
                            </div>
                          </div>
                          <label className="block">
                            <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                              Slot
                            </span>
                            <select
                              value={selectedOrnament.slot || "top-left"}
                              onChange={(event) => updateOrnament("slot", event.target.value)}
                              className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                            >
                              {ornamentSlots.map((slot) => (
                                <option key={slot}>{slot}</option>
                              ))}
                            </select>
                          </label>
                          <label className="block">
                            <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                              Object Fit
                            </span>
                            <select
                              value={selectedOrnament.objectFit || "contain"}
                              onChange={(event) => updateOrnament("objectFit", event.target.value)}
                              className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                            >
                              {ornamentObjectFitOptions.map((fit) => (
                                <option key={fit}>{fit}</option>
                              ))}
                            </select>
                          </label>
                          <label className="block">
                            <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                              Animation
                            </span>
                            <select
                              value={selectedOrnament.animation || "none"}
                              onChange={(event) => updateOrnament("animation", event.target.value)}
                              className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                            >
                              {ornamentAnimationOptions.map((animation) => (
                                <option key={animation} value={animation}>
                                  {animation}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label className="block">
                            <span className="text-xs font-black uppercase tracking-[0.1em] text-[var(--color-text)]">
                              Entrance
                            </span>
                            <select
                              value={selectedOrnament.entrance || "none"}
                              onChange={(event) => updateOrnament("entrance", event.target.value)}
                              className="mt-2 w-full rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2 text-sm font-black text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
                            >
                              {ornamentEntranceOptions.map((entrance) => (
                                <option key={entrance} value={entrance}>
                                  {entrance}
                                </option>
                              ))}
                            </select>
                          </label>
                          <MiniInput label="Width" value={selectedOrnament.width} onChange={(value) => updateOrnament("width", value)} />
                          <MiniInput label="Height" value={selectedOrnament.height} onChange={(value) => updateOrnament("height", value)} />
                          <MiniInput label="X" type="number" value={selectedOrnament.x || 0} onChange={(value) => updateOrnament("x", value)} />
                          <MiniInput label="Y" type="number" value={selectedOrnament.y || 0} onChange={(value) => updateOrnament("y", value)} />
                          <MiniInput label="Rotate" type="number" value={selectedOrnament.rotate || 0} onChange={(value) => updateOrnament("rotate", value)} />
                          <MiniInput label="Opacity" type="number" step="0.05" value={selectedOrnament.opacity ?? 1} onChange={(value) => updateOrnament("opacity", value)} />
                          <MiniInput label="Z Index" type="number" value={selectedOrnament.zIndex || 0} onChange={(value) => updateOrnament("zIndex", value)} />
                          <MiniInput label="Entrance Duration" type="number" step="0.1" value={selectedOrnament.entranceDuration ?? 0.8} onChange={(value) => updateOrnament("entranceDuration", value)} />
                          <MiniInput label="Entrance Delay" type="number" step="0.1" value={selectedOrnament.entranceDelay ?? 0} onChange={(value) => updateOrnament("entranceDelay", value)} />
                          <MiniInput label="Duration" type="number" step="0.5" value={selectedOrnament.duration ?? 6} onChange={(value) => updateOrnament("duration", value)} />
                          <MiniInput label="Delay" type="number" step="0.25" value={selectedOrnament.delay ?? 0} onChange={(value) => updateOrnament("delay", value)} />
                          <label className="mt-6 flex items-center gap-3 rounded-xl border border-[var(--color-accent-pale)] bg-white px-3 py-2">
                            <input
                              type="checkbox"
                              checked={Boolean(selectedOrnament.mirror)}
                              onChange={(event) => updateOrnament("mirror", event.target.checked)}
                              className="h-4 w-4"
                            />
                            <span className="text-sm font-black text-[var(--color-primary)]">
                              Mirror horizontal
                            </span>
                          </label>
                        </div>
                      ) : (
                        <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-6 text-center">
                          <p className="text-base font-black text-[var(--color-primary)]">
                            Pilih atau tambah ornament dulu.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="mt-5 rounded-[8px] bg-white px-4 py-3 text-sm font-black text-[var(--color-primary)]">
                      Design config JSON belum valid, editor visual dinonaktifkan sementara.
                    </p>
                  )}
                </div>
              </div>
              <div
                id="template-preview"
                className={`scroll-mt-24 md:col-span-2 ${editorStep === 6 ? "" : "hidden"}`}
              >
                <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-primary)] p-4 shadow-xl shadow-[var(--color-primary)]/12">
                  <div className="mb-3 flex flex-col gap-1 text-white sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent-soft)]">
                      Live Template Preview
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(templatePreviewViewports).map(([key, viewport]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setPreviewViewport(key)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-black transition-colors ${
                            previewViewport === key
                              ? "bg-[var(--color-accent)] text-[var(--color-primary)]"
                              : "bg-white/10 text-white/72 hover:bg-white/18 hover:text-white"
                          }`}
                        >
                          {viewport.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="mb-3 text-sm font-bold text-white/70">
                    {activeDesignSection} section draft (focus: {previewFocusSection})
                  </p>
                  <div className="overflow-x-auto">
                    <div
                      className={`mx-auto overflow-auto rounded-[8px] bg-white ${activePreviewViewport.frameClass}`}
                    >
                      <iframe
                        key={templatePreviewSrc}
                        src={templatePreviewSrc}
                        title="Template live preview"
                        className="origin-top-left border-0"
                        style={{
                          width: `${activePreviewViewport.viewportWidth}px`,
                          height: `${activePreviewViewport.viewportHeight}px`,
                          transform: `scale(${activePreviewViewport.scale})`,
                          transformOrigin: "top left",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div id="template-advanced" className={`scroll-mt-24 md:col-span-2 ${editorStep === 7 ? "" : "hidden"}`}>
                <div className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
                        Publish
                      </p>
                      <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
                        Final check sebelum publish. Advanced config opsional.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAdvancedOpen((current) => !current)}
                      className="rounded-xl border border-[var(--color-accent-pale)] bg-white px-4 py-2 text-sm font-black text-[var(--color-primary)]"
                    >
                      {isAdvancedOpen ? "Sembunyikan Advanced" : "Tampilkan Advanced"}
                    </button>
                  </div>
                  {isAdvancedOpen ? (
                    <div className="mt-4">
                      <Field label="Design Config JSON">
                        <textarea
                          value={designConfigText}
                          onChange={(event) => {
                            setDesignConfigText(event.target.value);
                            setManagerMessage("");
                          }}
                          rows={10}
                          spellCheck={false}
                          className="w-full rounded-2xl border border-[var(--color-accent-pale)] bg-[#111827] px-4 py-3 font-mono text-sm leading-6 text-white outline-none focus:border-[var(--color-accent)]"
                        />
                      </Field>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className={`mt-5 rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] px-4 py-3 text-sm font-black text-[var(--color-primary)] ${editorStep === 7 ? "" : "hidden"}`}>
              Gunakan tombol Simpan di header editor untuk menyimpan perubahan.
            </div>
          </div>
        ) : null}

        {!templateDraft ? (
        <div className="mt-6">
          <div className="hidden grid-cols-[82px_1.35fr_0.8fr_0.75fr_0.75fr_0.8fr] gap-4 border-b border-[var(--color-accent-pale)] bg-[var(--color-bg)] px-5 py-3 text-xs font-black uppercase tracking-[0.12em] text-[var(--color-text)] lg:hidden">
            <span>Preview</span>
            <span>Template</span>
            <span>Kategori</span>
            <span>Harga</span>
            <span>Status</span>
            <span className="text-right">Aksi</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredTemplates.map((template) => (
              <article
                key={template.id}
                className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-4 shadow-lg shadow-[var(--color-primary)]/6"
              >
                <img
                  src={template.image}
                  alt={`Preview ${template.name}`}
                  className="aspect-[4/5] w-full rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)] object-cover"
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-black text-[var(--color-primary)]">
                      {template.name}
                    </h3>
                    <span className="rounded-full bg-[var(--color-muted)] px-3 py-1 text-xs font-black text-[var(--color-primary)]">
                      {template.badge}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">
                    {template.id}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-[var(--color-text)]">
                    {template.description}
                  </p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.08em] text-[var(--color-text)]/70">
                    {template.supportedFeatures.length} fitur support
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-black text-[var(--color-primary)]">
                      {template.category}
                    </p>
                    <p className="text-base font-black text-[var(--color-accent)]">
                      {template.price}
                    </p>
                  </div>
                  <TemplateStatusPill status={template.status} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={template.previewUrl}
                    className="flex-1 rounded-xl border border-[var(--color-accent-pale)] px-4 py-2 text-center text-sm font-black text-[var(--color-primary)] transition-colors hover:bg-[var(--color-bg)]"
                  >
                    Preview
                  </a>
                  <button
                    type="button"
                    onClick={() => startEditTemplate(template)}
                    className="flex-1 rounded-xl border border-[var(--color-accent-pale)] px-4 py-2 text-sm font-black text-[var(--color-primary)] transition-colors hover:bg-[var(--color-bg)]"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleTemplateStatus(template.id)}
                    className="rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-black text-white transition-colors hover:bg-[var(--color-primary-hover)]"
                  >
                    {template.status === "active" ? "Hide" : "Activate"}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteTemplate(template)}
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-black text-red-700 transition-colors hover:bg-red-100"
                  >
                    Hapus
                  </button>
                </div>
              </article>
            ))}

            {filteredTemplates.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <p className="text-xl font-black text-[var(--color-primary)]">
                  Template tidak ditemukan
                </p>
                <p className="mt-2 text-base font-semibold text-[var(--color-text)]">
                  Coba ubah keyword, kategori, atau status filter.
                </p>
              </div>
            ) : null}
          </div>
        </div>
        ) : null}
      </motion.section>
  );
}

function SettingsPage() {
  return (
    <motion.section
      variants={fadeUp}
      className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] p-6 shadow-xl shadow-[var(--color-primary)]/8"
    >
      <h2 className="text-2xl font-black text-[var(--color-primary)]">Pengaturan</h2>
      <p className="mt-2 text-base font-semibold leading-7 text-[var(--color-text)]">
        Area ini nanti dipakai untuk profil bisnis, nomor WhatsApp, default package, pengaturan domain,
        dan role admin.
      </p>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Field label="Nama Brand">
          <TextInput defaultValue="NusaInvite" />
        </Field>
        <Field label="Nomor WhatsApp">
          <TextInput defaultValue="6282226551246" />
        </Field>
        <Field label="Domain Utama">
          <TextInput placeholder="nustainvite.com" />
        </Field>
        <Field label="Default Package">
          <SelectInput defaultValue="Premium">
            <option>Basic</option>
            <option>Premium</option>
            <option>Exclusive</option>
          </SelectInput>
        </Field>
      </div>
    </motion.section>
  );
}

function DashboardMainContent({ activePage, metrics }) {
  if (activePage === "invitations") {
    return (
      <>
        <InvitationTable />
        <InvitationFormPanel />
      </>
    );
  }

  if (activePage === "templates") {
    return <TemplateAdminPage />;
  }

  if (activePage === "rsvps") {
    return <RSVPManager />;
  }

  if (activePage === "guests") {
    return <GuestManager />;
  }

  if (activePage === "media") {
    return <MediaManager />;
  }

  if (activePage === "content") {
    return <ContentManagers />;
  }

  if (activePage === "settings") {
    return <SettingsPage />;
  }

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>
      <InvitationTable />
      <RSVPManager />
    </>
  );
}

function DashboardAside({ activePage }) {
  if (activePage === "invitations") {
    return (
      <>
        <QuickCreateCard />
        <TemplateHighlights />
      </>
    );
  }

  if (activePage === "templates") {
    return (
      <>
        <TemplateHighlights />
        <ActivityFeed />
      </>
    );
  }

  if (activePage === "overview") {
    return (
      <>
        <QuickCreateCard />
        <TemplateHighlights />
        <ActivityFeed />
      </>
    );
  }

  return <ActivityFeed />;
}

export default function Dashboard({ session, activePage = "overview" }) {
  const fallbackMetrics = useMemo(
    () =>
      buildDashboardMetrics({
        invitations: 1,
        activeThisMonth: 1,
        rsvps: sampleInvitation.rsvps.length,
        rsvpPax: sampleInvitation.rsvps.reduce(
          (total, item) => total + Number(item.pax || 0),
          0,
        ),
        published: 1,
        revision: 0,
        guests: sampleInvitation.guests.length,
      }),
    [],
  );
  const [metrics, setMetrics] = useState(fallbackMetrics);
  const meta = pageMeta[activePage] || pageMeta.overview;
  const showAside = activePage === "overview";

  useEffect(() => {
    let isMounted = true;

    fetch("/api/dashboard/stats")
      .then((response) => response.json())
      .then((result) => {
        if (isMounted && result.data) {
          setMetrics(buildDashboardMetrics(result.data));
        }
      })
      .catch(() => {
        if (isMounted) {
          setMetrics(fallbackMetrics);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [fallbackMetrics]);

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-primary)]">
      <div className="flex">
        <Sidebar activePage={activePage} />
        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-[var(--color-accent-pale)]/55 bg-[var(--color-bg)]/88 px-5 py-4 backdrop-blur-xl sm:px-8">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-[var(--color-accent)]">
                  {meta.eyebrow}
                </p>
                <h1 className="mt-1 text-3xl font-black text-[var(--color-primary)] sm:text-4xl">
                  {meta.title}
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-black text-[var(--color-primary)]">
                    {session?.email}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-accent)]">
                    {session?.mode === "dev" ? "Dev Mode" : "Admin"}
                  </p>
                </div>
                <a
                  href="/"
                  className="rounded-2xl border border-[var(--color-accent-pale)] bg-[var(--color-surface)] px-4 py-3 text-sm font-black text-[var(--color-text)] transition-colors hover:bg-white"
                >
                  Landing
                </a>
                <LogoutButton />
              </div>
            </div>
          </header>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } },
            }}
            className={`mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 ${
              showAside ? "lg:grid-cols-[1fr_360px]" : ""
            }`}
          >
            <div className="space-y-6">
              <DashboardMainContent activePage={activePage} metrics={metrics} />
            </div>
            {showAside ? (
              <aside className="space-y-6">
                <DashboardAside activePage={activePage} />
              </aside>
            ) : null}
          </motion.div>
        </section>
      </div>
    </main>
  );
}
