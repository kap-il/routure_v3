#!/usr/bin/env npx tsx

import { config } from 'dotenv';
config({ path: '.env.local' });

/**
 * Process a magazine PDF into page images, upload to S3, and populate Supabase.
 *
 * Usage:
 *   npx tsx scripts/process-issue.ts \
 *     --pdf ./path/to/magazine.pdf \
 *     --title "Issue Title" \
 *     --slug "issue-title" \
 *     --issue-number 1 \
 *     --publish-date 2026-01-15 \
 *     --description "A brief description" \
 *     --featured
 */

import { parseArgs } from 'node:util';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { fromPath } from 'pdf2pic';
import { uploadFile, getPublicUrl } from '../lib/s3/client';
import { createServerClient } from '../lib/supabase/client';

// --- CLI argument parsing ---

const { values } = parseArgs({
  options: {
    pdf: { type: 'string' },
    title: { type: 'string' },
    slug: { type: 'string' },
    'issue-number': { type: 'string' },
    'publish-date': { type: 'string' },
    description: { type: 'string', default: '' },
    featured: { type: 'boolean', default: false },
    'skip-pdf-upload': { type: 'boolean', default: false },
  },
});

const pdfPath = values.pdf;
const title = values.title;
const slug = values.slug;
const issueNumber = values['issue-number'] ? parseInt(values['issue-number'], 10) : undefined;
const publishDate = values['publish-date'];
const description = values.description || '';
const isFeatured = values.featured ?? false;
const skipPdfUpload = values['skip-pdf-upload'] ?? false;

// Validate required arguments
if (!pdfPath || !title || !slug || issueNumber === undefined || !publishDate) {
  console.error(`
Usage: npx tsx scripts/process-issue.ts \\
  --pdf <path-to-pdf> \\
  --title <title> \\
  --slug <slug> \\
  --issue-number <number> \\
  --publish-date <YYYY-MM-DD> \\
  [--description <text>] \\
  [--featured] \\
  [--skip-pdf-upload]
`);
  process.exit(1);
}

if (!existsSync(pdfPath)) {
  console.error(`Error: PDF file not found at "${pdfPath}"`);
  process.exit(1);
}

// --- Image specs ---

const PAGE_WIDTH = 2400;
const PAGE_QUALITY = 85;
const THUMB_WIDTH = 400;
const THUMB_QUALITY = 75;
const COVER_WIDTH = 800;
const COVER_QUALITY = 85;

// --- Main ---

async function main() {
  console.log(`\nProcessing issue: ${title}`);
  console.log(`  PDF: ${pdfPath}`);
  console.log(`  Slug: ${slug}`);
  console.log(`  Issue #${issueNumber}`);
  console.log(`  Publish date: ${publishDate}`);
  console.log(`  Featured: ${isFeatured}`);
  console.log('');

  // Step 1: Determine page count using pdf2pic
  console.log('Step 1: Analyzing PDF...');

  const absolutePdfPath = path.resolve(pdfPath!);

  // pdf2pic setup — convert at high DPI
  // Height computed from US Letter aspect ratio (8.5 x 11 inches)
  const PAGE_HEIGHT = Math.round(PAGE_WIDTH * (11 / 8.5));
  const converter = fromPath(absolutePdfPath, {
    density: 300,
    saveFilename: 'page',
    savePath: '/tmp/routure-pages',
    format: 'png',
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
  });

  // Convert all pages to get the count
  const bulkResult = await converter.bulk(-1, { responseType: 'buffer' });
  const pageCount = bulkResult.length;
  console.log(`  Found ${pageCount} pages\n`);

  // Step 2: Process and upload each page
  console.log('Step 2: Processing and uploading pages...');

  for (let i = 0; i < pageCount; i++) {
    const pageNum = i + 1;
    const paddedNum = String(pageNum).padStart(3, '0');
    const result = bulkResult[i];

    if (!result.buffer) {
      console.error(`  Warning: No buffer for page ${pageNum}, skipping`);
      continue;
    }

    // Full-res page image
    const pageWebp = await sharp(result.buffer)
      .resize(PAGE_WIDTH, undefined, { withoutEnlargement: true })
      .webp({ quality: PAGE_QUALITY })
      .toBuffer();

    const pageKey = `issues/${slug}/pages/${paddedNum}.webp`;
    await uploadFile(pageKey, pageWebp, 'image/webp');

    // Thumbnail
    const thumbWebp = await sharp(result.buffer)
      .resize(THUMB_WIDTH, undefined, { withoutEnlargement: true })
      .webp({ quality: THUMB_QUALITY })
      .toBuffer();

    const thumbKey = `issues/${slug}/thumbnails/${paddedNum}.webp`;
    await uploadFile(thumbKey, thumbWebp, 'image/webp');

    console.log(`  Uploaded page ${pageNum}/${pageCount}`);
  }

  // Step 3: Generate and upload cover image from page 1
  console.log('\nStep 3: Generating cover image...');

  const firstPage = bulkResult[0];
  if (firstPage.buffer) {
    const coverWebp = await sharp(firstPage.buffer)
      .resize(COVER_WIDTH, undefined, { withoutEnlargement: true })
      .webp({ quality: COVER_QUALITY })
      .toBuffer();

    const coverKey = `issues/${slug}/cover.webp`;
    await uploadFile(coverKey, coverWebp, 'image/webp');
    console.log('  Cover uploaded');
  }

  // Step 4: Optionally upload original PDF
  let pdfUrl: string | null = null;
  if (!skipPdfUpload) {
    console.log('\nStep 4: Uploading original PDF...');
    const pdfBuffer = readFileSync(absolutePdfPath);
    const pdfKey = `issues/${slug}/original.pdf`;
    await uploadFile(pdfKey, pdfBuffer, 'application/pdf');
    pdfUrl = getPublicUrl(pdfKey);
    console.log('  PDF uploaded');
  } else {
    console.log('\nStep 4: Skipping PDF upload (--skip-pdf-upload)');
  }

  // Step 5: Create Supabase records
  console.log('\nStep 5: Creating database records...');

  const supabase = createServerClient();
  const coverImageUrl = getPublicUrl(`issues/${slug}/cover.webp`);

  // Insert issue
  const { data: issueRow, error: issueError } = await supabase
    .from('issues')
    .insert({
      title,
      slug,
      issue_number: issueNumber,
      publish_date: publishDate,
      cover_image_url: coverImageUrl,
      pdf_url: pdfUrl,
      description,
      is_featured: isFeatured,
      page_count: pageCount,
    })
    .select()
    .single();

  if (issueError) {
    console.error('  Error creating issue:', issueError.message);
    process.exit(1);
  }

  console.log(`  Issue created: ${issueRow.id}`);

  // Insert issue pages
  const pageRows = Array.from({ length: pageCount }, (_, i) => {
    const paddedNum = String(i + 1).padStart(3, '0');
    return {
      issue_id: issueRow.id,
      page_number: i + 1,
      image_url: getPublicUrl(`issues/${slug}/pages/${paddedNum}.webp`),
      thumbnail_url: getPublicUrl(`issues/${slug}/thumbnails/${paddedNum}.webp`),
    };
  });

  const { error: pagesError } = await supabase
    .from('issue_pages')
    .insert(pageRows);

  if (pagesError) {
    console.error('  Error creating pages:', pagesError.message);
    process.exit(1);
  }

  console.log(`  ${pageCount} pages created`);

  // Done
  console.log(`\nDone! Issue "${title}" has been processed and uploaded.`);
  console.log(`  View at: /issues/${slug}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
