import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js 16 Proxy (formerly Middleware) — protects the AI Sales Brain
 * admin dashboard and its API routes with HTTP Basic auth.
 *
 * Unlocks only when the request Authorization header matches the
 * BRAIN_USER / BRAIN_PASSWORD env vars set in Koyeb. When unset, the
 * entire admin surface is locked (fail closed — never accidentally open).
 *
 * This is light-weight auth sufficient for a solo-operator admin panel.
 * Swap for a real session system (Clerk / NextAuth / Auth.js) when
 * multiple users need access.
 */

export function proxy(request: NextRequest) {
  const user = process.env.BRAIN_USER;
  const password = process.env.BRAIN_PASSWORD;

  // Fail closed — if the env vars aren't configured, the brain is locked.
  if (!user || !password) {
    return unauthorized("Admin surface not configured");
  }

  const header = request.headers.get("authorization") ?? "";
  if (!header.toLowerCase().startsWith("basic ")) {
    return unauthorized();
  }

  const encoded = header.slice(6).trim();
  let decoded: string;
  try {
    decoded = atob(encoded);
  } catch {
    return unauthorized("Malformed credentials");
  }

  const sep = decoded.indexOf(":");
  if (sep === -1) return unauthorized("Malformed credentials");

  const providedUser = decoded.slice(0, sep);
  const providedPass = decoded.slice(sep + 1);

  if (providedUser !== user || providedPass !== password) {
    return unauthorized("Invalid credentials");
  }

  return NextResponse.next();
}

function unauthorized(reason = "Authentication required") {
  return new NextResponse(reason, {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Brandivibe AI Brain", charset="UTF-8"',
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export const config = {
  matcher: ["/ai-brain/:path*", "/api/ai-brain/:path*"],
};
