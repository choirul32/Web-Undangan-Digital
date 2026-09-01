"use client";

import { useEffect, useState } from "react";
import { DashboardButton, Field, SelectInput, TextInput } from "./FormControls";

const knownProviders = [
  { id: "sumopod", name: "SumoPod", baseUrl: "https://ai.sumopod.com", model: "gpt-4o-mini", type: "chat" },
  { id: "openrouter", name: "OpenRouter", baseUrl: "https://openrouter.ai/api/v1", model: "openai/gpt-4o-mini", type: "chat" },
  { id: "deepseek", name: "DeepSeek", baseUrl: "https://api.deepseek.com/v1", model: "deepseek-chat", type: "chat" },
  { id: "groq", name: "Groq", baseUrl: "https://api.groq.com/openai/v1", model: "llama-3.3-70b-versatile", type: "chat" },
  { id: "vercel-ai-gateway", name: "Vercel AI Gateway", baseUrl: "https://ai-gateway.vercel.sh/v1", model: "", type: "chat" },
  { id: "ollama", name: "Ollama (lokal)", baseUrl: "http://localhost:11434/v1", model: "llama3.2", type: "chat" },
  { id: "replicate", name: "Replicate (Image)", baseUrl: "https://api.replicate.com/v1", model: "black-forest-labs/flux-1.1-pro", type: "image" },
  { id: "custom", name: "Custom (OpenAI-compatible)", baseUrl: "", model: "", type: "chat" },
];

const providerPreset = (id) => {
  const preset = knownProviders.find((provider) => provider.id === id) || knownProviders[0];
  return {
    providerId: preset.id,
    name: preset.name,
    baseUrl: preset.baseUrl,
    model: preset.model,
    providerType: preset.type,
  };
};

export default function AiProvidersPanel() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    providerId: "sumopod",
    name: "SumoPod",
    baseUrl: "https://ai.sumopod.com",
    model: "gpt-4o-mini",
    providerType: "chat",
    apiKey: "",
  });
  const [editing, setEditing] = useState(null);
  const [revealedKeys, setRevealedKeys] = useState({});
  const [testingProvider, setTestingProvider] = useState(null);

  const loadProviders = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/settings/ai-providers");
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Gagal memuat provider.");
      }
      setProviders(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProviders();
  }, []);

  const openNewForm = () => {
    setEditing(null);
    setForm({ ...providerPreset("sumopod"), apiKey: "" });
    setFormOpen(true);
  };

  const openEditForm = (provider) => {
    setEditing(provider);
    setForm({
      providerId: provider.providerId,
      name: provider.name,
      baseUrl: provider.baseUrl,
      model: provider.model,
      providerType: provider.providerType || "chat",
      apiKey: "",
    });
    setFormOpen(true);
  };

  const onPresetChange = (id) => {
    const preset = providerPreset(id);
    setForm((current) => ({
      ...preset,
      apiKey: current.apiKey,
    }));
  };

  const saveProvider = async () => {
    setMessage("");
    setError("");

    if (!form.providerId || !form.name || !form.baseUrl) {
      setError("Provider ID, nama, dan Base URL wajib diisi.");
      return;
    }
    if (!editing && !form.apiKey) {
      setError("API Key wajib diisi untuk provider baru.");
      return;
    }

    try {
      const url = editing ? "/api/settings/ai-providers" : "/api/settings/ai-providers";
      const method = editing ? "PATCH" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Gagal menyimpan provider.");
      }

      setMessage(editing ? "Provider diperbarui." : "Provider ditambahkan.");
      setFormOpen(false);
      await loadProviders();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteProvider = async (provider) => {
    if (!window.confirm(`Hapus provider "${provider.name}"?`)) {
      return;
    }

    setError("");
    try {
      const response = await fetch("/api/settings/ai-providers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providerId: provider.providerId }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Gagal menghapus provider.");
      }
      setMessage("Provider dihapus.");
      await loadProviders();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleProviderActive = async (provider) => {
    setError("");
    try {
      const response = await fetch("/api/settings/ai-providers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId: provider.providerId,
          isActive: !provider.isActive,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Gagal mengubah status.");
      }
      await loadProviders();
    } catch (err) {
      setError(err.message);
    }
  };

  const testProvider = async (provider) => {
    setTestingProvider(provider.providerId);
    setMessage("");
    setError("");
    try {
      // Gunakan route generate dengan prompt minimal untuk memverifikasi koneksi.
      const response = await fetch("/api/templates/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: "buatkan undangan tema minimalis" }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Koneksi gagal.");
      }
      setMessage(`Provider "${provider.name}" berfungsi. (${provider.model})`);
    } catch (err) {
      setError(`Provider "${provider.name}" gagal: ${err.message}`);
    } finally {
      setTestingProvider(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-[var(--color-text)]">Provider AI Template Generator</p>
          <p className="text-xs font-semibold text-[var(--color-text)]/70">
            Provider chat (OpenAI-compatible) untuk generate template; provider image (Replicate) untuk generate ornamen.
          </p>
        </div>
        <DashboardButton type="button" onClick={openNewForm}>
          + Tambah Provider
        </DashboardButton>
      </div>

      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600">{error}</p>
      ) : null}
      {message ? (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">{message}</p>
      ) : null}

      {loading ? (
        <p className="text-sm font-semibold text-[var(--color-text)]/60">Memuat provider...</p>
      ) : providers.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[var(--color-accent-pale)] bg-[var(--color-muted)]/40 p-6 text-center">
          <p className="text-sm font-bold text-[var(--color-text)]/70">Belum ada provider AI.</p>
          <p className="mt-1 text-xs font-semibold text-[var(--color-text)]/55">
            Tambahkan SumoPod, OpenRouter, DeepSeek, atau provider OpenAI-compatible lain.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {providers.map((provider) => {
            const revealed = revealedKeys[provider.providerId];
            return (
              <div
                key={provider.providerId}
                className={`rounded-lg border p-4 ${
                  provider.isActive
                    ? "border-[var(--color-accent)] bg-white"
                    : "border-[var(--color-accent-pale)] bg-[var(--color-muted)]/30"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-xs font-black ${
                        provider.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-[var(--color-muted)] text-[var(--color-text)]/50"
                      }`}
                    >
                      {provider.name.slice(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <p className="text-sm font-black text-[var(--color-text)]">
                        {provider.name}
                        <span
                          className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-black ${
                            provider.providerType === "image"
                              ? "bg-violet-100 text-violet-700"
                              : "bg-sky-100 text-sky-700"
                          }`}
                        >
                          {provider.providerType === "image" ? "IMAGE" : "CHAT"}
                        </span>
                        {provider.isActive ? (
                          <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-black text-green-700">
                            AKTIF
                          </span>
                        ) : null}
                      </p>
                      <p className="text-xs font-semibold text-[var(--color-text)]/60">
                        {provider.baseUrl} · {provider.model}
                      </p>
                      <p className="text-xs font-medium text-[var(--color-text)]/50">
                        Key:{" "}
                        {revealed ? (
                          <span className="font-mono">{provider.apiKey}</span>
                        ) : (
                          <span>{provider.hasKey ? `${provider.apiKey} (klik lihat)` : "kosong"}</span>
                        )}{" "}
                        <button
                          type="button"
                          onClick={() =>
                            setRevealedKeys((current) => ({
                              ...current,
                              [provider.providerId]: !revealed,
                            }))
                          }
                          className="font-black text-[var(--color-accent)] hover:underline"
                        >
                          {revealed ? "Sembunyikan" : "Lihat"}
                        </button>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <DashboardButton
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => testProvider(provider)}
                      loading={testingProvider === provider.providerId}
                    >
                      Test
                    </DashboardButton>
                    <DashboardButton
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => toggleProviderActive(provider)}
                    >
                      {provider.isActive ? "Nonaktifkan" : "Aktifkan"}
                    </DashboardButton>
                    <DashboardButton type="button" variant="secondary" size="sm" onClick={() => openEditForm(provider)}>
                      Edit
                    </DashboardButton>
                    <DashboardButton type="button" variant="secondary" size="sm" onClick={() => deleteProvider(provider)}>
                      Hapus
                    </DashboardButton>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {formOpen ? (
        <div className="rounded-lg border border-[var(--color-accent-pale)] bg-[var(--color-muted)]/30 p-5">
          <p className="text-sm font-black text-[var(--color-text)]">
            {editing ? `Edit Provider: ${editing.name}` : "Tambah Provider AI"}
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="Provider (preset)">
              <SelectInput
                value={form.providerId}
                onChange={(event) => onPresetChange(event.target.value)}
                disabled={Boolean(editing)}
              >
                {knownProviders.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Tipe Provider">
              <SelectInput
                value={form.providerType}
                onChange={(event) => setForm((current) => ({ ...current, providerType: event.target.value }))}
              >
                <option value="chat">Chat (OpenAI-compatible)</option>
                <option value="image">Image (Replicate)</option>
              </SelectInput>
            </Field>
            <Field label="Nama Tampilan">
              <TextInput
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              />
            </Field>
            <Field label="Base URL (OpenAI-compatible)">
              <TextInput
                value={form.baseUrl}
                onChange={(event) => setForm((current) => ({ ...current, baseUrl: event.target.value }))}
                placeholder="https://api..../v1"
              />
            </Field>
            <Field label="Model Default">
              <TextInput
                value={form.model}
                onChange={(event) => setForm((current) => ({ ...current, model: event.target.value }))}
                placeholder="gpt-4o-mini"
              />
            </Field>
            <div className="md:col-span-2">
              <Field label={editing ? "API Key (kosongkan jika tidak diubah)" : "API Key"}>
                <TextInput
                  type="password"
                  value={form.apiKey}
                  onChange={(event) => setForm((current) => ({ ...current, apiKey: event.target.value }))}
                  placeholder="sk-..."
                  autoComplete="off"
                />
              </Field>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <DashboardButton type="button" onClick={saveProvider}>
              {editing ? "Simpan Perubahan" : "Tambah Provider"}
            </DashboardButton>
            <DashboardButton
              type="button"
              variant="secondary"
              onClick={() => setFormOpen(false)}
            >
              Batal
            </DashboardButton>
          </div>
        </div>
      ) : null}
    </div>
  );
}
