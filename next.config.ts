import type { NextConfig } from "next";

/**
 * Next.js still emits inline bootstrap scripts and styles, so script-src and
 * style-src allow 'unsafe-inline'. A nonce would make the browser ignore
 * 'unsafe-inline' and break those scripts. Nothing here is loaded from a
 * third-party host: images and fonts are same-origin. tel: and WhatsApp links
 * are navigations, so this policy does not set navigate-to.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
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
