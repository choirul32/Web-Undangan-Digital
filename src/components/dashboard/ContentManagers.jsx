"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { fadeUp } from "./config";
import ConfirmDialog from "./ConfirmDialog";
import {
  DashboardButton,
  DateInput,
  EventTimeInput,
  SelectInput,
  TextInput,
  TextAreaInput,
} from "./FormControls";
import {
  formatEventDate,
  formatEventTime,
} from "../../templates/components/EventWidget";
import { prepareImageForUpload } from "../../lib/imageUpload";

const MapLocationPicker = dynamic(() => import("./MapLocationPicker"), {
  ssr: false,
});

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

function isBlank(value) {
  return !String(value || "").trim();
}

function InlineValidationErrors({ errors = [], warnings = [] }) {
  if (!errors.length && !warnings.length) {
    return null;
  }

  return (
    <div className="rounded-[14px] border border-amber-200 bg-amber-50 px-4 py-3 md:col-span-2">
      {errors.length ? (
        <div>
          <p className="text-sm font-semibold text-amber-900">
            Lengkapi data berikut:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm font-medium text-amber-800">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {warnings.length ? (
        <div className={errors.length ? "mt-3" : ""}>
          <p className="text-sm font-semibold text-amber-900">
            Catatan:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm font-medium text-amber-800">
            {warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

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
  const [validationErrors, setValidationErrors] = useState([]);
  const [validationWarnings, setValidationWarnings] = useState([]);
  const [editingId, setEditingId] = useState("");
  const [isMapPickerOpen, setIsMapPickerOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

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
    setValidationErrors([]);
    setValidationWarnings([]);
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
    setValidationErrors([]);
    setValidationWarnings([]);
  };

  const saveEvent = async () => {
    const errors = [];
    const warnings = [];

    if (isBlank(form.title)) {
      errors.push("Judul acara wajib diisi.");
    }
    if (isBlank(form.eventDate)) {
      errors.push("Tanggal acara wajib dipilih.");
    }
    if (isBlank(form.eventTime)) {
      errors.push("Jam acara wajib dipilih.");
    }
    if (isBlank(form.venue)) {
      errors.push("Venue acara wajib diisi.");
    }
    if (isBlank(form.mapsUrl)) {
      warnings.push("Lokasi Google Maps belum dipilih. Pratinjau tetap bisa tampil, tapi tombol maps belum optimal.");
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      setValidationWarnings(warnings);
      setMessage("Lengkapi data acara sebelum menyimpan.");
      return;
    }

    setValidationErrors([]);
    setValidationWarnings(warnings);

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
      setMessage("Urutan acara berhasil diperbarui. Pratinjau publik akan mengikuti urutan baru.");
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
        <DateInput
          value={form.eventDate}
          onChange={(event) => updateForm("eventDate", event.target.value)}
          placeholder="Pilih tanggal acara"
        />
        <EventTimeInput
          value={form.eventTime}
          onChange={(value) => updateForm("eventTime", value)}
          className="md:col-span-2"
        />
        <TextInput value={form.venue} onChange={(event) => updateForm("venue", event.target.value)} placeholder="Venue" />
        <TextInput value={form.address} onChange={(event) => updateForm("address", event.target.value)} placeholder="Alamat" />
        <InlineValidationErrors
          errors={validationErrors}
          warnings={validationWarnings}
        />
        <div className="flex min-h-[46px] items-center gap-3 rounded-xl border border-[var(--dash-border)] bg-white px-3 py-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--dash-muted)]">
              Lokasi Google Maps
            </p>
            <p className="truncate text-sm font-semibold text-[var(--dash-ink)]">
              {form.mapsUrl ? "Titik lokasi sudah dipilih" : "Belum ada lokasi dipilih"}
            </p>
          </div>
          <DashboardButton
            type="button"
            onClick={() => setIsMapPickerOpen(true)}
            variant="secondary"
            size="sm"
          >
            {form.mapsUrl ? "Ubah Lokasi" : "Pilih dari Peta"}
          </DashboardButton>
        </div>
        <DashboardButton
          type="button"
          onClick={saveEvent}
          className="md:col-span-2"
        >
          {editingId ? "Perbarui Acara" : "Tambah Acara"}
        </DashboardButton>
        {editingId ? (
          <DashboardButton
            type="button"
            onClick={resetForm}
            variant="secondary"
            className="md:col-span-2"
          >
            Batal Edit
          </DashboardButton>
        ) : null}
      </div>
      {message ? <p className="px-5 pt-4 text-sm font-medium text-[var(--dash-muted)]">{message}</p> : null}
      <div className="grid gap-4 p-5 md:grid-cols-2">
        {events.map((event, index) => (
          <article key={`${event.title}-${index}`} className={cardClass}>
            <p className={panelEyebrowClass}>{index + 1}. {event.title}</p>
            <h3 className="mt-2 text-xl font-semibold text-[var(--dash-ink)]">
              {formatEventDate(event.date || event.eventDate)}
            </h3>
            <p className="mt-2 text-sm font-medium text-[var(--dash-muted)]">
              {formatEventTime(event.time || event.eventTime)}
            </p>
            <p className="mt-3 font-semibold text-[var(--dash-ink)]">{event.venue}</p>
            <p className="mt-1 text-sm font-medium text-[var(--dash-muted)]">{event.address}</p>
            <div className="mt-4 flex gap-2">
              <DashboardButton type="button" size="sm" variant="secondary" onClick={() => reorderEvent(event, "up")}>Up</DashboardButton>
              <DashboardButton type="button" size="sm" variant="secondary" onClick={() => reorderEvent(event, "down")}>Down</DashboardButton>
              <DashboardButton type="button" size="sm" variant="secondary" onClick={() => editEvent(event)}>Edit</DashboardButton>
              <DashboardButton type="button" size="sm" variant="danger" onClick={() => setConfirmDelete(event)}>Delete</DashboardButton>
            </div>
          </article>
        ))}
      </div>
      <MapLocationPicker
        open={isMapPickerOpen}
        initialAddress={form.address}
        initialUrl={form.mapsUrl}
        onClose={() => setIsMapPickerOpen(false)}
        onSelect={({ address, mapsUrl }) => {
          setForm((current) => ({
            ...current,
            address,
            mapsUrl,
          }));
          setMessage("Lokasi acara dipilih. Klik Tambah Acara untuk menyimpan.");
        }}
      />

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        title="Hapus Acara?"
        message={`Acara "${confirmDelete?.title}" akan dihapus. Tindakan ini tidak bisa dibatalkan.`}
        confirmLabel="Ya, Hapus"
        onConfirm={() => { deleteEvent(confirmDelete); setConfirmDelete(null); }}
        onCancel={() => setConfirmDelete(null)}
      />
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
  const [validationErrors, setValidationErrors] = useState([]);
  const [editingId, setEditingId] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

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
    setValidationErrors([]);
  };

  const resetForm = () => {
    setForm({
      year: "",
      title: "",
      description: "",
    });
    setEditingId("");
    setValidationErrors([]);
  };

  const saveStory = async () => {
    const errors = [];

    if (isBlank(form.title)) {
      errors.push("Judul cerita wajib diisi.");
    }
    if (isBlank(form.description)) {
      errors.push("Deskripsi cerita wajib diisi.");
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      setMessage("Lengkapi data cerita sebelum menyimpan.");
      return;
    }

    setValidationErrors([]);

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
      setMessage("Urutan cerita berhasil diperbarui. Pratinjau publik akan mengikuti urutan baru.");
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
        <InlineValidationErrors errors={validationErrors} />
        <DashboardButton
          type="button"
          onClick={saveStory}
          className="md:col-span-2"
        >
          {editingId ? "Perbarui Cerita" : "Tambah Cerita"}
        </DashboardButton>
        {editingId ? (
          <DashboardButton
            type="button"
            onClick={resetForm}
            variant="secondary"
            className="md:col-span-2"
          >
            Batal Edit
          </DashboardButton>
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
              <DashboardButton type="button" size="sm" variant="secondary" onClick={() => reorderStory(story, "up")}>Up</DashboardButton>
              <DashboardButton type="button" size="sm" variant="secondary" onClick={() => reorderStory(story, "down")}>Down</DashboardButton>
              <DashboardButton type="button" size="sm" variant="secondary" onClick={() => editStory(story)}>Edit</DashboardButton>
              <DashboardButton type="button" size="sm" variant="danger" onClick={() => setConfirmDelete(story)}>Delete</DashboardButton>
            </div>
          </article>
        ))}
      </div>

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        title="Hapus Cerita?"
        message={`Cerita "${confirmDelete?.title}" akan dihapus. Tindakan ini tidak bisa dibatalkan.`}
        confirmLabel="Ya, Hapus"
        onConfirm={() => { deleteStory(confirmDelete); setConfirmDelete(null); }}
        onCancel={() => setConfirmDelete(null)}
      />
    </motion.section>
  );
}

function BankAccountManager({ invitationSlug = "" }) {
  const [accounts, setAccounts] = useState([]);
  const [bankOptions, setBankOptions] = useState([]);
  const [qrisItem, setQrisItem] = useState(null);
  const [qrisFile, setQrisFile] = useState(null);
  const [qrisMessage, setQrisMessage] = useState("");
  const [qrisInputKey, setQrisInputKey] = useState(0);
  const [form, setForm] = useState({
    bank: "",
    logoUrl: "",
    accountName: "",
    accountNumber: "",
  });
  const [message, setMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  const [validationWarnings, setValidationWarnings] = useState([]);
  const [editingId, setEditingId] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmDeleteQris, setConfirmDeleteQris] = useState(false);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/banks")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || "Gagal memuat pilihan bank.");
        }
        return result;
      })
      .then((result) => {
        if (isMounted) {
          setBankOptions(Array.isArray(result.data) ? result.data : []);
        }
      })
      .catch((error) => {
        if (isMounted) {
          setMessage(error.message);
          setBankOptions([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!invitationSlug) {
      setAccounts([]);
      setQrisItem(null);
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

    fetch(`/api/media?invitationSlug=${encodeURIComponent(invitationSlug)}`)
      .then((response) => response.json())
      .then((result) => {
        if (isMounted && Array.isArray(result.data)) {
          setQrisItem(result.data.find((item) => item.mediaType === "qris") || null);
        }
      })
      .catch(() => {
        if (isMounted) {
          setQrisItem(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [invitationSlug]);

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setValidationErrors([]);
    setValidationWarnings([]);
  };

  const resetForm = () => {
    setForm({
      bank: "",
      logoUrl: "",
      accountName: "",
      accountNumber: "",
    });
    setEditingId("");
    setValidationErrors([]);
    setValidationWarnings([]);
  };

  const saveAccount = async () => {
    const errors = [];
    const warnings = [];

    if (isBlank(form.bank)) {
      errors.push("Bank wajib dipilih.");
    }
    if (isBlank(form.accountName)) {
      errors.push("Nama rekening wajib diisi.");
    }
    if (isBlank(form.accountNumber)) {
      errors.push("Nomor rekening wajib diisi.");
    }
    if (form.bank && !form.logoUrl) {
      warnings.push("Bank ini belum punya logo. Pratinjau tetap tampil dengan nama bank saja.");
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      setValidationWarnings(warnings);
      setMessage("Lengkapi data rekening sebelum menyimpan.");
      return;
    }

    setValidationErrors([]);
    setValidationWarnings(warnings);

    const newAccount = {
      id: editingId || localId("bank"),
      bank: form.bank,
      logoUrl: form.logoUrl,
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
      logoUrl: account.logoUrl || "",
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

  const uploadQris = async () => {
    if (!qrisFile) {
      setQrisMessage("Pilih gambar QRIS dulu.");
      return;
    }

    try {
      setQrisMessage("Mengoptimalkan QRIS...");
      const prepared = await prepareImageForUpload(qrisFile, "qris");

      const formData = new FormData();
      formData.append("invitationSlug", invitationSlug);
      formData.append("mediaType", "qris");
      formData.append("title", "QRIS Amplop Digital");
      if (qrisItem?.id) {
        formData.append("replaceId", qrisItem.id);
      }
      formData.append("file", prepared.file);

      setQrisMessage(prepared.message || (qrisItem ? "Mengganti QRIS..." : "Mengupload QRIS..."));

      const response = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload QRIS gagal");
      }

      setQrisItem(result.data || null);
      setQrisFile(null);
      setQrisInputKey((current) => current + 1);
      setQrisMessage(
        result.source === "supabase"
          ? "QRIS berhasil tersimpan dan akan tampil di section Amplop Digital."
          : "QRIS berhasil tersimpan.",
      );
    } catch (error) {
      setQrisMessage(error.message || "Upload QRIS gagal.");
    }
  };

  const deleteQris = async () => {
    if (!qrisItem?.id) {
      setConfirmDeleteQris(false);
      return;
    }

    const previous = qrisItem;
    setQrisItem(null);
    setQrisMessage("Menghapus QRIS...");

    try {
      const response = await fetch("/api/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationSlug, id: previous.id }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menghapus QRIS");
      }

      setQrisFile(null);
      setQrisInputKey((current) => current + 1);
      setQrisMessage("QRIS berhasil dihapus dari Amplop Digital.");
    } catch (error) {
      setQrisItem(previous);
      setQrisMessage(error.message || "Hapus QRIS dibatalkan.");
    } finally {
      setConfirmDeleteQris(false);
    }
  };

  return (
    <motion.section
      variants={fadeUp}
      className={panelClass}
    >
      <div className={panelHeaderClass}>
        <p className={panelEyebrowClass}>
          Rekening Bank
        </p>
        <h2 className={panelTitleClass}>
          Amplop digital
        </h2>
        <p className="mt-1 text-sm font-medium text-[var(--dash-muted)]">
          Upload QRIS dan rekening di sini. Perubahan langsung berdampak ke widget Amplop.
        </p>
      </div>
      <div className="grid gap-5 border-b border-[var(--dash-border)] p-5 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="overflow-hidden rounded-[14px] border border-[var(--dash-border)] bg-white">
          {qrisItem?.url ? (
            <img
              src={qrisItem.url}
              alt="QRIS Amplop Digital"
              className="aspect-square w-full bg-[var(--dash-fog)] object-contain p-4"
            />
          ) : (
            <div className="flex aspect-square w-full items-center justify-center bg-[var(--dash-fog)] p-6 text-center">
              <p className="text-sm font-semibold leading-6 text-[var(--dash-muted)]">
                Belum ada QRIS. Upload gambar QRIS agar tamu bisa scan langsung di undangan.
              </p>
            </div>
          )}
        </div>
        <div className="flex min-w-0 flex-col justify-center">
          <p className={panelEyebrowClass}>QRIS</p>
          <h3 className="mt-1 text-xl font-semibold text-[var(--dash-ink)]">
            QRIS Amplop Digital
          </h3>
          <p className="mt-2 text-sm font-medium leading-6 text-[var(--dash-muted)]">
            Gunakan screenshot atau file ekspor QRIS dari bank/e-wallet. Satu QRIS per undangan; upload baru otomatis mengganti QRIS lama.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
            <input
              key={qrisInputKey}
              type="file"
              accept="image/*"
              onChange={(event) => {
                setQrisFile(event.target.files?.[0] || null);
                setQrisMessage("");
              }}
              className="rounded-lg border border-[var(--dash-border)] bg-white px-3 py-2.5 text-sm font-medium text-[var(--dash-muted)]"
            />
            <DashboardButton type="button" onClick={uploadQris}>
              {qrisItem ? "Ganti QRIS" : "Upload QRIS"}
            </DashboardButton>
            {qrisItem ? (
              <DashboardButton
                type="button"
                variant="danger"
                onClick={() => setConfirmDeleteQris(true)}
              >
                Hapus
              </DashboardButton>
            ) : null}
          </div>
          {qrisMessage ? (
            <p className="mt-3 text-sm font-medium text-[var(--dash-muted)]">
              {qrisMessage}
            </p>
          ) : null}
        </div>
      </div>
      <div className={`${formGridClass} md:grid-cols-[220px_1fr_1fr_auto]`}>
        <div className="space-y-2">
          <SelectInput
            value={form.bank}
            onChange={(event) => {
              const selectedBank = bankOptions.find(
                (bank) => bank.name === event.target.value,
              );
              setForm((current) => ({
                ...current,
                bank: selectedBank?.name || "",
                logoUrl: selectedBank?.logoUrl || "",
              }));
              setValidationErrors([]);
              setValidationWarnings([]);
            }}
          >
            <option value="">Pilih bank</option>
            {bankOptions.map((bank) => (
              <option key={bank.id} value={bank.name}>
                {bank.name}
              </option>
            ))}
            {form.bank && !bankOptions.some((bank) => bank.name === form.bank) ? (
              <option value={form.bank}>{form.bank}</option>
            ) : null}
          </SelectInput>
          {form.bank ? (
            <div className="flex min-h-12 items-center gap-3 rounded-lg border border-[var(--dash-border)] bg-white px-3 py-2">
              {form.logoUrl ? (
                <img
                  src={form.logoUrl}
                  alt={`Logo ${form.bank}`}
                  className="h-8 w-16 object-contain"
                />
              ) : null}
              <span className="text-sm font-semibold text-[var(--dash-ink)]">
                {form.bank}
              </span>
            </div>
          ) : null}
        </div>
        <TextInput value={form.accountName} onChange={(event) => updateForm("accountName", event.target.value)} placeholder="Nama rekening" />
        <TextInput value={form.accountNumber} onChange={(event) => updateForm("accountNumber", event.target.value)} placeholder="Nomor rekening" />
        <InlineValidationErrors
          errors={validationErrors}
          warnings={validationWarnings}
        />
        <DashboardButton
          type="button"
          onClick={saveAccount}
        >
          {editingId ? "Perbarui" : "Tambah"}
        </DashboardButton>
        {editingId ? (
          <DashboardButton
            type="button"
            onClick={resetForm}
            variant="secondary"
          >
            Batal
          </DashboardButton>
        ) : null}
      </div>
      {message ? <p className="px-5 pt-4 text-sm font-medium text-[var(--dash-muted)]">{message}</p> : null}
      <div className="grid gap-4 p-5 md:grid-cols-2">
        {accounts.map((account, index) => (
          <article key={`${account.bank}-${index}`} className={cardClass}>
            <div className="flex min-h-10 items-center justify-between gap-4">
              <p className={panelEyebrowClass}>{account.bank}</p>
              {account.logoUrl ? (
                <img
                  src={account.logoUrl}
                  alt={`Logo ${account.bank}`}
                  className="h-9 w-20 object-contain object-right"
                />
              ) : null}
            </div>
            <h3 className="mt-2 text-2xl font-semibold text-[var(--dash-ink)]">{account.number}</h3>
            <p className="mt-2 text-sm font-medium text-[var(--dash-muted)]">a.n. {account.name}</p>
            <div className="mt-4 flex gap-2">
              <DashboardButton type="button" size="sm" variant="secondary" onClick={() => editAccount(account)}>Edit</DashboardButton>
              <DashboardButton type="button" size="sm" variant="danger" onClick={() => setConfirmDelete(account)}>Delete</DashboardButton>
            </div>
          </article>
        ))}
      </div>

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        title="Hapus Rekening?"
        message={`Rekening ${confirmDelete?.bank} a.n. ${confirmDelete?.name || confirmDelete?.accountName} akan dihapus.`}
        confirmLabel="Ya, Hapus"
        onConfirm={() => { deleteAccount(confirmDelete); setConfirmDelete(null); }}
        onCancel={() => setConfirmDelete(null)}
      />
      <ConfirmDialog
        open={confirmDeleteQris}
        title="Hapus QRIS?"
        message="QRIS akan dihapus dari Amplop Digital. Tamu tidak lagi melihat opsi scan QRIS."
        confirmLabel="Ya, Hapus"
        onConfirm={deleteQris}
        onCancel={() => setConfirmDeleteQris(false)}
      />
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
          Semua panel memakai order aktif /{invitationSlug}. Pratinjau publik akan berubah setelah data tersimpan.
        </p>
      </section>
      <MultiEventManager invitationSlug={invitationSlug} />
      <StoryManager invitationSlug={invitationSlug} />
      <BankAccountManager invitationSlug={invitationSlug} />
    </div>
  );
}
