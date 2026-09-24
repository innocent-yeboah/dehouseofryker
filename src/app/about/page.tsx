import { StorefrontChrome } from "@/components/house/StorefrontChrome";
import { site } from "@/lib/site";

export default function AboutPage() {
  return (
    <StorefrontChrome>
      <h1 className="font-serif text-3xl sm:text-4xl">The house</h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
        {site.name} is an Accra perfume house. The shelf holds glass sprays, face scrubs, and
        hair and body mists. Walk in, or order ready stock here. Custom blends stay on WhatsApp.
      </p>
      <p className="mt-4 text-sm">
        {site.address}
        <br />
        {site.hours}
      </p>
    </StorefrontChrome>
  );
}
