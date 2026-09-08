import { HouseNav } from "@/components/house/HouseNav";
import { site, whatsappHref } from "@/lib/site";
import Link from "next/link";

export function HouseFooter() {
  return (
    <footer className="mt-10 border-t border-soft-gold/70 bg-white sm:mt-16">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="font-serif text-xl text-ink">{site.name}</p>
          <p className="mt-2 text-sm text-muted">
            Accra perfume house. Oils, sprays, and ready packaging. Custom blends by WhatsApp, paid
            when you smell them.
          </p>
        </div>
        <div className="text-sm text-muted">
          <p>{site.address}</p>
          <p className="mt-1">{site.hours}</p>
          <a className="mt-2 inline-block text-deep-gold" href={site.mapsUrl}>
            Open map
          </a>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <Link href="/policies" className="hover:text-deep-gold">
            Policies
          </Link>
          <Link href="/contact" className="hover:text-deep-gold">
            Contact
          </Link>
          <Link href="/order/find" className="hover:text-deep-gold">
            Find my order
          </Link>
          <a href={whatsappHref("Hello, I have a question about De House of Ryker.")}>WhatsApp</a>
        </div>
      </div>
    </footer>
  );
}

export function StorefrontChrome({
  children,
  fullBleed,
}: {
  children: React.ReactNode;
  fullBleed?: React.ReactNode;
}) {
  return (
    <>
      <HouseNav />
      {fullBleed}
      <main className="mx-auto min-h-[50vh] max-w-6xl px-4 py-6 sm:py-8">{children}</main>
      <HouseFooter />
    </>
  );
}
