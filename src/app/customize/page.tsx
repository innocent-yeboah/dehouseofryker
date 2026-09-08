import { StorefrontChrome } from "@/components/house/StorefrontChrome";
import { copy, whatsappHref } from "@/lib/site";

export default function CustomizePage() {
  const href = whatsappHref(
    "Hello, I would like a custom blend. Oil or spray: ____. Size in ml: ____. The scent I have in mind (private, not for the public shop): ____. I will come smell it and pay at the Accra shop.",
  );

  return (
    <StorefrontChrome>
      <h1 className="font-serif text-4xl">Custom blend</h1>
      <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink">{copy.customWhatsapp}</p>
      <p className="mt-4 max-w-xl text-sm text-muted">
        Same price as that size in the shop. Often ready the same day. If we cannot match it, we
        offer the closest house blend and wait for you to say yes before we make it. Public product
        names stay ours — never another house’s trademark.
      </p>
      <a href={href} className="mt-8 inline-block bg-house-gold px-6 py-3 text-sm font-medium text-ink">
        WhatsApp a custom request
      </a>
    </StorefrontChrome>
  );
}
