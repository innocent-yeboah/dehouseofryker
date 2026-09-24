import Link from "next/link";
import { kindLabels, kindPaths } from "@/data/seed-catalog";
import type { ProductKind } from "@/types/shop";

const promos: { kind: ProductKind; eyebrow: string; title: string; tone: string }[] = [
  {
    kind: "oil",
    eyebrow: "On the shelf",
    title: "Perfume oils",
    tone: "bg-[#efe6d4] text-ink",
  },
  {
    kind: "spray",
    eyebrow: "House sprays",
    title: "Sprays to wear",
    tone: "bg-[#1a1612] text-white",
  },
  {
    kind: "empty_bottle",
    eyebrow: "Fill your own",
    title: "Empty bottles",
    tone: "bg-[#c6a15b] text-ink",
  },
  {
    kind: "packaging",
    eyebrow: "Gift ready",
    title: "Packaging",
    tone: "bg-[#8c6a2b] text-white",
  },
];

export function CategoryPromos() {
  return (
    <section className="mx-auto max-w-7xl px-3 sm:px-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {promos.map((item) => (
          <Link
            key={item.kind}
            href={`/shop/${kindPaths[item.kind]}`}
            className={`rounded-2xl px-5 py-6 transition-transform motion-safe:hover:-translate-y-0.5 ${item.tone}`}
          >
            <p className="text-[11px] uppercase tracking-[0.18em] opacity-80">{item.eyebrow}</p>
            <h2 className="mt-2 font-serif text-2xl">{item.title}</h2>
            <p className="mt-4 text-sm font-medium opacity-90">Shop {kindLabels[item.kind]} →</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
