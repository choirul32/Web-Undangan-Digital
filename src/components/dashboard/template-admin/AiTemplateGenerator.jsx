"use client";

import { useState } from "react";
import { DashboardButton, Field, TextAreaInput, TextInput } from "../FormControls";

const examplePrompts = [
  "buatkan undangan tema jawa wayang, elegan dan mewah",
  "undangan pernikahan islami hijau-emas yang kalem",
  "tema bali tropis dengan nuansa kamboja dan daun",
  "undangan modern minimalis putih bersih dengan aksen gold",
  "tema klasik keraton dengan songket dan warna cream-gold",
];

export default function AiTemplateGenerator({ onGenerated }) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [warnings, setWarnings] = useState([]);

  const generate = async () => {
    const trimmed = prompt.trim();
    if (!trimmed) {
      setError("Tulis prompt dulu, misal: 'buatkan undangan tema jawa wayang'.");
      return;
    }

    setIsGenerating(true);
    setError("");
    setWarnings([]);

    try {
      const response = await fetch("/api/templates/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmed }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(result.error || "Gagal generate template.");
        return;
      }

      setWarnings(result.data?.warnings || []);

      if (result.data?.designConfig) {
        onGenerated?.({
          designConfig: result.data.designConfig,
          description: result.data.description || "",
        });
      }
    } catch (fetchError) {
      setError(fetchError?.message || "Gagal menghubungi server AI.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="rounded-[14px] border border-[var(--dash-border)] bg-white p-5 shadow-[var(--dash-shadow)]">
      <div className="flex items-center gap-2">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-[var(--dash-ink)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="3" />
          <path d="M9 9h6v6H9z" />
          <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" />
        </svg>
        <div>
          <h4 className="text-xl font-semibold text-[var(--dash-ink)]">AI Template Generator</h4>
          <p className="text-xs font-medium text-[var(--dash-muted)]">
            Ketik tema, AI menyusun design_config dari aset yang tersedia.
          </p>
        </div>
      </div>

      <div className="mt-4">
        <Field label="Prompt Tema">
          <TextAreaInput
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            rows={3}
            placeholder="Contoh: buatkan undangan tema jawa wayang dengan ornamen wayang dan warna emas"
          />
        </Field>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
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

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <DashboardButton type="button" onClick={generate} loading={isGenerating}>
          {isGenerating ? "Menyusun desain..." : "Generate Template"}
        </DashboardButton>
        {!isGenerating && prompt.trim() ? (
          <button
            type="button"
            onClick={() => setPrompt("")}
            className="text-sm font-semibold text-[var(--dash-muted)] hover:text-[var(--dash-ink)]"
          >
            Bersihkan
          </button>
        ) : null}
      </div>
    </div>
  );
}
