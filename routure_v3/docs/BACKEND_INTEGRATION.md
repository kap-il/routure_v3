# Routure Backend Integration Reference

## Overview

This document defines the backend architecture for the Routure magazine website. The site uses **Supabase** as a database for content metadata and **AWS S3** for file storage (magazine page images, thumbnails, article images). There is no admin UI — all content is managed through a local CLI script that processes PDFs, uploads assets to S3, and populates Supabase. The Next.js app is read-only (except for a contact form).

**Existing setup (already done):**
- `lib/s3/client.ts` — S3 client with helpers for upload, download, delete, list, presigned URLs, public URL generation. Configured for the `routure-issues` bucket in `us-east-1`.
- `lib/supabase/client.ts` — Client-side Supabase client (publishable key) and `createServerClient()` for server-side operations.
- Dependencies installed: `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`, `@supabase/supabase-js`
- Env vars configured in `.env.local` with Supabase URL/keys and AWS credentials/bucket.

**What needs to be built:**
1. Supabase database schema (tables + types)
2. S3 bucket prefix structure
3. Local CLI script for PDF processing + upload
4. Data access layer (TypeScript functions for querying Supabase)
5. Frontend integration (Server Components consuming the data layer)
6. Contact form Server Action

---

## 1. Supabase Database Schema

### Tables

#### `issues`
Stores metadata for each magazine issue.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key, default `gen_random_uuid()` |
| title | text | Not null |
| slug | text | Unique, not null. Used in URLs |
| issue_number | integer | Unique, not null |
| publish_date | date | Not null |
| cover_image_url | text | S3 URL to cover image |
| pdf_url | text | S3 URL to original PDF (for optional download) |
| description | text | Short blurb about the issue |
| is_featured | boolean | Default false |
| page_count | integer | Total number of pages |
| created_at | timestamptz | Default `now()` |
| updated_at | timestamptz | Default `now()` |

#### `issue_pages`
Individual page data for the interactive magazine viewer.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key, default `gen_random_uuid()` |
| issue_id | uuid | Foreign key → `issues.id`, ON DELETE CASCADE |
| page_number | integer | Not null |
| image_url | text | S3 URL to full-resolution page image |
| thumbnail_url | text | S3 URL to thumbnail |

Add a unique constraint on `(issue_id, page_number)`.

#### `articles`
Written content, optionally tied to an issue.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key, default `gen_random_uuid()` |
| issue_id | uuid | Nullable foreign key → `issues.id`, ON DELETE SET NULL |
| title | text | Not null |
| slug | text | Unique, not null |
| author | text | |
| content | text | Markdown or rich text body |
| featured_image_url | text | S3 URL |
| is_featured | boolean | Default false |
| publish_date | date | |
| created_at | timestamptz | Default `now()` |

#### `contact_submissions`
Outreach form entries.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key, default `gen_random_uuid()` |
| name | text | Not null |
| email | text | Not null |
| message | text | Not null |
| created_at | timestamptz | Default `now()` |

### SQL Migration

Run this in the Supabase SQL editor or save as a migration file:

```sql
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
```

### TypeScript Types

Create `lib/supabase/types.ts`:

```typescript
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
```

---

## 2. S3 Bucket Structure

All assets live in the `routure-issues` bucket with this prefix structure:

```
routure-issues/
  issues/
    {slug}/
      cover.webp              # Cover image for cards/grids
      original.pdf             # Full PDF (optional, for download)
      pages/
        001.webp               # Full-res page images
        002.webp
        ...
      thumbnails/
        001.webp               # Small thumbnails for lazy loading / grid
        002.webp
        ...
  articles/
    {slug}/
      featured.webp            # Article featured image
      {other-images}.webp      # Any inline images
```

### Image Specifications

| Type | Width | Format | Quality | Approx. Size |
|------|-------|--------|---------|-------------|
| Page (full-res) | 2000-2500px | WebP | 85 | 300KB - 1MB |
| Thumbnail | 400px | WebP | 75 | 20-50KB |
| Cover image | 800px | WebP | 85 | 100-300KB |
| Article featured | 1200px | WebP | 85 | 200-500KB |

**Important:** Raw PDF page exports can be 20-30MB each. The processing script MUST compress and convert to WebP at these specs. A 120-page issue should total ~60-120MB in S3 for full-res pages, not gigabytes.

### Public URL Pattern

```
https://routure-issues.s3.us-east-1.amazonaws.com/issues/{slug}/pages/001.webp
```

The bucket should be configured for public-read access on published assets. These URLs are stored directly in Supabase rows and used as `src` attributes in `<Image>` components.

---

## 3. Local CLI Script

A Node.js script that runs on the developer's machine to process a magazine PDF and populate the backend. This is the only way content gets into the system.

### Location

`scripts/process-issue.ts` (run with `tsx` or `ts-node`)

### Usage

```bash
npx tsx scripts/process-issue.ts \
  --pdf ./path/to/magazine.pdf \
  --title "Issue Title" \
  --slug "issue-title" \
  --issue-number 1 \
  --publish-date 2026-01-15 \
  --description "A brief description of this issue" \
  --featured
```

### What It Does

1. **Reads the PDF** and determines page count
2. **Renders each page** to a WebP image at full resolution (2000-2500px wide, quality 85)
3. **Generates a thumbnail** for each page (400px wide, quality 75)
4. **Extracts/generates a cover image** from page 1 (800px wide)
5. **Uploads all images to S3** under `issues/{slug}/pages/`, `issues/{slug}/thumbnails/`, and `issues/{slug}/cover.webp`
6. **Optionally uploads the original PDF** to `issues/{slug}/original.pdf`
7. **Creates the `issues` row** in Supabase with all metadata and S3 URLs
8. **Creates `issue_pages` rows** in Supabase for each page with image and thumbnail URLs
9. **Logs progress** (e.g., "Uploading page 45/120...")

### Dependencies for the Script

- `pdf2pic` or `pdf-lib` + `sharp` for PDF → image conversion
- `sharp` for resizing and WebP conversion
- The existing `lib/s3/client.ts` for uploads
- The existing `lib/supabase/client.ts` (server client) for database writes

### Additional Script Utilities

Consider also creating:
- `scripts/seed-article.ts` — for adding articles with metadata + image upload
- `scripts/delete-issue.ts` — removes an issue's S3 assets and Supabase rows
- `scripts/list-issues.ts` — quick check of what's in the database

---

## 4. Data Access Layer

Create `lib/supabase/queries.ts` with functions that the frontend Server Components call. All functions use the server Supabase client.

```typescript
// All functions in this file use createServerClient() from lib/supabase/client.ts

// --- Issues ---

async function getIssues(): Promise<Issue[]>
// Fetches all published issues, ordered by issue_number descending.
// SELECT * FROM issues ORDER BY issue_number DESC

async function getFeaturedIssues(): Promise<Issue[]>
// Fetches issues where is_featured = true.
// SELECT * FROM issues WHERE is_featured = true ORDER BY publish_date DESC

async function getIssueBySlug(slug: string): Promise<Issue | null>
// Fetches a single issue by slug.
// SELECT * FROM issues WHERE slug = $1

async function getIssuePages(issueId: string): Promise<IssuePage[]>
// Fetches all pages for an issue, ordered by page number.
// SELECT * FROM issue_pages WHERE issue_id = $1 ORDER BY page_number ASC

// --- Articles ---

async function getArticles(): Promise<Article[]>
// Fetches all articles, ordered by publish_date descending.
// SELECT * FROM articles ORDER BY publish_date DESC

async function getFeaturedArticles(): Promise<Article[]>
// Fetches articles where is_featured = true.

async function getArticleBySlug(slug: string): Promise<Article | null>
// Fetches a single article by slug.

// --- Contact ---

async function submitContactForm(data: {
  name: string;
  email: string;
  message: string;
}): Promise<void>
// Inserts a row into contact_submissions.
// This is the ONLY write operation in the app.
```

---

## 5. Frontend Integration

### How Each Section Consumes Data

#### Featured / Home Page
- Server Component calls `getFeaturedIssues()` and `getFeaturedArticles()`
- Renders issue cards using `cover_image_url` from S3
- Renders article previews using `featured_image_url` from S3
- All images use Next.js `<Image>` component with the S3 URL as `src`

#### Magazine Viewer
- Page route: `/issues/[slug]`
- Server Component calls `getIssueBySlug(slug)` then `getIssuePages(issueId)`
- Passes array of page image URLs to the client-side page-turning component
- **Lazy loading strategy**: Load thumbnails first for all pages (tiny, fast). Load full-res images only for the current spread (2 pages) and prefetch 1-2 pages ahead. This keeps initial load fast regardless of issue length.

#### Articles
- List page: Server Component calls `getArticles()`
- Detail page: `/articles/[slug]` calls `getArticleBySlug(slug)`
- Article body rendered from markdown/rich text in `content` field

#### Outreach / Contact
- Client Component with a form
- On submit, calls a Server Action that invokes `submitContactForm()`
- This is the only write operation in the entire app

### Next.js `<Image>` Configuration

Add S3 domain to `next.config.js` so `<Image>` can optimize remote images:

```javascript
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'routure-issues.s3.us-east-1.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
};
```

### Static Generation

For published issues and articles, use `generateStaticParams` to statically generate pages at build time:

```typescript
// app/issues/[slug]/page.tsx
export async function generateStaticParams() {
  const issues = await getIssues();
  return issues.map((issue) => ({ slug: issue.slug }));
}
```

This means issue pages are pre-rendered at deploy time — fast loads, no serverless function invocation needed for reads.

---

## 6. Contact Form Server Action

Create `app/actions/contact.ts`:

```typescript
'use server'

import { submitContactForm } from '@/lib/supabase/queries';

export async function handleContactSubmission(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  // Basic validation
  if (!name || !email || !message) {
    return { error: 'All fields are required.' };
  }

  try {
    await submitContactForm({ name, email, message });
    return { success: true };
  } catch (error) {
    return { error: 'Failed to submit. Please try again.' };
  }
}
```

---

## Architecture Summary

```
User's Browser
  │
  ├── Next.js Server Components (read data)
  │     └── Supabase queries → issue metadata, article content, page URLs
  │
  ├── <Image src="S3 URL" /> (fetch assets directly from S3)
  │     └── S3 bucket serves images directly to the browser
  │
  └── Contact Form → Server Action → Supabase insert
  
Developer's Machine (content management)
  │
  └── scripts/process-issue.ts
        ├── PDF → page images (sharp/pdf2pic)
        ├── Upload to S3
        └── Populate Supabase
```

**Hosting: Vercel Free Plan** — the app is read-only (except contact form), all heavy assets served from S3. Serverless functions only do lightweight Supabase queries. No processing happens on the server.

---

## Implementation Order

1. **Run the SQL migration** in Supabase to create tables
2. **Create `lib/supabase/types.ts`** with TypeScript interfaces
3. **Create `lib/supabase/queries.ts`** with data access functions
4. **Update `next.config.js`** with S3 remote image pattern
5. **Build `scripts/process-issue.ts`** — the CLI tool for processing PDFs and populating the backend
6. **Process your first issue** using the script
7. **Integrate frontend components** — wire up Server Components to the data access layer, replace any hardcoded/placeholder content with live data
8. **Build the contact form** with Server Action
9. **Deploy to Vercel** and verify everything works end-to-end
