import { Navbar } from "../_components/Navbar";
import { CheckoutForm } from "./_components/CheckoutForm";

export const dynamic = "force-static";

export const metadata = {
  title: "Checkout — UTurn Store",
  // A demo store's checkout is thin and has zero search value — keep it out of
  // the index (the /uturn showcase root stays indexable as a portfolio piece).
  robots: { index: false, follow: true },
};

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="relative min-h-screen pt-20 md:pt-24 bg-[var(--uturn-bg)]">
        <CheckoutForm />
      </main>
    </>
  );
}
