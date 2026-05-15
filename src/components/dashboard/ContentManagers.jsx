"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { sampleInvitation } from "../../data/sampleInvitation";
import { fadeUp } from "./config";
import { TextInput } from "./FormControls";

function MultiEventManager() {
  const [events, setEvents] = useState(sampleInvitation.events);
  const [form, setForm] = useState({
    title: "Akad Nikah",
    eventDate: "2026-06-12",
    eventTime: "09.00 WIB",
    venue: "Gedung Serbaguna Nusantara",
    address: "Jl. Melati Raya No. 12, Bandung",
    mapsUrl: "https://maps.google.com",
  });
  const [message, setMessage] = useState("");

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const addEvent = async () => {
    const newEvent = { ...form, date: form.eventDate, time: form.eventTime };
    setEvents((current) => [...current, newEvent]);
    setMessage("Menyimpan acara...");

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationSlug: "dimas-salsa", ...form }),
      });
      const result = await response.json();
      setMessage(
        result.source === "supabase"
          ? "Acara tersimpan ke Supabase."
          : "Acara ditambahkan sementara. Supabase belum dikonfigurasi.",
      );
    } catch {
      setMessage("Acara ditambahkan secara lokal.");
    }
  };

  return (
    <motion.section
      variants={fadeUp}
      className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] shadow-xl shadow-[var(--color-primary)]/8"
    >
      <div className="border-b border-[var(--color-accent-pale)] px-6 py-5">
        <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
          Multiple Events
        </p>
        <h2 className="mt-2 text-2xl font-black text-[var(--color-primary)]">
          Rangkaian acara
        </h2>
      </div>
      <div className="grid gap-4 border-b border-[var(--color-accent-pale)] p-6 md:grid-cols-2">
        <TextInput value={form.title} onChange={(event) => updateForm("title", event.target.value)} placeholder="Judul acara" />
        <TextInput type="date" value={form.eventDate} onChange={(event) => updateForm("eventDate", event.target.value)} />
        <TextInput value={form.eventTime} onChange={(event) => updateForm("eventTime", event.target.value)} placeholder="Jam acara" />
        <TextInput value={form.venue} onChange={(event) => updateForm("venue", event.target.value)} placeholder="Venue" />
        <TextInput value={form.address} onChange={(event) => updateForm("address", event.target.value)} placeholder="Alamat" />
        <TextInput value={form.mapsUrl} onChange={(event) => updateForm("mapsUrl", event.target.value)} placeholder="Google Maps URL" />
        <button
          type="button"
          onClick={addEvent}
          className="rounded-2xl bg-[var(--color-accent)] px-5 py-3 text-base font-black text-[var(--color-primary)] md:col-span-2"
        >
          Tambah Acara
        </button>
      </div>
      {message ? <p className="px-6 pt-5 text-sm font-bold text-[var(--color-text)]">{message}</p> : null}
      <div className="grid gap-5 p-6 md:grid-cols-2">
        {events.map((event, index) => (
          <article key={`${event.title}-${index}`} className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-5">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent)]">{event.title}</p>
            <h3 className="mt-2 text-xl font-black text-[var(--color-primary)]">{event.date || event.eventDate}</h3>
            <p className="mt-2 font-bold text-[var(--color-text)]">{event.time || event.eventTime}</p>
            <p className="mt-3 font-black text-[var(--color-primary)]">{event.venue}</p>
            <p className="mt-1 text-sm font-semibold text-[var(--color-text)]">{event.address}</p>
          </article>
        ))}
      </div>
    </motion.section>
  );
}

function StoryManager() {
  const [stories, setStories] = useState(sampleInvitation.story);
  const [form, setForm] = useState({
    year: "2026",
    title: "Hari Bahagia",
    description: "Kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan mendoakan.",
  });
  const [message, setMessage] = useState("");

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const addStory = async () => {
    const newStory = { year: form.year, title: form.title, desc: form.description };
    setStories((current) => [...current, newStory]);
    setMessage("Menyimpan cerita...");

    try {
      const response = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationSlug: "dimas-salsa", ...form }),
      });
      const result = await response.json();
      setMessage(
        result.source === "supabase"
          ? "Story tersimpan ke Supabase."
          : "Story ditambahkan sementara. Supabase belum dikonfigurasi.",
      );
    } catch {
      setMessage("Story ditambahkan secara lokal.");
    }
  };

  return (
    <motion.section
      variants={fadeUp}
      className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] shadow-xl shadow-[var(--color-primary)]/8"
    >
      <div className="border-b border-[var(--color-accent-pale)] px-6 py-5">
        <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
          Love Story
        </p>
        <h2 className="mt-2 text-2xl font-black text-[var(--color-primary)]">
          Cerita pasangan
        </h2>
      </div>
      <div className="grid gap-4 border-b border-[var(--color-accent-pale)] p-6 md:grid-cols-[160px_1fr]">
        <TextInput value={form.year} onChange={(event) => updateForm("year", event.target.value)} placeholder="Tahun" />
        <TextInput value={form.title} onChange={(event) => updateForm("title", event.target.value)} placeholder="Judul cerita" />
        <textarea
          value={form.description}
          onChange={(event) => updateForm("description", event.target.value)}
          rows={4}
          className="rounded-2xl border border-[var(--color-accent-pale)] bg-white px-4 py-3 text-base font-bold leading-7 text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)] md:col-span-2"
        />
        <button
          type="button"
          onClick={addStory}
          className="rounded-2xl bg-[var(--color-accent)] px-5 py-3 text-base font-black text-[var(--color-primary)] md:col-span-2"
        >
          Tambah Story
        </button>
      </div>
      {message ? <p className="px-6 pt-5 text-sm font-bold text-[var(--color-text)]">{message}</p> : null}
      <div className="grid gap-5 p-6 md:grid-cols-3">
        {stories.map((story, index) => (
          <article key={`${story.title}-${index}`} className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-5">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent)]">{story.year}</p>
            <h3 className="mt-2 text-xl font-black text-[var(--color-primary)]">{story.title}</h3>
            <p className="mt-3 text-sm font-semibold leading-6 text-[var(--color-text)]">{story.desc || story.description}</p>
          </article>
        ))}
      </div>
    </motion.section>
  );
}

function BankAccountManager() {
  const [accounts, setAccounts] = useState(sampleInvitation.bankAccounts);
  const [form, setForm] = useState({
    bank: "BCA",
    accountName: "Dimas Pratama",
    accountNumber: "1234567890",
  });
  const [message, setMessage] = useState("");

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const addAccount = async () => {
    const newAccount = {
      bank: form.bank,
      name: form.accountName,
      number: form.accountNumber,
    };
    setAccounts((current) => [...current, newAccount]);
    setMessage("Menyimpan rekening...");

    try {
      const response = await fetch("/api/bank-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationSlug: "dimas-salsa", ...form }),
      });
      const result = await response.json();
      setMessage(
        result.source === "supabase"
          ? "Rekening tersimpan ke Supabase."
          : "Rekening ditambahkan sementara. Supabase belum dikonfigurasi.",
      );
    } catch {
      setMessage("Rekening ditambahkan secara lokal.");
    }
  };

  return (
    <motion.section
      variants={fadeUp}
      className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] shadow-xl shadow-[var(--color-primary)]/8"
    >
      <div className="border-b border-[var(--color-accent-pale)] px-6 py-5">
        <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
          Bank Accounts
        </p>
        <h2 className="mt-2 text-2xl font-black text-[var(--color-primary)]">
          Amplop digital
        </h2>
      </div>
      <div className="grid gap-4 border-b border-[var(--color-accent-pale)] p-6 md:grid-cols-[160px_1fr_1fr_auto]">
        <TextInput value={form.bank} onChange={(event) => updateForm("bank", event.target.value)} placeholder="Bank" />
        <TextInput value={form.accountName} onChange={(event) => updateForm("accountName", event.target.value)} placeholder="Nama rekening" />
        <TextInput value={form.accountNumber} onChange={(event) => updateForm("accountNumber", event.target.value)} placeholder="Nomor rekening" />
        <button
          type="button"
          onClick={addAccount}
          className="rounded-2xl bg-[var(--color-accent)] px-5 py-3 text-base font-black text-[var(--color-primary)]"
        >
          Tambah
        </button>
      </div>
      {message ? <p className="px-6 pt-5 text-sm font-bold text-[var(--color-text)]">{message}</p> : null}
      <div className="grid gap-5 p-6 md:grid-cols-2">
        {accounts.map((account, index) => (
          <article key={`${account.bank}-${index}`} className="rounded-[8px] border border-[var(--color-accent-pale)] bg-white p-5">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent)]">{account.bank}</p>
            <h3 className="mt-2 text-2xl font-black text-[var(--color-primary)]">{account.number}</h3>
            <p className="mt-2 text-base font-semibold text-[var(--color-text)]">a.n. {account.name}</p>
          </article>
        ))}
      </div>
    </motion.section>
  );
}

export default function ContentManagers() {
  return (
    <>
      <MultiEventManager />
      <StoryManager />
      <BankAccountManager />
    </>
  );
}
