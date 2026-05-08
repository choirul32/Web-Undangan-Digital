"use client";

import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const login = async (event) => {
    event.preventDefault();
    setMessage("Memproses login...");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Login gagal");
      }

      window.location.href = "/dashboard";
    } catch (error) {
      setMessage(error.message || "Login gagal");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-6 py-16">
      <section className="w-full max-w-md rounded-[8px] border border-[var(--color-accent-pale)] bg-[var(--color-surface)] p-8 shadow-xl shadow-[var(--color-primary)]/10">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-[var(--color-accent)]">
          Admin Login
        </p>
        <h1 className="mt-3 text-4xl font-black text-[var(--color-primary)]">
          Masuk Dashboard
        </h1>
        <p className="mt-3 text-base font-semibold leading-7 text-[var(--color-text)]">
          Gunakan akun admin Supabase untuk mengelola undangan digital.
        </p>

        <form onSubmit={login} className="mt-8 space-y-5">
          <label className="block">
            <span className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-text)]">
              Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-[var(--color-accent-pale)] bg-white px-4 py-3 text-base font-bold text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-black uppercase tracking-[0.12em] text-[var(--color-text)]">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-[var(--color-accent-pale)] bg-white px-4 py-3 text-base font-bold text-[var(--color-primary)] outline-none focus:border-[var(--color-accent)]"
              required
            />
          </label>
          <button className="w-full rounded-2xl bg-[var(--color-primary)] px-5 py-4 text-base font-black text-white hover:bg-[var(--color-primary-hover)]">
            Login
          </button>
        </form>

        {message ? (
          <p className="mt-5 text-center text-sm font-bold text-[var(--color-text)]">
            {message}
          </p>
        ) : null}
      </section>
    </main>
  );
}
