import type { Product, Variant } from "@/types/shop";

/**
 * Photographed retail catalog. Studio shots live in `public/products/` and are
 * referenced as root-relative paths so Next.js serves them on Vercel.
 *
 * priceGhs and stockOnHand are PLACEHOLDERS. The owner has not set final Accra prices.
 * Spray sizeMl is a visual estimate (50): the photos do not show a printed volume.
 * Scrub tubes are sold by weight (100 g), so sizeMl is null and sizeText is "100 g".
 *
 * White Tea Mist is the house title for the white-tea hair & body mist bottle.
 * Finished scrubs and mists are not blend-to-order (blendWhenZero: false).
 * The two glass sprays keep the house spray pattern (blendWhenZero: true).
 */

const photo = (file: string) => `/products/${file}`;

function unit(
  id: number,
  productId: number,
  sku: string,
  priceGhs: number,
  stockOnHand: number,
  options: {
    sizeMl?: number | null;
    sizeText?: string;
    blendWhenZero?: boolean;
    maxRetailQty?: number;
  } = {},
): Variant {
  return {
    id,
    productId,
    sizeMl: options.sizeMl ?? null,
    sizeText: options.sizeText,
    sku,
    priceGhs,
    stockOnHand,
    stockReserved: 0,
    blendWhenZero: options.blendWhenZero ?? false,
    maxRetailQty: options.maxRetailQty ?? 6,
  };
}

export const seedProducts: Product[] = [
  {
    id: 1,
    name: "Blue Glass Spray",
    slug: "blue-glass-spray",
    description:
      "A slender glass atomizer with a blue gradient, clear at the collar and deep cobalt at the base. Ready to wear from the house.",
    kind: "spray",
    images: [photo("spray-blue.png")],
    active: true,
    featured: true,
    variants: [
      unit(1001, 1, "DHR-SPY-BLUE-50", 180, 8, {
        sizeMl: 50,
        blendWhenZero: true,
        maxRetailQty: 4,
      }),
    ],
  },
  {
    id: 2,
    name: "Red Glass Spray",
    slug: "red-glass-spray",
    description:
      "A slender glass atomizer with a red gradient, clear at the collar and deep crimson at the base. Ready to wear from the house.",
    kind: "spray",
    images: [photo("spray-red.png")],
    active: true,
    featured: false,
    variants: [
      unit(1002, 2, "DHR-SPY-RED-50", 180, 6, {
        sizeMl: 50,
        blendWhenZero: true,
        maxRetailQty: 4,
      }),
    ],
  },
  {
    id: 3,
    name: "24K Gold Exfoliating Scrub",
    slug: "24k-gold-exfoliating-scrub",
    description:
      "KÖRMESIC 24K gold exfoliating scrub cleanser. A 100 g tube for the face.",
    kind: "format",
    images: [photo("scrub-24k-gold.png")],
    active: true,
    featured: true,
    variants: [
      unit(1003, 3, "DHR-SCRUB-GOLD-100", 55, 16, {
        sizeText: "100 g",
        maxRetailQty: 6,
      }),
    ],
  },
  {
    id: 4,
    name: "Vitamin C Exfoliating Scrub",
    slug: "vitamin-c-exfoliating-scrub",
    description:
      "KÖRMESIC VC (vitamin C) exfoliating scrub cleanser. A 100 g tube for the face.",
    kind: "format",
    images: [photo("scrub-vc.png")],
    active: true,
    featured: false,
    variants: [
      unit(1004, 4, "DHR-SCRUB-VC-100", 50, 14, {
        sizeText: "100 g",
        maxRetailQty: 6,
      }),
    ],
  },
  {
    id: 5,
    name: "Avocado Exfoliating Scrub",
    slug: "avocado-exfoliating-scrub",
    description:
      "KÖRMESIC avocado exfoliating scrub cleanser. A 100 g tube for the face.",
    kind: "format",
    images: [photo("scrub-avocado.png")],
    active: true,
    featured: false,
    variants: [
      unit(1005, 5, "DHR-SCRUB-AVO-100", 48, 12, {
        sizeText: "100 g",
        maxRetailQty: 6,
      }),
    ],
  },
  {
    id: 6,
    name: "Sexy Bomb Hair & Body Mist",
    slug: "sexy-bomb-hair-body-mist",
    description:
      "Kormesic alcohol-free hair and body mist, Sexy Bomb. 290 ml.",
    kind: "format",
    images: [photo("mist-sexy-bomb.png")],
    active: true,
    featured: true,
    variants: [
      unit(1006, 6, "DHR-MIST-SEXY-290", 85, 10, {
        sizeMl: 290,
        maxRetailQty: 6,
      }),
    ],
  },
  {
    id: 7,
    name: "White Tea Mist",
    slug: "white-tea-mist",
    description:
      "Kormesic alcohol-free hair and body mist with a soft white-tea scent. 290 ml.",
    kind: "format",
    images: [photo("mist-hilton-white-tea.png")],
    active: true,
    featured: true,
    variants: [
      unit(1007, 7, "DHR-MIST-WTEA-290", 85, 9, {
        sizeMl: 290,
        maxRetailQty: 6,
      }),
    ],
  },
  {
    id: 8,
    name: "Encounter Huayang Hair & Body Mist",
    slug: "encounter-huayang-hair-body-mist",
    description:
      "Kormesic alcohol-free hair and body mist, Encounter Huayang. 290 ml.",
    kind: "format",
    images: [photo("mist-encounter-huayang.png")],
    active: true,
    featured: false,
    variants: [
      unit(1008, 8, "DHR-MIST-HUAYANG-290", 85, 8, {
        sizeMl: 290,
        maxRetailQty: 6,
      }),
    ],
  },
  {
    id: 9,
    name: "Tropical Fruits Hair & Body Mist",
    slug: "tropical-fruits-hair-body-mist",
    description:
      "Kormesic alcohol-free hair and body mist, Tropical Fruits. 290 ml.",
    kind: "format",
    images: [photo("mist-tropical-fruits.png")],
    active: true,
    featured: false,
    variants: [
      unit(1009, 9, "DHR-MIST-TROPIC-290", 80, 11, {
        sizeMl: 290,
        maxRetailQty: 6,
      }),
    ],
  },
  {
    id: 10,
    name: "Orange Green Hair & Body Mist",
    slug: "orange-green-hair-body-mist",
    description:
      "Kormesic alcohol-free hair and body mist, Orange Green. 290 ml.",
    kind: "format",
    images: [photo("mist-orange-green.png")],
    active: true,
    featured: false,
    variants: [
      unit(1010, 10, "DHR-MIST-OGREEN-290", 80, 7, {
        sizeMl: 290,
        maxRetailQty: 6,
      }),
    ],
  },
  {
    id: 11,
    name: "Pink Meets Hair & Body Mist",
    slug: "pink-meets-hair-body-mist",
    description:
      "Kormesic alcohol-free hair and body mist, Pink Meets. 290 ml.",
    kind: "format",
    images: [photo("mist-pink-meets.png")],
    active: true,
    featured: false,
    variants: [
      unit(1011, 11, "DHR-MIST-PINK-290", 80, 10, {
        sizeMl: 290,
        maxRetailQty: 6,
      }),
    ],
  },
];

export const kindLabels: Record<Product["kind"], string> = {
  oil: "Oils",
  spray: "Sprays",
  format: "Scrubs & mists",
  empty_bottle: "Empty bottles",
  packaging: "Packaging",
};

export const kindPaths: Record<Product["kind"], string> = {
  oil: "oils",
  spray: "sprays",
  format: "formats",
  empty_bottle: "bottles",
  packaging: "packaging",
};

export function kindFromPath(category: string): Product["kind"] | null {
  const map: Record<string, Product["kind"]> = {
    oils: "oil",
    sprays: "spray",
    formats: "format",
    cosmetics: "format",
    bottles: "empty_bottle",
    packaging: "packaging",
  };
  return map[category] ?? null;
}
