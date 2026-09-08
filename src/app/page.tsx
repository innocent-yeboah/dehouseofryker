import { AtelierCard } from "@/components/house/AtelierCard";
import { StorefrontChrome } from "@/components/house/StorefrontChrome";
import { getFeatured, getProducts } from "@/lib/catalog";
import { copy, site, whatsappHref } from "@/lib/site";
import Link from "next/link";

export default async function HomePage() {
  const [featured, products] = await Promise.all([getFeatured(), getProducts()]);
  const readyPackaging = products.filter((item) => item.kind === "packaging");

  return (
    <StorefrontChrome>
      <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-deep-gold">Accra perfume house</p>
          <h1 className="mt-3 font-serif text-5xl text-ink md:text-6xl">{site.name}</h1>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-muted">{site.tagline}</p>
          <p className="mt-4 text-sm text-ink">
            Ready oils, sprays, other formats, empty bottles, and packaging — same prices as the
            shop. Custom blends are not sold in the cart. Tell us on WhatsApp, then smell and pay
            here.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/shop" className="bg-house-gold px-6 py-3 text-sm font-medium text-ink">
              Shop the collection
            </Link>
            <Link href="/customize" className="border border-house-gold px-6 py-3 text-sm text-deep-gold">
              Request a custom blend
            </Link>
          </div>
        </div>
        <div className="border border-soft-gold bg-white p-8">
          <h2 className="font-serif text-2xl">Pickup and delivery</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Collect at the Accra shop when we say it is ready. Or choose Ghana delivery — you pay
            for products only. We call to agree the rider fee. {copy.deliveryGoodsOnly}
          </p>
          <p className="mt-4 text-sm">
            {site.address}
            <br />
            {site.hours}
          </p>
          <a className="mt-3 inline-block text-sm text-deep-gold" href={site.mapsUrl}>
            Open map
          </a>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-3xl">Featured</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <AtelierCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {readyPackaging.length > 0 ? (
        <section className="mt-16">
          <h2 className="font-serif text-3xl">Ready packaging</h2>
          <p className="mt-2 text-sm text-muted">
            Boxes and pouches you can add to the cart. For your own brand on a bottle, WhatsApp a
            branding job.
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
