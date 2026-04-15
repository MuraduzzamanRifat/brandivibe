/**
 * Catalog for UTurn product pages. Hardcoded here to match the three
 * products shown in Featured.tsx on the shop homepage. Media paths point
 * to local stock files — drop Pexels-downloaded videos into
 * `mjstudio/public/uturn/stock/<slug>/*.mp4` and the PDP picks them up.
 *
 * Every field is original content for a made-up capsule atelier; no
 * product names, prices, or copy are borrowed from real brands.
 */

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
      {
        type: "video",
        src: "/uturn/stock/ishi-overshirt/hero.mp4",
        poster: "/uturn/stock/ishi-overshirt/hero.jpg",
        label: "Studio light",
      },
      {
        type: "video",
        src: "/uturn/stock/ishi-overshirt/detail-1.mp4",
        poster: "/uturn/stock/ishi-overshirt/detail-1.jpg",
        label: "Stitch detail",
      },
      {
        type: "video",
        src: "/uturn/stock/ishi-overshirt/detail-2.mp4",
        poster: "/uturn/stock/ishi-overshirt/detail-2.jpg",
        label: "Lining",
      },
      {
        type: "video",
        src: "/uturn/stock/ishi-overshirt/worn.mp4",
        poster: "/uturn/stock/ishi-overshirt/worn.jpg",
        label: "On body",
      },
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
      {
        type: "video",
        src: "/uturn/stock/atelier-bag-no-7/hero.mp4",
        poster: "/uturn/stock/atelier-bag-no-7/hero.jpg",
        label: "Studio light",
      },
      {
        type: "video",
        src: "/uturn/stock/atelier-bag-no-7/detail-1.mp4",
        poster: "/uturn/stock/atelier-bag-no-7/detail-1.jpg",
        label: "Edge paint",
      },
      {
        type: "video",
        src: "/uturn/stock/atelier-bag-no-7/detail-2.mp4",
        poster: "/uturn/stock/atelier-bag-no-7/detail-2.jpg",
        label: "Hardware",
      },
      {
        type: "video",
        src: "/uturn/stock/atelier-bag-no-7/worn.mp4",
        poster: "/uturn/stock/atelier-bag-no-7/worn.jpg",
        label: "On shoulder",
      },
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
      {
        type: "video",
        src: "/uturn/stock/midnight-object/hero.mp4",
        poster: "/uturn/stock/midnight-object/hero.jpg",
        label: "On desk",
      },
      {
        type: "video",
        src: "/uturn/stock/midnight-object/detail-1.mp4",
        poster: "/uturn/stock/midnight-object/detail-1.jpg",
        label: "Sand finish",
      },
      {
        type: "video",
        src: "/uturn/stock/midnight-object/detail-2.mp4",
        poster: "/uturn/stock/midnight-object/detail-2.jpg",
        label: "Weight",
      },
      {
        type: "video",
        src: "/uturn/stock/midnight-object/in-hand.mp4",
        poster: "/uturn/stock/midnight-object/in-hand.jpg",
        label: "In hand",
      },
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
};
