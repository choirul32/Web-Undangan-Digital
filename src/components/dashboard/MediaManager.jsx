"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeUp } from "./config";
import { TextInput, SelectInput } from "./FormControls";

export default function MediaManager() {
  const [mediaItems, setMediaItems] = useState([]);
  const [mediaType, setMediaType] = useState("image");
  const [title, setTitle] = useState("Gallery");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    fetch("/api/media?invitationSlug=dimas-salsa")
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
  }, []);

  const uploadMedia = async () => {
    if (!file) {
      setMessage("Pilih file dulu.");
      return;
    }

    const formData = new FormData();
    formData.append("invitationSlug", "dimas-salsa");
    formData.append("mediaType", mediaType);
    formData.append("title", title);
    formData.append("file", file);

    setMessage("Mengupload media...");

    try {
      const response = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload gagal");
      }

      setMediaItems((current) => [result.data, ...current]);
      setFile(null);
      setMessage(
        result.source === "supabase"
          ? "Media berhasil diupload."
          : "Media dummy ditambahkan. Supabase belum dikonfigurasi.",
      );
    } catch (error) {
      setMessage(error.message || "Upload gagal.");
    }
  };

  return (
    <motion.section
      variants={fadeUp}
      className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] shadow-xl shadow-[var(--color-primary)]/8"
    >
      <div className="border-b border-[var(--color-accent-pale)] px-6 py-5">
        <p className="text-sm font-black uppercase tracking-[0.14em] text-[var(--color-accent)]">
          Media Manager
        </p>
        <h2 className="mt-2 text-2xl font-black text-[var(--color-primary)]">
          Cover, gallery, dan backsound
        </h2>
        <p className="mt-1 text-base font-semibold text-[var(--color-text)]">
          Upload media ke Supabase Storage bucket invitation-media.
        </p>
      </div>

      <div className="grid gap-4 border-b border-[var(--color-accent-pale)] p-6 lg:grid-cols-[160px_1fr_1fr_auto]">
        <SelectInput value={mediaType} onChange={(event) => setMediaType(event.target.value)}>
          <option value="cover">Cover</option>
          <option value="image">Gallery</option>
          <option value="music">Music</option>
          <option value="video">Video</option>
        </SelectInput>
        <TextInput
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Judul media"
        />
        <input
          type="file"
          accept={mediaType === "music" ? "audio/*" : mediaType === "video" ? "video/*" : "image/*"}
          onChange={(event) => setFile(event.target.files?.[0] || null)}
          className="rounded-2xl border border-[var(--color-accent-pale)] bg-white px-4 py-3 text-sm font-bold text-[var(--color-text)]"
        />
        <button
          type="button"
          onClick={uploadMedia}
          className="rounded-2xl bg-[var(--color-accent)] px-5 py-3 text-base font-black text-[var(--color-primary)] hover:bg-[var(--color-accent-soft)]"
        >
          Upload
        </button>
      </div>

      {message ? (
        <p className="px-6 pt-5 text-sm font-bold text-[var(--color-text)]">{message}</p>
      ) : null}

      <div className="grid gap-5 p-6 sm:grid-cols-2 xl:grid-cols-3">
        {mediaItems.map((item) => (
          <article
            key={item.id || item.url}
            className="overflow-hidden rounded-[8px] border border-[var(--color-accent-pale)] bg-white shadow-lg shadow-[var(--color-primary)]/8"
          >
            {item.mediaType === "music" ? (
              <div className="p-5">
                <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent)]">
                  Music
                </p>
                <p className="mt-2 text-lg font-black text-[var(--color-primary)]">
                  {item.title}
                </p>
                <audio controls className="mt-4 w-full">
                  <source src={item.url} />
                </audio>
              </div>
            ) : (
              <>
                <img
                  src={item.url}
                  alt={item.title || "Media undangan"}
                  className="aspect-[4/3] w-full bg-[var(--color-bg)] object-cover"
                />
                <div className="p-5">
                  <p className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-accent)]">
                    {item.mediaType}
                  </p>
                  <p className="mt-2 text-lg font-black text-[var(--color-primary)]">
                    {item.title}
                  </p>
                </div>
              </>
            )}
          </article>
        ))}
      </div>
    </motion.section>
  );
}
