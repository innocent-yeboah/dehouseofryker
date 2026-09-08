"use client";

import { useState } from "react";
import { availabilityFor, availabilityLabel } from "@/lib/availability";
import { formatGhs, sizeLabel } from "@/lib/money";
import { copy, whatsappHref } from "@/lib/site";
import { useCart } from "@/store/cart";
import type { Product } from "@/types/shop";

export function ProductBuy({ product }: { product: Product }) {
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? 0);
  const variant = product.variants.find((item) => item.id === variantId) ?? product.variants[0];
  const add = useCart((state) => state.add);
  const [message, setMessage] = useState<string | null>(null);

  if (!variant) {
    return <p>This product has no sizes yet.</p>;
  }

  const status = availabilityFor(variant);
  const unavailable = status === "unavailable";

  return (
    <div className="mt-8 space-y-4">
      <fieldset>
        <legend className="text-sm font-medium">Size</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {product.variants.map((item) => {
            const itemStatus = availabilityFor(item);
            return (
              <label
                key={item.id}
                className={`cursor-pointer border px-3 py-2 text-sm ${
                  item.id === variant.id ? "border-house-gold bg-ivory" : "border-soft-gold"
                }`}
              >
                <input
                  type="radio"
                  className="sr-only"
                  name="size"
                  checked={item.id === variant.id}
                  onChange={() => setVariantId(item.id)}
                />
                {sizeLabel(item.sizeMl)} · {formatGhs(item.priceGhs)}
                <span className="block text-xs text-muted">{availabilityLabel(itemStatus)}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <p className="text-sm text-deep-gold">{availabilityLabel(status)}</p>
      {status === "blend" ? <p className="text-sm text-ink">{copy.blendNotOnShelf}</p> : null}

      {unavailable ? (
        <p className="text-sm">
          This size is not on the shelf.{" "}
          {product.kind === "empty_bottle" || product.kind === "packaging" ? (
            <a
              className="text-deep-gold underline"
              href={whatsappHref(
                `Hello, I am looking for ${product.name}. Is a restock or wholesale carton available?`,
              )}
            >
              WhatsApp the house
            </a>
          ) : null}
        </p>
      ) : (
        <button
          type="button"
          className="w-full bg-house-gold px-6 py-3 text-sm font-medium text-ink sm:w-auto hover:bg-deep-gold hover:text-white"
          onClick={() => {
            const result = add(variant.id, 1, variant.maxRetailQty);
            setMessage(result.ok ? "Added to cart." : result.message ?? "Could not add.");
          }}
        >
          {status === "blend" ? "Order a blend" : "Add to cart"}
        </button>
      )}
      {product.kind === "empty_bottle" ? (
        <p className="text-xs text-muted">
          Retail limit {variant.maxRetailQty} per order. For a carton, WhatsApp wholesale.
        </p>
      ) : null}
      {message ? <p className="text-sm text-deep-gold">{message}</p> : null}
    </div>
  );
}
