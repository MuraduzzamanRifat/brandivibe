"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Lock, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useCart } from "../../_components/CartContext";

type FormData = {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  country: string;
  postalCode: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  nameOnCard: string;
};

const COUNTRIES = [
  "United Kingdom",
  "United States",
  "Germany",
  "France",
  "Portugal",
  "Spain",
  "Italy",
  "Netherlands",
  "Japan",
  "Australia",
  "Canada",
];

function Field({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  half,
  pattern,
  maxLength,
  required,
}: {
  label: string;
  name: keyof FormData;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (name: keyof FormData, value: string) => void;
  half?: boolean;
  pattern?: string;
  maxLength?: number;
  required?: boolean;
}) {
  return (
    <div className={half ? "col-span-1" : "col-span-2"}>
      <label className="block font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--uturn-ink-soft)] mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        pattern={pattern}
        maxLength={maxLength}
        required={required}
        onChange={(e) => onChange(name, e.target.value)}
        className="w-full bg-transparent border border-[var(--uturn-hairline)] px-4 py-3.5 font-light text-[var(--uturn-ink)] placeholder:text-[var(--uturn-ink-soft)] focus:outline-none focus:border-[var(--uturn-ink)] transition-colors text-sm"
      />
    </div>
  );
}

export function CheckoutForm() {
  const { items, total, count, clearCart } = useCart();
  const router = useRouter();
  const [placing, setPlacing] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [form, setForm] = useState<FormData>({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    country: "United Kingdom",
    postalCode: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    nameOnCard: "",
  });

  function set(name: keyof FormData, value: string) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  function formatCard(val: string) {
    return val
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  }

  function formatExpiry(val: string) {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
    return digits;
  }

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    setPlacing(true);
    await new Promise((r) => setTimeout(r, 1400));
    clearCart(); // clear bag before navigating so success page shows the snapshot via items prop
    router.push("/uturn/checkout/success");
  }

  const shipping = 0;
  const tax = Math.round(total * 0.2);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-6 text-center">
        <p className="font-serif italic text-3xl text-[var(--uturn-ink)]">
          Your bag is empty.
        </p>
        <Link
          href="/uturn"
          className="font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--uturn-accent)] hover:text-[var(--uturn-ink)] transition-colors"
        >
          ← Back to the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-10 md:py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--uturn-ink-soft)] mb-12">
        <Link href="/uturn" className="hover:text-[var(--uturn-ink)] transition-colors">
          Shop
        </Link>
        <span>/</span>
        <span
          className="cursor-pointer hover:text-[var(--uturn-ink)] transition-colors"
          onClick={() => router.back()}
        >
          Bag
        </span>
        <span>/</span>
        <span className="text-[var(--uturn-ink)]">Checkout</span>
      </nav>

      {/* Mobile order summary toggle */}
      <button
        type="button"
        onClick={() => setSummaryOpen((v) => !v)}
        className="md:hidden w-full flex items-center justify-between py-4 hairline-b hairline-t mb-8 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--uturn-ink)]"
      >
        <span className="flex items-center gap-2">
          {summaryOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          Order summary · {count} {count === 1 ? "item" : "items"}
        </span>
        <span className="font-serif italic text-lg">€{(total + tax).toLocaleString()}</span>
      </button>

      {/* Mobile summary */}
      {summaryOpen && (
        <div className="md:hidden mb-10">
          <OrderSummary items={items} total={total} tax={tax} shipping={shipping} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-16 lg:gap-24">
        {/* ── Left: form ── */}
        <form
          onSubmit={placeOrder}
          className="md:col-span-7 space-y-12"
        >
          {/* Contact */}
          <section>
            <SectionTitle num="01" label="Contact" />
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Field label="Email address" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={set} required />
            </div>
          </section>

          {/* Shipping */}
          <section>
            <SectionTitle num="02" label="Shipping address" />
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Field label="First name" name="firstName" placeholder="Émile" value={form.firstName} onChange={set} half required />
              <Field label="Last name" name="lastName" placeholder="Renard" value={form.lastName} onChange={set} half required />
              <Field label="Address" name="address" placeholder="12 Rue de la Paix" value={form.address} onChange={set} required />
              <Field label="Apartment, suite, etc. (optional)" name="apartment" placeholder="Apt 4B" value={form.apartment} onChange={set} />
              <Field label="City" name="city" placeholder="London" value={form.city} onChange={set} half required />
              <Field label="Postal code" name="postalCode" placeholder="EC1A 1BB" value={form.postalCode} onChange={set} half required />

              {/* Country select */}
              <div className="col-span-2">
                <label className="block font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--uturn-ink-soft)] mb-2">
                  Country
                </label>
                <select
                  value={form.country}
                  onChange={(e) => set("country", e.target.value)}
                  className="w-full bg-transparent border border-[var(--uturn-hairline)] px-4 py-3.5 font-light text-[var(--uturn-ink)] focus:outline-none focus:border-[var(--uturn-ink)] transition-colors text-sm appearance-none cursor-pointer"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c} className="bg-[#1a1916]">{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Payment */}
          <section>
            <SectionTitle num="03" label="Payment" />
            <div className="mt-2 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--uturn-ink-soft)]">
              <Lock className="w-3 h-3" />
              Demo only — no real payment is processed
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="col-span-2">
                <label className="block font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--uturn-ink-soft)] mb-2">
                  Card number
                </label>
                <input
                  type="text"
                  value={form.cardNumber}
                  placeholder="4242 4242 4242 4242"
                  onChange={(e) => set("cardNumber", formatCard(e.target.value))}
                  maxLength={19}
                  required
                  className="w-full bg-transparent border border-[var(--uturn-hairline)] px-4 py-3.5 font-light text-[var(--uturn-ink)] placeholder:text-[var(--uturn-ink-soft)] focus:outline-none focus:border-[var(--uturn-ink)] transition-colors text-sm tracking-widest"
                />
              </div>
              <div className="col-span-1">
                <label className="block font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--uturn-ink-soft)] mb-2">
                  Expiry
                </label>
                <input
                  type="text"
                  value={form.expiry}
                  placeholder="MM / YY"
                  onChange={(e) => set("expiry", formatExpiry(e.target.value))}
                  maxLength={7}
                  required
                  className="w-full bg-transparent border border-[var(--uturn-hairline)] px-4 py-3.5 font-light text-[var(--uturn-ink)] placeholder:text-[var(--uturn-ink-soft)] focus:outline-none focus:border-[var(--uturn-ink)] transition-colors text-sm"
                />
              </div>
              <div className="col-span-1">
                <label className="block font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--uturn-ink-soft)] mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  value={form.cvv}
                  placeholder="•••"
                  onChange={(e) => set("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
                  maxLength={4}
                  required
                  className="w-full bg-transparent border border-[var(--uturn-hairline)] px-4 py-3.5 font-light text-[var(--uturn-ink)] placeholder:text-[var(--uturn-ink-soft)] focus:outline-none focus:border-[var(--uturn-ink)] transition-colors text-sm"
                />
              </div>
              <Field label="Name on card" name="nameOnCard" placeholder="Émile Renard" value={form.nameOnCard} onChange={set} required />
            </div>
          </section>

          {/* Submit */}
          <button
            type="submit"
            disabled={placing}
            className="group relative w-full py-5 bg-[var(--uturn-ink)] text-[var(--uturn-bg)] font-mono text-[11px] uppercase tracking-[0.35em] overflow-hidden disabled:opacity-70"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              {placing ? (
                <>
                  <span className="inline-block w-3 h-3 border border-[var(--uturn-bg)]/50 border-t-[var(--uturn-bg)] rounded-full animate-spin" />
                  Placing order…
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3" />
                  Place order · €{(total + tax).toLocaleString()}
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-[var(--uturn-accent)] origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out" />
          </button>

          <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--uturn-ink-soft)] text-center">
            By placing your order you agree to our terms · All content is illustrative
          </p>
        </form>

        {/* ── Right: order summary (desktop) ── */}
        <aside className="hidden md:block md:col-span-5">
          <div className="md:sticky md:top-32">
            <OrderSummary items={items} total={total} tax={tax} shipping={shipping} />
          </div>
        </aside>
      </div>
    </div>
  );
}

function SectionTitle({ num, label }: { num: string; label: string }) {
  return (
    <div className="flex items-center gap-4 pb-5 border-b border-[var(--uturn-hairline)]">
      <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--uturn-accent)]">
        {num}
      </span>
      <h2
        className="font-serif font-light italic text-[var(--uturn-ink)]"
        style={{ fontSize: "clamp(1.25rem, 2vw, 1.75rem)" }}
      >
        {label}
      </h2>
    </div>
  );
}

function OrderSummary({
  items,
  total,
  tax,
  shipping,
}: {
  items: Array<{ slug: string; name: string; price: string; priceNum: number; variant: string; variantLabel: string; size: string; swatch: string; qty: number }>;
  total: number;
  tax: number;
  shipping: number;
}) {
  return (
    <div>
      <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-[var(--uturn-ink-soft)] mb-6">
        Order summary
      </div>

      <ul className="space-y-5 pb-6 border-b border-[var(--uturn-hairline)]">
        {items.map((item) => (
          <li key={`${item.slug}-${item.variant}-${item.size}`} className="flex gap-4">
            <div className={`shrink-0 w-16 h-20 rounded-sm ${item.swatch}`} />
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-start justify-between gap-2">
                <span className="font-serif text-base text-[var(--uturn-ink)] leading-tight">
                  {item.name}
                </span>
                <span className="shrink-0 font-serif italic text-base text-[var(--uturn-ink)]">
                  {item.price}
                </span>
              </div>
              <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--uturn-ink-soft)]">
                {item.variantLabel} · {item.size}
                {item.qty > 1 && ` · ×${item.qty}`}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="py-5 space-y-3 border-b border-[var(--uturn-hairline)]">
        <Row label="Subtotal" value={`€${total.toLocaleString()}`} />
        <Row label="Shipping" value={shipping === 0 ? "Free" : `€${shipping}`} />
        <Row label="VAT (20%)" value={`€${tax.toLocaleString()}`} muted />
      </div>

      <div className="pt-5 flex items-baseline justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--uturn-ink)]">
          Total
        </span>
        <span className="font-serif italic text-3xl text-[var(--uturn-ink)]">
          €{(total + tax).toLocaleString()}
        </span>
      </div>

      <div className="mt-6 pt-6 border-t border-[var(--uturn-hairline)] space-y-2">
        {[
          "Complimentary worldwide express shipping",
          "Signed card from the maker",
          "Free repairs, forever",
        ].map((line) => (
          <div key={line} className="flex items-start gap-3">
            <span className="mt-1.5 w-1 h-1 rounded-full bg-[var(--uturn-accent)] shrink-0" />
            <span className="font-light text-xs text-[var(--uturn-ink-muted)]">{line}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--uturn-ink-soft)]">
        {label}
      </span>
      <span className={`font-light text-sm ${muted ? "text-[var(--uturn-ink-soft)]" : "text-[var(--uturn-ink)]"}`}>
        {value}
      </span>
    </div>
  );
}
