import { notFound } from "next/navigation";
import Link from "next/link";
import { Loader } from "../../_components/Loader";
import { Navbar } from "../../_components/Navbar";
import { Footer } from "../../_components/Footer";
import { ProductGallery } from "./_components/ProductGallery";
import { ProductInfo } from "./_components/ProductInfo";
import { ProductDetails } from "./_components/ProductDetails";
import { RelatedProducts } from "./_components/RelatedProducts";
import { PRODUCTS, type Product } from "./products";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return Object.keys(PRODUCTS).map((slug) => ({ slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const product = PRODUCTS[slug];
  if (!product) return { title: "Not found — UTurn Store" };
  return {
    title: `${product.name} — UTurn Store`,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product: Product | undefined = PRODUCTS[slug];
  if (!product) notFound();

  const related = Object.values(PRODUCTS).filter((p) => p.slug !== slug);

  return (
    <>
      <Loader />
      <Navbar />
      <main className="relative pt-20 md:pt-24">
        {/* Breadcrumb */}
        <div className="mx-auto max-w-[1800px] px-6 md:px-10 py-6 hairline-b">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--uturn-ink-soft)]"
          >
            <Link href="/uturn" className="hover:text-[var(--uturn-ink)] transition-colors">
              Shop
            </Link>
            <span>/</span>
            <Link
              href={`/uturn#${product.category.toLowerCase()}`}
              className="hover:text-[var(--uturn-ink)] transition-colors"
            >
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-[var(--uturn-ink)]">{product.name}</span>
          </nav>
        </div>

        {/* Gallery + sidebar */}
        <section className="mx-auto max-w-[1800px] px-6 md:px-10 py-10 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-7">
              <ProductGallery product={product} />
            </div>
            <div className="lg:col-span-5">
              <ProductInfo product={product} />
            </div>
          </div>
        </section>

        {/* Accordion details */}
        <ProductDetails product={product} />

        {/* Related */}
        <RelatedProducts products={related} />
      </main>
      <Footer />
    </>
  );
}
