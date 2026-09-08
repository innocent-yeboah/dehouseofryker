import { kindLabels, kindPaths } from "@/data/seed-catalog";
import { site } from "@/lib/site";
import type { ProductKind } from "@/types/shop";
import Link from "next/link";

const categories: { kind: ProductKind; letter: string }[] = [
  { kind: "oil", letter: "O" },
  { kind: "spray", letter: "S" },
  { kind: "format", letter: "F" },
  { kind: "empty_bottle", letter: "B" },
  { kind: "packaging", letter: "P" },
];

export function HouseHero() {
  return (
    <div className="border-b border-soft-gold/70">
      <section className="bg-[linear-gradient(180deg,#fbf7ef_0%,#f4ead4_55%,#fbf7ef_100%)]">
        <div className="mx-auto grid min-h-[56vh] max-w-6xl items-center gap-10 px-4 py-10 md:min-h-[60vh] lg:min-h-[64vh] lg:grid-cols-2 lg:py-14">
          <div className="order-2 lg:order-1">
            <p className="text-xs uppercase tracking-[0.25em] text-deep-gold">Accra perfume house</p>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-ink sm:text-5xl md:text-6xl">
              {site.heroPromise}
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted sm:text-lg">{site.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="bg-house-gold px-6 py-3 text-sm font-medium text-ink transition-opacity motion-safe:hover:opacity-90"
              >
                Shop the collection
              </Link>
              <Link
                href="/customize"
                className="border border-house-gold px-6 py-3 text-sm text-deep-gold transition-colors motion-safe:hover:bg-white"
              >
                Custom blend
              </Link>
            </div>
          </div>
          <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
            <img
              src="/brand/dhr-monogram.png"
              alt=""
              width={420}
              height={420}
              className="h-48 w-auto sm:h-64 lg:h-80"
            />
          </div>
        </div>
      </section>

      <nav aria-label="Shop by category" className="bg-white">
        <ul className="mx-auto flex max-w-6xl gap-3 overflow-x-auto px-4 py-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((item) => (
            <li key={item.kind} className="min-w-[7.5rem] flex-1">
              <Link
                href={`/shop/${kindPaths[item.kind]}`}
                className="flex flex-col items-center border border-soft-gold bg-ivory px-3 py-4 text-center transition-transform motion-safe:hover:-translate-y-0.5"
              >
                <span
                  className="flex h-12 w-12 items-center justify-center border border-house-gold font-serif text-2xl text-deep-gold"
                  aria-hidden="true"
                >
                  {item.letter}
                </span>
                <span className="mt-2 text-xs tracking-wide text-ink">{kindLabels[item.kind]}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
