import { Code2, Boxes, TrendingUp, PenLine, Palette, Bot, Sparkles, type LucideIcon } from "lucide-react";

/**
 * One icon per service pillar, shared by every surface that shows a pillar —
 * the homepage cards and the nav mega-menu — so the same idea always wears the
 * same face.
 *
 * Keyed by SLUG, not by position: an icon list indexed by order silently
 * reshuffles the moment someone reorders the pillars.
 *
 * Both surfaces previously badged a pillar with the first letter of its title
 * ("W", "S", "D"), which tells a visitor nothing at all.
 */
export const PILLAR_ICONS: Record<string, LucideIcon> = {
  "web-development": Code2,
  software: Boxes,
  "digital-marketing": TrendingUp,
  "creative-content": PenLine,
  "creative-design": Palette,
  "ai-automation": Bot,
};

/** The icon for a pillar slug, with a neutral fallback for an unknown one. */
export function pillarIcon(slug: string): LucideIcon {
  return PILLAR_ICONS[slug] ?? Sparkles;
}
