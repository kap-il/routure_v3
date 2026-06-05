/**
 * Custom next/image loader — serves pre-generated WebP variants straight from
 * S3 (or CloudFront), bypassing Vercel's image optimizer entirely.
 *
 * Why: every <Image> previously routed through `/_next/image`, which counts
 * against the 5,000 transformations/month Hobby cap (→ 402 / broken images).
 * The responsive ladder is pre-built once by scripts/generate-image-variants.mjs
 * and stored next to each original as `<name>-<width>.webp`, so there is nothing
 * for Vercel to optimize at request time.
 *
 * Behaviour:
 *   • Non-S3 src (local /public assets) ............ returned unchanged.
 *   • S3 thumbnails (`/thumbnails/…`, already 600px) . returned unchanged.
 *   • S3 originals (`…/<name>.webp`) ............... mapped to `<name>-<w>.webp`
 *     at the nearest ladder width ≥ requested width.
 *   • If NEXT_PUBLIC_CLOUDFRONT_URL is set, the S3 origin is swapped for it
 *     (no other code change needed to move delivery onto CloudFront).
 *
 * This file is bundled for the browser, so it must stay pure and only read
 * NEXT_PUBLIC_* env vars (others are undefined client-side).
 */

// Must match `deviceSizes` in next.config.ts and LADDER in the generator script.
const LADDER = [640, 750, 828, 1080, 1200, 1920];

const S3_HOST_RE = /^https?:\/\/[^/]*\.s3\.[^/]*\.amazonaws\.com\//i;
// Variant marker is `-w<width>` so it can't collide with originals that legitimately
// end in `-<number>` (e.g. the fortress `cont-01.webp` spreads).
const VARIANT_RE = /-w\d+\.webp$/i;

// Trailing-slash-trimmed CloudFront base, e.g. https://d111.cloudfront.net
const CDN = (process.env.NEXT_PUBLIC_CLOUDFRONT_URL || '').replace(/\/+$/, '');

/** Smallest ladder width ≥ the requested width (clamped to the ladder bounds). */
function nearestWidth(width: number): number {
  for (const w of LADDER) if (w >= width) return w;
  return LADDER[LADDER.length - 1];
}

/** Swap the S3 origin for the CloudFront host when one is configured. */
function withCdn(url: string): string {
  if (!CDN) return url;
  return url.replace(S3_HOST_RE, `${CDN}/`);
}

interface LoaderArgs {
  src: string;
  width: number;
  quality?: number;
}

export default function s3ImageLoader({ src, width }: LoaderArgs): string {
  // Local/public assets (logos, brand marks) — nothing to rewrite.
  if (!S3_HOST_RE.test(src)) return src;

  // Already-sized thumbnails and any pre-built variant pass through untouched.
  if (src.includes('/thumbnails/') || VARIANT_RE.test(src)) return withCdn(src);

  // Full-size original → pick the pre-generated variant at the nearest ladder width.
  if (src.toLowerCase().endsWith('.webp')) {
    const w = nearestWidth(width);
    return withCdn(src.replace(/\.webp$/i, `-w${w}.webp`));
  }

  // Unexpected S3 object type — serve as-is rather than guessing.
  return withCdn(src);
}
