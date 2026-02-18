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
