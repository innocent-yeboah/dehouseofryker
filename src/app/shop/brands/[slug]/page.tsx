import { CatalogShelf } from "@/components/shop/CatalogShelf";
import { getProducts } from "@/lib/catalog";
import { brandIndex, productsForBrand, sectionCatalog } from "@/lib/ia";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const products = await getProducts();
  const brand = brandIndex(products).find((item) => item.slug === slug);
  return { title: brand ? brand.label : "Brand" };
}

export default async function BrandPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const search = await searchParams;
  const products = await getProducts();
  const brand = brandIndex(products).find((item) => item.slug === slug);
  if (!brand) {
    notFound();
  }
  const scoped = productsForBrand(products, slug);
  const present = [...new Set(scoped.map((item) => item.section))].map((id) => ({
    id,
    label: sectionCatalog[id].label,
  }));

  return (
    <CatalogShelf
      title={brand.label}
      intro={`${brand.count} ${brand.count === 1 ? "product" : "products"} from ${brand.label}.`}
      crumbs={[
        { label: "Home", href: "/" },
        { label: "Shop", href: "/shop" },
        { label: "Shop by Brand", href: "/shop/brands" },
        { label: brand.label },
      ]}
      products={scoped}
      facetSections={present}
      searchParams={search}
    />
  );
}
