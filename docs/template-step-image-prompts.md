# Prompt Gambar Per Step Halaman Template

## 1) Step Metadata
```text
Design a modern web dashboard UI for “Template Editor - Metadata” in a digital invitation admin platform.

Style:
Clean professional SaaS dashboard, light theme, white and soft gray surfaces, gold accent (#C8A96B), deep charcoal text, subtle borders, soft shadows, premium Indonesian wedding admin vibe. Use compact operational layout, not a landing page.

Canvas:
16:9 desktop dashboard screenshot, ultra-detailed, high resolution, pixel-perfect Figma-like product mockup, no watermark.

Layout:
Left sidebar navigation, sticky top header, main template editor workspace.
Show horizontal stepper with:
Metadata (active), Preset, Global Style, Opening, Widgets, Ornamen, Preview, Publish.

Detailed UI requirements:
- Top header:
  - Breadcrumb: Dashboard / Template / Buat Template
  - Page title: “Buat Template Baru”
  - Buttons: Simpan Draft, Preview, Publish Template (disabled)
- Left summary panel:
  - Template ID: “adat-jawa-premium”
  - Status: Draft
  - Completion: 15%
  - Checklist: Metadata sedang diisi, Preset belum dipilih, Preview belum dicek
- Main form card:
  - Field: Template ID
  - Field: Nama Template
  - Dropdown: Kategori
  - Field: Harga
  - Dropdown: Badge
  - Textarea: Deskripsi
  - Supported features multi-select chips: RSVP, Gift, Music, Guest Name, Gallery, Story
- Thumbnail upload panel:
  - Drag and drop area
  - Preview thumbnail placeholder
  - File hint: PNG/JPG/WebP
- Right preview panel:
  - Mobile frame placeholder
  - Text: “Preview akan muncul setelah thumbnail dan style dipilih”
- Bottom validation panel:
  - Warning: Template ID wajib unik
  - Warning: Thumbnail belum diupload

Visual quality:
Operational admin UI, clear form hierarchy, compact spacing, 8px radius, realistic Indonesian labels.
```

## 2) Step Preset
```text
Design a modern web dashboard UI for “Template Editor - Preset” in a digital invitation admin platform.

Style:
Clean professional SaaS dashboard, light theme, white and soft gray surfaces, gold accent (#C8A96B), high contrast text, premium Indonesian wedding admin vibe.

Canvas:
16:9 desktop dashboard screenshot, ultra-detailed, high resolution, pixel-perfect Figma-like product mockup, no watermark.

Layout:
Left sidebar, sticky top header, horizontal template editor stepper.
Active step: “Preset”.

Detailed UI requirements:
- Top header:
  - Breadcrumb: Dashboard / Template / Adat Jawa Premium
  - Buttons: Simpan Draft, Preview, Publish Template (disabled)
- Stepper:
  - Metadata completed
  - Preset active
  - Global Style next
- Main preset grid:
  - Preset cards:
    - Classic Wedding
    - Navy Gold
    - Soft Floral
    - Adat Nusantara (selected)
    - Minimal Modern
    - Garden Party
  - Each card has:
    - Mini invitation preview
    - Color swatches
    - Typography sample
    - Badge for recommended/selected
- Right comparison panel:
  - “Preset Terpilih: Adat Nusantara”
  - Palette summary
  - Font summary
  - Ornament summary
  - Button: Terapkan Preset
- Bottom impact panel:
  - “Preset akan mengisi global style, opening, widget defaults, dan ornamen awal.”

Visual quality:
Premium catalog-like admin layout, fast comparison, strong selected state, realistic Indonesian UI text.
```

## 3) Step Global Style
```text
Design a modern web dashboard UI for “Template Editor - Global Style” in a digital invitation admin platform.

Style:
Clean professional SaaS dashboard, light theme, white and soft gray surfaces, gold accent (#C8A96B), deep charcoal text, subtle shadows, premium Indonesian wedding admin vibe.

Canvas:
16:9 desktop dashboard screenshot, ultra-detailed, high resolution, pixel-perfect Figma-like product mockup, no watermark.

Layout:
Left sidebar, sticky top header, horizontal stepper, two-column workspace.
Active step: “Global Style”.

Detailed UI requirements:
- Top header:
  - Title: “Global Style”
  - Subtitle: “Atur warna, font, spacing, dan tampilan dasar template.”
  - Buttons: Simpan Draft, Preview
- Left controls panel:
  - Palette editor:
    - Background
    - Surface
    - Primary
    - Accent
    - Text
  - Color swatches and hex input fields
  - Font pairing:
    - Heading font dropdown
    - Body font dropdown
  - Section spacing segmented control:
    - Compact
    - Balanced (selected)
    - Spacious
  - Card style:
    - Radius selector
    - Border strength selector
    - Shadow selector
  - Button style preview:
    - Primary button
    - Secondary button
- Right live preview:
  - Mobile 9:16 invitation frame
  - Couple names “Dimas & Salsa”
  - Date and event preview
  - Gold accent button
  - Floral ornaments
  - Viewport switcher: Mobile selected, Tablet, Desktop
- Bottom validation:
  - Green: Kontras warna aman
  - Amber: Accent terlalu dekat dengan background in one sample

Visual quality:
Dense but readable style editor, clear swatches, realistic preview, no marketing hero layout.
```

## 4) Step Opening
```text
Design a modern web dashboard UI for “Template Editor - Opening” in a digital invitation admin platform.

Style:
Clean professional SaaS dashboard, light theme, white and soft gray surfaces, gold accent (#C8A96B), high contrast text, premium Indonesian wedding admin vibe.

Canvas:
16:9 desktop dashboard screenshot, ultra-detailed, high resolution, pixel-perfect Figma-like product mockup, no watermark.

Layout:
Left sidebar, sticky top header, horizontal stepper, three-panel editor.
Active step: “Opening”.

Detailed UI requirements:
- Top header:
  - Title: “Opening Sequence”
  - Buttons: Simpan Draft, Replay Opening, Preview
- Left preset panel:
  - Opening preset cards:
    - Gate Reveal
    - Bloom Reveal
    - Paper Reveal
    - Fade Ceremony
  - Selected preset: Gate Reveal
- Main configuration panel:
  - Opening enabled toggle
  - Opening type dropdown
  - Background mode: Image, Video, Color, Gradient
  - Upload opening background
  - Guest name visibility toggle
  - Button label field: “Buka Undangan”
  - Duration input
  - Entrance animation dropdown
  - Music sync toggle
- Right preview panel:
  - Mobile frame showing opening screen
  - Text: “Kepada Yth. Bapak/Ibu/Saudara/i”
  - Guest name chip
  - Button “Buka Undangan”
  - Replay animation button
- Bottom timeline summary:
  - Opening fade in 0s-1s
  - Title reveal 1s-2s
  - Button reveal 2s-3s
- Validation card:
  - Warning: Opening video terlalu besar untuk mobile if video selected

Visual quality:
Focused motion setup dashboard, clear preview, compact controls, realistic Indonesian labels.
```

## 5) Step Widgets
```text
Design a modern web dashboard UI for “Template Editor - Widgets” in a digital invitation admin platform.

Style:
Clean professional SaaS dashboard, light theme, white and soft gray surfaces, gold accent (#C8A96B), deep charcoal text, subtle borders, premium Indonesian wedding admin vibe.

Canvas:
16:9 desktop dashboard screenshot, ultra-detailed, high resolution, pixel-perfect Figma-like product mockup, no watermark.

Layout:
Left sidebar, sticky top header, horizontal stepper, widget configuration grid plus preview.
Active step: “Widgets”.

Detailed UI requirements:
- Top header:
  - Title: “Widget Template”
  - Subtitle: “Atur komponen interaktif yang tampil di undangan.”
  - Buttons: Simpan Draft, Preview
- Widget grid:
  - Countdown Timer
  - Event Detail
  - Love Story
  - Gallery
  - RSVP Form
  - Gift / Amplop Digital
  - Music Player
  - QR Check-in
- Each widget card:
  - Icon
  - Enabled toggle
  - Variant dropdown
  - Animation dropdown
  - Short live mini-preview
- Selected widget inspector:
  - Widget: Music Player
  - Position dropdown
  - Variant selector
  - Pulse sync toggle
  - Pulse intensity selector
- Right live preview:
  - Mobile frame showing invitation section with active widgets
  - Widget badges overlay
- Bottom warning panel:
  - Warning: Terlalu banyak widget aktif bisa membuat halaman mobile lebih berat

Visual quality:
Efficient configuration grid, clear toggles, icon-led controls, polished admin interface.
```

## 6) Step Ornamen
```text
Design a modern web dashboard UI for “Template Editor - Ornamen” in a digital invitation template builder.

Style:
Clean professional SaaS dashboard, light theme, white and soft gray surfaces, gold accent (#C8A96B), high contrast text, subtle shadows, premium Indonesian wedding vibe.

Canvas:
16:9 desktop dashboard screenshot, ultra-detailed, high resolution, pixel-perfect Figma-like product mockup, no watermark.

Layout:
3-column desktop dashboard: left layers panel, center canvas preview, right properties inspector, plus bottom timeline section.
Active step: “Ornamen”.

Detailed UI requirements:
- Top header:
  - Page title: “Template Editor / Ornamen”
  - Breadcrumb
  - Buttons: Simpan Draft, Preview, Publish Template disabled
- Left panel (Layers/Ornaments):
  - Section dropdown: home, opening, event, gallery, closing
  - Search ornament
  - List items with thumbnail, name, visibility toggle, lock toggle, duplicate, delete
  - Add Ornament button
- Center panel (Canvas Preview):
  - Mobile aspect preview frame 9:16 with invitation mockup
  - Decorative ornaments visible: floral corners, frame accents, sparkles
  - Grid guides and safe area overlay
  - Replay Animation button
- Right panel (Properties Inspector):
  - Tabs: Basic / Advanced
  - Basic fields: ID, Slot position 3x3 grid picker, Width, Height, X, Y, Rotate, Opacity, Z-index
  - Animation fields: Entrance, Loop mode, Exit animation, Duration, Delay, Easing
  - Effects fields: Flip, Mirror, Parallax speed + direction
  - Asset upload area with small uploaded thumbnails
- Bottom timeline panel:
  - Horizontal time ruler in seconds 0s-20s
  - Multiple tracks: Track 1-4
  - Draggable colored blocks for each ornament animation
  - Playhead line in red
  - Zoom in/out controls and snap toggle
- Validation card:
  - Warning: Too many animated ornaments may reduce mobile performance

Visual quality:
Figma-like editor polish, clear 8px spacing, rounded corners, modern typography, realistic Indonesian labels.
```

## 7) Step Preview
```text
Design a modern web dashboard UI for “Template Editor - Preview” in a digital invitation admin platform.

Style:
Clean professional SaaS dashboard, light theme, white and soft gray surfaces, gold accent (#C8A96B), high contrast text, premium Indonesian wedding admin vibe.

Canvas:
16:9 desktop dashboard screenshot, ultra-detailed, high resolution, pixel-perfect Figma-like product mockup, no watermark.

Layout:
Left sidebar, sticky top header, horizontal stepper, large preview workspace.
Active step: “Preview”.

Detailed UI requirements:
- Top header:
  - Title: “Live Template Preview”
  - Buttons: Replay Opening, Open Full Preview, Simpan Draft
- Preview toolbar:
  - Viewport segmented control: Mobile, Tablet, Desktop
  - Data mode segmented control: Filled Data, Empty Fallback
  - Guest mode: With Guest Name, No Guest Name
- Main preview area:
  - Large centered mobile frame if Mobile selected
  - Invitation preview includes:
    - Opening cover
    - Couple section
    - Event section
    - Gallery section
    - RSVP section
  - Scrollable preview frame
- Right checklist panel:
  - Mobile preview checked
  - Tablet preview unchecked
  - Desktop preview unchecked
  - Guest name mode checked
  - Empty fallback unchecked
  - Opening replay checked
- Quality warnings panel:
  - Contrast passed
  - Asset paths valid
  - Mobile animation warning if any
- Bottom action bar:
  - Back to Ornamen
  - Save Draft
  - Continue to Publish

Visual quality:
Preview-first workspace, clean testing controls, realistic invitation mockup, clear QA checklist.
```

## 8) Step Publish
```text
Design a modern web dashboard UI for “Template Editor - Publish” in a digital invitation admin platform.

Style:
Clean professional SaaS dashboard, light theme, white and soft gray surfaces, gold accent (#C8A96B), high contrast text, subtle shadows, premium Indonesian wedding admin vibe.

Canvas:
16:9 desktop dashboard screenshot, ultra-detailed, high resolution, pixel-perfect Figma-like product mockup, no watermark.

Layout:
Left sidebar, sticky top header, horizontal stepper, publish checklist and final summary.
Active step: “Publish”.

Detailed UI requirements:
- Top header:
  - Title: “Publish Template”
  - Buttons: Simpan Draft, Publish Template
- Final summary panel:
  - Template name: “Adat Jawa Premium”
  - Template ID
  - Category
  - Price
  - Status: Ready to Publish
  - Thumbnail preview
- Publish checklist:
  - Metadata complete
  - Thumbnail uploaded
  - Style contrast passed
  - Opening tested
  - Widgets configured
  - Ornaments validated
  - Mobile preview checked
  - Empty fallback checked
- Blocking issue area:
  - Show no blocking errors state
  - Amber warnings still visible
- Visibility settings:
  - Status selector: Hidden / Active
  - Sort order input
  - Featured badge toggle
- Confirmation card:
  - Text: “Template akan tampil di katalog setelah dipublish sebagai Active.”
  - Checkbox: “Saya sudah mengecek preview final”
- Bottom action bar:
  - Back to Preview
  - Save Draft
  - Publish Template primary button

Visual quality:
Clear final review UI, confidence-building checklist, polished admin interface, realistic Indonesian text.
```

