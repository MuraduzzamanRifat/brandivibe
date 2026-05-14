import { defineConfig } from "vitest/config";
import path from "node:path";

/**
 * Vitest config. Targets pure-function contract tests in src/lib/**\/__tests__/.
 * - Node environment (no DOM) — these are server-side, framework-free units.
 * - `@/` alias mirrors tsconfig so imports resolve the same as in app code.
 * - No setup files; tests are self-contained.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/__tests__/**/*.test.ts"],
    exclude: ["node_modules/**", ".next/**", "out/**"],
    reporters: "default",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
