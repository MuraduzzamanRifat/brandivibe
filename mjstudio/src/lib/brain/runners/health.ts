import { runHealthCheck as runHealthCheckCore, type HealthReport } from "@/lib/brain/health-check";

/**
 * Runner for the brain health check — extracted from
 * `src/app/api/brain/health/route.ts` (POST) so it can run under `tsx`
 * inside GitHub Actions without any `next/*` imports.
 *
 * Returns the same `HealthReport` the route returned in its `report` field.
 * The route also derived `ok` from `report.healthy`; the dispatcher / route
 * recompute that, so this runner just returns the raw report.
 */
export async function runHealthCheck(): Promise<HealthReport> {
  return runHealthCheckCore();
}
