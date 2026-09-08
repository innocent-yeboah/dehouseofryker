import { StorefrontChrome } from "@/components/house/StorefrontChrome";
import Link from "next/link";

export default function NotFound() {
  return (
    <StorefrontChrome>
      <h1 className="font-serif text-4xl">Let’s find another path</h1>
      <p className="mt-3 text-sm text-muted">That page is not in the house. Try the shop with us.</p>
      <Link href="/shop" className="mt-6 inline-block text-deep-gold">
        Shop
      </Link>
    </StorefrontChrome>
  );
}
