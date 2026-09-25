"use client";

import { AtelierCard } from "@/components/house/AtelierCard";
import { shopTileGrid } from "@/components/house/shop-grid";
import { PAGE_SIZE, brandIndex, type ListingQuery, type SectionLink, type SortKey } from "@/lib/ia";
import type { Product } from "@/types/shop";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const sorts: Array<{ id: SortKey; label: string }> = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
];

function sizeRank(size: string): number {
  const match = size.match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : 100000;
}

export function ShopListing({
  universe,
  products,
  query,
  sectionLinks = [],
  facetSections = [],
  defaultSort = "featured",
}: {
  /** Unfiltered products on this shelf, used to build filter choices. */
  universe: Product[];
  products: Product[];
  query: ListingQuery;
  sectionLinks?: SectionLink[];
  facetSections?: Array<{ id: string; label: string }>;
  defaultSort?: SortKey;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [shown, setShown] = useState(PAGE_SIZE);
  const [minDraft, setMinDraft] = useState(query.min);
  const [maxDraft, setMaxDraft] = useState(query.max);

  useEffect(() => {
    setShown(PAGE_SIZE);
    setMinDraft(query.min);
    setMaxDraft(query.max);
  }, [query.section, query.brand, query.size, query.min, query.max, query.stock, query.sort, query.q]);
  const brands = brandIndex(universe);
  const sizes = [...new Set(universe.map((item) => item.size).filter(Boolean))].sort(
    (a, b) => sizeRank(a) - sizeRank(b) || a.localeCompare(b),
  );
  const visible = products.slice(0, shown);

  function update(next: Partial<Record<"section" | "brand" | "size" | "min" | "max" | "stock" | "sort" | "q", string>>) {
    const merged = {
      section: query.section,
      brand: query.brand,
      size: query.size,
      min: query.min,
      max: query.max,
      stock: query.stock ? "1" : "",
      sort: query.sort === defaultSort ? "" : query.sort,
      q: query.q,
      ...next,
    };
    if (merged.sort === defaultSort) {
      merged.sort = "";
    }
    const sp = new URLSearchParams();
    for (const [key, value] of Object.entries(merged)) {
      if (value) {
        sp.set(key, value);
      }
    }
    const qs = sp.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  const selectClass =
    "min-h-11 w-full rounded-lg border border-soft-gold bg-white px-3 text-sm text-ink";

  return (
    <div className="mt-6">
      {sectionLinks.length > 0 ? (
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.14em] text-muted">Section</p>
          <div className="flex flex-wrap gap-2" role="navigation" aria-label="Sections">
            {sectionLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={link.current ? "page" : undefined}
                className={`inline-flex min-h-11 items-center rounded-full border px-4 text-sm ${
                  link.current
                    ? "border-deep-gold bg-deep-gold text-white"
                    : "border-soft-gold bg-white text-ink"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      <div className={`${sectionLinks.length > 0 ? "mt-4" : ""} grid grid-cols-2 gap-2 lg:flex lg:flex-wrap lg:items-end`}>
        {facetSections.length > 0 ? (
          <label className="col-span-2 block min-w-0 lg:w-52">
            <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-muted">Section</span>
            <select
              className={selectClass}
              value={query.section}
              onChange={(event) => update({ section: event.target.value })}
            >
              <option value="">All sections</option>
              {facetSections.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <label className="block min-w-0 lg:w-44">
          <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-muted">Brand</span>
          <select className={selectClass} value={query.brand} onChange={(event) => update({ brand: event.target.value })}>
            <option value="">All brands</option>
            {brands.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block min-w-0 lg:w-40">
          <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-muted">Size</span>
          <select className={selectClass} value={query.size} onChange={(event) => update({ size: event.target.value })}>
            <option value="">All sizes</option>
            {sizes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="block min-w-0 lg:w-28">
          <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-muted">Min GHS</span>
          <input
            className={selectClass}
            inputMode="numeric"
            type="number"
            min={0}
            placeholder="0"
            value={minDraft}
            onChange={(event) => setMinDraft(event.target.value)}
            onBlur={() => {
              if (minDraft !== query.min) {
                update({ min: minDraft });
              }
            }}
          />
        </label>
        <label className="block min-w-0 lg:w-28">
          <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-muted">Max GHS</span>
          <input
            className={selectClass}
            inputMode="numeric"
            type="number"
            min={0}
            placeholder="Any"
            value={maxDraft}
            onChange={(event) => setMaxDraft(event.target.value)}
            onBlur={() => {
              if (maxDraft !== query.max) {
                update({ max: maxDraft });
              }
            }}
          />
        </label>
        <label className="col-span-2 flex min-h-11 items-center gap-2 self-end rounded-lg border border-soft-gold bg-white px-3 text-sm lg:w-auto">
          <input
            type="checkbox"
            className="h-4 w-4 accent-[#8c6a2b]"
            checked={query.stock}
            onChange={(event) => update({ stock: event.target.checked ? "1" : "" })}
          />
          In stock only
        </label>
        <label className="col-span-2 block min-w-0 lg:w-52">
          <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-muted">Sort</span>
          <select className={selectClass} value={query.sort} onChange={(event) => update({ sort: event.target.value })}>
            {sorts.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm text-muted">
          {products.length} {products.length === 1 ? "product" : "products"}
          {query.q ? (
            <>
              {" "}
              for “{query.q}”.{" "}
              <button type="button" className="text-deep-gold underline" onClick={() => update({ q: "" })}>
                Clear search
              </button>
            </>
          ) : null}
        </p>
        {products.length > PAGE_SIZE ? (
          <p className="text-sm text-muted">
            Showing {Math.min(shown, products.length)} of {products.length}
          </p>
        ) : null}
      </div>

      {visible.length === 0 ? (
        <p className="mt-8 text-sm text-muted">Nothing in this shelf matches those filters.</p>
      ) : (
        <div className={`mt-4 ${shopTileGrid}`}>
          {visible.map((product) => (
            <AtelierCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {shown < products.length ? (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            className="min-h-11 rounded-full border border-soft-gold bg-white px-6 text-sm font-medium text-ink"
            onClick={() => setShown((count) => count + PAGE_SIZE)}
          >
            Load more
          </button>
        </div>
      ) : null}
    </div>
  );
}
