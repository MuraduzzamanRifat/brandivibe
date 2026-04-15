/**
 * UTurn capsule catalog — Release 04.
 * All media now uses Pexels CDN images (type: "image").
 * Drop your own images into public/uturn/stock/<slug>/ to override.
 */

const PX = (id: number, w = 900, h = 1120) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&dpr=2`;

export type ProductMedia = {
  type: "video" | "image";
  src: string;
  poster?: string;
  label: string;
};

export type ProductVariant = {
  id: string;
  label: string;
  swatchClass: string;
  inStock: boolean;
};

export type ProductSize = {
  id: string;
  label: string;
  inStock: boolean;
};

export type Product = {
  slug: string;
  num: string;
  name: string;
  category: "Outerwear" | "Leather" | "Objects";
  price: string;
  priceNum: number;
  status: string;
  shortDescription: string;
  longDescription: string[];
  swatch: string;
  media: ProductMedia[];
  variants: ProductVariant[];
  sizes: ProductSize[];
  materials: Array<{ label: string; value: string }>;
  shipping: string[];
  care: string[];
  madeIn: string;
};

export const PRODUCTS: Record<string, Product> = {
  "ishi-overshirt": {
    slug: "ishi-overshirt",
    num: "001",
    name: "Ishi Overshirt",
    category: "Outerwear",
    price: "€720",
    priceNum: 720,
    status: "12 of 50 remaining",
    shortDescription:
      "A heavy twill overshirt cut from single-source Irish linen and lined with raw silk. Made by hand in Porto over four days.",
    longDescription: [
      "The Ishi Overshirt is the first piece in Release 04. It's a slow object — drafted from a single bolt of undyed Irish linen that the atelier has sourced from the same mill for six years, cut by one person, and stitched over four days by another.",
      "The silhouette is boxed through the body and drops an inch past the hip. The raw-silk half-lining catches the shoulders and runs to the third button, so it sits against the skin where it matters and breathes where it doesn't.",
      "Nothing about it is fast. That's the whole point.",
    ],
    swatch: "swatch-slate",
    media: [
      { type: "image", src: PX(2220316), label: "Studio light" },
      { type: "image", src: PX(1536619), label: "Stitch detail" },
      { type: "image", src: PX(2897531), label: "Lining" },
      { type: "image", src: PX(1043474), label: "On body" },
    ],
    variants: [
      { id: "ash", label: "Ash slate", swatchClass: "swatch-slate", inStock: true },
      { id: "clay", label: "Warm clay", swatchClass: "swatch-warm-clay", inStock: true },
      { id: "forest", label: "Pine forest", swatchClass: "swatch-forest", inStock: false },
    ],
    sizes: [
      { id: "s", label: "S", inStock: true },
      { id: "m", label: "M", inStock: true },
      { id: "l", label: "L", inStock: true },
      { id: "xl", label: "XL", inStock: false },
    ],
    materials: [
      { label: "Outer", value: "100% Irish linen, 480 g/m², undyed" },
      { label: "Lining", value: "50% silk / 50% Irish linen, half-lined to shoulder" },
      { label: "Buttons", value: "Corozo, hand-turned, 18mm" },
      { label: "Origin", value: "Porto, Portugal" },
      { label: "Bolt no.", value: "AR-04 / 2026" },
    ],
    shipping: [
      "Ships within 5 working days of release",
      "Complimentary worldwide express (48h Europe, 72h rest of world)",
      "Boxed in FSC-certified kraft, no plastic",
      "Signed card from the person who made it",
    ],
    care: [
      "Dry clean or gentle hand wash in cold water",
      "Line dry, away from direct sun",
      "Store on a shoulder hanger, never folded for long periods",
      "We'll repair or re-stitch any seam free for members, at cost for everyone else — forever",
    ],
    madeIn: "Porto, Portugal · Atelier III",
  },

  "atelier-bag-no-7": {
    slug: "atelier-bag-no-7",
    num: "002",
    name: "Atelier Bag No. 7",
    category: "Leather",
    price: "€880",
    priceNum: 880,
    status: "Made to order · 4 weeks",
    shortDescription:
      "A soft-sided tote in vegetable-tanned calfskin, edge-painted by hand over two days. Numbered one through fifty.",
    longDescription: [
      "No. 7 is the seventh iteration of a pattern we've been refining since 2019. Each version keeps what worked and adjusts one thing. This run drops the reinforced base plate (too stiff) and extends the interior lining by 2cm to catch a small notebook cleanly.",
      "Every piece is cut from a single hide so the grain stays consistent. The edges are hand-painted in five coats, burnished between each, and sealed with a beeswax finish. It will darken in the hand.",
      "You're buying the seventh answer to a six-year-old question.",
    ],
    swatch: "swatch-warm-clay",
    media: [
      { type: "image", src: PX(1152077), label: "Studio light" },
      { type: "image", src: PX(3659098), label: "Edge paint" },
      { type: "image", src: PX(2905238), label: "Hardware" },
      { type: "image", src: PX(1152076), label: "On shoulder" },
    ],
    variants: [
      { id: "chestnut", label: "Chestnut", swatchClass: "swatch-warm-clay", inStock: true },
      { id: "deep-plum", label: "Deep plum", swatchClass: "swatch-deep-plum", inStock: true },
      { id: "slate", label: "Ash slate", swatchClass: "swatch-slate", inStock: true },
    ],
    sizes: [
      { id: "m", label: "Medium (32cm)", inStock: true },
      { id: "l", label: "Large (38cm)", inStock: true },
    ],
    materials: [
      { label: "Hide", value: "Italian vegetable-tanned calfskin, 1.8mm" },
      { label: "Lining", value: "Undyed Irish linen" },
      { label: "Hardware", value: "Solid brass, unplated" },
      { label: "Thread", value: "Waxed Tiger linen, saddle-stitched" },
      { label: "Origin", value: "Porto, Portugal" },
    ],
    shipping: [
      "Made to order — 4 weeks from payment to dispatch",
      "Complimentary worldwide express (48h Europe, 72h rest of world)",
      "Boxed in FSC-certified kraft with a burnished brass numeral tag",
      "Signed card from the person who made it",
    ],
    care: [
      "Wipe clean with a soft dry cloth, never leather cleaner",
      "Feed with natural beeswax balm every six months",
      "Stuff with tissue paper when not in use, store out of direct sun",
      "Send it back to us for re-stitching or re-edging at any point in its life",
    ],
    madeIn: "Porto, Portugal · Atelier I",
  },

  "midnight-object": {
    slug: "midnight-object",
    num: "003",
    name: "Midnight Object",
    category: "Objects",
    price: "€140",
    priceNum: 140,
    status: "In stock",
    shortDescription:
      "A cast-bronze paperweight, 340g, sand-finished and patinated by hand. Sits on the desk like it's always been there.",
    longDescription: [
      "Midnight Object is a small solid — cast in bronze at a foundry outside Lisbon, finished by hand with a sand-and-wax rub that takes the shine down to something closer to old iron.",
      "It weighs exactly 340 grams. That's the right weight for a piece of paper on a breezy desk and a little too heavy for anything else. It will warm in the hand and darken with the oils of whoever owns it.",
      "Made for people who like to hold things.",
    ],
    swatch: "swatch-deep-plum",
    media: [
      { type: "image", src: PX(1037995), label: "On desk" },
      { type: "image", src: PX(3944405), label: "Sand finish" },
      { type: "image", src: PX(3823488), label: "Weight" },
      { type: "image", src: PX(3736979), label: "In hand" },
    ],
    variants: [
      { id: "midnight", label: "Midnight bronze", swatchClass: "swatch-deep-plum", inStock: true },
      { id: "sand", label: "Sand bronze", swatchClass: "swatch-sand", inStock: true },
    ],
    sizes: [
      { id: "one", label: "One size (340g)", inStock: true },
    ],
    materials: [
      { label: "Body", value: "Solid cast bronze, sand-cast" },
      { label: "Finish", value: "Hand-patinated, waxed" },
      { label: "Weight", value: "340g ± 5g" },
      { label: "Dimensions", value: "70 × 50 × 28 mm" },
      { label: "Origin", value: "Sintra, Portugal" },
    ],
    shipping: [
      "Ships within 48 hours",
      "Complimentary worldwide express (48h Europe, 72h rest of world)",
      "Boxed in FSC-certified kraft, wrapped in unbleached cotton",
      "Signed card from the person who made it",
    ],
    care: [
      "Wipe with a soft dry cloth, never a polish or brass cleaner",
      "Re-wax every year with natural beeswax to preserve the patina",
      "Handle often — it will tell you the story of everyone who's owned it",
      "Free rework at the foundry for the first five years",
    ],
    madeIn: "Sintra, Portugal · Foundry II",
  },

  "faro-coat": {
    slug: "faro-coat",
    num: "004",
    name: "Faro Coat",
    category: "Outerwear",
    price: "€1,480",
    priceNum: 1480,
    status: "8 of 30 remaining",
    shortDescription:
      "A double-faced merino overcoat, unlined and unstructured. Woven in the Alentejo and finished with hand-felled hems.",
    longDescription: [
      "The Faro Coat starts with a double-faced merino cloth woven at a small mill in the Alentejo plains — two layers of wool bonded together, no lining needed, no padding, no interlining. It stands on its own.",
      "The hem is hand-felled, each stitch placed the same distance apart by the same pair of hands. The back vent is cut on a slight bias so it falls open when you move rather than gaping when you stand. Small things, but the coat knows them.",
      "It comes in two weights. The 480g is for travelling. The 620g is for staying.",
    ],
    swatch: "swatch-forest",
    media: [
      { type: "image", src: PX(996329), label: "Studio light" },
      { type: "image", src: PX(1536619), label: "Cloth weight" },
      { type: "image", src: PX(3622608), label: "Felled hem" },
      { type: "image", src: PX(2220317), label: "On body" },
    ],
    variants: [
      { id: "forest", label: "Pine forest", swatchClass: "swatch-forest", inStock: true },
      { id: "slate", label: "Ash slate", swatchClass: "swatch-slate", inStock: true },
      { id: "sand", label: "Warm sand", swatchClass: "swatch-sand", inStock: false },
    ],
    sizes: [
      { id: "s", label: "S", inStock: true },
      { id: "m", label: "M", inStock: true },
      { id: "l", label: "L", inStock: true },
      { id: "xl", label: "XL", inStock: true },
    ],
    materials: [
      { label: "Cloth", value: "Double-faced merino wool, 480g or 620g/m²" },
      { label: "Lining", value: "None — self-finishing interior" },
      { label: "Buttons", value: "Horn, hand-sewn, 22mm" },
      { label: "Hem", value: "Hand-felled, 7mm stitch pitch" },
      { label: "Origin", value: "Alentejo, Portugal" },
    ],
    shipping: [
      "Ships within 7 working days",
      "Complimentary worldwide express (48h Europe, 72h rest of world)",
      "Garment bag included — no box, no waste",
      "Signed card from the person who made it",
    ],
    care: [
      "Dry clean only — the double face is sensitive to mechanical agitation",
      "Hang after each wear, allow 24h to breathe before storing",
      "Brush with a soft clothes brush along the grain",
      "Re-blocking and any repairs done free for members, at cost for everyone else",
    ],
    madeIn: "Alentejo, Portugal · Mill Weave IV",
  },
};
