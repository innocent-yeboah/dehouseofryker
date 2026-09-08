import Link from "next/link";
import { availabilityFor, availabilityLabel } from "@/lib/availability";
import { formatGhs, sizeLabel } from "@/lib/money";
import { kindLabels, kindPaths } from "@/data/seed-catalog";
import type { Product } from "@/types/shop";

type AtelierCardProps = {
  product: Product;
};

export function AtelierCard({ product }: AtelierCardProps) {
  const first = product.variants[0];
  const status = first ? availabilityFor(first) : "unavailable";
  const from = first ? Math.min(...product.variants.map((item) => item.priceGhs)) : 0;

  return (
    <article className="group flex flex-col border border-soft-gold/70 bg-white p-4 shadow-sm transition-transform duration-300 motion-safe:hover:-translate-y-0.5">
      <div className="mb-4 flex aspect-[4/5] items-center justify-center bg-ivory">
        <span className="font-serif text-4xl text-house-gold">{product.name.charAt(0)}</span>
      </div>
      <p className="text-xs uppercase tracking-[0.2em] text-muted">
        {kindLabels[product.kind]}
      </p>
      <h2 className="mt-1 font-serif text-2xl text-ink">
        <Link href={`/product/${product.slug}`} className="hover:text-deep-gold">
          {product.name}
        </Link>
      </h2>
      <ScentNote className="mt-2 line-clamp-3">{product.description}</ScentNote>
      <p className="mt-3 text-sm text-deep-gold">{availabilityLabel(status)}</p>
      {first ? (
        <p className="mt-1 text-sm text-ink">
          From {formatGhs(from)}
          {first.sizeMl ? ` · ${sizeLabel(first.sizeMl)}` : ""}
        </p>
      ) : null}
      <Link
        href={`/shop/${kindPaths[product.kind]}`}
        className="mt-auto pt-4 text-xs uppercase tracking-widest text-muted hover:text-deep-gold"
      >
        View collection
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
