import { AtelierCard, shopTileGrid } from "@/components/house/AtelierCard";
import { StorefrontChrome } from "@/components/house/StorefrontChrome";
import { kindLabels, kindPaths } from "@/data/seed-catalog";
import { getProducts } from "@/lib/catalog";
import Link from "next/link";
import type { ProductKind } from "@/types/shop";

const order: ProductKind[] = ["oil", "spray", "format", "empty_bottle", "packaging"];

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <StorefrontChrome>
      <h1 className="font-serif text-3xl sm:text-4xl">Shop</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        House names only. Custom inspired-by blends are on WhatsApp, not in this cart.
      </p>
      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        {order.map((kind) => (
          <Link key={kind} href={`/shop/${kindPaths[kind]}`} className="inline-flex min-h-11 items-center border border-soft-gold px-3 py-2">
            {kindLabels[kind]}
          </Link>
        ))}
      </div>
      {order.map((kind) => {
        const group = products.filter((item) => item.kind === kind);
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
      })}
    </StorefrontChrome>
  );
}
