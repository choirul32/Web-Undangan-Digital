# 🧪 Alur Test Manual – Web Undangan (NusaInvite)

> Panduan uji end-to-end: dari membuat template → membuat undangan dari template → isi konten → publish → undangan publik & RSVP → fitur dashboard (notifikasi realtime, analytics, moderasi guestbook).
>
> Centang tiap langkah saat lolos. Kolom **Hasil diharapkan** adalah kriteria lulus.

---

## 0. Persiapan

| # | Langkah | Hasil diharapkan |
|---|---------|------------------|
| 0.1 | Pastikan `.env.local` berisi `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Mode produksi (Supabase) aktif. Tanpa ini → mode dev, sebagian fitur DB nonaktif |
| 0.2 | Jalankan migration SQL di **Supabase → SQL Editor** (lihat daftar di bawah) | Semua tabel/kolom siap |
| 0.3 | `npm run dev` lalu buka `http://localhost:3000` | Landing page tampil tanpa error console |

**Migration yang wajib dijalankan** (urutan bebas, `schema.sql` paling awal jika DB kosong):
- [ ] `supabase/schema.sql` — skema dasar (jika DB baru)
- [ ] `supabase/add-couple-parent-names.sql`
- [ ] `supabase/add-bank-catalog.sql`
- [ ] `supabase/platform-settings.sql`
- [ ] `supabase/add-view-count-tracking.sql`
- [ ] `supabase/add-invitation-views.sql` — **analytics** (fitur baru)
- [ ] `supabase/add-rsvp-moderation.sql` — **moderasi guestbook** (fitur baru)
- [ ] Aktifkan **Realtime/Replication** untuk tabel `rsvps` (Database → Replication) — untuk notifikasi RSVP

---

## 1. Login Admin

| # | Langkah | Hasil diharapkan |
|---|---------|------------------|
| 1.1 | Buka `/login` | Form email + password tampil |
| 1.2 | Masuk dengan email admin terdaftar (atau email apa pun jika mode dev) | Redirect ke `/dashboard` |
| 1.3 | Email non-admin (mode Supabase) | Ditolak: "Akun ini belum terdaftar sebagai admin aktif" |
| 1.4 | Cek header dashboard | Avatar bulat (inisial email) tampil di kanan atas; klik → email lengkap + Logout |

- [ ] Lolos seksi 1

---

## 2. Membuat & Mengelola Template

**Lokasi:** `/dashboard/templates`

| # | Langkah | Hasil diharapkan |
|---|---------|------------------|
| 2.1 | Buka tab Template | Katalog template admin tampil |
| 2.2 | Buat template baru (atau duplicate template yang ada) | Editor template terbuka |
| 2.3 | Atur konfigurasi per-section: Cover, Global Style, Opening, Widgets, Ornamen | Preview mobile (framed) ikut berubah real-time |
| 2.4 | Set metadata: nama, kategori, paket/harga, status `active` | Tersimpan |
| 2.5 | Simpan / Publish template | Template muncul di katalog dengan status aktif |
| 2.6 | Cek di landing page (`/`) bagian katalog | Template aktif tampil di carousel/katalog publik |

- [ ] Lolos seksi 2

---

## 3. Membuat Undangan dari Template (Order)

**Lokasi:** `/dashboard/invitations/new` (tombol **Buat Order** di header)

Form 4-step:

### Step 0 – Data Pemesan
| Field | Contoh isi |
|-------|-----------|
| Nama Pemesan | Budi Santoso |
| Nomor WhatsApp | 6281234567890 |
| Status Order | `inquiry` → ubah sesuai alur |
| Status Pembayaran | `unpaid` → `paid` |
| Nominal Order | 90000 |
| Deadline | (tanggal) |

### Step 1 – Template & Publikasi
| # | Langkah | Hasil diharapkan |
|---|---------|------------------|
| 3.1 | Pilih **Template** dari dropdown (template yang dibuat di seksi 2) | Template terpilih |
| 3.2 | Pilih Paket (Basic/Premium/Exclusive) | — |
| 3.3 | Isi **Slug Publik** (lowercase, angka, minus) mis. `budi-sari` | URL preview auto: `/preview?slug=budi-sari` |

### Step 2 – Data Mempelai
| # | Langkah | Hasil diharapkan |
|---|---------|------------------|
| 3.4 | Isi nama lengkap + panggilan pria & wanita, nama orang tua, quote | Nama panggilan auto-fill dari kata pertama |

### Step 3 – Fitur & Review
| # | Langkah | Hasil diharapkan |
|---|---------|------------------|
| 3.5 | Aktifkan toggle: RSVP, Amplop, Backsound, Custom Nama Tamu sesuai paket | — |
| 3.6 | Klik **Simpan Draft** | Undangan tersimpan, redirect ke detail `/dashboard/invitations/[slug]`, muncul tab workspace |

- [ ] Lolos seksi 3

> **Edge case:** coba slug yang sudah dipakai → harusnya ditolak/diberi peringatan (cek perilaku saat ini).

---

## 4. Mengisi Konten Undangan

**Lokasi:** detail undangan → tab workspace.

| Tab | # | Langkah | Hasil diharapkan |
|-----|---|---------|------------------|
| **Acara** | 4.1 | Tambah Akad & Resepsi: judul, tanggal, jam, venue, alamat, maps URL. Pakai map picker. | Acara tersimpan; bisa reorder Up/Down |
| **Cerita** | 4.2 | Tambah 2-3 timeline love story (tahun, judul, deskripsi) | Tersimpan & terurut |
| **Amplop** | 4.3 | Tambah rekening dari katalog bank | Logo bank otomatis; warning jika bank tanpa logo |
| **Media** | 4.4 | Upload cover, foto gallery, (audio jika backsound on) | Thumbnail tampil; audio punya player |
| **Tamu** | 4.5 | Tambah beberapa tamu manual + 1x **bulk import** (`Nama, Group, WA`) | Tamu masuk; dedup slug bekerja; tiap tamu punya link `/u/[slug]/to/[guest-slug]` |

- [ ] Lolos seksi 4

---

## 5. Publish Undangan

**Publish guard** akan menolak jika syarat belum lengkap. Pastikan terpenuhi:

- [ ] Slug publik terisi
- [ ] Template terpilih
- [ ] Nama **lengkap** pria & wanita terisi
- [ ] Nama **panggilan** pria & wanita terisi
- [ ] Minimal **1 acara**
- [ ] Jika **Amplop** aktif → minimal 1 rekening
- [ ] Jika **Backsound** aktif → file musik terupload
- [ ] Minimal **cover ATAU 1 foto gallery**

| # | Langkah | Hasil diharapkan |
|---|---------|------------------|
| 5.1 | Klik **Publish** dengan syarat kurang | Ditolak + daftar error spesifik |
| 5.2 | Lengkapi syarat, **Publish** lagi | Status → `published`, `published_at` terisi |
| 5.3 | **Copy Link** | URL publik tersalin ke clipboard |

- [ ] Lolos seksi 5

---

## 6. Undangan Publik & Link Personal Tamu

| # | Langkah | Hasil diharapkan |
|---|---------|------------------|
| 6.1 | Buka `/u/[slug]` (link umum) | Opening reveal → cover, couple, acara, countdown, story, gallery, amplop, RSVP, doa & ucapan |
| 6.2 | Buka `/u/[slug]/to/[guest-slug]` (link personal) | Nama tamu muncul di sapaan/cover |
| 6.3 | Cek backsound (jika aktif) | Musik fade-in setelah undangan dibuka |
| 6.4 | Cek tombol Google Maps di acara | Membuka maps |
| 6.5 | Buka di layar mobile (atau devtools responsive) | Layout undangan mobile-first rapi |

- [ ] Lolos seksi 6

> Catatan: undangan dengan `status != published` tidak bisa diakses publik (404) — uji dengan undangan draft.

---

## 7. RSVP dari Sisi Tamu

| # | Langkah | Hasil diharapkan |
|---|---------|------------------|
| 7.1 | Di `/u/[slug]/to/[guest-slug]`, isi form RSVP: hadir, pax, ucapan | "RSVP berhasil dikirim." |
| 7.2 | Submit beberapa RSVP (variasi hadir/tidak hadir, dengan & tanpa ucapan) | Semua tersimpan |
| 7.3 | Spam submit cepat >12x/menit | Kena rate limit (429) |

- [ ] Lolos seksi 7

---

## 8. Fitur Baru: Notifikasi RSVP Real-time

> Prasyarat: Realtime/Replication tabel `rsvps` aktif.

| # | Langkah | Hasil diharapkan |
|---|---------|------------------|
| 8.1 | Buka dashboard di satu tab; di tab lain submit RSVP baru | 🔔 di header dapat **badge merah**; **toast** muncul di kanan bawah ("RSVP baru dari …") |
| 8.2 | Klik lonceng 🔔 | Dropdown daftar RSVP terbaru; badge angka jadi 0 |
| 8.3 | Buka tab **RSVP** undangan terkait, lalu submit RSVP baru lagi | Baris baru muncul **tanpa refresh** + disorot hijau beberapa detik; badge "Live" hijau |
| 8.4 | Submit RSVP saat sedang di halaman Overview/Tamu | Toast tetap muncul (notifikasi global, lintas halaman) |

- [ ] Lolos seksi 8

---

## 9. Fitur Baru: Analytics / Statistik Undangan

> Prasyarat: `add-invitation-views.sql` sudah dijalankan.

| # | Langkah | Hasil diharapkan |
|---|---------|------------------|
| 9.1 | Buka `/u/[slug]` dan `/u/[slug]/to/[guest-slug]` beberapa kali | View tercatat |
| 9.2 | Dashboard → undangan → tab **Statistik** | 4 kartu: Total dibuka, Dibuka (rentang), Jam ramai (WIB), Tamu sudah buka |
| 9.3 | Lihat grafik **Tren harian** & **Distribusi jam** | Bar terisi; jam puncak disorot hijau |
| 9.4 | Lihat tabel **Status buka per tamu**, filter Semua/Sudah/Belum | Tamu yang buka via link personal = "Sudah buka" |
| 9.5 | Ganti rentang 7/30/90 hari | Data ikut berubah |
| 9.6 | (Negatif) Buka tab Statistik tanpa migration | Pesan error rapi menyebut tabel `invitation_views` |

- [ ] Lolos seksi 9

---

## 10. Fitur Baru: Moderasi Guestbook

> Prasyarat: `add-rsvp-moderation.sql` sudah dijalankan.

| # | Langkah | Hasil diharapkan |
|---|---------|------------------|
| 10.1 | Submit RSVP dengan ucapan dari sisi tamu | Ucapan tersimpan |
| 10.2 | Reload `/u/[slug]` → section "Doa & Ucapan" | Ucapan **asli** tamu tampil (bukan dummy) |
| 10.3 | Undangan tanpa ucapan | Empty-state "Belum ada ucapan. Jadilah yang pertama…" |
| 10.4 | Dashboard → tab **RSVP** → kolom Aksi → **Sembunyikan** sebuah ucapan | Baris diredup, teks dicoret, badge "Disembunyikan" |
| 10.5 | Reload undangan publik | Ucapan yang disembunyikan **hilang** dari publik |
| 10.6 | Klik **Tampilkan** lagi | Ucapan kembali muncul di publik |
| 10.7 | Klik **Hapus** (konfirmasi) | RSVP terhapus dari dashboard & publik |

- [ ] Lolos seksi 10

---

## 11. Broadcast WhatsApp & Export (Manual)

**Lokasi:** tab **Tamu**.

| # | Langkah | Hasil diharapkan |
|---|---------|------------------|
| 11.1 | Edit template WA (`{guest_name}`, `{guest_link}`) | Token tersubstitusi |
| 11.2 | Copy link per tamu / Copy teks WA / Open WA | Clipboard & `wa.me` benar |
| 11.3 | Bulk Copy Links / Bulk Copy WA | Semua tamu tersalin |
| 11.4 | Export CSV (Tamu & RSVP) | File CSV terunduh, kolom benar |

- [ ] Lolos seksi 11

---

## 12. Pengaturan & Overview

| # | Langkah | Hasil diharapkan |
|---|---------|------------------|
| 12.1 | `/dashboard/settings`: ubah profil bisnis, tema, palet | Tersimpan (ke Supabase via `/api/settings`) |
| 12.2 | Ganti Tema (Terang/Gelap/Sistem) & Palet | Dashboard berubah seketika |
| 12.3 | `/dashboard` Overview | Metric card (total, published, menunggu bayar, RSVP pax) sesuai data |

- [ ] Lolos seksi 12

---

## ✅ Ringkasan Cakupan

| Area | Seksi |
|------|-------|
| Auth | 1 |
| Template | 2 |
| Order/Undangan | 3, 4, 5 |
| Sisi tamu | 6, 7 |
| Fitur baru | 8 (notifikasi), 9 (analytics), 10 (moderasi) |
| Operasional | 11, 12 |

> Catatan diketahui: dashboard sengaja **laptop-only** (tidak mobile-friendly); pembayaran **manual**; QR check-in belum ada.

*Dokumen alur test manual — dibuat untuk verifikasi end-to-end.*
