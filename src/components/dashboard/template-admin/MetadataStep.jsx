"use client";

import {
  DashboardCard,
  Field,
  SelectInput,
  TextAreaInput,
  TextInput,
} from "../FormControls";

export default function MetadataStep({
  visible,
  templateDraft,
  editingTemplateId,
  updateTemplateDraft,
  templateCategoryOptions,
  templateBadgeOptions,
  selectedBadgeOption,
  currentStepNumber,
  totalEditorSteps,
  isUploadingThumbnail,
  updateTemplateThumbnail,
}) {
  if (!visible || !templateDraft) {
    return null;
  }

  return (
    <div id="template-basic" className="mt-5 scroll-mt-24">
      <div className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-fog)]/45 p-5">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-[var(--dash-ink)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16v16H4z" />
            <path d="M8 8h8" />
            <path d="M8 12h8" />
            <path d="M8 16h5" />
          </svg>
          <h4 className="text-2xl font-semibold text-[var(--dash-ink)]">Informasi Dasar</h4>
        </div>
        <div className="mt-4 grid grid-cols-1 items-start gap-4 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <DashboardCard>
              <div className="grid gap-x-3 gap-y-1 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="block">
                    <span className="mb-0.5 flex items-center justify-between text-sm font-bold text-[var(--dash-ink)]">
                      <span>Template ID <span className="text-red-600">*</span></span>
                      <span className="text-xs font-medium text-[var(--dash-muted)]">
                        Unik, tanpa spasi (gunakan strip)
                      </span>
                    </span>
                    <TextInput
                      value={templateDraft.id}
                      onChange={(event) => updateTemplateDraft("id", event.target.value)}
                      disabled={Boolean(editingTemplateId)}
                      placeholder="contoh: minimalis-elegan-01"
                      className="py-2"
                    />
                  </label>
                </div>
                <Field label="Nama Template *">
                  <TextInput
                    value={templateDraft.name}
                    onChange={(event) => updateTemplateDraft("name", event.target.value)}
                    placeholder="Masukkan nama (tampil ke user)"
                    className="py-2"
                  />
                </Field>
                <Field label="Kategori *">
                  <SelectInput
                    value={templateDraft.category}
                    onChange={(event) => updateTemplateDraft("category", event.target.value)}
                    className="py-2"
                  >
                    <option value="">Pilih Kategori</option>
                    {templateCategoryOptions.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </SelectInput>
                </Field>
                <Field label="Harga (Rp)">
                  <TextInput
                    value={templateDraft.price}
                    onChange={(event) => updateTemplateDraft("price", event.target.value)}
                    placeholder="Kosongkan jika gratis"
                    className="py-2"
                  />
                </Field>
                <Field label="Badge/Label">
                  <SelectInput
                    value={selectedBadgeOption}
                    onChange={(event) => {
                      const nextValue = event.target.value;
                      updateTemplateDraft("badge", nextValue === "Custom" ? "" : nextValue);
                    }}
                    className="py-2"
                  >
                    {templateBadgeOptions.map((badgeOption) => (
                      <option key={badgeOption} value={badgeOption}>
                        {badgeOption}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
                <Field label="Status">
                  <SelectInput
                    value={templateDraft.status}
                    onChange={(event) => updateTemplateDraft("status", event.target.value)}
                    className="py-2"
                  >
                    <option value="active">Aktif</option>
                    <option value="hidden">Disembunyikan</option>
                    {templateDraft.status && !["active", "hidden"].includes(templateDraft.status) ? (
                      <option value={templateDraft.status}>
                        {templateDraft.status === "published" ? "Terpublikasi" : templateDraft.status}
                      </option>
                    ) : null}
                  </SelectInput>
                </Field>
                <Field label="Preview URL">
                  <TextInput
                    value={templateDraft.previewUrl || ""}
                    onChange={(event) => updateTemplateDraft("previewUrl", event.target.value)}
                    className="py-2"
                  />
                </Field>
                <div className="md:col-span-2">
                  <Field label="Deskripsi Singkat">
                    <TextAreaInput
                      value={templateDraft.description}
                      onChange={(event) => updateTemplateDraft("description", event.target.value)}
                      rows={3}
                      placeholder="Jelaskan konsep dan keunggulan desain ini..."
                    />
                  </Field>
                </div>
                {selectedBadgeOption === "Custom" ? (
                  <div className="md:col-span-2">
                    <Field label="Badge Custom">
                      <TextInput
                        value={templateDraft.badge || ""}
                        onChange={(event) => updateTemplateDraft("badge", event.target.value)}
                        placeholder="Contoh: Editor Pick"
                      />
                    </Field>
                  </div>
                ) : null}
              </div>
            </DashboardCard>
          </div>
          <div className="space-y-3 lg:col-span-4 lg:sticky lg:top-24">
            <DashboardCard>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--dash-muted)]">
                    Status Draft
                  </p>
                  <p className="mt-1 text-lg font-semibold text-[var(--dash-ink)]">
                    {Math.round((currentStepNumber / totalEditorSteps) * 100)}% Selesai
                  </p>
                </div>
                <span className="rounded-full border border-[var(--dash-border)] bg-[var(--dash-fog)] px-3 py-1 text-xs font-semibold text-[var(--dash-ink)]">
                  {templateDraft.status || "draft"}
                </span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-[var(--dash-fog)]">
                <div
                  className="h-2 rounded-full bg-[var(--dash-ink)] transition-all"
                  style={{ width: `${(currentStepNumber / totalEditorSteps) * 100}%` }}
                />
              </div>
              <ul className="mt-4 space-y-2 text-sm font-semibold text-[var(--dash-ink)]">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[var(--dash-ink)]" />
                  Lengkapi Metadata Utama
                </li>
                <li className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${templateDraft.image ? "bg-emerald-500" : "bg-[var(--dash-ink)]"}`} />
                  Upload Thumbnail
                </li>
                <li className="flex items-center gap-2 text-[var(--dash-muted)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--dash-border)]" />
                  Konfigurasi Preset Warna
                </li>
                <li className="flex items-center gap-2 text-[var(--dash-muted)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--dash-border)]" />
                  Atur Global Typography
                </li>
              </ul>
            </DashboardCard>

            <DashboardCard>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--dash-muted)]">
                Thumbnail Template
              </p>
              <label className="mt-3 block cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => updateTemplateThumbnail(event.target.files?.[0])}
                  className="hidden"
                />
                <div className="rounded-xl border-2 border-dashed border-[var(--dash-border)] bg-[var(--dash-fog)] p-5 text-center transition-colors hover:border-[var(--dash-ink)]">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-white">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[var(--dash-ink)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 16V4" />
                      <path d="m7 9 5-5 5 5" />
                      <path d="M20 16.5a4.5 4.5 0 0 1-1.2 8.8H6.2A4.2 4.2 0 0 1 6 16.8" />
                    </svg>
                  </div>
                  <p className="mt-3 text-sm font-bold text-[var(--dash-ink)]">
                    Klik untuk unggah atau seret dan lepas
                  </p>
                  <p className="mt-1 text-xs font-semibold text-[var(--dash-muted)]">
                    PNG, JPG atau WebP (maks. 800x1200px)
                  </p>
                </div>
              </label>
              <div className="mt-4 flex justify-center">
                <div className="aspect-[2/3] w-full max-w-[180px] rounded-[8px] border border-dashed border-[var(--dash-border)] bg-[var(--dash-fog)] p-2">
                  {templateDraft.image ? (
                    <img
                      src={templateDraft.image}
                      alt={`Preview ${templateDraft.name}`}
                      className="h-full w-full rounded-[6px] object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center text-center">
                      <svg viewBox="0 0 24 24" className="h-8 w-8 text-[var(--dash-muted)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="m21 15-5-5L5 21" />
                      </svg>
                      <p className="mt-2 text-[11px] font-bold text-[var(--dash-muted)]">
                        Preview Thumbnail
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-3">
                {isUploadingThumbnail ? (
                  <p className="mt-2 text-sm font-semibold text-[var(--dash-muted)]">
                    Mengupload thumbnail...
                  </p>
                ) : null}
              </div>
              {!templateDraft.image ? (
                <p className="mt-3 rounded-[8px] bg-[var(--dash-fog)] px-3 py-2 text-xs font-bold text-[var(--dash-muted)]">
                  Thumbnail wajib diunggah sebelum publish template.
                </p>
              ) : null}
            </DashboardCard>
          </div>
        </div>
      </div>
    </div>
  );
}
