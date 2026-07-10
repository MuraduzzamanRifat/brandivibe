"use client";

import dynamic from "next/dynamic";

// The custom cursor pulls in framer-motion. Loading it via a client-only
// dynamic import keeps it out of the initial/SSR bundle, so routes that don't
// otherwise use framer-motion don't pay for it up front. Behavior is
// unchanged — the cursor mounts a beat after hydration.
const CustomCursor = dynamic(
  () => import("./CustomCursor").then((m) => m.CustomCursor),
  { ssr: false }
);

export function ClientChrome() {
  return <CustomCursor />;
}
