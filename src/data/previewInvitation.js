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
    groomInstagram: "@dimas",
    brideName: "Salsa Kirana",
    brideNickname: "Salsa",
    brideParents: "Bapak Budi Santoso & Ibu Dewi Lestari",
    brideInstagram: "@salsa",
    quote: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup.",
  },
  events: [
    {
      title: "Akad Nikah",
      date: "2026-06-12",
      time: "09.00 WIB",
      venue: "Masjid Raya Al-Ikhlas",
      address: "Jl. Melati Raya No. 12, Bandung",
      mapsUrl: "https://maps.google.com/?q=Masjid+Raya+Al-Ikhlas+Bandung",
    },
    {
      title: "Resepsi",
      date: "2026-06-12",
      time: "11.00 - 14.00 WIB",
      venue: "Gedung Serbaguna Nusantara",
      address: "Jl. Anggrek Selatan No. 18, Bandung",
      mapsUrl: "https://maps.google.com/?q=Gedung+Serbaguna+Nusantara+Bandung",
    },
    {
      title: "Ngunduh Mantu",
      date: "2026-06-14",
      time: "10.00 - 13.00 WIB",
      venue: "Kediaman Keluarga Pratama",
      address: "Jl. Kenanga Indah No. 7, Cimahi",
      mapsUrl: "https://maps.google.com/?q=Cimahi",
    },
  ],
  story: [
    {
      year: "2021",
      title: "Awal Bertemu",
      desc: "Kami bertemu di sebuah acara keluarga. Obrolan singkat hari itu menjadi awal dari cerita panjang yang tidak pernah kami duga.",
    },
    {
      year: "2023",
      title: "Menjalin Komitmen",
      desc: "Setelah saling mengenal keluarga dan melewati banyak cerita bersama, kami memantapkan hati untuk melangkah lebih serius.",
    },
    {
      year: "2025",
      title: "Lamaran",
      desc: "Dengan restu kedua keluarga, hari lamaran menjadi momen hangat yang mempertemukan doa, harapan, dan kebahagiaan.",
    },
    {
      year: "2026",
      title: "Hari Bahagia",
      desc: "Kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan mendoakan langkah baru kami sebagai pasangan suami istri.",
    },
  ],
  gallery: [
    "/assets/CoverPasangan.png",
    "/assets/catin_wanita.jpg",
    "/assets/catin_pria.jpg",
  ],
  qrisImage: "/assets/qris-dummy.svg",
  bankAccounts: [
    {
      bank: "BCA",
      name: "Dimas Pratama",
      number: "1234567890",
    },
    {
      bank: "Mandiri",
      name: "Salsa Kirana",
      number: "1400012345678",
    },
    {
      bank: "BNI",
      name: "Keluarga Besar Pratama",
      number: "0098765432",
    },
  ],
};
