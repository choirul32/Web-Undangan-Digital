"use client";

import { Field, SelectInput, TextInput, ToggleField } from "../FormControls";
import VisualChoiceControl from "./VisualChoiceControl";
import {
  previewCoverCentered,
  previewCoverSplit,
  previewCoverStacked,
  previewPhotoArch,
  previewPhotoCircle,
  previewPhotoSquare,
  previewDateDot,
  previewDateLine,
  previewDateStacked,
  previewDatePlain,
  previewDateBadge,
  previewDateColumns,
  previewDateFullDay,
  previewDateBlock,
  previewAnimNone,
  previewAnimFadeUp,
  previewAnimZoomIn,
  previewAnimPop,
  previewAnimSlideLeft,
} from "./choicePreviews";

const optionLabels = {
  centered: "Tengah",
  split: "Terpisah",
  minimal: "Minimal",
  plain: "Polos",
  "separator-dot": "Titik pemisah",
  "separator-line": "Garis pemisah",
  stacked: "Bertumpuk",
  badge: "Badge",
  columns: "Kolom",
  "full-day": "Hari lengkap",
  block: "Blok tanggal",
  "fade-up": "Muncul dari bawah",
  "zoom-in": "Membesar halus",
  "pop-up": "Pop up lembut",
  color: "Warna",
  image: "Gambar",
  arch: "Lengkung",
  circle: "Lingkaran",
  square: "Kotak",
};

function optionLabel(value) {
  return optionLabels[value] || value;
}

function CoverLivePreview({ src }) {
  return (
    <div className="rounded-[14px] border border-[var(--dash-border)] bg-white p-3 lg:sticky lg:top-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs font-black uppercase tracking-[0.12em] text-[var(--dash-muted)]">
          Pratinjau Cover
        </p>
        <span className="rounded-full bg-[var(--dash-fog)] px-2.5 py-1 text-[11px] font-black text-[var(--dash-ink)]">
          412px
        </span>
      </div>
      <div className="mx-auto w-fit">
        <div className="relative rounded-[24px] border-[3px] border-[var(--color-primary)]/65 bg-[var(--color-primary)]/10 p-1.5 shadow-[0_10px_24px_rgba(15,23,42,0.16)]">
          <div className="absolute left-1/2 top-0 z-20 h-4 w-16 -translate-x-1/2 rounded-b-2xl bg-[var(--color-primary)]/70" />
          <div
            className="relative overflow-hidden rounded-[18px] border border-[var(--color-accent-pale)] bg-[var(--color-bg)]"
            style={{ width: 218, height: 388 }}
          >
            <iframe
              key={src}
              src={src}
              title="Pratinjau cover utama"
              className="absolute left-0 top-0 origin-top-left border-0"
              style={{ width: 412, height: 732, transform: "scale(0.529)" }}
            />
          </div>
          <div className="mx-auto mt-1 h-1 w-10 rounded-full bg-[var(--color-primary)]/35" />
        </div>
      </div>
    </div>
  );
}

export default function CoverStep({
  visible,
  coverSectionConfig,
  updateTemplateSectionConfig,
  coverBackgroundModeOptions,
  updateCoverBackgroundImage,
  coverPreviewSrc,
}) {
  if (!visible) {
    return null;
  }

  return (
    <div id="template-cover" className="scroll-mt-24 md:col-span-2">
      <div className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-fog)]/45 p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--dash-muted)]">
          Cover Utama
        </p>
        <p className="mt-1 text-base font-semibold text-[var(--dash-ink)]">
          Atur cover utama, foto, background, animasi konten, dan style nama tamu.
        </p>
        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-start">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="mt-6">
              <ToggleField
                checked={Boolean(coverSectionConfig.photoEnabled)}
                label="Foto aktif"
                desc="Tampilkan foto pasangan pada cover."
                onChange={(checked) =>
                  updateTemplateSectionConfig("home", "photoEnabled", checked)
                }
              />
            </div>
            <Field label="Layout Cover">
              <VisualChoiceControl
                value={coverSectionConfig.layout}
                options={[
                  {
                    value: "centered",
                    label: optionLabel("centered"),
                    preview: previewCoverCentered(),
                  },
                  {
                    value: "split",
                    label: optionLabel("split"),
                    preview: previewCoverSplit(),
                  },
                  {
                    value: "stacked",
                    label: optionLabel("stacked"),
                    preview: previewCoverStacked(),
                  },
                ]}
                onChange={(value) => updateTemplateSectionConfig("home", "layout", value)}
                columns={3}
                ariaLabel="Layout cover utama"
              />
            </Field>
            <Field label="Bentuk Foto">
              <VisualChoiceControl
                value={coverSectionConfig.photoStyle || "arch"}
                options={[
                  {
                    value: "arch",
                    label: optionLabel("arch"),
                    preview: previewPhotoArch(),
                  },
                  {
                    value: "circle",
                    label: optionLabel("circle"),
                    preview: previewPhotoCircle(),
                  },
                  {
                    value: "square",
                    label: optionLabel("square"),
                    preview: previewPhotoSquare(),
                  },
                ]}
                onChange={(value) =>
                  updateTemplateSectionConfig("home", "photoStyle", value)
                }
                columns={3}
                ariaLabel="Bentuk foto di cover"
              />
            </Field>
            <Field label="Gaya Tanggal">
              <VisualChoiceControl
                value={coverSectionConfig.dateVariant || "separator-dot"}
                options={[
                  {
                    value: "separator-dot",
                    label: optionLabel("separator-dot"),
                    preview: previewDateDot(),
                  },
                  {
                    value: "separator-line",
                    label: optionLabel("separator-line"),
                    preview: previewDateLine(),
                  },
                  {
                    value: "stacked",
                    label: optionLabel("stacked"),
                    preview: previewDateStacked(),
                  },
                  {
                    value: "plain",
                    label: optionLabel("plain"),
                    preview: previewDatePlain(),
                  },
                  {
                    value: "badge",
                    label: optionLabel("badge"),
                    preview: previewDateBadge(),
                  },
                  {
                    value: "columns",
                    label: optionLabel("columns"),
                    preview: previewDateColumns(),
                  },
                  {
                    value: "full-day",
                    label: optionLabel("full-day"),
                    preview: previewDateFullDay(),
                  },
                  {
                    value: "block",
                    label: optionLabel("block"),
                    preview: previewDateBlock(),
                  },
                ]}
                onChange={(value) =>
                  updateTemplateSectionConfig("home", "dateVariant", value)
                }
                columns={4}
                ariaLabel="Gaya tanggal di cover"
              />
            </Field>
            <Field label="Animasi Masuk">
              <VisualChoiceControl
                value={coverSectionConfig.openingAnimation}
                options={[
                  {
                    value: "fade-up",
                    label: optionLabel("fade-up"),
                    preview: previewAnimFadeUp(),
                  },
                  {
                    value: "zoom-in",
                    label: optionLabel("zoom-in"),
                    preview: previewAnimZoomIn(),
                  },
                  {
                    value: "slide-left",
                    label: optionLabel("slide-left"),
                    preview: previewAnimSlideLeft(),
                  },
                  {
                    value: "pop-up",
                    label: optionLabel("pop-up"),
                    preview: previewAnimPop(),
                  },
                  {
                    value: "none",
                    label: optionLabel("none"),
                    preview: previewAnimNone(),
                  },
                ]}
                onChange={(value) =>
                  updateTemplateSectionConfig("home", "openingAnimation", value)
                }
                columns={3}
                ariaLabel="Animasi munculnya konten cover"
              />
            </Field>
            <Field label="Background Cover">
              <SelectInput
                value={coverSectionConfig.backgroundMode || "color"}
                onChange={(event) =>
                  updateTemplateSectionConfig("home", "backgroundMode", event.target.value)
                }
              >
                {coverBackgroundModeOptions.map((mode) => (
                  <option key={mode} value={mode}>
                    {optionLabel(mode)}
                  </option>
                ))}
              </SelectInput>
            </Field>
            {coverSectionConfig.backgroundMode === "image" ? (
              <div className="rounded-xl border border-[var(--dash-border)] bg-white px-3 py-2 text-sm font-semibold leading-5 text-[var(--dash-muted)]">
                Background gambar memakai default dari Pengaturan. Upload foto asli dilakukan di order/media undangan.
              </div>
            ) : (
              <Field label="Warna Background">
                <input
                  type="color"
                  value={coverSectionConfig.backgroundColor || "#fbf7ef"}
                  onChange={(event) =>
                    updateTemplateSectionConfig("home", "backgroundColor", event.target.value)
                  }
                  className="h-11 w-full rounded-xl border border-[var(--dash-border)] bg-white p-1 outline-none focus:border-[var(--color-accent)]"
                />
              </Field>
            )}
          </div>
          <CoverLivePreview src={coverPreviewSrc} />
        </div>

        <div className="mt-6 rounded-[14px] border border-[var(--dash-border)] bg-white p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--dash-muted)]">
            Personalisasi Ukuran & Posisi
          </p>
          <p className="mt-1 text-base font-semibold text-[var(--dash-ink)]">
            Atur ukuran font dan posisi konten cover. Kosongkan ukuran font untuk memakai ukuran default.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Field label="Ukuran Nama (px)">
              <TextInput
                type="number"
                min={8}
                max={200}
                placeholder="22 (default mobile)"
                value={coverSectionConfig.nameFontSize ?? ""}
                onChange={(event) =>
                  updateTemplateSectionConfig("home", "nameFontSize", event.target.value)
                }
              />
            </Field>
            <Field label="Ukuran Tanggal (px)">
              <TextInput
                type="number"
                min={8}
                max={120}
                placeholder="12 (default mobile)"
                value={coverSectionConfig.dateFontSize ?? ""}
                onChange={(event) =>
                  updateTemplateSectionConfig("home", "dateFontSize", event.target.value)
                }
              />
            </Field>
            <Field label="Ukuran Kutipan (px)">
              <TextInput
                type="number"
                min={8}
                max={80}
                placeholder="11 (default mobile)"
                value={coverSectionConfig.quoteFontSize ?? ""}
                onChange={(event) =>
                  updateTemplateSectionConfig("home", "quoteFontSize", event.target.value)
                }
              />
            </Field>
            <Field label="Lebar Foto (px)">
              <TextInput
                type="number"
                min={40}
                max={400}
                placeholder="80 (default mobile)"
                value={coverSectionConfig.photoWidth ?? ""}
                onChange={(event) =>
                  updateTemplateSectionConfig("home", "photoWidth", event.target.value)
                }
              />
            </Field>
            <Field label="Posisi Konten">
              <SelectInput
                value={coverSectionConfig.contentPosition || "center"}
                onChange={(event) =>
                  updateTemplateSectionConfig("home", "contentPosition", event.target.value)
                }
              >
                <option value="center">Tengah</option>
                <option value="top">Atas</option>
                <option value="bottom">Bawah</option>
                <option value="split">Nama Atas, Tamu Bawah</option>
              </SelectInput>
            </Field>
            <Field label="Geser Konten (px, minus = naik)">
              <TextInput
                type="number"
                step={4}
                value={coverSectionConfig.contentOffsetY ?? 0}
                onChange={(event) =>
                  updateTemplateSectionConfig("home", "contentOffsetY", Number(event.target.value))
                }
              />
            </Field>
          </div>
        </div>
      </div>
    </div>
  );
}
