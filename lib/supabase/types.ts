// ============================================================
// Routure v2 — Shoot-based schema types
// ============================================================

export interface Issue {
  id: string;
  title: string;
  slug: string;
  issue_number: number;
  publish_date: string;
  cover_image_url: string | null;
  description: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export type SectionType = 'shoot' | 'editorial' | 'toc' | 'cover' | 'credits' | 'divider';

export interface ShootCredits {
  [key: string]: string;
}

export interface Shoot {
  id: string;
  issue_id: string;
  slug: string;
  title: string;
  position: number;
  section_type: SectionType;
  credits: ShootCredits | null;
  created_at: string;
}

export interface ShootImage {
  id: string;
  shoot_id: string;
  image_url: string;
  thumbnail_url: string;
  width: number;
  height: number;
  aspect_ratio: number;
  position: number;
  is_hero: boolean;
  is_article_page: boolean;
  created_at: string;
}

export type ContentBlockType = 'heading' | 'paragraph' | 'pullquote' | 'caption';

export interface ContentBlock {
  type: ContentBlockType;
  text: string;
}

export interface Article {
  id: string;
  shoot_id: string;
  title: string;
  slug: string;
  author: string | null;
  category: string | null;
  content: ContentBlock[] | null;
  created_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

// ============================================================
// Composed types for the frontend
// ============================================================

/** What each image tile in the Issue View mosaic needs */
export interface IssueMosaicItem {
  id: string;
  src: string;
  thumbnailSrc: string;
  aspectRatio: number;
  width: number;
  shootId: string;
  shootSlug: string;
  shootTitle: string;
  hasArticle: boolean;
  articleTitle: string | null;
  articleCategory: string | null;
  issuePosition: number;
  imagePosition: number;
  isHero: boolean;
  isFirstInShoot: boolean;
  isCover: boolean;
}

/** Editorial sections (letters, TOC) for display on issue page */
export interface IssueEditorialItem {
  id: string;
  slug: string;
  title: string;
  sectionType: SectionType;
  position: number;
  hasArticle: boolean;
  articleTitle: string | null;
  thumbnailSrc: string | null;
}

/** Full shoot data for Shoot with Article / Shoot Concept views */
export interface ShootWithImages extends Shoot {
  images: ShootImage[];
  article: Article | null;
}
