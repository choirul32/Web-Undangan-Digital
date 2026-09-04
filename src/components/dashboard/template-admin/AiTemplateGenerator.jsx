"use client";

import { useState } from "react";
import { DashboardButton, Field, SelectInput, TextAreaInput, TextInput } from "../FormControls";

const examplePrompts = [
  "buatkan undangan tema jawa wayang, elegan dan mewah",
  "undangan pernikahan islami hijau-emas yang kalem",
  "tema bali tropis dengan nuansa kamboja dan daun",
  "undangan modern minimalis putih bersih dengan aksen gold",
  "tema klasik keraton dengan songket dan warna cream-gold",
];

export default function AiTemplateGenerator({
  onGenerated,
  onGeneratedAsNewTemplate,
  templates = [],
  isGeneratingTemplate = false,
}) {
  const [prompt, setPrompt] = useState("");
  const [referenceTemplateId, setReferenceTemplateId] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [warnings, setWarnings] = useState([]);

  const sourceTemplates = (templates || []).filter(
    (template) => template.id && template.designConfig,
  );

  const runGenerate = async ({ asNewTemplate }) => {
    const trimmed = prompt.trim();
    if (!trimmed) {
      setError("Tulis prompt dulu, misal: 'buatkan undangan tema jawa wayang'.");
      return;
    }

    if (asNewTemplate && !templateName.trim()) {
      setError("Isi nama template baru dulu (dipakai untuk judul & slug template).");
      return;
    }

    setIsGenerating(true);
    setError("");
    setWarnings([]);

    try {
      const response = await fetch("/api/templates/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: trimmed,
          referenceTemplateId: referenceTemplateId || undefined,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(result.error || "Gagal generate template.");
        return;
      }

      setWarnings(result.data?.warnings || []);

      if (result.data?.designConfig) {
        const payload = {
          designConfig: result.data.designConfig,
          description: result.data.description || "",
          referenceTemplateId: referenceTemplateId || undefined,
        };
        if (asNewTemplate) {
          await onGeneratedAsNewTemplate?.({
            ...payload,
            name: templateName.trim(),
          });
        } else {
          onGenerated?.(payload);
        }
      }
    } catch (fetchError) {
      setError(fetchError?.message || "Gagal menghubungi server AI.");
    } finally {
      setIsGenerating(false);
    }
  };

  const busy = isGenerating || isGeneratingTemplate;

  return (
    <div className="rounded-[14px] border border-[var(--dash-border)] bg-white p-5 shadow-[var(--dash-shadow)]">
      <div className="flex items-center gap-2">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-[var(--dash-ink)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M9 9h6v6H9z" />
          <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" />
        </svg>
        <div>
          <h4 className="text-xl font-semibold text-[var(--dash-ink)]">AI Template Generator</h4>
          <p className="text-xs font-medium text-[var(--dash-muted)]">
            Ketik tema — AI menyusun design_config dari aset yang tersedia. Bisa meniru gaya template lain.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <Field label="Prompt Tema">
            <TextAreaInput
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows={3}
              placeholder="Contoh: buatkan undangan tema jawa wayang dengan ornamen wayang dan warna emas"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Contoh gaya dari template (opsional)">
              <SelectInput
                value={referenceTemplateId}
                onChange={(event) => setReferenceTemplateId(event.target.value)}
              >
                <option value="">Tanpa referensi</option>
                {sourceTemplates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name || template.id}
                  </option>
                ))}
              </SelectInput>
              <p className="mt-1.5 text-[10px] font-semibold text-[var(--dash-muted)]">
                AI meniru struktur section, ornamen, font & layout template ini, lalu menyesuaikan prompt-mu.
              </p>
            </Field>
            <Field label="Nama template baru (untuk 'Simpan sebagai baru')">
              <TextInput
                value={templateName}
                onChange={(event) => setTemplateName(event.target.value)}
                placeholder="Contoh: Wayang Emas Modern"
              />
            </Field>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-3">
          <div className="flex flex-wrap items-start gap-2">
            {examplePrompts.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setPrompt(example)}
                className="rounded-full border border-[var(--dash-border)] bg-[var(--dash-fog)] px-3 py-1 text-xs font-semibold text-[var(--dash-ink)] transition-colors hover:border-[var(--dash-ink)]"
              >
                {example}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <DashboardButton
              type="button"
              onClick={() => runGenerate({ asNewTemplate: false })}
              loading={busy}
              disabled={busy}
            >
              {busy ? "Menyusun desain..." : "Generate"}
            </DashboardButton>
            <DashboardButton
              type="button"
              variant="secondary"
              onClick={() => runGenerate({ asNewTemplate: true })}
              loading={busy}
              disabled={busy || !templateName.trim()}
            >
              {busy ? "Menyusun desain..." : "Generate & Simpan sebagai Template Baru"}
            </DashboardButton>
          </div>
          <p className="text-[11px] font-semibold leading-5 text-[var(--dash-muted)]">
            "Generate" memuat hasil ke editor aktif. "Generate & Simpan sebagai Template Baru" langsung membuat
            template baru (status tersembunyi) di katalog lalu membukanya.
          </p>
        </div>
      </div>

      {error ? (
        <p className="mt-3 rounded-[8px] bg-red-50 px-3 py-2 text-sm font-semibold text-red-600">
          {error}
        </p>
      ) : null}

      {warnings.length ? (
        <div className="mt-3 rounded-[8px] bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
          <p className="font-bold">Catatan hasil generate:</p>
          <ul className="mt-1 list-inside list-disc">
            {warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
