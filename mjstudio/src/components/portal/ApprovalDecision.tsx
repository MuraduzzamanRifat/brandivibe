"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";

/**
 * The approve / request-changes control a client uses on an approval item.
 * PATCHes the approval; field-level access on the collection means only
 * `decision` and `clientComment` are writable by a client, and a hook stamps
 * decidedBy/decidedAt — so this only has to send the two fields.
 */
export function ApprovalDecision({ approvalId }: { approvalId: string }) {
  const router = useRouter();
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState<null | "approved" | "changes">(null);
  const [error, setError] = useState<string | null>(null);

  async function decide(decision: "approved" | "changes") {
    setBusy(decision);
    setError(null);
    try {
      const res = await fetch(`/api/approvals/${approvalId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ decision, clientComment: comment || undefined }),
      });
      if (!res.ok) throw new Error("Couldn't save that. Please try again.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(null);
    }
  }

  return (
    <div className="mt-3">
      <input
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a note (optional)"
        className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus-visible:border-primary-strong"
      />
      <div className="mt-2.5 flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={() => decide("approved")}
          disabled={busy !== null}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-primary-strong px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-deep disabled:opacity-50"
        >
          <Check className="h-4 w-4" /> {busy === "approved" ? "Saving…" : "Approve"}
        </button>
        <button
          type="button"
          onClick={() => decide("changes")}
          disabled={busy !== null}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-border-strong bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-foreground/30 disabled:opacity-50"
        >
          <X className="h-4 w-4" /> {busy === "changes" ? "Saving…" : "Request changes"}
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm text-[#c0392b]">
          {error}
        </p>
      )}
    </div>
  );
}
