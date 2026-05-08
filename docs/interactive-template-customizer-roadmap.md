# Interactive Template Customizer Roadmap

Dokumen ini berisi breakdown task untuk mengembangkan dashboard undangan digital dari template manager menjadi interactive template customizer yang siap dijual sebagai nilai tambah.

## Goal Produk

Membuat sistem undangan digital berbasis template yang bisa dikustom dari dashboard admin tanpa coding ulang untuk tiap client.

Target kemampuan:
- Template bisa dipilih dan dikustom.
- Section bisa diatur style dan behavior-nya.
- Widget seperti countdown, acara, love story, gallery, gift, RSVP bisa dikontrol.
- Ornamen bisa upload/custom, diposisikan, diberi animasi, dan dipakai per section.
- Undangan terasa interaktif, personal, dan premium.

## Status Saat Ini

Sudah ada:
- Dashboard Next.js.
- Template manager.
- Ornament editor per section.
- Upload ornament.
- Asset library bawaan dan dinamis.
- Delete asset dinamis.
- Preset section standar untuk semua template: home, couple, acara, countdown, story, gallery, gift, rsvp, doa-ucapan.
- Live template preview.
- Ornament positioning: slot, width, height, x, y, rotate, opacity, zIndex, mirror.
- Ornament animation loop: none, fade, float, sway, pulse, slow-rotate.
- Ornament entrance animation: none, fade-in, fade-up, zoom-in, pop-up, slide-left, slide-right, drop-in.
- Countdown real-time reusable pada beberapa template.
- Local fallback via localStorage untuk mode tanpa Supabase.

## Phase 1 - Stabilkan Template Customizer

### Task 1.1 - Rapikan Schema Design Config - Done

Deskripsi:
Pisahkan config template menjadi struktur yang konsisten.

Target schema:

```json
{
  "canvas": {},
  "sections": {},
  "ornaments": {},
  "widgets": {},
  "animations": {}
}
```

Checklist:
- Pastikan semua template membaca `designConfig` dengan pola yang sama.
- Tambah helper untuk merge default config dan override.
- Pastikan config lama tetap aman saat dibaca.

Definition of Done:
- Semua template tetap render normal.
- `npm run build` sukses.
- Tidak ada config yang harus diedit manual untuk basic use.

Status:
- Selesai.
- Helper `normalizeDesignConfig` dan `mergeDesignConfigs` tersedia di `src/templates/designConfigs.js`.
- Config lama tetap aman karena key kosong otomatis menjadi `{}`.

### Task 1.2 - Layer Controls Ornament - Done

Deskripsi:
Tambahkan kontrol layer agar admin tidak perlu mengubah `zIndex` manual.

Checklist:
- Move Up.
- Move Down.
- Bring Front.
- Send Back.
- Tetap support input `zIndex` manual.

Definition of Done:
- Urutan visual ornament bisa dikontrol dari UI.
- Perubahan masuk ke `designConfig`.
- Live preview langsung berubah.

Status:
- Selesai.
- Ornament editor sekarang punya Move Up, Move Down, Bring Front, dan Send Back.
- Reorder juga menormalisasi `zIndex` sesuai urutan layer.

### Task 1.3 - Viewport Preview Toggle - Done

Deskripsi:
Tambahkan pilihan viewport pada live template preview.

Mode:
- Mobile 430px.
- Tablet.
- Desktop scaled.

Definition of Done:
- Admin bisa cek ornament di beberapa ukuran.
- Preview tidak merusak layout dashboard.

Status:
- Selesai.
- Live template preview punya mode Mobile 430, Tablet, dan Desktop scaled.

### Task 1.4 - Validation Warnings - Done

Deskripsi:
Tambahkan warning ringan di editor.

Rules awal:
- Ornament `src` kosong.
- File PNG/WebP terlalu besar.
- Ornament per section lebih dari 12.
- Animated ornament per section lebih dari 5.
- Opacity di luar 0-1.
- Width terlalu besar.
- Section tidak dipakai template.

Definition of Done:
- Warning tampil tanpa memblokir save.
- Warning jelas dan actionable.

Status:
- Selesai.
- Ornament editor sekarang menampilkan warning untuk SRC kosong, file raster terlalu besar, jumlah ornament, jumlah animated ornament, opacity, width besar, dan section yang tidak dipakai preset template.

## Phase 2 - Widget Config

### Task 2.1 - Countdown Widget Config - Done

Deskripsi:
Countdown sudah real-time, selanjutnya jadikan configurable dari dashboard.

Config target:

```json
{
  "widgets": {
    "countdown": {
      "enabled": true,
      "eventIndex": 0,
      "variant": "cards",
      "completeText": "Acara sedang berlangsung"
    }
  }
}
```

Checklist:
- Enable/disable countdown.
- Pilih target event.
- Variant: cards, minimal, circle.
- Custom complete text.

Definition of Done:
- Template membaca config countdown.
- Dashboard bisa mengubah config.
- Preview langsung update.

Status:
- Selesai.
- Config countdown disimpan di `designConfig.widgets.countdown`.
- Dashboard bisa mengatur enabled, eventIndex, variant, dan completeText.

### Task 2.2 - Event/Acara Widget Config - Done

Checklist:
- Multi-event tetap support.
- Style: card, list, elegant.
- Maps button on/off.
- Icon on/off.

Definition of Done:
- Acara bisa dikustom tanpa edit template code.

Status:
- Selesai.
- Config event disimpan di `designConfig.widgets.events`.
- Dashboard bisa mengatur enabled, variant, showMaps, dan showIcon.

### Task 2.3 - Love Story Widget Config - Done

Checklist:
- Enable/disable.
- Style: timeline, card, stacked.
- Animation per item.
- Story items tetap dari invitation data.

Definition of Done:
- Story section bisa berubah tampilan dari dashboard.

Status:
- Selesai.
- Config story disimpan di `designConfig.widgets.story`.
- Dashboard bisa mengatur enabled, variant, dan animation.

### Task 2.4 - Gallery Widget Config - Done

Checklist:
- Style: grid, carousel, masonry.
- Fullscreen viewer.
- Jumlah foto tampil.
- Cover/gallery ordering.

Definition of Done:
- Gallery lebih interaktif dan mobile friendly.

Status:
- Selesai.
- Config gallery disimpan di `designConfig.widgets.gallery`.
- Dashboard bisa mengatur enabled, variant, limit, dan includeCover.
- Gallery mendukung fullscreen viewer.

### Task 2.5 - Gift Widget Config

Checklist:
- Bank/e-wallet/QRIS.
- Copy button.
- Enable/disable gift.
- Optional QRIS image.

Definition of Done:
- Gift section bisa disesuaikan per client.

## Phase 3 - Section Customization

### Task 3.1 - Cover Section Config - Done

Checklist:
- Foto on/off.
- Layout style.
- Background image/color.
- Opening animation.
- Guest name block style.

Definition of Done:
- Cover bisa dikustom signifikan dari dashboard.

Status:
- Selesai untuk template keluarga Rana Kirana.
- Config cover disimpan di `designConfig.sections.cover`.
- Dashboard bisa mengatur foto, layout, background image/color, opening animation, dan guest name block style.

### Task 3.2 - Couple/Mempelai Section Config - Done

Checklist:
- Foto on/off.
- Border on/off.
- Foto style: circle, arch, square.
- Font preset.
- Parent text on/off.
- Instagram button on/off.

Definition of Done:
- Section mempelai bisa cocok untuk template foto dan non-foto.

Status:
- Selesai untuk template keluarga Rana Kirana.
- Config couple disimpan di `designConfig.sections.couple`.
- Dashboard bisa mengatur foto, border, shape foto, font preset, parent text, dan tombol Instagram.

### Task 3.3 - Per Section Style Controls - Done

Checklist:
- Background color.
- Background image.
- Text color.
- Accent color.
- Font preset.
- Spacing preset.
- Entrance animation.

Definition of Done:
- Section umum bisa di-style tanpa edit komponen.

Status:
- Selesai untuk template keluarga Rana Kirana.
- Config style disimpan di `designConfig.sections.[sectionName]`.
- Dashboard bisa mengatur background color/image, text color, accent color, font preset, spacing preset, dan entrance animation per section aktif.

## Phase 4 - Interactive Presets

### Task 4.1 - Preset System - Done

Deskripsi:
Buat preset agar admin tidak setting semuanya dari nol.

Preset awal:
- Elegant Fade.
- Floral Float.
- Watercolor Bloom.
- Wayang Reveal.
- Royal Gate.
- Cinematic Scroll.
- Minimal Premium.

Preset mengatur:
- Section entrance.
- Ornament animation.
- Widget style.
- Typography feel.
- Background/overlay.

Definition of Done:
- Admin bisa apply preset ke template/section.
- Config lama tetap aman.

Status:
- Selesai untuk dashboard template editor.
- Preset awal tersedia: Elegant Fade, Floral Float, Watercolor Bloom, Wayang Reveal, Royal Gate, Cinematic Scroll, Minimal Premium.
- Preset bisa diterapkan ke seluruh template atau hanya section aktif.
- Preset melakukan merge ke `designConfig`, sehingga config lama tetap aman.

### Task 4.2 - Opening Cover Reveal - Done

Ide:
- Tap tombol "Buka Undangan".
- Cover reveal dengan gate/curtain/paper/wayang.
- Musik bisa mulai setelah interaksi.

Definition of Done:
- Opening terasa premium.
- Tetap ringan di mobile.
- Bisa dimatikan dari dashboard.

Status:
- Selesai untuk template keluarga Rana Kirana dan template custom fallback.
- Cover reveal bisa diaktifkan/dimatikan dari dashboard.
- Style awal tersedia: curtain, gate, paper, wayang.
- Reveal text bisa dikustom.

### Task 4.3 - Parallax Ornament

Checklist:
- Parallax ringan saat scroll.
- Config strength per ornament/section.
- Respect reduced motion.

Definition of Done:
- Interaktif terasa hidup tanpa berat.

## Phase 5 - Advanced Interaction

### Task 5.1 - Animated Custom Asset Presets

Contoh:
- Wayang kanan-kiri masuk ke tengah.
- Bunga jatuh halus.
- Frame muncul perlahan.
- Daun sway pelan.

Definition of Done:
- Preset bisa dipilih dari dashboard.
- Bisa dipakai ulang antar template.

### Task 5.2 - Interactive Gallery

Checklist:
- Swipe mobile.
- Fullscreen viewer.
- Smooth transition.
- Optional cinematic mode.

Definition of Done:
- Gallery terasa modern dan nyaman dipakai.

### Task 5.3 - Music Ambience

Checklist:
- Music player lebih polished.
- Optional ornament pulse saat musik aktif.
- Tetap user-controlled.

Definition of Done:
- Music menambah suasana tanpa mengganggu UX.

## Phase 6 - Premium 2.5D / 3D

### Task 6.1 - 2.5D Cover

Ide:
- Layer background, couple, ornament bergerak beda saat scroll/device tilt.
- Lebih ringan dari full 3D.

Definition of Done:
- Mobile performance aman.
- Bisa dipakai sebagai premium template feature.

### Task 6.2 - Three.js Premium Widget

Ide:
- 3D invitation card.
- 3D ring/flower.
- Tilt interaction.

Catatan:
Gunakan hanya di cover atau satu section premium.

Definition of Done:
- Canvas tidak blank.
- Mobile dan desktop tested.
- Fallback tersedia kalau device berat.

## Phase 7 - Publish Workflow

### Task 7.1 - Draft, Preview, Publish

Checklist:
- Draft local/admin state.
- Preview public-safe.
- Publish changes to Supabase.
- Status draft/published/revision.

Definition of Done:
- Admin tidak takut save eksperimen.
- Public URL hanya berubah setelah publish.

### Task 7.2 - Versioning & Rollback

Checklist:
- Simpan revision design config.
- Rollback ke versi sebelumnya.
- Label versi.

Definition of Done:
- Perubahan client bisa dilacak.

### Task 7.3 - Per Client Override

Checklist:
- Template master tetap aman.
- Client invitation punya override sendiri.
- Bisa copy config dari template master.

Definition of Done:
- Custom request client tidak merusak template global.

## Prioritas Eksekusi Terdekat

Urutan yang disarankan:

1. Layer controls ornament.
2. Viewport preview toggle.
3. Countdown widget config.
4. Section config schema.
5. Cover opening reveal.
6. Gallery interactive.
7. Interactive presets.
8. Publish/revision workflow.
9. Premium 2.5D/3D.

## Catatan Produk

Jangan langsung membuat full builder seperti Webflow. Target yang lebih sehat:

**Template siap pakai + customizer kuat + preset interaktif + support custom asset/animation.**

Nilai jual utama:
- Client mendapat undangan yang personal dan interaktif.
- Admin tidak perlu coding ulang untuk tiap client.
- Template tetap stabil dan mudah dipelihara.
