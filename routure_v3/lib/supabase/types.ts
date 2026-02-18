export interface Issue {
  id: string;
  title: string;
  slug: string;
  issue_number: number;
  publish_date: string;
  cover_image_url: string | null;
  pdf_url: string | null;
  description: string | null;
  is_featured: boolean;
  page_count: number | null;
  created_at: string;
  updated_at: string;
}

export interface IssuePage {
  id: string;
  issue_id: string;
  page_number: number;
  image_url: string;
  thumbnail_url: string;
}

export interface Article {
  id: string;
  issue_id: string | null;
  title: string;
  slug: string;
  author: string | null;
  content: string | null;
  featured_image_url: string | null;
  is_featured: boolean;
  publish_date: string | null;
  created_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}
