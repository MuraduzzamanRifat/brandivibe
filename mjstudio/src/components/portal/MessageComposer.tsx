"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";

/**
 * Client-side composer. Posts to Payload's REST create endpoint for
 * project-messages; the collection's beforeValidate hook stamps the sender and
 * verifies the project belongs to this client, so the client only needs to send
 * the project id and body.
 */
export function MessageComposer({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/project-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ project: projectId, body }),
      });
      if (!res.ok) throw new Error("Message didn't send. Please try again.");
      setBody("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={send} className="mt-4">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        placeholder="Write a message to the team…"
        className="w-full resize-none rounded-2xl border border-border bg-surface px-4 py-3 text-foreground outline-none transition-colors focus-visible:border-primary-strong"
      />
      {error && (
        <p role="alert" className="mt-2 text-sm text-[#c0392b]">
          {error}
        </p>
      )}
      <div className="mt-2 flex justify-end">
        <button
          type="submit"
          disabled={busy || !body.trim()}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-primary-strong px-5 py-2.5 font-medium text-white transition-colors hover:bg-primary-deep disabled:opacity-50"
        >
          {busy ? "Sending…" : "Send"} <Send className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
