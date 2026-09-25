import Link from "next/link";
import { copy } from "@/lib/site";

const features = [
  {
    title: "Delivery across Accra",
    body: copy.heroFulfillment,
  },
  {
    title: "Pay with MoMo",
    body: "MTN MoMo for products. Cash when you collect at the shop.",
  },
  {
    title: "Genuine products",
    body: "House names only. Custom inspired-by blends stay on WhatsApp, not in the cart.",
  },
  {
    title: "WhatsApp support",
    body: "Ask, order custom, or track.",
  },
];

export function TrustStrip() {
  return (
    <section className="border-y border-black/5 bg-white" aria-label="Shop promises">
      <ul className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4 lg:py-10">
        {features.map((item) => (
          <li key={item.title} className="text-center sm:text-left">
            <p className="font-serif text-lg text-ink">{item.title}</p>
            <p className="mt-1 text-sm text-muted">{item.body}</p>
          </li>
        ))}
      </ul>
      <p className="sr-only">
        See also <Link href="/policies">policies</Link>
      </p>
    </section>
  );
}
