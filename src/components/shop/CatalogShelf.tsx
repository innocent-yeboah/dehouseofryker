import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import { ShopListing } from "@/components/shop/ShopListing";
import { StorefrontChrome } from "@/components/house/StorefrontChrome";
import type { Crumb, SectionLink, SortKey } from "@/lib/ia";
import type { Product } from "@/types/shop";
import { Suspense } from "react";

export function CatalogShelf({
  title,
  intro,
  crumbs,
  products,
  sectionLinks,
  facetSections,
  defaultSort = "featured",
}: {
  title: string;
  intro?: string;
  crumbs: Crumb[];
  products: Product[];
  sectionLinks?: SectionLink[];
  facetSections?: Array<{ id: string; label: string }>;
  defaultSort?: SortKey;
}) {
  return (
    <StorefrontChrome>
      <Breadcrumbs items={crumbs} />
      <h1 className="mt-3 font-serif text-3xl sm:text-4xl">{title}</h1>
      {intro ? <p className="mt-2 max-w-2xl text-sm text-muted">{intro}</p> : null}
      <Suspense fallback={<p className="mt-8 text-sm text-muted">Loading the shelf…</p>}>
        <ShopListing
          products={products}
          sectionLinks={sectionLinks}
          facetSections={facetSections}
          defaultSort={defaultSort}
        />
      </Suspense>
    </StorefrontChrome>
  );
}
