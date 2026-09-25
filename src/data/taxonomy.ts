import type { DepartmentId, SectionId } from "@/types/shop";

/**
 * Shelf taxonomy for every seed product. Classification follows the printed
 * name, description, and tile — not the old `kind` bucket.
 *
 * House is only a brand bucket for tiles with no printed brand. It is not
 * added to the title. Crystal Amber stays the house title; do not use the
 * name printed on that glass.
 *
 * No two products are clearly the same scent in more than one size
 * (the YZS 35 ml and 50 ml lines are different scents), so none are grouped
 * into a shared size picker.
 *
 * Face scrubs are filed under Body because that section is soaps, scrubs,
 * and body mists. Their descriptions still say the tube is for the face.
 */
export type Taxonomy = {
  department: DepartmentId;
  section: SectionId;
  brand: string;
  size: string;
  displayName: string;
};

type Entry = Taxonomy & { id: number };

const entries: Entry[] = [
  { id: 1, department: "fragrance", section: "perfumes", brand: "House", size: "50 ml", displayName: "Blue Glass Spray 50 ml" },
  { id: 2, department: "fragrance", section: "perfumes", brand: "House", size: "50 ml", displayName: "Red Glass Spray 50 ml" },
  { id: 3, department: "skincare", section: "body", brand: "KÖRMESIC", size: "100 g", displayName: "KÖRMESIC 24K Gold Exfoliating Scrub 100 g" },
  { id: 4, department: "skincare", section: "body", brand: "KÖRMESIC", size: "100 g", displayName: "KÖRMESIC Vitamin C Exfoliating Scrub 100 g" },
  { id: 5, department: "skincare", section: "body", brand: "KÖRMESIC", size: "100 g", displayName: "KÖRMESIC Avocado Exfoliating Scrub 100 g" },
  { id: 6, department: "skincare", section: "body", brand: "Kormesic", size: "290 ml", displayName: "Kormesic Sexy Bomb Hair & Body Mist 290 ml" },
  { id: 7, department: "skincare", section: "body", brand: "Kormesic", size: "290 ml", displayName: "Kormesic White Tea Mist 290 ml" },
  { id: 8, department: "skincare", section: "body", brand: "Kormesic", size: "290 ml", displayName: "Kormesic Encounter Huayang Hair & Body Mist 290 ml" },
  { id: 9, department: "skincare", section: "body", brand: "Kormesic", size: "290 ml", displayName: "Kormesic Tropical Fruits Hair & Body Mist 290 ml" },
  { id: 10, department: "skincare", section: "body", brand: "Kormesic", size: "290 ml", displayName: "Kormesic Orange Green Hair & Body Mist 290 ml" },
  { id: 11, department: "skincare", section: "body", brand: "Kormesic", size: "290 ml", displayName: "Kormesic Pink Meets Hair & Body Mist 290 ml" },
  { id: 12, department: "skincare", section: "face", brand: "PUQIANNA", size: "25 ml", displayName: "PUQIANNA Aloe Vera Facial Mask 25 ml" },
  { id: 13, department: "skincare", section: "face", brand: "PUQIANNA", size: "25 ml", displayName: "PUQIANNA Grape Facial Mask 25 ml" },
  { id: 14, department: "skincare", section: "face", brand: "PUQIANNA", size: "25 ml", displayName: "PUQIANNA Orange Facial Mask 25 ml" },
  { id: 15, department: "skincare", section: "face", brand: "PUQIANNA", size: "25 ml", displayName: "PUQIANNA Pomegranate Facial Mask 25 ml" },
  { id: 16, department: "skincare", section: "face", brand: "PUQIANNA", size: "25 ml", displayName: "PUQIANNA Milk Moisturizing Facial Mask 25 ml" },
  { id: 17, department: "skincare", section: "face", brand: "PUQIANNA", size: "25 ml", displayName: "PUQIANNA Cucumber Facial Mask 25 ml" },
  { id: 18, department: "skincare", section: "face", brand: "PUQIANNA", size: "25 ml", displayName: "PUQIANNA Avocado Facial Mask 25 ml" },
  { id: 19, department: "skincare", section: "face", brand: "PUQIANNA", size: "25 ml", displayName: "PUQIANNA Lavender Facial Mask 25 ml" },
  { id: 20, department: "skincare", section: "face", brand: "PUQIANNA", size: "25 ml", displayName: "PUQIANNA Honey Facial Mask 25 ml" },
  { id: 21, department: "skincare", section: "face", brand: "PUQIANNA", size: "25 ml", displayName: "PUQIANNA 24K Gold Whitening Facial Mask 25 ml" },
  { id: 22, department: "skincare", section: "face", brand: "PUQIANNA", size: "25 ml", displayName: "PUQIANNA Strawberry Facial Mask (Wave) 25 ml" },
  { id: 23, department: "skincare", section: "face", brand: "PUQIANNA", size: "25 ml", displayName: "PUQIANNA Carrot Hydrating Facial Mask 25 ml" },
  { id: 24, department: "skincare", section: "face", brand: "PUQIANNA", size: "25 ml", displayName: "PUQIANNA Blueberry Facial Mask 25 ml" },
  { id: 25, department: "skincare", section: "face", brand: "PUQIANNA", size: "25 ml", displayName: "PUQIANNA Lemon Vitamin C Facial Mask 25 ml" },
  { id: 26, department: "skincare", section: "face", brand: "PUQIANNA", size: "25 ml", displayName: "PUQIANNA Sweet Peach Facial Mask 25 ml" },
  { id: 27, department: "skincare", section: "face", brand: "PUQIANNA", size: "25 ml", displayName: "PUQIANNA Watermelon Facial Mask (Wave) 25 ml" },
  { id: 28, department: "skincare", section: "face", brand: "PUQIANNA", size: "25 ml", displayName: "PUQIANNA Niacinamide Facial Mask 25 ml" },
  { id: 29, department: "skincare", section: "face", brand: "PUQIANNA", size: "25 ml", displayName: "PUQIANNA Coffee Facial Mask 25 ml" },
  { id: 30, department: "skincare", section: "face", brand: "PUQIANNA", size: "25 ml", displayName: "PUQIANNA Shea Butter Facial Mask 25 ml" },
  { id: 31, department: "skincare", section: "face", brand: "PUQIANNA", size: "25 ml", displayName: "PUQIANNA Snail Facial Mask 25 ml" },
  { id: 32, department: "skincare", section: "face", brand: "PUQIANNA", size: "25 ml", displayName: "PUQIANNA Chamomile Facial Mask 25 ml" },
  { id: 33, department: "skincare", section: "face", brand: "PUQIANNA", size: "25 ml", displayName: "PUQIANNA Oats Facial Mask 25 ml" },
  { id: 34, department: "skincare", section: "face", brand: "PUQIANNA", size: "25 ml", displayName: "PUQIANNA Rice Facial Mask 25 ml" },
  { id: 35, department: "skincare", section: "face", brand: "PUQIANNA", size: "25 ml", displayName: "PUQIANNA Pomegranate Extract Facial Mask 25 ml" },
  { id: 36, department: "skincare", section: "face", brand: "PUQIANNA", size: "25 ml", displayName: "PUQIANNA Strawberry Extract Facial Mask 25 ml" },
  { id: 37, department: "skincare", section: "face", brand: "PUQIANNA", size: "25 ml", displayName: "PUQIANNA Grape Extract Facial Mask 25 ml" },
  { id: 38, department: "skincare", section: "face", brand: "PUQIANNA", size: "25 ml", displayName: "PUQIANNA Lemon Extract Facial Mask 25 ml" },
  { id: 39, department: "skincare", section: "face", brand: "PUQIANNA", size: "25 ml", displayName: "PUQIANNA Watermelon Extract Facial Mask 25 ml" },
  { id: 40, department: "skincare", section: "body", brand: "KORMESIC", size: "100 g", displayName: "KORMESIC Whitening Shea Butter Soap 100 g" },
  { id: 41, department: "skincare", section: "body", brand: "KORMESIC", size: "110 g", displayName: "KORMESIC Niacinamide Whitening Soap 110 g" },
  { id: 42, department: "skincare", section: "lips_eyes", brand: "HANYUTANG", size: "1 sachet (2 patches)", displayName: "HANYUTANG Crystal Collagen Eye Mask (2 patches)" },
  { id: 43, department: "skincare", section: "lips_eyes", brand: "FAYANKÔU", size: "4.5 g", displayName: "FAYANKÔU Cherry Moisturizing Soft Lip Mask 4.5 g" },
  { id: 44, department: "skincare", section: "lips_eyes", brand: "FAYANKÔU", size: "4.5 g", displayName: "FAYANKÔU Avocado Moisturizing Soft Lip Mask 4.5 g" },
  { id: 45, department: "skincare", section: "lips_eyes", brand: "FAYANKÔU", size: "4.5 g", displayName: "FAYANKÔU Strawberry Moisturizing Soft Lip Mask 4.5 g" },
  { id: 46, department: "skincare", section: "lips_eyes", brand: "FAYANKÔU", size: "4.5 g", displayName: "FAYANKÔU Aloe Moisturizing Soft Lip Mask 4.5 g" },
  { id: 47, department: "skincare", section: "lips_eyes", brand: "FAYANKÔU", size: "4.5 g", displayName: "FAYANKÔU Honey Orange Moisturizing Soft Lip Mask 4.5 g" },
  { id: 48, department: "skincare", section: "lips_eyes", brand: "FAYANKÔU", size: "4.5 g", displayName: "FAYANKÔU Blueberry Moisturizing Soft Lip Mask 4.5 g" },
  { id: 49, department: "fragrance", section: "perfume_oils", brand: "Almas", size: "100 g", displayName: "Almas Play Blue Perfume Oil 100 g" },
  { id: 50, department: "fragrance", section: "perfumes", brand: "House", size: "50 ml", displayName: "Crystal Amber Inspired Perfume 50 ml" },
  { id: 51, department: "fragrance", section: "perfumes", brand: "YZS", size: "50 ml", displayName: "YZS White Eau de Parfum 50 ml" },
  { id: 52, department: "fragrance", section: "perfumes", brand: "YZS", size: "50 ml", displayName: "YZS Peach Eau de Parfum 50 ml" },
  { id: 53, department: "fragrance", section: "perfumes", brand: "YZS", size: "50 ml", displayName: "YZS Black Eau de Parfum 50 ml" },
  { id: 54, department: "fragrance", section: "perfumes", brand: "YZS", size: "50 ml", displayName: "YZS Ruby Eau de Parfum 50 ml" },
  { id: 55, department: "skincare", section: "lips_eyes", brand: "SADOER", size: "1 sachet", displayName: "SADOER Sweet Strawberry Lip Mask" },
  { id: 56, department: "skincare", section: "lips_eyes", brand: "POUQUR", size: "1 sachet", displayName: "POUQUR Cherry Pink Lip Mask" },
  { id: 57, department: "skincare", section: "lips_eyes", brand: "POUQUR", size: "1 sachet (2 patches)", displayName: "POUQUR Aloe Vera Collagen Eye Mask (2 patches)" },
  { id: 58, department: "skincare", section: "lips_eyes", brand: "SADOER", size: "1 sachet (2 patches)", displayName: "SADOER Hyaluronic Acid Delicate Moisturizing Eye Mask (2 patches)" },
  { id: 59, department: "skincare", section: "lips_eyes", brand: "SADOER", size: "4.5 g", displayName: "SADOER Orange Moisturizing Lip Mask 4.5 g" },
  { id: 60, department: "fragrance", section: "perfumes", brand: "Veyes", size: "100 ml", displayName: "Veyes 9 am Eau de Parfum 100 ml" },
  { id: 61, department: "fragrance", section: "perfumes", brand: "Veyes", size: "100 ml", displayName: "Veyes Dawn Eau de Parfum 100 ml" },
  { id: 62, department: "skincare", section: "body", brand: "House", size: "1000 ml", displayName: "Vitamin C Anti-Aging Shower Gel 1000 ml" },
  { id: 63, department: "skincare", section: "lips_eyes", brand: "SADOER", size: "1 sachet (2 patches)", displayName: "SADOER Caviar Essence Eye Mask (2 patches)" },
  { id: 64, department: "fragrance", section: "perfumes", brand: "House", size: "", displayName: "Miss Candy Perfume" },
  { id: 65, department: "fragrance", section: "perfumes", brand: "Maison Crivelli", size: "50 ml", displayName: "Maison Crivelli Hibiscus Mahajád Extrait de Parfum 50 ml" },
  { id: 66, department: "fragrance", section: "perfumes", brand: "Maison Crivelli", size: "50 ml", displayName: "Maison Crivelli Oud Maracujá Extrait de Parfum 50 ml" },
  { id: 67, department: "fragrance", section: "perfumes", brand: "ZARR", size: "100 ml", displayName: "ZARR Forget Me Not Eau de Parfum 100 ml" },
  { id: 68, department: "fragrance", section: "perfumes", brand: "House", size: "30 ml", displayName: "Pink Floral Eau de Parfum 30 ml" },
  { id: 69, department: "fragrance", section: "perfumes", brand: "House", size: "30 ml", displayName: "Gold Drip Eau de Parfum 30 ml" },
  { id: 70, department: "fragrance", section: "perfumes", brand: "House", size: "30 ml", displayName: "Black & Gold Eau de Parfum 30 ml" },
  { id: 71, department: "fragrance", section: "perfumes", brand: "House", size: "30 ml", displayName: "Orange Floral Eau de Parfum 30 ml" },
  { id: 72, department: "fragrance", section: "perfumes", brand: "House", size: "30 ml", displayName: "Red Blossom Eau de Parfum 30 ml" },
  { id: 73, department: "fragrance", section: "perfumes", brand: "House", size: "30 ml", displayName: "Coral Floral Eau de Parfum 30 ml" },
  { id: 74, department: "fragrance", section: "perfumes", brand: "House", size: "30 ml", displayName: "Plum Swirl Eau de Parfum 30 ml" },
  { id: 75, department: "fragrance", section: "perfumes", brand: "House", size: "100 ml", displayName: "Nine Black Eau de Parfum 100 ml" },
  { id: 76, department: "fragrance", section: "perfumes", brand: "YZS", size: "35 ml", displayName: "YZS Wilderness Eau de Parfum 35 ml" },
  { id: 77, department: "fragrance", section: "perfumes", brand: "YZS", size: "35 ml", displayName: "YZS Carpet of Flowers Eau de Parfum 35 ml" },
  { id: 78, department: "fragrance", section: "perfume_oils", brand: "Al Kausar", size: "100 g", displayName: "Al Kausar Aqua 212 Concentrated Attar 100 g" },
  { id: 79, department: "fragrance", section: "perfumes", brand: "House", size: "30 ml", displayName: "Ivory Floral Eau de Parfum 30 ml" },
  { id: 80, department: "fragrance", section: "perfumes", brand: "House", size: "30 ml", displayName: "Navy & Silver Eau de Parfum 30 ml" },
  { id: 81, department: "fragrance", section: "perfumes", brand: "House", size: "30 ml", displayName: "Maroon & Gold Eau de Parfum 30 ml" },
  { id: 82, department: "fragrance", section: "perfumes", brand: "House", size: "30 ml", displayName: "Dusty Rose Eau de Parfum 30 ml" },
  { id: 83, department: "fragrance", section: "perfumes", brand: "House", size: "30 ml", displayName: "Red Sunburst Eau de Parfum 30 ml" },
  { id: 84, department: "fragrance", section: "perfumes", brand: "YZS", size: "35 ml", displayName: "YZS Black Crow Eau de Parfum 35 ml" },
  { id: 85, department: "fragrance", section: "perfumes", brand: "YZS", size: "35 ml", displayName: "YZS Red Gemstone Eau de Parfum 35 ml" },
  { id: 86, department: "fragrance", section: "perfumes", brand: "YZS", size: "35 ml", displayName: "YZS Sunshine Amber Eau de Parfum 35 ml" },
  { id: 87, department: "fragrance", section: "perfume_oils", brand: "Almas", size: "100 g", displayName: "Almas 121 VIP Perfume Oil 100 g" },
  { id: 88, department: "fragrance", section: "perfume_oils", brand: "House", size: "100 g", displayName: "Silver Black Perfume Oil 100 g" },
  { id: 89, department: "fragrance", section: "perfume_oils", brand: "Almas", size: "100 g", displayName: "Almas Royal Black Perfume Oil 100 g" },
  { id: 90, department: "fragrance", section: "perfume_oils", brand: "Almas", size: "100 g", displayName: "Almas Real XX Perfume Oil 100 g" },
  { id: 91, department: "fragrance", section: "perfume_oils", brand: "Almas", size: "100 g", displayName: "Almas d'nill Perfume Oil 100 g" },
  { id: 92, department: "fragrance", section: "perfume_oils", brand: "Almas", size: "100 g", displayName: "Almas Bushra Perfume Oil 100 g" },
  { id: 93, department: "fragrance", section: "perfume_oils", brand: "Almas", size: "100 g", displayName: "Almas Chocolate Musk Perfume Oil 100 g" },
  { id: 94, department: "fragrance", section: "perfume_oils", brand: "Almas", size: "100 g", displayName: "Almas Crimson Chandelier Perfume Oil 100 g" },
  { id: 95, department: "wellness", section: "supplements", brand: "OEM", size: "90 capsules", displayName: "OEM Fruits+ Whole Food Formula 90 capsules" },
  { id: 96, department: "wellness", section: "supplements", brand: "OEM", size: "90 capsules", displayName: "OEM Veggies+ Whole Food Formula 90 capsules" },
];

export const taxonomyById: Record<number, Taxonomy> = {};

for (const entry of entries) {
  if (taxonomyById[entry.id]) {
    throw new Error(`Duplicate taxonomy id ${entry.id}`);
  }
  const { id, ...meta } = entry;
  taxonomyById[id] = meta;
}
