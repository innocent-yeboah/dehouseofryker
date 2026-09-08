export const site = {
  name: "De House of Ryker",
  tagline: "Oils, sprays, and the Accra shop — gold on ivory.",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "233000000000",
  momoMerchant: process.env.NEXT_PUBLIC_MOMO_MERCHANT ?? "233000000000",
  address: process.env.NEXT_PUBLIC_SHOP_ADDRESS ?? "Accra, Ghana",
  hours: process.env.NEXT_PUBLIC_SHOP_HOURS ?? "Monday–Saturday, 10:00–19:00",
  mapsUrl: process.env.NEXT_PUBLIC_MAPS_URL ?? "https://maps.google.com/?q=Accra",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

export function whatsappHref(message: string): string {
  const digits = site.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export const copy = {
  deliveryGoodsOnly:
    "You are paying for products only. Delivery cost is agreed by phone. We will not send the order until we agree that cost.",
  blendNotOnShelf:
    "We will blend this. It is not sitting on the shelf. We will tell you when it is ready to pick up.",
  customWhatsapp:
    "Tell us the scent you have in mind on WhatsApp. Come smell it, then pay at the shop. This is not an online purchase.",
  returns:
    "We do not take back opened fragrance, for hygiene. If we sent the wrong item or it arrived damaged, we will replace it.",
} as const;
