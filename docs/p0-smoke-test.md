# P0 Smoke Test Runbook

## Purpose
Runbook ini dipakai untuk memastikan flow manual order sampai RSVP aman sebelum masuk Dashboard UI/UX Refactor.

## Preconditions
- `npm run build` sukses.
- Admin bisa login atau dev mode aktif.
- Jika memakai Supabase mode, schema terbaru sudah diterapkan dari `supabase/schema.sql`.
- Gunakan slug unik, contoh: `smoke-test-2026-05-16`.

## Test Data
- Customer name: `Smoke Test Customer`
- Customer WA: `6281234567890`
- Couple: `Raka Pratama` dan `Nadya Kirana`
- Nickname: `Raka` dan `Nadya`
- Event: `Akad Nikah`, tanggal valid, venue valid.
- Guest: `Bapak Andi Smoke`, group `Keluarga`, WA `6281111111111`.
- Bank account: `BCA`, `Raka Pratama`, `1234567890`.

## Smoke Steps
- [ ] Login admin.
- [ ] Buka `/dashboard/invitations`.
- [ ] Buat draft undangan baru dengan slug unik.
- [ ] Isi manual order fields: customer, WA, order status, payment status, nominal, deadline, notes.
- [ ] Isi template, mempelai, event, dan fitur.
- [ ] Simpan draft.
- [ ] Buka `/dashboard/invitations/{slug}`.
- [ ] Tambah guest dengan phone.
- [ ] Copy personal link guest.
- [ ] Copy teks WhatsApp guest.
- [ ] Copy bulk guest links.
- [ ] Export CSV guest links.
- [ ] Tambah atau update event tambahan.
- [ ] Tambah atau update love story.
- [ ] Tambah atau update bank account.
- [ ] Upload cover atau gallery.
- [ ] Replace media yang sudah diupload.
- [ ] Preview `/preview?slug={slug}`.
- [ ] Publish invitation.
- [ ] Buka public URL `/u/{slug}`.
- [ ] Buka personal URL `/u/{slug}/to/{guestSlug}`.
- [ ] Submit RSVP dari personal URL.
- [ ] Buka dashboard RSVP untuk invitation yang sama.
- [ ] Pastikan RSVP muncul di invitation yang benar.
- [ ] Submit RSVP ulang dari guest yang sama.
- [ ] Pastikan RSVP tidak menjadi row ganda untuk guest personal yang sama.
- [ ] Archive invitation.
- [ ] Pastikan public URL tidak lagi menampilkan invitation published.

## Pass Criteria
- Build sukses.
- Semua data tersimpan pada invitation slug yang sama.
- Public URL hanya muncul setelah publish.
- Personal guest URL memakai slug invitation dan slug guest yang benar.
- RSVP masuk ke invitation yang benar.
- Duplicate RSVP guest personal meng-update data lama, bukan menambah row baru.
- Broadcast tetap manual copy/export, tidak ada pengiriman otomatis.

## Current Status
- Automated build: passed.
- Manual browser smoke test: not run.
- P0 acceptance criteria boleh dicentang hanya setelah manual browser smoke test passed.
