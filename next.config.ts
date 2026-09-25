import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/shop/oils", destination: "/shop/fragrance", permanent: false },
      { source: "/shop/sprays", destination: "/shop/fragrance/perfumes", permanent: false },
      { source: "/shop/formats", destination: "/shop/skincare", permanent: false },
      { source: "/shop/cosmetics", destination: "/shop/skincare", permanent: false },
      { source: "/shop/bottles", destination: "/shop/for-resellers/empty-bottles", permanent: false },
      { source: "/shop/packaging", destination: "/shop/for-resellers/packaging", permanent: false },
    ];
  },
};

export default nextConfig;
