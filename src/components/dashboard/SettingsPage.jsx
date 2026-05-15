"use client";

import React from "react";
import { motion } from "framer-motion";
import { fadeUp } from "./config";
import { Field, TextInput, SelectInput } from "./FormControls";

export default function SettingsPage() {
  return (
    <motion.section
      variants={fadeUp}
      className="rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] p-6 shadow-xl shadow-[var(--color-primary)]/8"
    >
      <h2 className="text-2xl font-black text-[var(--color-primary)]">Pengaturan</h2>
      <p className="mt-2 text-base font-semibold leading-7 text-[var(--color-text)]">
        Area ini nanti dipakai untuk profil bisnis, nomor WhatsApp, default package, pengaturan domain,
        dan role admin.
      </p>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Field label="Nama Brand">
          <TextInput defaultValue="NusaInvite" />
        </Field>
        <Field label="Nomor WhatsApp">
          <TextInput defaultValue="6282226551246" />
        </Field>
        <Field label="Domain Utama">
          <TextInput placeholder="nustainvite.com" />
        </Field>
        <Field label="Default Package">
          <SelectInput defaultValue="Premium">
            <option>Basic</option>
            <option>Premium</option>
            <option>Exclusive</option>
          </SelectInput>
        </Field>
      </div>
    </motion.section>
  );
}
