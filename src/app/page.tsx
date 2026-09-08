import { AtelierCard, shopTileGrid } from "@/components/house/AtelierCard";
import { HouseHero } from "@/components/house/HouseHero";
import { StorefrontChrome } from "@/components/house/StorefrontChrome";
import { getFeatured, getProducts } from "@/lib/catalog";
import { copy, site, whatsappHref } from "@/lib/site";
import Link from "next/link";

export default async function HomePage() {
  const [featured, products] = await Promise.all([getFeatured(), getProducts()]);
  const readyPackaging = products.filter((item) => item.kind === "packaging");

  return (
    <StorefrontChrome fullBleed={<HouseHero />}>
      <section>
        <h2 className="font-serif text-2xl sm:text-3xl">In the house</h2>
        <div className={`mt-4 ${shopTileGrid}`}>
          {featured.map((product) => (
            <AtelierCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <p className="mt-8 text-sm text-muted">
        {copy.heroFulfillment}{" "}
        <Link href="/policies" className="text-deep-gold">
          How pickup and delivery work
        </Link>
        {" · "}
        <a className="text-deep-gold" href={site.mapsUrl}>
          Open map
        </a>
      </p>

      {readyPackaging.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-serif text-2xl sm:text-3xl">Ready packaging</h2>
          <p className="mt-2 text-sm text-muted">
            Boxes and pouches you can add to the cart. For your own brand on a bottle, WhatsApp a
            branding job.
          </p>
          <div className={`mt-4 ${shopTileGrid}`}>
            {readyPackaging.map((product) => (
              <AtelierCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ) : null}

      <p className="mt-12 text-sm text-muted">
        Outside Ghana?{" "}
        <a className="text-deep-gold" href={whatsappHref("Hello, I am outside Ghana and would like to order.")}>
          WhatsApp the house
        </a>{" "}
        — the shop checkout is Ghana only.
      </p>
    </StorefrontChrome>
  );
}
