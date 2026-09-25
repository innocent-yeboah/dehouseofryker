import Image from "next/image";
import Link from "next/link";
import { departmentPath, sectionPath, visibleDepartments, visibleSections } from "@/lib/ia";
import type { DepartmentId, Product, SectionId } from "@/types/shop";

type Shot = { src: string; alt: string; frame: string };

const visuals: Partial<Record<DepartmentId, { panel: string; shots: Shot[] }>> = {
  fragrance: {
    panel: "bg-[radial-gradient(ellipse_at_50%_40%,#fbf6ec_0%,#f3e6cc_70%,#e7d3ac_100%)]",
    shots: [
      {
        src: "/hero/oil-almas-bushra.png",
        alt: "Almas Bushra Perfume Oil 100 g",
        frame: "bottom-0 left-[2%] h-[86%] w-[42%]",
      },
      {
        src: "/hero/oil-almas-royal-black.png",
        alt: "Almas Royal Black Perfume Oil 100 g",
        frame: "bottom-0 right-[2%] h-[96%] w-[48%]",
      },
    ],
  },
  skincare: {
    panel: "bg-[radial-gradient(ellipse_at_50%_40%,#fbf7ef_0%,#f1e4d4_72%,#e6d2b8_100%)]",
    shots: [
      {
        src: "/hero/mask-24k-gold.png",
        alt: "PUQIANNA 24K Gold Whitening Facial Mask 25 ml",
        frame: "bottom-0 left-[4%] h-[92%] w-[38%]",
      },
      {
        src: "/hero/scrub-24k-gold.png",
        alt: "KÖRMESIC 24K Gold Exfoliating Scrub 100 g",
        frame: "bottom-0 right-[4%] h-[96%] w-[42%]",
      },
    ],
  },
  wellness: {
    panel: "bg-[radial-gradient(ellipse_at_50%_42%,#fbf6ec_0%,#f4e7cf_68%,#e8d5a3_100%)]",
    shots: [
      {
        src: "/hero/supplement-fruits-plus.png",
        alt: "OEM Fruits+ Whole Food Formula 90 capsules",
        frame: "bottom-0 left-[10%] h-[92%] w-[34%]",
      },
      {
        src: "/hero/supplement-veggies-plus.png",
        alt: "OEM Veggies+ Whole Food Formula 90 capsules",
        frame: "bottom-0 right-[10%] h-[92%] w-[34%]",
      },
    ],
  },
};

const shortSectionLabel: Partial<Record<SectionId, string>> = {
  perfume_oils: "Oils & Attars",
};

export function CategoryPromos({ products }: { products: Product[] }) {
  const departments = visibleDepartments(products);

  return (
    <section className="mx-auto max-w-7xl px-3 sm:px-4" aria-labelledby="shop-by-department">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 id="shop-by-department" className="font-serif text-2xl text-ink sm:text-3xl">
            Shop by department
          </h2>
          <p className="mt-1 text-sm text-muted">Fragrance, skincare, and wellness from the Accra shop.</p>
        </div>
        <Link
          href="/shop"
          className="shrink-0 text-sm font-medium text-deep-gold underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-house-gold"
        >
          Shop all
        </Link>
      </div>

      <div className="grid gap-3 lg:grid-cols-3 lg:gap-5">
        {departments.map((item) => {
          const count = products.filter((product) => product.department === item.id).length;
          const sections = visibleSections(products, item.id);
          const visual = visuals[item.id];
          const countLabel = `${count} ${count === 1 ? "product" : "products"}`;
          return (
            <article
              key={item.id}
              className="group relative flex h-[164px] overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(26,22,18,0.06)] ring-1 ring-black/5 lg:h-auto lg:flex-col"
            >
              <Link
                href={departmentPath(item.id)}
                aria-label={`Shop ${item.label}, ${countLabel}`}
                className="absolute inset-0 z-10 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-house-gold"
              />
              <div
                className={`relative h-full w-[42%] shrink-0 overflow-hidden lg:h-56 lg:w-full ${visual?.panel ?? "bg-ivory"}`}
              >
                {visual?.shots.map((shot) => (
                  <div key={shot.src} className={`absolute ${shot.frame}`}>
                    <Image
                      src={shot.src}
                      alt={shot.alt}
                      fill
                      sizes="(min-width: 1024px) 220px, 140px"
                      className="object-contain object-bottom motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.04]"
                    />
                  </div>
                ))}
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-center px-3 py-2.5 lg:px-5 lg:py-5">
                <p className="text-[10px] uppercase tracking-[0.18em] text-deep-gold">{item.eyebrow}</p>
                <h3 className="mt-0.5 font-serif text-[1.35rem] leading-none text-ink lg:mt-1 lg:text-3xl">
                  {item.label}
                </h3>
                <p className="mt-1 text-xs text-muted">{countLabel}</p>
                {sections.length > 0 ? (
                  <ul className="relative z-20 mt-1.5 flex flex-wrap gap-x-2 gap-y-0.5 lg:mt-3">
                    {sections.map((section) => (
                      <li key={section.id}>
                        <Link
                          href={sectionPath(section.id)}
                          className="text-[11px] text-ink/80 underline-offset-2 hover:text-deep-gold hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-house-gold lg:text-xs"
                        >
                          {shortSectionLabel[section.id] ?? section.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <p className="mt-auto pt-1.5 text-xs font-medium text-ink underline-offset-4 group-hover:underline lg:pt-4 lg:text-sm">
                  Shop {item.label}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
