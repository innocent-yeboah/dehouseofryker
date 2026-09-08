import { StorefrontChrome } from "@/components/house/StorefrontChrome";
import { site, whatsappHref } from "@/lib/site";

export default function ContactPage() {
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
      <p className="mt-6">
        <a className="text-deep-gold" href={whatsappHref("Hello, I have a question.")}>
          WhatsApp the house
        </a>
      </p>
    </StorefrontChrome>
  );
}
