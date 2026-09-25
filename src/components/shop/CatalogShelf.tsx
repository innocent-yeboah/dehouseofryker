import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import { ShopListing } from "@/components/shop/ShopListing";
import { StorefrontChrome } from "@/components/house/StorefrontChrome";
import { filterProducts, normalizeSearch, type Crumb, type SectionLink, type SortKey } from "@/lib/ia";
import type { Product } from "@/types/shop";

export function CatalogShelf({
  title,
  intro,
  crumbs,
  products,
  sectionLinks,
  facetSections,
  defaultSort = "featured",
  searchParams,
}: {
  title: string;
  intro?: string;
  crumbs: Crumb[];
  products: Product[];
  sectionLinks?: SectionLink[];
  facetSections?: Array<{ id: string; label: string }>;
  defaultSort?: SortKey;
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const query = normalizeSearch(searchParams, defaultSort);
  const filtered = filterProducts(products, query);

  return (
    <StorefrontChrome>
      <Breadcrumbs items={crumbs} />
      <h1 className="mt-3 font-serif text-3xl sm:text-4xl">{title}</h1>
      {intro ? <p className="mt-2 max-w-2xl text-sm text-muted">{intro}</p> : null}
      <ShopListing
        universe={products}
        products={filtered}
        query={query}
        sectionLinks={sectionLinks}
        facetSections={facetSections}
        defaultSort={defaultSort}
      />
    </StorefrontChrome>
  );
}
