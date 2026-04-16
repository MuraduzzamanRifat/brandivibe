import { NextRequest, NextResponse } from "next/server";

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

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!isProtected(pathname)) return NextResponse.next();

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
  matcher: ["/dashboard", "/dashboard/:path*", "/api/dashboard/:path*"],
};
