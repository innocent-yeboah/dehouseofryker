"use client";

import { AtelierCard } from "@/components/house/AtelierCard";
import { shopTileGrid } from "@/components/house/shop-grid";
import {
  PAGE_SIZE,
  brandIndex,
  brandSlug,
  compareProducts,
  isPurchasable,
  minPrice,
  type SectionLink,
  type SortKey,
} from "@/lib/ia";
import type { Product } from "@/types/shop";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

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
  products,
  sectionLinks = [],
  facetSections = [],
  defaultSort = "featured",
}: {
  products: Product[];
  sectionLinks?: SectionLink[];
  /** Filter by section inside this listing, without leaving the page. */
  facetSections?: Array<{ id: string; label: string }>;
  defaultSort?: SortKey;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [shown, setShown] = useState(PAGE_SIZE);

  const section = params.get("section") ?? "";
  const brand = params.get("brand") ?? "";
  const size = params.get("size") ?? "";
  const minRaw = params.get("min") ?? "";
  const maxRaw = params.get("max") ?? "";
  const inStock = params.get("stock") === "1";
  const query = (params.get("q") ?? "").trim().toLowerCase();
  const sortParam = params.get("sort");
  const sort: SortKey = sorts.some((item) => item.id === sortParam)
    ? (sortParam as SortKey)
    : defaultSort;

  const filterKey = `${section}|${brand}|${size}|${minRaw}|${maxRaw}|${inStock}|${sort}|${query}|${pathname}`;

  useEffect(() => {
    setShown(PAGE_SIZE);
  }, [filterKey]);

  const brands = useMemo(() => brandIndex(products), [products]);
  const sizes = useMemo(
    () =>
      [...new Set(products.map((item) => item.size).filter(Boolean))].sort(
        (a, b) => sizeRank(a) - sizeRank(b) || a.localeCompare(b),
      ),
    [products],
  );

  const filtered = useMemo(() => {
    const min = minRaw === "" ? null : Number(minRaw);
    const max = maxRaw === "" ? null : Number(maxRaw);
    return products
      .filter((product) => {
        if (section && product.section !== section) {
          return false;
        }
        if (brand && brandSlug(product.brand) !== brand) {
          return false;
        }
        if (size && product.size !== size) {
          return false;
        }
        const price = minPrice(product);
        if (min !== null && !Number.isNaN(min) && price < min) {
          return false;
        }
        if (max !== null && !Number.isNaN(max) && price > max) {
          return false;
        }
        if (inStock && !isPurchasable(product)) {
          return false;
        }
        if (query) {
          const haystack = [product.displayName, product.name, product.description, product.brand, product.size]
            .join(" ")
            .toLowerCase();
          if (!haystack.includes(query)) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => compareProducts(sort, a, b));
  }, [products, section, brand, size, minRaw, maxRaw, inStock, query, sort]);

  const visible = filtered.slice(0, shown);

  function update(next: Record<string, string | null>) {
    const sp = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(next)) {
      if (!value) {
        sp.delete(key);
      } else {
        sp.set(key, value);
      }
    }
    const qs = sp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
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
              value={section}
              onChange={(event) => update({ section: event.target.value || null })}
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
          <select
            className={selectClass}
            value={brand}
            onChange={(event) => update({ brand: event.target.value || null })}
          >
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
          <select
            className={selectClass}
            value={size}
            onChange={(event) => update({ size: event.target.value || null })}
          >
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
            value={minRaw}
            onChange={(event) => update({ min: event.target.value || null })}
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
            value={maxRaw}
            onChange={(event) => update({ max: event.target.value || null })}
          />
        </label>
        <label className="col-span-2 flex min-h-11 items-center gap-2 self-end rounded-lg border border-soft-gold bg-white px-3 text-sm lg:w-auto">
          <input
            type="checkbox"
            className="h-4 w-4 accent-[#8c6a2b]"
            checked={inStock}
            onChange={(event) => update({ stock: event.target.checked ? "1" : null })}
          />
          In stock only
        </label>
        <label className="col-span-2 block min-w-0 lg:w-52">
          <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-muted">Sort</span>
          <select
            className={selectClass}
            value={sort}
            onChange={(event) =>
              update({ sort: event.target.value === defaultSort ? null : event.target.value })
            }
          >
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
          {filtered.length} {filtered.length === 1 ? "product" : "products"}
          {query ? (
            <>
              {" "}
              for “{params.get("q")}”.{" "}
              <button type="button" className="text-deep-gold underline" onClick={() => update({ q: null })}>
                Clear search
              </button>
            </>
          ) : null}
        </p>
        {filtered.length > PAGE_SIZE ? (
          <p className="text-sm text-muted">
            Showing {Math.min(shown, filtered.length)} of {filtered.length}
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

      {shown < filtered.length ? (
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
