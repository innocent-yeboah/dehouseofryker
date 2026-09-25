import { CatalogShelf } from "@/components/shop/CatalogShelf";
import { getProducts } from "@/lib/catalog";
import { departmentFromSlug, departmentPath, sectionFromSlug, sectionLinks } from "@/lib/ia";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ category: string; section: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, section: sectionSlug } = await params;
  const department = departmentFromSlug(category);
  const section = department ? sectionFromSlug(department.id, sectionSlug) : null;
  if (!section) {
    return {};
  }
  return { title: section.label };
}

export default async function SectionPage({ params }: PageProps) {
  const { category, section: sectionSlug } = await params;
  const department = departmentFromSlug(category);
  if (!department) {
    notFound();
  }
  const section = sectionFromSlug(department.id, sectionSlug);
  if (!section) {
    notFound();
  }

  const products = await getProducts();
  const scoped = products.filter((item) => item.section === section.id);

  return (
    <CatalogShelf
      title={section.label}
      intro={section.intro}
      crumbs={[
        { label: "Home", href: "/" },
        { label: "Shop", href: "/shop" },
        { label: department.label, href: departmentPath(department.id) },
        { label: section.label },
      ]}
      products={scoped}
      sectionLinks={sectionLinks(products, {
        department: department.id,
        current: section.id,
        allHref: departmentPath(department.id),
      })}
    />
  );
}
