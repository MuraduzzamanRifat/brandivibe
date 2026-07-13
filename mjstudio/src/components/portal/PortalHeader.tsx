"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

/** Minimal portal chrome — a home link and sign-out. No marketing nav here. */
export function PortalHeader({ name }: { name: string }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/users/logout", { method: "POST", credentials: "include" }).catch(() => {});
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-[rgba(251,246,239,0.85)] backdrop-blur-xl">
      <div className="mx-auto flex h-[60px] max-w-[1000px] items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/portal" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary-strong font-display text-lg font-semibold leading-none text-white">
            b
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">Portal</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-muted sm:inline">{name}</span>
          <button
            type="button"
            onClick={logout}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-foreground/75 transition-colors hover:bg-[rgba(42,35,31,0.05)] hover:text-foreground"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
