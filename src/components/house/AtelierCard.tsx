"use client";

import Link from "next/link";
import { useState } from "react";
import { availabilityFor, availabilityLabel } from "@/lib/availability";
import { formatGhs, sizeLabel } from "@/lib/money";
import { whatsappHref } from "@/lib/site";
import { useCart } from "@/store/cart";
import type { Product } from "@/types/shop";

type AtelierCardProps = {
  product: Product;
};

/** Dense tile grid: two-up on phones, five-up on large screens. */
export const shopTileGrid = "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";

export function AtelierCard({ product }: AtelierCardProps) {
  const first = product.variants[0];
  const status = first ? availabilityFor(first) : "unavailable";
  const from = first ? Math.min(...product.variants.map((item) => item.priceGhs)) : 0;
  const photo = product.images[0];
  const unavailable = status === "unavailable";
  const add = useCart((state) => state.add);
  const [message, setMessage] = useState<string | null>(null);

  const wa = whatsappHref(
    `Hello, I am interested in ${product.name}${first?.sizeMl ? ` (${first.sizeMl}ml)` : ""}.`,
  );

  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm">
      <Link href={`/product/${product.slug}`} className={unavailable ? "opacity-70" : ""}>
        <div className="flex aspect-square items-center justify-center overflow-hidden bg-[#f7f3ea]">
          {photo ? (
            <img src={photo} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="font-serif text-3xl text-house-gold" aria-hidden="true">
              {product.name.charAt(0)}
            </span>
          )}
        </div>
        <div className="px-3 pt-3">
          <h2 className="line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-snug text-ink">
            {product.name}
          </h2>
          {first ? (
            <p className="mt-1 text-base font-semibold text-ink">{formatGhs(from)}</p>
          ) : null}
          <p className="mt-1 line-clamp-1 text-[11px] text-muted">
            {availabilityLabel(status)}
            {first?.sizeMl ? ` · ${sizeLabel(first.sizeMl)}` : ""}
          </p>
        </div>
      </Link>

      <div className="mt-auto flex flex-col gap-2 p-3 pt-3">
        {unavailable || !first ? (
          <a
            href={wa}
            className="rounded-full border border-soft-gold px-3 py-2 text-center text-xs font-medium text-deep-gold"
          >
            Buy via WhatsApp
          </a>
        ) : (
          <>
            <button
              type="button"
              className="rounded-full bg-deep-gold px-3 py-2 text-xs font-medium text-white transition-opacity motion-safe:hover:opacity-90"
              onClick={() => {
                const result = add(first.id, 1, first.maxRetailQty);
                setMessage(result.ok ? "Added to cart." : result.message ?? "Could not add.");
              }}
            >
              Add to cart
            </button>
            <a
              href={wa}
              className="rounded-full border border-soft-gold px-3 py-2 text-center text-xs font-medium text-deep-gold"
            >
              Buy via WhatsApp
            </a>
          </>
        )}
        {message ? <p className="text-[11px] text-muted">{message}</p> : null}
      </div>
    </article>
  );
}

export function ScentNote({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={`text-sm leading-relaxed text-muted ${className}`}>{children}</p>;
}
