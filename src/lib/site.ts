/** Shop line for calls, WhatsApp, and manual MoMo. Digits only, no leading plus. */
export const SHOP_MSISDN = "233533304602";

function envOr(value: string | undefined, fallback: string): string {
  return value?.trim() || fallback;
}

export function formatShopPhone(raw: string): string | null {
  const trimmed = raw.trim();
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < 9) {
    return null;
  }
  if (digits.startsWith("233") && digits.length >= 12) {
    return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }
  return trimmed;
}

export const site = {
  name: "De House of Ryker",
  tagline:
    "Glass sprays, scrubs, and hair and body mists from our Accra shop. Shop what is ready, or WhatsApp a custom blend and pay when you smell it.",
  heroPromise: "Smell it here. Wear it as yours.",
  whatsapp: envOr(process.env.NEXT_PUBLIC_WHATSAPP, SHOP_MSISDN),
  momoMerchant: envOr(process.env.NEXT_PUBLIC_MOMO_MERCHANT, SHOP_MSISDN),
  address: process.env.NEXT_PUBLIC_SHOP_ADDRESS ?? "Accra, Ghana",
  hours: process.env.NEXT_PUBLIC_SHOP_HOURS ?? "Monday–Saturday, 10:00–19:00",
  mapsUrl: process.env.NEXT_PUBLIC_MAPS_URL ?? "https://maps.google.com/?q=Accra",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

export function shopTelHref(raw: string = site.whatsapp): string {
  return `tel:+${raw.replace(/\D/g, "")}`;
}

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
  heroFulfillment:
    "Accra pickup or Ghana delivery — products only at checkout.",
} as const;
