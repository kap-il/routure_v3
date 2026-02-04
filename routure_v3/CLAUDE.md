# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Routure** is a magazine website built with Next.js featuring digital issue viewing with an interactive page-turning engine, merchandise sales, and community engagement.

## Build & Development Commands

```bash
npm run dev      # Development server (http://localhost:3000)
npm run build    # Production build
npm start        # Start production server
npm run lint     # Lint code
```

## Technology Stack

- **Framework**: Next.js 16 with App Router
- **React**: 19 with Server Components by default
- **TypeScript**: 5 with strict mode
- **Styling**: Tailwind CSS v4
- **Path alias**: `@/*` maps to project root

## Design System

### Typography
- **Headings & Titles**: Argue Regular
- **Body text**: System default or secondary font (TBD)

### Color Palette
Monochrome scheme:
- **Primary**: Black (`#000000`)
- **Background**: White (`#FFFFFF`)
- **Accents**: Greys (`#333333`, `#666666`, `#999999`, `#CCCCCC`, `#E5E5E5`)

```css
/* Tailwind config example */
colors: {
  black: '#000000',
  white: '#FFFFFF',
  gray: {
    900: '#333333',
    700: '#666666',
    500: '#999999',
    300: '#CCCCCC',
    100: '#E5E5E5',
  }
}
```

---

## Page Architecture

### 1. Featured Page (`/`)

**Purpose**: Landing page showcasing the magazine's best content and latest highlights.

**Key Elements**:
- Hero section with featured cover/article
- Featured articles carousel (horizontal scroll or auto-rotate)
- CTAs to browse current and past issues
- Trending/popular content grid
- Newsletter signup teaser
- Latest merchandise highlights

**Technical Considerations**:
- Use Server Components for initial content fetch
- Implement carousel with client component (`'use client'`)
- Lazy load below-fold sections with `loading.tsx` or Suspense
- Optimize hero images with priority loading in `next/image`

---

### 2. Current Issues Page (`/issues`)

**Purpose**: Browse and read magazine issues with an interactive page-turning experience.

**Key Elements**:
- Issue grid/list with cover thumbnails
- Issue metadata (publication date, theme, featured articles)
- Interactive page-turning reader (flipbook)
- Download/print options
- Archive section for back issues
- Table of contents per issue

**Routes**:
- `/issues` - Issue listings and archive
- `/issues/[slug]` - Individual issue reader with flipbook

#### Page-Turning Engine Specifications

**Core Features**:
- Smooth CSS/WebGL animations for page flip effect
- Touch/swipe support (mobile and tablet)
- Keyboard navigation (arrow keys, Page Up/Down)
- Mouse drag to turn pages
- Click on page edges to navigate

**Advanced Features**:
- Zoom capabilities (pinch-to-zoom, double-tap, zoom controls)
- Full-screen mode with Fullscreen API
- Progress indicator (page X of Y, progress bar)
- Table of contents overlay with jump-to-page
- Thumbnail navigation strip
- Bookmarking/remember last page (localStorage)

**Performance Requirements**:
- Lazy load pages (load current, next, and previous only)
- Preload adjacent pages during idle time
- Support both PDF and image sequence formats
- Progressive image loading (blur placeholder → full resolution)
- Virtualized rendering for large issues (50+ pages)

**Magazine Storage Strategies**:
```
Option A: Image Sequences (Recommended for flipbook)
/public/issues/[issue-slug]/
  ├── cover.jpg
  ├── pages/
  │   ├── 001.jpg (or .webp)
  │   ├── 002.jpg
  │   └── ...
  └── metadata.json (title, date, toc, etc.)

Option B: PDF with Client-Side Rendering
- Store PDFs in cloud storage (S3, Cloudflare R2)
- Use pdf.js for rendering pages to canvas
- Extract pages on-demand for flipbook display
```

**Recommended Libraries**:
- `turn.js` or `react-pageflip` for flipbook mechanics
- `pdf.js` if PDF rendering needed
- `framer-motion` for custom animations
- `react-zoom-pan-pinch` for zoom functionality

---

### 3. Merchandising Page (`/shop`)

**Purpose**: E-commerce catalog for magazine-related merchandise.

**Key Elements**:
- Product grid with filtering/sorting
- Category navigation (apparel, accessories, collectibles)
- Product detail pages with image gallery
- Size/variant selectors
- Shopping cart (persistent)
- Checkout flow with payment processing
- Inventory/stock display
- Customer reviews and ratings

**Routes**:
- `/shop` - Product catalog with filters
- `/shop/[category]` - Category-filtered view
- `/shop/product/[slug]` - Product detail page
- `/cart` - Shopping cart
- `/checkout` - Checkout flow

**E-commerce Integration Options**:
```
Headless CMS + Payment:
- Shopify Storefront API (recommended for full e-commerce)
- Stripe + custom inventory (lightweight option)
- Snipcart (drop-in cart solution)

Payment Processing:
- Stripe Checkout or Elements
- PayPal integration
- Apple Pay / Google Pay via Stripe
```

**Technical Considerations**:
- Use React Context or Zustand for cart state
- Persist cart to localStorage + sync with backend
- Server Actions for checkout processing
- Implement optimistic UI for add-to-cart
- ISR (Incremental Static Regeneration) for product pages
- Webhook handlers for inventory updates

---

### 4. Outreach Page (`/community`)

**Purpose**: Community engagement and social connection hub.

**Key Elements**:
- Newsletter signup form (prominent placement)
- Social media links and embedded feeds
- Contact form / general inquiries
- Submission guidelines (reader contributions)
- Events calendar (if applicable)
- Community highlights / reader features

**Integration Points**:
```
Email/Newsletter:
- Mailchimp, ConvertKit, or Resend
- Use Server Actions for form submission
- Double opt-in flow recommended

Social Media:
- Embedded Instagram feed (official embed or third-party)
- Twitter/X feed widget
- Links to all social platforms

Contact Forms:
- Server Action → email service (Resend, SendGrid)
- Or third-party form handler (Formspree, Basin)
```

**Technical Considerations**:
- Validate email forms server-side
- Rate limiting on form submissions
- Honeypot fields for spam prevention
- CAPTCHA for high-traffic sites (hCaptcha, Turnstile)

---

## Recommended File Structure

```
app/
├── layout.tsx              # Root layout (nav, footer, providers)
├── page.tsx                # Featured/Home page
├── globals.css
├── issues/
│   ├── page.tsx            # Issue listings
│   └── [slug]/
│       └── page.tsx        # Issue reader with flipbook
├── shop/
│   ├── page.tsx            # Product catalog
│   ├── [category]/
│   │   └── page.tsx        # Category view
│   └── product/
│       └── [slug]/
│           └── page.tsx    # Product detail
├── cart/
│   └── page.tsx
├── checkout/
│   └── page.tsx
├── community/
│   └── page.tsx            # Outreach/community page
└── api/
    ├── newsletter/
    │   └── route.ts        # Newsletter signup handler
    ├── contact/
    │   └── route.ts        # Contact form handler
    └── webhooks/
        └── stripe/
            └── route.ts    # Payment webhooks

components/
├── layout/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Navigation.tsx
├── featured/
│   ├── HeroSection.tsx
│   ├── ArticleCarousel.tsx
│   └── TrendingGrid.tsx
├── issues/
│   ├── IssueCard.tsx
│   ├── IssueGrid.tsx
│   └── flipbook/
│       ├── FlipbookReader.tsx    # Main reader component
│       ├── PageRenderer.tsx       # Single page display
│       ├── FlipbookControls.tsx   # Navigation controls
│       ├── TableOfContents.tsx
│       ├── ThumbnailNav.tsx
│       └── ZoomControls.tsx
├── shop/
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   ├── ProductFilters.tsx
│   ├── CartDrawer.tsx
│   └── CheckoutForm.tsx
├── community/
│   ├── NewsletterForm.tsx
│   ├── ContactForm.tsx
│   └── SocialLinks.tsx
└── ui/
    ├── Button.tsx
    ├── Card.tsx
    ├── Modal.tsx
    └── ... (shared UI components)

lib/
├── api/
│   └── ... (API client utilities)
├── hooks/
│   ├── useCart.ts
│   ├── useFlipbook.ts
│   └── useNewsletterForm.ts
├── stores/
│   └── cartStore.ts        # Zustand or Context
└── utils/
    └── ... (helpers, formatters)

public/
├── issues/                 # Magazine issue assets
│   └── [issue-slug]/
│       ├── cover.jpg
│       └── pages/
└── products/               # Product images

types/
├── issue.ts
├── product.ts
└── ... (TypeScript interfaces)
```

---

## Implementation Best Practices

### Server vs Client Components
- Default to Server Components for data fetching
- Use `'use client'` only for: interactivity, browser APIs, React hooks (useState, useEffect)
- Keep client components small and leaf-level

### Data Fetching
- Use `fetch` in Server Components with caching options
- Server Actions for mutations (forms, cart updates)
- Consider React Query/SWR for client-side data needs

### Image Handling
- Always use `next/image` for optimization
- Set `priority` on above-fold images
- Use `placeholder="blur"` with `blurDataURL` for better UX
- Store large assets (issue pages) in cloud storage with CDN

### State Management
- URL state for filters/sorting (searchParams)
- React Context or Zustand for cart
- localStorage for persistence (cart, reading progress)

### SEO
- Use Metadata API in each page/layout
- Generate dynamic metadata for issues and products
- Implement JSON-LD structured data for products
