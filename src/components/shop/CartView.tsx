"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { availabilityFor, availabilityLabel } from "@/lib/availability";
import { formatGhs, sizeLabel } from "@/lib/money";
import { useCart } from "@/store/cart";
import type { Product } from "@/types/shop";

export function CartView({ products }: { products: Product[] }) {
  const lines = useCart((state) => state.lines);
  const setQty = useCart((state) => state.setQty);
  const remove = useCart((state) => state.remove);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return <p className="text-sm text-muted">Loading cart…</p>;
  }

  const resolved = lines
    .map((line) => {
      for (const product of products) {
        const variant = product.variants.find((item) => item.id === line.variantId);
        if (variant) {
          return { line, product, variant };
        }
      }
      return null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const total = resolved.reduce((sum, item) => sum + item.variant.priceGhs * item.line.qty, 0);

  if (resolved.length === 0) {
    return (
      <p className="text-muted">
        Your cart is empty. <Link href="/shop">Visit the shop</Link>
      </p>
    );
  }

  return (
    <div>
      <ul className="space-y-4">
        {resolved.map(({ line, product, variant }) => {
          const status = availabilityFor(variant);
          return (
            <li key={variant.id} className="flex flex-col gap-2 border-b border-soft-gold/50 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Link href={`/product/${product.slug}`} className="font-serif text-xl">
                  {product.name}
                </Link>
                <p className="text-sm text-muted">
                  {sizeLabel(variant.sizeMl)} · {availabilityLabel(status)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm">
                  Qty
                  <input
                    className="ml-2 w-16 border border-soft-gold bg-white px-2 py-1"
                    type="number"
                    min={1}
                    max={variant.maxRetailQty}
                    value={line.qty}
                    onChange={(event) =>
                      setQty(variant.id, Number(event.target.value), variant.maxRetailQty)
                    }
                  />
                </label>
                <span className="text-sm">{formatGhs(variant.priceGhs * line.qty)}</span>
                <button type="button" className="text-sm text-muted" onClick={() => remove(variant.id)}>
                  Remove
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-6 text-lg">Products total {formatGhs(total)}</p>
      <p className="mt-1 text-sm text-muted">Delivery is never included here.</p>
      <Link href="/checkout" className="mt-6 inline-block bg-house-gold px-6 py-3 text-sm font-medium text-ink">
        Checkout
      </Link>
    </div>
  );
}
