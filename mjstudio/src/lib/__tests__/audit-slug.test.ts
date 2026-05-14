import { describe, it, expect } from "vitest";
import { makeAuditSlug } from "@/lib/brain-storage";

/**
 * Contract tests for makeAuditSlug. Every prospect gets a stable URL slug
 * for their personalized /audit/[slug] landing page — the same slug appears
 * in cold-email CTAs that may already be in someone's inbox. The rules:
 *
 *   1. Normalize: lowercase, strip non-[a-z0-9 -], collapse whitespace to
 *      single hyphen, slice to 60 chars.
 *   2. Idempotent: identical input + empty existing set → identical output.
 *   3. Collision-safe: when the base slug is already taken, suffix -2, -3, …
 *      Up to -99 are tried before falling back to a random tail.
 *   4. Safe fallback: empty or punctuation-only input never produces an
 *      empty slug — always returns a "co-xxxxxx" placeholder.
 *
 * A regression here = wrong audit shown to the wrong prospect (collision)
 * or a 404 from a cold-email link (empty slug). Both are real money losses.
 */

describe("makeAuditSlug — normalization", () => {
  it("lowercases the company name", () => {
    expect(makeAuditSlug("ACME", new Set())).toBe("acme");
  });

  it("replaces whitespace runs with a single hyphen", () => {
    expect(makeAuditSlug("Acme   Corp", new Set())).toBe("acme-corp");
    expect(makeAuditSlug("Acme\tCorp", new Set())).toBe("acme-corp");
  });

  it("strips punctuation and special characters", () => {
    expect(makeAuditSlug("Acme, Inc.", new Set())).toBe("acme-inc");
    expect(makeAuditSlug("Foo & Bar!", new Set())).toBe("foo-bar");
    expect(makeAuditSlug("R&D Labs", new Set())).toBe("rd-labs");
  });

  it("trims leading and trailing whitespace before slugging", () => {
    expect(makeAuditSlug("   Acme Corp   ", new Set())).toBe("acme-corp");
  });

  it("preserves digits", () => {
    expect(makeAuditSlug("Web3 Studio 42", new Set())).toBe("web3-studio-42");
  });

  it("preserves existing hyphens in the input", () => {
    expect(makeAuditSlug("acme-labs", new Set())).toBe("acme-labs");
  });

  it("truncates very long names to 60 characters", () => {
    const long = "A".repeat(120);
    const slug = makeAuditSlug(long, new Set());
    expect(slug.length).toBeLessThanOrEqual(60);
    expect(slug).toMatch(/^a+$/);
  });
});

describe("makeAuditSlug — idempotence + uniqueness", () => {
  it("returns the same slug twice for the same input when the set is empty", () => {
    const a = makeAuditSlug("Acme Corp", new Set());
    const b = makeAuditSlug("Acme Corp", new Set());
    expect(a).toBe(b);
    expect(a).toBe("acme-corp");
  });

  it("never returns a slug that already exists in the set", () => {
    const existing = new Set(["acme-corp", "acme-corp-2", "acme-corp-3"]);
    const slug = makeAuditSlug("Acme Corp", existing);
    expect(existing.has(slug)).toBe(false);
  });
});

describe("makeAuditSlug — collision suffixes", () => {
  it("appends -2 when the base slug is taken", () => {
    expect(makeAuditSlug("Acme", new Set(["acme"]))).toBe("acme-2");
  });

  it("walks the suffix sequence (-2, -3, ...) until a free slot is found", () => {
    expect(makeAuditSlug("Acme", new Set(["acme", "acme-2"]))).toBe("acme-3");
    expect(
      makeAuditSlug("Acme", new Set(["acme", "acme-2", "acme-3", "acme-4"]))
    ).toBe("acme-5");
  });

  it("starts at -2 (never -1) so the original base name keeps its slot", () => {
    const slug = makeAuditSlug("Acme", new Set(["acme"]));
    expect(slug).not.toBe("acme-1");
    expect(slug).toBe("acme-2");
  });

  it("falls back to a random suffix once -2..-99 are all taken", () => {
    const existing = new Set(["acme"]);
    for (let i = 2; i < 100; i++) existing.add(`acme-${i}`);
    const slug = makeAuditSlug("Acme", existing);
    expect(slug.startsWith("acme-")).toBe(true);
    expect(existing.has(slug)).toBe(false);
    // random tail is 4 base36 chars
    expect(slug).toMatch(/^acme-[a-z0-9]{4}$/);
  });
});

describe("makeAuditSlug — empty / punctuation-only fallback", () => {
  it("returns a co-xxxxxx placeholder for an empty string", () => {
    expect(makeAuditSlug("", new Set())).toMatch(/^co-[a-z0-9]{6}$/);
  });

  it("returns a co-xxxxxx placeholder when input is all punctuation", () => {
    expect(makeAuditSlug("!!!", new Set())).toMatch(/^co-[a-z0-9]{6}$/);
    expect(makeAuditSlug("   ", new Set())).toMatch(/^co-[a-z0-9]{6}$/);
  });

  it("never returns an empty slug", () => {
    for (const input of ["", " ", "!", ".,.", "/\\"]) {
      expect(makeAuditSlug(input, new Set()).length).toBeGreaterThan(0);
    }
  });
});
