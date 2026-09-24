"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { kindLabels, kindPaths } from "@/data/seed-catalog";

const slides = [
  {
    eyebrow: "Spray and go",
    title: "Blue and red glass sprays, ready on the shelf",
    href: `/shop/${kindPaths.spray}`,
    cta: "Shop sprays",
    tone: "from-[#2a231c] via-[#1a1612] to-[#3d3228] text-white",
  },
  {
    eyebrow: "Skin and scent",
    title: "Scrubs, masks, soap, and hair & body mists",
    href: `/shop/${kindPaths.format}`,
    cta: `Shop ${kindLabels.format.toLowerCase()}`,
    tone: "from-[#f4ead4] via-[#efe0c0] to-[#e8d5a3] text-ink",
  },
  {
    eyebrow: "Custom blend",
    title: "Tell us the scent. Smell it. Pay at the shop.",
    href: "/customize",
    cta: "WhatsApp a blend",
    tone: "from-[#1a1612] via-[#2c241c] to-[#8c6a2b] text-white",
  },
];

export function HouseHero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 5500);
    return () => window.clearInterval(id);
  }, []);

  const slide = slides[index] ?? slides[0];

  return (
    <section className="bg-[#f3f1ec] px-3 py-4 sm:px-4 sm:py-6">
      <div className="mx-auto max-w-7xl">
        <div
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${slide.tone} px-6 py-10 sm:px-10 sm:py-14 lg:min-h-[22rem] lg:px-14 lg:py-16`}
        >
          <p className="text-xs uppercase tracking-[0.22em] opacity-80 sm:text-sm">{slide.eyebrow}</p>
          <h1 className="mt-3 max-w-xl font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">
            {slide.title}
          </h1>
          <Link
            href={slide.href}
            className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-medium text-ink shadow-sm transition-opacity motion-safe:hover:opacity-90"
          >
            {slide.cta}
          </Link>

          <div className="mt-8 flex gap-2" aria-label="Hero slides">
            {slides.map((item, i) => (
              <button
                key={item.title}
                type="button"
                aria-label={`Show slide ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                className={`h-2.5 w-2.5 rounded-full ${
                  i === index ? "bg-house-gold ring-2 ring-house-gold/40" : "bg-current/30"
                }`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
