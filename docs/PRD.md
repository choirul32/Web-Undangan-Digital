# NusaInvite — Product Requirements Document (Retroaktif)

> Dibuat berdasarkan analisis codebase yang sudah ada. Silakan direvisi sesuai kebutuhan bisnis aktual.

---

## 1. Overview Produk

**Nama:** NusaInvite  
**Tipe:** SaaS — Wedding Digital Invitation Platform  
**Stack:** Next.js 14 + Supabase (auth, database, storage) + Tailwind CSS  
**Tema:** Budaya Nusantara  
**Status:** MVP sudah berjalan (undangan digital dengan template customizable, RSVP, manajemen tamu)

**Pain Point yang Diselesaikan:**
- Pasangan menikah butuh undangan digital cepat tanpa coding
-butuh tampilan premium dengan kustomisasi visual (template, ornamen, warna)
-Butuh sistem RSVP & manajemen tamu yang terintegrasi
-Butuh paket berbayar (Basic, Premium, Exclusive) sesuai kebutuhan

---

## 2. User Segments

| Segment | Deskripsi | Kebutuhan Utama |
|---------|-----------|-----------------|
| **Pasangan Pernikahan** | User end yang membuat undangan | Setup cepat, hasil premium, mudah di-share |
| **Admin/Operator** | Staff yang mengelola platform | Dashboard untuk buat/edit/publish undangan, atur template |

---

## 3. Core Features (Sudah Ada)

### 3.1 Landing Page Publik
- Hero carousel template otomatis
- Statistik platform (500+ undangan, 20K+ tamu, dll.)
- Showcase 8 fitur utama (Nama Tamu Personal, RSVP, Amplop Digital, dll.)
- Katalog template dengan filter kategori
- Pricing 3 tier (Basic Rp45K, Premium Rp90K, Exclusive Rp149K)
- FAQ + CTA WhatsApp

### 3.2 Sistem Autentikasi
- Login admin via email/password (Supabase Auth)
- Role check dari tabel `admin_users`
- Session management via HTTP-only cookies
- Dev mode fallback lokal

### 3.3 Dashboard Admin

#### Overview
- Metric cards (total undangan, RSVP, published, draft, pax, tamu)
- Tabel undangan dengan status workflow (Draft → Revision → Published)
- Quick create draft baru
- Activity feed

#### Invitations Management
- Full CRUD undangan
- Multi-step creation form (Template → Mempelai → Acara → Fitur → Review)
- Status workflow: `draft` → `revision` → `published`
- Slug otomatis untuk URL

#### Template Manager
- CRUD template dengan metadata (name, category, price, badge, thumbnail, dll.)
- Upload thumbnail ke Supabase Storage
- Design Config system:
  - `canvas` — pengaturan global
  - `sections` — style per section
  - `ornaments` — ornamen dekoratif
  - `widgets` — konfigurasi widget
  - `animations` — sequence animasi

#### Ornament Editor
- Upload ornamen custom
- Kontrol posisi: slot, width, height, x, y, rotate, opacity, zIndex, mirror
- Animasi loop: fade, float, sway, pulse, slow-rotate
- Entrance animation: fade-in, fade-up, zoom-in, pop-up, slide-left/right, drop-in
- Layer controls: Move Up/Down, Bring Front, Send Back
- Asset library (built-in + uploaded)

#### Widget Configuration
| Widget | Variants | Status |
|--------|----------|--------|
| Countdown | cards, minimal, circle, flip-clock, ring, neon-glow | ✅ |
| Events | cards, list, elegant, minimal, corner-bracket | ✅ |
| Love Story | card, timeline, stacked, photo-album | ✅ |
| Gallery | grid, carousel, masonry | ✅ |
| Opening Reveal | fade, zoom, slide-up, curtain, gate, paper | ✅ |

#### Guest Manager
- CRUD guest list
- Group assignment (Keluarga, Teman, Kantor, dll.)
- RSVP status tracking (Hadir, Menunggu, Belum RSVP)
- Pax count per guest

#### RSVP Manager
- Submission list
- Attendance status
- Message/doa dari tamu

#### Media Manager
- Upload/manage media assets
- Integrasi dengan Supabase Storage

#### Settings
- Konfigurasi platform

### 3.4 Undangan Publik (`/u/[slug]`)
- Template rendering berdasarkan `designConfig`
- Personalisasi nama tamu (`/to/[guestSlug]`)
- RSVP form submission
- Gift/amplop digital
- Background music
- Countdown real-time
- Gallery dengan fullscreen viewer
- Google Maps integration
- Love story timeline

### 3.5 Demo & Preview
- `/demo` — preview template client-side
- `/preview` — preview sebelum publish

---

## 4. User Flows Utama

### Flow 1: Admin Membuat Undangan
```
Login → Dashboard Overview 
→ Create New Invitation 
→ Pilih Template 
→ Isi Data Mempelai 
→ Isi Data Acara 
→ Atur Fitur (RSVP, Gift, Music, Guest Name) 
→ Review & Submit 
→ Publish
```

### Flow 2: Tamu Mengunjungi Undangan
```
Buka URL (/u/[slug] atau /u/[slug]/to/[guestSlug])
→ Lihat Opening Reveal 
→ Scroll konten (Countdown, Couple, Events, Story, Gallery, Gift, RSVP, Doa)
→ Submit RSVP (opsional)
```

### Flow 3: Upgrade Paket
```
Admin edit invitation → Paket upgrade → Bayar via WhatsApp → Admin activate
```

---

## 5. Tech Stack & Architecture

| Layer | Teknologi |
|-------|-----------|
| Frontend | Next.js 14 (App Router), React, Tailwind CSS |
| Backend | Next.js API Routes |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| State (dev) | localStorage fallback |
| Icons | Inline SVG (tidak ada dependency library) |

### Key Files Structure
```
src/
├── app/
│   ├── api/          # API routes (auth, invitations, guests, rsvps, templates, media, stories, bank-accounts, dashboard stats)
│   ├── dashboard/    # Admin pages (overview, guests, invitations, media, rsvps, settings, templates)
│   ├── u/[slug]/     # Public invitation view
│   ├── demo/         # Template demo
│   └── preview/      # Preview page
├── components/dashboard/  # Dashboard components (config, form controls, content managers, guest manager, etc.)
├── templates/        # Template system (UniversalTemplate, InvitationRenderer, designConfigs)
├── lib/supabase/     # Supabase client/server setup
└── data/             # Sample data & defaults
```

---

## 6. KPI & Metrik Utama

| Metrik | Target (opsional, sesuaikan dengan data aktual) |
|--------|----------------------------------------------|
| Jumlah undangan dibuat | - |
| Conversion rate (draft → published) | - |
| RSVP submission rate | - |
| Revenue dari paket berbayar | - |
| Waktu rata-rata setup undangan | - |

---

## 7. Roadmap 4 Minggu Kedepan

### Minggu 1 — Stabilisasi & Monetisasi
- [ ] Audit & fix bug kritis dari flow create → publish
- [ ] Integrasi payment gateway (bukan hanya WhatsApp, tapi auto-confirmation)
- [ ] Optimasi landing page conversion
- [ ] A/B test pricing page

### Minggu 2 — User Experience
- [ ] Simplifikasi multi-step form creation
- [ ] Tambah progress indicator di form
- [ ] Live preview enhancement (lebih interaktif)
- [ ] Mobile-first optimization dashboard

### Minggu 3 — Growth Features
- [ ] Email/SMS notification ke tamu (RSVP reminder)
- [ ] Analytics dashboard untuk admin
- [ ] Template baru (tema daerah lain: Sunda, Minang, dll.)
- [ ] Guest attendance tracking real-time

### Minggu 4 — Scale & Automation
- [ ] Automated welcome email setelah payment
- [ ] Export data tamu (CSV/Excel)
- [ ] Batch invitation sharing (WhatsApp Blast)
- [ ] Dokumentasi lengkap untuk admin baru

---

## 8. Tech Debt & Improvements

| Item | Prioritas | Estimasi |
|------|-----------|----------|
| pisahkan hardcoded config ke environment variables | Medium | 1-2 hari |
| Tambah unit tests untuk core functions | Medium | 3-5 hari |
| Optimasi bundle size (lazy load template components) | High | 2-3 hari |
| Cache strategy untuk template preview | Medium | 2 hari |
| Error tracking (Sentry) | Low | 1 hari |

---

## 9. Yang Belum Ada (Potensi Expansion)

| Fitur | Deskripsi |
|-------|-----------|
| Template Builder interaktif | Drag-drop section builder untuk non-technical user |
| AI Content Generator | Generate quote, story description otomatis |
| QR Code Generator | Unique QR per tamu untuk check-in |
| Live Attendance | Real-time counter kehadiran |
| Multi-language | Bahasa Inggris, Arab, dll. |
| Watermark removal | Untuk paket Exclusive |

---

## 10. Definition of Done

Fitur dianggap selesai jika:
- [ ] Code sudah di-commit
- [ ] `npm run build` sukses tanpa error
- [ ] Sudah diuji di environment staging/minimal
- [ ] Dokumentasi internal (jika perlu) sudah update
- [ ] Metrik terkait menunjukkan improvement

---

## Revision Log

| Versi | Tanggal | Perubahan |
|-------|---------|-----------|
| 1.0 | 2026-05-11 | Initial draft (retroaktif dari codebase) |
