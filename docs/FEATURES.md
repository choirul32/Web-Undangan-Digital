# NusaInvite — Dokumentasi Fitur Lengkap

Platform undangan digital pernikahan berbasis **Next.js 14** dengan tema budaya Nusantara.  
Backend menggunakan **Supabase** (auth, database, storage) dengan fallback lokal untuk development.

---

## 1. Landing Page Publik

- Hero section dengan carousel template otomatis
- Statistik platform (500+ undangan, 20K+ tamu, 1 hari pengerjaan, 24 jam support)
- Showcase 8 fitur utama:
  - Nama Tamu Personal
  - RSVP Online
  - Akad & Resepsi
  - Amplop Digital
  - Gallery Foto
  - Doa & Quotes
  - Love Story
  - QR Check In
- Katalog template dengan filter kategori (dinamis dari API)
- Pricing 3 tier:
  | Paket | Harga | Fitur Utama |
  |-------|-------|-------------|
  | Basic | Rp 45.000 | Detail acara, profil mempelai, Google Maps, gallery, aktif 3 bulan |
  | Premium | Rp 90.000 | Custom nama tamu, RSVP, amplop digital, love story, backsound |
  | Exclusive | Rp 149.000 | QR check-in, video gallery, unlimited revisi, aktif 1 tahun |
- Langkah pemesanan (4 step)
- FAQ (4 pertanyaan umum)
- CTA WhatsApp terintegrasi

---

## 2. Sistem Autentikasi

- Login admin via email/password (Supabase Auth)
- Role check terhadap tabel `admin_users`
- Session management via HTTP-only cookies (access token, refresh token, email)
- Dev mode fallback ketika Supabase tidak dikonfigurasi
- Logout dengan cookie clearing

---

## 3. Dashboard Admin

### 3.1 Overview

- Metric cards: total undangan, RSVP, published, revision, total pax, total tamu
- Tabel undangan dengan status (Published / Review / Revision / Draft)
- Quick Create: buat draft baru dengan nama pasangan + pilih template
- Template Highlights: template terlaris
- Activity Feed: aksi terbaru

### 3.2 Invitations Management

- Full CRUD undangan
- Multi-step creation form:
  1. Pilih Template
  2. Data Mempelai (nama lengkap, panggilan, quote)
  3. Data Acara (multi-event)
  4. Fitur (toggle RSVP, gift, music, guestName)
  5. Review & Submit
- Status workflow: `draft` → `revision` → `published`
- Slug otomatis untuk URL undangan
- Upsert ke Supabase (atau mode lokal)

### 3.3 Template Manager

- CRUD template (create, edit, delete)
- Metadata: id, name, category, price, badge, status, description, thumbnail, preview URL, supported features, sort order
- Upload thumbnail ke Supabase Storage
- **Design Config** terstruktur:
  - `canvas` — pengaturan global canvas
  - `sections` — style per section (background, text color, accent, font, spacing, entrance animation)
  - `ornaments` — elemen dekoratif per section
  - `widgets` — konfigurasi widget
  - `animations` — sequence animasi

#### Ornament Editor

- Upload ornamen custom ke Supabase Storage
- Kontrol posisi: slot, width, height, x, y, rotate, opacity, zIndex, mirror
- Animasi loop: none, fade, float, sway, pulse, slow-rotate
- Entrance animation: none, fade-in, fade-up, zoom-in, pop-up, slide-left, slide-right, drop-in
- Layer control: Move Up, Move Down, Bring Front, Send Back
- Asset library (built-in + uploaded dynamic assets)
- Hapus dynamic assets
- Validasi (empty src, file terlalu besar, terlalu banyak ornamen)

#### Widget Configuration

| Widget | Variants | Opsi |
|--------|----------|------|
| Countdown | cards, minimal, circle, flip-clock, ring, neon-glow | enabled, eventIndex, completeText |
| Events | cards, list, elegant, minimal, corner-bracket | enabled, showMaps, showIcon |
| Love Story | card, timeline, stacked, photo-album | enabled, 8 pilihan animasi |
| Gallery | grid, carousel, masonry | enabled, limit, includeCover, fullscreen viewer |
| Opening Reveal | fade, zoom, slide-up, curtain, gate, paper | enabled, buttonText, coverImage, background mode/image/color, autoPlayMusic |

#### Section Customization

- **Cover**: foto on/off, layout (centered/split/minimal), background image/color, opening animation, guest name block style (card/pill/minimal/hidden)
- **Couple**: foto on/off, border on/off, photo style (circle/arch/square), font preset, parent text on/off, Instagram button on/off
- **Per-section style**: background color/image, text color, accent color, font preset (default/serif/sans/script), spacing preset (compact/normal/roomy), entrance animation, global style inheritance

#### Style Presets (7 preset)

1. Elegant Fade
2. Floral Float
3. Watercolor Bloom
4. Wayang Reveal
5. Royal Gate
6. Cinematic Scroll
7. Minimal Premium

#### Animation Presets (6 preset)

1. Fade Sequence
2. Float Sequence
3. Pop Sequence
4. Side Reveal
5. Watercolor Bloom
6. Wayang Entrance

#### Live Preview

- Toggle viewport: Mobile (430px), Tablet, Desktop (scaled)
- Mode editor preview via sessionStorage

### 3.4 Guest Manager

- Tambah tamu dengan nama, slug (auto-generated), grup (Keluarga/Teman/Kantor/VIP)
- Link undangan personal: `/u/{slug}/to/{guestSlug}`
- Copy link ke clipboard
- Tabel tamu dengan tracking status RSVP
- Persist ke Supabase atau lokal

### 3.5 RSVP Manager

- Lihat semua RSVP: nama tamu, status kehadiran, jumlah pax, pesan, timestamp
- Summary stats (jumlah hadir, total pax)
- Export ke CSV
- Data real-time dari Supabase

### 3.6 Media Manager

- Upload media ke Supabase Storage (bucket: `invitation-media`)
- Tipe media: Cover, Gallery (image), Music (audio), Video
- Validasi tipe file per media type
- Grid display dengan audio player untuk file musik
- Organisasi per slug undangan

### 3.7 Content Management

- **Multi-event manager**: tambah beberapa acara (Akad, Resepsi, dll)
  - Field: title, date, time, venue, address, maps URL
- **Love Story manager**: tambah item cerita (year, title, description)
- **Bank Account manager**: tambah rekening bank/e-wallet untuk amplop digital

### 3.8 Settings

- Halaman pengaturan dashboard (placeholder untuk konfigurasi lanjutan)

---

## 4. Halaman Undangan Publik

| Route | Fungsi |
|-------|--------|
| `/u/[slug]` | Undangan full render (server-side) |
| `/u/[slug]/to/[guestSlug]` | Undangan personal dengan nama tamu |
| `/preview?templateId=xxx` | Preview admin, support mode editor |
| `/demo` | Demo template dengan sample data |

---

## 5. Template Rendering Engine (UniversalTemplate)

Section yang di-render pada setiap undangan:

1. **Opening Reveal** — Overlay interaktif "Buka Undangan" dengan animasi (curtain/gate/paper/fade/zoom/slide-up), efek split panel, background image
2. **Cover/Home** — Foto pasangan, nama mempelai, quote, blok nama tamu, background image/color, ornament layer
3. **Mempelai** — Profil foto dengan shape configurable (circle/arch/square), nama dengan font preset, teks orang tua, link Instagram
4. **Events** — Multi-event dengan 5 variant layout, tombol maps, ikon
5. **Countdown** — Timer real-time dengan 6 visual variant
6. **Love Story** — Timeline/card/stacked/photo-album dengan 8 tipe animasi
7. **Gallery** — Grid/carousel/masonry dengan fullscreen viewer
8. **Amplop Digital** — Kartu rekening bank dengan fungsi copy
9. **RSVP** — Form konfirmasi kehadiran (nama, status, pax, pesan)
10. **Doa & Ucapan** — Tampilan pesan/doa dari tamu

Setiap section mendukung:
- Ornamen custom dengan positioning dan animasi
- Style override per section (warna, font, spacing)
- Entrance animation
- Background image dengan overlay

---

## 6. Arsitektur Komponen

| Komponen | Fungsi |
|----------|--------|
| `OrnamentLayer` | Render elemen dekoratif dengan posisi dan animasi |
| `CountdownTimer` | Timer real-time dengan multiple visual variant |
| `EventWidget` | Display multi-event dengan 5 layout variant |
| `GalleryWidget` | Gallery foto dengan 3 mode layout + fullscreen |
| `StoryWidget` | Love story dengan 4 layout variant + 8 animasi |
| `RSVPForm` | Form submission RSVP tamu |

---

## 7. Infrastruktur & Data Layer

### Database (Supabase Tables)

- `invitations` — Data undangan utama
- `invitation_events` — Event per undangan
- `invitation_stories` — Love story items
- `invitation_media` — Media (foto, musik, video)
- `bank_accounts` — Rekening untuk amplop digital
- `guests` — Data tamu
- `rsvps` — Response RSVP
- `templates` — Template undangan
- `admin_users` — Admin yang berhak akses dashboard

### Storage Buckets

- `invitation-media` — Media undangan (foto, musik, video)
- `template-assets` — Asset template (ornamen, thumbnail)

### Fallback Lokal

- localStorage untuk draft undangan
- localStorage untuk template overrides
- localStorage untuk deleted template IDs
- Sample data untuk development tanpa Supabase

---

## 8. Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| UI | React 18, Tailwind CSS |
| Animasi | Framer Motion |
| Backend | Supabase (Auth, Database, Storage) |
| Deployment | Vercel-ready |

---

## 9. Model Bisnis

- Platform SaaS undangan digital untuk pasar Indonesia
- Admin-managed (klien order via WhatsApp, bukan self-service)
- Revenue dari penjualan per-undangan dengan 3 tier harga
- Template-based dengan deep customization sebagai value-add

---

## 10. Roadmap (Fitur Mendatang)

### Sudah Selesai (Phase 1–4)
- ✅ Design config schema & layer controls
- ✅ Viewport preview
- ✅ Validation warnings
- ✅ Semua widget config (countdown, events, story, gallery)
- ✅ Cover/couple section config
- ✅ Per-section style controls
- ✅ Preset system (7 preset)
- ✅ Opening cover reveal

### Dalam Pengembangan / Direncanakan
- 🔲 Gift widget config (bank/e-wallet/QRIS dengan copy button)
- 🔲 Parallax ornament effects
- 🔲 Animated custom asset presets (wayang, falling flowers, dll)
- 🔲 Interactive gallery (swipe, cinematic mode)
- 🔲 Music ambience (polished player, ornament pulse sync)
- 🔲 2.5D cover (layered parallax dengan device tilt)
- 🔲 Three.js premium widgets (3D ring/flower/card)
- 🔲 Draft/Preview/Publish workflow dengan status management
- 🔲 Versioning & rollback system
- 🔲 Per-client override (template master + customization per klien)
