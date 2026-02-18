#!/usr/bin/env npx tsx

/**
 * Deletes an issue's Supabase records and S3 assets.
 * Usage: npx tsx scripts/delete-issue.ts --slug cosmic-2026
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { parseArgs } from 'node:util';
import { createServerClient } from '../lib/supabase/client';
import { listFiles, deleteFile } from '../lib/s3/client';

const { values } = parseArgs({
  options: {
    slug: { type: 'string' },
    'keep-s3': { type: 'boolean', default: false },
  },
});

if (!values.slug) {
  console.error('Usage: npx tsx scripts/delete-issue.ts --slug <slug> [--keep-s3]');
  process.exit(1);
}

async function main() {
  const supabase = createServerClient();
  const slug = values.slug!;

  // Delete Supabase records (cascade deletes issue_pages)
  console.log(`Deleting Supabase records for "${slug}"...`);
  const { error } = await supabase.from('issues').delete().eq('slug', slug);
  if (error) {
    console.error('  Error:', error.message);
  } else {
    console.log('  Done');
  }

  // Delete S3 assets
  if (!values['keep-s3']) {
    console.log(`Deleting S3 assets for "${slug}"...`);
    const prefix = `issues/${slug}/`;
    const result = await listFiles(prefix);
    const objects = result.Contents ?? [];

    for (const obj of objects) {
      if (obj.Key) {
        await deleteFile(obj.Key);
      }
    }
    console.log(`  Deleted ${objects.length} objects`);
  }

  console.log('Done.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
