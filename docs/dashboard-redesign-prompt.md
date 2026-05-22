# NusaInvite Admin Dashboard Redesign Prompt (Detail Semua Halaman, Kondisi Existing)

```text
You are a senior product designer and UX writer.
Create a full redesign specification for "NusaInvite Admin" (digital invitation management platform).

CRITICAL INSTRUCTION:
- You must redesign based on CURRENT EXISTING PAGE CONDITIONS, not imaginary features.
- Keep all existing core modules and workflows, then improve efficiency, clarity, and structure.
- If proposing new capability, mark it explicitly as "opsional enhancement", never as baseline.

CONTEXT:
- Dashboard pages in scope:
  1) Overview
  2) Undangan
  3) Template
  4) RSVP
  5) Tamu
  6) Media
  7) Konten
  8) Pengaturan
- Current app style:
  - light mode
  - rounded UI
  - admin-operational workflow
  - sidebar + sticky top header + content region
- Existing workflows are already functional but inefficient in scanning and interaction speed.

YOUR OUTPUT MUST BE IN BAHASA INDONESIA.
Write implementation-ready output for frontend developer handoff.

GOAL:
Produce redesign docs that are:
1) faithful to current features,
2) cleaner and more efficient,
3) ready for direct frontend refactor execution.

MANDATORY OUTPUT FORMAT:

A. RINGKASAN AUDIT KONDISI SAAT INI
For each page (Overview to Pengaturan), list:
- Fitur yang sudah ada sekarang
- Masalah UX sekarang
- Risiko jika tidak direfactor

B. DASHBOARD GENERAL DESIGN SYSTEM
1) Prinsip desain (7-10 poin)
2) IA global dashboard
3) Layout global:
   - sidebar (desktop/tablet/mobile behavior)
   - top header
   - content container, max-width, grid
   - spacing scale
4) Token visual:
   - color system
   - typography scale
   - radius, border, shadow
5) Standard komponen:
   - card
   - table
   - badge status
   - button hierarchy
   - form inputs + validation
   - tabs/chips/filter
   - toast/banner/inline feedback
6) Interaction standard:
   - hover/focus/active/disabled
   - sticky patterns
   - loading skeleton
   - empty/error/success states
7) Responsive rules:
   - >=1280, 1024-1279, 768-1023, <768
8) Accessibility baseline:
   - contrast
   - keyboard navigation
   - focus visibility
   - semantic + aria guidance

C. PAGE-BY-PAGE REDESIGN SPEC (SEMUA WAJIB DETAIL)
For each page:
- Tujuan halaman
- Existing modules (yang sekarang ada)
- Redesign structure top-to-bottom
- Data contract visual (apa yang ditampilkan dan prioritas visualnya)
- Primary and secondary actions
- State handling (loading/empty/error/success)
- UX issues -> redesign fixes -> impact
- Accessibility notes
- Acceptance criteria per page

Pages:
1) Overview
2) Undangan
3) Template
4) RSVP
5) Tamu
6) Media
7) Konten
8) Pengaturan

D. HALAMAN OVERVIEW (DETAIL MENDALAM)
Must include:
1) KPI cards:
   - metrics list
   - hierarchy and sizing
   - calculation/source assumptions
2) Undangan terbaru snapshot/table:
   - columns
   - row actions
   - status rendering
3) RSVP snapshot module
4) Activity module
5) Alert/attention module (e.g. waiting payment/review blockers)
6) Quick links/actions for operational speed
7) Mobile collapse behavior

E. HALAMAN UNDANGAN (DETAIL MENDALAM)
Must include:
1) List/table spec:
   - exact columns and order
   - sort/filter/search
   - pagination/scroll strategy
2) Form panel spec:
   - order/customer
   - template/package
   - couple
   - event
   - feature toggles
3) Status lifecycle:
   - draft/review/published/archived
   - allowed transitions
   - blocked transitions and UI guard text
4) Publish guard:
   - checks
   - blocking vs warning logic
5) Action bar:
   - save draft
   - mark review
   - publish
   - archive
6) Dirty state + leave-page warning behavior

F. HALAMAN TEMPLATE (DETAIL MENDALAM)
Must include:
1) Template catalog/list management
2) Template status activation/hide flow
3) Multi-step editor structure:
   - metadata
   - preset
   - global style
   - opening
   - widgets
   - ornaments
   - preview
   - publish
4) Live preview behavior and viewport modes
5) Quality warning panel behavior

G. ORNAMENT EDITOR (SUPER DETAIL, KONDISI EXISTING)
Provide exact detailed spec:
1) Internal IA:
   - left: section + ornament list
   - center: canvas preview
   - right: properties
   - bottom: timeline
2) Left panel:
   - add/select/duplicate/delete ornament
   - reorder layer controls
   - section switching behavior
3) Canvas:
   - 9:16 preview frame
   - replay animation trigger
   - safe area/grid visual recommendations
4) Properties inspector groups:
   - ID
   - source/upload asset
   - slot grid (3x3)
   - useSlot toggle
   - width/height + unit
   - x/y/rotate
   - opacity/z-index
   - animation
   - entrance
   - loop mode
   - exit animation + visible duration
   - timeline track/position/duration/delay
   - flip/mirror
   - parallax + direction
5) Timeline:
   - multi-track behavior
   - playhead behavior
   - overlap rules
   - snap rules
6) Asset upload library:
   - upload flow
   - apply asset to selected ornament
   - delete uploaded asset
7) Validation warnings:
   - too many ornaments
   - too many animated ornaments
   - missing src
   - oversized asset
8) Performance guardrails
9) Keyboard and accessibility behavior
10) Done criteria for engineering and QA

H. HALAMAN RSVP (DETAIL MENDALAM)
Must include:
- RSVP list/table + summary
- filters (attendance/group/date)
- actionable views for follow-up
- export/report behavior recommendations
- empty/error/loading states

I. HALAMAN TAMU (DETAIL MENDALAM)
Must include:
- guest list and grouping behavior
- add/edit/delete flow
- bulk import text flow
- WA broadcast template flow
- personalized invitation link behavior
- filter/search behavior

J. HALAMAN MEDIA (DETAIL MENDALAM)
Must include:
- media library grid/list structure
- upload/replace/delete flows
- media type tabs/filters (image/video/audio)
- validation constraints (file size/type)
- fallback and error states

K. HALAMAN KONTEN (DETAIL MENDALAM)
Must include:
- events manager
- story manager
- bank account manager
- consistency rules across all managers
- inline CRUD behavior
- ordering and validation behavior

L. HALAMAN PENGATURAN (DETAIL MENDALAM)
Must include:
- business profile settings
- default communication/settings
- save/revert patterns
- change confirmation patterns
- safe messaging for admin

M. CROSS-PAGE FLOW AND CONTEXT PERSISTENCE
Define end-to-end flows:
1) create order -> setup invitation -> review -> publish
2) revision loop
3) archive flow
4) monitor RSVP and guest progress
Also define:
- what context should persist across pages
- what must reset

N. STATE, API, PERFORMANCE IMPLEMENTATION NOTES
Must include:
1) Suggested React component tree per page
2) Suggested page-level state shape
3) Suggested shared/global state boundaries
4) API dependency map per page
5) Loading strategy to avoid flicker:
   - no temporary fake/mock flash
   - deterministic loading placeholders
6) Performance strategy:
   - table rendering
   - memoization
   - debounce
   - request cancellation

O. IMPLEMENTATION ROADMAP
Provide phases:
1) Phase 1 quick wins (layout and loading behavior)
2) Phase 2 structural refactor (component and flow)
3) Phase 3 polish (accessibility, micro-interaction, performance)
Include Definition of Done checklist for each phase.

OUTPUT RULES:
- Use clear headings and bullet points
- No vague advice
- No filler
- No lorem ipsum
- No generic template text
- Every section must be practical and executable
- If uncertain, state assumption explicitly

CONSTRAINTS:
- Light mode remains primary
- Maintain premium admin visual quality
- Preserve existing business workflow
- Improve efficiency and clarity first, decoration second
```

