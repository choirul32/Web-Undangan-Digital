# 📋 Analisis Fitur – Web Undangan Digital (NusaInvite)

> Dokumen ini dibuat otomatis berdasarkan analisis codebase pada **19 Juni 2026**.  
> Versi aplikasi: `0.1.0` · Framework: **Next.js 14** · Database: **Supabase**

---

## 📌 Ringkasan Eksekutif

**NusaInvite** adalah platform SaaS undangan digital berbasis web dengan nuansa Nusantara modern. Platform ini dioperasikan secara **manual oleh admin** – customer order via WhatsApp, admin yang mengerjakan undangan, lalu mempublishnya. Platform mencakup:

- **Landing Page Publik** – showcase produk, katalog template, dan pricelist
- **Dashboard Admin** – workspace pengelolaan undangan & customer
- **Halaman Undangan Publik** – tampilan undangan untuk tamu
- **Sistem Template** – universal template engine berbasis design config

---

## 🏗️ Arsitektur Sistem

### Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Database | Supabase (PostgreSQL) |
| State Management | Zustand + React State |
| Styling | Tailwind CSS + CSS Variables |
| Animasi | Framer Motion |
| Peta | Leaflet + React Leaflet |
| Animasi Lottie | lottie-react |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| Deployment | Vercel |

### Struktur Halaman (App Router)

```
/                       → Landing Page (DigitalInvitationLanding)
/login                  → Halaman Login Admin
/dashboard              → Dashboard Overview
/dashboard/invitations  → Daftar Undangan
/dashboard/invitations/[slug] → Detail/Edit Undangan
/dashboard/templates    → Template Admin
/dashboard/guests       → Guest Manager
/dashboard/settings     → Pengaturan Platform
/preview                → Pratinjau Template (Admin)
/u/[slug]               → Undangan Publik (Tamu)
/u/[slug]/to/[guest]    → Undangan Personal Tamu
```

### Alur Data

```
Customer → WhatsApp → Admin Dashboard → Buat Order → Edit Konten → Publish → URL Publik
                                                ↕
                                          Supabase DB
```

---

## 🌐 Fitur 1: Landing Page Publik

**File:** `src/components/DigitalInvitationLanding.jsx`

### Komponen & Fitur

| Komponen | Deskripsi | Status |
|----------|-----------|--------|
| **Navbar** | Fixed sticky navbar dengan link navigasi & CTA WhatsApp | ✅ Implementasi |
| **Hero Section** | Headline, CTA button, trust badge, hero carousel template | ✅ Implementasi |
| **Hero Carousel** | Slideshow template dari API `/api/templates`, auto-rotate 3.8 detik | ✅ Implementasi |
| **Stats Section** | 500+ kabar bahagia, 20K+ tamu, 1 hari pengerjaan, 24 jam support | ✅ Hardcoded |
| **Features Section** | 8 fitur utama: Nama Tamu, RSVP, Akad & Resepsi, Amplop, Gallery, Doa, Love Story, QR Check In | ✅ Implementasi |
| **Catalog Section** | Grid katalog template dengan filter kategori, diambil dari API | ✅ Implementasi |
| **Pricing Section** | 3 paket: Basic (Rp 45K), Premium (Rp 90K), Exclusive (Rp 149K) | ✅ Hardcoded |
| **Steps Section** | 4 langkah order: Pilih Desain → Kirim Data → Preview Revisi → Siap Sebar | ✅ Implementasi |
| **FAQ Section** | 4 pertanyaan umum sebagai `<details>` accordion | ✅ Implementasi |
| **Footer** | Copyright & WhatsApp CTA | ✅ Implementasi |

### Paket Harga

| Paket | Harga | Fitur Utama |
|-------|-------|-------------|
| Basic | Rp 45.000 | Detail acara, profil mempelai, Google Maps, Gallery foto, Masa aktif 3 bulan |
| **Premium** *(Best Seller)* | Rp 90.000 | + Custom nama tamu, RSVP, Amplop digital, Love story, Backsound music |
| Exclusive | Rp 149.000 | + QR check in, Video gallery, Unlimited revisi, Masa aktif 1 tahun |

> ⚠️ **Catatan:** Harga dan stats bersifat **hardcoded** di komponen, bukan dari database/CMS.

---

## 🎛️ Fitur 2: Dashboard Admin

**File:** `src/components/Dashboard.jsx`

### Sidebar Navigation

| Menu | Route | Fitur |
|------|-------|-------|
| Overview | `/dashboard` | Ringkasan metrik & aktivitas |
| Undangan | `/dashboard/invitations` | Daftar semua order |
| Template | `/dashboard/templates` | Kelola template desain |
| Tamu | `/dashboard/guests` | Guest manager global |
| Pengaturan | `/dashboard/settings` | Konfigurasi platform |

### Sidebar Features
- **Collapsible** – bisa dipersempit ke icon-only mode
- **State Persistence** – posisi collapse disimpan di localStorage (`nusa-invite:sidebar-collapsed`)
- **Badge Count** – menampilkan jumlah undangan dan template
- **Workflow Card** – menampilkan info "Manual WA Order" workflow

### Dashboard Overview (Halaman Utama)

#### Metric Cards (4 card)
1. **Total Undangan** – jumlah semua order + aktif bulan ini
2. **Published** – jumlah undangan terpublikasi
3. **Menunggu Pembayaran** – perlu follow-up
4. **Total RSVP Pax** – estimasi tamu hadir

#### Komponen Lainnya
- **Invitation Table** – tabel preview undangan terbaru
- **RSVP Snapshot Card** – ringkasan hadir/tidak hadir/belum RSVP
- **Quick Actions Card** – shortcut aksi umum
- **Template Highlights** – sorotan template populer
- **Activity Feed** – feed aktivitas terbaru
- **Alert Strip** – notifikasi pending order

### Theme System
- **Mode:** Light / Dark / System (ikut preferensi OS)
- **Palette:** 5 pilihan warna – Royal Gold, Ocean Mist, Terracotta Calm, Sage Olive, Slate Neutral
- **Persistence:** Disimpan di localStorage, dipancarkan via Custom Event `nusa-invite:settings-updated`

---

## 📋 Fitur 3: Manajemen Undangan (Invitation Workspace)

**File:** `src/components/dashboard/InvitationForm.jsx`

### Alur Pembuatan Order (4 Step)

```
Step 0: Data Pemesan → Step 1: Template & Slug → Step 2: Data Mempelai → Step 3: Fitur & Review
```

#### Step 0 – Data Pemesan (Order Info)
| Field | Tipe |
|-------|------|
| Nama Pemesan | Text |
| Nomor WhatsApp | Text |
| Status Order | Select: inquiry, waiting_payment, paid, in_progress, review, revision, approved, published, completed, cancelled |
| Lifecycle Undangan | Select: draft, review, published, archived |
| Status Pembayaran | Select: unpaid, waiting_confirmation, paid, refunded |
| Nominal Order | Number |
| Deadline | Date |
| Catatan Konsep | Textarea |
| Catatan Pembayaran | Textarea |

#### Step 1 – Template & Publikasi
| Field | Tipe |
|-------|------|
| Template | Select (dari API `/api/templates?scope=admin`) |
| Paket | Select: Basic, Premium, Exclusive |
| Slug Publik | Text (lowercase, angka, minus) |
| URL Preview | Auto-generated dari slug |

#### Step 2 – Data Mempelai
| Field | Tipe |
|-------|------|
| Nama Lengkap Pria | Text |
| Nama Panggilan Pria | Text (auto-fill dari nama pertama) |
| Nama Orang Tua Pria | Text |
| Nama Lengkap Wanita | Text |
| Nama Panggilan Wanita | Text (auto-fill dari nama pertama) |
| Nama Orang Tua Wanita | Text |
| Quote / Doa Pembuka | Textarea |

#### Step 3 – Fitur Toggle
| Fitur | Tipe |
|-------|------|
| RSVP | Toggle |
| Amplop Digital | Toggle |
| Backsound Music | Toggle |
| Custom Nama Tamu | Toggle |

### Aksi Undangan
| Aksi | Deskripsi |
|------|-----------|
| **Simpan Draft** | POST ke `/api/invitations` dengan validasi per-step |
| **Tandai Review** | Update status → review, siap dikirim preview ke customer |
| **Publish** | Jalankan publish guard → update status → published |
| **Arsip** | Update status → archived |
| **Copy Link** | Copy public URL ke clipboard |

### Workspace Tab (Setelah Draft Tersimpan)

| Tab | Modul |
|-----|-------|
| Informasi Utama | InvitationForm |
| Acara | ContentManagers (MultiEventManager) |
| Cerita | ContentManagers (StoryManager) |
| Amplop | ContentManagers (BankAccountManager) |
| Media | MediaManager |
| Tamu | GuestManager |
| RSVP | RSVPManager |

---

## 📅 Fitur 4: Manajemen Acara (Event Manager)

**File:** `src/components/dashboard/ContentManagers.jsx` → `MultiEventManager`

| Fitur | Deskripsi |
|-------|-----------|
| **Tambah/Edit/Hapus Acara** | CRUD lengkap per-acara (Akad, Resepsi, dll) |
| **Multiple Events** | Bisa multiple rangkaian acara dalam satu undangan |
| **Urutan Drag/Manual** | Tombol Up/Down untuk reorder acara |
| **Map Location Picker** | Pilih titik lokasi dari peta Leaflet interaktif |
| **Validasi** | Judul, tanggal, jam, venue wajib diisi; maps URL opsional dengan warning |
| **Sort Order Sync** | Urutan disimpan ke backend via `PUT /api/events` |

**Fields:** Judul acara, Tanggal, Jam, Venue, Alamat, Google Maps URL

---

## 💌 Fitur 5: Love Story Manager

**File:** `src/components/dashboard/ContentManagers.jsx` → `StoryManager`

| Fitur | Deskripsi |
|-------|-----------|
| **CRUD Cerita** | Tambah, edit, hapus timeline love story |
| **Urutan Manual** | Tombol Up/Down untuk reorder |
| **Fields** | Tahun, Judul cerita, Deskripsi |
| **Validasi** | Judul dan deskripsi wajib diisi |

---

## 💰 Fitur 6: Amplop Digital (Bank Account Manager)

**File:** `src/components/dashboard/ContentManagers.jsx` → `BankAccountManager`

| Fitur | Deskripsi |
|-------|-----------|
| **CRUD Rekening** | Tambah, edit, hapus rekening bank |
| **Bank Catalog** | Pilihan bank dari katalog terpusat (API `/api/banks`) |
| **Auto Logo** | Logo bank otomatis dari katalog + fallback ke nama saja |
| **Fields** | Nama Bank, Nama Rekening, Nomor Rekening |
| **Warning** | Peringatan jika bank belum punya logo |

---

## 🖼️ Fitur 7: Media Manager

**File:** `src/components/dashboard/MediaManager.jsx`

| Fitur | Deskripsi |
|-------|-----------|
| **Upload Foto** | Upload gambar cover, gallery foto |
| **Upload Audio** | Upload backsound/musik pernikahan |
| **Upload Video** | Upload video gallery |
| **Tab Filter** | Cover / Gallery / Music / Video |
| **Replace Mode** | Ganti file tanpa hapus entri lama |
| **Delete** | Hapus media dari undangan |
| **Preview** | Thumbnail gambar, player audio built-in |

**API:** `POST/DELETE /api/media` dengan FormData

---

## 👥 Fitur 8: Guest Manager

**File:** `src/components/dashboard/GuestManager.jsx`

### Fitur Manajemen Tamu

| Fitur | Deskripsi |
|-------|-----------|
| **Tambah/Edit/Hapus Tamu** | CRUD individual tamu |
| **Group System** | Keluarga, Teman, Kantor, VIP + custom group |
| **Personal Link** | URL unik per tamu: `/u/[slug]/to/[guest-slug]` |
| **Filter** | Filter berdasarkan group dan status RSVP |
| **Nomor WA** | Simpan nomor WhatsApp tamu |

### Fitur WhatsApp Broadcast (Manual)

| Fitur | Deskripsi |
|-------|-----------|
| **Template WA** | Template teks kustom dengan token `{guest_name}`, `{guest_link}`, `{invitation_slug}` |
| **Copy Link Per Tamu** | Copy personal link ke clipboard |
| **Copy Teks WA** | Copy pesan WA yang sudah diformat |
| **Open WA Direct** | Buka wa.me langsung ke nomor tamu |
| **Bulk Copy Links** | Copy semua nama + link sekaligus (Tab-separated) |
| **Bulk Copy WA** | Copy semua teks WA sekaligus |
| **Export CSV** | Export nama, group, WA, RSVP status, personal link ke file CSV |

### Fitur Bulk Import Tamu

| Format | Deskripsi |
|--------|-----------|
| Text per baris | Format: `Nama Tamu, Group, Nomor WA` |
| CSV/Tab-separated | Dua format dukungan input |
| Dedup otomatis | Tamu dengan slug yang sama dilewati |

---

## 📊 Fitur 9: RSVP Manager

**File:** `src/components/dashboard/RSVPManager.jsx`

### Summary Cards (4 kartu)
1. **Hadir** – jumlah RSVP hadir
2. **Tidak Hadir** – jumlah RSVP tidak hadir
3. **Belum RSVP** – dari daftar tamu aktif yang belum respond
4. **Pax Hadir** – total estimasi pax yang hadir

### Fitur Analitik

| Fitur | Deskripsi |
|-------|-----------|
| **Smart Summary** | Response rate % dari target tamu |
| **Group Breakdown** | Ringkasan per-group: total undangan, responded, hadir, pax |
| **Pesan Terbaru** | 3 ucapan/pesan terbaru dari tamu |
| **Filter** | Filter by: status kehadiran, group, tanggal RSVP |
| **Export CSV** | Export data RSVP ke CSV dengan filter aktif |

### Tabel RSVP
Kolom: Nama Tamu, Group, Status Hadir, Pax, Ucapan/Pesan, Waktu RSVP

---

## 🎨 Fitur 10: Template Admin

**File:** `src/components/dashboard/TemplateAdmin.jsx` (83KB – terbesar di codebase)

Template admin adalah editor desain interaktif untuk mengkonfigurasi tampilan undangan.

### Fungsi Utama
- Buat, edit, duplicate, dan hapus template
- Konfigurasi desain per-section (cover, couple, acara, countdown, gallery, dll)
- Preview template real-time (framed mobile preview)
- Kontrol ornamen animasi (logo, Lottie, SVG)
- Export/Import konfigurasi JSON

---

## ⚙️ Fitur 11: Pengaturan Platform (Settings)

**File:** `src/components/dashboard/SettingsPage.jsx`

### Section: Profil Bisnis
| Field | Default |
|-------|---------|
| Nama Brand | Nusa Event Organizer |
| Nomor WhatsApp Admin | 6281234567890 |
| Email Kontak | hello@nusaevent.com |

### Section: Default Teks
- **Pesan Broadcast Default** – template pesan dengan token `[Nama Tamu]` dan `[Link Undangan]`
- **Instruksi Pembayaran Manual** – template instruksi pembayaran

### Section: Katalog Bank
- Kelola daftar bank dan logo yang tersedia untuk amplop digital

### Section: Preferensi Sistem
| Setting | Pilihan |
|---------|---------|
| Zona Waktu | WIB / WITA / WIT |
| Format Tanggal | DD MMMM YYYY / DD/MM/YYYY / MMMM DD, YYYY |
| Tema Dashboard | Terang / Gelap / Sistem |
| Palet Warna | Royal Gold / Ocean Mist / Terracotta Calm / Sage Olive / Slate Neutral |
| Auto-Save Draft | Toggle |

### Section: Integrasi & Operasional
- **Email Gateway** – Status aktif/nonaktif (via SendGrid – simulasi)
- **WhatsApp API** – Status aktif/nonaktif (via Wablas – simulasi)
- **Catatan Internal** – Textarea khusus admin
- **Test Link WA Order** – Preview link WhatsApp order

> ⚠️ **Catatan:** Semua pengaturan disimpan di **localStorage** (`nusa-invite:platform-settings`), bukan di database.

---

## 🎴 Fitur 12: Template Engine (Universal Template)

**File:** `src/templates/UniversalTemplate.jsx`

### Sections yang Di-render

| Section | Komponen | Keterangan |
|---------|----------|------------|
| **Opening Reveal** | OpeningRevealOverlay | Layar tunggu "Buka Undangan" |
| **Home / Cover** | HomeSection | Foto pasangan, nama, countdown tanggal |
| **Couple** | CoupleSection | Profil mempelai pria & wanita |
| **Acara** | EventSection | Daftar rangkaian acara |
| **Countdown** | CountdownSection | Timer countdown hari-H |
| **Love Story** | StorySection | Timeline cerita cinta |
| **Gallery** | GallerySection | Foto-foto gallery |
| **Amplop/Gift** | GiftSection | Daftar rekening bank |
| **RSVP** | RsvpSection | Form konfirmasi kehadiran tamu |
| **Doa & Ucapan** | WishesSection | Ucapan dari tamu |

### Opening Reveal Animation Variants
- `fade` – Fade in/out
- `zoom` – Zoom masuk
- `curtain` – Efek tirai (wayang/slide-left)
- `paper` – Pop-up kertas

### Design Config System
Setiap template memiliki konfigurasi `designConfig` dengan struktur:
```json
{
  "canvas": {},      // Warna global, font
  "sections": {},    // Config per-section (home, couple, dll)
  "ornaments": {},   // Ornamen dekoratif per section
  "widgets": {},     // Config widget khusus (openingReveal, music)
  "animations": {}   // Preset animasi entrance & loop
}
```

### Music Player
- Auto-play saat scroll pertama (tanpa opening reveal)
- Fade-in volume saat undangan dibuka
- Kontrol play/pause floating
- Support file audio upload dari MediaManager

---

## 🔐 Fitur 13: Autentikasi

**File:** `src/lib/auth.js`, `src/app/api/auth/`

| Fitur | Deskripsi |
|-------|-----------|
| Login | Email + Password via Supabase Auth |
| Dev Mode | Mode khusus development (tanpa Supabase) |
| Middleware | Proteksi route `/dashboard/**` |
| Logout | POST ke `/api/auth/logout`, redirect ke `/login` |
| Session | Cookie-based session via Supabase |

---

## 🌍 Fitur 14: Halaman Undangan Publik

**Routes:** `/u/[slug]` dan `/u/[slug]/to/[guest-slug]`

| Fitur | Deskripsi |
|-------|-----------|
| **Undangan Personal** | URL berbeda per tamu: `/u/slug/to/nama-tamu` |
| **Nama Tamu Custom** | Salam personal muncul di opening/cover |
| **RSVP Form** | Tamu bisa konfirmasi hadir/tidak, isi jumlah pax dan ucapan |
| **Amplop Digital** | Rekening bank dengan tombol copy |
| **Gallery** | Foto-foto prewedding |
| **Google Maps** | Tombol buka maps |
| **Countdown** | Timer countdown hari-H |
| **Backsound** | Auto-play musik setelah interaksi pertama |
| **Loading State** | Komponen loading saat data diambil |

---

## 🔌 Fitur 15: API Endpoints

| Endpoint | Method | Fungsi |
|----------|--------|--------|
| `/api/auth/login` | POST | Login admin |
| `/api/auth/logout` | POST | Logout |
| `/api/dashboard/stats` | GET | Statistik dashboard |
| `/api/invitations` | GET, POST | Daftar & buat undangan |
| `/api/invitations/[slug]` | GET, PATCH, DELETE | Detail, update, hapus |
| `/api/templates` | GET, POST | Daftar & buat template |
| `/api/templates/[id]` | GET, PATCH, DELETE | Detail, update, hapus template |
| `/api/guests` | GET, POST, PUT, DELETE | CRUD tamu |
| `/api/rsvps` | GET, POST | Baca & simpan RSVP |
| `/api/events` | GET, POST, PUT, DELETE | CRUD acara |
| `/api/stories` | GET, POST, PUT, DELETE | CRUD love story |
| `/api/bank-accounts` | GET, POST, PUT, DELETE | CRUD rekening |
| `/api/banks` | GET, POST, PUT, DELETE | CRUD katalog bank |
| `/api/media` | GET, POST, DELETE | CRUD media upload |
| `/api/public/[slug]` | GET | Data undangan publik |

---

## 📊 Status Implementasi Fitur

### ✅ Sudah Berjalan
- Landing page dengan animasi Framer Motion
- Dashboard admin multi-page
- CRUD undangan (form 4-step)
- Manajemen acara dengan map picker
- Love Story timeline management
- Amplop digital dengan bank catalog
- Media manager (foto, audio, video)
- Guest manager dengan personal links
- WhatsApp broadcast (manual copy/export)
- Bulk import tamu
- RSVP tracking & analytics
- Template admin editor
- Universal template rendering engine
- Opening reveal overlay (4 variant)
- Backsound music player
- Dashboard theme & palette switcher
- Login/logout auth
- Supabase integration (dengan fallback lokal)

### ⚠️ Masih Simulasi / Perlu Perhatian
- **Integrasi WA API** – toggle di Settings tapi tidak ada koneksi nyata ke Wablas
- **Email Gateway** – UI ada, backend belum terhubung ke SendGrid
- **Settings di localStorage** – semua pengaturan platform tersimpan lokal, tidak di DB
- **Stats Landing Page** – angka 500+, 20K+ adalah hardcoded, bukan dari DB
- **QR Check In** – disebutkan di fitur paket Exclusive tapi belum ada implementasi
- **Catalog pada Landing Page** – mengandalkan data template dari DB, jika DB kosong catalog kosong

### ❌ Belum Ada Implementasi
- **Notifikasi Real-time** – tidak ada websocket/realtime push
- **Payment Gateway** – tidak ada integrasi pembayaran otomatis
- **Email Notification** – belum ada email ke customer saat status berubah
- **Multi-admin/Role** – satu admin saja, tidak ada role management
- **Analitik Kunjungan** – tidak ada tracking pageview undangan
- **QR Code Generator** – disebutkan di fitur tapi belum diimplementasi

---

## 🔎 Temuan & Rekomendasi

### 🔴 Prioritas Tinggi

1. **Simpan Settings ke Supabase** – Saat ini settings platform tersimpan di localStorage, sehingga hilang saat browser dibersihkan atau berganti device. Perlu tabel `platform_settings` di Supabase.

2. **Validasi Slug Duplikasi di Backend** – Slug undangan harus unik di level database constraint, bukan hanya di frontend.

3. **RSVP Real-time** – Saat ini RSVP hanya bisa dilihat jika admin refresh halaman. Pertimbangkan Supabase Realtime subscription.

### 🟡 Prioritas Sedang

4. **QR Check-In Implementation** – Fitur ini disebutkan di landing page (paket Exclusive) tapi belum diimplementasi. Perlu QR code generator dan scanner.

5. **Notifikasi Email/WA Auto** – Ketika customer submit RSVP atau order status berubah, kirim notifikasi otomatis.

6. **Analytics Per-Undangan** – Tracking berapa kali undangan dibuka, dari mana traffic-nya.

7. **Mobile Responsive Dashboard** – Sidebar masih tersembunyi di mobile (`hidden lg:block`), tidak ada mobile navigation.

### 🟢 Prioritas Rendah / Enhancement

8. **Export PDF Undangan** – Cetak/save undangan sebagai PDF untuk arsip.

9. **Countdown Live Preview** – Preview countdown real-time saat admin edit tanggal acara.

10. **Template Marketplace** – Biarkan template bisa dijual atau dibagikan antar pengguna.

---

## 📁 File Penting untuk Referensi

| File | Ukuran | Deskripsi |
|------|--------|-----------|
| `src/components/dashboard/TemplateAdmin.jsx` | 84KB | Editor template terbesar |
| `src/components/dashboard/ContentManagers.jsx` | 33KB | CRUD acara, story, amplop |
| `src/components/dashboard/InvitationForm.jsx` | 38KB | Form 4-step buat undangan |
| `src/components/dashboard/GuestManager.jsx` | 21KB | Manajemen tamu & broadcast |
| `src/components/DigitalInvitationLanding.jsx` | 35KB | Landing page publik |
| `src/components/Dashboard.jsx` | 23KB | Shell dashboard admin |
| `src/templates/UniversalTemplate.jsx` | 9KB | Template rendering engine |
| `src/lib/invitations.js` | 7KB | Business logic undangan |
| `src/components/dashboard/config.js` | 30KB | Konfigurasi form & dashboard |

---

*Dokumen dibuat oleh Antigravity AI pada 19 Juni 2026 berdasarkan analisis source code project.*
