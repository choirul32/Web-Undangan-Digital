import { emptyInvitation } from "./emptyInvitation";

export const previewInvitation = {
  ...emptyInvitation,
  slug: "preview-order",
  templateId: "standard",
  status: "draft",
  couple: {
    groomName: "Dimas Pratama",
    groomNickname: "Dimas",
    groomParents: "Bapak Ahmad Pratama & Ibu Siti Aminah",
    brideName: "Salsa Kirana",
    brideNickname: "Salsa",
    brideParents: "Bapak Budi Santoso & Ibu Dewi Lestari",
    quote: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup.",
  },
  events: [
    {
      title: "Akad Nikah",
      date: "2026-06-12",
      time: "09.00 WIB",
      venue: "Gedung Serbaguna Nusantara",
      address: "Jl. Melati Raya No. 12, Bandung",
      mapsUrl: "",
    },
  ],
  story: [
    {
      year: "2021",
      title: "Awal Bertemu",
      desc: "Berawal dari pertemuan sederhana yang menjadi cerita panjang.",
    },
    {
      year: "2026",
      title: "Hari Bahagia",
      desc: "Kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan mendoakan.",
    },
  ],
  gallery: [
    "/assets/CoverPasangan.png",
    "/assets/catin_wanita.jpg",
    "/assets/catin_pria.jpg",
  ],
  bankAccounts: [
    {
      bank: "BCA",
      name: "Dimas Pratama",
      number: "1234567890",
    },
  ],
};
