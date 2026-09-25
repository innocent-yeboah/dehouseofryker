import { CatalogShelf } from "@/components/shop/CatalogShelf";
import { getProducts } from "@/lib/catalog";
import {
  compareProducts,
  departmentCatalog,
  departmentFromSlug,
  departmentPath,
  sectionLinks,
  visibleSections,
} from "@/lib/ia";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ category: string }>;
};

const specials: Record<string, { title: string; intro: string; sort: "featured" | "newest" }> = {
  "new-arrivals": {
    title: "New Arrivals",
    intro: "The newest additions to the shelf.",
    sort: "newest",
  },
  "best-sellers": {
    title: "Best Sellers",
    intro: "A short list from the house. Until best sellers are chosen, this follows the newest arrivals.",
    sort: "featured",
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const special = specials[category];
  if (special) {
    return { title: special.title };
  }
  const department = departmentFromSlug(category);
  if (!department) {
    return {};
  }
  return { title: department.label };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const products = await getProducts();
  const special = specials[category];

  if (special) {
    const ordered = [...products].sort((a, b) => compareProducts(special.sort, a, b));
    return (
      <CatalogShelf
        title={special.title}
        intro={special.intro}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: special.title },
        ]}
        products={ordered}
        sectionLinks={visibleSections(products).map((section) => ({
          href: `/shop/${departmentCatalog[section.department].slug}/${section.slug}`,
          label: section.label,
          current: false,
        }))}
        defaultSort={special.sort}
      />
    );
  }

  const department = departmentFromSlug(category);
  if (!department) {
    notFound();
  }

  const scoped = products.filter((item) => item.department === department.id);
  return (
    <CatalogShelf
      title={department.label}
      intro={department.intro}
      crumbs={[
        { label: "Home", href: "/" },
        { label: "Shop", href: "/shop" },
        { label: department.label },
      ]}
      products={scoped}
      sectionLinks={sectionLinks(products, {
        department: department.id,
        allHref: departmentPath(department.id),
      })}
    />
  );
}
