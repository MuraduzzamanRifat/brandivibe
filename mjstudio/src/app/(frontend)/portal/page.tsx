import type { Metadata } from "next";
import Link from "next/link";
import { getPortalUser } from "@/lib/portal/auth";
import { getMyProjects } from "@/lib/portal/data";
import { PortalLogin } from "@/components/portal/PortalLogin";
import { PortalHeader } from "@/components/portal/PortalHeader";
import { ProgressRing } from "@/components/portal/ProgressRing";

export const metadata: Metadata = {
  title: "Client Portal · Brandivibe",
  description: "Track your project — progress, milestones, files, invoices and messages.",
  robots: { index: false, follow: false }, // a private area is never indexed
};

// Always server-rendered against the current session.
export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  discovery: "Discovery",
  design: "Design",
  development: "In development",
  review: "In review",
  launched: "Launched",
  "on-hold": "On hold",
  complete: "Complete",
};

export default async function PortalHome() {
  const user = await getPortalUser();

  // Not signed in — show the login. (Staff can sign in here too and will see
  // every project via their own permissions.)
  if (!user) return <PortalLogin />;

  const projects = await getMyProjects({ id: user.id });

  return (
    <>
      <PortalHeader name={user.name} />
      <main className="mx-auto max-w-[1000px] px-5 pb-24 pt-10 sm:px-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
          {greeting()}, {user.name.split(" ")[0] || "there"}.
        </h1>
        <p className="mt-2 text-foreground/70">
          {projects.length === 0
            ? "No projects here yet. As soon as we kick one off, it'll show up here."
            : `You have ${projects.length} project${projects.length === 1 ? "" : "s"} with us.`}
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {projects.map((p) => {
            const percent = p.completionPercent || p.derivedPercent;
            return (
              <Link
                key={p.id}
                href={`/portal/${p.id}`}
                className="card-soft lift flex items-center gap-5 p-6"
              >
                <ProgressRing percent={percent} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-xl font-semibold tracking-tight">
                    {p.name}
                  </span>
                  <span className="mt-1 block text-sm text-muted">
                    {STATUS_LABEL[p.status] ?? p.status}
                    {p.targetDate ? ` · target ${formatDate(p.targetDate)}` : ""}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "";
  }
}
