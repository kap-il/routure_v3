# Routure Backend Integration Reference (v2)

## What Changed and Why

The previous schema organized everything around **pages** as the atomic unit — each page in a PDF got a row in `issue_pages`. This is wrong for how Routure actually works.

The real atomic unit is the **shoot**: a named editorial block that contains one or more photographs and optionally one article. The issue is just a container for an ordered sequence of shoots. The page is an implementation detail of the PDF source — it doesn't belong in the data model at all.

This rewrite reorganizes everything around that reality:

- S3 is structured by shoot, not by page number
- Supabase schema is `issues → shoots → images` (with articles optionally joined to shoots)
- Processing scripts now need shoot-grouping configuration in addition to page splitting
- Frontend queries return shoot-level data shaped to match `DESIGN_SYSTEM.md`

**What stays the same:** `lib/s3/client.ts`, `lib/supabase/client.ts`, the S3 bucket (`routure-issues`), env vars, and dependencies are all unchanged.

---

## Data Model Decision: SQL, Not NoSQL

The "not every shoot has an article" relationship is a clean 0-or-1 (optional one-to-one) in relational terms. PostgreSQL handles this natively: `articles` has a `shoot_id` column with a `UNIQUE` constraint, making it impossible to attach more than one article to a shoot, while `NULL` means no article exists. No NoSQL needed. SQL is strictly more efficient here because:

- Joins are cheaper than document lookups at this data scale
- The UNIQUE constraint enforces the business rule at the database level
- Supabase's PostgREST lets you fetch a shoot with its article in a single query using `?select=*,articles(*)`
- Migrations and type safety are straightforward

---

## 1. Supabase Database Schema

### Tables Overview

```
issues
  └── shoots (many shoots per issue, ordered)
        └── shoot_images (many images per shoot, ordered)
        └── articles (zero or one article per shoot)

contact_submissions (standalone)
```

### `issues`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, `gen_random_uuid()` |
| title | text | Not null |
| slug | text | Unique, not null. Used in URLs: `/issue/:slug` |
| issue_number | integer | Unique, not null |
| publish_date | date | Not null |
| cover_image_url | text | S3 URL to issue cover (usually hero image of first shoot) |
| description | text | Short blurb |
| is_featured | boolean | Default false |
| created_at | timestamptz | Default `now()` |
| updated_at | timestamptz | Default `now()` |

### `shoots`

The core editorial unit. One shoot = one visual block in the magazine (one or more photographs, grouped by editorial intent).

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, `gen_random_uuid()` |
| issue_id | uuid | FK → `issues.id`, ON DELETE CASCADE |
| slug | text | Unique, not null. Used in URLs: `/shoot/:slug` |
| title | text | The shoot name (e.g. "The Architecture of Light") |
| position | integer | Not null. Order of this shoot within the issue (1-indexed) |
| created_at | timestamptz | Default `now()` |

Add a unique constraint on `(issue_id, position)` so positions are unambiguous per issue.

### `shoot_images`

Individual photographs within a shoot. The split/spread detection logic that already exists determines how many images a shoot has.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, `gen_random_uuid()` |
| shoot_id | uuid | FK → `shoots.id`, ON DELETE CASCADE |
| image_url | text | S3 URL, full-resolution WebP |
| thumbnail_url | text | S3 URL, thumbnail WebP |
| width | integer | Pixel width of the full-res image |
| height | integer | Pixel height of the full-res image |
| aspect_ratio | numeric(6,4) | `width / height`, stored for the frontend layout engine |
| position | integer | Not null. Order within the shoot (1-indexed) |
| is_hero | boolean | Default false. True for the first/cover image of the shoot |
| created_at | timestamptz | Default `now()` |

Add a unique constraint on `(shoot_id, position)`.

### `articles`

Written content. Joined to a shoot via a UNIQUE FK. If no row exists for a shoot, that shoot has no article (`hasArticle: false`).

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, `gen_random_uuid()` |
| shoot_id | uuid | Unique FK → `shoots.id`, ON DELETE CASCADE. **UNIQUE enforces max one article per shoot.** |
| title | text | Not null |
| slug | text | Unique, not null. Used in URLs (if articles get standalone pages later) |
| author | text | |
| category | text | e.g. "FEATURE", "CULTURE", "EDITORIAL". Shown in the title bar overlay. |
| content | text | Markdown body. Extracted from the PDF or entered manually. |
| created_at | timestamptz | Default `now()` |

### `contact_submissions`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| name | text | Not null |
| email | text | Not null |
| message | text | Not null |
| created_at | timestamptz | Default `now()` |

---

### SQL Migration

Drop the old tables first if migrating from v1:

```sql
-- MIGRATION: Drop v1 tables (run only if migrating from old schema)
DROP TABLE IF EXISTS issue_pages CASCADE;
DROP TABLE IF EXISTS articles CASCADE;
-- Keep issues, contact_submissions — they can be altered or dropped and recreated

-- Issues table (recreate clean if needed, or ALTER existing)
CREATE TABLE IF NOT EXISTS issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  issue_number integer UNIQUE NOT NULL,
  publish_date date NOT NULL,
  cover_image_url text,
  description text,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Shoots table
CREATE TABLE shoots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id uuid NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  position integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(issue_id, position)
);

-- Shoot images table
CREATE TABLE shoot_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shoot_id uuid NOT NULL REFERENCES shoots(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  thumbnail_url text NOT NULL,
  width integer NOT NULL,
  height integer NOT NULL,
  aspect_ratio numeric(6,4) NOT NULL,
  position integer NOT NULL,
  is_hero boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(shoot_id, position)
);

-- Articles table (0 or 1 per shoot)
CREATE TABLE articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shoot_id uuid UNIQUE NOT NULL REFERENCES shoots(id) ON DELETE CASCADE,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  author text,
  category text,
  content text,
  created_at timestamptz DEFAULT now()
);

-- Contact submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_issues_slug ON issues(slug);
CREATE INDEX idx_issues_featured ON issues(is_featured) WHERE is_featured = true;
CREATE INDEX idx_shoots_issue_id ON shoots(issue_id);
CREATE INDEX idx_shoots_slug ON shoots(slug);
CREATE INDEX idx_shoot_images_shoot_id ON shoot_images(shoot_id);
CREATE INDEX idx_articles_shoot_id ON articles(shoot_id);
CREATE INDEX idx_articles_slug ON articles(slug);
```

---

## 2. TypeScript Types

Create `lib/supabase/types.ts`:

```typescript
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

export interface Shoot {
  id: string;
  issue_id: string;
  slug: string;
  title: string;
  position: number;
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
  created_at: string;
}

// A single block of article content — stored as jsonb array in Supabase
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
  content: ContentBlock[] | null;  // jsonb column — array of structured blocks
  created_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

// Composed types used by the frontend

// What each image tile in the Issue View mosaic needs
// (matches the data shape in DESIGN_SYSTEM.md)
export interface IssueMosaicItem {
  id: string;
  src: string;            // image_url
  thumbnailSrc: string;   // thumbnail_url
  aspectRatio: number;    // width / height
  shootId: string;        // shoot.id
  shootSlug: string;      // shoot.slug — used for routing
  hasArticle: boolean;
  articleTitle: string | null;
  articleCategory: string | null;
  issuePosition: number;  // shoot.position (shoots are the positional unit, not individual images)
  imagePosition: number;  // position within the shoot
  isHero: boolean;
}

// Full shoot data for Shoot with Article View and Shoot Concept View
export interface ShootWithImages extends Shoot {
  images: ShootImage[];
  article: Article | null;   // null if shoot has no article
}
```

---

## 3. S3 Bucket Structure

All assets in `routure-issues`. Restructured around shoots:

```
routure-issues/
  issues/
    {issue-slug}/
      cover.webp                   # Issue-level cover (hero image of shoot 1)
      original.pdf                 # Source PDF (optional, for internal reference)
      shoots/
        {shoot-slug}/
          images/
            001.webp               # Full-res (2000-2500px wide, quality 85)
            002.webp
            ...
          thumbnails/
            001.webp               # Small thumbnails (400px wide, quality 75)
            002.webp
            ...
```

Article content is stored in Supabase as a `jsonb` array of structured blocks, not in S3. There is no `article/` folder in S3 — the only assets are photographs.

### Image Specifications

| Type | Width | Format | Quality | Use |
|------|-------|--------|---------|-----|
| Full-res image | 2000–2500px | WebP | 85 | Issue View, Shoot pages |
| Thumbnail | 400px | WebP | 75 | Lazy loading, mosaic initial load |
| Issue cover | 800px | WebP | 85 | Issue listing cards |

### Public URL Pattern

```
https://routure-issues.s3.us-east-1.amazonaws.com/issues/{issue-slug}/shoots/{shoot-slug}/images/001.webp
https://routure-issues.s3.us-east-1.amazonaws.com/issues/{issue-slug}/shoots/{shoot-slug}/thumbnails/001.webp
```

---

## 4. Processing Pipeline

### Overview

The pipeline runs in two phases:

**Phase 1 — Page Splitting (existing):** The existing script takes a PDF and splits double-page spreads into individual images, handling full-spread and single-page photographs correctly. This produces a flat sequence of image files with correct split/merge decisions already made.

**Phase 2 — Shoot Grouping (new):** A config file tells the script how to group those images into named shoots and which shoots have articles. The script uploads to S3 under the shoot-organized structure and populates Supabase.

**Phase 3 — Article Extraction (new):** For any shoot tagged with an article, the script sends each of that shoot's page images to Claude Haiku vision. Haiku returns structured JSON blocks (paragraphs, headings, pull quotes). The blocks from all pages in the shoot are concatenated in order and written to the `articles.content` jsonb column in Supabase.

### Config File Format

For each issue, create a config file (e.g., `scripts/configs/issue-01.json`):

```json
{
  "issue": {
    "title": "Issue 01",
    "slug": "issue-01",
    "issue_number": 1,
    "publish_date": "2026-01-15",
    "description": "The debut issue.",
    "is_featured": true
  },
  "shoots": [
    {
      "title": "The Architecture of Light",
      "slug": "architecture-of-light",
      "pages": [1, 2, 3, 4],
      "article": {
        "title": "The Architecture of Light",
        "slug": "architecture-of-light-article",
        "author": "Ama Osei",
        "category": "FEATURE"
      }
    },
    {
      "title": "Desert Symmetry",
      "slug": "desert-symmetry",
      "pages": [5, 6],
      "article": null
    },
    {
      "title": "Concrete Garden",
      "slug": "concrete-garden",
      "pages": [7, 8, 9],
      "article": {
        "title": "Concrete Garden",
        "slug": "concrete-garden-article",
        "author": "Milo Chen",
        "category": "EDITORIAL"
      }
    }
  ]
}
```

`pages` refers to the numbered output files from Phase 1 (the already-split images, not PDF page numbers). `article: null` means the shoot is photos only.

### Script: `scripts/process-issue.ts`

```bash
npx tsx scripts/process-issue.ts --config ./scripts/configs/issue-01.json --pdf ./path/to/magazine.pdf
```

**What it does:**

1. Reads the config JSON
2. Runs Phase 1 page splitting on the PDF → produces a temp folder of split images
3. For each shoot in the config:
   a. Selects the image files corresponding to `pages` array
   b. Resizes each to full-res (2000–2500px, quality 85) and thumbnail (400px, quality 75) via `sharp`
   c. Uploads to S3 at `issues/{issue-slug}/shoots/{shoot-slug}/images/001.webp` etc.
   d. Records the S3 URLs, pixel dimensions, and computed `aspect_ratio` for each image
4. Generates the issue cover: takes the first image of the first shoot, resizes to 800px, uploads to `issues/{issue-slug}/cover.webp`
5. Optionally uploads the source PDF
6. **For shoots with an article — runs Phase 3 extraction:**
   a. Sends each page image for that shoot to Claude Haiku vision (see prompt below)
   b. Concatenates the returned block arrays across all pages in order
   c. Writes the result to a temp file (`tmp/{shoot-slug}-content.json`) for review before committing
   d. On confirmation (or with `--no-confirm` flag for automation), upserts the `articles` row with the extracted `content` jsonb
7. Writes to Supabase:
   - Upserts the `issues` row
   - For each shoot: upserts `shoots` row (with `position` = index in config array)
   - For each image: upserts `shoot_images` row (with `is_hero = true` for position 1 of each shoot)
   - For shoots with an article: upserts `articles` row with extracted `content`

### Article Extraction: Haiku Prompt

Model: `claude-haiku-4-5-20251001`

**Primary prompt (sent with each page image):**

```
This is a page from a magazine article. The layout may use multiple columns.
Read each column completely top-to-bottom before moving to the next column, left to right.
Do not read across columns horizontally.

Extract all text content and return a JSON array of blocks.
Each block must have exactly two fields:
  "type": one of "heading", "paragraph", "pullquote", or "caption"
  "text": the extracted text string

Rules:
- Preserve reading order within each column
- Ignore page numbers, running headers, and footers
- Do not describe or reference photographs — text only
- Do not add commentary or explanation — return only the JSON array

Example output:
[
  { "type": "heading", "text": "The Architecture of Light" },
  { "type": "paragraph", "text": "There is a particular quality to light in abandoned spaces..." },
  { "type": "pullquote", "text": "Light doesn't just illuminate — it constructs." }
]
```

**Two-pass fallback** (used automatically if the primary pass produces blocks that appear to cross columns — detected by checking if paragraph text lengths are unusually short and alternating, which is a signal of horizontal reading):

```
Pass 1 prompt addition:
"Before extracting text, describe the column structure of this page:
how many columns are there, and approximately where does each column begin and end?"

Pass 2 uses the layout description from Pass 1 to reinforce column boundaries in the extraction prompt.
```

The temp JSON output (`tmp/{shoot-slug}-content.json`) should be reviewed after the first run of each new issue to confirm extraction quality before the content is committed to Supabase.

### Additional Scripts

- `scripts/delete-issue.ts` — deletes all S3 assets under `issues/{slug}/` and cascades Supabase rows via FK
- `scripts/add-article.ts` — manually attaches or updates an article for an existing shoot (for post-publication edits)
- `scripts/list-issues.ts` — prints all issues and shoot counts from Supabase

---

## 5. Data Access Layer

Create `lib/supabase/queries.ts`. All functions use `createServerClient()`.

```typescript
// --- Issues ---

async function getIssues(): Promise<Issue[]>
// All issues, ordered by issue_number desc.

async function getFeaturedIssues(): Promise<Issue[]>
// Issues where is_featured = true.

async function getIssueBySlug(slug: string): Promise<Issue | null>
// Single issue by slug.

// --- Issue View: Mosaic Data ---

async function getIssueMosaicData(issueId: string): Promise<IssueMosaicItem[]>
// Returns the full flattened image list for the mosaic layout engine.
// Joins shoots → shoot_images → articles (LEFT JOIN).
// Returns one IssueMosaicItem per image, sorted by shoot.position ASC, then shoot_images.position ASC.
// hasArticle is true if a matching articles row exists for that shoot.
// This is the primary query for the Issue View page.
//
// SQL equivalent:
// SELECT
//   si.id, si.image_url, si.thumbnail_url, si.aspect_ratio, si.position AS image_position, si.is_hero,
//   s.id AS shoot_id, s.slug AS shoot_slug, s.position AS issue_position,
//   a.title AS article_title, a.category AS article_category,
//   CASE WHEN a.id IS NOT NULL THEN true ELSE false END AS has_article
// FROM shoot_images si
// JOIN shoots s ON si.shoot_id = s.id
// LEFT JOIN articles a ON a.shoot_id = s.id
// WHERE s.issue_id = $1
// ORDER BY s.position ASC, si.position ASC

// --- Shoot Pages ---

async function getShootBySlug(slug: string): Promise<ShootWithImages | null>
// Returns a shoot with all its images (ordered by position) and its article (or null).
// Used by both /shoot/:slug (Shoot Concept View) and /shoot/:slug/article (Shoot with Article View).
// Single Supabase query with nested selects:
//   .from('shoots').select('*, shoot_images(*), articles(*)').eq('slug', slug)

// --- Contact ---

async function submitContactForm(data: { name: string; email: string; message: string }): Promise<void>
// Inserts into contact_submissions.
```

---

## 6. Frontend Integration

How the frontend pages (from `DESIGN_SYSTEM.md`) map to the data layer:

### Route: `/issue/:issueSlug` → Issue View (Mosaic)

```typescript
// app/issue/[slug]/page.tsx (Server Component)

const issue = await getIssueBySlug(slug);
const mosaicItems = await getIssueMosaicData(issue.id);

// Pass mosaicItems to the mosaic layout engine client component.
// Each item already has: src, thumbnailSrc, aspectRatio, shootSlug, hasArticle,
// articleTitle, articleCategory, issuePosition — exactly the shape from DESIGN_SYSTEM.md.
```

Click routing in the Issue View:

```
hasArticle: true  → /shoot/{shootSlug}/article
hasArticle: false → /shoot/{shootSlug}
```

### Route: `/shoot/:shootSlug/article` → Shoot with Article View

```typescript
// app/shoot/[slug]/article/page.tsx (Server Component)

const shoot = await getShootBySlug(slug);
// shoot.images → ordered list for interleaving with article text
// shoot.article → { title, author, category, content (markdown) }
// If shoot.article is null, redirect to /shoot/:slug
```

### Route: `/shoot/:shootSlug` → Shoot Concept View

```typescript
// app/shoot/[slug]/page.tsx (Server Component)

const shoot = await getShootBySlug(slug);
// shoot.images → ordered list for the flowing layout
// shoot.article should be null here (if not null, redirect to /article route)
// shoot.images[0] → hero image (is_hero: true)
```

### Static Generation

```typescript
// Generates all issue pages at build time
export async function generateStaticParams() {
  const issues = await getIssues();
  return issues.map((i) => ({ slug: i.slug }));
}

// Generates all shoot pages at build time
export async function generateStaticParams() {
  const { data } = await createServerClient().from('shoots').select('slug');
  return data.map((s) => ({ slug: s.slug }));
}
```

### Next.js Image Config

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

---

## 7. Contact Form Server Action

`app/actions/contact.ts` is unchanged from v1:

```typescript
'use server'
import { submitContactForm } from '@/lib/supabase/queries';

export async function handleContactSubmission(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;
  if (!name || !email || !message) return { error: 'All fields are required.' };
  try {
    await submitContactForm({ name, email, message });
    return { success: true };
  } catch {
    return { error: 'Failed to submit. Please try again.' };
  }
}
```

---

## Architecture Summary

```
User's Browser
  │
  ├── /issue/:slug (Issue View)
  │     └── getIssueMosaicData() → flat image list with hasArticle flags → mosaic layout engine
  │
  ├── /shoot/:slug/article (Shoot with Article View)
  │     └── getShootBySlug() → images + article content → interleaved layout
  │
  ├── /shoot/:slug (Shoot Concept View)
  │     └── getShootBySlug() → images only → flowing photo layout
  │
  └── Contact Form → Server Action → submitContactForm() → Supabase insert

Developer's Machine (content pipeline)
  │
  └── scripts/process-issue.ts --config issue-01.json --pdf magazine.pdf
        ├── Phase 1: PDF → split page images (existing logic)
        ├── Phase 2: group by shoot config → resize → upload to S3 (by shoot)
        └── Populate Supabase: issues → shoots → shoot_images → articles
```

---

## Implementation Order

1. **Run the SQL migration** in Supabase — drop old `issue_pages`/`articles`, create `shoots`, `shoot_images`, new `articles`
2. **Update `lib/supabase/types.ts`** with the types in section 2
3. **Update `lib/supabase/queries.ts`** with the new query functions
4. **Update routing structure** in the Next.js app to match `/issue/:slug`, `/shoot/:slug`, `/shoot/:slug/article`
5. **Build `scripts/process-issue.ts`** with the two-phase pipeline and config-driven shoot grouping
6. **Write the config JSON** for your first issue, run the script, verify S3 and Supabase are populated correctly
7. **Wire up Server Components** — Issue View pulls `getIssueMosaicData()`, Shoot pages pull `getShootBySlug()`
8. **Deploy and verify** static generation works end-to-end on Vercel
