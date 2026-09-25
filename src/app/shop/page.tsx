import { CatalogShelf } from "@/components/shop/CatalogShelf";
import { getProducts } from "@/lib/catalog";
import { sectionPath, visibleSections } from "@/lib/ia";

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <CatalogShelf
      title="Shop"
      intro="House names only. Custom inspired-by blends are on WhatsApp, not in this cart."
      crumbs={[{ label: "Home", href: "/" }, { label: "Shop" }]}
      products={products}
      sectionLinks={visibleSections(products).map((section) => ({
        href: sectionPath(section.id),
        label: section.label,
        current: false,
      }))}
    />
  );
}
