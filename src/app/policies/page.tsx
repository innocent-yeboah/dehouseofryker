import { StorefrontChrome } from "@/components/house/StorefrontChrome";
import { copy } from "@/lib/site";

export default function PoliciesPage() {
  return (
    <StorefrontChrome>
      <h1 className="font-serif text-3xl sm:text-4xl">Policies</h1>
      <h2 className="mt-8 font-serif text-2xl">Returns</h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{copy.returns}</p>
      <h2 className="mt-8 font-serif text-2xl">Delivery</h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{copy.deliveryGoodsOnly}</p>
      <h2 className="mt-8 font-serif text-2xl">Privacy</h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
        We keep your name, Ghana phone, and order so we can pack and call you. We do not sell that
        list. Ask on WhatsApp if you want an order forgotten.
      </p>
    </StorefrontChrome>
  );
}
