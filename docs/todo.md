# TODO Production SaaS v2 (Execution Backlog)

## Production Readiness Sequence

Status ringkas berdasarkan kondisi project saat ini.

### Sudah Ada / Fondasi Berjalan
- [x] Landing page marketing.
- [x] Admin login/logout dengan Supabase Auth dan fallback dev mode.
- [x] Dashboard admin dasar.
- [x] Model bisnis awal jelas: order, pembayaran, dan broadcast manual via WhatsApp.
- [x] CRUD dasar invitation/template/guest/RSVP/media/content.
- [x] Public invitation route: `/u/[slug]`.
- [x] Personal guest route: `/u/[slug]/to/[guestSlug]`.
- [x] RSVP submission publik.
- [x] Supabase schema awal dan storage bucket.
- [x] Template renderer dengan widget utama.
- [x] Opening reveal dan ornament editor dasar.

### Belum Matang / Harus Dikerjakan Sebelum Production
- [x] Manual order tracking tersedia.
- [x] Manual payment status tersedia.
- [x] WhatsApp copy/link generator untuk broadcast manual matang untuk Phase 1.
- [x] Order-to-publish workflow aman untuk pesanan real baseline.
- [x] Dashboard UI/UX mengikuti `docs/design.md`.
- [x] Dashboard punya active invitation context.
- [x] Manager utama tidak lagi hardcode `dimas-salsa`.
- [x] Publish action dan publish guard lengkap baseline.
- [x] CRUD detail per undangan lengkap baseline.
- [x] Design config editor preset-first dan tidak wajib mulai dari JSON teknis.
- [x] Widget preview diaudit parity-nya dengan public renderer dan fallback state baseline.
- [x] Template quality guard cukup untuk baseline production.
- [x] Route demo lengkap.
- [x] Validation layer dan API error contract.
- [x] Testing baseline.
- [x] CI quality gate.
- [x] Observability dan error tracking.
- [x] Tenant model dan role-based authorization.
- [x] Billing, quota, subscription lifecycle baseline.
- [x] Rate limiting dan audit log.
- [x] Backup/restore runbook.
- [x] Opening Cinematic sebagai fitur template utama.

### Urutan Kerja Menuju Production
1. Amankan manual order flow dari WhatsApp sampai pembayaran tercatat.
2. Amankan flow admin dari pesanan masuk sampai publish.
3. Hilangkan hardcode `dimas-salsa` dan pakai active invitation context.
4. Lengkapi CRUD data pesanan: invitation, guest, event, story, bank account, media.
5. Tambah publish action, publish guard, dan preview per invitation.
6. Tambah guest link + WhatsApp copy generator untuk broadcast manual.
7. Rapikan API contract, validation, dan service boundary.
8. Bangun fitur template pembeda yang paling cepat dijual.
9. Tambah testing, observability, logging, dan runbook operasional.
10. Baru setelah stabil: tenant model, role matrix, manual billing ledger, quota, dan optional payment webhook jika strategi pasar berubah.

### Production Gate
- [x] `npm run build` sukses.
- [ ] Flow WA inquiry -> manual payment confirmed -> create order -> edit detail -> add guests -> add media/content -> preview -> publish -> copy broadcast link -> RSVP lolos manual smoke test.
- [x] API critical sudah tervalidasi.
- [x] Minimal e2e test untuk flow utama tersedia sebagai CI/build gate + smoke plan baseline.
- [x] Error tracking aktif sebagai structured logging baseline.
- [x] Data backup strategy terdokumentasi.
- [ ] Tenant isolation sudah diuji sebelum mode SaaS dibuka.

## P0 - Order-to-Publish Workflow Hardening
Bagian ini wajib didahulukan sebelum fitur template selling experiment jika targetnya dipakai untuk pesanan asli.

## P0 - Dashboard UI/UX Refactor
Refactor dashboard harus mengikuti `docs/design.md`: light canvas, monochrome, compact typography, structural borders, dan minim dekorasi.

### Dashboard Shell
- [x] Terapkan dashboard design tokens dari `docs/design.md`.
- [x] Refactor sidebar menjadi light/neutral, ringkas, dan operational.
- [x] Refactor header menjadi compact dengan active order context.
- [x] Tambah primary action area: create order, save, preview, publish.
- [x] Pastikan dashboard tidak terasa seperti landing page.

### Overview
- [x] Ubah metrics menjadi order-focused: inquiry, waiting payment, in progress, review, published.
- [x] Buat row action nyata untuk edit, preview, publish/archive.
- [x] Ganti activity feed sample menjadi data aktual atau sembunyikan sampai tersedia.

### Invitation / Order Editor
- [x] Buat layout editor berbasis section: Order, Couple, Events, Features, Media, Guests, Review.
- [x] Tambah sticky action bar: Save Draft, Preview, Mark Review, Publish.
- [x] Tambah manual order/payment fields di UI.
- [x] Pastikan editor bisa create dan edit invitation existing.

### Guest Manager UX
- [x] Ikat Guest Manager ke active invitation.
- [x] Tambah inline edit/delete.
- [x] Tambah filter group/status RSVP.
- [x] Tambah copy personal link.
- [x] Tambah copy WhatsApp message untuk broadcast manual.
- [x] Tambah bulk import/export setelah CRUD stabil.

### RSVP Manager UX
- [x] Ikat RSVP Manager ke active invitation.
- [x] Tambah summary cards: hadir, tidak hadir, belum RSVP, total pax.
- [x] Tambah filter attendance, group, tanggal.
- [x] Pastikan export CSV hanya data invitation aktif.

### Media Manager UX
- [x] Ikat Media Manager ke active invitation.
- [x] Split UI menjadi tabs: Cover, Gallery, Music, Video.
- [x] Tambah replace media.
- [x] Tambah delete media.
- [x] Tampilkan lokasi penggunaan asset.

### Content Manager UX
- [x] Split UI menjadi panels: Events, Love Story, Gift Accounts.
- [x] Tambah edit/delete/reorder untuk event.
- [x] Tambah edit/delete/reorder untuk story.
- [x] Tambah edit/delete untuk bank account.
- [x] Tambah preview impact setelah content berubah.

### Template Manager UX
- [x] Refactor menjadi preset-first workflow.
- [x] Step utama: Metadata, Preset, Global Style, Opening, Widgets, Ornaments, Preview, Publish.
- [x] Sembunyikan Advanced JSON di collapsible section.
- [x] Tambah quality guard sebelum publish template.

### Settings UX
- [x] Tambah platform settings dasar: brand, WA admin, default package, default template, payment instructions.
- [x] Pastikan settings phase awal fokus manual order, bukan SaaS billing.

### Acceptance Criteria Dashboard UX
- [x] Admin selalu tahu sedang mengelola order/undangan yang mana.
- [x] Semua action utama bekerja dan tidak hanya tombol visual.
- [x] Semua manager memakai active invitation context.
- [x] UI dashboard mengikuti style `docs/design.md`.
- [x] Flow create order sampai publish bisa dilakukan tanpa keluar dari dashboard.

### Manual Order and Payment
- [x] Tambah data/status order manual: `inquiry`, `waiting_payment`, `paid`, `in_progress`, `review`, `revision`, `approved`, `published`, `completed`, `cancelled`.
- [x] Tambah field order: nama pemesan, nomor WhatsApp, paket, nominal, status pembayaran, catatan konsep, deadline.
- [x] Tambah action admin untuk menandai pembayaran manual sebagai paid.
- [x] Tambah catatan revisi/order notes untuk komunikasi via WhatsApp.
- [x] Pastikan payment gateway otomatis tidak menjadi blocker Phase 1.

### Invitation Context
- [x] Buat konsep active invitation di dashboard.
- [x] Buat route editor detail per undangan: `/dashboard/invitations/[slug]`.
- [x] Semua manager menerima `invitationSlug` dari route/state, bukan hardcode.
- [x] Tabel undangan punya action nyata: edit, preview, publish/archive.

### Invitation Create/Edit/Publish
- [x] Ubah form undangan agar bisa create dan edit invitation existing.
- [x] Tambah publish action yang mengubah status ke `published`.
- [x] Tambah publish guard: slug, template, nama mempelai, minimal satu event, dan data fitur aktif harus valid.
- [x] Cegah duplikasi event saat save draft berulang.
- [x] Tambah preview per invitation: `/preview?slug={slug}` atau route preview internal yang setara.

### Guest Data
- [x] Hapus hardcode `dimas-salsa` dari Guest Manager.
- [x] Tambah edit/delete guest.
- [x] Tambah duplicate slug handling di UI.
- [x] Tambah phone field sesuai schema.
- [x] Tambah rollback UI jika create guest gagal.
- [x] Tambah bulk import/export guest sebagai follow-up setelah CRUD stabil.

### Content and Media Data
- [x] Hapus hardcode `dimas-salsa` dari Media Manager.
- [x] Hapus hardcode `dimas-salsa` dari Event/Story/Bank Account Manager.
- [x] Tambah edit/delete event, story, bank account, dan media.
- [x] Tambah replace media untuk cover, gallery, music.
- [x] Pastikan public renderer membaca data terbaru dari invitation yang sama.

### RSVP and Public Link
- [x] Pastikan RSVP submit berdasarkan invitation slug aktif.
- [x] Pastikan guest personal link memakai slug undangan yang benar.
- [x] Tambah handling RSVP duplicate per guest jika dibutuhkan.
- [x] Tambah RSVP summary per invitation, bukan global/sample.

### Manual Broadcast Support
- [x] Tambah WhatsApp copy generator per guest.
- [x] Tambah bulk copy/export daftar nama + personal link.
- [x] Pastikan sistem tidak mengirim broadcast otomatis di Phase 1.
- [x] Format copy WhatsApp bisa disesuaikan admin.

### Acceptance Criteria P0
- [x] Admin bisa membuat satu pesanan baru dari nol.
- [x] Admin bisa mencatat order WhatsApp dan status pembayaran manual.
- [x] Admin bisa mengisi data mempelai, acara, tamu, media, story, dan rekening untuk pesanan itu.
- [x] Admin bisa preview pesanan yang sama.
- [x] Admin bisa publish pesanan yang sama.
- [x] Public URL hanya menampilkan data pesanan tersebut.
- [x] Link personal tamu mengarah ke pesanan dan tamu yang benar.
- [x] Admin/user bisa copy teks broadcast manual untuk tamu.
- [x] RSVP tamu masuk ke pesanan yang benar.

## Feature Experiment Track - Template Selling Features
Gunakan track ini untuk mengetes satu fitur template dulu sebelum masuk implementasi besar. Urutan dibuat dari dampak visual tertinggi ke operasional admin.

## P0.5 - Template Design Config UX Hardening
Bagian ini dikerjakan setelah order-to-publish flow aman, sebelum memperbanyak template baru.

### Preset-First Editor
- [x] Ubah flow Template Admin menjadi: theme preset -> global style -> section layout -> opening -> widget -> ornament -> advanced.
- [x] Jadikan pilihan preset sebagai entry utama saat membuat template.
- [x] Tambah preset awal: `royal`, `floral`, `minimal`, `islamic`, `cinematic`.
- [x] Preset harus mengatur warna, font, spacing, section style, opening, widget variant, dan starter ornament.

### Design Config Hierarchy
- [x] Pisahkan UI antara global style, section layout, widget style, ornament fine tuning, dan advanced JSON.
- [x] Advanced JSON dibuat collapsible/opsional.
- [x] Tambah label/struktur yang jelas agar admin tidak mulai dari detail teknis.

### Quality Guard
- [x] Tambah contrast warning.
- [x] Tambah mobile overflow warning.
- [x] Tambah warning terlalu banyak ornament animated.
- [x] Tambah warning missing/broken asset.
- [x] Tambah warning opening terlalu lama/berat.
- [x] Tambah warning widget aktif tanpa fallback aman.

### Preview Workflow
- [x] Jadikan mobile 430px sebagai preview default.
- [x] Tambah replay opening di preview.
- [x] Tambah preview with guest name dan tanpa guest name.
- [x] Tambah empty data fallback preview.
- [x] Pastikan preview memakai renderer yang sama atau mendekati public page.

### Widget Style Editor
- [x] Standarkan semua panel widget dengan urutan: enable -> variant -> style preset -> behavior -> preview -> advanced.
- [x] Tambah panel widget yang konsisten untuk Opening, Countdown, Events, Story, Gallery, Gift, RSVP, dan Music.
- [x] Tambah style preset widget yang mengikuti global theme.
- [x] Audit mini preview yang sudah ada: Opening, Cover, Couple, Countdown, Story, Gallery, Event, Music, Ornament Canvas.
- [x] Tambah/rapikan dedicated preview untuk Gift dan RSVP.
- [x] Pastikan full template iframe preview tetap memakai snapshot editor yang benar.
- [x] Tambah fallback warning per widget.
- [x] Jadikan advanced widget options collapsible.

### Widget Preview Parity
- [x] Bandingkan widget preview dengan public renderer untuk setiap widget.
- [x] Tambah enabled/disabled preview state.
- [x] Tambah filled/empty data preview state.
- [x] Tambah missing asset/config preview warning.
- [x] Tandai perbedaan besar antara preview dan public renderer sebagai bug UX.

### Widget Fallback Rules
- [x] Gift aktif tanpa rekening harus warning dan tidak render section rusak.
- [x] Gallery kosong harus hide atau tampil placeholder admin-only.
- [x] Countdown tanpa event harus warning/hide aman.
- [x] RSVP aktif harus submit ke invitation yang benar.
- [x] Music aktif tanpa file harus warning dan tidak render player rusak.

### Acceptance Criteria P0.5
- [x] Admin bisa membuat template layak publish tanpa membuka Advanced JSON.
- [x] Preset menghasilkan desain yang rapi secara default.
- [x] Template buruk/rusak memunculkan warning sebelum publish.
- [x] Mobile preview cukup akurat untuk menilai template.
- [x] Admin bisa mengatur semua widget dengan pola UI yang sama.
- [x] Widget preview dan fallback rules mencegah hasil undangan terlihat rusak.

### Experiment 1 - Opening Cinematic
- [x] Buat baseline `OpeningSequence` dan satu preset paling sederhana.
- [x] Tambah preset opening cinematic ringan: `floral-bloom`, `falling-petals`, `royal-gate`, `paper-reveal`, `wayang-shadow`.
- [x] Tambah support opening asset type: `motion`, `lottie`, `video`, dan `image-sequence`.
- [x] Tambah upload/selector asset opening khusus, terpisah dari ornament section biasa.
- [x] Tambah renderer Lottie opening dengan fallback jika file gagal load.
- [x] Tambah renderer video opening dengan fallback poster image dan tombol skip.
- [x] Tambah quality guard asset opening: ukuran maksimal, durasi maksimal, poster wajib untuk video, dan reduced-motion fallback.
- [x] Tambah kontrol admin opening asset: duration, delay, loop, skippable, poster, dan entrance timing.
- [ ] Test di public preview mobile dan desktop.
- [ ] Ukur secara manual: apakah opening terasa premium dan tidak mengganggu load.

### Experiment 2 - Guest Personalization in Opening
- [x] Tampilkan nama guest di opening cinematic/reveal screen.
- [x] Tambah fallback untuk public link tanpa guest slug.
- [x] Test copy personal untuk `/u/[slug]/to/[guestSlug]`.

### Experiment 3 - Template Visual Presets
- [x] Tambah mood preset per template: `classic`, `royal`, `floral`, `minimal`, `cinematic`.
- [x] Pastikan preset mengubah warna, font, ornament, opening, dan widget style secara konsisten.
- [x] Tambah kontrol admin untuk memilih preset.

### Experiment 4 - Smart Theme Composer
- [x] Tambah composer sederhana: pilih konsep -> generate design config default.
- [x] Mulai dari konsep: `adat-jawa`, `modern-luxury`, `floral-soft`, `islamic-elegant`.
- [x] Pastikan hasil composer bisa diedit lanjut di template admin.

### Experiment 5 - Accurate Mobile Preview
- [x] Audit preview iframe agar mendekati public page 430px.
- [x] Pastikan opening cinematic ikut tampil di preview.
- [x] Tambah refresh/replay control untuk opening preview.

### Experiment 6 - WhatsApp Share Text Generator
- [x] Generate teks WhatsApp personal per guest.
- [x] Sertakan nama tamu, link personal, dan format copy yang rapi.
- [x] Tambah tombol copy di Guest Manager.

### Experiment 7 - Storytelling Sections
- [x] Tambah varian premium love story: cinematic timeline, photo album, chapter scroll, chat-style journey.
- [x] Mulai dari satu varian yang paling cepat diuji.

### Experiment 8 - Interactive Gallery
- [x] Tambah cinematic slideshow atau swipe mode.
- [x] Pastikan fullscreen viewer tetap stabil di mobile.

### Experiment 9 - Music Ambience
- [x] Tambah fade-in musik setelah opening.
- [x] Pastikan autoplay tetap mengikuti batasan browser.
- [x] Uji ornament pulse sync hanya jika performa mobile aman.

### Experiment 10 - RSVP Smart Summary
- [x] Tambah summary hadir/tidak hadir/total pax/grup/pesan terbaru.
- [x] Tampilkan di dashboard RSVP/overview.

## Phase 1 - Stabilize MVP (Target: 2-4 minggu)

### Product
- [x] Lengkapi route demo (`/demo`) agar flow demo utuh.
- [x] Finalisasi invitation lifecycle di UI: `draft -> review -> published -> archived`.
- [x] Tambah operasi edit/delete yang masih parsial (events, stories, bank accounts, guests).
- [x] Definisikan requirement detail Opening Cinematic sebagai pembeda utama template undangan.
- [x] Definisikan batas production opening asset: Lottie max size, video max size/duration, poster, skip behavior, dan mobile fallback.
- [x] Tambah preset opening cinematic awal: `floral-bloom`, `falling-petals`, `royal-gate`, `paper-reveal`, `wayang-shadow`.
- [x] Tambah kontrol admin sederhana untuk memilih preset opening cinematic tanpa perlu mengatur semua ornament manual.

### Platform
- [x] Terapkan schema validation terpusat untuk endpoint: `invitations`, `templates`, `guests`, `rsvps`, `media`, `events`, `stories`, `bank-accounts`.
- [x] Standardisasi API response contract (success + error).
- [x] Ekstrak service layer awal: invitation, template, guest, RSVP.
- [x] Ekstrak repository/query layer dari route handlers.
- [x] Buat komponen renderer terpisah `OpeningSequence` untuk intro cinematic.
- [x] Tambah schema config opening sequence yang backward-compatible dengan `widgets.openingReveal`.
- [x] Pisahkan timeline intro dari ornament section biasa agar animasi awal tidak bergantung pada editor ornament per section.
- [x] Tambah schema `widgets.openingSequence.asset` untuk menyimpan type, src, poster, duration, loop, skippable, dan fallback preset.
- [x] Tambah storage/path policy untuk asset opening agar video/Lottie tidak bercampur dengan gallery biasa.

### Security
- [x] Audit konsistensi `requireAdminApiSession` di semua endpoint admin.
- [x] Tambah validasi input anti-malformed request untuk endpoint publik RSVP.

### Ops
- [x] Setup structured logging untuk error endpoint kritikal.
- [x] Setup baseline error tracking.

### Exit Criteria Phase 1
- [x] Semua endpoint utama tervalidasi dan contract konsisten.
- [x] Tidak ada flow utama yang broken (login -> create -> publish -> RSVP).
- [x] Error API kritikal termonitor.
- [x] Template publik bisa menjalankan opening cinematic preset lalu menampilkan cover undangan tanpa glitch.

## Phase 2 - SaaS Core Enablement (Target: 4-8 minggu)

### Product
- [x] Baseline tenant workspace model.
- [x] Baseline membership invite dan role assignment.
- [x] Baseline onboarding self-service tenant owner.

### Platform
- [x] Baseline role-based authorization matrix.
- [x] Tambah tenant-scoped data model dan migration plan.
- [x] Terapkan tenant-aware RLS policy pada tabel domain utama.
- [x] Tambah draft SQL migration SaaS baseline untuk tenant, plan, subscription, quota, dan audit log.

### Billing
- [x] Tambah baseline plan and quota schema untuk fase SaaS.
- [x] Tetapkan billing tetap manual via WA/bank transfer, bukan payment gateway otomatis.
- [x] Payment gateway + webhook idempotency dipindahkan ke optional future, bukan blocker production.
- [x] Definisikan subscription states: `trial`, `active`, `grace`, `suspended`, `canceled` setelah manual order flow stabil.
- [x] Definisikan quota enforcement baseline di API dan UI setelah plan final.

### Security
- [x] Tambah rate limiting untuk endpoint publik.
- [x] Tambah audit log untuk aksi sensitif (publish, delete, role/billing changes).

### Ops
- [x] Tambah dashboard KPI produk dasar (activation, publish conversion, RSVP conversion).
- [x] Tambah dashboard health API (latency, error rate, auth failures).

### Exit Criteria Phase 2
- [ ] Tenant terisolasi dengan aman setelah `supabase/phase2-saas-baseline.sql` dieksekusi dan RLS diuji di Supabase.
- [x] Billing lifecycle manual berjalan sesuai target pasar tanpa gateway otomatis.
- [x] Quota enforcement baseline berjalan sesuai plan manual.

## Phase 3 - Scale, Reliability, Compliance (Target: 6-12 minggu)

### Platform
- [x] Baseline refactor modular renderer/template sections untuk maintainability.
- [x] Tambah async job mechanism baseline untuk task non-blocking (notif, billing retries, media processing).

### Quality
- [x] Setup test pyramid baseline.
- [x] Definisikan unit tests domain + validation.
- [x] Definisikan integration tests API kritikal.
- [x] Definisikan E2E tests alur utama.
- [x] Tambah release gate baseline: diff-check + build + smoke staging.

### Security and Compliance
- [x] Session hardening policy baseline (rotation/revocation/inactivity timeout).
- [x] Backup/restore drill dan dokumentasi RPO/RTO.
- [x] Hardening secret management dan environment governance.

### Ops
- [x] Incident runbook + rollback playbook.
- [x] Alerting policy per severity dengan owner respons jelas.

### Exit Criteria Phase 3
- [x] Release gate otomatis aktif di CI.
- [x] Reliability target baseline terdokumentasi (availability, error rate, MTTR).
- [x] Operasional baseline siap scale dengan runbook dan monitoring matang.

## Cross-Cutting Governance
- [x] Semua task wajib label: `product`, `platform`, `security`, `ops`.
- [x] Semua perubahan besar wajib referensi PRD section + dampak arsitektur.
- [x] Semua perubahan schema mayor wajib ADR.
- [x] Semua task yang selesai wajib update dokumen terkait (`PRD`, `architecture`, `context_project`).

## Suggested Sprint Order (Pragmatic)
1. Phase 1 Platform + Security baseline.
2. Phase 1 Product flow completeness.
3. Phase 1 Ops baseline.
4. Phase 2 Tenant + AuthZ.
5. Phase 2 Manual Billing + Quota.
6. Phase 3 Testing + CI gates.
7. Phase 3 Reliability + Compliance.
