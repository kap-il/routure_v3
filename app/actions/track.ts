'use server';

import { createServerClient } from '@/lib/supabase/client';

type ViewKind = 'article' | 'shoot';

export async function trackView(kind: ViewKind, slug: string): Promise<void> {
  if (kind !== 'article' && kind !== 'shoot') return;
  if (typeof slug !== 'string' || slug.length === 0 || slug.length > 200) return;

  try {
    const supabase = createServerClient();
    await supabase.from('page_views').insert({ kind, slug });
  } catch (e) {
    console.error('[trackView] insert failed', e);
  }
}
