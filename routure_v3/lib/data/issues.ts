import { Issue, Article, Category } from '@/types/issue';

export const issues: Issue[] = [
  {
    slug: 'winter-2026',
    title: 'The Art of Quiet Luxury',
    subtitle: 'Understated Elegance',
    issueNumber: 1,
    season: 'Winter',
    year: 2026,
    coverImage: '/images/issues/winter-2026/cover.jpg',
    spreadImage: '/images/issues/winter-2026/spread.jpg',
    description: 'Exploring the new era of understated elegance, where craftsmanship speaks louder than logos and timelessness trumps trends.',
    featuredArticles: [
      'The Rise of Digital Minimalism',
      'Timeless Wardrobe Essentials',
      'The Architecture of Calm',
    ],
    pageCount: 48,
    publishedAt: '2026-01-01',
    articles: [
      {
        slug: 'rise-of-digital-minimalism',
        title: 'The Rise of Digital Minimalism',
        summary: 'How a new generation is finding peace by disconnecting from the constant noise of the digital age.',
        category: 'Culture',
        coverImage: '/images/issues/winter-2026/articles/digital-minimalism.jpg',
        content: [
          { type: 'text', content: 'In an age of infinite scrolling and constant notifications, a growing movement is choosing to step back. Digital minimalism isn\'t about rejecting technology—it\'s about being intentional with how we use it. The pioneers of this movement are finding that less screen time leads to richer experiences in the physical world.' },
          { type: 'image', content: '/images/issues/winter-2026/articles/digital-minimalism-2.jpg' },
          { type: 'text', content: 'The concept, popularized by Cal Newport, has evolved beyond simple screen-time reduction. Today\'s digital minimalists are curating their digital lives with the same care they bring to their physical spaces. They\'re choosing quality over quantity, depth over breadth, and presence over productivity.' },
          { type: 'image', content: '/images/issues/winter-2026/articles/digital-minimalism-3.jpg' },
          { type: 'text', content: 'What emerges from this practice is a renewed sense of attention—the ability to sit with a single thought, to read a book without reaching for a phone, to have a conversation without the pull of a notification. In the age of distraction, focus has become the ultimate luxury.' },
        ],
      },
      {
        slug: 'timeless-wardrobe-essentials',
        title: 'Timeless Wardrobe Essentials',
        summary: 'Building a collection that transcends seasons and trends, focusing on craftsmanship and enduring style.',
        category: 'Style',
        coverImage: '/images/issues/winter-2026/articles/wardrobe.jpg',
        content: [
          { type: 'text', content: 'The notion of a capsule wardrobe has matured beyond its minimalist origins. Today, it represents a philosophy of intentional dressing—choosing pieces that work harder, last longer, and tell a story of considered taste rather than trend-chasing.' },
          { type: 'image', content: '/images/issues/winter-2026/articles/wardrobe-2.jpg' },
          { type: 'text', content: 'From the perfectly tailored navy blazer to the white cotton shirt that improves with each wash, these are the garments that form the backbone of an enduring personal style. They are investments in quality, not expenses in fashion.' },
        ],
      },
      {
        slug: 'architecture-of-calm',
        title: 'The Architecture of Calm',
        summary: 'Exploring spaces designed for contemplation, where design serves silence and materials speak in whispers.',
        category: 'Design',
        coverImage: '/images/issues/winter-2026/articles/architecture.jpg',
        content: [
          { type: 'text', content: 'In the pursuit of calm, architects are rediscovering the power of restraint. The most compelling spaces being built today aren\'t defined by their grand gestures, but by their quiet presence—rooms where light moves slowly across bare walls, where materials age with grace.' },
          { type: 'image', content: '/images/issues/winter-2026/articles/architecture-2.jpg' },
          { type: 'text', content: 'Japanese architect Tadao Ando once said that architecture should be a backdrop for life. These spaces embrace that philosophy, creating environments where the inhabitant becomes the focus, not the structure itself.' },
          { type: 'image', content: '/images/issues/winter-2026/articles/architecture-3.jpg' },
          { type: 'text', content: 'From concrete meditation halls to timber-framed retreats nestled in forests, the architecture of calm invites us to slow down, to breathe, to simply be present in the spaces we inhabit.' },
        ],
      },
    ],
    shoots: [
      {
        slug: 'quiet-luxury-editorial',
        title: 'Quiet Luxury',
        coverImage: '/images/issues/winter-2026/shoots/quiet-luxury-1.jpg',
        images: [
          '/images/issues/winter-2026/shoots/quiet-luxury-1.jpg',
          '/images/issues/winter-2026/shoots/quiet-luxury-2.jpg',
          '/images/issues/winter-2026/shoots/quiet-luxury-3.jpg',
          '/images/issues/winter-2026/shoots/quiet-luxury-4.jpg',
          '/images/issues/winter-2026/shoots/quiet-luxury-5.jpg',
        ],
      },
      {
        slug: 'winter-light',
        title: 'Winter Light',
        coverImage: '/images/issues/winter-2026/shoots/winter-light-1.jpg',
        images: [
          '/images/issues/winter-2026/shoots/winter-light-1.jpg',
          '/images/issues/winter-2026/shoots/winter-light-2.jpg',
          '/images/issues/winter-2026/shoots/winter-light-3.jpg',
          '/images/issues/winter-2026/shoots/winter-light-4.jpg',
        ],
      },
    ],
  },
  {
    slug: 'fall-2025',
    title: 'Eternal Autumn',
    subtitle: 'Embracing Change',
    issueNumber: 0,
    season: 'Fall',
    year: 2025,
    coverImage: '/images/issues/fall-2025/cover.jpg',
    spreadImage: '/images/issues/fall-2025/spread.jpg',
    description: 'A meditation on transition, impermanence, and finding beauty in the spaces between seasons.',
    featuredArticles: [
      'The Philosophy of Wabi-Sabi',
      'Architects of Solitude',
      'The Last Craftsmen',
    ],
    pageCount: 52,
    publishedAt: '2025-09-01',
    articles: [
      {
        slug: 'philosophy-of-wabi-sabi',
        title: 'The Philosophy of Wabi-Sabi',
        summary: 'Finding beauty in imperfection and impermanence, a Japanese aesthetic that resonates now more than ever.',
        category: 'Culture',
        coverImage: '/images/issues/fall-2025/articles/wabi-sabi.jpg',
        content: [
          { type: 'text', content: 'Wabi-sabi is the Japanese art of finding beauty in imperfection. It celebrates the cracks in pottery, the patina on copper, the weathering of stone. In a world obsessed with the pristine and the new, wabi-sabi offers a counter-narrative of acceptance and appreciation.' },
          { type: 'image', content: '/images/issues/fall-2025/articles/wabi-sabi-2.jpg' },
          { type: 'text', content: 'This ancient philosophy has found new relevance in our modern age, where the pursuit of perfection often leads to exhaustion. Wabi-sabi teaches us that there is profound beauty in things that are incomplete, impermanent, and imperfect.' },
        ],
      },
      {
        slug: 'architects-of-solitude',
        title: 'Architects of Solitude',
        summary: 'The designers creating spaces for contemplation in an increasingly connected world.',
        category: 'Design',
        coverImage: '/images/issues/fall-2025/articles/solitude.jpg',
        content: [
          { type: 'text', content: 'In an era of constant connectivity, a new breed of architects is designing spaces specifically for solitude. These aren\'t mere rooms—they\'re sanctuaries designed to facilitate deep thinking, creative work, and genuine rest.' },
          { type: 'image', content: '/images/issues/fall-2025/articles/solitude-2.jpg' },
          { type: 'text', content: 'From Peter Zumthor\'s thermal baths to the meditation cells of monasteries, the architecture of solitude has a long and rich history. Today\'s practitioners are adapting these principles for modern life.' },
        ],
      },
      {
        slug: 'the-last-craftsmen',
        title: 'The Last Craftsmen',
        summary: 'Preserving ancient trades and techniques in the age of mass production.',
        category: 'Lifestyle',
        coverImage: '/images/issues/fall-2025/articles/craftsmen.jpg',
        content: [
          { type: 'text', content: 'In workshops scattered across the globe, a handful of artisans maintain traditions that stretch back centuries. These are the last craftsmen—weavers, potters, blacksmiths—whose skills represent a living link to our collective past.' },
          { type: 'image', content: '/images/issues/fall-2025/articles/craftsmen-2.jpg' },
          { type: 'text', content: 'Their work is more than production; it\'s preservation. Each piece they create carries within it the accumulated knowledge of generations, a testament to the human capacity for patience and devotion to craft.' },
        ],
      },
    ],
    shoots: [
      {
        slug: 'autumn-palette',
        title: 'Autumn Palette',
        coverImage: '/images/issues/fall-2025/shoots/autumn-palette-1.jpg',
        images: [
          '/images/issues/fall-2025/shoots/autumn-palette-1.jpg',
          '/images/issues/fall-2025/shoots/autumn-palette-2.jpg',
          '/images/issues/fall-2025/shoots/autumn-palette-3.jpg',
          '/images/issues/fall-2025/shoots/autumn-palette-4.jpg',
        ],
      },
    ],
  },
  {
    slug: 'summer-2025',
    title: 'Light & Shadow',
    subtitle: 'Contrasts in Design',
    issueNumber: -1,
    season: 'Summer',
    year: 2025,
    coverImage: '/images/issues/summer-2025/cover.jpg',
    spreadImage: '/images/issues/summer-2025/spread.jpg',
    description: 'Examining the interplay of opposites in contemporary design, art, and lifestyle.',
    featuredArticles: [
      'Monochrome Living',
      'The New Brutalism',
      'Negative Space',
    ],
    pageCount: 44,
    publishedAt: '2025-06-01',
    articles: [
      {
        slug: 'monochrome-living',
        title: 'Monochrome Living',
        summary: 'The power and elegance of a life lived in black and white.',
        category: 'Style',
        coverImage: '/images/issues/summer-2025/articles/monochrome.jpg',
        content: [
          { type: 'text', content: 'There is a certain discipline to monochrome living—a commitment to restraint that paradoxically opens up a world of subtlety. When color is removed, texture, form, and light become the primary vocabulary.' },
          { type: 'image', content: '/images/issues/summer-2025/articles/monochrome-2.jpg' },
          { type: 'text', content: 'From the wardrobe to the home, monochrome isn\'t about absence—it\'s about intention. It\'s the understanding that sometimes the most powerful statement is the quietest one.' },
        ],
      },
    ],
    shoots: [
      {
        slug: 'light-and-shadow-editorial',
        title: 'Light & Shadow',
        coverImage: '/images/issues/summer-2025/shoots/light-shadow-1.jpg',
        images: [
          '/images/issues/summer-2025/shoots/light-shadow-1.jpg',
          '/images/issues/summer-2025/shoots/light-shadow-2.jpg',
          '/images/issues/summer-2025/shoots/light-shadow-3.jpg',
        ],
      },
    ],
  },
  {
    slug: 'spring-2025',
    title: 'New Beginnings',
    subtitle: 'Fresh Perspectives',
    issueNumber: -2,
    season: 'Spring',
    year: 2025,
    coverImage: '/images/issues/spring-2025/cover.jpg',
    spreadImage: '/images/issues/spring-2025/spread.jpg',
    description: 'Celebrating renewal, emerging voices, and the courage to start anew.',
    featuredArticles: [
      'Emerging Designers to Watch',
      'The Art of Starting Over',
      'Sustainable Futures',
    ],
    pageCount: 40,
    publishedAt: '2025-03-01',
    articles: [
      {
        slug: 'emerging-designers',
        title: 'Emerging Designers to Watch',
        summary: 'The next generation of creatives redefining what design means.',
        category: 'Design',
        coverImage: '/images/issues/spring-2025/articles/emerging.jpg',
        content: [
          { type: 'text', content: 'A new wave of designers is emerging—ones who see sustainability not as a constraint but as a catalyst for innovation. They\'re rethinking materials, processes, and the very purpose of design.' },
          { type: 'image', content: '/images/issues/spring-2025/articles/emerging-2.jpg' },
          { type: 'text', content: 'From bio-fabricated textiles to computational architecture, these young creatives are proof that the future of design lies at the intersection of tradition and technology.' },
        ],
      },
    ],
    shoots: [
      {
        slug: 'bloom',
        title: 'Bloom',
        coverImage: '/images/issues/spring-2025/shoots/bloom-1.jpg',
        images: [
          '/images/issues/spring-2025/shoots/bloom-1.jpg',
          '/images/issues/spring-2025/shoots/bloom-2.jpg',
          '/images/issues/spring-2025/shoots/bloom-3.jpg',
        ],
      },
    ],
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

export function getArticleBySlug(issueSlug: string, articleSlug: string): { issue: Issue; article: Article } | undefined {
  const issue = getIssueBySlug(issueSlug);
  if (!issue) return undefined;
  const article = issue.articles.find((a) => a.slug === articleSlug);
  if (!article) return undefined;
  return { issue, article };
}

export function getShootBySlug(issueSlug: string, shootSlug: string) {
  const issue = getIssueBySlug(issueSlug);
  if (!issue) return undefined;
  const shoot = issue.shoots.find((s) => s.slug === shootSlug);
  if (!shoot) return undefined;
  return { issue, shoot };
}

export function getAllCategories(): Category[] {
  const categoryMap = new Map<string, Category>();

  for (const issue of issues) {
    for (const article of issue.articles) {
      if (!categoryMap.has(article.category)) {
        categoryMap.set(article.category, { name: article.category, articles: [] });
      }
      categoryMap.get(article.category)!.articles.push({
        title: article.title,
        slug: article.slug,
        issueSlug: issue.slug,
      });
    }
  }

  return Array.from(categoryMap.values());
}

export function getFeaturedArticle(): { issue: Issue; article: Article } | undefined {
  const currentIssue = getCurrentIssue();
  if (currentIssue.articles.length > 0) {
    return { issue: currentIssue, article: currentIssue.articles[0] };
  }
  return undefined;
}
