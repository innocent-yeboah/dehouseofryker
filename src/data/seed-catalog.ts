import type { Product, Variant } from "@/types/shop";

/**
 * Photographed retail catalog. Studio shots live in `public/products/` and are
 * referenced as root-relative paths so Next.js serves them on Vercel.
 *
 * priceGhs and stockOnHand are PLACEHOLDERS. The owner has not set final Accra prices.
 * Mask sachets, lip masks, the eye-mask sachet, and the KORMESIC soaps use the same
 * placeholder band as the other format SKUs (about 40–55 GHS, near the 100 g scrubs).
 * Perfume oils (Play Blue, the crystal flacon, the YZS bottles, Veyes 9 am, Veyes Dawn,
 * Miss Candy, ZARR Forget Me Not, the 30 ml eaux de parfum, Nine Black, and Al Kausar Aqua 212)
 * use a placeholder band of about 80–150 GHS. They are not Accra prices.
 * ZARR Forget Me Not and Nine Black are 120. Pink Floral, Gold Drip, Black & Gold, Orange Floral,
 * Red Blossom, Coral Floral, and Plum Swirl are 80. YZS Wilderness and YZS Carpet of Flowers are 90.
 * Al Kausar Aqua 212 concentrated attar is 100.
 * TODO: owner to set real price.
 * Maison Crivelli Hibiscus Mahajád and Oud Maracujá sit at 150, the top of that band.
 * TODO: owner to set real price (genuine luxury item).
 * The vitamin C shower gel uses 85, the same large-format liquid placeholder as the 290 ml mists.
 * Spray sizeMl is a visual estimate (50): the photos do not show a printed volume.
 * Scrub tubes and the shea soap are sold by weight (100 g), so sizeMl is null and sizeText is "100 g".
 * The niacinamide soap is 110 g. FAYANKÔU lip masks and the SADOER orange lip mask are 4.5 g sachets.
 * SADOER strawberry and POUQUR cherry pink lip masks are one sachet (no printed net on the tile).
 * Eye masks are one sachet, two patches. Play Blue is 100 g. Veyes 9 am and Veyes Dawn are 100 ml.
 * ZARR Forget Me Not by Veyes is 100 ml. Pink Floral, Gold Drip, Black & Gold, Orange Floral,
 * Red Blossom, Coral Floral, and Plum Swirl are one 30 ml eau de parfum bottle each (not a display box).
 * Nine Black is 100 ml. YZS Wilderness and YZS Carpet of Flowers are 35 ml.
 * Al Kausar Aqua 212 is an alcohol-free concentrated attar, 100 g.
 * The vitamin C shower gel is Net 1000 ml. Miss Candy has no printed volume, so sizeText is omitted.
 * Maison Crivelli extraits are 50 ml (printed on the box).
 * Masks use sizeText "25 ml" (Net 25 ml sachets). YZS bottles and the crystal flacon use "50 ml".
 *
 * White Tea Mist is the house title for the white-tea hair & body mist bottle.
 * Crystal Amber Inspired Perfume is the house title for the faceted crystal bottle.
 * Do not sell that flacon under the name printed on the glass.
 * Hibiscus Mahajád and Oud Maracujá are genuine Maison Crivelli extraits; keep the real names.
 * Finished scrubs, mists, masks, lip masks, the eye mask, soap, the shower gel, and perfume oils
 * are not blend-to-order (blendWhenZero: false).
 * The two glass sprays keep the house spray pattern (blendWhenZero: true).
 * Featured masks are a small set only: 24K Gold, Niacinamide, and Coffee, plus the KORMESIC soaps.
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
  {
    id: 41,
    name: "KORMESIC Niacinamide Whitening Soap",
    slug: "kormesic-niacinamide-whitening-soap",
    description: "KORMESIC niacinamide deep-cleaning whitening soap. A 110 g bar.",
    kind: "format",
    images: [photo("soap-kormesic-niacinamide.png")],
    active: true,
    featured: true,
    variants: [
      unit(1041, 41, "DHR-SOAP-NIAC-110", 54, 12, {
        sizeText: "110 g",
      }),
    ],
  },
  {
    id: 42,
    name: "HANYUTANG Crystal Collagen Eye Mask",
    slug: "hanyutang-crystal-collagen-eye-mask",
    description:
      "HANYUTANG crystal collagen gold-powder eye mask. One sachet, two patches.",
    kind: "format",
    images: [photo("eye-hanyutang-collagen.png")],
    active: true,
    featured: false,
    variants: [
      unit(1042, 42, "DHR-EYE-COLLAGEN-2", 48, 10, {
        sizeText: "1 sachet (2 patches)",
      }),
    ],
  },
  {
    id: 43,
    name: "FAYANKÔU Cherry Moisturizing Soft Lip Mask",
    slug: "fayankou-cherry-lip-mask",
    description: "FAYANKÔU moisturizing soft lip mask, Cherry. One 4.5 g sachet.",
    kind: "format",
    images: [photo("lip-cherry.png")],
    active: true,
    featured: false,
    variants: [
      unit(1043, 43, "DHR-LIP-CHERRY-45", 44, 14, {
        sizeText: "4.5 g",
      }),
    ],
  },
  {
    id: 44,
    name: "FAYANKÔU Avocado Moisturizing Soft Lip Mask",
    slug: "fayankou-avocado-lip-mask",
    description: "FAYANKÔU moisturizing soft lip mask, Avocado. One 4.5 g sachet.",
    kind: "format",
    images: [photo("lip-avocado.png")],
    active: true,
    featured: false,
    variants: [
      unit(1044, 44, "DHR-LIP-AVO-45", 42, 11, {
        sizeText: "4.5 g",
      }),
    ],
  },
  {
    id: 45,
    name: "FAYANKÔU Strawberry Moisturizing Soft Lip Mask",
    slug: "fayankou-strawberry-lip-mask",
    description: "FAYANKÔU moisturizing soft lip mask, Strawberry. One 4.5 g sachet.",
    kind: "format",
    images: [photo("lip-strawberry.png")],
    active: true,
    featured: false,
    variants: [
      unit(1045, 45, "DHR-LIP-STRAW-45", 44, 13, {
        sizeText: "4.5 g",
      }),
    ],
  },
  {
    id: 46,
    name: "FAYANKÔU Aloe Moisturizing Soft Lip Mask",
    slug: "fayankou-aloe-lip-mask",
    description: "FAYANKÔU moisturizing soft lip mask, Aloe. One 4.5 g sachet.",
    kind: "format",
    images: [photo("lip-aloe.png")],
    active: true,
    featured: false,
    variants: [
      unit(1046, 46, "DHR-LIP-ALOE-45", 42, 12, {
        sizeText: "4.5 g",
      }),
    ],
  },
  {
    id: 47,
    name: "FAYANKÔU Honey Orange Moisturizing Soft Lip Mask",
    slug: "fayankou-honey-orange-lip-mask",
    description: "FAYANKÔU moisturizing soft lip mask, Honey Orange. One 4.5 g sachet.",
    kind: "format",
    images: [photo("lip-honey.png")],
    active: true,
    featured: false,
    variants: [
      unit(1047, 47, "DHR-LIP-HONEY-45", 45, 10, {
        sizeText: "4.5 g",
      }),
    ],
  },
  {
    id: 48,
    name: "FAYANKÔU Blueberry Moisturizing Soft Lip Mask",
    slug: "fayankou-blueberry-lip-mask",
    description: "FAYANKÔU moisturizing soft lip mask, Blueberry. One 4.5 g sachet.",
    kind: "format",
    images: [photo("lip-blueberry.png")],
    active: true,
    featured: false,
    variants: [
      unit(1048, 48, "DHR-LIP-BLUE-45", 44, 9, {
        sizeText: "4.5 g",
      }),
    ],
  },
  {
    id: 49,
    name: "Almas Play Blue Perfume Oil",
    slug: "almas-play-blue-perfume-oil",
    description: "Almas Play Blue concentrated perfume oil. A 100 g bottle.",
    kind: "oil",
    images: [photo("oil-play-blue.png")],
    active: true,
    featured: false,
    variants: [
      unit(1049, 49, "DHR-OIL-PLAYBLUE-100", 110, 8, {
        sizeText: "100 g",
      }),
    ],
  },
  {
    id: 50,
    name: "Crystal Amber Inspired Perfume",
    slug: "crystal-amber-inspired-perfume",
    description:
      "House title for a faceted crystal bottle of amber perfume with a glass stopper, Mouslhorov-style flacon. About 50 ml.",
    kind: "oil",
    images: [photo("perfume-caron-mouslhorov.png")],
    active: true,
    featured: false,
    variants: [
      unit(1050, 50, "DHR-OIL-AMBER-50", 120, 6, {
        sizeText: "50 ml",
      }),
    ],
  },
  {
    id: 51,
    name: "YZS White 50 ml",
    slug: "yzs-white-50ml",
    description: "YZS White eau de parfum in a white bottle. 50 ml.",
    kind: "oil",
    images: [photo("perfume-yzs-white.png")],
    active: true,
    featured: false,
    variants: [
      unit(1051, 51, "DHR-OIL-YZS-WHT-50", 95, 8, {
        sizeText: "50 ml",
      }),
    ],
  },
  {
    id: 52,
    name: "YZS Peach 50 ml",
    slug: "yzs-peach-50ml",
    description: "YZS Peach eau de parfum in a peach bottle. 50 ml.",
    kind: "oil",
    images: [photo("perfume-yzs-peach.png")],
    active: true,
    featured: false,
    variants: [
      unit(1052, 52, "DHR-OIL-YZS-PCH-50", 90, 7, {
        sizeText: "50 ml",
      }),
    ],
  },
  {
    id: 53,
    name: "YZS Black 50 ml",
    slug: "yzs-black-50ml",
    description: "YZS Black eau de parfum in a black bottle. 50 ml.",
    kind: "oil",
    images: [photo("perfume-yzs-black.png")],
    active: true,
    featured: false,
    variants: [
      unit(1053, 53, "DHR-OIL-YZS-BLK-50", 100, 8, {
        sizeText: "50 ml",
      }),
    ],
  },
  {
    id: 54,
    name: "YZS Ruby 50 ml",
    slug: "yzs-ruby-50ml",
    description: "YZS Ruby eau de parfum in a ruby bottle. 50 ml.",
    kind: "oil",
    images: [photo("perfume-yzs-ruby.png")],
    active: true,
    featured: false,
    variants: [
      unit(1054, 54, "DHR-OIL-YZS-RBY-50", 98, 7, {
        sizeText: "50 ml",
      }),
    ],
  },
  {
    id: 55,
    name: "SADOER Sweet Strawberry Lip Mask",
    slug: "lip-sadoer-strawberry",
    description:
      "SADOER sweet strawberry lip mask, Sweet Fruit series. One sachet.",
    kind: "format",
    images: [photo("lip-sadoer-strawberry.png")],
    active: true,
    featured: false,
    variants: [
      unit(1055, 55, "DHR-LIP-SAD-STR", 48, 12, {
        sizeText: "one sachet",
      }),
    ],
  },
  {
    id: 56,
    name: "POUQUR Cherry Pink Lip Mask",
    slug: "lip-pouqur-cherry-pink",
    description: "POUQUR cherry pink lip mask, Fruit series. One sachet.",
    kind: "format",
    images: [photo("lip-pouqur-cherry-pink.png")],
    active: true,
    featured: false,
    variants: [
      unit(1056, 56, "DHR-LIP-POU-PNK", 46, 11, {
        sizeText: "one sachet",
      }),
    ],
  },
  {
    id: 57,
    name: "POUQUR Aloe Vera Collagen Eye Mask",
    slug: "eye-pouqur-aloe-collagen",
    description:
      "POUQUR aloe vera collagen eye mask, Eye Care series. One sachet, two patches.",
    kind: "format",
    images: [photo("eye-pouqur-aloe-collagen.png")],
    active: true,
    featured: false,
    variants: [
      unit(1057, 57, "DHR-EYE-POU-ALOE", 50, 10, {
        sizeText: "1 sachet (2 patches)",
      }),
    ],
  },
  {
    id: 58,
    name: "SADOER Hyaluronic Acid Delicate Moisturizing Eye Mask",
    slug: "eye-sadoer-hyaluronic",
    description:
      "SADOER hyaluronic acid delicate moisturizing eye mask. One sachet, two patches.",
    kind: "format",
    images: [photo("eye-sadoer-hyaluronic.png")],
    active: true,
    featured: false,
    variants: [
      unit(1058, 58, "DHR-EYE-SAD-HA", 52, 9, {
        sizeText: "1 sachet (2 patches)",
      }),
    ],
  },
  {
    id: 59,
    name: "SADOER Orange Moisturizing Lip Mask",
    slug: "lip-sadoer-orange",
    description:
      "SADOER orange moisturizing lip mask, Fruit series. One 4.5 g sachet.",
    kind: "format",
    images: [photo("lip-sadoer-orange.png")],
    active: true,
    featured: false,
    variants: [
      unit(1059, 59, "DHR-LIP-SAD-ORG-45", 49, 10, {
        sizeText: "4.5 g",
      }),
    ],
  },
  {
    id: 60,
    name: "Veyes \"9 am\" Eau de Parfum 100 ml",
    slug: "perfume-veyes-9am",
    description: "Veyes 9 am eau de parfum. 100 ml.",
    kind: "oil",
    images: [photo("perfume-veyes-9am.png")],
    active: true,
    featured: false,
    variants: [
      unit(1060, 60, "DHR-OIL-VEYES-100", 120, 6, {
        sizeText: "100 ml",
      }),
    ],
  },
  {
    id: 61,
    name: "Veyes \"Dawn\" Eau de Parfum 100 ml",
    slug: "perfume-veyes-dawn",
    description: "Veyes Dawn eau de parfum. 100 ml.",
    kind: "oil",
    images: [photo("perfume-veyes-dawn.png")],
    active: true,
    featured: false,
    variants: [
      unit(1061, 61, "DHR-OIL-VEYES-DWN-100", 120, 6, {
        sizeText: "100 ml",
      }),
    ],
  },
  {
    id: 62,
    name: "Vitamin C Anti-Aging Shower Gel 1000 ml",
    slug: "gel-vitamin-c-shower",
    description: "Vitamin C anti-aging shower gel. Net 1000 ml.",
    kind: "format",
    images: [photo("gel-vitamin-c-shower.png")],
    active: true,
    featured: false,
    variants: [
      unit(1062, 62, "DHR-GEL-VC-1000", 85, 8, {
        sizeMl: 1000,
        sizeText: "1000 ml",
      }),
    ],
  },
  {
    id: 63,
    name: "SADOER Caviar Essence Eye Mask",
    slug: "eye-sadoer-caviar",
    description:
      "SADOER caviar essence eye mask, Eye Care series. One sachet, two patches.",
    kind: "format",
    images: [photo("eye-sadoer-caviar.png")],
    active: true,
    featured: false,
    variants: [
      unit(1063, 63, "DHR-EYE-SAD-CAV", 52, 9, {
        sizeText: "1 sachet (2 patches)",
      }),
    ],
  },
  {
    id: 64,
    name: "Miss Candy Perfume",
    slug: "perfume-miss-candy",
    description:
      "Miss Candy perfume. The tile does not show a printed volume.",
    kind: "oil",
    images: [photo("perfume-miss-candy.png")],
    active: true,
    featured: false,
    variants: [
      unit(1064, 64, "DHR-OIL-CANDY", 110, 6),
    ],
  },
  {
    id: 65,
    name: "Maison Crivelli Hibiscus Mahajád Extrait de Parfum",
    slug: "perfume-crivelli-hibiscus-mahajad",
    description:
      "Maison Crivelli Hibiscus Mahajád extrait de parfum. 50 ml.",
    kind: "oil",
    images: [photo("perfume-crivelli-hibiscus.png")],
    active: true,
    featured: false,
    variants: [
      unit(
        1065,
        65,
        "DHR-OIL-CRIV-HIB-50",
        // TODO: owner to set real price (genuine luxury item)
        150,
        4,
        {
          sizeText: "50 ml",
        },
      ),
    ],
  },
  {
    id: 66,
    name: "Maison Crivelli Oud Maracujá Extrait de Parfum",
    slug: "perfume-crivelli-oud-maracuja",
    description: "Maison Crivelli Oud Maracujá extrait de parfum. 50 ml.",
    kind: "oil",
    images: [photo("perfume-crivelli-oud.png")],
    active: true,
    featured: false,
    variants: [
      unit(
        1066,
        66,
        "DHR-OIL-CRIV-OUD-50",
        // TODO: owner to set real price (genuine luxury item)
        150,
        4,
        {
          sizeText: "50 ml",
        },
      ),
    ],
  },
  {
    id: 67,
    name: "ZARR Forget Me Not Eau de Parfum",
    slug: "perfume-zarr-forget-me-not",
    description: "ZARR Forget Me Not eau de parfum by Veyes. 100 ml spray.",
    kind: "oil",
    images: [photo("perfume-zarr-forget-me-not.png")],
    active: true,
    featured: false,
    variants: [
      unit(
        1067,
        67,
        "DHR-OIL-ZARR-FMN-100",
        // TODO: owner to set real price
        120,
        6,
        {
          sizeText: "100 ml",
        },
      ),
    ],
  },
  {
    id: 68,
    name: "Pink Floral Eau de Parfum",
    slug: "perfume-30ml-pink-floral",
    description: "Pink floral eau de parfum spray. One 30 ml bottle.",
    kind: "oil",
    images: [photo("perfume-30ml-pink-floral.png")],
    active: true,
    featured: false,
    variants: [
      unit(
        1068,
        68,
        "DHR-OIL-PNK-FLR-30",
        // TODO: owner to set real price
        80,
        8,
        {
          sizeText: "30 ml",
        },
      ),
    ],
  },
  {
    id: 69,
    name: "Gold Drip Eau de Parfum",
    slug: "perfume-30ml-gold-drip",
    description: "Gold drip eau de parfum spray. One 30 ml bottle.",
    kind: "oil",
    images: [photo("perfume-30ml-gold-drip.png")],
    active: true,
    featured: false,
    variants: [
      unit(
        1069,
        69,
        "DHR-OIL-GLD-DRP-30",
        // TODO: owner to set real price
        80,
        8,
        {
          sizeText: "30 ml",
        },
      ),
    ],
  },
  {
    id: 70,
    name: "Black & Gold Eau de Parfum",
    slug: "perfume-30ml-black-gold",
    description: "Black and gold eau de parfum spray. One 30 ml bottle.",
    kind: "oil",
    images: [photo("perfume-30ml-black-gold.png")],
    active: true,
    featured: false,
    variants: [
      unit(
        1070,
        70,
        "DHR-OIL-BLK-GLD-30",
        // TODO: owner to set real price
        80,
        8,
        {
          sizeText: "30 ml",
        },
      ),
    ],
  },
  {
    id: 71,
    name: "Orange Floral Eau de Parfum",
    slug: "perfume-30ml-orange-floral",
    description: "Orange floral eau de parfum spray. One 30 ml bottle.",
    kind: "oil",
    images: [photo("perfume-30ml-orange-floral.png")],
    active: true,
    featured: false,
    variants: [
      unit(
        1071,
        71,
        "DHR-OIL-ORG-FLR-30",
        // TODO: owner to set real price
        80,
        8,
        {
          sizeText: "30 ml",
        },
      ),
    ],
  },
  {
    id: 72,
    name: "Red Blossom Eau de Parfum",
    slug: "perfume-30ml-red-blossom",
    description: "Red blossom eau de parfum spray. One 30 ml bottle.",
    kind: "oil",
    images: [photo("perfume-30ml-red-blossom.png")],
    active: true,
    featured: false,
    variants: [
      unit(
        1072,
        72,
        "DHR-OIL-RED-BLS-30",
        // TODO: owner to set real price
        80,
        8,
        {
          sizeText: "30 ml",
        },
      ),
    ],
  },
  {
    id: 73,
    name: "Coral Floral Eau de Parfum",
    slug: "perfume-30ml-coral-floral",
    description: "Coral floral eau de parfum spray. One 30 ml bottle.",
    kind: "oil",
    images: [photo("perfume-30ml-coral-floral.png")],
    active: true,
    featured: false,
    variants: [
      unit(
        1073,
        73,
        "DHR-OIL-CRL-FLR-30",
        // TODO: owner to set real price
        80,
        8,
        {
          sizeText: "30 ml",
        },
      ),
    ],
  },
  {
    id: 74,
    name: "Plum Swirl Eau de Parfum",
    slug: "perfume-30ml-plum-swirl",
    description: "Plum swirl eau de parfum spray. One 30 ml bottle.",
    kind: "oil",
    images: [photo("perfume-30ml-plum-swirl.png")],
    active: true,
    featured: false,
    variants: [
      unit(
        1074,
        74,
        "DHR-OIL-PLM-SWL-30",
        // TODO: owner to set real price
        80,
        8,
        {
          sizeText: "30 ml",
        },
      ),
    ],
  },
  {
    id: 75,
    name: "Nine Black Eau de Parfum",
    slug: "perfume-nine-black",
    description: "Nine Black eau de parfum spray. 100 ml.",
    kind: "oil",
    images: [photo("perfume-nine-black.png")],
    active: true,
    featured: false,
    variants: [
      unit(
        1075,
        75,
        "DHR-OIL-NINE-BLK-100",
        // TODO: owner to set real price
        120,
        6,
        {
          sizeText: "100 ml",
        },
      ),
    ],
  },
  {
    id: 76,
    name: "YZS Perfumer Perfume Wilderness (\"Strive Forward with Determination\")",
    slug: "perfume-yzs-wilderness",
    description:
      "YZS Perfumer Perfume Wilderness eau de parfum spray. 35 ml.",
    kind: "oil",
    images: [photo("perfume-yzs-wilderness.png")],
    active: true,
    featured: false,
    variants: [
      unit(
        1076,
        76,
        "DHR-OIL-YZS-WLD-35",
        // TODO: owner to set real price
        90,
        7,
        {
          sizeText: "35 ml",
        },
      ),
    ],
  },
  {
    id: 77,
    name: "YZS Perfumer Perfume Carpet of Flowers",
    slug: "perfume-yzs-carpet-of-flowers",
    description:
      "YZS Perfumer Perfume Carpet of Flowers eau de parfum spray. 35 ml.",
    kind: "oil",
    images: [photo("perfume-yzs-carpet-of-flowers.png")],
    active: true,
    featured: false,
    variants: [
      unit(
        1077,
        77,
        "DHR-OIL-YZS-COF-35",
        // TODO: owner to set real price
        90,
        7,
        {
          sizeText: "35 ml",
        },
      ),
    ],
  },
  {
    id: 78,
    name: "Al Kausar Aqua 212 Concentrated Attar (alcohol-free)",
    slug: "attar-al-kausar-aqua-212",
    description:
      "Al Kausar Aqua 212 concentrated attar, alcohol-free. 100 g.",
    kind: "oil",
    images: [photo("attar-al-kausar-aqua-212.png")],
    active: true,
    featured: false,
    variants: [
      unit(
        1078,
        78,
        "DHR-OIL-KAUSAR-212-100",
        // TODO: owner to set real price
        100,
        8,
        {
          sizeText: "100 g",
        },
      ),
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
