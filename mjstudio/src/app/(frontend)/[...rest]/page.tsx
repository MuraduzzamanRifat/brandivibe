import { notFound } from "next/navigation";

// Catch-all for any URL that matches no real route. Without this, unmatched
// top-level paths (and dynamicParams=false misses like /services/<bad-slug>)
// fall through to Next's bare default 404 because the branded not-found.tsx
// lives inside the (frontend) route group. Routing them here renders the
// branded page with the full (frontend) layout. Explicit routes — including
// everything under (payload)/admin — always win over a catch-all.
export default function CatchAllNotFound() {
  notFound();
}
