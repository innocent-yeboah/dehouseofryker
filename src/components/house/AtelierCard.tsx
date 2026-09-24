"use client";

import Link from "next/link";
import { useState } from "react";
import { ProductImage } from "@/components/house/ProductImage";
import { availabilityFor, availabilityLabel } from "@/lib/availability";
import { formatGhs, variantSizeLabel } from "@/lib/money";
import { whatsappHref } from "@/lib/site";
import { useCart } from "@/store/cart";
import type { Product } from "@/types/shop";

type AtelierCardProps = {
  product: Product;
};

export function AtelierCard({ product }: AtelierCardProps) {
  const first = product.variants[0];
  const status = first ? availabilityFor(first) : "unavailable";
  const from = first ? Math.min(...product.variants.map((item) => item.priceGhs)) : 0;
  const photo = product.images[0];
  const unavailable = status === "unavailable";
  const add = useCart((state) => state.add);
  const [message, setMessage] = useState<string | null>(null);

  const size = first ? variantSizeLabel(first) : "";
  const wa = whatsappHref(
    `Hello, I am interested in ${product.name}${size && size !== "One size" ? ` (${size})` : ""}.`,
  );

  return (
    <article className="@container flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm">
      <Link href={`/product/${product.slug}`} className={unavailable ? "opacity-70" : ""}>
        <div className="relative aspect-square overflow-hidden bg-white">
          {photo ? (
            <ProductImage
              src={photo}
              alt={product.name}
              sizes="(min-width: 1280px) 18vw, (min-width: 1024px) 22vw, (min-width: 768px) 30vw, 46vw"
              zoom
            />
          ) : (
            <span
              className="absolute inset-0 flex items-center justify-center font-serif text-2xl text-house-gold @[14rem]:text-3xl"
              aria-hidden="true"
            >
              {product.name.charAt(0)}
            </span>
          )}
        </div>
        <div className="px-2 pt-2 @[14rem]:px-3 @[14rem]:pt-3">
          <h2 className="line-clamp-3 min-h-12 text-[13px] font-medium leading-tight text-ink @[14rem]:line-clamp-2 @[14rem]:min-h-10 @[14rem]:text-sm @[14rem]:leading-snug">
            {product.name}
          </h2>
          {first ? (
            <p className="mt-1 text-sm font-semibold leading-none text-ink @[14rem]:text-base">
              {formatGhs(from)}
            </p>
          ) : null}
          <p className="mt-1 line-clamp-1 text-[10px] leading-tight text-muted @[14rem]:text-[11px]">
            {availabilityLabel(status)}
            {size && size !== "One size" ? ` · ${size}` : ""}
          </p>
        </div>
      </Link>

      <div className="mt-auto flex items-stretch gap-1.5 p-2 @[14rem]:gap-2 @[14rem]:p-3">
        {unavailable || !first ? (
          <a
            href={wa}
            className="inline-flex min-h-10 w-full items-center justify-center rounded-full border border-soft-gold px-2 text-center text-[11px] font-medium text-deep-gold @[14rem]:text-xs"
          >
            <span className="@[12rem]:hidden">WhatsApp</span>
            <span className="hidden @[12rem]:inline">Buy via WhatsApp</span>
          </a>
        ) : (
          <>
            <button
              type="button"
              className="inline-flex min-h-10 min-w-0 flex-1 items-center justify-center rounded-full bg-deep-gold px-2 text-[11px] font-medium whitespace-nowrap text-white transition-opacity motion-safe:hover:opacity-90 @[14rem]:px-3 @[14rem]:text-xs"
              onClick={() => {
                const result = add(first.id, 1, first.maxRetailQty);
                setMessage(result.ok ? "Added to cart." : result.message ?? "Could not add.");
              }}
            >
              <span className="@[10rem]:hidden">Add</span>
              <span className="hidden @[10rem]:inline">Add to cart</span>
            </button>
            <a
              href={wa}
              aria-label="Buy via WhatsApp"
              className="inline-flex min-h-10 min-w-10 shrink-0 items-center justify-center rounded-full border border-soft-gold px-2 text-[11px] font-semibold text-deep-gold @[14rem]:min-w-0 @[14rem]:flex-1 @[14rem]:font-medium"
            >
              <span className="@[14rem]:hidden">WA</span>
              <span className="hidden @[14rem]:inline">WhatsApp</span>
            </a>
          </>
        )}
      </div>
      {message ? (
        <p className="line-clamp-2 px-2 pb-2 text-[10px] leading-tight text-muted @[14rem]:px-3">
          {message}
        </p>
      ) : null}
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
