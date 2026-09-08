import { StorefrontChrome } from "@/components/house/StorefrontChrome";
import { whatsappHref } from "@/lib/site";
import Link from "next/link";

export default function WholesalePage() {
  return (
    <StorefrontChrome>
      <h1 className="font-serif text-3xl sm:text-4xl">Wholesale</h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
        Trade is agreed in the Accra shop or by call. This page does not sell bulk prices. Empty
        bottles in small numbers are in the shop; cartons come through us.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
        <a
          href={whatsappHref(
            "Hello, I would like wholesale. I am a shop/reseller. What I need (oils / sprays / empty bottles / packaging) and roughly how many: ____.",
          )}
          className="bg-house-gold px-6 py-3 text-center text-sm font-medium text-ink"
        >
          WhatsApp wholesale
        </a>
        <Link href="/shop/bottles" className="border border-house-gold px-6 py-3 text-center text-sm text-deep-gold">
          Small-qty bottles
        </Link>
      </div>
    </StorefrontChrome>
  );
}
