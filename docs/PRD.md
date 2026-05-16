# PRD Production v2 Template - NusaInvite

## 0. Document Control
- Version: v2.0
- Status: Draft
- Owner: Product
- Tech Owner: Engineering
- Last Updated: 2026-05-15
- Source of Truth: `docs/PRD.md`

## 1. Executive Summary
### 1.1 Problem Statement
Platform undangan saat ini sudah valid untuk workflow admin internal, tetapi belum matang untuk full production SaaS multi-tenant.

### 1.2 Product Vision
Mentransformasi NusaInvite menjadi SaaS undangan digital yang self-service, reliable, secure, dan scalable.

### 1.3 Success Definition
- Tenant dapat onboarding mandiri.
- Invitation lifecycle stabil sampai publish.
- Untuk fase awal, order dan pembayaran manual via WhatsApp berjalan rapi dan tercatat.
- Billing dan quota otomatis menjadi target fase SaaS berikutnya, bukan kebutuhan P0.
- Operasional memenuhi standard production readiness.

## 2. Current State vs Target State
### 2.1 Current State (As-Is)
- Admin-managed workflow.
- Order, konsultasi, pembayaran, dan broadcast undangan masih manual via WhatsApp.
- Dashboard + public invitation + RSVP sudah berjalan.
- Supabase Auth/DB/Storage aktif, dengan fallback sample mode.
- Order-to-publish flow belum aman untuk pesanan real karena beberapa dashboard manager masih memakai slug sample dan belum ada publish guard lengkap.

### 2.2 Target State (To-Be)
- Phase 1 target: admin-managed production workflow untuk pesanan manual via WhatsApp.
- Later target: multi-tenant self-service SaaS.
- Role/permission matrix formal.
- Subscription billing lifecycle lengkap untuk fase SaaS, bukan fase manual order awal.
- Observability, testing, dan release governance matang.

### 2.3 Gap Summary
- Tenant isolation model belum formal.
- Billing automation belum ada.
- Test/monitoring/reliability gates belum lengkap.

## 3. Product Scope
### 3.1 In Scope (Phase Production)
- Manual order operations via WhatsApp.
- Invitation builder lifecycle.
- Guest/RSVP management.
- Template/content/media management.
- Manual payment tracking.
- Manual broadcast support melalui guest link dan WhatsApp copy generator.
- Observability and reliability baseline.

### 3.2 Out of Scope (Current PRD Cycle)
- Mobile native app.
- Marketplace template eksternal.
- AI content generation kompleks.
- Payment gateway otomatis.
- WhatsApp blast otomatis.

## 4. User and Tenant Model
### 4.1 Personas
- Tenant Owner
- Team Member (Admin/Editor/Viewer)
- End Customer (pasangan)
- Guest

### 4.2 Role Matrix (Template)
- Owner: full access termasuk billing.
- Admin: manage invitation/template/guest/content.
- Editor: edit content tanpa billing/security setting.
- Viewer: read-only.

## 5. Functional Requirements
### 5.0 Manual Order Operations Flow
Fase awal NusaInvite memakai model jasa/admin-managed: user pesan via WhatsApp, bayar manual, admin membuat undangan, lalu user/admin membagikan link undangan secara manual.

Flow utama:
1. User menghubungi admin via WhatsApp.
2. Admin mencatat order, paket, nomor WhatsApp, catatan konsep, dan status pembayaran manual.
3. User membayar secara manual sesuai instruksi admin.
4. Admin menandai order sebagai paid/manual confirmed.
5. Admin memilih template dan mengisi data undangan.
6. Admin mengirim preview ke user untuk review.
7. Admin melakukan revisi jika diperlukan.
8. Admin publish undangan.
9. Admin/user generate link tamu personal.
10. User/admin broadcast manual lewat WhatsApp menggunakan copy text/link yang disediakan.

Required statuses:
- `inquiry`
- `waiting_payment`
- `paid`
- `in_progress`
- `review`
- `revision`
- `approved`
- `published`
- `completed`
- `cancelled`

Acceptance Criteria:
- Admin bisa melacak order manual tanpa payment gateway.
- Admin bisa menandai pembayaran manual.
- Broadcast tidak otomatis mengirim pesan; sistem hanya membantu generate link dan teks WhatsApp.
- Flow manual tetap bisa ditingkatkan ke billing otomatis di fase SaaS tanpa merusak data existing.

### 5.1 Tenant Management
- Workspace creation, membership invite, role assignment.
- Tenant data isolation di semua domain object.

### 5.2 Invitation Lifecycle
- Status: Draft -> Review -> Published -> Archived.
- Publish guard (validasi data wajib lengkap).
- Optional rollback/version checkpoint.

### 5.2.1 Admin Order-to-Publish Workflow
- Admin harus bisa membuat pesanan undangan baru dari dashboard.
- Pesanan boleh berasal dari WhatsApp dan pembayaran manual.
- Setiap pesanan harus memiliki editor detail berdasarkan slug atau id undangan.
- Semua modul data pesanan (mempelai, acara, story, rekening, tamu, media, RSVP) harus terikat ke invitation yang sedang aktif.
- Tidak boleh ada hardcoded invitation slug di dashboard production flow.
- Admin harus bisa preview undangan yang sama sebelum publish.
- Publish hanya boleh dilakukan jika data minimum valid: slug, template, mempelai, minimal satu acara, dan data pendukung untuk fitur yang diaktifkan.
- Setelah publish, public URL `/u/[slug]` dan personal URL `/u/[slug]/to/[guestSlug]` harus membaca data invitation yang sama.
- RSVP dari public page harus masuk ke invitation dan guest yang benar.
- Broadcast undangan dilakukan manual oleh user/admin menggunakan generated guest link dan teks WhatsApp.

### 5.2.2 Dashboard Functional Requirements
Dashboard harus dapat dipakai admin untuk menyelesaikan pesanan undangan dari awal sampai publish tanpa keluar dari alur kerja utama.

#### Dashboard UX Refactor Principles
- Dashboard harus mengikuti `docs/design.md`: light canvas, monochrome, compact typography, structural borders, dan minim dekorasi.
- Dashboard adalah operational tool, bukan marketing page.
- Semua halaman dashboard harus berorientasi pada active order/invitation.
- Action utama harus selalu jelas: create, save, preview, publish, copy link.
- UI harus mengurangi input teknis yang tidak perlu dan mengutamakan workflow admin.

#### Dashboard Shell
Current:
- Sidebar dan header sudah ada, tetapi masih terlalu visual-heavy dan belum mengikuti style `design.md`.
- Belum ada active order/invitation selector.

Target:
- Sidebar light/neutral dan ringkas.
- Header compact dengan title, active order context, dan primary actions.
- Active order/invitation selector tersedia untuk modul yang membutuhkan konteks.

Acceptance Criteria:
- Admin selalu tahu sedang mengedit order/undangan yang mana.
- Navigasi dashboard tidak terasa seperti landing page.
- Layout tetap usable di desktop dan tablet.

#### Dashboard Overview
Current:
- Metric cards dan tabel undangan sudah ada.
- Action utama belum sepenuhnya terhubung ke editor detail pesanan.

Target:
- Menampilkan ringkasan order dan undangan: inquiry, waiting payment, in progress, review, published, RSVP, dan tamu.
- Tombol `Buat Undangan`, `Edit`, `Preview`, dan `Publish/Archive` harus menjalankan aksi nyata.
- Setiap row undangan harus mengarah ke invitation yang benar.

Acceptance Criteria:
- Admin bisa membuka detail undangan dari tabel.
- Preview membuka undangan yang sesuai.
- Status yang tampil sama dengan data Supabase.

#### Invitation Order Editor
Current:
- Form draft sudah ada, tetapi belum menjadi editor detail per undangan.

Target:
- Route detail: `/dashboard/invitations/[slug]`.
- Editor mendukung create dan edit order manual, payment status, data mempelai, template, paket, slug, quote, fitur aktif, dan status.
- Editor dibagi menjadi section kerja: Order, Couple, Events, Features, Media, Guests, Review.
- Sticky action bar menyediakan `Save Draft`, `Preview`, `Mark Review`, dan `Publish`.
- Save draft tidak boleh membuat data event duplikat.

Acceptance Criteria:
- Admin bisa membuat pesanan baru.
- Admin bisa membuka ulang dan mengedit pesanan yang sama.
- Data tersimpan dan muncul di public preview yang sama.

#### Publish Workflow
Current:
- Status `draft/published` ada di data, tetapi publish action belum matang.

Target:
- Publish guard wajib memvalidasi slug, template, nama mempelai, minimal satu event, dan data wajib sesuai fitur aktif.
- Publish mengubah status ke `published`.
- Archive/unpublish tersedia untuk menonaktifkan public access.

Acceptance Criteria:
- Undangan draft belum bisa diakses publik jika policy membatasi published.
- Undangan published bisa dibuka di `/u/[slug]`.
- Publish gagal dengan pesan jelas jika data minimum belum lengkap.

#### Guest Manager
Current:
- Tambah tamu dan copy link tersedia, tetapi masih hardcode ke sample slug.

Target:
- Guest Manager menerima active invitation context.
- Mendukung create, edit, delete, duplicate slug handling, phone field, group, RSVP status, dan pax.
- Bulk import/export menjadi follow-up setelah CRUD stabil.
- Copy link harus menghasilkan `/u/[invitationSlug]/to/[guestSlug]`.
- Copy WhatsApp message harus tersedia untuk broadcast manual.
- Filter group/status RSVP tersedia.

Acceptance Criteria:
- Tamu yang dibuat masuk ke invitation yang sedang diedit.
- Link personal membuka undangan dan nama tamu yang benar.
- RSVP tamu mengupdate data guest yang benar.

#### RSVP Manager
Current:
- List RSVP dan export CSV tersedia, tetapi belum matang per invitation.

Target:
- RSVP Manager membaca data berdasarkan active invitation.
- Menampilkan summary: hadir, tidak hadir, belum RSVP, total pax, grup tamu, dan pesan terbaru.
- Table mendukung filter attendance, group, dan tanggal.
- Export CSV harus berdasarkan invitation aktif.

Acceptance Criteria:
- RSVP dari public page tampil di dashboard undangan yang benar.
- Export CSV tidak mencampur data antar undangan.

#### Media Manager
Current:
- Upload media tersedia, tetapi masih memakai sample slug dan belum ada replace/delete.

Target:
- Media Manager menerima active invitation context.
- Mendukung upload, replace, delete cover, gallery, music, dan video.
- UI dibagi menjadi tabs: Cover, Gallery, Music, Video.
- Media card menampilkan lokasi penggunaan asset.
- Media type harus tervalidasi sesuai kebutuhan.

Acceptance Criteria:
- Media yang diupload tampil di undangan yang sama.
- Replace cover/music langsung tercermin di preview.
- Delete media tidak meninggalkan item rusak di public renderer.

#### Content Manager
Current:
- Event, story, dan bank account bisa ditambah, tetapi masih memakai sample slug dan belum ada edit/delete.

Target:
- Event Manager mendukung create/edit/delete/reorder acara.
- Story Manager mendukung create/edit/delete/reorder love story.
- Bank Account Manager mendukung create/edit/delete rekening/e-wallet.
- UI dipisah menjadi panel Events, Love Story, dan Gift Accounts.
- Reorder minimal mendukung move up/down.
- Semua manager membaca dan menulis ke active invitation.

Acceptance Criteria:
- Data event/story/bank account tidak tercampur antar undangan.
- Perubahan konten tampil di preview undangan yang sama.

#### Template Manager
Current:
- Template Manager adalah modul dashboard paling matang: CRUD template, design config, widget config, ornament editor, upload thumbnail/ornament, dan live preview sudah tersedia.
- Current project sudah memiliki beberapa widget preview: Opening Reveal, Cover, Couple, Countdown, Story, Gallery, Event, Music, Ornament Canvas, dan full template iframe preview.
- Preview Gift dan RSVP belum terlihat setara sebagai dedicated widget preview panel.

Target:
- Template Manager tetap menjadi master template editor.
- Template changes harus backward-compatible dengan invitation existing.
- Opening Cinematic dan template selling features masuk bertahap sebagai extension design config.
- Template Manager harus direfactor menjadi preset-first workflow.
- Step utama: Metadata, Preset, Global Style, Opening, Widgets, Ornaments, Preview, Publish.
- Quality guard wajib tampil sebelum publish template.

Acceptance Criteria:
- Admin bisa membuat/edit template tanpa merusak template lain.
- Preview template sesuai dengan config yang disimpan.

#### Settings
Current:
- Settings masih placeholder.

Target:
- Menyediakan konfigurasi platform dasar: brand, kontak admin, WhatsApp, default package, default template, dan optional payment instructions.
- Settings untuk fase awal fokus ke manual order operations, bukan SaaS billing.

Acceptance Criteria:
- Setting yang disimpan dapat dipakai landing/dashboard flow terkait.

#### Activity and Audit
Current:
- Activity feed masih bersifat statis/sample.

Target:
- Dashboard mencatat aktivitas penting: create, edit, publish, archive, guest import, RSVP masuk, media upload, dan template update.
- Untuk production SaaS, activity log berkembang menjadi audit log.

Acceptance Criteria:
- Aktivitas penting tampil sesuai data aktual.
- Aksi sensitif punya jejak audit minimal.

#### Dashboard Refactor Order
1. Dashboard shell + design tokens sesuai `docs/design.md`.
2. Active order/invitation context.
3. Invitation/order editor.
4. Guest Manager.
5. Media Manager dan Content Manager.
6. Publish workflow + preview.
7. RSVP Manager.
8. Template Manager preset-first UX.
9. Widget editor standardization.
10. Settings.

### 5.3 Template and Rendering
- Template CRUD + design config schema terstandar.
- Override per invitation tetap backward-compatible.

### 5.3.0 Template Creation Workflow
Template adalah master desain yang dipakai untuk membuat undangan pesanan. Template tidak sama dengan invitation. Invitation adalah hasil penggunaan template + data client + override khusus jika dibutuhkan.

Flow pembuatan template:
1. Admin membuat template draft.
2. Admin mengisi metadata: id, nama, kategori, badge/paket, harga, status, deskripsi, thumbnail, supported features.
3. Admin memilih struktur section: opening, cover/home, couple, acara, countdown, story, gallery, gift, RSVP, doa/ucapan.
4. Admin memilih visual preset atau theme awal.
5. Admin mengatur global style: warna, font, background, spacing, card style.
6. Admin mengatur opening reveal atau opening cinematic.
7. Admin mengatur widget variants: countdown, events, story, gallery, gift, RSVP, music.
8. Admin menambahkan ornament per section dan asset pendukung.
9. Admin melakukan preview mobile, tablet, desktop.
10. Admin menjalankan validation checklist.
11. Admin publish template sebagai active.
12. Template active dapat dipilih saat membuat pesanan undangan.

Template lifecycle:
- `draft`: template sedang dibuat dan belum bisa dipakai pesanan.
- `review`: template siap dicek QA/internal.
- `active`: template tersedia untuk order/client.
- `hidden`: template tidak tampil di katalog tetapi masih bisa diedit.
- `archived`: template tidak dipakai untuk order baru.

Template versioning and snapshot rules:
- Template master boleh diedit tanpa langsung merusak undangan published.
- Saat invitation dibuat, sistem harus menyimpan referensi template dan boleh menyimpan snapshot/override design config.
- Undangan published sebaiknya memakai snapshot config agar perubahan template master tidak mengubah undangan client tanpa sengaja.
- Template update besar harus menghasilkan version baru.
- Invitation existing hanya ikut template version baru jika admin memilih update/apply secara eksplisit.

Template validation checklist:
- Metadata wajib lengkap: id, nama, kategori, status, thumbnail.
- Minimal section cover/home dan acara tersedia.
- Design config JSON valid.
- Semua asset gambar/ornament punya URL valid.
- Widget aktif punya fallback ketika data client belum lengkap.
- Opening reveal/cinematic tidak mengunci user terlalu lama.
- Mobile preview tidak overflow atau menutupi teks penting.
- Guest name block punya fallback untuk public URL tanpa guest slug.
- RSVP/gift/music/gallery tetap aman jika fitur dimatikan.

Template QA checklist:
- Cek mobile 430px.
- Cek tablet.
- Cek desktop.
- Cek opening pertama kali.
- Cek replay/preview opening di editor.
- Cek cover dengan dan tanpa guest name.
- Cek event dengan satu dan beberapa acara.
- Cek gallery kosong dan gallery berisi foto.
- Cek gift aktif/nonaktif.
- Cek RSVP aktif/nonaktif.
- Cek reduced motion behavior.

Performance budget:
- Opening cinematic target durasi ideal: 3-6 detik.
- Animated ornaments aktif pada satu viewport sebaiknya dibatasi sekitar 5 item utama.
- Total ornaments per section sebaiknya sekitar 12 item atau kurang.
- Asset raster ornament harus dikompresi; target maksimal 1 MB per asset besar.
- Template harus tetap usable di mobile device kelas menengah.
- Jika `prefers-reduced-motion` aktif, animasi berat harus dimatikan atau disederhanakan.

Acceptance Criteria:
- Admin bisa membuat template dari draft sampai active.
- Template active bisa dipilih untuk membuat undangan pesanan.
- Template edit tidak merusak undangan published tanpa aksi eksplisit.
- Preview template akurat untuk mobile.
- Template yang gagal validation tidak bisa dipublish sebagai active.

### 5.3.0.1 Design Config Editor UX
Design config editor harus membantu admin menghasilkan template yang bagus tanpa harus memahami semua detail teknis. Workflow utama harus preset-first, bukan JSON-first atau ornament-first.

Required hierarchy:
1. Theme Preset
2. Mood/Style Variant
3. Global Style
4. Section Layout
5. Opening Cinematic / Opening Reveal
6. Widget Variants
7. Ornament Fine Tuning
8. Advanced JSON

Preset-first workflow:
- Admin memilih preset seperti `royal`, `floral`, `minimal`, `islamic`, atau `cinematic`.
- Preset otomatis mengatur warna, font, spacing, section style, widget variant, opening, dan ornament starter.
- Admin boleh fine tune setelah preset dipilih.
- Advanced JSON hanya untuk admin teknis dan tidak boleh menjadi jalur utama pembuatan template.

Quality guard:
- Tampilkan warning jika kontras warna rendah.
- Tampilkan warning jika mobile preview overflow.
- Tampilkan warning jika terlalu banyak animated ornaments.
- Tampilkan warning jika asset hilang atau URL rusak.
- Tampilkan warning jika opening terlalu lama atau terlalu berat.
- Tampilkan warning jika widget aktif tetapi data fallback tidak aman.

Preview workflow:
- Preview mobile 430px harus menjadi default.
- Admin bisa replay opening.
- Admin bisa focus preview ke section tertentu.
- Admin bisa preview dengan guest name dan tanpa guest name.
- Admin bisa melihat fallback saat data client kosong.
- Preview harus cukup akurat terhadap public renderer.

Acceptance Criteria:
- Admin dapat membuat template rapi hanya dengan memilih preset dan melakukan sedikit fine tuning.
- Admin tidak wajib membuka Advanced JSON untuk menghasilkan template yang layak publish.
- Template editor memberi warning sebelum template yang buruk/rusak dipublish.
- Preview mobile menunjukkan hasil yang mendekati public page.

### 5.3.0.2 Widget Style Editor UX
Widget style editor harus konsisten, mudah dipahami, dan mengikuti preset visual template. Admin tidak boleh dipaksa mengatur setiap property teknis untuk mendapatkan hasil bagus.

Current:
- Widget preview sudah ada untuk sebagian besar widget di Template Admin.
- Full template preview sudah ada melalui iframe editor preview.
- Preview masih perlu parity audit karena sebagian preview bersifat simplified dan belum tentu 1:1 dengan public renderer.
- Missing/partial coverage: Gift preview, RSVP preview, empty data state, disabled state, missing asset state, dan invalid config state.

Widget editor hierarchy:
1. Enable/disable
2. Variant/layout
3. Style preset
4. Behavior options
5. Mini preview
6. Advanced options

Required widget panels:
- Opening
- Countdown
- Events
- Love Story
- Gallery
- Gift / Amplop Digital
- RSVP
- Music Player

Common widget rules:
- Semua widget harus punya enable/disable toggle.
- Semua widget harus punya variant/layout yang jelas.
- Semua widget harus mengikuti global theme: color, font, radius, spacing, dan motion intensity.
- Semua widget harus punya fallback saat data client kosong.
- Semua widget harus punya mini preview di editor dan full preview di mobile iframe.
- Widget preview harus diaudit agar outputnya mendekati public renderer. Jika preview berbeda jauh dari public renderer, itu dianggap bug UX.
- Advanced option harus collapsible dan tidak menjadi jalur utama.

Required preview states per widget:
- Enabled state.
- Disabled state.
- Filled sample data state.
- Empty data fallback state.
- Missing asset/config warning state jika relevan.
- Mobile-safe state.

Widget-specific requirements:
- Countdown: variant, target event, complete text, compact/elegant style preset.
- Events: variant, show maps, show icon, show venue/address, multi-event support.
- Love Story: variant, animation, show year, optional photo support.
- Gallery: variant, photo limit, include cover, fullscreen viewer, mobile swipe behavior.
- Gift: variant, copy account number, bank/e-wallet display, hide/warning if no account data.
- RSVP: variant, attendance fields, pax limit, message field, duplicate RSVP policy, success message.
- Music: variant, position, autoplay after opening, fade-in, loop, show track info, ornament pulse sync.

Fallback rules:
- Gift aktif tetapi rekening kosong harus memunculkan warning dan aman di preview.
- Gallery kosong harus hide section atau menampilkan placeholder yang jelas di preview admin.
- Countdown tanpa event harus hide widget atau warning.
- RSVP aktif harus tetap bisa preview, tetapi public submit harus valid hanya untuk invitation yang benar.
- Music aktif tanpa file harus warning dan tidak menampilkan player rusak.

Acceptance Criteria:
- Admin bisa mengatur widget dengan pola UI yang sama di setiap widget.
- Widget mengikuti global template theme secara default.
- Widget yang kekurangan data memberi warning sebelum template/undangan dipublish.
- Mini preview dan full preview konsisten dengan public renderer.

### 5.3.1 Opening Cinematic / Intro Sequence
- Template harus mendukung intro cinematic sebelum konten undangan utama muncul.
- Admin dapat memilih preset opening seperti `floral-bloom`, `falling-petals`, `royal-gate`, `paper-reveal`, dan `wayang-shadow`.
- Intro cinematic harus mendukung timeline: background, ornament/particle masuk, title delay, exit/fade-out, lalu cover undangan tampil.
- Admin harus bisa memakai preset sederhana tanpa mengatur setiap ornament secara manual.
- Advanced editor tetap boleh menyediakan fine tuning untuk asset, durasi, delay, track, dan exit animation.
- Opening cinematic tidak boleh merusak fallback opening reveal yang sudah ada.
- Public renderer harus tetap menghormati `prefers-reduced-motion`.

### 5.3.2 Template Selling Features Backlog
Fitur template berikut diprioritaskan sebagai pembeda komersial. Implementasi dilakukan bertahap agar satu fitur bisa diuji sebelum lanjut ke fitur berikutnya.

1. Opening Cinematic
- Intro awal berbasis preset/timeline sebelum cover utama muncul.
- Target validasi: calon pembeli langsung melihat kesan premium saat preview pertama.

2. Guest Personalization in Opening
- Nama tamu tampil di opening cinematic atau reveal screen, bukan hanya di cover.
- Contoh: `Undangan khusus untuk Bapak/Ibu Andi sekeluarga`.
- Target validasi: personal link terasa lebih eksklusif dan layak upsell.

3. Template Visual Presets
- Satu template dapat memiliki beberapa mood visual seperti `classic`, `royal`, `floral`, `minimal`, dan `cinematic`.
- Preset mengatur warna, font, ornament, opening, dan widget style secara konsisten.

4. Smart Theme Composer
- Admin memilih konsep seperti `adat-jawa`, `modern-luxury`, `floral-soft`, atau `islamic-elegant`.
- Sistem mengisi default style, opening preset, ornament, font, dan warna.

5. Accurate Mobile Preview
- Preview template harus meniru viewport mobile utama secara akurat.
- Opening cinematic, cover, widget, dan scrolling behavior harus terlihat mendekati public page.

6. WhatsApp Share Text Generator
- Admin dapat generate teks undangan personal untuk setiap guest.
- Output harus menyertakan nama tamu, link personal, dan copy yang rapi untuk WhatsApp.

7. Storytelling Sections
- Love story memiliki varian premium seperti cinematic timeline, photo album, chapter scroll, dan chat-style journey.

8. Interactive Gallery
- Gallery mendukung swipe, fullscreen, cinematic slideshow, dan ordering cover/prewedding.

9. Music Ambience
- Musik dapat fade-in setelah opening, auto-loop, dan sinkron halus dengan ornament pulse bila diaktifkan.

10. RSVP Smart Summary
- Dashboard menampilkan ringkasan RSVP: hadir, tidak hadir, total pax, grup tamu, dan pesan terbaru.

### 5.4 Guest and RSVP
- Personal link generation dan unique slug.
- RSVP anti-duplicate baseline + abuse protection baseline.

### 5.5 Media Management
- Upload, replace, delete, dan retrieval policy.
- Quota checks berdasarkan plan.

### 5.6 Billing and Plans
Phase 1:
- Pembayaran manual via WhatsApp/bank transfer.
- Admin mencatat status pembayaran secara manual.
- Tidak ada payment gateway otomatis.

Future SaaS:
- Plan, quota, renewal.
- Failed payment lifecycle (retry/grace/suspend).
- Webhook idempotency requirement.

## 6. Non-Functional Requirements
### 6.1 Performance
- API p95 < 500ms (critical endpoints).
- Public invitation load < 3s on mobile 4G.

### 6.2 Availability and Reliability
- SLA target: 99.9% monthly.
- RPO <= 24h, RTO <= 4h.

### 6.3 Scalability
- Horizontal-ready architecture via service boundaries.
- Async task path for notification/billing jobs.

## 7. Security Requirements
- Tenant-aware authorization model.
- Session hardening and token management.
- Rate limiting pada endpoint publik.
- Audit logging untuk aksi sensitif.

## 8. Data and API Requirements
### 8.1 Data Model
- Semua tabel utama wajib memiliki tenant scope untuk SaaS mode.
- Migration strategy wajib backward-compatible minimal 1 release.

### 8.2 API Contract
- Request/response schema validation wajib.
- Error contract standar: `code`, `message`, `details`.

## 9. Observability and Operations
- Structured logging untuk endpoint kritikal.
- Error tracking + alerting severity.
- Incident runbook + rollback checklist.

## 10. Testing and Release Governance
### 10.1 Testing Pyramid
- Unit test: domain logic/mapper/validation.
- Integration test: API critical flow.
- E2E: auth -> create -> publish -> RSVP.

### 10.2 Release Gate
- Lint pass.
- Test pass.
- Build pass.
- Smoke staging pass.

## 11. KPI and Analytics
### 11.1 Product KPI
- Activation rate tenant.
- Draft-to-publish conversion.
- RSVP conversion.

### 11.2 Business KPI
- MRR, churn, ARPU.
- Upgrade conversion rate.

### 11.3 Engineering KPI
- Error rate.
- MTTR.
- Deployment success rate.

## 12. Roadmap and Milestones
### Phase 1 - Stabilize MVP
- Validation standardization.
- API contract stabilization.
- Route/flow completeness.
- Opening cinematic baseline untuk template utama.

### Phase 2 - SaaS Core
- Tenant model.
- Role matrix.
- Billing and quota.

### Phase 3 - Scale and Compliance
- Observability full stack.
- Auditability.
- Reliability target enforcement.

## 13. Risks and Mitigations
- Scope creep -> enforce phase gate.
- Regression risk -> mandatory automated tests.
- Data leak risk -> tenant-aware RLS + auth checks.

## 14. Acceptance Criteria Template (Per Feature)
- Business outcome jelas.
- API contract dan validation selesai.
- Security impact dievaluasi.
- Logging/monitoring terpasang.
- Test coverage minimum terpenuhi.
- Doc (`context`, `architecture`, `todo`) diperbarui.

## 15. Traceability Matrix Template
Gunakan format ini untuk setiap requirement penting:
- Requirement ID
- PRD section
- API/Component/Table impacted
- Test cases
- KPI impacted
- Owner

## 16. Implementation Checklist
- [ ] Sinkron dengan `docs/context_project.md`
- [ ] Sinkron dengan `docs/architecture.md`
- [ ] Turunan task ada di `docs/todo.md`
- [ ] Semua task diberi label: product/platform/security/ops
