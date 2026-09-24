import type { Product, Variant } from "@/types/shop";

/**
 * Photographed retail catalog. Studio shots live in `public/products/` and are
 * referenced as root-relative paths so Next.js serves them on Vercel.
 *
 * priceGhs and stockOnHand are PLACEHOLDERS. The owner has not set final Accra prices.
 * Mask sachets and the KORMESIC soap use the same placeholder band as the other
 * format SKUs (about 40–55 GHS, near the 100 g scrubs). They are not Accra prices.
 * Spray sizeMl is a visual estimate (50): the photos do not show a printed volume.
 * Scrub tubes and the soap are sold by weight (100 g), so sizeMl is null and sizeText is "100 g".
 * Masks use sizeText "25 ml" (Net 25 ml sachets).
 *
 * White Tea Mist is the house title for the white-tea hair & body mist bottle.
 * Finished scrubs, mists, masks, and soap are not blend-to-order (blendWhenZero: false).
 * The two glass sprays keep the house spray pattern (blendWhenZero: true).
 * Featured masks are a small set only: 24K Gold, Niacinamide, and Coffee, plus the KORMESIC soap.
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
  {
    id: 12,
    name: "PUQIANNA Aloe Vera Facial Mask",
    slug: "puqianna-aloe-vera-mask",
    description: "PUQIANNA aloe vera facial mask. Net 25 ml sachet.",
    kind: "format",
    images: [photo("mask-aloe-vera.png")],
    active: true,
    featured: false,
    variants: [
      unit(1012, 12, "DHR-MASK-ALOE-25", 42, 14, {
        sizeText: "25 ml",
      }),
    ],
  },
  {
    id: 13,
    name: "PUQIANNA Grape Facial Mask",
    slug: "puqianna-grape-mask",
    description:
      "PUQIANNA grape facial mask, classic cartoon line. Net 25 ml sachet.",
    kind: "format",
    images: [photo("mask-grape-classic.png")],
    active: true,
    featured: false,
    variants: [
      unit(1013, 13, "DHR-MASK-GRAPE-25", 42, 12, {
        sizeText: "25 ml",
      }),
    ],
  },
  {
    id: 14,
    name: "PUQIANNA Orange Facial Mask",
    slug: "puqianna-orange-mask",
    description: "PUQIANNA orange facial mask. Net 25 ml sachet.",
    kind: "format",
    images: [photo("mask-orange.png")],
    active: true,
    featured: false,
    variants: [
      unit(1014, 14, "DHR-MASK-ORANGE-25", 40, 16, {
        sizeText: "25 ml",
      }),
    ],
  },
  {
    id: 15,
    name: "PUQIANNA Pomegranate Facial Mask",
    slug: "puqianna-pomegranate-mask",
    description:
      "PUQIANNA pomegranate facial mask, classic cartoon line. Net 25 ml sachet.",
    kind: "format",
    images: [photo("mask-pomegranate-classic.png")],
    active: true,
    featured: false,
    variants: [
      unit(1015, 15, "DHR-MASK-POM-25", 42, 11, {
        sizeText: "25 ml",
      }),
    ],
  },
  {
    id: 16,
    name: "PUQIANNA Milk Moisturizing Facial Mask",
    slug: "puqianna-milk-mask",
    description: "PUQIANNA milk moisturizing facial mask. Net 25 ml sachet.",
    kind: "format",
    images: [photo("mask-milk.png")],
    active: true,
    featured: false,
    variants: [
      unit(1016, 16, "DHR-MASK-MILK-25", 45, 13, {
        sizeText: "25 ml",
      }),
    ],
  },
  {
    id: 17,
    name: "PUQIANNA Cucumber Facial Mask",
    slug: "puqianna-cucumber-mask",
    description: "PUQIANNA cucumber facial mask. Net 25 ml sachet.",
    kind: "format",
    images: [photo("mask-cucumber.png")],
    active: true,
    featured: false,
    variants: [
      unit(1017, 17, "DHR-MASK-CUCUMBER-25", 40, 15, {
        sizeText: "25 ml",
      }),
    ],
  },
  {
    id: 18,
    name: "PUQIANNA Avocado Facial Mask",
    slug: "puqianna-avocado-mask",
    description: "PUQIANNA avocado facial mask. Net 25 ml sachet.",
    kind: "format",
    images: [photo("mask-avocado.png")],
    active: true,
    featured: false,
    variants: [
      unit(1018, 18, "DHR-MASK-AVOCADO-25", 42, 10, {
        sizeText: "25 ml",
      }),
    ],
  },
  {
    id: 19,
    name: "PUQIANNA Lavender Facial Mask",
    slug: "puqianna-lavender-mask",
    description: "PUQIANNA lavender facial mask. Net 25 ml sachet.",
    kind: "format",
    images: [photo("mask-lavender.png")],
    active: true,
    featured: false,
    variants: [
      unit(1019, 19, "DHR-MASK-LAVENDER-25", 45, 9, {
        sizeText: "25 ml",
      }),
    ],
  },
  {
    id: 20,
    name: "PUQIANNA Honey Facial Mask",
    slug: "puqianna-honey-mask",
    description: "PUQIANNA honey facial mask. Net 25 ml sachet.",
    kind: "format",
    images: [photo("mask-honey.png")],
    active: true,
    featured: false,
    variants: [
      unit(1020, 20, "DHR-MASK-HONEY-25", 42, 12, {
        sizeText: "25 ml",
      }),
    ],
  },
  {
    id: 21,
    name: "PUQIANNA 24K Gold Whitening Facial Mask",
    slug: "puqianna-24k-gold-mask",
    description: "PUQIANNA 24K gold whitening facial mask. Net 25 ml sachet.",
    kind: "format",
    images: [photo("mask-24k-gold.png")],
    active: true,
    featured: true,
    variants: [
      unit(1021, 21, "DHR-MASK-GOLD-25", 55, 18, {
        sizeText: "25 ml",
      }),
    ],
  },
  {
    id: 22,
    name: "PUQIANNA Strawberry Facial Mask (Wave)",
    slug: "puqianna-strawberry-wave-mask",
    description:
      "PUQIANNA strawberry facial mask in the wave pack. Net 25 ml sachet.",
    kind: "format",
    images: [photo("mask-strawberry-wave.png")],
    active: true,
    featured: false,
    variants: [
      unit(1022, 22, "DHR-MASK-STRAW-W-25", 44, 11, {
        sizeText: "25 ml",
      }),
    ],
  },
  {
    id: 23,
    name: "PUQIANNA Carrot Hydrating Facial Mask",
    slug: "puqianna-carrot-mask",
    description: "PUQIANNA carrot hydrating facial mask. Net 25 ml sachet.",
    kind: "format",
    images: [photo("mask-carrot.png")],
    active: true,
    featured: false,
    variants: [
      unit(1023, 23, "DHR-MASK-CARROT-25", 42, 14, {
        sizeText: "25 ml",
      }),
    ],
  },
  {
    id: 24,
    name: "PUQIANNA Blueberry Facial Mask",
    slug: "puqianna-blueberry-mask",
    description: "PUQIANNA blueberry facial mask. Net 25 ml sachet.",
    kind: "format",
    images: [photo("mask-blueberry.png")],
    active: true,
    featured: false,
    variants: [
      unit(1024, 24, "DHR-MASK-BLUEBERRY-25", 44, 10, {
        sizeText: "25 ml",
      }),
    ],
  },
  {
    id: 25,
    name: "PUQIANNA Lemon Vitamin C Facial Mask",
    slug: "puqianna-lemon-vitamin-c-mask",
    description:
      "PUQIANNA lemon vitamin C facial mask, wave pack. Net 25 ml sachet.",
    kind: "format",
    images: [photo("mask-lemon-vc.png")],
    active: true,
    featured: false,
    variants: [
      unit(1025, 25, "DHR-MASK-LEMON-VC-25", 48, 13, {
        sizeText: "25 ml",
      }),
    ],
  },
  {
    id: 26,
    name: "PUQIANNA Sweet Peach Facial Mask",
    slug: "puqianna-sweet-peach-mask",
    description: "PUQIANNA sweet peach facial mask. Net 25 ml sachet.",
    kind: "format",
    images: [photo("mask-sweet-peach.png")],
    active: true,
    featured: false,
    variants: [
      unit(1026, 26, "DHR-MASK-PEACH-25", 44, 12, {
        sizeText: "25 ml",
      }),
    ],
  },
  {
    id: 27,
    name: "PUQIANNA Watermelon Facial Mask (Wave)",
    slug: "puqianna-watermelon-wave-mask",
    description:
      "PUQIANNA watermelon facial mask in the wave pack. Net 25 ml sachet.",
    kind: "format",
    images: [photo("mask-watermelon-wave.png")],
    active: true,
    featured: false,
    variants: [
      unit(1027, 27, "DHR-MASK-MELON-W-25", 44, 9, {
        sizeText: "25 ml",
      }),
    ],
  },
  {
    id: 28,
    name: "PUQIANNA Niacinamide Facial Mask",
    slug: "puqianna-niacinamide-mask",
    description: "PUQIANNA niacinamide facial mask. Net 25 ml sachet.",
    kind: "format",
    images: [photo("mask-niacinamide.png")],
    active: true,
    featured: true,
    variants: [
      unit(1028, 28, "DHR-MASK-NIACIN-25", 50, 16, {
        sizeText: "25 ml",
      }),
    ],
  },
  {
    id: 29,
    name: "PUQIANNA Coffee Facial Mask",
    slug: "puqianna-coffee-mask",
    description: "PUQIANNA coffee facial mask. Net 25 ml sachet.",
    kind: "format",
    images: [photo("mask-coffee.png")],
    active: true,
    featured: true,
    variants: [
      unit(1029, 29, "DHR-MASK-COFFEE-25", 48, 15, {
        sizeText: "25 ml",
      }),
    ],
  },
  {
    id: 30,
    name: "PUQIANNA Shea Butter Facial Mask",
    slug: "puqianna-shea-butter-mask",
    description: "PUQIANNA shea butter facial mask. Net 25 ml sachet.",
    kind: "format",
    images: [photo("mask-shea-butter.png")],
    active: true,
    featured: false,
    variants: [
      unit(1030, 30, "DHR-MASK-SHEA-25", 46, 12, {
        sizeText: "25 ml",
      }),
    ],
  },
  {
    id: 31,
    name: "PUQIANNA Snail Facial Mask",
    slug: "puqianna-snail-mask",
    description: "PUQIANNA snail facial mask. Net 25 ml sachet.",
    kind: "format",
    images: [photo("mask-snail.png")],
    active: true,
    featured: false,
    variants: [
      unit(1031, 31, "DHR-MASK-SNAIL-25", 48, 10, {
        sizeText: "25 ml",
      }),
    ],
  },
  {
    id: 32,
    name: "PUQIANNA Chamomile Facial Mask",
    slug: "puqianna-chamomile-mask",
    description: "PUQIANNA chamomile facial mask. Net 25 ml sachet.",
    kind: "format",
    images: [photo("mask-chamomile.png")],
    active: true,
    featured: false,
    variants: [
      unit(1032, 32, "DHR-MASK-CHAMOMILE-25", 45, 11, {
        sizeText: "25 ml",
      }),
    ],
  },
  {
    id: 33,
    name: "PUQIANNA Oats Facial Mask",
    slug: "puqianna-oats-mask",
    description: "PUQIANNA oats facial mask. Net 25 ml sachet.",
    kind: "format",
    images: [photo("mask-oats.png")],
    active: true,
    featured: false,
    variants: [
      unit(1033, 33, "DHR-MASK-OATS-25", 42, 13, {
        sizeText: "25 ml",
      }),
    ],
  },
  {
    id: 34,
    name: "PUQIANNA Rice Facial Mask",
    slug: "puqianna-rice-mask",
    description:
      "PUQIANNA rice facial mask, center-label fruit line. Net 25 ml sachet.",
    kind: "format",
    images: [photo("mask-rice.png")],
    active: true,
    featured: false,
    variants: [
      unit(1034, 34, "DHR-MASK-RICE-25", 40, 14, {
        sizeText: "25 ml",
      }),
    ],
  },
  {
    id: 35,
    name: "PUQIANNA Pomegranate Extract Facial Mask",
    slug: "puqianna-pomegranate-extract-mask",
    description:
      "PUQIANNA pomegranate extract facial mask, center-label fruit line. Net 25 ml sachet.",
    kind: "format",
    images: [photo("mask-pomegranate-label.png")],
    active: true,
    featured: false,
    variants: [
      unit(1035, 35, "DHR-MASK-POM-X-25", 42, 10, {
        sizeText: "25 ml",
      }),
    ],
  },
  {
    id: 36,
    name: "PUQIANNA Strawberry Extract Facial Mask",
    slug: "puqianna-strawberry-extract-mask",
    description:
      "PUQIANNA strawberry extract facial mask, center-label fruit line. Net 25 ml sachet.",
    kind: "format",
    images: [photo("mask-strawberry-label.png")],
    active: true,
    featured: false,
    variants: [
      unit(1036, 36, "DHR-MASK-STRAW-X-25", 42, 11, {
        sizeText: "25 ml",
      }),
    ],
  },
  {
    id: 37,
    name: "PUQIANNA Grape Extract Facial Mask",
    slug: "puqianna-grape-extract-mask",
    description:
      "PUQIANNA grape extract facial mask, center-label fruit line. Net 25 ml sachet.",
    kind: "format",
    images: [photo("mask-grapes-label.png")],
    active: true,
    featured: false,
    variants: [
      unit(1037, 37, "DHR-MASK-GRAPE-X-25", 42, 9, {
        sizeText: "25 ml",
      }),
    ],
  },
  {
    id: 38,
    name: "PUQIANNA Lemon Extract Facial Mask",
    slug: "puqianna-lemon-extract-mask",
    description:
      "PUQIANNA lemon extract facial mask, center-label fruit line. Net 25 ml sachet.",
    kind: "format",
    images: [photo("mask-lemon-label.png")],
    active: true,
    featured: false,
    variants: [
      unit(1038, 38, "DHR-MASK-LEMON-X-25", 45, 12, {
        sizeText: "25 ml",
      }),
    ],
  },
  {
    id: 39,
    name: "PUQIANNA Watermelon Extract Facial Mask",
    slug: "puqianna-watermelon-extract-mask",
    description:
      "PUQIANNA watermelon extract facial mask, center-label fruit line. Net 25 ml sachet.",
    kind: "format",
    images: [photo("mask-watermelon-label.png")],
    active: true,
    featured: false,
    variants: [
      unit(1039, 39, "DHR-MASK-MELON-X-25", 42, 8, {
        sizeText: "25 ml",
      }),
    ],
  },
  {
    id: 40,
    name: "KORMESIC Whitening Shea Butter Soap",
    slug: "kormesic-whitening-shea-soap",
    description: "KORMESIC whitening shea butter soap. A 100 g bar.",
    kind: "format",
    images: [photo("soap-kormesic-whitening.png")],
    active: true,
    featured: true,
    variants: [
      unit(1040, 40, "DHR-SOAP-WHITE-100", 52, 14, {
        sizeText: "100 g",
      }),
    ],
  },
];

export const kindLabels: Record<Product["kind"], string> = {
  oil: "Oils",
  spray: "Sprays",
  format: "Skin care & mists",
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
