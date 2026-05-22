# Prompt Gambar Dashboard per Halaman (Format Detail seperti Ornament)

## 1) Overview
```text
Design a modern web dashboard UI for “Overview” in a digital invitation admin platform.
Style: clean professional SaaS, light theme, white + soft gray surfaces, gold accent (#C8A96B), high contrast text, subtle shadows, premium Indonesian wedding vibe.
Layout: left sidebar, top header, full-width content with modular cards and table.

Detailed UI requirements:
- Top bar: page title “Overview”, breadcrumb, date range filter, refresh button.
- KPI section (4 cards):
  - Total Undangan
  - Published
  - Menunggu Pembayaran
  - Total RSVP Pax
- Alert strip:
  - “Butuh perhatian” for draft/review blockers.
- Main module:
  - “Undangan Terbaru” table with columns:
    Pasangan, Pemesan, Template, Tanggal, RSVP, Order, Payment, Aksi
  - Row actions: Edit, Preview, Publish/Archive.
- Secondary modules:
  - RSVP Snapshot (hadir/tidak hadir/belum RSVP)
  - Activity Feed (timeline list)
  - Quick Actions (Buat Undangan Baru, Buka Template, Cek RSVP)
- Empty/loading states:
  - Skeleton cards and skeleton table rows.
  - Empty card with CTA “Buat Undangan Pertama”.

Visual quality:
- Pixel-perfect Figma-like UI, consistent 8px spacing, rounded corners, realistic Indonesian labels, 16:9, high resolution, no watermark.
```

## 2) Undangan
```text
Design a modern web dashboard UI for “Undangan” page in a digital invitation admin platform.
Style: clean professional SaaS, light theme, white + soft gray surfaces, gold accent (#C8A96B), high contrast text, subtle shadows, premium Indonesian wedding vibe.
Layout: split workspace (left invitation list/table, right invitation form panel), sticky action bar.

Detailed UI requirements:
- Top bar: title “Undangan”, search input, status filters (Draft/Review/Published/Archived), button “Undangan Baru”.
- Left panel:
  - Invitation table columns:
    Pasangan, Slug, Template, Paket, Status, Payment, Updated, Aksi.
  - Row quick actions: Edit, Preview, Publish, Archive.
  - Pagination + results count.
- Right panel (editor form):
  - Section tabs:
    Order, Template, Mempelai, Acara, Fitur.
  - Fields:
    customer name/WA, package, template, slug, bride & groom names, event date/time/venue/maps, feature toggles (RSVP/Gift/Music/Guest Name).
- Publish Guard card:
  - Blocking checks with red warnings.
  - Non-blocking warnings with amber badges.
- Sticky bottom action bar:
  - Save Draft, Mark Review, Publish, Archive.
- Inline feedback:
  - Success/error message area and toast samples.

Visual quality:
- Operational, dense but readable, clear hierarchy, realistic Indonesian form labels, 16:9, high resolution, no watermark.
```

## 3) Template
```text
Design a modern web dashboard UI for “Template Manager” in a digital invitation admin platform.
Style: clean professional SaaS, light theme, white + soft gray surfaces, gold accent (#C8A96B), high contrast text, subtle shadows, premium Indonesian wedding vibe.
Layout: top controls + template card grid + multi-step editor panel.

Detailed UI requirements:
- Top bar: title “Template”, search, category filter, status filter, button “Template Baru”.
- Template catalog grid:
  - Card includes thumbnail, name, badge, category, price, status.
  - Actions: Preview, Edit, Activate/Hide, Delete.
- Editor wizard (step pills):
  - Metadata, Preset, Global Style, Opening, Widgets, Ornaments, Preview, Publish.
- Editor body:
  - Left: settings form based on active step.
  - Right: live preview frame with viewport switcher (mobile/tablet/desktop).
- Quality warnings panel:
  - Guard messages before publish.
- Publish panel:
  - Save Draft, Publish Template buttons.

Visual quality:
- Premium admin feel, rich but structured controls, no clutter, 16:9 high resolution, no watermark.
```

## 4) RSVP
```text
Design a modern web dashboard UI for “RSVP Manager” in a digital invitation admin platform.
Style: clean professional SaaS, light theme, white + soft gray surfaces, gold accent (#C8A96B), high contrast text, subtle shadows, premium Indonesian wedding vibe.
Layout: KPI strip + filter row + RSVP table + side summary.

Detailed UI requirements:
- Top bar: title “RSVP”, export button, refresh button.
- KPI cards:
  - Total RSVP, Hadir, Tidak Hadir, Belum Respon, Total Pax.
- Filter row:
  - Attendance filter, group filter, date filter, search tamu.
- Main table:
  - Columns: Nama Tamu, Grup, Kehadiran, Pax, Catatan, Waktu Respon, Aksi.
  - Row actions: Lihat Detail, Tandai Follow-up.
- Side panel:
  - Attendance donut chart + quick insights.
- Empty/loading states:
  - Skeleton rows and empty prompt.

Visual quality:
- Analytics-oriented clarity, legible table typography, realistic Indonesian microcopy, 16:9 high resolution, no watermark.
```

## 5) Tamu
```text
Design a modern web dashboard UI for “Guest Manager (Tamu)” in a digital invitation admin platform.
Style: clean professional SaaS, light theme, white + soft gray surfaces, gold accent (#C8A96B), high contrast text, subtle shadows, premium Indonesian wedding vibe.
Layout: guest list workspace with add/edit drawer and broadcast panel.

Detailed UI requirements:
- Top bar: title “Tamu”, search tamu, filter grup, filter RSVP, button “Tambah Tamu”.
- Main guest table:
  - Columns: Nama, Grup, No WA, Guest Slug, RSVP Status, Link Personal, Aksi.
  - Actions: Edit, Hapus, Copy Link.
- Bulk import module:
  - Text area input for multiple guests and import button.
- Broadcast module:
  - Message template preview with placeholders {guest_name} and {guest_link}.
  - Button “Copy Broadcast”.
- Right drawer:
  - Add/Edit guest form fields.

Visual quality:
- Utility-first and fast operations, clear CTA hierarchy, 16:9 high resolution, no watermark.
```

## 6) Media
```text
Design a modern web dashboard UI for “Media Manager” in a digital invitation admin platform.
Style: clean professional SaaS, light theme, white + soft gray surfaces, gold accent (#C8A96B), high contrast text, subtle shadows, premium Indonesian wedding vibe.
Layout: top filter/upload bar + media grid + metadata inspector.

Detailed UI requirements:
- Top bar: title “Media”, media-type tabs (Image/Video/Audio), upload button.
- Upload card:
  - Drag-drop zone, file size/type hints, progress bar.
- Media grid:
  - Thumbnail cards with title, type badge, duration/size metadata.
  - Actions on each card: Replace, Delete, Use in Section.
- Right inspector:
  - Selected media preview and detail fields.
- State cards:
  - Upload success, upload error, empty library.

Visual quality:
- Strong visual asset management UI, clean thumbnails, realistic labels, 16:9 high resolution, no watermark.
```

## 7) Konten
```text
Design a modern web dashboard UI for “Content Managers” in a digital invitation admin platform.
Style: clean professional SaaS, light theme, white + soft gray surfaces, gold accent (#C8A96B), high contrast text, subtle shadows, premium Indonesian wedding vibe.
Layout: section tabs + editable list blocks + inline form panel.

Detailed UI requirements:
- Top bar: title “Konten”, section switch tabs:
  Acara, Story, Rekening Hadiah.
- Acara module:
  - Event list cards with date/time/venue/maps.
  - Add/Edit/Delete actions.
- Story module:
  - Timeline list with title, date, description, reorder controls.
- Rekening module:
  - Bank account cards: bank name, account number, owner.
- Inline editor panel:
  - Contextual form for selected item.
- Feedback:
  - Save success and validation errors.

Visual quality:
- Structured CRUD layout, high scan efficiency, polished business UI, 16:9 high resolution, no watermark.
```

## 8) Pengaturan
```text
Design a modern web dashboard UI for “Pengaturan (Settings)” in a digital invitation admin platform.
Style: clean professional SaaS, light theme, white + soft gray surfaces, gold accent (#C8A96B), high contrast text, subtle shadows, premium Indonesian wedding vibe.
Layout: categorized settings cards with sticky save bar.

Detailed UI requirements:
- Top bar: title “Pengaturan”, button “Simpan Perubahan”.
- Settings sections:
  - Profil Bisnis (nama brand, kontak, WA admin)
  - Default Teks (pesan broadcast default, fallback teks)
  - Preferensi Sistem (timezone, format tanggal, behavior preview)
  - Integrasi/Operasional (status koneksi dan catatan)
- Each section:
  - Compact form rows, helper text, reset-to-default button.
- Sticky bottom bar:
  - Save, Discard changes.
- Confirmation modal:
  - “Simpan perubahan pengaturan?”
- Status messages:
  - Last saved timestamp, error banner if save failed.

Visual quality:
- Calm settings UX, predictable form behavior, premium and minimal, 16:9 high resolution, no watermark.
```

