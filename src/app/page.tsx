import { AtelierCard } from "@/components/house/AtelierCard";
import { shopTileGrid } from "@/components/house/shop-grid";
import { CategoryPromos } from "@/components/house/CategoryPromos";
import { HouseHero } from "@/components/house/HouseHero";
import { StorefrontChrome } from "@/components/house/StorefrontChrome";
import { TrustStrip } from "@/components/house/TrustStrip";
import { getProducts } from "@/lib/catalog";
import { brandIndex, homeRails } from "@/lib/ia";
import { site, whatsappHref } from "@/lib/site";
import Link from "next/link";

function ProductRail({
  title,
  href,
  products,
}: {
  title: string;
  href: string;
  products: Awaited<ReturnType<typeof getProducts>>;
}) {
  if (products.length === 0) {
    return null;
  }
  return (
    <section className="mx-auto max-w-7xl px-3 py-8 sm:px-4 sm:py-10">
      <div className="mb-5 flex items-end justify-between gap-4">
        <h2 className="font-serif text-2xl text-ink sm:text-3xl">{title}</h2>
        <Link href={href} className="shrink-0 text-sm font-medium text-deep-gold">
          Shop more →
        </Link>
      </div>
      <div className={shopTileGrid}>
        {products.map((product) => (
          <AtelierCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default async function HomePage() {
  const products = await getProducts();
  const { bestSellers, newArrivals } = homeRails(products);
  const brands = brandIndex(products);

  return (
    <StorefrontChrome
      contained={false}
      fullBleed={
        <>
          <HouseHero />
          <div className="bg-[#f3f1ec] pb-6 pt-2">
            <CategoryPromos />
          </div>
        </>
      }
    >
      <div className="bg-[#f3f1ec]">
        <TrustStrip />

        <ProductRail title="Best Sellers" href="/shop/best-sellers" products={bestSellers} />
        <ProductRail title="New Arrivals" href="/shop/new-arrivals" products={newArrivals} />

        <section className="mx-auto max-w-7xl px-3 py-8 sm:px-4 sm:py-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2 className="font-serif text-2xl text-ink sm:text-3xl">Shop by Brand</h2>
            <Link href="/shop/brands" className="shrink-0 text-sm font-medium text-deep-gold">
              All brands →
            </Link>
          </div>
          <ul className="flex gap-2 overflow-x-auto pb-2">
            {brands.map((brand) => (
              <li key={brand.slug} className="shrink-0">
                <Link
                  href={`/shop/brands/${brand.slug}`}
                  className="inline-flex min-h-11 items-center rounded-full border border-soft-gold bg-white px-4 font-serif text-lg text-ink"
                >
                  {brand.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto max-w-7xl px-3 py-6 sm:px-4">
          <Link
            href="/customize"
            className="flex flex-col justify-between rounded-2xl bg-ink px-6 py-8 text-white sm:flex-row sm:items-end"
          >
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-house-gold">Custom</p>
              <h2 className="mt-3 font-serif text-3xl">Smell it, then pay</h2>
              <p className="mt-3 max-w-xl text-sm text-white/70">
                Inspired-by blends stay on WhatsApp — never in the paid cart.
              </p>
            </div>
            <span className="mt-8 inline-flex w-fit rounded-full bg-house-gold px-5 py-2.5 text-sm font-medium text-ink sm:mt-0">
              Start on WhatsApp
            </span>
          </Link>
        </section>

        <section className="mx-auto max-w-7xl px-3 py-10 text-center sm:px-4">
          <p className="text-sm text-muted">
            Outside Ghana?{" "}
            <a
              className="text-deep-gold"
              href={whatsappHref("Hello, I am outside Ghana and would like to order.")}
            >
              WhatsApp the house
            </a>{" "}
            — checkout is Ghana only. {site.address}.
          </p>
        </section>
      </div>
    </StorefrontChrome>
  );
}
