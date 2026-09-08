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
        <div className="mx-auto grid max-w-6xl items-center gap-5 px-4 py-5 sm:gap-8 sm:py-10 lg:min-h-[64vh] lg:grid-cols-2 lg:gap-10 lg:py-14">
          <div className="order-2 lg:order-1">
            <p className="text-xs uppercase tracking-[0.25em] text-deep-gold">Accra perfume house</p>
            <h1 className="mt-2 font-serif text-[1.75rem] leading-tight text-ink sm:mt-3 sm:text-5xl md:text-6xl">
              {site.heroPromise}
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted sm:mt-4 sm:text-lg">{site.tagline}</p>
            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
              <Link
                href="/shop"
                className="bg-house-gold px-6 py-3 text-center text-sm font-medium text-ink transition-opacity motion-safe:hover:opacity-90"
              >
                Shop the collection
              </Link>
              <Link
                href="/customize"
                className="border border-house-gold px-6 py-3 text-center text-sm text-deep-gold transition-colors motion-safe:hover:bg-white"
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
              className="max-h-24 w-auto object-contain sm:max-h-48 lg:max-h-80"
            />
          </div>
        </div>
      </section>

      <nav aria-label="Shop by category" className="bg-white">
        <ul className="mx-auto flex max-w-6xl snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-4 py-4 sm:py-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((item) => (
            <li key={item.kind} className="w-[5.75rem] shrink-0 snap-start sm:w-auto sm:min-w-[7.5rem] sm:flex-1">
              <Link
                href={`/shop/${kindPaths[item.kind]}`}
                className="flex min-h-11 flex-col items-center border border-soft-gold bg-ivory px-2 py-3 text-center sm:px-3 sm:py-4 motion-safe:hover:-translate-y-0.5 motion-safe:hover:transition-transform"
              >
                <span
                  className="flex h-10 w-10 items-center justify-center border border-house-gold font-serif text-xl text-deep-gold sm:h-12 sm:w-12 sm:text-2xl"
                  aria-hidden="true"
                >
                  {item.letter}
                </span>
                <span className="mt-2 text-center text-[11px] leading-tight tracking-wide text-ink sm:text-xs">
                  {kindLabels[item.kind]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
