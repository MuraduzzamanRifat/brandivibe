/**
 * Shared cron/webhook authorization. All brain/blast endpoints accept a
 * shared secret via a custom header (default: `x-brain-secret`). If the env
 * var is unset we treat the process as dev mode and allow through — this is
 * the same policy the existing routes had, now standardized in one place.
 */
export function authorizedCron(
  req: Request,
  headerName: string = "x-brain-secret",
  envVar: string = "BRAIN_CRON_SECRET"
): boolean {
  const secret = process.env[envVar];
  if (!secret) return true;
  return req.headers.get(headerName) === secret;
}
