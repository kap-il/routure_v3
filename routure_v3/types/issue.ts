// Re-export Supabase types as the canonical issue types
export type { Issue, IssuePage, Article } from '@/lib/supabase/types';

// Extended types for page framework (shoots, categories, content sections)
export interface ArticleSection {
  type: 'text' | 'image';
  content: string;
}

export interface Shoot {
  slug: string;
  title: string;
  coverImage: string;
  images: string[];
}

export interface TableOfContentsItem {
  title: string;
  page: number;
  category?: string;
}

export interface Category {
  name: string;
  articles: { title: string; slug: string; issueSlug: string }[];
}

// --- Page Framework Types ---

/** A single image tile in the Issue View mosaic */
export interface MosaicImage {
  id: string;
  src: string;
  aspectRatio: number; // width / height
  shootId: string;
  hasArticle: boolean;
  articleTitle?: string;
  articleCategory?: string;
  issuePosition: number;
}

/** Shoot data for the Shoot with Article view */
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
    sections: string[]; // paragraphs of text
  };
}

/** Shoot data for the Shoot Concept (no article) view */
export interface ShootConceptData {
  shootId: string;
  title: string;
  photographer: string;
  issueLabel: string;
  imageCount: number;
  heroImage: string;
  images: { src: string; aspectRatio: number }[];
}
