import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "routure-issues.s3.us-east-1.amazonaws.com",
        pathname: "/**",
      },
    ],
    // AVIF is 30-50% smaller than WebP. Browser falls back to WebP if no AVIF support.
    formats: ["image/avif", "image/webp"],
    // Tuned for your layouts: hero (1920), desktop (1200/1080), tablet (828/750), mobile (640)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache optimized images for 30 days. S3 URLs are immutable — no reason to re-process.
    minimumCacheTTL: 2592000,
  },
  // Gzip + Brotli compression on all server responses
  compress: true,
  // Strict mode catches performance issues during development
  reactStrictMode: true,
  // Remove the X-Powered-By: Next.js header (saves bytes + security)
  poweredByHeader: false,
  // React Compiler: auto-memoizes components, eliminates unnecessary re-renders.
  reactCompiler: true,
  experimental: {
    // Tree-shake large packages — only bundle the functions you actually import
    optimizePackageImports: [
      "@supabase/supabase-js",
      "@aws-sdk/client-s3",
      "@aws-sdk/s3-request-presigner",
    ],
  },
  async headers() {
    return [
      {
        // Fonts never change — cache forever
        source: "/fonts/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Brand assets (favicons, logos) — cache forever
        source: "/brand/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Static images — cache forever
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // SVGs — cache forever
        source: "/:path*.svg",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withAnalyzer(nextConfig);
