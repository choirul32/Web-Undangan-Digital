"use client";

import { useState } from "react";
import { DashboardButton, Field, SelectInput, TextInput } from "./FormControls";
import { ORNAMENT_STYLE_PRESETS, SLOT_PROMPT_HINTS } from "../../lib/ai/ornamentStyles";

const SLOT_OPTIONS = Object.keys(SLOT_PROMPT_HINTS);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function AiOrnamentGenerator({ templates, onSaved }) {
  const [styleId, setStyleId] = useState("siluet");
  const [subject, setSubject] = useState("");
  const [slot, setSlot] = useState("top-left");
  const [templateId, setTemplateId] = useState("ornament-library");
  const [name, setName] = useState("");

  const [phase, setPhase] = useState("idle"); // idle | generating | preview | removing | saving
  const [statusText, setStatusText] = useState("");
  const [error, setError] = useState("");
  const [resultImage, setResultImage] = useState("");
  const [finalImage, setFinalImage] = useState("");
  const [metadata, setMetadata] = useState(null);

  const pollPrediction = async (predictionId) => {
    for (let attempt = 0; attempt < 60; attempt += 1) {
      await sleep(1500);
      const response = await fetch(`/api/ornaments/generate/${predictionId}`);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Gagal cek status");
      }
      const prediction = result.data;
      if (prediction.status === "succeeded") {
        return prediction.output || "";
      }
      if (prediction.status === "failed") {
        throw new Error(prediction.error || "Generate gagal");
      }
    }
    throw new Error("Generate timeout");
  };

  const handleGenerate = async (event) => {
    event.preventDefault();
    if (!subject.trim()) {
      setError("Tulis deskripsi subjek dulu, misal: wayang arjuna");
      return;
    }

    setError("");
    setPhase("generating");
    setStatusText("Menyiapkan generate...");
    setResultImage("");
    setFinalImage("");
    setMetadata(null);

    try {
      const response = await fetch("/api/ornaments/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ styleId, subject: subject.trim(), slot }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Gagal generate");
      }

      setStatusText("AI sedang menggambar ornamen...");
      const output = await pollPrediction(result.data.predictionId);
      if (!output) {
        throw new Error("Hasil generate kosong");
      }

      setResultImage(output);
      setFinalImage(output);
      setPhase("preview");
    } catch (err) {
      setError(err.message);
      setPhase("idle");
    }
  };

  const handleRemoveBg = async () => {
    if (!resultImage) return;
    setError("");
    setPhase("removing");
    setStatusText("Menghapus background...");

    try {
      const response = await fetch("/api/ornaments/generate/remove-bg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: resultImage }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Gagal remove background");
      }

      setStatusText("Membersihkan background...");
      const output = await pollPrediction(result.data.predictionId);
      if (!output) {
        throw new Error("Hasil remove background kosong");
      }

      setFinalImage(output);
      setPhase("preview");
    } catch (err) {
      setError(err.message);
      setPhase("preview");
    }
  };

  const handleSave = async () => {
    if (!finalImage) return;
    setError("");
    setPhase("saving");
    setStatusText("Menyimpan + membuat metadata...");

    try {
      const response = await fetch("/api/ornaments/generate/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: finalImage,
          name: name.trim(),
          templateId,
          prompt: `${subject.trim()} (gaya ${styleId}, slot ${slot})`,
          subject: subject.trim(),
          styleId,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Gagal menyimpan");
      }

      setMetadata(result.data);
      setStatusText("Ornamen tersimpan.");
      setPhase("idle");
      onSaved?.(result.data);
    } catch (err) {
      setError(err.message);
      setPhase("preview");
    }
  };

  const reset = () => {
    setPhase("idle");
    setResultImage("");
    setFinalImage("");
    setMetadata(null);
    setError("");
  };

  return (
    <div className="rounded-[14px] border border-[var(--dash-border)] bg-white p-5 shadow-[var(--dash-shadow)]">
      <div className="flex items-center gap-2">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-[var(--dash-ink)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
        <div>
          <h3 className="text-lg font-black text-[var(--dash-ink)]">Generate Ornamen AI</h3>
          <p className="text-xs font-semibold text-[var(--dash-muted)]">
            Ketik prompt, AI gambar ornamen → preview → hapus background → simpan ke library.
          </p>
        </div>
      </div>

      {phase === "idle" ? (
        <form onSubmit={handleGenerate} className="mt-4 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Gaya">
              <SelectInput value={styleId} onChange={(event) => setStyleId(event.target.value)}>
                {ORNAMENT_STYLE_PRESETS.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.label} — {preset.description}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Slot / Posisi">
              <SelectInput value={slot} onChange={(event) => setSlot(event.target.value)}>
                {SLOT_OPTIONS.map((slotOption) => (
                  <option key={slotOption} value={slotOption}>
                    {slotOption}
                  </option>
                ))}
              </SelectInput>
            </Field>
          </div>

          <Field label="Deskripsi Subjek">
            <TextInput
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="Contoh: wayang arjuna, bunga mawar, kaligrafi bismillah"
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nama Ornamen (opsional)">
              <TextInput
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Kosongkan → AI buatkan"
              />
            </Field>
            <Field label="Simpan di">
              <SelectInput value={templateId} onChange={(event) => setTemplateId(event.target.value)}>
                <option value="ornament-library">Library global</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name || template.id}
                  </option>
                ))}
              </SelectInput>
            </Field>
          </div>

          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600">{error}</p>
          ) : null}

          <DashboardButton type="submit">Generate Ornamen</DashboardButton>
        </form>
      ) : null}

      {phase === "generating" || phase === "removing" || phase === "saving" ? (
        <div className="mt-4 rounded-xl border border-[var(--dash-border)] bg-[var(--dash-fog)]/50 p-6 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[var(--dash-border)] border-t-[var(--dash-ink)]" />
          <p className="mt-3 text-sm font-bold text-[var(--dash-ink)]">{statusText}</p>
          <p className="mt-1 text-xs font-semibold text-[var(--dash-muted)]">
            Biasanya butuh beberapa detik.
          </p>
        </div>
      ) : null}

      {phase === "preview" ? (
        <div className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[var(--dash-border)] bg-slate-50 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
                Hasil Generate
              </p>
              <div className="mt-2 flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-white shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resultImage}
                  alt="Hasil generate"
                  className="max-h-full max-w-full object-contain"
                  onError={() => setError("Gagal memuat gambar hasil generate.")}
                />
              </div>
              {resultImage ? (
                <a
                  href={resultImage}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block truncate text-xs font-bold text-[var(--color-accent)] hover:underline"
                >
                  Buka gambar di tab baru ↗
                </a>
              ) : null}
            </div>
            <div className="rounded-xl border border-[var(--dash-border)] bg-slate-50 p-3">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
                Final {finalImage !== resultImage ? "(background dihapus)" : ""}
              </p>
              <div className="mt-2 flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-[repeating-conic-gradient(#eee_0%_25%,#fff_0%_50%)] bg-[length:16px_16px] shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={finalImage}
                  alt="Ornamen final"
                  className="max-h-full max-w-full object-contain"
                  onError={() => setError("Gagal memuat gambar final.")}
                />
              </div>
              {finalImage ? (
                <a
                  href={finalImage}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block truncate text-xs font-bold text-[var(--color-accent)] hover:underline"
                >
                  Buka gambar di tab baru ↗
                </a>
              ) : null}
            </div>
          </div>

          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600">{error}</p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            {finalImage === resultImage ? (
              <DashboardButton type="button" variant="secondary" onClick={handleRemoveBg}>
                Hapus Background
              </DashboardButton>
            ) : null}
            <DashboardButton type="button" onClick={handleSave}>
              Simpan ke Library
            </DashboardButton>
            <DashboardButton type="button" variant="secondary" onClick={reset}>
              Generate Ulang
            </DashboardButton>
          </div>
        </div>
      ) : null}

      {metadata ? (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-black text-emerald-800">Ornamen tersimpan!</p>
          <p className="mt-1 text-xs font-semibold text-emerald-700">
            Tema: {metadata.theme?.join(", ") || "-"} · Slot: {metadata.suggestedSlots?.join(", ") || "-"} · Visual: {metadata.visualProps?.join(", ") || "-"}
          </p>
        </div>
      ) : null}
    </div>
  );
}
