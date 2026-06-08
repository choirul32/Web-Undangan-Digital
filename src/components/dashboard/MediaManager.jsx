"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "./config";
import { TextInput, SelectInput } from "./FormControls";

export default function MediaManager({ invitationSlug = "" }) {
  const [mediaItems, setMediaItems] = useState([]);
  const [mediaType, setMediaType] = useState("image");
  const [title, setTitle] = useState("Gallery");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [replaceId, setReplaceId] = useState("");
  const mediaTabs = [
    { id: "cover", label: "Cover" },
    { id: "image", label: "Gallery" },
    { id: "music", label: "Music" },
    { id: "video", label: "Video" },
  ];
  const filteredMediaItems = mediaItems.filter((item) => item.mediaType === mediaType);

  useEffect(() => {
    if (!invitationSlug) {
      setMediaItems([]);
      return undefined;
    }

    let isMounted = true;

    fetch(`/api/media?invitationSlug=${encodeURIComponent(invitationSlug)}`)
      .then((response) => response.json())
      .then((result) => {
        if (isMounted && Array.isArray(result.data)) {
          setMediaItems(result.data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setMediaItems([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [invitationSlug]);

  const uploadMedia = async () => {
    if (!file) {
      setMessage("Pilih file dulu.");
      return;
    }

    const formData = new FormData();
    formData.append("invitationSlug", invitationSlug);
    formData.append("mediaType", mediaType);
    formData.append("title", title);
    if (replaceId) {
      formData.append("replaceId", replaceId);
    }
    formData.append("file", file);

    setMessage(replaceId ? "Mengganti media..." : "Mengupload media...");

    try {
      const response = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload gagal");
      }

      setMediaItems((current) =>
        replaceId
          ? current.map((item) => (item.id === replaceId ? result.data : item))
          : [result.data, ...current],
      );
      setFile(null);
      setReplaceId("");
      setMessage(
        result.source === "supabase"
          ? replaceId
            ? "Media berhasil diganti."
            : "Media berhasil diupload."
          : "Media berhasil diupload.",
      );
    } catch (error) {
      setMessage(error.message || "Upload gagal.");
    }
  };

  const startReplace = (item) => {
    setReplaceId(item.id);
    setMediaType(item.mediaType || "image");
    setTitle(item.title || "Media");
    setMessage(`Mode replace: ${item.title || item.mediaType}`);
  };

  const cancelReplace = () => {
    setReplaceId("");
    setFile(null);
    setMessage("");
  };

  const deleteMedia = async (item) => {
    const previous = mediaItems;
    setMediaItems((current) => current.filter((media) => media.id !== item.id));
    setMessage(`Menghapus ${item.title || item.mediaType}...`);

    try {
      const response = await fetch("/api/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationSlug, id: item.id }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menghapus media");
      }

      if (replaceId === item.id) {
        cancelReplace();
      }
      setMessage("Media berhasil dihapus.");
    } catch (error) {
      setMediaItems(previous);
      setMessage(error.message || "Hapus media dibatalkan.");
    }
  };

  return (
    <motion.section
      variants={fadeUp}
      className="overflow-hidden rounded-[14px] border border-[var(--dash-border)] bg-[var(--dash-canvas)] shadow-[var(--dash-shadow)]"
    >
      {!invitationSlug ? (
        <div className="border-b border-[var(--dash-border)] px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
            Media Manager
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-[var(--dash-ink)]">
            Pilih order aktif dulu
          </h2>
          <p className="mt-1 text-sm font-medium text-[var(--dash-muted)]">
            Panel media hanya berjalan untuk satu invitation yang sedang dibuka.
          </p>
        </div>
      ) : null}
      {!invitationSlug ? null : (
        <>
      <div className="border-b border-[var(--dash-border)] px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
          Media Manager
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-[var(--dash-ink)]">
          Cover, gallery, dan backsound
        </h2>
        <p className="mt-1 text-sm font-medium text-[var(--dash-muted)]">
          Media terikat ke order aktif: /u/{invitationSlug}
        </p>
      </div>

      <div className="border-b border-[var(--dash-border)] px-5 py-4">
        <div className="flex flex-wrap gap-2">
          {mediaTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setMediaType(tab.id);
                setTitle(tab.label);
              }}
              className={`rounded-md border px-3 py-2 text-sm font-semibold transition-colors ${
                mediaType === tab.id
                  ? "border-[var(--dash-ink)] bg-[var(--dash-ink)] text-white"
                  : "border-[var(--dash-border)] bg-white text-[var(--dash-muted)] hover:bg-[var(--dash-fog)] hover:text-[var(--dash-ink)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 border-b border-[var(--dash-border)] p-5 lg:grid-cols-[1fr_1fr_auto_auto]">
        <TextInput
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Judul media"
        />
        <input
          type="file"
          accept={mediaType === "music" ? "audio/*" : mediaType === "video" ? "video/*" : "image/*"}
          onChange={(event) => setFile(event.target.files?.[0] || null)}
          className="rounded-lg border border-[var(--dash-border)] bg-white px-3 py-2.5 text-sm font-medium text-[var(--dash-muted)]"
        />
        <button
          type="button"
          onClick={uploadMedia}
          className="rounded-md bg-[var(--dash-ink)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--dash-dark)]"
        >
          {replaceId ? "Replace" : "Upload"}
        </button>
        {replaceId ? (
          <button
            type="button"
            onClick={cancelReplace}
            className="rounded-md border border-[var(--dash-border)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--dash-ink)] hover:bg-[var(--dash-fog)]"
          >
            Batal
          </button>
        ) : null}
      </div>

      {message ? (
        <p className="px-5 pt-4 text-sm font-medium text-[var(--dash-muted)]">{message}</p>
      ) : null}

      <div className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
        {filteredMediaItems.map((item) => (
          <article
            key={item.id || item.url}
            className="overflow-hidden rounded-[14px] border border-[var(--dash-border)] bg-white"
          >
            {item.mediaType === "music" ? (
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
                  Music
                </p>
                <p className="mt-2 text-lg font-semibold text-[var(--dash-ink)]">
                  {item.title}
                </p>
                <audio controls className="mt-4 w-full">
                  <source src={item.url} />
                </audio>
                <div className="mt-4 flex gap-2">
                  <button type="button" onClick={() => startReplace(item)} className="rounded-md border border-[var(--dash-border)] px-3 py-2 text-sm font-semibold text-[var(--dash-ink)]">Replace</button>
                  <button type="button" onClick={() => deleteMedia(item)} className="rounded-md bg-[var(--dash-ink)] px-3 py-2 text-sm font-semibold text-white">Delete</button>
                </div>
              </div>
            ) : (
              <>
                <img
                  src={item.url}
                  alt={item.title || "Media undangan"}
                  className="aspect-[4/3] w-full bg-[var(--dash-fog)] object-cover"
                />
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--dash-muted)]">
                    {item.mediaType}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[var(--dash-ink)]">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs font-medium text-[var(--dash-muted)]">
                    Dipakai sebagai: {item.mediaType === "image" ? "Gallery item" : item.mediaType}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button type="button" onClick={() => startReplace(item)} className="rounded-md border border-[var(--dash-border)] px-3 py-2 text-sm font-semibold text-[var(--dash-ink)]">Replace</button>
                    <button type="button" onClick={() => deleteMedia(item)} className="rounded-md bg-[var(--dash-ink)] px-3 py-2 text-sm font-semibold text-white">Delete</button>
                  </div>
                </div>
              </>
            )}
          </article>
        ))}
        {filteredMediaItems.length === 0 ? (
          <div className="rounded-[14px] border border-dashed border-[var(--dash-border)] bg-[var(--dash-fog)]/45 p-5 text-sm font-medium text-[var(--dash-muted)]">
            Belum ada media untuk tab ini.
          </div>
        ) : null}
      </div>
        </>
      )}
    </motion.section>
  );
}
