export const sampleInvitation = {
  id: "INV-001",
  slug: "dimas-salsa",
  templateId: "rana-kirana",
  status: "published",
  package: "Premium",
  couple: {
    groomName: "Dimas Pratama",
    groomNickname: "Dimas",
    brideName: "Salsa Kirana",
    brideNickname: "Salsa",
    quote:
      "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup.",
  },
  events: [
    {
      title: "Akad Nikah",
      date: "Jumat, 12 Juni 2026",
      time: "09.00 WIB",
      venue: "Gedung Serbaguna Nusantara",
      address: "Jl. Melati Raya No. 12, Bandung",
      mapsUrl: "https://maps.google.com",
    },
    {
      title: "Resepsi",
      date: "Jumat, 12 Juni 2026",
      time: "11.00 - 14.00 WIB",
      venue: "Gedung Serbaguna Nusantara",
      address: "Jl. Melati Raya No. 12, Bandung",
      mapsUrl: "https://maps.google.com",
    },
  ],
  story: [
    {
      year: "2021",
      title: "Awal Bertemu",
      desc: "Berawal dari pertemuan sederhana yang menjadi cerita panjang.",
    },
    {
      year: "2024",
      title: "Lamaran",
      desc: "Keluarga bertemu dan restu menjadi awal langkah baru.",
    },
    {
      year: "2026",
      title: "Hari Bahagia",
      desc: "Kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan mendoakan.",
    },
  ],
  gallery: [
    "/assets/nusantara-jawa.svg",
    "/assets/nusantara-songket.svg",
    "/assets/nusantara-botanical.svg",
  ],
  bankAccounts: [
    {
      bank: "BCA",
      name: "Dimas Pratama",
      number: "1234567890",
    },
    {
      bank: "Mandiri",
      name: "Salsa Kirana",
      number: "9876543210",
    },
  ],
  features: {
    rsvp: true,
    gift: true,
    music: true,
    guestName: true,
  },
  guests: [
    {
      name: "Bapak Andi",
      slug: "bapak-andi",
      group: "Keluarga",
      rsvpStatus: "Hadir",
      pax: 2,
    },
    {
      name: "Ibu Maya",
      slug: "ibu-maya",
      group: "Keluarga",
      rsvpStatus: "Belum RSVP",
      pax: 0,
    },
    {
      name: "Rina & Partner",
      slug: "rina-partner",
      group: "Teman",
      rsvpStatus: "Hadir",
      pax: 2,
    },
    {
      name: "Tim Kantor",
      slug: "tim-kantor",
      group: "Kantor",
      rsvpStatus: "Menunggu",
      pax: 0,
    },
  ],
  rsvps: [
    {
      guestName: "Bapak Andi",
      attendance: "hadir",
      pax: 2,
      message: "InsyaAllah hadir. Semoga lancar sampai hari H.",
      createdAt: "2026-05-07T08:00:00.000Z",
    },
    {
      guestName: "Rina & Partner",
      attendance: "hadir",
      pax: 2,
      message: "Selamat ya, sampai ketemu di acara.",
      createdAt: "2026-05-07T09:30:00.000Z",
    },
  ],
};

export function createInvitationFromDashboardForm(form) {
  const groomNickname = form.groomNickname || "Mempelai";
  const brideNickname = form.brideNickname || "Mempelai";

  return {
    id: "DRAFT-LOCAL",
    slug: form.slug || "preview-undangan",
    templateId: form.templateId || "rana-kirana",
    status: "draft",
    package: form.package || "Premium",
    couple: {
      groomName: form.groomName || groomNickname,
      groomNickname,
      brideName: form.brideName || brideNickname,
      brideNickname,
      quote: form.quote || sampleInvitation.couple.quote,
    },
    events: [
      {
        title: form.eventTitle || "Akad & Resepsi",
        date: form.eventDate || "Tanggal acara",
        time: form.eventTime || "Jam acara",
        venue: form.venue || "Lokasi acara",
        address: form.venue || "Alamat acara",
        mapsUrl: form.mapsUrl || "https://maps.google.com",
      },
    ],
    story: sampleInvitation.story,
    gallery: sampleInvitation.gallery,
    bankAccounts: sampleInvitation.bankAccounts,
    features: {
      rsvp: Boolean(form.rsvp),
      gift: Boolean(form.gift),
      music: Boolean(form.music),
      guestName: Boolean(form.guestName),
    },
    guests: sampleInvitation.guests,
  };
}

export function getStoredInvitationDraft() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawDraft = window.localStorage.getItem("nusa-invite:draft");
    return rawDraft ? JSON.parse(rawDraft) : null;
  } catch {
    return null;
  }
}
