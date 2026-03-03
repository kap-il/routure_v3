# Page Framework — Design System & Linking Guide

## Overview

Four pages. Two systems.

| Page | SVG File | System |
|------|----------|--------|
| Featured (Home) | `Featured_Page_Wireframe.svg` | Standalone — frontend only for now |
| Issue View | `Issue_View_Wireframe.svg` | Linked system |
| Shoot with Article | `Shoot_With_Article_Wireframe.svg` | Linked system |
| Shoot Concept (no article) | `Shoot_Concept_No_Article_Wireframe.svg` | Linked system |

---

## System 1 — Featured Page (Standalone)

**Status: Frontend implementation only. Backend/data linking deferred.**

The Featured Page is the hero/home page of the publication. At this stage, implement it purely as a visual shell:

- Hero section: large article image + featured article title overlay
- Below the fold: featured article title, brief summary, categories list, latest issue card
- All links and interactive elements can be stubbed out (`href="#"`) — no routing logic needed yet
- The categories list and "Latest Issue" block will eventually pull from a data source, but for now render them as static placeholder content
- The only goal right now is pixel-accurate frontend fidelity to the wireframe

**Do not implement:**
- Any CMS or data fetching
- Article routing
- Category filtering
- Issue navigation

---

## System 2 — The Linked Reading Experience

These three pages form a single connected flow. They are designed to work together as the core magazine-reading experience.

```
Issue View
    │
    ├── [click image with article] ──→ Shoot with Article View
    │
    └── [click image without article] ──→ Shoot Concept View (no article)
```

### Page: Issue View

**The central hub. Every image in the magazine lives here.**

The Issue View is a single, vertically scrollable page that presents the entire magazine as a mosaic of images. Think of it as the table of contents made visual — every photograph from every shoot is placed here. The user reads the magazine by scrolling this page and clicking into whatever catches their eye.

#### Critical Constraint: The Layout Must Be Procedurally Generated

**The mosaic cannot be hardcoded.**

Reasons:
- Different issues will have different numbers of photographs
- Individual shoot images will have varying aspect ratios (portrait, landscape, square)
- Some images have associated articles, some do not
- The number of shoots per issue will vary

The frontend must accept an array of image objects and generate the mosaic layout dynamically. The layout engine should:

1. **Respect aspect ratios** — images should not be cropped or distorted to fit a fixed grid. Instead, the grid adapts to the images.
2. **Vary block sizes** — a naive equal-column grid is wrong. The layout should produce variation: some images span the full width, some sit side by side, some form asymmetric pairs. This is what creates the magazine feel.
3. **Group by shoot** — images from the same shoot should be visually proximate. The mosaic is not a random shuffle; it follows the editorial order of the issue.
4. **Flag article images** — any image that has an associated article must render an article title bar overlaid at the bottom of its tile. This is what tells the user "this image leads somewhere with text."

#### Data Shape (Conceptual)

Each item in the Issue View is driven by an object roughly like this:

```js
{
  id: "img-023",
  src: "/images/shoot-04/frame-02.jpg",
  aspectRatio: 1.5,          // width / height — drives mosaic sizing
  shootId: "shoot-04",
  hasArticle: true,
  articleTitle: "The Architecture of Light",
  articleCategory: "FEATURE",
  // order within the issue
  issuePosition: 7
}
```

The layout engine iterates over these objects and places them into the mosaic. It does not know in advance how many images there are or what sizes they are.

#### Layout Engine Behavior (Required)

- Full-width images should appear periodically to anchor the scroll and create breathing room (e.g., every N images, or whenever a shoot's hero/cover image appears)
- Side-by-side pairs should be chosen based on complementary aspect ratios — a tall portrait pairs with a landscape, two squares sit together, etc.
- The gap/gutter between tiles should be consistent (suggest: 16px or 20px)
- On scroll, new rows render as the user reaches them (virtual scroll or intersection observer recommended for performance — issues may have 40+ images)
- The page header (issue number, title, date) is static and sits above the mosaic

#### Article Title Bar (on image tiles)

When `hasArticle: true`, the tile renders a dark overlay bar pinned to the bottom of the image:

```
┌─────────────────────────────────────────┐
│                                         │
│            [image]                      │
│                                         │
├─────────────────────────────────────────┤
│ CATEGORY        Article Title    Read → │
└─────────────────────────────────────────┘
```

- Bar height: fixed (e.g. 56–72px) regardless of image size
- Typography: category in small caps/tracking, title in serif, arrow CTA right-aligned
- The bar is part of the tile, not a tooltip — it is always visible

#### Click Behavior

Every image tile is clickable. The click destination depends on `hasArticle`:

| Condition | Destination |
|-----------|-------------|
| `hasArticle: true` | → Shoot with Article View, for that shoot |
| `hasArticle: false` | → Shoot Concept View (no article), for that shoot |

Both destination pages receive the `shootId` as a route parameter so they know which shoot's images to load.

---

### Page: Shoot with Article View

**Destination when a user clicks an image that has an associated article.**

Receives: `shootId`

Layout:
1. **Full-width hero** — the shoot's cover/spread image, edge-to-edge, no cropping, fill to size. This is the only image that renders at true full bleed.
2. **Article + next image** — the article text and the next shoot image sit side by side. Article text is on the left, next image on the right. (Or right/left — TBD by editorial direction, but alternating is correct.)
3. **Pattern repeats** — as the article continues, the image/text pairing alternates down the page. Each new shoot image appears alongside the next section of article copy.
4. The shoot images and the article text are interleaved procedurally — neither is hardcoded.

This page also receives `shootId` and must fetch both the article content and the ordered list of shoot images for that shoot.

**Do not assume a fixed number of images or a fixed article length.** A short article with 3 images and a long article with 12 images should both render correctly.

---

### Page: Shoot Concept View (no article)

**Destination when a user clicks an image from a photo-only shoot.**

Receives: `shootId`

Layout:
1. **Full-width hero** — first/primary image of the shoot, full bleed
2. **Below the hero** — remaining shoot images rendered in a flowing layout: alternating between portrait thumbnails and wider landscape images
3. **Repeating pattern** — see wireframe: tall portrait (left) + landscape (right), then full-width, then two equal images, etc. This pattern can repeat for as many images as the shoot contains.
4. No article text is rendered. No article title bar. Caption metadata (shoot name, photographer, issue) appears beneath the hero.

Like the Shoot with Article View, this page must handle a variable number of images gracefully.

---

## Summary: What Is and Is Not Hardcoded

| Element | Hardcoded? | Notes |
|---------|-----------|-------|
| Navbar | Yes | Same across all pages |
| Featured page layout | Yes (for now) | Static shell, data comes later |
| Issue View mosaic grid | **No** | Procedurally generated from image data |
| Article title bars | Conditional | Rendered only when `hasArticle: true` |
| Click routing in Issue View | Conditional | Routes to article vs. no-article view based on flag |
| Shoot with Article layout | **No** | Number of images and article length varies |
| Shoot Concept layout | **No** | Number of images varies per shoot |
| Image aspect ratios | **No** | Must be respected, not overridden |

---

## Routing Structure (Suggested)

```
/                          → Featured Page
/issue/:issueId            → Issue View (mosaic)
/shoot/:shootId/article    → Shoot with Article View
/shoot/:shootId            → Shoot Concept View (no article)
```

The Issue View links out to shoot pages. The shoot pages do not link back to each other — only back to the Issue View (via the navbar or a back control).
