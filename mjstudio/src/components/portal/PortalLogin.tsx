"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Client portal login. Posts to Payload's own /api/users/login, which sets the
 * httpOnly session cookie — the same session the whole platform reads. On
 * success we refresh so the server component re-renders as the signed-in view.
 */
export function PortalLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Those details didn't match. Try again, or ask us to resend your invite.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  const field =
    "w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground outline-none transition-colors focus-visible:border-primary-strong";

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-[440px] place-items-center px-5">
      <div className="w-full">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-strong font-display text-lg font-semibold leading-none text-white">
            b
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">Brandivibe</span>
        </div>
        <h1 className="mt-8 font-display text-3xl font-semibold tracking-tight">Your project portal</h1>
        <p className="mt-3 text-foreground/70 leading-relaxed">
          Sign in to see your progress, files, invoices and messages — all in one place.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="p-email" className="mb-1.5 block text-sm font-medium text-foreground/80">
              Email
            </label>
            <input
              id="p-email"
              type="email"
              required
              autoComplete="email"
              className={field}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="p-pass" className="mb-1.5 block text-sm font-medium text-foreground/80">
              Password
            </label>
            <input
              id="p-pass"
              type="password"
              required
              autoComplete="current-password"
              className={field}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <p role="alert" className="text-sm text-[#c0392b]">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="min-h-[44px] w-full rounded-full bg-primary-strong px-6 py-3 font-medium text-white transition-colors hover:bg-primary-deep disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-sm text-muted">
          No account yet? Your studio contact sets one up for you — just ask.
        </p>
      </div>
    </div>
  );
}
