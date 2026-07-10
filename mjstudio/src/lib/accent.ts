/**
 * Accessible "ink" variant of each pillar accent.
 *
 * The bright pillar accents (used for glows, tints, and decorative fills)
 * fail WCAG AA when they carry white text (a button) or act as text on the
 * ivory canvas (a kicker/label). Each ink value below is the same hue
 * darkened until it clears 4.5:1 against BOTH white and the canvas — so a
 * single value works for button backgrounds and accent-colored text alike.
 * Bright accents stay bright everywhere they're decorative.
 *
 * Keep in sync with the pillar accents in data/services.ts.
 */
const ACCENT_INK: Record<string, string> = {
  "#FF6A3D": "#d13000", // Web Development — coral
  "#0FA598": "#0b7b71", // Software — teal
  "#F5A524": "#9a6207", // Digital Marketing — amber
  "#E85D9A": "#d11e6c", // Creative Content — berry
  "#7B6EF6": "#6354f4", // Creative Design — violet
  "#2FBF71": "#1f7e4a", // AI & Automation — leaf
};

/** Returns the accessible ink for a known pillar accent, or the input unchanged. */
export function accentInk(hex: string): string {
  if (!hex) return hex;
  return ACCENT_INK[hex.toUpperCase()] ?? hex;
}
