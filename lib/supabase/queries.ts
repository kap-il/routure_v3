import { createServerClient } from './client';
import type { Issue, Shoot, ShootImage, Article, IssueMosaicItem, IssueEditorialItem, ShootWithImages, SectionType } from './types';

/** Supabase returns a single object when FK is unique, or an array otherwise. */
function resolveArticle(raw: unknown): Article | null {
  if (!raw) return null;
  if (Array.isArray(raw)) return raw.length > 0 ? raw[0] : null;
  return raw as Article;
}

// ============================================================
// Issues
// ============================================================

export async function getIssues(): Promise<Issue[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('issues')
    .select('*')
    .order('issue_number', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getFeaturedIssues(): Promise<Issue[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('issues')
    .select('*')
    .eq('is_featured', true)
    .order('publish_date', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getIssueBySlug(slug: string): Promise<Issue | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('issues')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

// ============================================================
// Issue View: Mosaic Data
// ============================================================

/**
 * Returns the full flattened image list for the mosaic layout engine.
 * Joins shoots → shoot_images → articles (LEFT JOIN).
 * Sorted by shoot.position ASC, then shoot_images.position ASC.
 */
/**
 * Effective mosaic ordering for an image. Normally an image sorts by its shoot's
 * position, then its own position within the shoot. Exception: the Recess FORTRESS
 * shoot's fashion spreads (PDF p38–40, uploaded as `cont-NN.webp`) are PRINTED AFTER
 * the yearbook section in the magazine. They belong to fortress — so they link to /
 * appear on the fortress shoot page — but in the mosaic they read after yearbook.
 * Pin them just past yearbook (issuePosition 8) without disturbing fortress's own
 * slot (position 7). imagePosition base 50 keeps them after yearbook's images while
 * staying < 100 so the page's `issuePosition*100 + imagePosition` key doesn't overflow.
 */
function mosaicOrder(
  imageUrl: string,
  shootPosition: number,
  imagePosition: number,
): { issuePosition: number; imagePosition: number } {
  const m = imageUrl.match(/\/recess\/shoots\/fortress\/images\/cont-(\d+)\.webp/);
  if (m) return { issuePosition: 8, imagePosition: 50 + Number(m[1]) };
  return { issuePosition: shootPosition, imagePosition };
}

export async function getIssueMosaicData(issueId: string): Promise<IssueMosaicItem[]> {
  const supabase = createServerClient();

  // Fetch shoots with their images and optional article
  const { data: shoots, error } = await supabase
    .from('shoots')
    .select('*, shoot_images(*), articles(*)')
    .eq('issue_id', issueId)
    .order('position', { ascending: true });

  if (error) throw error;
  if (!shoots) return [];

  const items: IssueMosaicItem[] = [];

  // Include photo shoots and covers in the mosaic
  const shootSections: SectionType[] = ['shoot', 'cover'];

  for (const shoot of shoots) {
    const sectionType = (shoot.section_type ?? 'shoot') as SectionType;
    if (!shootSections.includes(sectionType)) continue;

    const images = (shoot.shoot_images as ShootImage[] ?? [])
      .sort((a: ShootImage, b: ShootImage) => a.position - b.position);
    const article = resolveArticle(shoot.articles);
    let isFirst = true;

    for (const img of images) {
      // Skip article text pages — only show photos in the mosaic
      if (img.is_article_page) continue;

      const order = mosaicOrder(img.image_url, shoot.position, img.position);
      items.push({
        id: img.id,
        src: img.image_url,
        thumbnailSrc: img.thumbnail_url,
        aspectRatio: Number(img.aspect_ratio),
        width: Number(img.width) || 0,
        shootId: shoot.id,
        shootSlug: shoot.slug,
        shootTitle: shoot.title,
        hasArticle: article !== null,
        articleTitle: article?.title ?? null,
        articleCategory: article?.category ?? null,
        issuePosition: order.issuePosition,
        imagePosition: order.imagePosition,
        isHero: img.is_hero,
        isFirstInShoot: isFirst,
        isCover: sectionType === 'cover',
      });
      isFirst = false;
    }
  }

  // Sort by effective order so per-image overrides (fortress spreads that print
  // after yearbook) land in the right place. Stable + a no-op for normal images,
  // which keep their original (shoot.position, img.position) iteration order.
  items.sort((a, b) => a.issuePosition - b.issuePosition || a.imagePosition - b.imagePosition);

  return items;
}

/**
 * Returns editorial sections (letters from board, TOC) for an issue.
 * These are displayed as links on the issue page, not in the mosaic.
 */
export async function getIssueEditorialItems(issueId: string): Promise<IssueEditorialItem[]> {
  const supabase = createServerClient();

  const { data: shoots, error } = await supabase
    .from('shoots')
    .select('*, shoot_images(*), articles(*)')
    .eq('issue_id', issueId)
    .in('section_type', ['editorial', 'toc'])
    .order('position', { ascending: true });

  if (error) throw error;
  if (!shoots) return [];

  return shoots.map(shoot => {
    const article = resolveArticle(shoot.articles);
    const images = (shoot.shoot_images as ShootImage[] ?? [])
      .sort((a: ShootImage, b: ShootImage) => a.position - b.position);
    const firstPhoto = images.find(img => !img.is_article_page);

    return {
      id: shoot.id,
      slug: shoot.slug,
      title: shoot.title,
      sectionType: (shoot.section_type ?? 'shoot') as SectionType,
      position: shoot.position,
      hasArticle: article !== null,
      articleTitle: article?.title ?? null,
      thumbnailSrc: firstPhoto?.thumbnail_url ?? images[0]?.thumbnail_url ?? null,
    };
  });
}

// ============================================================
// Featured Shoot (random with article)
// ============================================================

export async function getFeaturedShoot(): Promise<{
  title: string;
  slug: string;
  heroImageUrl: string;
  imageCount: number;
} | null> {
  const supabase = createServerClient();

  const { data: shoots, error } = await supabase
    .from('shoots')
    .select('*, shoot_images(*)')
    .eq('section_type', 'shoot')
    .order('position', { ascending: true });

  if (error || !shoots || shoots.length === 0) return null;

  // Pick a random shoot that has photos
  const candidates = shoots.filter(s => {
    const photos = ((s.shoot_images as ShootImage[]) ?? []).filter(img => !img.is_article_page);
    return photos.length > 0;
  });

  if (candidates.length === 0) return null;
  const shoot = candidates[Math.floor(Math.random() * candidates.length)];
  const photos = ((shoot.shoot_images as ShootImage[]) ?? [])
    .filter((img: ShootImage) => !img.is_article_page)
    .sort((a: ShootImage, b: ShootImage) => a.position - b.position);

  return {
    title: shoot.title,
    slug: shoot.slug,
    heroImageUrl: photos[0].image_url,
    imageCount: photos.length,
  };
}

// ============================================================
// Featured Article (random, with pullquote)
// ============================================================

export async function getFeaturedArticle(): Promise<{
  title: string;
  shootSlug: string;
  author: string | null;
  pullquote: string | null;
} | null> {
  const supabase = createServerClient();

  // Fetch articles with their shoot slug in one query (eliminates N+1)
  const { data: articles, error } = await supabase
    .from('articles')
    .select('title, author, content, shoot_id, shoots(slug)')
    .not('shoot_id', 'is', null);

  if (error || !articles || articles.length === 0) return null;

  const pick = articles[Math.floor(Math.random() * articles.length)] as any;

  let pullquote: string | null = null;
  const content = typeof pick.content === 'string' ? JSON.parse(pick.content) : pick.content;
  if (Array.isArray(content)) {
    const pq = content.find((b: { type: string }) => b.type === 'pullquote');
    if (pq) pullquote = pq.text;
  }

  const shootData = Array.isArray(pick.shoots) ? pick.shoots[0] : pick.shoots;

  return {
    title: pick.title,
    shootSlug: shootData?.slug ?? '',
    author: pick.author,
    pullquote,
  };
}

// ============================================================
// Shoot Pages
// ============================================================

/**
 * Returns a shoot with all its images and its article (or null).
 * Used by both /shoot/:slug and /shoot/:slug/article.
 */
export async function getShootBySlug(slug: string): Promise<ShootWithImages | null> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('shoots')
    .select('*, shoot_images(*), articles(*)')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  if (!data) return null;

  const images = (data.shoot_images as ShootImage[] ?? [])
    .sort((a: ShootImage, b: ShootImage) => a.position - b.position);
  const article = resolveArticle(data.articles);

  return {
    id: data.id,
    issue_id: data.issue_id,
    slug: data.slug,
    title: data.title,
    position: data.position,
    section_type: (data.section_type ?? 'shoot') as SectionType,
    credits: data.credits ?? null,
    created_at: data.created_at,
    images,
    article,
  };
}

/**
 * Returns a pool of shoot hero thumbnails (one per shoot, distinct shoots) for
 * the home-page intro flash-cards. Thumbnails (~600px) so they preload fast enough
 * to flip through. Only real photo shoots — excludes covers, dividers, article pages.
 * The caller shuffles client-side and picks 3 for per-load variety.
 */
export async function getShootHeroPool(limit = 24): Promise<string[]> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('shoots')
    .select('id, shoot_images(thumbnail_url, image_url, position, is_hero, is_article_page)')
    .eq('section_type', 'shoot');

  if (error || !data) return [];

  const heroes: string[] = [];
  for (const shoot of data) {
    const imgs = ((shoot.shoot_images as ShootImage[]) ?? [])
      .filter((img) => !img.is_article_page)
      .sort((a, b) => a.position - b.position);
    const hero = imgs.find((img) => img.is_hero) ?? imgs[0];
    const url = hero?.thumbnail_url ?? hero?.image_url;
    if (url) heroes.push(url);
  }
  return heroes.slice(0, limit);
}

/**
 * Get the issue that a shoot belongs to (for back-navigation).
 */
export async function getIssueForShoot(shootSlug: string): Promise<Issue | null> {
  const supabase = createServerClient();

  const { data: shoot, error: shootError } = await supabase
    .from('shoots')
    .select('issue_id')
    .eq('slug', shootSlug)
    .single();

  if (shootError || !shoot) return null;

  const { data: issue, error: issueError } = await supabase
    .from('issues')
    .select('*')
    .eq('id', shoot.issue_id)
    .single();

  if (issueError) return null;
  return issue;
}

// ============================================================
// Categories
// ============================================================

/** Canonical category list */
export const CATEGORIES = [
  'Architecture',
  'Sustainability',
  'Experimentalism',
  'Commercialism',
  'Community',
] as const;

export type CategoryName = (typeof CATEGORIES)[number];

export interface CategoryArticle {
  id: string;
  title: string;
  slug: string;
  author: string | null;
  category: string;
  shootSlug: string;
  issueSlug: string;
  issueTitle: string;
  issueNumber: number;
  heroImageUrl: string | null;
}

/**
 * Returns all articles that match a given category,
 * joined with their shoot slug + issue metadata + hero image.
 */
export async function getArticlesByCategory(category: string): Promise<CategoryArticle[]> {
  const supabase = createServerClient();

  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title, slug, author, category, shoot_id')
    .ilike('category', category);

  if (error) throw error;
  if (!articles || articles.length === 0) return [];

  // Batch: get all shoots at once (3 queries instead of N+1)
  const shootIds = [...new Set(articles.map(a => a.shoot_id))];
  const { data: shoots } = await supabase
    .from('shoots')
    .select('id, slug, issue_id, shoot_images(image_url, position, is_article_page)')
    .in('id', shootIds);

  // Batch: get all issues at once
  const issueIds = [...new Set((shoots ?? []).map((s: any) => s.issue_id))];
  const { data: issues } = await supabase
    .from('issues')
    .select('id, slug, title, issue_number')
    .in('id', issueIds);

  const shootMap = new Map((shoots ?? []).map((s: any) => [s.id, s]));
  const issueMap = new Map((issues ?? []).map((i: any) => [i.id, i]));

  return articles.map(article => {
    const shoot = shootMap.get(article.shoot_id);
    const issue = shoot ? issueMap.get(shoot.issue_id) : null;
    const images = ((shoot?.shoot_images as any[]) ?? [])
      .filter((img: any) => !img.is_article_page)
      .sort((a: any, b: any) => a.position - b.position);

    return {
      id: article.id,
      title: article.title,
      slug: article.slug,
      author: article.author,
      category: article.category!,
      shootSlug: shoot?.slug ?? '',
      issueSlug: issue?.slug ?? '',
      issueTitle: issue?.title ?? '',
      issueNumber: issue?.issue_number ?? 0,
      heroImageUrl: images[0]?.image_url ?? null,
    };
  });
}

// ============================================================
// Letters
// ============================================================

export interface LetterWithContent {
  id: string;
  slug: string;
  title: string;
  images: { image_url: string; thumbnail_url: string; width: number; height: number; position: number }[];
  content: { type: string; text: string }[];
}

export async function getLetterBySlug(slug: string): Promise<LetterWithContent | null> {
  const supabase = createServerClient();

  const { data: letter, error } = await supabase
    .from('letters')
    .select('id, slug, title')
    .eq('slug', slug)
    .single();

  if (error || !letter) return null;

  const [{ data: images }, { data: contentRows }] = await Promise.all([
    supabase
      .from('letter_images')
      .select('image_url, thumbnail_url, width, height, position')
      .eq('letter_id', letter.id)
      .order('position', { ascending: true }),
    supabase
      .from('letter_content')
      .select('content')
      .eq('letter_id', letter.id)
      .single(),
  ]);

  let content = contentRows?.content ?? [];
  if (typeof content === 'string') content = JSON.parse(content);

  return {
    ...letter,
    images: images ?? [],
    content,
  };
}

export async function getLettersByIssueId(issueId: string): Promise<{ id: string; slug: string; title: string }[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('letters')
    .select('id, slug, title')
    .eq('issue_id', issueId)
    .order('position', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

// ============================================================
// Contact
// ============================================================

export async function submitContactForm(data: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  const supabase = createServerClient();
  const { error } = await supabase
    .from('contact_submissions')
    .insert(data);

  if (error) throw error;
}
