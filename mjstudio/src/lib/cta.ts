/**
 * Site-wide CTA system. ONE primary action, ONE secondary — used identically
 * everywhere (nav, hero, mid-page, page-end) so the next step is always the
 * same and always obvious.
 *
 *  PRIMARY   — the conversion action. Points to the contact/booking section.
 *  SECONDARY — a lower-commitment step for people not ready to talk yet.
 */
// "Plan my project" — honest about what actually happens: the contact form
// promises a tailored plan with a reply within a day. (The old "Book a free
// call" implied a scheduling step that doesn't exist and eroded trust at the
// exact moment of commitment.)
export const PRIMARY_CTA = { label: "Plan my project", href: "/contact" } as const;
export const SECONDARY_CTA = { label: "Get a free audit", href: "/audit" } as const;

// Short reassurance line to sit next to conversion buttons.
export const CTA_REASSURANCE = "Friendly reply within a day · No pressure · You own everything we build";
