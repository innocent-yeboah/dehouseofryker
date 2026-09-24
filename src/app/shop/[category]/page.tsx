import { AtelierCard, shopTileGrid } from "@/components/house/AtelierCard";
import { StorefrontChrome } from "@/components/house/StorefrontChrome";
import { kindFromPath, kindLabels } from "@/data/seed-catalog";
import { getProducts } from "@/lib/catalog";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ category: string }>;
};

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const kind = kindFromPath(category);
  if (!kind) {
    notFound();
  }
  const products = (await getProducts()).filter((item) => item.kind === kind);

  return (
    <StorefrontChrome>
      <h1 className="font-serif text-3xl sm:text-4xl">{kindLabels[kind]}</h1>
      {kind === "format" ? (
        <p className="mt-2 max-w-2xl text-sm text-muted">
          KÖRMESIC face scrubs (100 g), PUQIANNA facial masks (25 ml), KORMESIC soap (100 g),
          and alcohol-free hair and body mists (290 ml).
        </p>
      ) : null}
      {products.length === 0 ? (
        <p className="mt-8 text-sm text-muted">Nothing in this category right now.</p>
      ) : (
        <div className={`mt-8 ${shopTileGrid}`}>
          {products.map((product) => (
            <AtelierCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </StorefrontChrome>
  );
}
