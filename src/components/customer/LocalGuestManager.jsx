"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  DashboardButton,
  DashboardPanel,
  TextAreaInput,
} from "../dashboard/FormControls";

const messageTemplates = [
  {
    id: "muslim",
    label: "Muslim",
    text:
      "Assalamualaikum Warahmatullahi Wabarakatuh\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i {guest_name} untuk menghadiri acara kami.\n\nBerikut link undangan kami, untuk info lengkap dari acara bisa kunjungi :\n\n{guest_link}\n\nMerupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.\n\n*Mohon maaf perihal undangan hanya di bagikan melalui pesan ini.\n\nTerima kasih banyak atas perhatiannya.\n\nWassalamualaikum Warahmatullahi Wabarakatuh",
  },
  {
    id: "christian",
    label: "Kristen",
    text:
      "Salam sejahtera dalam kasih Tuhan,\n\nTanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i {guest_name} untuk menghadiri acara kami.\n\nBerikut link undangan kami, untuk informasi lengkap acara dapat dikunjungi melalui:\n\n{guest_link}\n\nMerupakan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.\n\n*Mohon maaf undangan hanya kami bagikan melalui pesan ini.\n\nTerima kasih atas perhatian dan kehadirannya.\n\nTuhan memberkati.",
  },
  {
    id: "catholic",
    label: "Katolik",
    text:
      "Salam damai Kristus,\n\nTanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i {guest_name} untuk menghadiri acara kami.\n\nBerikut link undangan kami, untuk informasi lengkap acara dapat dikunjungi melalui:\n\n{guest_link}\n\nMerupakan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.\n\n*Mohon maaf undangan hanya kami bagikan melalui pesan ini.\n\nTerima kasih atas perhatian dan kehadirannya.\n\nBerkah Dalem.",
  },
  {
    id: "hindu",
    label: "Hindu",
    text:
      "Om Swastyastu,\n\nTanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i {guest_name} untuk menghadiri acara kami.\n\nBerikut link undangan kami, untuk informasi lengkap acara dapat dikunjungi melalui:\n\n{guest_link}\n\nMerupakan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.\n\n*Mohon maaf undangan hanya kami bagikan melalui pesan ini.\n\nTerima kasih atas perhatian dan kehadirannya.\n\nOm Shanti, Shanti, Shanti Om.",
  },
  {
    id: "buddhist",
    label: "Buddha",
    text:
      "Namo Buddhaya,\n\nTanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i {guest_name} untuk menghadiri acara kami.\n\nBerikut link undangan kami, untuk informasi lengkap acara dapat dikunjungi melalui:\n\n{guest_link}\n\nMerupakan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.\n\n*Mohon maaf undangan hanya kami bagikan melalui pesan ini.\n\nTerima kasih atas perhatian dan kehadirannya.\n\nSabbe Satta Bhavantu Sukhitatta.",
  },
  {
    id: "neutral",
    label: "Umum / Netral",
    text:
      "Dengan hormat,\n\nTanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i {guest_name} untuk menghadiri acara kami.\n\nBerikut link undangan kami, untuk informasi lengkap acara dapat dikunjungi melalui:\n\n{guest_link}\n\nMerupakan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.\n\n*Mohon maaf undangan hanya kami bagikan melalui pesan ini.\n\nTerima kasih banyak atas perhatian dan kehadirannya.",
  },
];

const defaultMessageTemplate = messageTemplates[0].text;

function uniqueGuestsFromText(text = "") {
  const seen = new Set();
  return text
    .split(/\n|,/)
    .map((name) => name.trim())
    .filter(Boolean)
    .map((name) => ({
      name,
      key: name.toLowerCase().replace(/\s+/g, " ").trim(),
    }))
    .filter((guest) => {
      if (!guest.key || seen.has(guest.key)) return false;
      seen.add(guest.key);
      return true;
    });
}

export default function LocalGuestManager({ invitationSlug = "" }) {
  const storageKey = `nusa-invite:local-guest-manager:${invitationSlug}`;
  const [namesText, setNamesText] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("muslim");
  const [messageTemplate, setMessageTemplate] = useState(defaultMessageTemplate);
  const [copyMessage, setCopyMessage] = useState("");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (!stored) return;
      const parsed = JSON.parse(stored);
      setNamesText(parsed.namesText || "");
      setSelectedTemplateId(parsed.selectedTemplateId || "muslim");
      setMessageTemplate(parsed.messageTemplate || defaultMessageTemplate);
    } catch {}
  }, [storageKey]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({ namesText, selectedTemplateId, messageTemplate }),
      );
    } catch {}
  }, [messageTemplate, namesText, selectedTemplateId, storageKey]);

  const guests = useMemo(() => uniqueGuestsFromText(namesText), [namesText]);

  const getGuestLink = (guest) =>
    typeof window === "undefined"
      ? `/${invitationSlug}?to=${encodeURIComponent(guest.name)}`
      : `${window.location.origin}/${invitationSlug}?to=${encodeURIComponent(guest.name)}`;

  const buildMessage = (guest) =>
    messageTemplate
      .replaceAll("{guest_name}", guest.name || "")
      .replaceAll("{guest_link}", getGuestLink(guest))
      .replaceAll("{invitation_slug}", invitationSlug);

  const copyText = async (text, successMessage) => {
    try {
      await window.navigator.clipboard.writeText(text);
      setCopyMessage(successMessage);
    } catch {
      setCopyMessage(text);
    }
  };

  const copyAllLinks = () => {
    const text = guests
      .map((guest) => `${guest.name}\t${getGuestLink(guest)}`)
      .join("\n");
    copyText(text, "Daftar nama dan link berhasil disalin.");
  };

  const copyAllMessages = () => {
    const text = guests
      .map((guest) => `--- ${guest.name} ---\n${buildMessage(guest)}`)
      .join("\n\n");
    copyText(text, "Semua teks WhatsApp berhasil disalin.");
  };

  const openWhatsapp = (guest) => {
    const text = encodeURIComponent(buildMessage(guest));
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  };

  const applyTemplate = (templateId) => {
    const template = messageTemplates.find((item) => item.id === templateId) || messageTemplates[0];
    setSelectedTemplateId(template.id);
    setMessageTemplate(template.text);
  };

  return (
    <DashboardPanel
      eyebrow="Guest Manager"
      title="Buat link tamu dari daftar nama"
      description={`Data hanya tersimpan lokal di browser ini. Link mengarah ke /${invitationSlug}?to=Nama%20Tamu.`}
      bodyClassName="p-0"
    >
      <div className="grid gap-5 border-b border-[var(--dash-border)] p-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
            Nama tamu
          </span>
          <TextAreaInput
            value={namesText}
            onChange={(event) => setNamesText(event.target.value)}
            rows={10}
            className="mt-2"
            placeholder={"irul, wulan, adi\natau satu nama per baris"}
          />
          <p className="mt-2 text-sm font-semibold text-[var(--dash-muted)]">
            Bisa dipisah koma atau enter. Duplikat otomatis dilewati.
          </p>
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
            Template WhatsApp
          </span>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {messageTemplates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => applyTemplate(template.id)}
                className={`rounded-xl border px-3 py-2 text-sm font-black transition-colors ${
                  selectedTemplateId === template.id
                    ? "border-[var(--dash-ink)] bg-[var(--dash-ink)] text-white"
                    : "border-[var(--dash-border)] bg-white text-[var(--dash-ink)] hover:bg-[var(--dash-fog)]"
                }`}
              >
                {template.label}
              </button>
            ))}
          </div>
          <TextAreaInput
            value={messageTemplate}
            onChange={(event) => setMessageTemplate(event.target.value)}
            rows={10}
            className="mt-3"
          />
          <p className="mt-2 text-sm font-semibold text-[var(--dash-muted)]">
            Token: {"{guest_name}"}, {"{guest_link}"}, {"{invitation_slug}"}.
          </p>
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--dash-border)] p-5">
        <p className="text-sm font-black text-[var(--dash-ink)]">
          {guests.length} nama siap dibagikan
        </p>
        <div className="flex flex-wrap gap-2">
          <DashboardButton type="button" variant="secondary" onClick={copyAllLinks}>
            Copy semua link
          </DashboardButton>
          <DashboardButton type="button" onClick={copyAllMessages}>
            Copy semua teks WA
          </DashboardButton>
        </div>
      </div>

      {copyMessage ? (
        <p className="px-5 pt-4 text-sm font-semibold text-[var(--dash-muted)]">
          {copyMessage}
        </p>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead className="bg-[var(--dash-fog)] text-xs uppercase tracking-[0.08em] text-[var(--dash-muted)]">
            <tr>
              <th className="px-5 py-3">Nama</th>
              <th className="px-5 py-3">Link personal</th>
              <th className="px-5 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--dash-border)]">
            {guests.map((guest) => (
              <tr key={guest.key} className="hover:bg-[var(--dash-fog)]/60">
                <td className="px-5 py-4">
                  <p className="text-sm font-black text-[var(--dash-ink)]">{guest.name}</p>
                  <p className="mt-1 text-xs font-semibold text-[var(--dash-muted)]">Nama dari query link</p>
                </td>
                <td className="px-5 py-4 text-sm font-semibold text-[var(--dash-muted)]">
                  /{invitationSlug}?to={encodeURIComponent(guest.name)}
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    <DashboardButton
                      type="button"
                      size="sm"
                      onClick={() => copyText(getGuestLink(guest), `Link ${guest.name} disalin.`)}
                    >
                      Copy Link
                    </DashboardButton>
                    <DashboardButton
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => copyText(buildMessage(guest), `Teks WA ${guest.name} disalin.`)}
                    >
                      Copy WA
                    </DashboardButton>
                    <DashboardButton
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => openWhatsapp(guest)}
                    >
                      Open WA
                    </DashboardButton>
                  </div>
                </td>
              </tr>
            ))}
            {!guests.length ? (
              <tr>
                <td colSpan={3} className="px-5 py-10 text-center text-sm font-semibold text-[var(--dash-muted)]">
                  Masukkan nama tamu dulu.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </DashboardPanel>
  );
}
