export interface Issue {
  slug: string;
  title: string;
  subtitle?: string;
  issueNumber: number;
  season: string;
  year: number;
  coverImage: string;
  spreadImage: string;
  description: string;
  featuredArticles: string[];
  pageCount: number;
  publishedAt: string;
  articles: Article[];
  shoots: Shoot[];
}

export interface Article {
  slug: string;
  title: string;
  summary: string;
  category: string;
  coverImage: string;
  content: ArticleSection[];
}

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

export interface IssuePage {
  pageNumber: number;
  imageUrl: string;
  title?: string;
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
