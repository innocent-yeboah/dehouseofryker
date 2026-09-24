import { HouseNav } from "@/components/house/HouseNav";
import { MobileDock } from "@/components/house/MobileDock";
import { site, whatsappHref } from "@/lib/site";
import Link from "next/link";

export function HouseFooter() {
  return (
    <footer className="mt-10 border-t border-black/5 bg-ink text-white sm:mt-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="font-serif text-2xl">{site.name}</p>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            Accra perfume house. Oils, sprays, other formats, empty bottles, and ready packaging.
            Custom blends by WhatsApp — pay when you smell them.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-house-gold">Shop</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-white/80">
            <Link href="/shop" className="hover:text-house-gold">
              All products
            </Link>
            <Link href="/shop/oils" className="hover:text-house-gold">
              Oils
            </Link>
            <Link href="/shop/sprays" className="hover:text-house-gold">
              Sprays
            </Link>
            <Link href="/customize" className="hover:text-house-gold">
              Custom blend
            </Link>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-house-gold">Help</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-white/80">
            <Link href="/order/find" className="hover:text-house-gold">
              Track your order
            </Link>
            <Link href="/policies" className="hover:text-house-gold">
              Policies
            </Link>
            <Link href="/contact" className="hover:text-house-gold">
              Contact
            </Link>
            <a
              href={whatsappHref("Hello, I have a question about De House of Ryker.")}
              className="hover:text-house-gold"
            >
              WhatsApp
            </a>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-house-gold">Visit</p>
          <div className="mt-3 space-y-2 text-sm text-white/80">
            <p>{site.address}</p>
            <p>{site.hours}</p>
            <a className="inline-block text-house-gold" href={site.mapsUrl}>
              Open map
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {site.name}. Accra, Ghana.
      </div>
    </footer>
  );
}

export function StorefrontChrome({
  children,
  fullBleed,
  contained = true,
}: {
  children: React.ReactNode;
  fullBleed?: React.ReactNode;
  /** When false, children span full width (homepage rails). */
  contained?: boolean;
}) {
  return (
    <>
      <HouseNav />
      {fullBleed}
      {contained ? (
        <main className="mx-auto min-h-[50vh] max-w-7xl px-4 py-6 pb-24 sm:py-8 md:pb-8">{children}</main>
      ) : (
        <main className="min-h-[50vh] pb-24 md:pb-0">{children}</main>
      )}
      <HouseFooter />
      <MobileDock />
    </>
  );
}
