import { StorefrontChrome } from "@/components/house/StorefrontChrome";
import { formatShopPhone, shopTelHref, site, whatsappHref } from "@/lib/site";

export default function ContactPage() {
  const phone = formatShopPhone(site.whatsapp);
  return (
    <StorefrontChrome>
      <h1 className="font-serif text-3xl sm:text-4xl">Contact</h1>
      <p className="mt-4 text-sm">
        {site.address}
        <br />
        {site.hours}
      </p>
      <a className="mt-2 inline-block text-deep-gold" href={site.mapsUrl}>
        Open map
      </a>
      {phone ? (
        <p className="mt-6 text-sm">
          <a className="text-deep-gold" href={shopTelHref()}>
            {phone}
          </a>
        </p>
      ) : null}
      <p className="mt-2">
        <a className="text-deep-gold" href={whatsappHref("Hello, I have a question.")}>
          WhatsApp the house
        </a>
      </p>
    </StorefrontChrome>
  );
}
