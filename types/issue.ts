// Re-export Supabase types as the canonical types
export type {
  Issue,
  Shoot,
  ShootImage,
  Article,
  ContentBlock,
  ContentBlockType,
  ContactSubmission,
  IssueMosaicItem,
  IssueEditorialItem,
  SectionType,
  ShootWithImages,
} from '@/lib/supabase/types';

// Extended types for page framework (used by mock data and layout components)

export interface Category {
  name: string;
  articles: { title: string; slug: string; issueSlug: string }[];
}

// --- Legacy page framework types (used by mock data) ---

/** A single image tile in the Issue View mosaic (mock data shape) */
export interface MosaicImage {
  id: string;
  src: string;
  aspectRatio: number;
  /** Native pixel width of the source image. Used to cap rendering so images
   *  are never upscaled (downscale-only). Optional for mock data. */
  width?: number;
  shootId: string;
  shootTitle?: string;
  hasArticle: boolean;
  articleTitle?: string;
  articleCategory?: string;
  issuePosition: number;
  isFirstInShoot?: boolean;
  isCover?: boolean;
}

/** Shoot data for the Shoot with Article view (mock data shape) */
export interface ShootWithArticleData {
  shootId: string;
  title: string;
  photographer: string;
  issueLabel: string;
  heroImage: string;
  images: { src: string; aspectRatio: number }[];
  article: {
    title: string;
    subtitle?: string;
    author: string;
    sections: string[];
  };
}

/** Shoot data for the Shoot Concept (no article) view (mock data shape) */
export interface ShootConceptData {
  shootId: string;
  title: string;
  photographer: string;
  issueLabel: string;
  imageCount: number;
  heroImage: string;
  images: { src: string; aspectRatio: number }[];
}
