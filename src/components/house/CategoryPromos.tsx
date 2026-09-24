import Link from "next/link";
import { kindLabels, kindPaths } from "@/data/seed-catalog";

const promos: { href: string; eyebrow: string; title: string; cta: string; tone: string }[] = [
  {
    href: `/shop/${kindPaths.spray}`,
    eyebrow: "House sprays",
    title: "Glass sprays",
    cta: `Shop ${kindLabels.spray}`,
    tone: "bg-[#1a1612] text-white",
  },
  {
    href: `/shop/${kindPaths.format}`,
    eyebrow: "On the shelf",
    title: "Skin care & mists",
    cta: `Shop ${kindLabels.format}`,
    tone: "bg-[#efe6d4] text-ink",
  },
  {
    href: "/shop",
    eyebrow: "The catalog",
    title: "Shop the house",
    cta: "See every product",
    tone: "bg-[#c6a15b] text-ink",
  },
  {
    href: "/customize",
    eyebrow: "Custom blend",
    title: "Smell it, then pay",
    cta: "Start on WhatsApp",
    tone: "bg-[#8c6a2b] text-white",
  },
];

export function CategoryPromos() {
  return (
    <section className="mx-auto max-w-7xl px-3 sm:px-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {promos.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-2xl px-5 py-6 transition-transform motion-safe:hover:-translate-y-0.5 ${item.tone}`}
          >
            <p className="text-[11px] uppercase tracking-[0.18em] opacity-80">{item.eyebrow}</p>
            <h2 className="mt-2 font-serif text-2xl">{item.title}</h2>
            <p className="mt-4 text-sm font-medium opacity-90">{item.cta} →</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
