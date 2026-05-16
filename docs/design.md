# Pengaturan Style Dashboard

## 1. Arah Visual
Dashboard NusaInvite akan memakai style referensi Audyr: light canvas, monokrom, whitespace lega, border struktural, typography compact, dan interaksi yang jelas lewat filled button atau subtle elevation.

Tujuan style ini:
- Dashboard terasa rapi, profesional, dan efisien untuk kerja admin.
- Fokus utama ada pada data pesanan, status, tamu, RSVP, media, dan template.
- Dekorasi visual dikurangi agar dashboard tidak bersaing dengan desain undangan.

## 2. Design Principles
- Pakai background terang: `Canvas White` dan `Fog`.
- Pakai `Ink` untuk teks utama, heading, dan tombol utama.
- Hindari warna kuat kecuali benar-benar dibutuhkan untuk status atau alert.
- Gunakan border 1px untuk struktur, bukan warna background berat.
- Gunakan whitespace yang cukup, tetapi tetap compact untuk workflow admin.
- Dashboard harus terasa seperti operational tool, bukan landing page.

## 3. Color Tokens
| Name | Value | Token | Usage |
|------|-------|-------|-------|
| Ink | `#262626` | `--color-ink` | Heading, primary text, filled button |
| Canvas White | `#ffffff` | `--color-canvas-white` | Card surface, modal, input |
| Fog | `#ededed` | `--color-fog` | Page background, subtle surface, border |
| Muted Gray | `#686868` | `--color-muted-gray` | Helper text, secondary label |
| Cool Gray | `#515151` | `--color-cool-gray` | Icon, secondary emphasis |
| Dark Surface | `#171717` | `--color-dark-surface` | Focused/elevated dark panel |
| Subtle Gray | `#929292` | `--color-subtle-gray` | Placeholder, disabled text |
| Border Silver | `#737373` | `--color-border-silver` | Stronger border or divider |
| Line White | `#cbcbcb` | `--color-line-white` | Subtle line/shadow accent |
| Accent Slate | `#101828` | `--color-accent-slate` | Navigation and rare accents |

## 4. Typography
Primary font: `Inter`.

Fallback:
```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
```

Weights:
- Regular: `400`
- Medium: `500`
- Semibold: `600`

Type scale:
| Role | Size | Line Height | Letter Spacing |
|------|------|-------------|----------------|
| Caption | `12px` | `1.5` | `-0.3px` |
| Body | `14px` | `1.38` | `-0.35px` |
| Heading Small | `20px` | `1.25` | `-0.5px` |
| Heading | `24px` | `1.15` | `-0.6px` |
| Heading Large | `30px` | `1.11` | `-0.75px` |
| Display | `48px` | `1` | `-1.2px` |

Dashboard note:
- Gunakan display text sangat terbatas.
- Panel, table, form, dan sidebar harus memakai type kecil dan padat.
- Label input dan table heading memakai uppercase kecil bila perlu, tetapi jangan terlalu ramai.

## 5. Spacing and Shape
Base unit: `4px`.

Spacing utama:
- `4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `32px`, `40px`, `48px`, `64px`

Radius:
| Element | Radius |
|---------|--------|
| Buttons | `4px` sampai `8px` |
| Inputs | `8px` |
| Images | `8px` |
| Cards / panels | `18px` |

Dashboard adaptation:
- Card radius boleh `8px` jika mengikuti pola komponen existing.
- Untuk dashboard baru, gunakan radius lebih terkendali: `8px` sampai `18px`.
- Hindari pill besar kecuali untuk filter/status.

## 6. Shadows and Borders
Gunakan border sebagai struktur utama:
```css
border: 1px solid #ededed;
```

Shadow utama:
```css
--shadow-subtle: rgba(0, 0, 0, 0.04) 0px 1px 3px 0px;
--shadow-xl: lab(0 0 0 / 0.1) 0px 25px 50px -12px;
```

Rules:
- Table, form, sidebar, dan cards memakai border ringan.
- Shadow besar hanya untuk panel penting atau modal.
- Hindari banyak shadow bertumpuk.

## 7. Component Rules
### Primary Button
- Background: `#262626`
- Text: `#ffffff`
- Radius: `4px` sampai `8px`
- Use case: save, publish, create, primary CTA.

### Ghost Button
- Background: transparent atau white.
- Border: `1px solid #ededed`
- Text: `#262626`
- Use case: preview, cancel, secondary actions.

### Tab / Segmented Control
- Active: background `#262626`, text `#ffffff`.
- Inactive: background transparent/white, border `#ededed`, text `#686868`.

### Cards / Panels
- Background: `#ffffff`
- Border: `1px solid #ededed`
- Radius: `8px` sampai `18px`
- Padding: `16px` sampai `32px`

### Tables
- Header: compact, muted text.
- Row hover: `#ededed` with low opacity or very light gray.
- Avoid saturated status colors.
- Status can use monochrome badges with icon or subtle tint.

### Forms
- Inputs: white background, subtle border.
- Focus: ink border or accent slate border.
- Validation: clear text, subtle color, optional icon.

## 8. Dashboard Layout Rules
- Sidebar should be light or dark-neutral, not colorful.
- Main content should sit on `Fog` or light canvas.
- Use contained max width only where useful; data-heavy pages can use full dashboard width.
- Prioritize scanability over decorative sections.
- Avoid landing-page style hero sections inside dashboard.

Recommended page structure:
1. Top header with page title and primary action.
2. Optional compact summary metrics.
3. Main data table or editor panel.
4. Secondary side panel only if it helps the workflow.

## 9. Do
- Use neutral monochrome palette.
- Keep dashboard dense but readable.
- Make buttons and actions predictable.
- Use fine borders for hierarchy.
- Keep template preview/content preview visually separate from admin controls.
- Make active states obvious but not colorful.

## 10. Don't
- Do not use decorative gradients for dashboard surfaces.
- Do not use large marketing hero blocks in admin pages.
- Do not overuse gold, green, or warm wedding colors in admin UI.
- Do not mix too many radius styles in one screen.
- Do not rely only on color for status.
- Do not let template ornamental style leak into dashboard admin controls.

## 11. CSS Token Starter
```css
:root {
  --color-ink: #262626;
  --color-canvas-white: #ffffff;
  --color-fog: #ededed;
  --color-muted-gray: #686868;
  --color-cool-gray: #515151;
  --color-dark-surface: #171717;
  --color-subtle-gray: #929292;
  --color-border-silver: #737373;
  --color-line-white: #cbcbcb;
  --color-accent-slate: #101828;

  --font-inter: "Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  --text-caption: 12px;
  --text-body: 14px;
  --text-heading-sm: 20px;
  --text-heading: 24px;
  --text-heading-lg: 30px;
  --text-display: 48px;

  --radius-button: 4px;
  --radius-input: 8px;
  --radius-card: 18px;

  --shadow-subtle: rgba(0, 0, 0, 0.04) 0px 1px 3px 0px;
  --shadow-card: lab(0 0 0 / 0.1) 0px 25px 50px -12px;
}
```

## 12. Implementation Priority
1. Apply tokens globally for dashboard scope.
2. Restyle dashboard shell: sidebar, header, content background.
3. Restyle shared controls: button, input, select, toggle, card, table.
4. Restyle order-to-publish pages first.
5. Restyle template admin after workflow pages are stable.

## 13. Acceptance Criteria
- Dashboard reads as clean monochrome operational software.
- Admin can scan tables and forms faster than before.
- Template preview remains visually distinct from admin UI.
- All dashboard pages use consistent button, input, card, and table styling.
- Mobile/tablet dashboard remains usable without layout overlap.
