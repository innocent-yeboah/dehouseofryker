import { ScentNote } from "@/components/house/AtelierCard";
import { StorefrontChrome } from "@/components/house/StorefrontChrome";
import { ProductBuy } from "@/components/shop/ProductBuy";
import { kindLabels } from "@/data/seed-catalog";
import { getProductBySlug } from "@/lib/catalog";
import { whatsappHref } from "@/lib/site";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  return (
    <StorefrontChrome>
      <p className="text-xs uppercase tracking-[0.2em] text-muted">{kindLabels[product.kind]}</p>
      <div className="mt-4 grid gap-10 lg:grid-cols-2">
        <div className="flex min-h-80 items-center justify-center border border-soft-gold bg-white">
          <span className="font-serif text-7xl text-house-gold">{product.name.charAt(0)}</span>
        </div>
        <div>
          <h1 className="font-serif text-4xl">{product.name}</h1>
          <ScentNote className="mt-4">{product.description}</ScentNote>
          <ProductBuy product={product} />
          <p className="mt-8 text-sm text-muted">
            Want this inspired by a scent you already know? That is a custom job —{" "}
            <a
              className="text-deep-gold"
              href={whatsappHref(
                `Hello, I would like a custom ${product.kind === "spray" ? "spray" : "oil"} inspired by a scent I will describe. Size: tell me what you have. Product I was looking at: ${product.name}.`,
              )}
            >
              WhatsApp the house
            </a>
            . Pay when you smell it at the shop.
          </p>
        </div>
      </div>
    </StorefrontChrome>
  );
}
