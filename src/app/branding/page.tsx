import { StorefrontChrome } from "@/components/house/StorefrontChrome";
import { whatsappHref } from "@/lib/site";
import Link from "next/link";

export default function BrandingPage() {
  return (
    <StorefrontChrome>
      <h1 className="font-serif text-3xl sm:text-4xl">Branding and packaging</h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
        Ready boxes and pouches can go in your cart. If you want your own name on bottles or boxes,
        that is a job we quote — not an instant checkout.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
        <Link href="/shop/packaging" className="bg-house-gold px-6 py-3 text-center text-sm font-medium text-ink">
          Shop ready packaging
        </Link>
        <a
          href={whatsappHref(
            "Hello, I need a branding job. What I want labelled (bottles / boxes), quantity, and any logo notes: ____.",
          )}
          className="border border-house-gold px-6 py-3 text-center text-sm text-deep-gold"
        >
          WhatsApp a branding job
        </a>
      </div>
    </StorefrontChrome>
  );
}
