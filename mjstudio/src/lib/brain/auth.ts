/**
 * Shared cron/webhook authorization. All brain/blast endpoints accept a
 * shared secret via a custom header (default: `x-brain-secret`).
 *
 * If the env var is unset in production (NODE_ENV=production) we DENY the
 * request — an unset secret is a misconfiguration, not dev mode.
 * In local development (NODE_ENV !== production) we allow through so the
 * daily run can be triggered without env vars.
 */
export function authorizedCron(
  req: Request,
  headerName: string = "x-brain-secret",
  envVar: string = "BRAIN_CRON_SECRET"
): boolean {
  const secret = process.env[envVar];
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        `[auth] ${envVar} is not set — denying request. Set it in your environment variables.`
      );
      return false;
    }
    // Local dev: allow through so you can test without configuring secrets
    return true;
  }
  return req.headers.get(headerName) === secret;
}
