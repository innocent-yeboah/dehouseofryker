import { seedProducts } from "@/data/seed-catalog";
import { availabilityFor } from "@/lib/availability";
import type { DepartmentId, Product, SectionId } from "@/types/shop";

export const PAGE_SIZE = 24;

export type SortKey = "featured" | "newest" | "price-asc" | "price-desc";

export type Crumb = { label: string; href?: string };

export type SectionLink = { href: string; label: string; current: boolean };

export type BrandEntry = { slug: string; label: string; count: number };

export type NavGroup = {
  href: string;
  label: string;
  sections: Array<{ href: string; label: string }>;
};

type SectionDef = {
  id: SectionId;
  label: string;
  slug: string;
  department: DepartmentId;
  hideWhenEmpty: boolean;
  intro: string;
};

type DepartmentDef = {
  id: DepartmentId;
  label: string;
  slug: string;
  hideWhenEmpty: boolean;
  eyebrow: string;
  intro: string;
  tone: string;
};

export const sectionCatalog: Record<SectionId, SectionDef> = {
  perfumes: {
    id: "perfumes",
    label: "Perfumes",
    slug: "perfumes",
    department: "fragrance",
    hideWhenEmpty: false,
    intro: "Spray bottles. Filter by 30 ml, 35 ml, 50 ml, or 100 ml.",
  },
  perfume_oils: {
    id: "perfume_oils",
    label: "Perfume Oils & Attars",
    slug: "perfume-oils",
    department: "fragrance",
    hideWhenEmpty: false,
    intro: "Concentrated perfume oils and attars, including 100 g bottles.",
  },
  gift_sets: {
    id: "gift_sets",
    label: "Gift Sets",
    slug: "gift-sets",
    department: "fragrance",
    hideWhenEmpty: true,
    intro: "Gift sets will show here when they are on the shelf.",
  },
  face: {
    id: "face",
    label: "Face",
    slug: "face",
    department: "skincare",
    hideWhenEmpty: false,
    intro: "Sheet masks, face scrubs, and whitening care.",
  },
  lips_eyes: {
    id: "lips_eyes",
    label: "Lips & Eyes",
    slug: "lips-eyes",
    department: "skincare",
    hideWhenEmpty: false,
    intro: "Lip masks and eye patches.",
  },
  body: {
    id: "body",
    label: "Body",
    slug: "body",
    department: "skincare",
    hideWhenEmpty: false,
    intro: "Soaps, shower gel, and hair and body mists.",
  },
  supplements: {
    id: "supplements",
    label: "Supplements",
    slug: "supplements",
    department: "wellness",
    hideWhenEmpty: false,
    intro: "Everyday wellness supplements.",
  },
  empty_bottles: {
    id: "empty_bottles",
    label: "Empty bottles",
    slug: "empty-bottles",
    department: "resellers",
    hideWhenEmpty: true,
    intro: "Empty bottles for resellers.",
  },
  packaging: {
    id: "packaging",
    label: "Packaging",
    slug: "packaging",
    department: "resellers",
    hideWhenEmpty: true,
    intro: "Packaging for resellers.",
  },
};

export const departmentCatalog: Record<DepartmentId, DepartmentDef> = {
  fragrance: {
    id: "fragrance",
    label: "Fragrance",
    slug: "fragrance",
    hideWhenEmpty: false,
    eyebrow: "Scent",
    intro: "Perfumes, perfume oils, and attars.",
    tone: "bg-[#1a1612] text-white",
  },
  skincare: {
    id: "skincare",
    label: "Skincare",
    slug: "skincare",
    hideWhenEmpty: false,
    eyebrow: "Skin",
    intro: "Face, lips and eyes, and body.",
    tone: "bg-[#efe6d4] text-ink",
  },
  wellness: {
    id: "wellness",
    label: "Wellness",
    slug: "wellness",
    hideWhenEmpty: false,
    eyebrow: "Daily",
    intro: "Everyday wellness supplements.",
    tone: "bg-[#c6a15b] text-ink",
  },
  resellers: {
    id: "resellers",
    label: "For Resellers",
    slug: "for-resellers",
    hideWhenEmpty: true,
    eyebrow: "Trade",
    intro: "Empty bottles and packaging.",
    tone: "bg-[#8c6a2b] text-white",
  },
};

const departmentOrder: DepartmentId[] = ["fragrance", "skincare", "wellness", "resellers"];

export const quickLinks = [
  { href: "/shop/new-arrivals", label: "New Arrivals" },
  { href: "/shop/best-sellers", label: "Best Sellers" },
  { href: "/shop/brands", label: "Shop by Brand" },
] as const;

export function activeCatalog(): Product[] {
  return seedProducts.filter((item) => item.active);
}

export function countSection(products: Product[], section: SectionId): number {
  return products.filter((item) => item.section === section).length;
}

export function departmentPath(id: DepartmentId): string {
  return `/shop/${departmentCatalog[id].slug}`;
}

export function sectionPath(id: SectionId): string {
  const section = sectionCatalog[id];
  return `${departmentPath(section.department)}/${section.slug}`;
}

export function sectionsIn(department: DepartmentId): SectionDef[] {
  return Object.values(sectionCatalog).filter((item) => item.department === department);
}

export function visibleDepartments(products: Product[]): DepartmentDef[] {
  return departmentOrder
    .map((id) => departmentCatalog[id])
    .filter((item) => {
      const count = products.filter((product) => product.department === item.id).length;
      if (count === 0 && item.hideWhenEmpty) {
        return false;
      }
      return true;
    });
}

export function visibleSections(products: Product[], department?: DepartmentId): SectionDef[] {
  return Object.values(sectionCatalog).filter((section) => {
    if (department && section.department !== department) {
      return false;
    }
    const count = countSection(products, section.id);
    if (count === 0 && section.hideWhenEmpty) {
      return false;
    }
    return true;
  });
}

export function storefrontMenu(products: Product[] = activeCatalog()): {
  departments: NavGroup[];
  quick: Array<{ href: string; label: string }>;
} {
  const departments = visibleDepartments(products).map((department) => ({
    href: departmentPath(department.id),
    label: department.label,
    sections: visibleSections(products, department.id).map((section) => ({
      href: sectionPath(section.id),
      label: section.label,
    })),
  }));
  return { departments, quick: [...quickLinks] };
}

export function listingPaths(products: Product[] = activeCatalog()): string[] {
  const paths = ["/shop", "/shop/new-arrivals", "/shop/best-sellers", "/shop/brands"];
  for (const department of visibleDepartments(products)) {
    paths.push(departmentPath(department.id));
  }
  for (const section of visibleSections(products)) {
    paths.push(sectionPath(section.id));
  }
  for (const brand of brandIndex(products)) {
    paths.push(`/shop/brands/${brand.slug}`);
  }
  return paths;
}

export function departmentFromSlug(slug: string): DepartmentDef | null {
  return Object.values(departmentCatalog).find((item) => item.slug === slug) ?? null;
}

export function sectionFromSlug(department: DepartmentId, slug: string): SectionDef | null {
  return (
    sectionsIn(department).find((item) => item.slug === slug) ?? null
  );
}

export function isPurchasable(product: Product): boolean {
  return product.variants.some((variant) => availabilityFor(variant) !== "unavailable");
}

export function minPrice(product: Product): number {
  if (product.variants.length === 0) {
    return 0;
  }
  return Math.min(...product.variants.map((variant) => variant.priceGhs));
}

export function compareProducts(sort: SortKey, a: Product, b: Product): number {
  const stock = Number(!isPurchasable(a)) - Number(!isPurchasable(b));
  if (stock !== 0) {
    return stock;
  }
  if (sort === "price-asc" || sort === "price-desc") {
    const price = sort === "price-asc" ? minPrice(a) - minPrice(b) : minPrice(b) - minPrice(a);
    if (price !== 0) {
      return price;
    }
  }
  if (sort === "featured") {
    const best = Number(b.bestSeller) - Number(a.bestSeller);
    if (best !== 0) {
      return best;
    }
  }
  return b.addedRank - a.addedRank;
}

export function brandSlug(brand: string): string {
  const base = brand
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "house";
}

function preferredBrandLabel(slug: string, labels: Map<string, number>): string {
  if (slug === "kormesic") {
    return "KORMESIC";
  }
  return [...labels.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0] ?? slug;
}

export function brandIndex(products: Product[]): BrandEntry[] {
  const groups = new Map<string, { labels: Map<string, number>; count: number }>();
  for (const product of products) {
    const slug = brandSlug(product.brand);
    const group = groups.get(slug) ?? { labels: new Map<string, number>(), count: 0 };
    group.labels.set(product.brand, (group.labels.get(product.brand) ?? 0) + 1);
    group.count += 1;
    groups.set(slug, group);
  }
  return [...groups.entries()]
    .map(([slug, group]) => ({
      slug,
      label: preferredBrandLabel(slug, group.labels),
      count: group.count,
    }))
    .sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: "base" }));
}

export function productsForBrand(products: Product[], slug: string): Product[] {
  return products.filter((item) => brandSlug(item.brand) === slug);
}

export function sectionLinks(
  products: Product[],
  options: { department?: DepartmentId; current?: SectionId; allHref?: string },
): SectionLink[] {
  const sections = visibleSections(products, options.department);
  const links: SectionLink[] = [];
  if (options.allHref) {
    links.push({
      href: options.allHref,
      label: "All",
      current: !options.current,
    });
  }
  for (const section of sections) {
    links.push({
      href: sectionPath(section.id),
      label: section.label,
      current: section.id === options.current,
    });
  }
  return links;
}

export type ListingQuery = {
  section: string;
  brand: string;
  size: string;
  min: string;
  max: string;
  stock: boolean;
  sort: SortKey;
  q: string;
};

export function normalizeSearch(
  raw: Record<string, string | string[] | undefined> | undefined,
  defaultSort: SortKey,
): ListingQuery {
  const one = (key: string) => {
    const value = raw?.[key];
    return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
  };
  const sortValue = one("sort");
  const sort: SortKey =
    sortValue === "featured" || sortValue === "newest" || sortValue === "price-asc" || sortValue === "price-desc"
      ? sortValue
      : defaultSort;
  return {
    section: one("section"),
    brand: one("brand"),
    size: one("size"),
    min: one("min"),
    max: one("max"),
    stock: one("stock") === "1",
    sort,
    q: one("q"),
  };
}

export function filterProducts(products: Product[], query: ListingQuery): Product[] {
  const min = query.min === "" ? null : Number(query.min);
  const max = query.max === "" ? null : Number(query.max);
  const q = query.q.trim().toLowerCase();
  return products
    .filter((product) => {
      if (query.section && product.section !== query.section) {
        return false;
      }
      if (query.brand && brandSlug(product.brand) !== query.brand) {
        return false;
      }
      if (query.size && product.size !== query.size) {
        return false;
      }
      const price = minPrice(product);
      if (min !== null && !Number.isNaN(min) && price < min) {
        return false;
      }
      if (max !== null && !Number.isNaN(max) && price > max) {
        return false;
      }
      if (query.stock && !isPurchasable(product)) {
        return false;
      }
      if (q) {
        const haystack = [product.displayName, product.name, product.description, product.brand, product.size]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => compareProducts(query.sort, a, b));
}

export function homeRails(products: Product[]): { bestSellers: Product[]; newArrivals: Product[] } {
  const featured = [...products].sort((a, b) => compareProducts("featured", a, b));
  const newest = [...products].sort((a, b) => compareProducts("newest", a, b));
  return {
    bestSellers: featured.slice(0, 5),
    newArrivals: newest.slice(0, 8),
  };
}
