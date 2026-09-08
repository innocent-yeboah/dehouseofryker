import { seedProducts } from "@/data/seed-catalog";
import { applyStock, findVariant, withState } from "@/lib/local-db";
import type { Product } from "@/types/shop";

export async function getProducts(): Promise<Product[]> {
  return withState((state) => applyStock(seedProducts.filter((item) => item.active), state.stock));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((item) => item.slug === slug) ?? null;
}

export async function getFeatured(): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((item) => item.featured);
}

export async function getVariantContext(variantId: number) {
  const products = await getProducts();
  return findVariant(products, variantId);
}
