import { AtelierCard } from "@/components/house/AtelierCard";
import { shopTileGrid } from "@/components/house/shop-grid";
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
          KÖRMESIC face scrubs (100 g), PUQIANNA facial masks (25 ml), KORMESIC soap,
          HANYUTANG, POUQUR, and SADOER eye masks, FAYANKÔU, SADOER, and POUQUR lip masks,
          vitamin C shower gel (1000 ml), and alcohol-free hair and body mists (290 ml).
        </p>
      ) : null}
      {kind === "oil" ? (
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Almas Play Blue concentrated perfume oil (100 g), Almas 121 VIP, Silver Black, and Almas
          Royal Black concentrated perfume oils (100 g, alcohol-free), Al Kausar Aqua 212 concentrated
          attar (100 g, alcohol-free), Crystal Amber inspired perfume, YZS 50 ml eaux de parfum, YZS
          Wilderness, Carpet of Flowers, Black Crow, Red Gemstone, and Sunshine Amber (35 ml), Veyes
          9 am and Dawn eaux de parfum (100 ml),
          ZARR Forget Me Not by Veyes (100 ml), Nine Black eau de parfum (100 ml), Pink Floral,
          Gold Drip, Black & Gold, Orange Floral, Red Blossom, Coral Floral, Plum Swirl,
          Ivory Floral, Navy & Silver, Maroon & Gold, Dusty Rose, and Red Sunburst eaux de parfum
          (one 30 ml bottle each), Miss Candy perfume, and Maison Crivelli extraits (50 ml).
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
