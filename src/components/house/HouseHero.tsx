"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const AUTOPLAY_MS = 6500;

type HeroShot = {
  src: string;
  alt: string;
  /** Flex item inside the centred cluster. Full class strings so Tailwind can see them. */
  item: string;
  sizes: string;
  /** LCP image on the first slide. */
  priority?: boolean;
};

type HeroSlide = {
  id: string;
  eyebrow: string;
  title: string;
  support: string;
  /** Height of the product cluster as a fraction of the image panel. */
  cluster: string;
  shots: HeroShot[];
  ctas: Array<{ href: string; label: string; tone: "primary" | "secondary" }>;
};

const slides: HeroSlide[] = [
  {
    id: "fragrance",
    eyebrow: "Fragrance",
    title: "Signature scents, delivered across Accra",
    support: "Perfumes, perfume oils, and attars. Pay with MoMo.",
    cluster: "h-[76%]",
    ctas: [
      { href: "/shop/fragrance/perfumes", label: "Shop Perfumes", tone: "primary" },
      { href: "/shop/fragrance/perfume-oils", label: "Shop Oils & Attars", tone: "secondary" },
    ],
    shots: [
      {
        src: "/hero/oil-almas-bushra.png",
        alt: "Almas Bushra Perfume Oil 100 g",
        item: "z-10 h-[86%] -mr-[8%] self-end aspect-[505/617]",
        sizes: "(min-width: 1024px) 280px, 120px",
      },
      {
        src: "/hero/oil-almas-royal-black.png",
        alt: "Almas Royal Black Perfume Oil 100 g",
        item: "z-20 h-full aspect-[673/640]",
        sizes: "(min-width: 1024px) 340px, 150px",
        priority: true,
      },
      {
        src: "/hero/oil-almas-crimson-chandelier.png",
        alt: "Almas Crimson Chandelier Perfume Oil 100 g",
        item: "z-10 h-[84%] -ml-[10%] self-start aspect-[754/634]",
        sizes: "(min-width: 1024px) 300px, 140px",
      },
    ],
  },
  {
    id: "skincare",
    eyebrow: "Skincare",
    title: "Scrubs, masks, and lip masks",
    support: "Face, lips and eyes, and body. Genuine products.",
    cluster: "h-[82%]",
    ctas: [
      { href: "/shop/skincare/face", label: "Shop Face", tone: "primary" },
      { href: "/shop/skincare", label: "Shop Skincare", tone: "secondary" },
    ],
    shots: [
      {
        src: "/hero/mask-24k-gold.png",
        alt: "PUQIANNA 24K Gold Whitening Facial Mask 25 ml",
        item: "z-10 h-[92%] -mr-[6%] self-end aspect-[413/672]",
        sizes: "(min-width: 1024px) 220px, 110px",
      },
      {
        src: "/hero/scrub-24k-gold.png",
        alt: "KÖRMESIC 24K Gold Exfoliating Scrub 100 g",
        item: "z-20 h-full aspect-[473/693]",
        sizes: "(min-width: 1024px) 260px, 130px",
      },
      {
        src: "/hero/lip-cherry.png",
        alt: "FAYANKÔU Cherry Moisturizing Soft Lip Mask 4.5 g",
        item: "z-30 h-[40%] -ml-[28%] self-end aspect-[791/361]",
        sizes: "(min-width: 1024px) 280px, 150px",
      },
    ],
  },
  {
    id: "new",
    eyebrow: "New arrivals",
    title: "Newest on the shelf",
    support: "Perfume oils and wellness supplements. Delivery across Accra.",
    cluster: "h-[80%]",
    ctas: [{ href: "/shop/new-arrivals", label: "See New Arrivals", tone: "primary" }],
    shots: [
      {
        src: "/hero/supplement-fruits-plus.png",
        alt: "OEM Fruits+ Whole Food Formula 90 capsules",
        item: "z-10 h-[90%] -mr-[8%] self-end aspect-[284/616]",
        sizes: "(min-width: 1024px) 160px, 80px",
      },
      {
        src: "/hero/oil-almas-crimson-chandelier.png",
        alt: "Almas Crimson Chandelier Perfume Oil 100 g",
        item: "z-20 h-full aspect-[754/634]",
        sizes: "(min-width: 1024px) 340px, 160px",
      },
      {
        src: "/hero/supplement-veggies-plus.png",
        alt: "OEM Veggies+ Whole Food Formula 90 capsules",
        item: "z-10 h-[90%] -ml-[8%] self-start aspect-[286/615]",
        sizes: "(min-width: 1024px) 160px, 80px",
      },
    ],
  },
];

const chips = [
  { href: "/shop/fragrance/perfumes", label: "Perfumes" },
  { href: "/shop/fragrance/perfume-oils", label: "Oils & Attars" },
  { href: "/shop/skincare/face", label: "Face" },
  { href: "/shop/skincare/lips-eyes", label: "Lips & Eyes" },
  { href: "/shop/skincare/body", label: "Body" },
  { href: "/shop/wellness", label: "Wellness" },
];

function Stage({ shots, cluster, eager }: { shots: HeroShot[]; cluster: string; eager: boolean }) {
  return (
    <div className="relative h-full w-full bg-[radial-gradient(ellipse_at_50%_42%,#fbf6ec_0%,#f3e6cc_58%,#e7d3ac_100%)]">
      <div className={`absolute inset-x-1 top-1/2 flex -translate-y-1/2 items-center justify-center sm:inset-x-3 ${cluster}`}>
        {shots.map((shot) => (
          <div key={shot.src + shot.alt} className={`relative shrink-0 ${shot.item}`}>
            <div
              className="pointer-events-none absolute bottom-[1%] left-1/2 h-[7%] w-[62%] -translate-x-1/2 rounded-[100%] bg-[#4a341c]/25 blur-[5px]"
              aria-hidden="true"
            />
            <Image
              src={shot.src}
              alt={shot.alt}
              fill
              sizes={shot.sizes}
              draggable={false}
              className="object-contain object-bottom"
              {...(eager && shot.priority
                ? { priority: true, fetchPriority: "high" as const }
                : { loading: "lazy" as const })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function HouseHero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const flags = useRef({ hover: false, focus: false, touch: false, hidden: false, reduced: false });

  const syncPause = useCallback(() => {
    const state = flags.current;
    setPaused(state.hover || state.focus || state.touch || state.hidden || state.reduced);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => {
      flags.current.reduced = media.matches;
      syncPause();
    };
    const onVisibility = () => {
      flags.current.hidden = document.hidden;
      syncPause();
    };
    onMotion();
    onVisibility();
    media.addEventListener("change", onMotion);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      media.removeEventListener("change", onMotion);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [syncPause]);

  useEffect(() => {
    if (paused) {
      return;
    }
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, index]);

  function go(delta: number) {
    setIndex((current) => (current + delta + slides.length) % slides.length);
  }

  return (
    <section className="bg-[#f3f1ec] px-3 pt-3 sm:px-4 sm:pt-5">
      <div className="mx-auto max-w-7xl">
        <div
          className="relative overflow-hidden rounded-2xl bg-[#14110e] text-white shadow-[0_18px_40px_rgba(20,17,14,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-house-gold lg:h-[460px]"
          aria-roledescription="carousel"
          aria-label="Featured"
          tabIndex={0}
          onMouseEnter={() => {
            flags.current.hover = true;
            syncPause();
          }}
          onMouseLeave={() => {
            flags.current.hover = false;
            syncPause();
          }}
          onFocusCapture={() => {
            flags.current.focus = true;
            syncPause();
          }}
          onBlurCapture={(event) => {
            const next = event.relatedTarget;
            if (!(next instanceof Node) || !event.currentTarget.contains(next)) {
              flags.current.focus = false;
              syncPause();
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              go(-1);
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              go(1);
            }
          }}
          onTouchStart={(event) => {
            touchX.current = event.changedTouches[0]?.clientX ?? null;
            flags.current.touch = true;
            syncPause();
          }}
          onTouchEnd={(event) => {
            const start = touchX.current;
            const end = event.changedTouches[0]?.clientX;
            if (start != null && end != null) {
              const delta = end - start;
              if (delta > 48) {
                go(-1);
              } else if (delta < -48) {
                go(1);
              }
            }
            touchX.current = null;
            flags.current.touch = false;
            syncPause();
          }}
          onTouchCancel={() => {
            touchX.current = null;
            flags.current.touch = false;
            syncPause();
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(165deg,#2c241c_0%,#14110e_46%,#0c0b09_100%)]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-house-gold/80 to-transparent"
            aria-hidden="true"
          />

          {slides.map((slide, slideIndex) => {
            const active = slideIndex === index;
            const Title = active ? "h1" : "p";
            return (
              <div
                key={slide.id}
                id={`hero-slide-${slide.id}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${slideIndex + 1} of ${slides.length}`}
                aria-hidden={active ? undefined : true}
                inert={active ? undefined : true}
                className={`transition-opacity duration-700 motion-reduce:transition-none ${
                  active
                    ? "relative z-10 opacity-100 lg:absolute lg:inset-0"
                    : "pointer-events-none absolute inset-0 z-0 opacity-0"
                }`}
              >
                <div className="flex flex-col lg:grid lg:h-full lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:items-center">
                  <div className="relative h-[200px] shrink-0 sm:h-[220px] lg:order-2 lg:h-full">
                    <Stage shots={slide.shots} cluster={slide.cluster} eager={slideIndex === 0} />
                  </div>
                  <div className="flex flex-col justify-center px-5 pb-16 pt-4 sm:px-8 lg:order-1 lg:px-8 lg:py-8 lg:pb-16">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-soft-gold">{slide.eyebrow}</p>
                    <Title className="mt-2 min-h-[4.4rem] max-w-[16ch] text-balance font-serif text-[1.7rem] font-medium leading-[1.12] text-white sm:min-h-[5.25rem] sm:max-w-md sm:text-4xl lg:min-h-0 lg:text-[3.15rem] lg:leading-[1.05]">
                      {slide.title}
                    </Title>
                    <p className="mt-2 min-h-[2.6rem] max-w-md text-sm leading-relaxed text-white/80 lg:min-h-0 lg:text-[15px]">
                      {slide.support}
                    </p>
                    <div className="mt-4 flex min-h-[6.5rem] flex-col items-start gap-2 sm:min-h-11 sm:flex-row sm:flex-wrap">
                      {slide.ctas.map((cta) => (
                        <Link
                          key={cta.href}
                          href={cta.href}
                          className={
                            cta.tone === "primary"
                              ? "inline-flex min-h-11 items-center justify-center rounded-full bg-house-gold px-5 text-sm font-medium text-ink motion-safe:transition-colors motion-safe:hover:bg-soft-gold"
                              : "inline-flex min-h-11 items-center justify-center rounded-full border border-white/40 px-5 text-sm font-medium text-white motion-safe:transition-colors motion-safe:hover:bg-white/10"
                          }
                        >
                          {cta.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="absolute bottom-1 left-2 z-30 flex items-center sm:left-5 lg:left-8">
            <button
              type="button"
              aria-label="Previous slide"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-lg leading-none text-white motion-safe:transition-colors motion-safe:hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-house-gold"
              onClick={() => go(-1)}
            >
              <span aria-hidden="true">‹</span>
            </button>
            <div className="flex items-center" role="group" aria-label="Choose a slide">
              {slides.map((slide, slideIndex) => (
                <button
                  key={slide.id}
                  type="button"
                  aria-label={`Show ${slide.eyebrow}`}
                  aria-current={slideIndex === index ? "true" : undefined}
                  className="inline-flex h-11 w-8 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-house-gold"
                  onClick={() => setIndex(slideIndex)}
                >
                  <span
                    className={`block rounded-full ${
                      slideIndex === index ? "h-2 w-6 bg-house-gold" : "h-2 w-2 bg-white/70"
                    }`}
                  />
                </button>
              ))}
            </div>
            <button
              type="button"
              aria-label="Next slide"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-lg leading-none text-white motion-safe:transition-colors motion-safe:hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-house-gold"
              onClick={() => go(1)}
            >
              <span aria-hidden="true">›</span>
            </button>
          </div>
        </div>

        <nav aria-label="Shop sections" className="mt-3">
          <ul className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {chips.map((chip) => (
              <li key={chip.href} className="shrink-0 snap-start">
                <Link
                  href={chip.href}
                  className="inline-flex min-h-11 items-center rounded-full border border-[#e4d3b0] bg-white px-4 text-sm font-medium text-ink shadow-sm motion-safe:transition-colors motion-safe:hover:border-house-gold"
                >
                  {chip.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
