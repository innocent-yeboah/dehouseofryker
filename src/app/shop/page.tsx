import { CatalogShelf } from "@/components/shop/CatalogShelf";
import { getProducts } from "@/lib/catalog";
import { sectionPath, visibleSections } from "@/lib/ia";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ShopPage({ searchParams }: PageProps) {
  const products = await getProducts();
  const search = await searchParams;

  return (
    <CatalogShelf
      title="Shop"
      intro="House names only. Custom inspired-by blends are on WhatsApp, not in this cart."
      crumbs={[{ label: "Home", href: "/" }, { label: "Shop" }]}
      products={products}
      searchParams={search}
      sectionLinks={visibleSections(products).map((section) => ({
        href: sectionPath(section.id),
        label: section.label,
        current: false,
      }))}
    />
  );
}
