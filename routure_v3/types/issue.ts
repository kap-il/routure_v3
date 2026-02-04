export interface Issue {
  slug: string;
  title: string;
  subtitle?: string;
  issueNumber: number;
  season: string;
  year: number;
  coverImage: string;
  description: string;
  featuredArticles: string[];
  pageCount: number;
  publishedAt: string;
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
