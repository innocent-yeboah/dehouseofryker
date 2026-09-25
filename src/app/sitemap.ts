import type { MetadataRoute } from "next";
import { kindPaths, seedProducts } from "@/data/seed-catalog";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const configured = site.siteUrl.replace(/\/$/, "");
  const base =
    configured.startsWith("http://localhost") || configured.startsWith("http://127.0.0.1")
      ? "https://dehouseofryker.vercel.app"
      : configured;
  const paths = [
    "",
    "/shop",
    "/about",
    "/contact",
    "/policies",
    "/wholesale",
    "/branding",
    "/customize",
    "/cart",
    "/order/find",
    ...Object.values(kindPaths).map((category) => `/shop/${category}`),
    ...seedProducts.filter((item) => item.active).map((item) => `/product/${item.slug}`),
  ];

  return paths.map((path) => ({
    url: `${base}${path}`,
  }));
}
