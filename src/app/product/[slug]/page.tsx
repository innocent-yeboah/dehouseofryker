import { AtelierCard, ScentNote } from "@/components/house/AtelierCard";
import { ProductImage } from "@/components/house/ProductImage";
import { shopTileGrid } from "@/components/house/shop-grid";
import { StorefrontChrome } from "@/components/house/StorefrontChrome";
import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import { ProductBuy } from "@/components/shop/ProductBuy";
import { getProductBySlug, getRelated } from "@/lib/catalog";
import { departmentCatalog, departmentPath, sectionCatalog, sectionPath } from "@/lib/ia";
import { copy, whatsappHref } from "@/lib/site";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return { title: product?.displayName ?? "Product" };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  const related = await getRelated(product);
  const photo = product.images[0];
  const department = departmentCatalog[product.department];
  const section = sectionCatalog[product.section];
  const customKind =
    product.section === "perfume_oils" ? "perfume oil" : product.department === "fragrance" ? "perfume" : "scent";

  return (
    <StorefrontChrome>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: department.label, href: departmentPath(department.id) },
          { label: section.label, href: sectionPath(section.id) },
          { label: product.displayName },
        ]}
      />
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-xl border border-soft-gold bg-white">
          <div className="absolute inset-6 sm:inset-10">
            {photo ? (
              <ProductImage
                src={photo}
                alt={product.displayName}
                sizes="(min-width: 1024px) 42vw, 100vw"
                priority
              />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center font-serif text-7xl text-house-gold">
                {product.displayName.charAt(0)}
              </span>
            )}
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            {department.label} · {section.label}
          </p>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl">{product.displayName}</h1>
          <ScentNote className="mt-4">{product.description}</ScentNote>
          <ProductBuy product={product} />
          <div className="mt-8 space-y-2 rounded-xl border border-soft-gold bg-white px-4 py-4 text-sm text-muted">
            <p className="font-medium text-ink">Delivery and payment</p>
            <p>{copy.heroFulfillment}</p>
            <p>{copy.deliveryGoodsOnly}</p>
            <p>MTN MoMo for products. Cash when you collect at the shop.</p>
          </div>
          <p className="mt-8 text-sm text-muted">
            Want this inspired by a scent you already know? That is a custom job —{" "}
            <a
              className="text-deep-gold"
              href={whatsappHref(
                `Hello, I would like a custom ${customKind} inspired by a scent I will describe. Size: tell me what you have. Product I was looking at: ${product.displayName}.`,
              )}
            >
              WhatsApp the house
            </a>
            . Pay when you smell it at the shop.
          </p>
        </div>
      </div>
      {related.length > 0 ? (
        <section className="mt-14">
          <h2 className="font-serif text-2xl sm:text-3xl">You may also like</h2>
          <div className={`mt-5 ${shopTileGrid}`}>
            {related.map((item) => (
              <AtelierCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </StorefrontChrome>
  );
}
