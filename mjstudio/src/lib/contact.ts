// Central contact configuration. All values overridable via env at build time
// (NEXT_PUBLIC_* are inlined into the static export) — no code changes needed.
//
//   NEXT_PUBLIC_CONTACT_EMAIL     Inbox for "email us" links + the form's
//                                 mailto fallback. Defaults to the current
//                                 working inbox; switch to a branded address
//                                 (e.g. hello@brandivibe.com) once forwarding
//                                 is set up — recommended for a premium brand.
//
//   NEXT_PUBLIC_CONTACT_ENDPOINT  A no-backend form endpoint so submissions
//                                 actually deliver on the static host. Examples:
//                                   Web3Forms : https://api.web3forms.com/submit
//                                   FormSubmit: https://formsubmit.co/ajax/<email>
//                                 When UNSET, the form falls back to a prefilled
//                                 mailto: so a lead is never silently lost.
//
//   NEXT_PUBLIC_WEB3FORMS_KEY     Access key — only when using Web3Forms.

export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "mjrifat54@gmail.com";

export const CONTACT_ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? "";

export const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "";

//   NEXT_PUBLIC_BOOKING_URL       A calendar booking link (Cal.com / Calendly).
//                                 When set, a "Book a call" option appears
//                                 alongside the form. When unset, the form is
//                                 the only path (still fully functional).
export const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL ?? "";
