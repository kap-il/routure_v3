'use client';

import { useEffect } from 'react';
import { trackView } from '@/app/actions/track';

type Kind = 'article' | 'shoot';

export default function TrackView({ kind, slug }: { kind: Kind; slug: string }) {
  useEffect(() => {
    if (!slug) return;
    const key = `tv:${kind}:${slug}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
    } catch {
      // sessionStorage unavailable (private mode / blocked cookies) — fall
      // through and record the view anyway; worst case is a small overcount.
    }
    void trackView(kind, slug);
  }, [kind, slug]);

  return null;
}
