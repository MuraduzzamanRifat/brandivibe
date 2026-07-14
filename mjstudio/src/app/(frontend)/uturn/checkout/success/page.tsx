import { Navbar } from "../../_components/Navbar";
import { OrderSuccess } from "./_components/OrderSuccess";

export const dynamic = "force-static";

export const metadata = {
  title: "Order confirmed — UTurn Store",
};

export default function SuccessPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="relative min-h-screen pt-20 md:pt-24 bg-[var(--uturn-bg)]">
        <OrderSuccess />
      </main>
    </>
  );
}
