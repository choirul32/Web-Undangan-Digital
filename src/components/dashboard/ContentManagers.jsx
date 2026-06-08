"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "./config";
import { TextInput, TextAreaInput } from "./FormControls";

const localId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
const panelClass =
  "overflow-hidden rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-canvas)] shadow-[var(--dash-shadow)]";
const panelHeaderClass = "border-b border-[var(--dash-border)] px-5 py-4";
const panelEyebrowClass =
  "text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)]";
const panelTitleClass = "mt-1 text-2xl font-semibold text-[var(--dash-ink)]";
const formGridClass = "grid gap-3 border-b border-[var(--dash-border)] p-5";
const primaryButtonClass =
  "rounded-md bg-[var(--dash-ink)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--dash-dark)]";
const secondaryButtonClass =
  "rounded-md border border-[var(--dash-border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--dash-ink)] hover:bg-[var(--dash-fog)]";
const cardClass = "rounded-[14px] border border-[var(--dash-border)] bg-white p-5";

async function persistSortOrder(endpoint, invitationSlug, items) {
  await Promise.all(
    items.map((item, index) =>
      fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationSlug,
          ...item,
          sortOrder: index + 1,
        }),
      }),
    ),
  );
}

function MultiEventManager({ invitationSlug = "" }) {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    eventDate: "",
    eventTime: "",
    venue: "",
    address: "",
    mapsUrl: "",
  });
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState("");

  useEffect(() => {
    if (!invitationSlug) {
      setEvents([]);
      return undefined;
    }

    let isMounted = true;

    fetch(`/api/events?invitationSlug=${encodeURIComponent(invitationSlug)}`)
      .then((response) => response.json())
      .then((result) => {
        if (isMounted && Array.isArray(result.data)) {
          setEvents(result.data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setEvents([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [invitationSlug]);

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setForm({
      title: "",
      eventDate: "",
      eventTime: "",
      venue: "",
      address: "",
      mapsUrl: "",
    });
    setEditingId("");
  };

  const saveEvent = async () => {
    const newEvent = {
      ...form,
      id: editingId || localId("event"),
      date: form.eventDate,
      time: form.eventTime,
    };
    const previous = events;

    setEvents((current) =>
      editingId
        ? current.map((event) => (event.id === editingId ? newEvent : event))
        : [...current, newEvent],
    );
    setMessage(editingId ? "Mengupdate acara..." : "Menyimpan acara...");

    try {
      const response = await fetch("/api/events", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationSlug, id: editingId, ...form }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menyimpan acara");
      }

      if (result.data) {
        setEvents((current) =>
          editingId
            ? current.map((event) => (event.id === editingId ? result.data : event))
            : current.map((event) => (event.id === newEvent.id ? result.data : event)),
        );
      }

      setMessage(
        result.source === "supabase"
          ? editingId
            ? "Acara berhasil diupdate."
            : "Acara tersimpan ke Supabase."
          : "Acara berhasil tersimpan.",
      );
      resetForm();
    } catch (error) {
      setEvents(previous);
      setMessage(error.message || "Perubahan acara dibatalkan.");
    }
  };

  const editEvent = (event) => {
    setEditingId(event.id);
    setForm({
      title: event.title || "",
      eventDate: event.eventDate || event.date || "",
      eventTime: event.eventTime || event.time || "",
      venue: event.venue || "",
      address: event.address || "",
      mapsUrl: event.mapsUrl || "",
    });
    setMessage(`Mode edit acara: ${event.title}`);
  };

  const deleteEvent = async (event) => {
    const previous = events;
    setEvents((current) => current.filter((item) => item.id !== event.id));
    setMessage(`Menghapus ${event.title}...`);

    try {
      const response = await fetch("/api/events", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationSlug, id: event.id }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menghapus acara");
      }

      if (editingId === event.id) {
        resetForm();
      }
      setMessage("Acara berhasil dihapus.");
    } catch (error) {
      setEvents(previous);
      setMessage(error.message || "Hapus acara dibatalkan.");
    }
  };

  const reorderEvent = async (event, direction) => {
    const currentIndex = events.findIndex((item) => item.id === event.id);
    const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= events.length) {
      return;
    }

    const previous = events;
    const nextEvents = [...events];
    const [moved] = nextEvents.splice(currentIndex, 1);
    nextEvents.splice(nextIndex, 0, moved);
    setEvents(nextEvents);
    setMessage("Mengupdate urutan acara...");

    try {
      await persistSortOrder("/api/events", invitationSlug, nextEvents);
      setMessage("Urutan acara berhasil diupdate. Preview publik akan mengikuti urutan baru.");
    } catch (error) {
      setEvents(previous);
      setMessage(error.message || "Urutan acara dibatalkan.");
    }
  };

  return (
    <motion.section
      variants={fadeUp}
      className={panelClass}
    >
      <div className={panelHeaderClass}>
        <p className={panelEyebrowClass}>
          Multiple Events
        </p>
        <h2 className={panelTitleClass}>
          Rangkaian acara
        </h2>
        <p className="mt-1 text-sm font-medium text-[var(--dash-muted)]">
          Perubahan acara langsung berdampak ke section Events dan Countdown.
        </p>
      </div>
      <div className={`${formGridClass} md:grid-cols-2`}>
        <TextInput value={form.title} onChange={(event) => updateForm("title", event.target.value)} placeholder="Judul acara" />
        <TextInput type="date" value={form.eventDate} onChange={(event) => updateForm("eventDate", event.target.value)} />
        <TextInput value={form.eventTime} onChange={(event) => updateForm("eventTime", event.target.value)} placeholder="Jam acara" />
        <TextInput value={form.venue} onChange={(event) => updateForm("venue", event.target.value)} placeholder="Venue" />
        <TextInput value={form.address} onChange={(event) => updateForm("address", event.target.value)} placeholder="Alamat" />
        <TextInput value={form.mapsUrl} onChange={(event) => updateForm("mapsUrl", event.target.value)} placeholder="Google Maps URL" />
        <button
          type="button"
          onClick={saveEvent}
          className={`${primaryButtonClass} md:col-span-2`}
        >
          {editingId ? "Update Acara" : "Tambah Acara"}
        </button>
        {editingId ? (
          <button
            type="button"
            onClick={resetForm}
            className={`${secondaryButtonClass} md:col-span-2`}
          >
            Batal Edit
          </button>
        ) : null}
      </div>
      {message ? <p className="px-5 pt-4 text-sm font-medium text-[var(--dash-muted)]">{message}</p> : null}
      <div className="grid gap-4 p-5 md:grid-cols-2">
        {events.map((event, index) => (
          <article key={`${event.title}-${index}`} className={cardClass}>
            <p className={panelEyebrowClass}>{index + 1}. {event.title}</p>
            <h3 className="mt-2 text-xl font-semibold text-[var(--dash-ink)]">{event.date || event.eventDate}</h3>
            <p className="mt-2 text-sm font-medium text-[var(--dash-muted)]">{event.time || event.eventTime}</p>
            <p className="mt-3 font-semibold text-[var(--dash-ink)]">{event.venue}</p>
            <p className="mt-1 text-sm font-medium text-[var(--dash-muted)]">{event.address}</p>
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={() => reorderEvent(event, "up")} className={secondaryButtonClass}>Up</button>
              <button type="button" onClick={() => reorderEvent(event, "down")} className={secondaryButtonClass}>Down</button>
              <button type="button" onClick={() => editEvent(event)} className={secondaryButtonClass}>Edit</button>
              <button type="button" onClick={() => deleteEvent(event)} className={primaryButtonClass}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </motion.section>
  );
}

function StoryManager({ invitationSlug = "" }) {
  const [stories, setStories] = useState([]);
  const [form, setForm] = useState({
    year: "",
    title: "",
    description: "",
  });
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState("");

  useEffect(() => {
    if (!invitationSlug) {
      setStories([]);
      return undefined;
    }

    let isMounted = true;

    fetch(`/api/stories?invitationSlug=${encodeURIComponent(invitationSlug)}`)
      .then((response) => response.json())
      .then((result) => {
        if (isMounted && Array.isArray(result.data)) {
          setStories(result.data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setStories([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [invitationSlug]);

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setForm({
      year: "",
      title: "",
      description: "",
    });
    setEditingId("");
  };

  const saveStory = async () => {
    const newStory = {
      id: editingId || localId("story"),
      year: form.year,
      title: form.title,
      description: form.description,
      desc: form.description,
    };
    const previous = stories;

    setStories((current) =>
      editingId
        ? current.map((story) => (story.id === editingId ? newStory : story))
        : [...current, newStory],
    );
    setMessage(editingId ? "Mengupdate cerita..." : "Menyimpan cerita...");

    try {
      const response = await fetch("/api/stories", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationSlug, id: editingId, ...form }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menyimpan story");
      }

      if (result.data) {
        setStories((current) =>
          editingId
            ? current.map((story) => (story.id === editingId ? result.data : story))
            : current.map((story) => (story.id === newStory.id ? result.data : story)),
        );
      }

      setMessage(
        result.source === "supabase"
          ? editingId
            ? "Story berhasil diupdate."
            : "Story tersimpan ke Supabase."
          : "Story berhasil tersimpan.",
      );
      resetForm();
    } catch (error) {
      setStories(previous);
      setMessage(error.message || "Perubahan story dibatalkan.");
    }
  };

  const editStory = (story) => {
    setEditingId(story.id);
    setForm({
      year: story.year || "",
      title: story.title || "",
      description: story.description || story.desc || "",
    });
    setMessage(`Mode edit story: ${story.title}`);
  };

  const deleteStory = async (story) => {
    const previous = stories;
    setStories((current) => current.filter((item) => item.id !== story.id));
    setMessage(`Menghapus ${story.title}...`);

    try {
      const response = await fetch("/api/stories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationSlug, id: story.id }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menghapus story");
      }

      if (editingId === story.id) {
        resetForm();
      }
      setMessage("Story berhasil dihapus.");
    } catch (error) {
      setStories(previous);
      setMessage(error.message || "Hapus story dibatalkan.");
    }
  };

  const reorderStory = async (story, direction) => {
    const currentIndex = stories.findIndex((item) => item.id === story.id);
    const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= stories.length) {
      return;
    }

    const previous = stories;
    const nextStories = [...stories];
    const [moved] = nextStories.splice(currentIndex, 1);
    nextStories.splice(nextIndex, 0, moved);
    setStories(nextStories);
    setMessage("Mengupdate urutan story...");

    try {
      await persistSortOrder("/api/stories", invitationSlug, nextStories);
      setMessage("Urutan story berhasil diupdate. Preview publik akan mengikuti urutan baru.");
    } catch (error) {
      setStories(previous);
      setMessage(error.message || "Urutan story dibatalkan.");
    }
  };

  return (
    <motion.section
      variants={fadeUp}
      className={panelClass}
    >
      <div className={panelHeaderClass}>
        <p className={panelEyebrowClass}>
          Cerita Pasangan
        </p>
        <h2 className={panelTitleClass}>
          Cerita pasangan
        </h2>
        <p className="mt-1 text-sm font-medium text-[var(--dash-muted)]">
          Perubahan cerita langsung berdampak ke section Love Story.
        </p>
      </div>
      <div className={`${formGridClass} md:grid-cols-[160px_1fr]`}>
        <TextInput value={form.year} onChange={(event) => updateForm("year", event.target.value)} placeholder="Tahun" />
        <TextInput value={form.title} onChange={(event) => updateForm("title", event.target.value)} placeholder="Judul cerita" />
        <TextAreaInput
          value={form.description}
          onChange={(event) => updateForm("description", event.target.value)}
          rows={4}
          className="md:col-span-2"
        />
        <button
          type="button"
          onClick={saveStory}
          className={`${primaryButtonClass} md:col-span-2`}
        >
          {editingId ? "Update Story" : "Tambah Story"}
        </button>
        {editingId ? (
          <button
            type="button"
            onClick={resetForm}
            className={`${secondaryButtonClass} md:col-span-2`}
          >
            Batal Edit
          </button>
        ) : null}
      </div>
      {message ? <p className="px-5 pt-4 text-sm font-medium text-[var(--dash-muted)]">{message}</p> : null}
      <div className="grid gap-4 p-5 md:grid-cols-3">
        {stories.map((story, index) => (
          <article key={`${story.title}-${index}`} className={cardClass}>
            <p className={panelEyebrowClass}>{index + 1}. {story.year}</p>
            <h3 className="mt-2 text-xl font-semibold text-[var(--dash-ink)]">{story.title}</h3>
            <p className="mt-3 text-sm font-medium leading-6 text-[var(--dash-muted)]">{story.desc || story.description}</p>
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={() => reorderStory(story, "up")} className={secondaryButtonClass}>Up</button>
              <button type="button" onClick={() => reorderStory(story, "down")} className={secondaryButtonClass}>Down</button>
              <button type="button" onClick={() => editStory(story)} className={secondaryButtonClass}>Edit</button>
              <button type="button" onClick={() => deleteStory(story)} className={primaryButtonClass}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </motion.section>
  );
}

function BankAccountManager({ invitationSlug = "" }) {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({
    bank: "",
    accountName: "",
    accountNumber: "",
  });
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState("");

  useEffect(() => {
    if (!invitationSlug) {
      setAccounts([]);
      return undefined;
    }

    let isMounted = true;

    fetch(`/api/bank-accounts?invitationSlug=${encodeURIComponent(invitationSlug)}`)
      .then((response) => response.json())
      .then((result) => {
        if (isMounted && Array.isArray(result.data)) {
          setAccounts(result.data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setAccounts([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [invitationSlug]);

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setForm({
      bank: "",
      accountName: "",
      accountNumber: "",
    });
    setEditingId("");
  };

  const saveAccount = async () => {
    const newAccount = {
      id: editingId || localId("bank"),
      bank: form.bank,
      accountName: form.accountName,
      accountNumber: form.accountNumber,
      name: form.accountName,
      number: form.accountNumber,
    };
    const previous = accounts;

    setAccounts((current) =>
      editingId
        ? current.map((account) => (account.id === editingId ? newAccount : account))
        : [...current, newAccount],
    );
    setMessage(editingId ? "Mengupdate rekening..." : "Menyimpan rekening...");

    try {
      const response = await fetch("/api/bank-accounts", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationSlug, id: editingId, ...form }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menyimpan rekening");
      }

      if (result.data) {
        setAccounts((current) =>
          editingId
            ? current.map((account) => (account.id === editingId ? result.data : account))
            : current.map((account) => (account.id === newAccount.id ? result.data : account)),
        );
      }

      setMessage(
        result.source === "supabase"
          ? editingId
            ? "Rekening berhasil diupdate."
            : "Rekening tersimpan ke Supabase."
          : "Rekening berhasil tersimpan.",
      );
      resetForm();
    } catch (error) {
      setAccounts(previous);
      setMessage(error.message || "Perubahan rekening dibatalkan.");
    }
  };

  const editAccount = (account) => {
    setEditingId(account.id);
    setForm({
      bank: account.bank || "",
      accountName: account.accountName || account.name || "",
      accountNumber: account.accountNumber || account.number || "",
    });
    setMessage(`Mode edit rekening: ${account.bank}`);
  };

  const deleteAccount = async (account) => {
    const previous = accounts;
    setAccounts((current) => current.filter((item) => item.id !== account.id));
    setMessage(`Menghapus rekening ${account.bank}...`);

    try {
      const response = await fetch("/api/bank-accounts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationSlug, id: account.id }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menghapus rekening");
      }

      if (editingId === account.id) {
        resetForm();
      }
      setMessage("Rekening berhasil dihapus.");
    } catch (error) {
      setAccounts(previous);
      setMessage(error.message || "Hapus rekening dibatalkan.");
    }
  };

  return (
    <motion.section
      variants={fadeUp}
      className={panelClass}
    >
      <div className={panelHeaderClass}>
        <p className={panelEyebrowClass}>
          Bank Accounts
        </p>
        <h2 className={panelTitleClass}>
          Amplop digital
        </h2>
        <p className="mt-1 text-sm font-medium text-[var(--dash-muted)]">
          Perubahan rekening langsung berdampak ke widget Amplop.
        </p>
      </div>
      <div className={`${formGridClass} md:grid-cols-[160px_1fr_1fr_auto]`}>
        <TextInput value={form.bank} onChange={(event) => updateForm("bank", event.target.value)} placeholder="Bank" />
        <TextInput value={form.accountName} onChange={(event) => updateForm("accountName", event.target.value)} placeholder="Nama rekening" />
        <TextInput value={form.accountNumber} onChange={(event) => updateForm("accountNumber", event.target.value)} placeholder="Nomor rekening" />
        <button
          type="button"
          onClick={saveAccount}
          className={primaryButtonClass}
        >
          {editingId ? "Update" : "Tambah"}
        </button>
        {editingId ? (
          <button
            type="button"
            onClick={resetForm}
            className={secondaryButtonClass}
          >
            Batal
          </button>
        ) : null}
      </div>
      {message ? <p className="px-5 pt-4 text-sm font-medium text-[var(--dash-muted)]">{message}</p> : null}
      <div className="grid gap-4 p-5 md:grid-cols-2">
        {accounts.map((account, index) => (
          <article key={`${account.bank}-${index}`} className={cardClass}>
            <p className={panelEyebrowClass}>{account.bank}</p>
            <h3 className="mt-2 text-2xl font-semibold text-[var(--dash-ink)]">{account.number}</h3>
            <p className="mt-2 text-sm font-medium text-[var(--dash-muted)]">a.n. {account.name}</p>
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={() => editAccount(account)} className={secondaryButtonClass}>Edit</button>
              <button type="button" onClick={() => deleteAccount(account)} className={primaryButtonClass}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </motion.section>
  );
}

export default function ContentManagers({ invitationSlug = "", section = "all" }) {
  if (!invitationSlug) {
    return (
      <section className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-canvas)] p-5 shadow-[var(--dash-shadow)]">
        <p className={panelEyebrowClass}>Content Panels</p>
        <h2 className="mt-1 text-2xl font-semibold text-[var(--dash-ink)]">
          Pilih order aktif dulu
        </h2>
        <p className="mt-1 text-sm font-medium text-[var(--dash-muted)]">
          Panel events, story, dan rekening hanya berjalan untuk satu invitation yang sedang dibuka.
        </p>
      </section>
    );
  }

  if (section === "events") {
    return <MultiEventManager invitationSlug={invitationSlug} />;
  }

  if (section === "story") {
    return <StoryManager invitationSlug={invitationSlug} />;
  }

  if (section === "gift") {
    return <BankAccountManager invitationSlug={invitationSlug} />;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-canvas)] p-5 shadow-[var(--dash-shadow)]">
        <p className={panelEyebrowClass}>Content Panels</p>
        <h2 className="mt-1 text-2xl font-semibold text-[var(--dash-ink)]">
          Acara, Cerita, dan Amplop Digital
        </h2>
        <p className="mt-1 text-sm font-medium text-[var(--dash-muted)]">
          Semua panel memakai order aktif /u/{invitationSlug}. Preview publik akan berubah setelah data tersimpan.
        </p>
      </section>
      <MultiEventManager invitationSlug={invitationSlug} />
      <StoryManager invitationSlug={invitationSlug} />
      <BankAccountManager invitationSlug={invitationSlug} />
    </div>
  );
}
