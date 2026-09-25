import type { MetadataRoute } from "next";
import { seedProducts } from "@/data/seed-catalog";
import { listingPaths } from "@/lib/ia";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const configured = site.siteUrl.replace(/\/$/, "");
  const base =
    !configured ||
    configured.startsWith("http://localhost") ||
    configured.startsWith("http://127.0.0.1")
      ? "https://dehouseofryker.vercel.app"
      : configured;
  const paths = [
    "",
    "/about",
    "/contact",
    "/policies",
    "/wholesale",
    "/branding",
    "/customize",
    "/cart",
    "/order/find",
    ...listingPaths(),
    ...seedProducts.filter((item) => item.active).map((item) => `/product/${item.slug}`),
  ];

  return paths.map((path) => ({
    url: `${base}${path}`,
  }));
}
