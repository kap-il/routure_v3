/**
 * Per-IP rate limiting for the write endpoints (newsletter / contact /
 * unsubscribe). Read traffic is served from the CDN and never reaches here.
 *
 * Backed by Upstash Redis so limits hold across serverless instances, regions
 * and cold starts. Fails OPEN when Upstash isn't configured (e.g. local dev
 * before the env vars are set) so the site keeps working — it just logs once.
 *
 * Setup: create a free Upstash Redis DB and set in the environment:
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 */
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { headers } from 'next/headers';

const hasUpstash =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = hasUpstash ? Redis.fromEnv() : null;

// 5 writes per minute per IP — generous for a human filling a form, tight for a
// script. Sliding window so bursts can't game a fixed reset boundary.
const limiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '60 s'),
      prefix: 'routure/rl',
      analytics: false,
    })
  : null;

let warned = false;

/** Best-effort client IP from the proxy headers Vercel sets. */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const xff = h.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return h.get('x-real-ip') ?? '127.0.0.1';
}

/**
 * @param bucket  logical endpoint name, e.g. "newsletter" — keeps each
 *                endpoint's budget separate per IP.
 * @returns       { success: false } when the caller should be rejected.
 */
export async function rateLimit(
  bucket: string,
): Promise<{ success: boolean; remaining: number }> {
  if (!limiter) {
    if (!warned) {
      console.warn('[ratelimit] Upstash env not set — rate limiting disabled (fail-open).');
      warned = true;
    }
    return { success: true, remaining: Infinity };
  }
  const ip = await getClientIp();
  const { success, remaining } = await limiter.limit(`${bucket}:${ip}`);
  return { success, remaining };
}
