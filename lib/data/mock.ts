import type { MosaicImage, ShootWithArticleData, ShootConceptData } from '@/types/issue';

// ============================================================
// Issue View — Mosaic mock data
// ============================================================

export const mockIssue = {
  issueId: 'spring-2026',
  issueNumber: 24,
  title: 'Spring 2026',
  subtitle: 'scroll to explore',
  articleCount: 4,
  photoCount: 16,
};

export const mockMosaicImages: MosaicImage[] = [
  {
    id: 'img-001',
    src: '',
    aspectRatio: 2.28, // full-width hero (1280/560)
    shootId: 'shoot-01',
    hasArticle: false,
    issuePosition: 1,
  },
  {
    id: 'img-002',
    src: '',
    aspectRatio: 0.75, // tall portrait (540/720)
    shootId: 'shoot-02',
    hasArticle: true,
    articleTitle: 'The Architecture of Light',
    articleCategory: 'FEATURE',
    issuePosition: 2,
  },
  {
    id: 'img-003',
    src: '',
    aspectRatio: 2.12, // landscape (720/340)
    shootId: 'shoot-02',
    hasArticle: false,
    issuePosition: 3,
  },
  {
    id: 'img-004',
    src: '',
    aspectRatio: 2.0, // landscape (720/360)
    shootId: 'shoot-02',
    hasArticle: true,
    articleTitle: 'Conversations in Colour',
    articleCategory: 'INTERVIEW',
    issuePosition: 4,
  },
  {
    id: 'img-005',
    src: '',
    aspectRatio: 0.83, // slightly tall (400/480)
    shootId: 'shoot-03',
    hasArticle: false,
    issuePosition: 5,
  },
  {
    id: 'img-006',
    src: '',
    aspectRatio: 0.92, // near-square (440/480)
    shootId: 'shoot-03',
    hasArticle: false,
    issuePosition: 6,
  },
  {
    id: 'img-007',
    src: '',
    aspectRatio: 0.83,
    shootId: 'shoot-03',
    hasArticle: false,
    issuePosition: 7,
  },
  {
    id: 'img-008',
    src: '',
    aspectRatio: 2.91, // full-width landscape (1280/440)
    shootId: 'shoot-04',
    hasArticle: true,
    articleTitle: 'On Stillness & Motion — A Visual Meditation',
    articleCategory: 'ESSAY',
    issuePosition: 8,
  },
  {
    id: 'img-009',
    src: '',
    aspectRatio: 2.05, // wide (820/400)
    shootId: 'shoot-04',
    hasArticle: false,
    issuePosition: 9,
  },
  {
    id: 'img-010',
    src: '',
    aspectRatio: 0.69, // tall portrait (440/640)
    shootId: 'shoot-04',
    hasArticle: false,
    issuePosition: 10,
  },
  {
    id: 'img-011',
    src: '',
    aspectRatio: 1.82, // small landscape (400/220)
    shootId: 'shoot-04',
    hasArticle: false,
    issuePosition: 11,
  },
  {
    id: 'img-012',
    src: '',
    aspectRatio: 1.82,
    shootId: 'shoot-05',
    hasArticle: true,
    articleTitle: 'Quiet Revolutions',
    articleCategory: 'PROFILE',
    issuePosition: 12,
  },
  {
    id: 'img-013',
    src: '',
    aspectRatio: 1.78, // landscape (640/360)
    shootId: 'shoot-05',
    hasArticle: false,
    issuePosition: 13,
  },
  {
    id: 'img-014',
    src: '',
    aspectRatio: 1.72, // landscape (620/360)
    shootId: 'shoot-05',
    hasArticle: false,
    issuePosition: 14,
  },
  {
    id: 'img-015',
    src: '',
    aspectRatio: 3.76, // full-width closing (1280/340)
    shootId: 'shoot-05',
    hasArticle: false,
    issuePosition: 15,
  },
];

// ============================================================
// Shoot with Article — mock data
// ============================================================

export const mockShootArticle: ShootWithArticleData = {
  shootId: 'shoot-02',
  title: 'The Stillness Between Frames',
  photographer: 'Marcus Lehmann',
  issueLabel: 'Spring 2026',
  heroImage: '',
  images: [
    { src: '', aspectRatio: 0.75 },
    { src: '', aspectRatio: 1.32 },
    { src: '', aspectRatio: 0.75 },
    { src: '', aspectRatio: 1.5 },
    { src: '', aspectRatio: 1.0 },
    { src: '', aspectRatio: 0.67 },
  ],
  article: {
    title: 'The Stillness Between Frames',
    subtitle: undefined,
    author: 'Alexandra Chen',
    sections: [
      'There is a moment, imperceptible to most, that exists between the shutter\'s open and close. It is not the photograph itself but the intention preceding it — the held breath, the steadied hand, the eye\'s quiet negotiation with light. Marcus Lehmann has built a career from these liminal instants, finding in them a grammar of stillness that speaks louder than movement ever could.',
      'His latest body of work, presented here for the first time, extends this inquiry into the built environment. Where his earlier photographs trained themselves on the human figure — dancers arrested mid-leap, hands reaching for objects just out of frame — these images turn their gaze outward, toward the structures we inhabit and the shadows they cast.',
      'The hallway of an abandoned hotel in Lisbon. A stairwell in a Brutalist housing block in Marseille, its concrete ribs catching the late-afternoon sun at an angle that transforms utility into geometry. A kitchen window in rural Japan, half-open, its curtain frozen in a gust that must have passed hours ago. Each image insists on presence — not the presence of a person, but of the space itself as a kind of body.',
      '"I stopped photographing people three years ago," Lehmann tells me when we meet at his studio in Berlin-Kreuzberg. "Not because I lost interest, but because I realized the spaces they left behind were more honest. A room after someone has left it still holds the shape of their attention."',
      'This philosophy animates every frame in the series. The compositions are rigorous but never cold; Lehmann\'s palette of muted grays, pale blues, and the occasional shock of warm ochre gives each image the quality of a remembered place rather than a documented one. You feel you have been here before — or perhaps that you will be, someday, when the light falls just so.',
      'What distinguishes this work from the current vogue for "empty space" photography — those clinical, de-peopled interiors that populate design magazines — is its insistence on texture. Lehmann shoots exclusively on medium-format film, a deliberate anachronism that lends his images a grain and depth that digital capture cannot replicate. Walls have pores. Floors remember footsteps. Glass holds the ghost of every face that has looked through it.',
    ],
  },
};

// ============================================================
// Shoot Concept (no article) — mock data
// ============================================================

export const mockShootConcept: ShootConceptData = {
  shootId: 'shoot-03',
  title: 'Landscapes in Winter Light',
  photographer: 'Marcus Lehmann',
  issueLabel: 'Spring 2026',
  imageCount: 14,
  heroImage: '',
  images: [
    { src: '', aspectRatio: 0.75 },
    { src: '', aspectRatio: 1.32 },
    { src: '', aspectRatio: 2.67 },
    { src: '', aspectRatio: 2.58 },
    { src: '', aspectRatio: 2.58 },
    { src: '', aspectRatio: 0.75 },
    { src: '', aspectRatio: 1.5 },
    { src: '', aspectRatio: 2.67 },
    { src: '', aspectRatio: 1.0 },
    { src: '', aspectRatio: 1.0 },
    { src: '', aspectRatio: 0.67 },
    { src: '', aspectRatio: 1.8 },
    { src: '', aspectRatio: 2.5 },
  ],
};
