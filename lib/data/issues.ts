import { Issue } from '@/types/issue';

export const issues: Issue[] = [
  {
    slug: 'winter-2026',
    title: 'The Art of Quiet Luxury',
    subtitle: 'Understated Elegance',
    issueNumber: 1,
    season: 'Winter',
    year: 2026,
    coverImage: '/images/issues/winter-2026/cover.jpg',
    description: 'Exploring the new era of understated elegance, where craftsmanship speaks louder than logos and timelessness trumps trends.',
    featuredArticles: [
      'The Rise of Digital Minimalism',
      'Timeless Wardrobe Essentials',
      'The Architecture of Calm',
    ],
    pageCount: 48,
    publishedAt: '2026-01-01',
  },
  {
    slug: 'fall-2025',
    title: 'Eternal Autumn',
    subtitle: 'Embracing Change',
    issueNumber: 0,
    season: 'Fall',
    year: 2025,
    coverImage: '/images/issues/fall-2025/cover.jpg',
    description: 'A meditation on transition, impermanence, and finding beauty in the spaces between seasons.',
    featuredArticles: [
      'The Philosophy of Wabi-Sabi',
      'Architects of Solitude',
      'The Last Craftsmen',
    ],
    pageCount: 52,
    publishedAt: '2025-09-01',
  },
  {
    slug: 'summer-2025',
    title: 'Light & Shadow',
    subtitle: 'Contrasts in Design',
    issueNumber: -1,
    season: 'Summer',
    year: 2025,
    coverImage: '/images/issues/summer-2025/cover.jpg',
    description: 'Examining the interplay of opposites in contemporary design, art, and lifestyle.',
    featuredArticles: [
      'Monochrome Living',
      'The New Brutalism',
      'Negative Space',
    ],
    pageCount: 44,
    publishedAt: '2025-06-01',
  },
  {
    slug: 'spring-2025',
    title: 'New Beginnings',
    subtitle: 'Fresh Perspectives',
    issueNumber: -2,
    season: 'Spring',
    year: 2025,
    coverImage: '/images/issues/spring-2025/cover.jpg',
    description: 'Celebrating renewal, emerging voices, and the courage to start anew.',
    featuredArticles: [
      'Emerging Designers to Watch',
      'The Art of Starting Over',
      'Sustainable Futures',
    ],
    pageCount: 40,
    publishedAt: '2025-03-01',
  },
];

export function getIssueBySlug(slug: string): Issue | undefined {
  return issues.find((issue) => issue.slug === slug);
}

export function getCurrentIssue(): Issue {
  return issues[0];
}

export function getArchiveIssues(): Issue[] {
  return issues.slice(1);
}
