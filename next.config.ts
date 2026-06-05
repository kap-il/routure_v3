import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  images: {
    // Custom loader: serve pre-generated WebP variants straight from S3/CloudFront,
    // bypassing Vercel's optimizer. No /_next/image, so no per-image transformation
    // cost and no 5,000/month Hobby cap. Variants are built once by
    // scripts/generate-image-variants.mjs and live next to each original in S3.
    loader: "custom",
    loaderFile: "./lib/image/loader.ts",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "routure-issues.s3.us-east-1.amazonaws.com",
        pathname: "/**",
      },
    ],
    // deviceSizes drive which widths the loader is asked for — must stay in sync
    // with the LADDER in the loader + the generator script.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Legacy URL shapes → canonical routes, handled at the edge (308, no function
  // invocation, no DB). Replaces the old /issues/[slug] redirect page shims so a
  // crawler spraying these paths can't run up function usage.
  async redirects() {
    return [
      { source: "/issues/:slug/shoots/:shootSlug", destination: "/shoot/:shootSlug", permanent: true },
      { source: "/issues/:slug/articles/:articleSlug", destination: "/issue/:slug", permanent: true },
      { source: "/issues/:slug", destination: "/issue/:slug", permanent: true },
    ];
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
