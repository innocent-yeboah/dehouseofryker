import Link from "next/link";
import { availabilityFor, availabilityLabel } from "@/lib/availability";
import { formatGhs, sizeLabel } from "@/lib/money";
import type { Product } from "@/types/shop";

type AtelierCardProps = {
  product: Product;
};

/** Dense tile grid: two-up on phones, five-up on large screens. */
export const shopTileGrid = "grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-5 lg:gap-2";

export function AtelierCard({ product }: AtelierCardProps) {
  const first = product.variants[0];
  const status = first ? availabilityFor(first) : "unavailable";
  const from = first ? Math.min(...product.variants.map((item) => item.priceGhs)) : 0;
  const photo = product.images[0];
  const unavailable = status === "unavailable";

  return (
    <article className="h-full min-w-0">
      <Link
        href={`/product/${product.slug}`}
        className={`flex h-full flex-col overflow-hidden border border-soft-gold/70 bg-white ${
          unavailable ? "opacity-70" : ""
        }`}
      >
        <div className="flex aspect-square shrink-0 items-center justify-center overflow-hidden bg-ivory">
          {photo ? (
            <img src={photo} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="font-serif text-2xl text-house-gold sm:text-3xl" aria-hidden="true">
              {product.name.charAt(0)}
            </span>
          )}
        </div>
        <div className="flex h-[5.5rem] shrink-0 flex-col px-2 py-1.5">
          <h2 className="line-clamp-2 font-serif text-[13px] leading-snug text-ink">{product.name}</h2>
          {first ? (
            <p className="mt-auto text-sm font-medium leading-none text-deep-gold">{formatGhs(from)}</p>
          ) : (
            <span className="mt-auto" />
          )}
          <p className="mt-1 line-clamp-1 text-[10px] leading-tight text-muted">
            {availabilityLabel(status)}
            {first?.sizeMl ? ` · ${sizeLabel(first.sizeMl)}` : ""}
          </p>
        </div>
      </Link>
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
