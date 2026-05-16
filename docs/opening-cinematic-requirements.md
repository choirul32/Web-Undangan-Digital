# Opening Cinematic Requirements

## Tujuan
Opening Cinematic adalah pembeda utama template undangan. Fitur ini harus memberi kesan premium saat undangan pertama kali dibuka, sebelum cover dan isi undangan tampil.

## Flow Pengguna
1. Tamu membuka public URL atau personal guest URL.
2. Sistem menampilkan opening overlay dengan preset animasi, ornament, atau asset visual.
3. Nama tamu personal tetap muncul jika fitur guest name aktif.
4. Tamu menekan tombol buka undangan atau skip jika tersedia.
5. Overlay keluar, musik fade-in, lalu cover undangan tampil tanpa glitch.

## Tipe Opening
- `motion`: preset animasi CSS/Framer Motion tanpa file eksternal.
- `video`: video pendek background opening.
- `lottie`: animasi JSON ringan.
- `image-sequence`: poster/frame ornament sebagai fallback ringan.

## Production Rules
- Video maksimal 8 MB, format `mp4` atau `webm`.
- Lottie maksimal 500 KB dan wajib punya poster fallback.
- Poster/image maksimal 2 MB.
- Semua asset opening disimpan di path storage khusus `template-assets/{templateId}/opening`.
- Opening tidak boleh bergantung pada gallery biasa.
- Jika asset gagal dimuat, renderer harus fallback ke preset opening.
- Jika user memakai reduced motion, asset berat harus turun ke poster/fallback.
- Tombol skip harus tersedia untuk opening asset yang berpotensi lama.

## Admin UX
- Admin bisa memilih preset opening.
- Admin bisa upload asset opening dan poster.
- Admin bisa melihat asset di preview kecil Template Admin.
- Admin bisa melihat opening penuh lewat preview mobile/public preview.
- Quality guard wajib memberi warning jika video/lottie tidak punya `src` atau poster.

## Acceptance Criteria
- Public preview menampilkan opening preset lalu cover.
- Template Admin preview menampilkan opening asset jika ada.
- Upload video/Lottie/poster tersimpan atau fallback local preview saat Supabase belum dikonfigurasi.
- Opening tidak membuat public page blank ketika asset gagal.
- Musik baru mulai setelah opening dibuka.
