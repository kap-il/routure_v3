// Plan-C issue data (mirrors the mockup's data.jsx).
// Hardcoded here so the continuous-scroll preview is self-contained and
// doesn't wait on Supabase for a "wtf does this look like" render.

export type Shoot = {
  slug: string;
  title: string;
  section_type: 'shoot' | 'editorial';
  aspect: 'portrait' | 'landscape';
  palette: string;
  credits: Record<string, string>;
};

export type Letter = {
  slug: 'letter';
  title: string;
  author: string;
  paragraphs: string[];
  footnotes: string[];
};

export type Pullquote = {
  slug: 'pullquote-1';
  title: string;
  author: string;
  pullquote: string;
};

export const ROUTURE_DATA = {
  issue: {
    issue_number: '02',
    title: 'COSMIC',
    slug: 'cosmic',
    publish_date: '2026-04-23',
    description: 'On orbit, gravity, and the clothes that prove we are here.',
  },
  shoots: [
    { slug: 'event-horizon', title: 'Event Horizon', section_type: 'shoot', aspect: 'portrait', palette: 'p-night',
      credits: { photographer: 'Ines Maréchal', stylist: 'Kobe Adeyemi', model: 'Hana Oyelaran', hair: 'Rin Takahashi', makeup: 'Ivo Kestel', set_design: 'Marta Pruss', location: 'Warehouse 9, Red Hook' } },
    { slug: 'soft-gravity', title: 'Soft Gravity', section_type: 'editorial', aspect: 'landscape', palette: 'p-clay',
      credits: { photographer: 'Dmitri Halász', stylist: 'Sadie Ouko', model: 'Eluard Minkah', hair: 'Rin Takahashi', makeup: 'June Park', set_design: '—', location: 'Mojave, CA' } },
    { slug: 'apogee', title: 'Apogee', section_type: 'shoot', aspect: 'portrait', palette: 'p-moss',
      credits: { photographer: 'Tove Lindqvist', stylist: 'Kobe Adeyemi', model: 'Noa Berger', hair: 'Safiya Ouedraogo', makeup: 'Ivo Kestel', set_design: 'Lu Weifang', location: 'Stockholm' } },
    { slug: 'low-earth-orbit', title: 'Low Earth Orbit', section_type: 'shoot', aspect: 'portrait', palette: 'p-pool',
      credits: { photographer: 'Zaki Mansur', stylist: 'Farah Djenai', model: 'Ayo Komolafe', hair: 'Rin Takahashi', makeup: 'June Park', set_design: '—', location: 'Kennedy annex' } },
    { slug: 'dark-matter', title: 'Dark Matter', section_type: 'shoot', aspect: 'landscape', palette: 'p-plum',
      credits: { photographer: 'Ines Maréchal', stylist: 'Odile Vasseur', model: 'Jun Tanaka', hair: 'Safiya Ouedraogo', makeup: 'Ivo Kestel', set_design: 'Marta Pruss', location: 'Anechoic Chamber, Building 4' } },
    { slug: 'retrograde', title: 'Retrograde', section_type: 'shoot', aspect: 'portrait', palette: 'p-ember',
      credits: { photographer: 'Dmitri Halász', stylist: 'Kobe Adeyemi', model: 'Sena Araya', hair: 'Rin Takahashi', makeup: 'June Park', set_design: '—', location: 'Queens, 3AM' } },
    { slug: 'lagrangian', title: 'Lagrangian', section_type: 'editorial', aspect: 'landscape', palette: 'p-bone',
      credits: { photographer: 'Tove Lindqvist', stylist: 'Sadie Ouko', model: 'Noa Berger', hair: '—', makeup: 'Ivo Kestel', set_design: 'Lu Weifang', location: 'Salt flats' } },
    { slug: 'terminator-line', title: 'Terminator Line', section_type: 'shoot', aspect: 'portrait', palette: 'p-ash',
      credits: { photographer: 'Zaki Mansur', stylist: 'Farah Djenai', model: 'Eluard Minkah', hair: 'Safiya Ouedraogo', makeup: 'June Park', set_design: '—', location: 'Rooftop, LES' } },
  ] satisfies Shoot[],
  pullquote: {
    slug: 'pullquote-1',
    title: 'On Wearing a Planet',
    author: 'Léa Aronson',
    pullquote: 'Clothes were never ornament. They are the last evidence that the body refused to be only weather.',
  } satisfies Pullquote,
  letter: {
    slug: 'letter',
    title: 'Letter from the Board',
    author: 'The Editorial Board',
    paragraphs: [
      'We made this issue under a sky we could not trust. In April the river froze for a second time and a colleague of ours walked out onto it, then walked back, then filed her copy. The river did not ask whether she was ready.',
      'COSMIC is not a theme. It is an excuse to photograph the atmosphere around a garment — the private weather that clothes produce when a body stops moving through them and starts carrying them. We asked eight photographers, eleven stylists and an un-countable number of collaborators to treat the outfit as an orbit, not a silhouette.',
      'The result is deliberately uneven. Some shoots were made in one afternoon in the Mojave; one took eleven nights in a closed anechoic chamber off the BQE. We do not believe in a house style. We do believe in a house temperature, and this is the hottest ROUTURE has ever run.',
    ],
    footnotes: [
      '1. The anechoic chamber is soundproof. The models are not.',
      '2. No image in this issue has been color-graded. What you see is what happened.',
      '3. The title COSMIC is borrowed from a matchbook found in the set of SOFT GRAVITY. We asked the owner. She said keep it.',
    ],
  } satisfies Letter,
  categories: [
    { name: 'Architecture', count: 12 },
    { name: 'Sustainability', count: 7 },
    { name: 'Experimentalism', count: 19 },
    { name: 'Commercialism', count: 5 },
    { name: 'Community', count: 14 },
  ],
};

export const CREDITS_TICKER = (() => {
  const set = new Set<string>();
  for (const s of ROUTURE_DATA.shoots) {
    for (const [role, name] of Object.entries(s.credits)) {
      if (name && name !== '—') set.add(`${role.replace(/_/g, ' ').toUpperCase()} — ${name}`);
    }
  }
  return [...set];
})();
