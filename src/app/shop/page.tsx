import { AtelierCard } from "@/components/house/AtelierCard";
import { shopTileGrid } from "@/components/house/shop-grid";
import { StorefrontChrome } from "@/components/house/StorefrontChrome";
import { kindLabels, kindPaths } from "@/data/seed-catalog";
import { getProducts } from "@/lib/catalog";
import Link from "next/link";
import type { ProductKind } from "@/types/shop";

const order: ProductKind[] = ["oil", "spray", "format", "empty_bottle", "packaging"];

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function ShopPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = (q ?? "").trim().toLowerCase();
  const products = await getProducts();
  const stockedKinds = order.filter((kind) => products.some((item) => item.kind === kind));
  const filtered = query
    ? products.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          kindLabels[item.kind].toLowerCase().includes(query),
      )
    : products;

  return (
    <StorefrontChrome>
      <h1 className="font-serif text-3xl sm:text-4xl">Shop</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        House names only. Custom inspired-by blends are on WhatsApp, not in this cart.
      </p>
      {query ? (
        <p className="mt-3 text-sm text-deep-gold">
          Showing results for “{q}”.{" "}
          <Link href="/shop" className="underline">
            Clear search
          </Link>
        </p>
      ) : null}
      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        {stockedKinds.map((kind) => (
          <Link
            key={kind}
            href={`/shop/${kindPaths[kind]}`}
            className="inline-flex min-h-11 items-center rounded-full border border-soft-gold bg-white px-4 py-2"
          >
            {kindLabels[kind]}
          </Link>
        ))}
      </div>
      {query ? (
        <div className={`mt-8 ${shopTileGrid}`}>
          {filtered.map((product) => (
            <AtelierCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        stockedKinds.map((kind) => {
          const group = filtered.filter((item) => item.kind === kind);
          if (group.length === 0) {
            return null;
          }
          return (
            <section key={kind} className="mt-12">
              <h2 className="font-serif text-2xl">{kindLabels[kind]}</h2>
              <div className={`mt-4 ${shopTileGrid}`}>
                {group.map((product) => (
                  <AtelierCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          );
        })
      )}
      {filtered.length === 0 ? (
        <p className="mt-8 text-sm text-muted">No products matched that search.</p>
      ) : null}
    </StorefrontChrome>
  );
}
