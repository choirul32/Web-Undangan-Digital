# Context Project (Current State and Production Direction)

## 0. Target Market & Positioning (disepakati via grill-with-docs, 2026-08-28)

**Target market**: anak muda 20-40 yang menikah dan butuh undangan untuk disebar online. Customer adalah pasangan yang memesan; Tamu adalah end-user yang membuka undangan, RSVP, dan berinteraksi.

**Model bisnis**: admin-managed manual order service. Customer melihat katalog template → konfirmasi via WhatsApp → admin menyiapkan → admin minta data → selesai → customer terima link + isi daftar tamu → share ke WA/medsos. Pembayaran manual via transfer, dibantu QRIS statis.

**Positioning unggulan**: template reusable tanpa batas (posisi, warna, ornament, gaya, fitur, widget bisa diedit) dengan kombinasi **animasi ornament + fitur buka undangan** yang terasa premium.

**Target perangkat**: HP entry-level Android (RAM 2-3GB) harus tetap mulus. Semua keputusan animasi/fitur harus menghormati batas ini.

**Keputusan fitur** (hasil validasi):
- Prioritas tinggi: opening reveal + ornament animasi, nama tamu personal, music ambience, cinematic video cover.
- Photobox online (baru): tamu foto langsung di web, tambah stiker, frame photobox, hasil tampil di galeri photobox undangan. Live saat acara + setelahnya. Tampil instan, admin bisa hapus. Diaktifkan admin per undangan. Jadi pembeda tier Exclusive. Diposisikan sebagai "photo wall" — tamu foto kapan saja (sebelum/saat/sesudah acara), bukan booth real-time yang harus antre.
- QRIS statis untuk pembayaran (fondasi sudah ada di `qrisImage`).
- QR Check In: **dihapus** dari landing page dan roadmap — tidak diimplementasikan dan friction tinggi.
- Love story panjang: prioritas diturunkan.
- Nama tamu personal + RSVP: standar di semua tier pricing (bukan upsell).
- Harga Basic tetap Rp 45.000 (fitur standar = harga masuk undangan digital modern). Pembeda tier pindah ke: jumlah revisi, durasi aktif, video cover, photobox, template exclusive.
- Performa: Lottie dan video BUKAN default opening. Default tetap animasi CSS/motion ringan (useReducedMotion + fallback poster). Video/lottie jadi opsi premium yang dipilih sadar — melindungi performa HP entry-level.

## 1. Product Context
NusaInvite adalah aplikasi undangan digital dengan workflow utama saat ini:
- User pesan dan konsultasi via WhatsApp.
- Pembayaran dilakukan manual via WhatsApp/bank transfer.
- Admin login.
- Admin membuat/mengelola undangan.
- Admin/user broadcast link undangan secara manual via WhatsApp.
- Tamu mengakses link publik dan submit RSVP.

Model utama ini adalah admin-managed manual order service. Target jangka panjang bisa berkembang menjadi production SaaS, tetapi payment gateway dan broadcast otomatis bukan target utama karena pasar yang dituju lebih cocok dengan pembayaran dan komunikasi manual via WhatsApp.

## 2. Current Scope in Code
### Sudah Ada
- Landing marketing page.
- Admin auth + dashboard area.
- CRUD invitation/template/guest/rsvp/media/content dasar.
- Public invitation rendering dengan personal guest slug.
- Opening reveal dan ornament timeline dasar untuk template.
- Supabase integration (Auth, Postgres, Storage).

### Belum Matang / Belum Lengkap
- Manual order tracking belum ada.
- Manual payment status belum ada.
- WhatsApp copy/link generator untuk broadcast manual belum matang.
- Order-to-publish workflow belum aman untuk pesanan real.
- Dashboard belum punya active invitation context.
- Beberapa manager masih hardcode slug sample `dimas-salsa`.
- Publish action dan publish guard belum lengkap.
- Automated testing end-to-end.
- Standard API validation and error contracts.
- Billing gateway otomatis.
- Observability and incident workflow.
- Tenant-aware authorization model yang formal.
- Opening cinematic belum dipisahkan sebagai fitur utama. Saat ini opening masih berupa overlay reveal dan ornament section, belum intro sequence dengan preset timeline yang mudah dipakai admin.

## 3. Stakeholder Context
- Primary sekarang: tim internal/admin operator.
- Target berikutnya: owner bisnis undangan (self-service SaaS users).
- Secondary: tamu undangan sebagai external end-user.

## 4. Technical Context
- Stack: Next.js 14, React 18, Tailwind, Framer Motion, Supabase JS.
- Routing: App Router (`src/app`).
- API backend: route handlers (`src/app/api`).
- Rendering engine: `src/templates/UniversalTemplate.jsx`.
- Data schema: `supabase/schema.sql`.

## 5. Operational Context
- Dua mode jalan:
  - Supabase mode (persisten)
  - Sample/dev fallback mode
- Session admin menggunakan HTTP-only cookie.
- Public data visibility dikontrol oleh status `published` + policy.

## 6. Risks if We Scale Without Refactor
1. Regression tinggi karena belum ada safety net test.
2. Sulit maintain karena komponen/handler mulai gemuk.
3. Risiko data leakage saat masuk multi-tenant jika policy tidak direstruktur.
4. Sulit diagnosis issue tanpa logging/metrics standar.
5. Risiko data pesanan tercampur karena manager dashboard belum selalu terikat ke invitation aktif.

## 7. Production Target Context
Agar layak full production SaaS, context project harus mengikat 3 jalur paralel:
1. Product maturity fase awal: manual order tracking, manual payment confirmation, order-to-publish, manual broadcast support.
2. Engineering maturity: testability, validation, modular services.
3. Operations maturity: observability, incident response, deployment gate.

Self-service onboarding dan quota enforcement bisa masuk fase SaaS berikutnya setelah manual order flow stabil. Payment gateway tetap optional, bukan blocker, karena billing utama ditargetkan manual via WhatsApp/bank transfer.

Untuk diferensiasi produk undangan, template system juga harus memiliki jalur khusus untuk Opening Cinematic: intro awal berbasis preset yang menampilkan animasi ornament/bunga, lalu memunculkan tulisan undangan dan cover utama secara terkontrol.

Backlog fitur template yang berpotensi menjual diperlakukan sebagai experiment track, bukan kewajiban implementasi sekaligus. Urutan awal: Opening Cinematic, Guest Personalization in Opening, Template Visual Presets, Smart Theme Composer, Accurate Mobile Preview, WhatsApp Share Text Generator, Storytelling Sections, Interactive Gallery, Music Ambience, dan RSVP Smart Summary.

Namun prioritas implementasi sebelum experiment track adalah mengamankan flow admin pesanan: create order, edit detail, tambah tamu, tambah media/konten, preview, publish, dan RSVP masuk ke invitation yang benar.

## 8. Constraints and Guardrails
- Semua perubahan harus backward-compatible untuk data invitation existing.
- Tidak boleh memutus fallback mode sebelum staging parity tercapai.
- PR besar wajib mapping ke requirement PRD dan test impact.
- Setiap TODO harus diberi kategori: `product`, `platform`, `ops`, `security`.

## 9. Definition of Context Complete
Dokumen context dianggap lengkap jika sudah ada:
- Scope sekarang vs scope target production.
- Gap yang terukur.
- Batasan teknis dan operasional.
- Aturan prioritas agar eksekusi TODO tidak merusak fitur berjalan.
