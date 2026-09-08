import { StorefrontChrome } from "@/components/house/StorefrontChrome";
import { site } from "@/lib/site";

export default function AboutPage() {
  return (
    <StorefrontChrome>
      <h1 className="font-serif text-4xl">The house</h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
        {site.name} is an Accra perfume house. We blend oils and sprays, fill other formats, and
        keep empty bottles and packaging for people who work with scent. Walk in, or order ready
        stock here.
      </p>
      <p className="mt-4 text-sm">
        {site.address}
        <br />
        {site.hours}
      </p>
    </StorefrontChrome>
  );
}
