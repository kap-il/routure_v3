#!/usr/bin/env npx tsx

/**
 * Re-uploads all S3 assets for an existing issue with public-read ACL.
 * Usage: npx tsx scripts/reupload-issue.ts --slug cosmic-2026
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { parseArgs } from 'node:util';
import { createServerClient } from '../lib/supabase/client';
import { getFile, uploadFile } from '../lib/s3/client';

const { values } = parseArgs({
  options: {
    slug: { type: 'string' },
  },
});

if (!values.slug) {
  console.error('Usage: npx tsx scripts/reupload-issue.ts --slug <slug>');
  process.exit(1);
}

async function main() {
  const supabase = createServerClient();

  // Get issue
  const { data: issue, error } = await supabase
    .from('issues')
    .select('*')
    .eq('slug', values.slug)
    .single();

  if (error || !issue) {
    console.error('Issue not found:', values.slug);
    process.exit(1);
  }

  console.log(`Re-uploading assets for "${issue.title}" (${issue.page_count} pages)...\n`);

  // Get all pages
  const { data: pages } = await supabase
    .from('issue_pages')
    .select('*')
    .eq('issue_id', issue.id)
    .order('page_number', { ascending: true });

  if (!pages || pages.length === 0) {
    console.error('No pages found');
    process.exit(1);
  }

  // Re-upload each page and thumbnail by downloading and re-putting with ACL
  for (const page of pages) {
    const pageKey = `issues/${values.slug}/pages/${String(page.page_number).padStart(3, '0')}.webp`;
    const thumbKey = `issues/${values.slug}/thumbnails/${String(page.page_number).padStart(3, '0')}.webp`;

    // Re-upload page
    const pageObj = await getFile(pageKey);
    const pageBody = await pageObj.Body!.transformToByteArray();
    await uploadFile(pageKey, Buffer.from(pageBody), 'image/webp');

    // Re-upload thumbnail
    const thumbObj = await getFile(thumbKey);
    const thumbBody = await thumbObj.Body!.transformToByteArray();
    await uploadFile(thumbKey, Buffer.from(thumbBody), 'image/webp');

    console.log(`  Re-uploaded page ${page.page_number}/${pages.length}`);
  }

  // Re-upload cover
  const coverKey = `issues/${values.slug}/cover.webp`;
  const coverObj = await getFile(coverKey);
  const coverBody = await coverObj.Body!.transformToByteArray();
  await uploadFile(coverKey, Buffer.from(coverBody), 'image/webp');
  console.log('  Re-uploaded cover');

  // Re-upload PDF if exists
  try {
    const pdfKey = `issues/${values.slug}/original.pdf`;
    const pdfObj = await getFile(pdfKey);
    const pdfBody = await pdfObj.Body!.transformToByteArray();
    await uploadFile(pdfKey, Buffer.from(pdfBody), 'application/pdf');
    console.log('  Re-uploaded PDF');
  } catch {
    console.log('  No PDF to re-upload');
  }

  console.log('\nDone! All assets re-uploaded with public-read ACL.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
