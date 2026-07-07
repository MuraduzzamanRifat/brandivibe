import { Navbar } from "../_components/Navbar";
import { CheckoutForm } from "./_components/CheckoutForm";

export const dynamic = "force-static";

export const metadata = {
  title: "Checkout — UTurn Store",
};

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen pt-20 md:pt-24 bg-[var(--uturn-bg)]">
        <CheckoutForm />
      </main>
    </>
  );
}
