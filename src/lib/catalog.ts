import { seedProducts } from "@/data/seed-catalog";
import { warnIfFileStore, usingDatabase } from "@/lib/db/config";
import { loadVariantRows } from "@/lib/db/shop-db";
import { compareProducts } from "@/lib/ia";
import { applyCommerce, findVariant, withState } from "@/lib/local-db";
import type { Product } from "@/types/shop";

function overlayDatabase(
  products: Product[],
  rows: Awaited<ReturnType<typeof loadVariantRows>>,
): Product[] {
  const byId = new Map(rows.map((row) => [row.variantId, row]));
  return products.map((product) => ({
    ...product,
    variants: product.variants.map((variant) => {
      const row = byId.get(variant.id);
      if (!row) {
        return variant;
      }
      return {
        ...variant,
        priceGhs: row.priceGhs,
        stockOnHand: row.stockOnHand,
        stockReserved: row.stockReserved,
      };
    }),
  }));
}

export async function getProducts(): Promise<Product[]> {
  const active = seedProducts.filter((item) => item.active);
  if (usingDatabase()) {
    return overlayDatabase(active, await loadVariantRows());
  }
  warnIfFileStore();
  return withState((state) => applyCommerce(active, state));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((item) => item.slug === slug) ?? null;
}

/** Best sellers first. With none flagged, this is newest first. */
export async function getFeatured(): Promise<Product[]> {
  const products = await getProducts();
  return [...products].sort((a, b) => compareProducts("featured", a, b));
}

export async function getRelated(product: Product, limit = 5): Promise<Product[]> {
  const products = await getProducts();
  return products
    .filter((item) => item.section === product.section && item.id !== product.id)
    .sort((a, b) => compareProducts("featured", a, b))
    .slice(0, limit);
}

export async function getVariantContext(variantId: number) {
  const products = await getProducts();
  return findVariant(products, variantId);
}
