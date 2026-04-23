-- Page view log — powers "This Week in Reading" on the home page.
-- Inserts happen from a server action using the SECRET key, so RLS policies
-- below are conservative (no anon SELECT/INSERT) and only exist to keep the
-- table locked down if future code ever uses a less-privileged key.

CREATE TABLE IF NOT EXISTS page_views (
  id bigserial PRIMARY KEY,
  kind text NOT NULL CHECK (kind IN ('article', 'shoot')),
  slug text NOT NULL,
  viewed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS page_views_kind_slug_viewed_at_idx
  ON page_views (kind, slug, viewed_at DESC);

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- No anon policies: only the server (secret key) can read or write.
-- Add a policy here later if you need client-side reads for a dashboard.
