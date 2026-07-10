import { NextRequest, NextResponse } from "next/server";
import { SUPPORTED_CODES } from "@/lib/i18n/config";

/** All authorable locale prefixes. Enablement is enforced by the route, not here. */
const LOCALE_PREFIXES = new Set<string>(SUPPORTED_CODES);

/**
 * HTTP Basic Auth guard for the private /dashboard UI and all /api/dashboard/*
 * routes. Set DASHBOARD_BASIC_AUTH=username:password in your env vars.
 *
 * If DASHBOARD_BASIC_AUTH is not set in production, access is blocked entirely
 * (fail-closed). In local dev without the env var, it allows through so you
 * don't need to configure auth to develop locally.
 *
 * Example: DASHBOARD_BASIC_AUTH=admin:my-secret-password
 */

const PROTECTED = ["/dashboard", "/api/dashboard"];

function isProtected(pathname: string): boolean {
  return PROTECTED.some((p) => pathname === p || pathname.startsWith(p + "/") || pathname.startsWith(p + "?"));
}

/**
 * Paths that must never be rewritten into a language segment: the CMS, its
 * API, Next internals, and the crawler-facing files that live at the root.
 */
function isNonLocalized(pathname: string): boolean {
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/dashboard") ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt" ||
    pathname === "/llms.txt" ||
    pathname === "/favicon.ico" ||
    // any request for a file (has an extension)
    /\.[a-zA-Z0-9]+$/.test(pathname)
  );
}

/**
 * Maps a public URL onto the internal `[lang]` route.
 *
 *   /about      -> rewrite to /en/about   (URL stays /about — English is canonical)
 *   /es/about   -> passes through          (already carries its locale)
 *
 * This REWRITES, never redirects. Auto-redirecting on Accept-Language is what
 * hides non-English versions from Googlebot (which crawls as en-US from US
 * IPs); the language suggestion is a dismissible banner instead.
 */
function localeRewrite(req: NextRequest): NextResponse | null {
  const { pathname } = req.nextUrl;
  if (isNonLocalized(pathname)) return null;

  const first = pathname.split("/").filter(Boolean)[0];
  if (first && LOCALE_PREFIXES.has(first)) {
    // Already locale-prefixed. `/en/...` is not a public URL — send it to the
    // canonical unprefixed form so English never has two addresses.
    if (first === "en") {
      const url = req.nextUrl.clone();
      url.pathname = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
      return NextResponse.redirect(url, 308);
    }
    return null;
  }

  const url = req.nextUrl.clone();
  url.pathname = `/en${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!isProtected(pathname)) {
    return localeRewrite(req) ?? NextResponse.next();
  }

  const credentials = process.env.DASHBOARD_BASIC_AUTH;

  if (!credentials) {
    if (process.env.NODE_ENV === "production") {
      // Misconfigured — block access rather than silently expose data
      return new NextResponse("Dashboard access is not configured. Set DASHBOARD_BASIC_AUTH.", {
        status: 503,
        headers: { "Content-Type": "text/plain" },
      });
    }
    // Local dev without env var: allow through
    return NextResponse.next();
  }

  const authHeader = req.headers.get("authorization") ?? "";
  if (authHeader.startsWith("Basic ")) {
    const encoded = authHeader.slice(6);
    const decoded = Buffer.from(encoded, "base64").toString("utf8");
    if (decoded === credentials) {
      return NextResponse.next();
    }
  }

  // Prompt the browser to show the Basic Auth dialog
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Brandivibe Dashboard", charset="UTF-8"',
      "Content-Type": "text/plain",
    },
  });
}

export const config = {
  matcher: [
    // Basic-auth surfaces (kept explicit — the page matcher below skips /api).
    "/api/dashboard/:path*",
    /**
     * Everything else that is a *page*. Deliberately excludes /api and /_next so
     * media and image-optimizer requests never pay for middleware, and skips any
     * path with a file extension.
     */
    "/((?!api|_next|admin|favicon.ico|sitemap.xml|robots.txt|llms.txt|.*\\..*).*)",
  ],
};
