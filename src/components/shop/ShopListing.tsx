"use client";

import { AtelierCard } from "@/components/house/AtelierCard";
import { shopTileGrid } from "@/components/house/shop-grid";
import {
  PAGE_SIZE,
  brandIndex,
  filterProducts,
  type ListingQuery,
  type SectionLink,
  type SortKey,
} from "@/lib/ia";
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

type Draft = {
  section: string;
  brand: string;
  size: string;
  min: string;
  max: string;
  stock: boolean;
  sort: SortKey;
};

function sizeRank(size: string): number {
  const match = size.match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : 100000;
}

function draftFromQuery(query: ListingQuery): Draft {
  return {
    section: query.section,
    brand: query.brand,
    size: query.size,
    min: query.min,
    max: query.max,
    stock: query.stock,
    sort: query.sort,
  };
}

function activeFilterCount(query: ListingQuery, defaultSort: SortKey, sectionFacet: boolean): number {
  let count = 0;
  if (sectionFacet && query.section) {
    count += 1;
  }
  if (query.brand) {
    count += 1;
  }
  if (query.size) {
    count += 1;
  }
  if (query.min) {
    count += 1;
  }
  if (query.max) {
    count += 1;
  }
  if (query.stock) {
    count += 1;
  }
  if (query.sort !== defaultSort) {
    count += 1;
  }
  return count;
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
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(() => draftFromQuery(query));

  useEffect(() => {
    setShown(PAGE_SIZE);
    setMinDraft(query.min);
    setMaxDraft(query.max);
    setDraft(draftFromQuery(query));
    setFiltersOpen(false);
  }, [query.section, query.brand, query.size, query.min, query.max, query.stock, query.sort, query.q, pathname]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    function closeOnDesktop() {
      if (media.matches) {
        setFiltersOpen(false);
      }
    }
    media.addEventListener("change", closeOnDesktop);
    return () => media.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!filtersOpen) {
      return;
    }
    const scrollY = window.scrollY;
    const previous = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      overflow: document.body.style.overflow,
      width: document.body.style.width,
    };
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setFiltersOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.position = previous.position;
      document.body.style.top = previous.top;
      document.body.style.left = previous.left;
      document.body.style.right = previous.right;
      document.body.style.overflow = previous.overflow;
      document.body.style.width = previous.width;
      window.scrollTo(0, scrollY);
      window.removeEventListener("keydown", onKey);
    };
  }, [filtersOpen]);

  const brands = brandIndex(universe);
  const sizes = [...new Set(universe.map((item) => item.size).filter(Boolean))].sort(
    (a, b) => sizeRank(a) - sizeRank(b) || a.localeCompare(b),
  );
  const visible = products.slice(0, shown);
  const appliedCount = activeFilterCount(query, defaultSort, facetSections.length > 0);
  const draftQuery: ListingQuery = {
    ...query,
    section: draft.section,
    brand: draft.brand,
    size: draft.size,
    min: draft.min,
    max: draft.max,
    stock: draft.stock,
    sort: draft.sort,
  };
  const draftCount = filterProducts(universe, draftQuery).length;

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

  function openFilters() {
    setDraft(draftFromQuery(query));
    setFiltersOpen(true);
  }

  function applyDraft() {
    setFiltersOpen(false);
    update({
      section: draft.section,
      brand: draft.brand,
      size: draft.size,
      min: draft.min,
      max: draft.max,
      stock: draft.stock ? "1" : "",
      sort: draft.sort,
    });
  }

  function clearDraft() {
    setDraft({
      section: "",
      brand: "",
      size: "",
      min: "",
      max: "",
      stock: false,
      sort: defaultSort,
    });
  }

  const selectClass =
    "min-h-11 w-full rounded-lg border border-soft-gold bg-white px-3 text-sm text-ink";

  const controls = (mode: "live" | "sheet") => {
    const sheet = mode === "sheet";
    const section = sheet ? draft.section : query.section;
    const brand = sheet ? draft.brand : query.brand;
    const size = sheet ? draft.size : query.size;
    const min = sheet ? draft.min : minDraft;
    const max = sheet ? draft.max : maxDraft;
    const stock = sheet ? draft.stock : query.stock;
    const sort = sheet ? draft.sort : query.sort;
    return (
      <div className={sheet ? "grid grid-cols-1 gap-3" : "hidden md:grid md:grid-cols-2 md:gap-2 lg:flex lg:flex-wrap lg:items-end"}>
        {sheet && sectionLinks.length > 0 ? (
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
                  onClick={() => setFiltersOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
        {facetSections.length > 0 ? (
          <label className={sheet ? "block" : "col-span-2 block min-w-0 lg:w-52"}>
            <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-muted">Section</span>
            <select
              className={selectClass}
              value={section}
              onChange={(event) => {
                const value = event.target.value;
                if (sheet) {
                  setDraft((current) => ({ ...current, section: value }));
                } else {
                  update({ section: value });
                }
              }}
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
        <label className={sheet ? "block" : "block min-w-0 lg:w-44"}>
          <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-muted">Brand</span>
          <select
            className={selectClass}
            value={brand}
            onChange={(event) => {
              const value = event.target.value;
              if (sheet) {
                setDraft((current) => ({ ...current, brand: value }));
              } else {
                update({ brand: value });
              }
            }}
          >
            <option value="">All brands</option>
            {brands.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className={sheet ? "block" : "block min-w-0 lg:w-40"}>
          <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-muted">Size</span>
          <select
            className={selectClass}
            value={size}
            onChange={(event) => {
              const value = event.target.value;
              if (sheet) {
                setDraft((current) => ({ ...current, size: value }));
              } else {
                update({ size: value });
              }
            }}
          >
            <option value="">All sizes</option>
            {sizes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className={sheet ? "block" : "block min-w-0 lg:w-28"}>
          <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-muted">Min GHS</span>
          <input
            className={selectClass}
            inputMode="numeric"
            type="number"
            min={0}
            placeholder="0"
            value={min}
            onChange={(event) => {
              const value = event.target.value;
              if (sheet) {
                setDraft((current) => ({ ...current, min: value }));
              } else {
                setMinDraft(value);
              }
            }}
            onBlur={() => {
              if (!sheet && minDraft !== query.min) {
                update({ min: minDraft });
              }
            }}
          />
        </label>
        <label className={sheet ? "block" : "block min-w-0 lg:w-28"}>
          <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-muted">Max GHS</span>
          <input
            className={selectClass}
            inputMode="numeric"
            type="number"
            min={0}
            placeholder="Any"
            value={max}
            onChange={(event) => {
              const value = event.target.value;
              if (sheet) {
                setDraft((current) => ({ ...current, max: value }));
              } else {
                setMaxDraft(value);
              }
            }}
            onBlur={() => {
              if (!sheet && maxDraft !== query.max) {
                update({ max: maxDraft });
              }
            }}
          />
        </label>
        <label
          className={
            sheet
              ? "flex min-h-11 items-center gap-2 rounded-lg border border-soft-gold bg-white px-3 text-sm"
              : "col-span-2 flex min-h-11 items-center gap-2 self-end rounded-lg border border-soft-gold bg-white px-3 text-sm lg:w-auto"
          }
        >
          <input
            type="checkbox"
            className="h-4 w-4 accent-[#8c6a2b]"
            checked={stock}
            onChange={(event) => {
              const checked = event.target.checked;
              if (sheet) {
                setDraft((current) => ({ ...current, stock: checked }));
              } else {
                update({ stock: checked ? "1" : "" });
              }
            }}
          />
          In stock only
        </label>
        <label className={sheet ? "block" : "col-span-2 block min-w-0 lg:w-52"}>
          <span className="mb-1 block text-xs uppercase tracking-[0.14em] text-muted">Sort</span>
          <select
            className={selectClass}
            value={sort}
            onChange={(event) => {
              const value = event.target.value as SortKey;
              if (sheet) {
                setDraft((current) => ({ ...current, sort: value }));
              } else {
                update({ sort: value });
              }
            }}
          >
            {sorts.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    );
  };

  return (
    <div className="mt-6">
      {sectionLinks.length > 0 ? (
        <div className="hidden md:block">
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

      <div className={sectionLinks.length > 0 ? "md:mt-4" : undefined}>{controls("live")}</div>

      <div className="mt-4 md:hidden">
        <button
          type="button"
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-soft-gold bg-white px-4 text-sm font-medium text-ink"
          aria-expanded={filtersOpen}
          aria-controls="filter-sort-drawer"
          onClick={openFilters}
        >
          Filter & sort
          {appliedCount > 0 ? (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-deep-gold px-1.5 text-xs font-semibold text-white">
              {appliedCount}
            </span>
          ) : null}
        </button>
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

      {filtersOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40"
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
          />
          <div
            id="filter-sort-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="filter-sort-title"
            className="absolute inset-x-0 bottom-0 flex max-h-[92dvh] flex-col rounded-t-2xl bg-[#f3f1ec] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-soft-gold px-4 py-3">
              <h2 id="filter-sort-title" className="font-serif text-2xl text-ink">
                Filter & sort
              </h2>
              <button
                type="button"
                className="inline-flex min-h-11 min-w-11 items-center justify-center text-lg text-ink"
                aria-label="Close"
                onClick={() => setFiltersOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">{controls("sheet")}</div>
            <div className="flex gap-2 border-t border-soft-gold bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                className="min-h-11 flex-1 rounded-full border border-soft-gold bg-white px-4 text-sm font-medium text-ink"
                onClick={clearDraft}
              >
                Clear all
              </button>
              <button
                type="button"
                className="min-h-11 flex-[1.4] rounded-full bg-deep-gold px-4 text-sm font-medium text-white"
                onClick={applyDraft}
              >
                Show {draftCount} {draftCount === 1 ? "product" : "products"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
