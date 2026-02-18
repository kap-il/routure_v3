-- Issues table
CREATE TABLE issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  issue_number integer UNIQUE NOT NULL,
  publish_date date NOT NULL,
  cover_image_url text,
  pdf_url text,
  description text,
  is_featured boolean DEFAULT false,
  page_count integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Issue pages table
CREATE TABLE issue_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id uuid NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  page_number integer NOT NULL,
  image_url text NOT NULL,
  thumbnail_url text NOT NULL,
  UNIQUE(issue_id, page_number)
);

-- Articles table
CREATE TABLE articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id uuid REFERENCES issues(id) ON DELETE SET NULL,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  author text,
  content text,
  featured_image_url text,
  is_featured boolean DEFAULT false,
  publish_date date,
  created_at timestamptz DEFAULT now()
);

-- Contact submissions table
CREATE TABLE contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Index for common queries
CREATE INDEX idx_issues_slug ON issues(slug);
CREATE INDEX idx_issues_featured ON issues(is_featured) WHERE is_featured = true;
CREATE INDEX idx_issue_pages_issue_id ON issue_pages(issue_id);
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_featured ON articles(is_featured) WHERE is_featured = true;
