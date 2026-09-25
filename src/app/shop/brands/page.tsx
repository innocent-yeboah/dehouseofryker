import { StorefrontChrome } from "@/components/house/StorefrontChrome";
import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import { getProducts } from "@/lib/catalog";
import { brandIndex } from "@/lib/ia";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop by Brand",
};

export default async function BrandsPage() {
  const products = await getProducts();
  const brands = brandIndex(products);

  return (
    <StorefrontChrome>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: "Shop by Brand" },
        ]}
      />
      <h1 className="mt-3 font-serif text-3xl sm:text-4xl">Shop by Brand</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        {brands.length} {brands.length === 1 ? "brand" : "brands"} on the shelf. Wordmarks only —
        the house does not invent logos.
      </p>
      <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {brands.map((brand) => (
          <li key={brand.slug}>
            <Link
              href={`/shop/brands/${brand.slug}`}
              className="flex h-full min-h-28 flex-col justify-between rounded-2xl border border-soft-gold bg-white px-4 py-5 transition-colors hover:border-deep-gold"
            >
              <span className="font-serif text-2xl leading-tight text-ink">{brand.label}</span>
              <span className="mt-4 text-sm text-muted">
                {brand.count} {brand.count === 1 ? "product" : "products"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </StorefrontChrome>
  );
}
