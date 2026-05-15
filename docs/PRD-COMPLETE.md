# NusaInvite — Product Requirements Document (Lengkap)

> Dibuat berdasarkan analisis codebase yang sudah ada. Dokumen ini adalah panduan lengkap untuk pengembangan dan operasional platform NusaInvite.

---

## 1. Overview Produk

### 1.1 Informasi Dasar

| Field | Detail |
|-------|--------|
| **Nama Produk** | NusaInvite |
| **Tagline** | "Undangan Pernikahan Digital Premium Berbasis Budaya Nusantara" |
| **Tipe** | SaaS — Wedding Digital Invitation Platform |
| **Stack Teknologi** | Next.js 14 + Supabase (auth, database, storage) + Tailwind CSS |
| **Tema Utama** | Budaya Nusantara (Jawa, Sunda, Minang, Bali, dll.) |
| **Target Pasar** | Indonesia (dengan potensi ekspansi Asia Tenggara) |
| **Status** | MVP sudah berjalan |
| **Versi** | 1.0.0 |
| **Tanggal Rilis** | 2026-05-11 |

### 1.2 Visi & Misi

**Visi:**
Menjadi platform undangan digital pernikahan No. 1 di Indonesia dengan sentuhan budaya lokal yang autentik dan teknologi terdepan.

**Misi:**
- Menyediakan solusi undangan digital yang mudah digunakan tanpa perlu kemampuan coding
- Menawarkan desain premium dengan harga terjangkau
- Mendukung dan melestarikan budaya Nusantara melalui desain template
- Memberikan pengalaman terbaik bagi pasangan pengantin dan tamu undangan

### 1.3 Pain Points yang Diselesaikan

| Pain Point | Solusi yang Diberikan |
|------------|----------------------|
| Undangan fisik mahal dan tidak ramah lingkungan | Alternatif digital yang lebih hemat biaya |
|butuh tampilan premium dengan kustomisasi visual | Template premium dengan opsi kustomisasi lengkap |
|Butuh sistem RSVP & manajemen tamu yang terintegrasi | Sistem RSVP dan manajemen tamu dalam satu platform |
|Butuh paket berbayar sesuai kebutuhan | 3 paket harga (Basic, Premium, Exclusive) |
| Kesulitan berbagi undangan secara digital | One-click share ke WhatsApp, Instagram, dll. |
| Tidak punya kemampuan desain | Template siap pakai dengan hasil profesional |
|butuh konfirmasi kehadiran tamu | RSVP form dengan notifikasi real-time |

---

## 2. User Segments

### 2.1 User Personas

| Segment | Persona | Deskripsi | Kebutuhan Utama |
|---------|---------|-----------|------------------|
| **Primary: Pasangan Pernikahan** | Pengantin A & B | Usia 23-35 tahun, tech-savvy, ingin pernikahan berkesan | Setup cepat, hasil premium, mudah di-share |
| **Primary: Keluarga Pengantin** | Orang tua/wali | Usia 40-60 tahun, kurang familiar dengan teknologi | Simplicity, guidance yang jelas |
| **Secondary: Admin/Operator** | Staff platform | Staff yang mengelola platform | Dashboard efisien, tools management |
| **Tertiary: Tamu Undangan** | Guest | Tamu yang menerima undangan digital | Easy access, RSVP yang mudah |

### 2.2 User Journey Map

```
Pengantin: Awareness → Research → Decision → Purchase → Onboarding → Usage → Sharing
Admin: Login → Dashboard → Create/Edit → Publish → Monitor → Support
Tamu: Receive Invite → Open → View → RSVP → Attend
```

### 2.3 Jumlah Estimasi User

| Metric | Target |
|--------|--------|
| Monthly Active Users (MAU) | 100+ |
| Undangan dibuat per bulan | 50+ |
| Total tamu terdaftar | 10,000+ |

---

## 3. Core Features (MVP)

### 3.1 Landing Page Publik

#### 3.1.1 Hero Section
- Carousel template otomatis (3-5 template featured)
- Headline yang compelling
- CTA button "Buat Sekarang"
- Sub-headline tentang benefits

#### 3.1.2 Statistik Platform
- Jumlah undangan dibuat
- Jumlah tamu terdaftar
- Rating/review positif
- Years of service

#### 3.1.3 Feature Showcase
8 fitur utama yang ditampilkan:
1. **Nama Tamu Personal** - Tamu merasa spesial dengan nama mereka
2. **RSVP Online** - Konfirmasi kehadiran dengan mudah
3. **Amplop Digital** - Kirim hadiah uang via transfer
4. **Musik Background** - Tambahkan nuansa romantis
5. **Countdown Timer** - Hitung mundur ke hari H
6. **Galeri Foto** - Tampilkan momen bersama
7. **Peta Lokasi** - Navigasi ke lokasi pernikahan
8. **Love Story** - Ceritakan kisah cinta kalian

#### 3.1.4 Katalog Template
- Grid display dengan thumbnail
- Filter kategori: Adat Jawa, Adat Sunda, Minimalis, Modern, Tradisional
- Preview on hover
- Badge untuk template premium/exclusive

#### 3.1.5 Pricing Section
| Paket | Harga | Features |
|-------|-------|----------|
| Basic | Rp 45.000 | Template dasar, RSVP, 1 event, no watermark |
| Premium | Rp 90.000 | Semua fitur Basic + Custom domain, analytics, priority support |
| Exclusive | Rp 149.000 | Semua fitur Premium + Template eksklusif, AI content, unlimited events |

#### 3.1.6 FAQ Section
- Accordion style FAQ
- Top 10 pertanyaan umum
- Link ke WhatsApp support

#### 3.1.7 Footer
- Social media links
- Contact info
- Terms & Privacy Policy links
- Copyright notice

### 3.2 Sistem Autentikasi

#### 3.2.1 Login Flow
- Email/password authentication (Supabase Auth)
- Role-based access control
- Session management via HTTP-only cookies
- Remember me functionality
- Forgot password flow

#### 3.2.2 Role Management
| Role | Permissions |
|------|-------------|
| super_admin | Full access, manage admins, view all data |
| admin | Manage invitations, templates, guests |
| viewer | Read-only access to dashboard |

#### 3.2.3 Security Measures
- Password hashing (bcrypt via Supabase)
- Rate limiting pada login attempts
- Session timeout (24 jam)
- CSRF protection
- XSS prevention

### 3.3 Dashboard Admin

#### 3.3.1 Overview Dashboard
- **Metric Cards:**
  - Total undangan (semua status)
  - Total RSVP submissions
  - Undangan published
  - Undangan draft
  - Total pax (kapasitas tamu)
  - Total tamu terdaftar

- **Undangan Table:**
  - Kolom: Nama couple, slug, status, created date, actions
  - Filter by status
  - Sort by date/name
  - Quick actions: Edit, Preview, Publish, Delete

- **Activity Feed:**
  - Recent RSVP submissions
  - New invitations created
  - Status changes
  - Real-time updates

- **Quick Actions:**
  - Create new draft button
  - Quick link ke invitations list

#### 3.3.2 Invitations Management

**Multi-step Creation Form:**

```
Step 1: Template Selection
├── Browse template gallery
├── Filter by category
├── Preview template
└── Select template

Step 2: Couple Information
├── Male partner name & photo
├── Female partner name & photo
├── Couple nickname
├── Love story intro
└── Social media links

Step 3: Event Details
├── Event name (Akad, Resepsi, dll.)
├── Date & time
├── Venue name & address
├── Google Maps embed
├── Dress code (optional)
└── Additional notes

Step 4: Feature Configuration
├── Enable/disable widgets
├── RSVP settings
├── Gift/amplop digital setup
├── Music upload
├── Guest name personalization
└── Color scheme

Step 5: Review & Submit
├── Preview complete invitation
├── Edit any section
├── Select package tier
└── Submit/Publish
```

**Status Workflow:**
```
draft → revision → published
         ↓
      archived
```

**Slug Generation:**
- Format: `{couple-nickname}-{date}`
- Contoh: `andi-sari-2026-06-15`
- Auto-generate dengan opsi edit manual
- Unique constraint check

#### 3.3.3 Template Manager

**Template CRUD:**
- Create new template
- Edit template metadata
- Delete template (soft delete)
- Duplicate template

**Template Metadata:**
```json
{
  "id": "uuid",
  "name": "Template Name",
  "category": "adat-jawa|adat-sunda|minimalis|modern|tradisional",
  "price": 0|45000|90000|149000,
  "badge": "basic|premium|exclusive",
  "thumbnail": "url",
  "designConfig": { ... },
  "isActive": true|false,
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

**Design Config System:**

| Component | Deskripsi | Fields |
|-----------|-----------|--------|
| `canvas` | Pengaturan global | width, height, background, fontFamily, primaryColor, secondaryColor |
| `sections` | Style per section | order, visibility, style per section |
| `ornaments` | Ornamen dekoratif | slot, type, src, position, size, animation |
| `widgets` | Konfigurasi widget | type, variant, content, style |
| `animations` | Sequence animasi | trigger, type, duration, delay |

#### 3.3.4 Ornament Editor

**Ornament Types:**
- Frame corners
- Divider lines
- Background patterns
- Icon decorations
- Photo frames

**Position Controls:**
| Property | Type | Range |
|----------|------|-------|
| slot | string | top-left, top-center, top-right, bottom-left, bottom-center, bottom-right, center |
| width | number | 0-100% |
| height | number | 0-100% |
| x | number | -100 to 100 (offset) |
| y | number | -100 to 100 (offset) |
| rotate | number | 0-360 degrees |
| opacity | number | 0-1 |
| zIndex | number | 0-100 |
| mirror | boolean | true/false |

**Loop Animations:**
- `fade` - Opacity fade in/out
- `float` - Floating up/down
- `sway` - Gentle side movement
- `pulse` - Scale pulse
- `slow-rotate` - Slow rotation

**Entrance Animations:**
- `fade-in` - Fade from transparent
- `fade-up` - Fade + slide up
- `zoom-in` - Scale from small
- `pop-up` - Bounce pop
- `slide-left` - Slide from left
- `slide-right` - Slide from right
- `drop-in` - Drop from top

**Layer Controls:**
- Move Up
- Move Down
- Bring to Front
- Send to Back

**Asset Library:**
- Built-in ornaments (50+ items)
- Uploaded custom ornaments
- Categorized by style/theme

#### 3.3.5 Widget Configuration

| Widget | Variants | Description |
|--------|----------|-------------|
| **Countdown** | cards, minimal, circle, flip-clock, ring, neon-glow | Countdown timer ke hari H |
| **Events** | cards, list, elegant, minimal, corner-bracket | Detail acara pernikahan |
| **Love Story** | card, timeline, stacked, photo-album | Cerita cinta pasangan |
| **Gallery** | grid, carousel, masonry | Galeri foto prewedding/couple |
| **Opening Reveal** | fade, zoom, slide-up, curtain, gate, paper | Animasi pembuka undangan |
| **RSVP Form** | simple, detailed, wedding-card | Form konfirmasi kehadiran |
| **Gift** | card, envelope, bank-transfer | Amplop digital |
| **Music Player** | bar, floating, hidden | Background music |
| **Map** | embed, interactive | Lokasi pernikahan |
| **Quote** | static, typewriter | Kata-kata romantic |
| **Protection** | blur, password | Proteksi konten |

#### 3.3.6 Guest Manager

**Guest Data Model:**
```json
{
  "id": "uuid",
  "invitationId": "uuid",
  "name": "Nama Tamu",
  "slug": "unique-slug",
  "group": "Keluarga|Teman|Kantor|dll",
  "pax": 1,
  "rsvpStatus": "pending|confirmed|declined|waitlist",
  "plusOnes": 0,
  "notes": "optional notes",
  "createdAt": "timestamp"
}
```

**Features:**
- Bulk import via CSV
- Export to CSV/Excel
- Group filtering
- Search by name
- RSVP status tracking
- Pax count management

#### 3.3.7 RSVP Manager

**RSVP Submission Data:**
```json
{
  "id": "uuid",
  "invitationId": "uuid",
  "guestId": "uuid",
  "guestName": "string",
  "attendance": "hadir|tidak_hadir|maybe",
  "pax": 1,
  "message": "string (optional)",
  "submittedAt": "timestamp"
}
```

**Dashboard Features:**
- Submission list with filters
- Export submissions to CSV
- Attendance summary (chart)
- Message/doa display
- Real-time notification

#### 3.3.8 Media Manager

**Supported Media:**
- Images: JPG, PNG, WEBP (max 5MB)
- Audio: MP3 (max 10MB)
- Documents: PDF (for invitation cards)

**Storage Structure:**
```
/invitations/{invitationId}/
  /photos/
  /music/
  /documents/
```

**Features:**
- Drag & drop upload
- Multi-file upload
- Image compression
- Thumbnail generation
- Delete with confirmation

#### 3.3.9 Settings Page

**Platform Settings:**
- Site name & logo
- Contact information
- Social media links
- Email templates
- Default values

**Payment Settings:**
- Bank account information
- Payment instructions
- WhatsApp number for payment

### 3.4 Undangan Publik

#### 3.4.1 Public URL Structure
- `/u/[slug]` - Umum (tanpa nama tamu)
- `/u/[slug]/to/[guestSlug]` - Personal (dengan nama tamu)

#### 3.4.2 Template Rendering
- SSR/SSG untuk SEO
- Responsive design (mobile-first)
- Fast loading (target < 3 detik)
- Offline-friendly (PWA ready)

#### 3.4.3 Available Widgets (Frontend)

| Widget | Features |
|--------|----------|
| Opening Reveal | Animasi pembuka, skip button |
| Countdown | Real-time countdown, customizable style |
| Couple Profile | Foto, nama, tagline |
| Events | Date, time, venue, dress code |
| Love Story | Timeline dengan foto |
| Gallery | Lightbox, fullscreen viewer |
| RSVP Form | Input nama, attendance, jumlah pax, pesan |
| Gift | Bank info, copy account number |
| Map | Google Maps embed, direction link |
| Music | Auto-play toggle, volume control |
| Protection | Password protection, age gate |

#### 3.4.4 Sharing Features
- WhatsApp share button
- Instagram story link
- Copy link button
- QR code generation (per tamu)

### 3.5 Demo & Preview

| Page | Route | Purpose |
|------|-------|---------|
| Demo | `/demo` | Client-side template preview |
| Preview | `/preview` | Full invitation preview sebelum publish |
| Public | `/u/[slug]` | Published invitation view |

---

## 4. User Flows Detail

### 4.1 Flow 1: Admin Membuat Undangan

```
┌─────────────────────────────────────────────────────────────────────┐
│                        LOGIN                                        │
│                           │                                        │
└───────────────────────────┼────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     DASHBOARD OVERVIEW                              │
│  • View metrics                                                        │
│  • See recent activity                                                 │
│                           │                                        │
└───────────────────────────┼────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   CREATE NEW INVITATION                              │
│                           │                                        │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  │
│  │Step 1   │→ │Step 2   │→ │Step 3   │→ │Step 4   │→ │Step 5   │  │
│  │Template │  │Couple   │  │Events   │  │Features │  │Review   │  │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘  │
│                           │                                        │
└───────────────────────────┼────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     SAVE AS DRAFT                                    │
│                           │                                        │
└───────────────────────────┼────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     PREVIEW INVITATION                              │
│  • Check all widgets                                                  │
│  • Test responsiveness                                               │
│  • Verify content                                                     │
│                           │                                        │
└───────────────────────────┼────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       PUBLISH                                        │
│  • Select package tier                                               │
│  • Confirm payment (if premium/exclusive)                           │
│  • Activate invitation                                               │
│                           │                                        │
└───────────────────────────┼────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     SHARE INVITATION                                 │
│  • Generate guest links                                              │
│  • Share via WhatsApp                                                 │
│  • Print QR codes                                                    │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.2 Flow 2: Tamu Mengunjungi Undangan

```
┌─────────────────────────────────────────────────────────────────────┐
│                    RECEIVE INVITATION LINK                           │
│  Via WhatsApp / Instagram / Line / Direct Link                       │
└───────────────────────────┬────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       OPEN LINK                                      │
│                           │                                        │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                   │
│  │If Password │  │If Age Gate│  │If General  │                   │
│  │Protected   │→ │Enabled     │→ │Access      │                   │
│  └────────────┘  └────────────┘  └────────────┘                   │
└───────────────────────────┬────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    OPENING REVEAL ANIMATION                          │
│                           │                                        │
└───────────────────────────┼────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    SCROLL THROUGH CONTENT                            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐      │
│  │Countdown│→│Couple   │→│Events   │→│Love     │→│Gallery  │      │
│  │         │ │Profile  │ │Details  │ │Story    │ │         │      │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘      │
│       │                                                              │
│       ▼                                                              │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                    │
│  │RSVP     │→│Gift     │→│Map      │→│Closing  │                    │
│  │Form     │ │(Optional│ │Location │ │         │                    │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘                    │
└───────────────────────────┬────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     SUBMIT RSVP (Optional)                           │
│                           │                                        │
└───────────────────────────┼────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     CONFIRMATION MESSAGE                              │
│  "Terima kasih atas konfirmasinya!"                                  │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.3 Flow 3: Upgrade Paket

```
┌─────────────────────────────────────────────────────────────────────┐
│                     ADMIN EDITS INVITATION                            │
│                           │                                        │
└───────────────────────────┼────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   SELECT PACKAGE UPGRADE                              │
│  Basic → Premium → Exclusive                                          │
│                           │                                        │
└───────────────────────────┼────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     PAYMENT PROCESS                                  │
│                           │                                        │
│  ┌─────────────────┐  ┌─────────────────┐                          │
│  │Manual via WA    │  │Auto via Payment │                          │
│  │(Current)        │  │Gateway (Future) │                          │
│  └─────────────────┘  └─────────────────┘                          │
└───────────────────────────┼────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     PAYMENT CONFIRMED                                 │
│                           │                                        │
│  ┌─────────────────┐  ┌─────────────────┐                          │
│  │Manual Activate  │  │Auto Activate    │                          │
│  │(Current)        │  │(Future)         │                          │
│  └─────────────────┘  └─────────────────┘                          │
└───────────────────────────┬────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  FEATURES UNLOCKED/ACTIVATED                         │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.4 Flow 4: Guest Management

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CREATE GUEST LIST                                  │
│                           │                                        │
│  ┌─────────────────┐  ┌─────────────────┐                          │
│  │Manual Entry     │  │Bulk Import CSV  │                          │
│  └─────────────────┘  └─────────────────┘                          │
└───────────────────────────┬────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   ASSIGN GUEST GROUPS                                 │
│  Keluarga, Teman, Kantor, dll.                                       │
└───────────────────────────┬────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  GENERATE PERSONAL LINKS                             │
│  /u/slug/to/guest-slug-1                                             │
│  /u/slug/to/guest-slug-2                                             │
│  ...                                                                 │
└───────────────────────────┬────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    SHARE LINKS TO GUESTS                              │
│  Via WhatsApp Blast, individually, atau QR Code                     │
└─────────────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    TRACK RSVP RESPONSES                               │
│  Dashboard shows real-time RSVP status                               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. Technical Specifications

### 5.1 Tech Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Framework** | Next.js | 14.x | React framework with App Router |
| **Language** | JavaScript/JSX | ES2022 | Primary language |
| **Styling** | Tailwind CSS | 3.x | Utility-first CSS |
| **Database** | PostgreSQL (Supabase) | 15.x | Primary database |
| **Auth** | Supabase Auth | - | Authentication |
| **Storage** | Supabase Storage | - | Media file storage |
| **ORM** | Supabase Client | - | Database access |
| **State (dev)** | localStorage | - | Dev mode fallback |
| **Icons** | Inline SVG | - | No external dependencies |
| **Package Manager** | npm | 10.x | Dependency management |
| **Hosting** | Vercel (recommended) | - | Deployment platform |

### 5.2 Directory Structure

```
src/
├── app/
│   ├── api/                      # API Routes
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.js      # POST /api/auth/login
│   │   │   └── logout/
│   │   │       └── route.js      # POST /api/auth/logout
│   │   ├── bank-accounts/
│   │   │   └── route.js          # CRUD bank accounts
│   │   ├── dashboard/
│   │   │   └── stats/
│   │   │       └── route.js      # GET dashboard stats
│   │   ├── events/
│   │   │   └── route.js          # CRUD events
│   │   ├── guests/
│   │   │   └── route.js          # CRUD guests
│   │   ├── invitations/
│   │   │   └── route.js          # CRUD invitations
│   │   ├── media/
│   │   │   └── route.js          # Media upload/management
│   │   ├── rsvps/
│   │   │   └── route.js          # RSVP submissions
│   │   ├── stories/
│   │   │   └── route.js          # Love stories
│   │   └── templates/
│   │       ├── route.js          # Template CRUD
│   │       ├── ornaments/
│   │       │   └── upload/
│   │       │       └── route.js  # Ornament upload
│   │       └── thumbnail/
│   │           └── route.js      # Thumbnail upload
│   │
│   ├── dashboard/                # Admin Dashboard Pages
│   │   ├── page.jsx              # Overview dashboard
│   │   ├── content/
│   │   │   └── page.jsx          # Content management
│   │   ├── guests/
│   │   │   └── page.jsx          # Guest management
│   │   ├── invitations/
│   │   │   └── page.jsx          # Invitation management
│   │   ├── media/
│   │   │   └── page.jsx          # Media management
│   │   ├── rsvps/
│   │   │   └── page.jsx          # RSVP management
│   │   ├── settings/
│   │   │   └── page.jsx          # Platform settings
│   │   └── templates/
│   │       └── page.jsx          # Template management
│   │
│   ├── login/                    # Auth Pages
│   │   ├── page.jsx
│   │   └── login-form.jsx
│   │
│   ├── demo/                     # Demo Pages
│   │   └── demo-template-client.jsx
│   │
│   ├── preview/                  # Preview Pages
│   │   ├── page.jsx
│   │   └── preview-page-client.jsx
│   │
│   ├── u/                        # Public Invitation Pages
│   │   └── [slug]/
│   │       ├── page.jsx          # General invitation view
│   │       └── to/
│   │           └── [guestSlug]/
│   │               └── page.jsx  # Personalized invitation view
│   │
│   ├── layout.jsx                # Root layout
│   ├── page.jsx                  # Landing page
│   └── globals.css               # Global styles
│
├── components/                   # React Components
│   ├── Dashboard.jsx             # Main dashboard component
│   ├── DigitalInvitationLanding.jsx
│   └── dashboard/                # Dashboard Components
│       ├── config.js             # Dashboard configuration
│       ├── FormControls.jsx      # Form input components
│       ├── ContentManagers.jsx   # Content management
│       ├── GuestManager.jsx      # Guest CRUD
│       ├── InvitationForm.jsx    # Invitation form
│       ├── MediaManager.jsx      # Media management
│       ├── Overview.jsx          # Dashboard overview
│       ├── RSVPManager.jsx       # RSVP management
│       ├── SettingsPage.jsx      # Settings page
│       ├── TemplateAdmin.jsx     # Template management
│       └── WidgetPreviews.jsx    # Widget preview components
│
├── templates/                    # Template System
│   ├── InvitationRenderer.jsx    # Core invitation renderer
│   ├── UniversalTemplate.jsx     # Universal template component
│   ├── designConfigs.js          # Design configurations
│   └── components/               # Template-specific components
│       ├── CountdownTimer.jsx
│       ├── EventWidget.jsx
│       ├── GalleryWidget.jsx
│       ├── MusicPlayer.jsx
│       ├── OrnamentLayer.jsx
│       ├── RSVPForm.jsx
│       └── StoryWidget.jsx
│
├── lib/                          # Utilities
│   ├── auth.js                   # Authentication utilities
│   ├── invitations.js            # Invitation helpers
│   └── supabase/                 # Supabase clients
│       ├── client.js             # Browser client
│       └── server.js             # Server client
│
├── data/                         # Static Data
│   ├── sampleInvitation.js       # Sample invitation data
│   └── templateAdminDefaults.js  # Template defaults
│
└── styles.css                    # Global CSS
```

### 5.3 Database Schema (Supabase PostgreSQL)

#### 5.3.1 Tables

**`admin_users`**
```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**`templates`**
```sql
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(100),
  description TEXT,
  thumbnail_url TEXT,
  design_config JSONB DEFAULT '{}',
  price DECIMAL(10,2) DEFAULT 0,
  badge VARCHAR(50) DEFAULT 'basic',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**`invitations`**
```sql
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES templates(id),
  slug VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  package_tier VARCHAR(50) DEFAULT 'basic',
  content JSONB DEFAULT '{}',
  design_config JSONB DEFAULT '{}',
  published_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**`events`**
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  event_type VARCHAR(100),
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  venue_name VARCHAR(255),
  venue_address TEXT,
  venue_map_url TEXT,
  dress_code VARCHAR(255),
  notes TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**`guests`**
```sql
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  group_name VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(50),
  pax INTEGER DEFAULT 1,
  rsvp_status VARCHAR(50) DEFAULT 'pending',
  plus_ones INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(invitation_id, slug)
);
```

**`rsvps`**
```sql
CREATE TABLE rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES guests(id) ON DELETE SET NULL,
  guest_name VARCHAR(255),
  attendance VARCHAR(50) NOT NULL,
  pax INTEGER DEFAULT 1,
  message TEXT,
  submitted_at TIMESTAMP DEFAULT NOW()
);
```

**`love_stories`**
```sql
CREATE TABLE love_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE,
  title VARCHAR(255),
  description TEXT,
  date DATE,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**`gallery_photos`**
```sql
CREATE TABLE gallery_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption VARCHAR(255),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**`bank_accounts`**
```sql
CREATE TABLE bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE,
  bank_name VARCHAR(100) NOT NULL,
  account_number VARCHAR(50) NOT NULL,
  account_holder VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**`ornaments`**
```sql
CREATE TABLE ornaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  image_url TEXT NOT NULL,
  is_builtin BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**`platform_settings`**
```sql
CREATE TABLE platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 5.3.2 Indexes

```sql
CREATE INDEX idx_invitations_slug ON invitations(slug);
CREATE INDEX idx_invitations_status ON invitations(status);
CREATE INDEX idx_guests_invitation ON guests(invitation_id);
CREATE INDEX idx_guests_slug ON guests(slug);
CREATE INDEX idx_rsvps_invitation ON rsvps(invitation_id);
CREATE INDEX idx_events_invitation ON events(invitation_id);
CREATE INDEX idx_stories_invitation ON love_stories(invitation_id);
CREATE INDEX idx_gallery_invitation ON gallery_photos(invitation_id);
```

#### 5.3.3 Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

-- Invitations: Only owner can access
CREATE POLICY "Owner can view invitations" ON invitations
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Owner can update invitations" ON invitations
  FOR UPDATE USING (auth.uid() = created_by);

-- Guests: Only owner can access
CREATE POLICY "Owner can view guests" ON guests
  FOR SELECT USING (
    invitation_id IN (
      SELECT id FROM invitations WHERE created_by = auth.uid()
    )
  );

-- RSVP: Public can INSERT, owner can view
CREATE POLICY "Anyone can submit RSVP" ON rsvps
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Owner can view RSVP" ON rsvps
  FOR SELECT USING (
    invitation_id IN (
      SELECT id FROM invitations WHERE created_by = auth.uid()
    )
  );
```

### 5.4 API Documentation

#### 5.4.1 Authentication

**POST /api/auth/login**
```json
Request:
{
  "email": "admin@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "admin@example.com",
    "name": "Admin",
    "role": "admin"
  }
}

Response (401):
{
  "success": false,
  "error": "Invalid credentials"
}
```

**POST /api/auth/logout**
```json
Response (200):
{
  "success": true
}
```

#### 5.4.2 Invitations

**GET /api/invitations**
```json
Response (200):
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "slug": "andi-sari-2026-06-15",
      "status": "published",
      "template_id": "uuid",
      "created_at": "2026-05-11T00:00:00Z"
    }
  ]
}
```

**POST /api/invitations**
```json
Request:
{
  "template_id": "uuid",
  "slug": "andi-sari-2026-06-15",
  "content": {
    "couple": {
      "male": { "name": "Andi", "photo": "url" },
      "female": { "name": "Sari", "photo": "url" }
    }
  },
  "status": "draft"
}

Response (201):
{
  "success": true,
  "data": { "id": "uuid", ... }
}
```

**GET /api/invitations/[id]**
**PUT /api/invitations/[id]**
**DELETE /api/invitations/[id]**

#### 5.4.3 Guests

**GET /api/guests?invitation_id=uuid**
```json
Response (200):
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Budi",
      "slug": "budi",
      "group": "Keluarga",
      "rsvp_status": "pending",
      "pax": 2
    }
  ]
}
```

**POST /api/guests**
**PUT /api/guests/[id]**
**DELETE /api/guests/[id]**

#### 5.4.4 RSVP

**GET /api/rsvps?invitation_id=uuid**
```json
Response (200):
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "guest_name": "Budi",
      "attendance": "hadir",
      "pax": 2,
      "message": "Selamat menikah!",
      "submitted_at": "2026-05-10T00:00:00Z"
    }
  ],
  "stats": {
    "total": 50,
    "hadir": 30,
    "tidak_hadir": 5,
    "maybe": 15
  }
}
```

**POST /api/rsvps**
```json
Request:
{
  "invitation_id": "uuid",
  "guest_id": "uuid",
  "attendance": "hadir",
  "pax": 2,
  "message": "Selamat menikah!"
}

Response (201):
{
  "success": true,
  "data": { "id": "uuid", ... }
}
```

#### 5.4.5 Templates

**GET /api/templates**
```json
Response (200):
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Adat Jawa Premium",
      "category": "adat-jawa",
      "price": 90000,
      "badge": "premium",
      "thumbnail_url": "url"
    }
  ]
}
```

**POST /api/templates**
**PUT /api/templates/[id]**
**DELETE /api/templates/[id]**

#### 5.4.6 Media

**POST /api/media/upload**
```json
Request: multipart/form-data
- file: File
- invitation_id: uuid (optional)
- type: "photos" | "music" | "documents"

Response (201):
{
  "success": true,
  "data": {
    "url": "https://storage.supabase.co/...",
    "filename": "photo.jpg",
    "size": 1024000
  }
}
```

**GET /api/media?invitation_id=uuid**
**DELETE /api/media/[filename]**

#### 5.4.7 Events

**GET /api/events?invitation_id=uuid**
**POST /api/events**
**PUT /api/events/[id]**
**DELETE /api/events/[id]**

#### 5.4.8 Stories

**GET /api/stories?invitation_id=uuid**
**POST /api/stories**
**PUT /api/stories/[id]**
**DELETE /api/stories/[id]**

#### 5.4.9 Bank Accounts

**GET /api/bank-accounts?invitation_id=uuid**
**POST /api/bank-accounts**
**PUT /api/bank-accounts/[id]**
**DELETE /api/bank-accounts/[id]**

### 5.5 Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=NusaInvite

# Auth
AUTH_SECRET=your_auth_secret
AUTH_EXPIRES_IN=86400

# Optional
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
SENTRY_DSN=your_sentry_dsn
```

### 5.6 Error Codes

| Code | HTTP Status | Message | Description |
|------|-------------|---------|-------------|
| `AUTH_INVALID_CREDENTIALS` | 401 | "Email atau password salah" | Login failed |
| `AUTH_SESSION_EXPIRED` | 401 | "Sesi berakhir, silakan login ulang" | Session timeout |
| `AUTH_UNAUTHORIZED` | 403 | "Anda tidak memiliki akses" | Permission denied |
| `INV_SLUG_EXISTS` | 400 | "Slug sudah digunakan" | Duplicate slug |
| `INV_NOT_FOUND` | 404 | "Undangan tidak ditemukan" | Invitation not found |
| `GUEST_LIMIT_EXCEEDED` | 400 | "Batas jumlah tamu tercapai" | Guest limit reached |
| `RSVP_ALREADY_SUBMITTED` | 400 | "RSVP sudah terkirim" | Duplicate RSVP |
| `UPLOAD_TOO_LARGE` | 413 | "File terlalu besar" | File size exceeded |
| `UPLOAD_TYPE_INVALID` | 415 | "Tipe file tidak didukung" | Unsupported file type |
| `SERVER_ERROR` | 500 | "Terjadi kesalahan server" | Internal server error |

---

## 6. Design System

### 6.1 Color Palette

#### Primary Colors
| Name | Hex | Usage |
|------|-----|-------|
| Primary | `#D4A574` | Main accent, CTAs, highlights |
| Primary Dark | `#B8956A` | Hover states, emphasis |
| Primary Light | `#E8C9A8` | Backgrounds, subtle highlights |

#### Secondary Colors
| Name | Hex | Usage |
|------|-----|-------|
| Secondary | `#8B5E3C` | Text emphasis, secondary actions |
| Secondary Light | `#C4A484` | Borders, dividers |

#### Neutral Colors
| Name | Hex | Usage |
|------|-----|-------|
| White | `#FFFFFF` | Backgrounds |
| Off White | `#FAF8F5` | Cards, sections |
| Light Gray | `#F5F3F0` | Borders, dividers |
| Gray | `#9B9B9B` | Placeholder text |
| Dark Gray | `#4A4A4A` | Body text |
| Black | `#1A1A1A` | Headings, emphasis |

#### Status Colors
| Name | Hex | Usage |
|------|-----|-------|
| Success | `#4CAF50` | Success states |
| Warning | `#FFC107` | Warning states |
| Error | `#F44336` | Error states |
| Info | `#2196F3` | Info states |

#### Template Color Schemes
| Theme | Primary | Secondary | Background |
|-------|---------|-----------|------------|
| Adat Jawa | `#8B6914` | `#D4A574` | `#FAF3E0` |
| Adat Sunda | `#5D4037` | `#A1887F` | `#EFEBE9` |
| Minimalis | `#2C3E50` | `#ECF0F1` | `#FFFFFF` |
| Modern | `#E91E63` | `#FCE4EC` | `#FFFFFF` |
| Tradisional | `#B71C1C` | `#FFCDD2` | `#FFF8E1` |

### 6.2 Typography

#### Font Families
| Usage | Font Family | Fallback |
|-------|--------------|----------|
| Headings | Playfair Display | Georgia, serif |
| Body | Inter | system-ui, sans-serif |
| Accent | Cormorant Garamond | Georgia, serif |
| Code/Mono | JetBrains Mono | monospace |

#### Type Scale
| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1 | 3rem (48px) | 700 | 1.2 |
| H2 | 2.25rem (36px) | 700 | 1.25 |
| H3 | 1.875rem (30px) | 600 | 1.3 |
| H4 | 1.5rem (24px) | 600 | 1.35 |
| H5 | 1.25rem (20px) | 600 | 1.4 |
| H6 | 1rem (16px) | 600 | 1.45 |
| Body | 1rem (16px) | 400 | 1.6 |
| Small | 0.875rem (14px) | 400 | 1.5 |
| XS | 0.75rem (12px) | 400 | 1.4 |

### 6.3 Spacing System

Based on 4px grid:
| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Tight spacing |
| sm | 8px | Small gaps |
| md | 16px | Default spacing |
| lg | 24px | Section gaps |
| xl | 32px | Large gaps |
| 2xl | 48px | Major sections |
| 3xl | 64px | Page sections |
| 4xl | 96px | Hero sections |

### 6.4 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| none | 0 | Sharp edges |
| sm | 4px | Subtle rounding |
| md | 8px | Buttons, cards |
| lg | 16px | Large cards |
| xl | 24px | Featured sections |
| full | 9999px | Pills, avatars |

### 6.5 Shadows

| Token | Value | Usage |
|-------|-------|-------|
| sm | 0 1px 2px rgba(0,0,0,0.05) | Subtle elevation |
| md | 0 4px 6px rgba(0,0,0,0.07) | Cards |
| lg | 0 10px 15px rgba(0,0,0,0.1) | Modals |
| xl | 0 20px 25px rgba(0,0,0,0.15) | Dropdowns |

### 6.6 Breakpoints

| Name | Min Width | Usage |
|------|-----------|-------|
| xs | 320px | Small phones |
| sm | 640px | Large phones |
| md | 768px | Tablets |
| lg | 1024px | Small laptops |
| xl | 1280px | Desktops |
| 2xl | 1536px | Large screens |

### 6.7 Animation Guidelines

#### Timing
| Token | Value | Usage |
|-------|-------|-------|
| fast | 150ms | Micro-interactions |
| normal | 300ms | Default transitions |
| slow | 500ms | Page transitions |

#### Easing
| Token | Value | Usage |
|-------|-------|-------|
| ease-in | cubic-bezier(0.4, 0, 1, 1) | Exit animations |
| ease-out | cubic-bezier(0, 0, 0.2, 1) | Enter animations |
| ease-in-out | cubic-bezier(0.4, 0, 0.2, 1) | State changes |

---

## 7. Feature Specifications

### 7.1 Landing Page Features

| Feature | Priority | Description |
|---------|----------|-------------|
| Hero Carousel | High | Auto-rotating featured templates |
| Stats Counter | Medium | Animated counters for platform metrics |
| Feature Grid | High | 8 main features with icons |
| Template Gallery | High | Browsable template catalog |
| Pricing Table | High | 3-tier pricing comparison |
| FAQ Accordion | Medium | Expandable FAQ section |
| Contact Form | Low | WhatsApp redirect |
| Footer Links | Medium | Legal pages, social links |

### 7.2 Dashboard Features

| Feature | Priority | Status |
|---------|----------|--------|
| Overview Metrics | High | ✅ Done |
| Invitation CRUD | High | ✅ Done |
| Template Manager | High | ✅ Done |
| Guest Manager | High | ✅ Done |
| RSVP Manager | High | ✅ Done |
| Media Uploader | Medium | ✅ Done |
| Settings Page | Medium | ✅ Done |
| Analytics Dashboard | Low | Planned |
| Export Reports | Medium | Planned |

### 7.3 Public Invitation Features

| Feature | Priority | Status |
|---------|----------|--------|
| Template Renderer | High | ✅ Done |
| Guest Personalization | High | ✅ Done |
| RSVP Form | High | ✅ Done |
| Gift/Amplop Digital | High | ✅ Done |
| Background Music | High | ✅ Done |
| Countdown Timer | High | ✅ Done |
| Gallery | High | ✅ Done |
| Love Story | Medium | ✅ Done |
| Event Details | High | ✅ Done |
| Map Integration | High | ✅ Done |
| Share Buttons | High | ✅ Done |
| QR Code | Medium | Planned |
| Password Protection | Low | Planned |
| Age Gate | Low | Planned |

---

## 8. Performance Requirements

### 8.1 Performance Benchmarks

| Metric | Target | Measurement |
|--------|--------|-------------|
| Page Load Time (Landing) | < 2s | Lighthouse |
| Page Load Time (Invitation) | < 3s | Lighthouse |
| First Contentful Paint | < 1.5s | Lighthouse |
| Time to Interactive | < 3.5s | Lighthouse |
| Cumulative Layout Shift | < 0.1 | Lighthouse |
| Lighthouse Score (Mobile) | > 80 | Lighthouse |
| Lighthouse Score (Desktop) | > 90 | Lighthouse |

### 8.2 Optimization Strategies

| Area | Strategy |
|------|----------|
| Images | Next/Image optimization, WebP format, lazy loading |
| Fonts | Font-display: swap, preload critical fonts |
| Code | Code splitting, tree shaking, minification |
| Caching | Static generation, CDN caching, ISR |
| Bundle | Bundle analysis, remove unused code |
| API | API response caching, pagination |

### 8.3 Caching Strategy

| Resource | Cache Duration | Type |
|----------|----------------|------|
| Static assets | 1 year | Immutable |
| Landing page | 1 hour | ISR |
| Published invitations | 5 minutes | ISR |
| API responses | No cache | Dynamic |
| Images | 1 year | CDN |

---

## 9. Security Requirements

### 9.1 Authentication Security

| Requirement | Implementation |
|-------------|----------------|
| Password hashing | bcrypt (Supabase) |
| Session management | HTTP-only cookies |
| Session timeout | 24 hours |
| Rate limiting | 5 attempts per 15 min |
| Password requirements | Min 8 chars |

### 9.2 Data Protection

| Area | Measure |
|------|---------|
| Database | Row Level Security (RLS) |
| API | Server-side validation |
| Storage | Signed URLs with expiry |
| CSRF | Token validation |
| XSS | React's built-in escaping |

### 9.3 Privacy

| Requirement | Status |
|-------------|--------|
| GDPR Compliance | N/A (Indonesia focused) |
| Data encryption | HTTPS everywhere |
| Data retention | Until user deletion |
| Third-party sharing | None |

### 9.4 Backup & Recovery

| Item | Frequency | Retention |
|------|-----------|-----------|
| Database | Daily | 30 days |
| File storage | Weekly | 30 days |
| Transaction logs | Real-time | 7 days |

---

## 10. SEO Strategy

### 10.1 On-Page SEO

| Element | Implementation |
|---------|----------------|
| Title tag | "NusaInvite - Undangan Pernikahan Digital Premium" |
| Meta description | "Buat undangan pernikahan digital elegan dengan tema budaya Nusantara. Mudah, cepat, dan hasil premium." |
| H1 tags | One per page, keyword-rich |
| Alt text | All images have descriptive alt |
| Schema markup | Organization, Product, FAQ |
| Canonical URL | All pages |

### 10.2 Technical SEO

| Item | Status |
|------|--------|
| Sitemap | /sitemap.xml |
| Robots.txt | Allow all crawlers |
| HTTPS | ✅ Enabled |
| Mobile-friendly | ✅ Responsive |
| Page speed | ✅ Optimized |
| Structured data | ✅ JSON-LD |

### 10.3 Open Graph Tags

```html
<meta property="og:title" content="Undangan Pernikahan Digital" />
<meta property="og:description" content="Buat undangan pernikahan digital elegan" />
<meta property="og:image" content="thumbnail.jpg" />
<meta property="og:url" content="https://nusainvite.com" />
<meta property="og:type" content="website" />
```

---

## 11. Testing Strategy

### 11.1 Unit Tests

| Component | Coverage Target |
|-----------|-----------------|
| Utility functions | 80% |
| Component rendering | 70% |
| Hooks | 80% |
| API handlers | 80% |

### 11.2 Integration Tests

| Flow | Test Cases |
|------|------------|
| Login flow | Success, failure, session expiry |
| Create invitation | All steps, validation |
| RSVP submission | Success, duplicate, validation |
| Guest management | CRUD operations |

### 11.3 E2E Tests (Playwright/Cypress)

| Page | Test Cases |
|------|------------|
| Landing | Load, navigation, CTAs |
| Dashboard | Login, create invitation, publish |
| Public invitation | View all widgets, RSVP |
| Mobile | Responsive, touch interactions |

### 11.4 Performance Tests

| Metric | Threshold |
|--------|-----------|
| Lighthouse Score | > 80 |
| Bundle size | < 200KB gzipped |
| API response time | < 500ms |
| Database query | < 200ms |

---

## 12. Deployment Strategy

### 12.1 Environments

| Environment | URL | Purpose |
|-------------|-----|---------|
| Development | localhost:3000 | Local development |
| Staging | staging.nusainvite.com | Pre-production testing |
| Production | nusainvite.com | Live production |

### 12.2 CI/CD Pipeline

```yaml
# GitHub Actions / Vercel
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run lint
      - run: npm run test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
      - run: npm run start

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: vercel --prod
```

### 12.3 Deployment Checklist

- [ ] All tests passing
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Performance scores met
- [ ] SEO meta tags set
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] CDN cache purged

---

## 13. Analytics & Tracking

### 13.1 Key Metrics

| Metric | Source | Frequency |
|--------|--------|-----------|
| Page views | GA4 | Real-time |
| Unique visitors | GA4 | Daily |
| Bounce rate | GA4 | Daily |
| Session duration | GA4 | Daily |
| Conversion rate | GA4 | Weekly |
| Invitations created | Database | Daily |
| RSVP rate | Database | Weekly |

### 13.2 Event Tracking

| Event | Category | Action |
|-------|----------|--------|
| Page view | Page | View |
| CTA click | Button | Click |
| Template preview | Interaction | Preview |
| RSVP submit | Form | Submit |
| Share click | Social | Share |

### 13.3 Funnel Analysis

```
Landing → Template Preview → Create Start → Form Completed → Published
   ↓           ↓                ↓              ↓              ↓
 100%        30%              20%            15%             10%
```

---

## 14. Competitor Analysis

### 14.1 Direct Competitors (Indonesia)

| Competitor | Strengths | Weaknesses | Price |
|------------|-----------|------------|-------|
| Paper.id | Established, features | Complex UI | Rp 99K+ |
| Undangan.web.id | Affordable | Limited templates | Rp 25K |
| Ever After | Beautiful designs | Premium pricing | Rp 200K+ |

### 14.2 Our Differentiation

| Aspect | NusaInvite | Competitors |
|--------|------------|-------------|
| Budaya Nusantara | ✅ Core focus | ❌ Not priority |
| Template variety | Growing | Varies |
| Ease of use | Simple dashboard | Mixed |
| Pricing | Competitive | Higher |
| Support | WhatsApp | Email/Ticket |

---

## 15. Pricing Strategy

### 15.1 Pricing Tiers

| Feature | Basic (Rp 45K) | Premium (Rp 90K) | Exclusive (Rp 149K) |
|---------|----------------|------------------|---------------------|
| Templates | 5 basic | All templates | Exclusive only |
| Events | 1 | Unlimited | Unlimited |
| Guests | 100 | 500 | Unlimited |
| Photos | 10 | 50 | Unlimited |
| Music | ❌ | ✅ | ✅ |
| RSVP | ✅ | ✅ | ✅ |
| Gift/Amplop | ❌ | ✅ | ✅ |
| Analytics | ❌ | ✅ | ✅ |
| Custom URL | ❌ | ✅ | ✅ |
| Watermark | ❌ | ❌ | ❌ |
| Priority Support | ❌ | ✅ | ✅ |
| AI Content | ❌ | ❌ | ✅ |

### 15.2 Payment Methods

| Method | Status | Notes |
|--------|--------|-------|
| Bank Transfer | ✅ Active | Manual confirmation |
| WhatsApp | ✅ Active | Payment via WA |
| Midtrans | Planned | Auto-confirmation |
| DANA/OVO | Planned | E-wallet |

---

## 16. Customer Support

### 16.1 Support Channels

| Channel | Availability | Response Time |
|---------|--------------|---------------|
| WhatsApp | 9 AM - 9 PM | < 1 hour |
| Email | 24/7 | < 24 hours |

### 16.2 Support Scope

| Included | Not Included |
|----------|---------------|
| Bug reports | Custom development |
| Feature questions | Design services |
| Usage guidance | Content writing |
| Technical issues | Third-party integrations |

### 16.3 FAQ Topics

1. Cara membuat undangan
2. Cara memilih template
3. Cara upload foto
4. Cara mengatur RSVP
5. Cara menerima pembayaran amplop
6. Cara berbagi undangan
7. Cara upgrade paket
8. Cara troubleshoot

---

## 17. Legal Documents

### 17.1 Required Pages

| Document | Description |
|----------|-------------|
| Terms of Service | User agreement, usage terms |
| Privacy Policy | Data collection, usage, protection |
| Refund Policy | Payment and refund terms |

### 17.2 Content Requirements

| Document | Key Sections |
|----------|--------------|
| ToS | Account terms, user responsibilities, content ownership, limitations |
| Privacy | Data collected, usage, sharing, retention, rights |
| Refund | Eligibility, process, timeline |

---

## 18. Scalability Plan

### 18.1 Current Architecture

```
┌─────────┐     ┌─────────┐     ┌─────────────┐
│ Vercel  │────▶│ Next.js │────▶│  Supabase   │
│ CDN     │     │   App   │     │  Database   │
└─────────┘     └─────────┘     └─────────────┘
                            │
                            ▼
                    ┌─────────────┐
                    │  Supabase   │
                    │  Storage    │
                    └─────────────┘
```

### 18.2 Scaling Triggers

| Metric | Warning | Critical |
|--------|---------|----------|
| DB connections | 70% | 90% |
| Storage | 70% | 90% |
| API latency | 500ms | 1000ms |
| Error rate | 1% | 5% |

### 18.3 Future Scaling Options

| Level | Solution |
|-------|----------|
| Database | Read replicas, connection pooling |
| CDN | Edge functions, global distribution |
| Caching | Redis, Vercel KV |
| Compute | Auto-scaling, serverless |

---

## 19. Roadmap

### 19.1 Minggu 1 — Stabilisasi & Monetisasi

| Task | Priority | Status |
|------|----------|--------|
| Audit & fix bug kritis | High | Planned |
| Integrasi payment gateway | High | Planned |
| Optimasi landing page | Medium | Planned |
| A/B test pricing | Low | Planned |

### 19.2 Minggu 2 — User Experience

| Task | Priority | Status |
|------|----------|--------|
| Simplifikasi form creation | High | Planned |
| Progress indicator | Medium | Planned |
| Live preview enhancement | High | Planned |
| Mobile-first optimization | Medium | Planned |

### 19.3 Minggu 3 — Growth Features

| Task | Priority | Status |
|------|----------|--------|
| Email/SMS notification | Medium | Planned |
| Analytics dashboard | Medium | Planned |
| Template baru (Sunda, Minang) | Low | Planned |
| Real-time attendance tracking | Low | Planned |

### 19.4 Minggu 4 — Scale & Automation

| Task | Priority | Status |
|------|----------|--------|
| Automated welcome email | Medium | Planned |
| Export data tamu (CSV) | High | Planned |
| WhatsApp blast | Medium | Planned |
| Admin documentation | Low | Planned |

### 19.5 Future Roadmap (Q3-Q4 2026)

| Feature | Timeline |
|---------|----------|
| Template Builder (Drag-drop) | Q3 2026 |
| AI Content Generator | Q3 2026 |
| QR Code Generator | Q3 2026 |
| Multi-language support | Q4 2026 |
| Mobile app | Q4 2026 |
| Live streaming integration | Q4 2026 |

---

## 20. Tech Debt & Improvements

### 20.1 Technical Debt

| Item | Priority | Effort | Status |
|------|----------|--------|--------|
| Environment variables separation | Medium | 1-2 days | Pending |
| Unit tests | Medium | 3-5 days | Pending |
| Bundle optimization | High | 2-3 days | Pending |
| Cache strategy | Medium | 2 days | Pending |
| Error tracking (Sentry) | Low | 1 day | Pending |

### 20.2 Code Quality

| Item | Target |
|------|--------|
| ESLint errors | 0 |
| TypeScript errors | 0 |
| Console errors | 0 |
| Dead code | 0 |
| Code coverage | 70%+ |

---

## 21. Expansion Opportunities

### 21.1 Potential Features

| Feature | Description | Effort |
|---------|-------------|--------|
| Template Builder | Drag-drop section builder | High |
| AI Content | Generate quotes, stories | Medium |
| QR Code Generator | Unique QR per guest | Low |
| Live Attendance | Real-time counter | Medium |
| Multi-language | EN, AR, CN | High |
| Watermark removal | For Exclusive tier | Low |
| Gift registry | Wishlist integration | Medium |
| Photo booth | In-event photo sharing | High |

### 21.2 Market Expansion

| Market | Timeline | Requirements |
|--------|----------|--------------|
| Malaysia | Q4 2026 | Malay language support |
| Singapore | Q4 2026 | English templates |
| Middle East | 2027 | Arabic RTL support |

---

## 22. Definition of Done

### 22.1 Feature Completion Criteria

A feature is considered complete when:

- [ ] Code is written and committed
- [ ] `npm run build` succeeds without errors
- [ ] No ESLint/TypeScript errors
- [ ] Tested in staging environment
- [ ] No console errors in browser
- [ ] Responsive on mobile devices
- [ ] Performance meets benchmarks
- [ ] Documentation updated (if needed)
- [ ] Related metrics show improvement

### 22.2 Release Criteria

- [ ] All critical bugs fixed
- [ ] All planned features implemented
- [ ] All tests passing
- [ ] Performance benchmarks met
- [ ] Security audit passed
- [ ] Documentation complete

---

## 23. Glossary

| Term | Definition |
|------|------------|
| Invitation | Digital wedding invitation created on the platform |
| RSVP | Réservez s'il vous plaît - Guest confirmation |
| Mempelai | Indonesian term for bride/groom |
| Amplop | Indonesian term for monetary gift/envelope |
| Adat | Traditional customs/rituals |
| Template | Pre-designed invitation layout |
| Widget | Interactive component in invitation |
| Ornament | Decorative element |
| Slug | URL-friendly identifier |
| Pax | Short for "pax" (number of guests) |

---

## 24. Revision Log

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-05-11 | Initial draft (retroaktif dari codebase) | - |
| 1.1 | 2026-05-11 | Complete version with all sections added | AI Assistant |

---

## 25. Appendices

### 25.1 Useful Links

- Repository: https://github.com/nusainvite/web
- Documentation: https://docs.nusainvite.com
- Support: https://wa.me/6281234567890

### 25.2 Stakeholders

| Role | Name | Contact |
|------|------|---------|
| Product Owner | TBD | - |
| Lead Developer | TBD | - |
| Designer | TBD | - |
| QA | TBD | - |

### 25.3 Related Documents

- [FEATURES.md](./FEATURES.md) - Feature specifications
- [Interactive Template Customizer Roadmap](./interactive-template-customizer-roadmap.md)
- [Supabase Schema](./supabase/schema.sql)
- [API Documentation](./API.md) (planned)

---

*Document created: 2026-05-11*
*Last updated: 2026-05-11*
*Version: 1.1*
