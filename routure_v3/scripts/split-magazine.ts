#!/usr/bin/env npx tsx

/**
 * Split a magazine PDF of two-page spreads into individual page images.
 *
 * Each PDF page is a two-page spread. This script detects whether a spread
 * contains one continuous spanning image or two distinct pages:
 *   - Spanning image  → saved as a single wide image
 *   - Two distinct pages → split at center, saved as two separate images
 *
 * Detection works by comparing the pixel-difference strength at the vertical
 * center seam against the baseline difference elsewhere in the image. A high
 * ratio means there is a clear visual break at the center → two distinct pages.
 *
 * Usage:
 *   npx tsx scripts/split-magazine.ts \
 *     --pdf ./Magazines/FINAL-Routure-COSMIC2026.pdf \
 *     [--output Split_Check] \
 *     [--threshold 1.8]
 */

import { parseArgs } from 'node:util';
import { existsSync, mkdirSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import sharp from 'sharp';
import { fromPath } from 'pdf2pic';

const execFileAsync = promisify(execFile);

// --- CLI args ---

const { values } = parseArgs({
  options: {
    pdf: { type: 'string' },
    output: { type: 'string', default: 'Split_Check' },
    threshold: { type: 'string', default: '1.5' },
    'only-covers': { type: 'boolean', default: false },
  },
});

const pdfPath = values.pdf;
const outputDir = values.output || 'Split_Check';
const RATIO_THRESHOLD = parseFloat(values.threshold || '1.5');
const onlyCovers = values['only-covers'] ?? false;

if (!pdfPath) {
  console.error(
    'Usage: npx tsx scripts/split-magazine.ts --pdf <path> [--output <dir>] [--threshold <ratio>]'
  );
  process.exit(1);
}

if (!existsSync(pdfPath)) {
  console.error(`PDF not found: ${pdfPath}`);
  process.exit(1);
}

// --- Config ---

const RENDER_WIDTH = 4800;
const RENDER_HEIGHT = 3200;
const OUTPUT_QUALITY = 90;

// --- Seam analysis ---

/**
 * Compute the average pixel difference at a given x-position for a specific gap
 * width, sampling every `step` rows. Returns the mean color distance.
 */
function seamScoreAtX(
  data: Buffer,
  width: number,
  height: number,
  channels: number,
  x: number,
  gap: number,
  step: number
): number {
  let total = 0;
  let count = 0;
  const left = Math.max(0, x - gap);
  const right = Math.min(width - 1, x + gap);

  for (let y = 0; y < height; y += step) {
    const lIdx = (y * width + left) * channels;
    const rIdx = (y * width + right) * channels;
    const dr = Math.abs(data[lIdx] - data[rIdx]);
    const dg = Math.abs(data[lIdx + 1] - data[rIdx + 1]);
    const db = Math.abs(data[lIdx + 2] - data[rIdx + 2]);
    total += (dr + dg + db) / 3;
    count++;
  }

  return count > 0 ? total / count : 0;
}

/**
 * Analyze a rendered spread to detect if it has two distinct pages or one
 * continuous image spanning both sides.
 *
 * Uses a multi-scale approach: checks pixel differences across the center
 * seam at multiple gap widths (tight → wide) to handle both hard pixel
 * edges and wide gutters. Compares each against a baseline measured at the
 * quarter and three-quarter positions. If ANY scale shows a ratio above the
 * threshold, the spread is classified as two distinct pages.
 */
async function analyzeSpread(buffer: Buffer) {
  const { data, info } = await sharp(buffer).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const centerX = Math.floor(width / 2);
  const sampleStep = 3;

  const quarterX = Math.floor(width * 0.25);
  const threeQuarterX = Math.floor(width * 0.75);

  // Multiple gap sizes: tight seams → medium → wide gutters
  const gaps = [2, 8, 40, 120, 250];

  let bestRatio = 0;
  let bestGap = 0;
  let bestCenter = 0;
  let bestBaseline = 0;
  const gapDetails: string[] = [];

  for (const gap of gaps) {
    // Ensure baseline positions don't go out of bounds
    if (quarterX - gap < 0 || threeQuarterX + gap >= width) continue;

    const centerScore = seamScoreAtX(data, width, height, channels, centerX, gap, sampleStep);
    const qScore = seamScoreAtX(data, width, height, channels, quarterX, gap, sampleStep);
    const tqScore = seamScoreAtX(data, width, height, channels, threeQuarterX, gap, sampleStep);
    const baselineScore = (qScore + tqScore) / 2;

    const ratio = baselineScore > 0.5 ? centerScore / baselineScore : (centerScore > 1 ? centerScore : 0);

    gapDetails.push(`g${gap}=${ratio.toFixed(2)}`);

    if (ratio > bestRatio) {
      bestRatio = ratio;
      bestGap = gap;
      bestCenter = centerScore;
      bestBaseline = baselineScore;
    }
  }

  return {
    isTwoPages: bestRatio >= RATIO_THRESHOLD,
    centerScore: bestCenter,
    baselineScore: bestBaseline,
    ratio: bestRatio,
    bestGap,
    gapDetails: gapDetails.join(' '),
  };
}

// --- Main ---

async function main() {
  const absolutePdfPath = path.resolve(pdfPath!);
  const absoluteOutputDir = path.resolve(outputDir);

  mkdirSync(absoluteOutputDir, { recursive: true });

  console.log(`PDF:       ${pdfPath}`);
  console.log(`Output:    ${absoluteOutputDir}`);
  console.log(`Threshold: ${RATIO_THRESHOLD}`);
  console.log('');

  // Get page count with a quick low-res pass
  console.log('Counting pages...');
  const countConverter = fromPath(absolutePdfPath, {
    density: 72,
    saveFilename: 'count',
    savePath: '/tmp/routure-count',
    format: 'png',
  });
  const countResult = await countConverter.bulk(-1, { responseType: 'buffer' });
  const totalPdfPages = countResult.length;
  console.log(`Found ${totalPdfPages} PDF spreads\n`);

  // High-res converter for two-page spreads
  const converter = fromPath(absolutePdfPath, {
    density: 300,
    saveFilename: 'spread',
    savePath: '/tmp/routure-splits',
    format: 'png',
    width: RENDER_WIDTH,
    height: RENDER_HEIGHT,
  });

  // Cover renderer: bypass pdf2pic and call ghostscript directly so the PDF
  // page is rendered at its native aspect ratio (no forced canvas stretching).
  const renderCoverPage = async (pageNum: number): Promise<Buffer> => {
    const tmpFile = `/tmp/routure-cover-p${pageNum}.png`;
    await execFileAsync('gs', [
      '-dNOPAUSE', '-dBATCH', '-dSAFER',
      '-sDEVICE=png16m',
      '-r300',
      `-dFirstPage=${pageNum}`,
      `-dLastPage=${pageNum}`,
      `-sOutputFile=${tmpFile}`,
      absolutePdfPath,
    ]);
    const buf = await sharp(tmpFile).toBuffer();
    return buf;
  };

  let outputPageNum = 1;
  const summary: Array<{
    pdfPage: number;
    action: string;
    outputPages: string[];
    ratio: number;
    bestGap: number;
    gapDetails: string;
  }> = [];

  for (let i = 1; i <= totalPdfPages; i++) {
    // First and last PDF pages are always single-page covers — skip seam analysis
    const isCoverPage = i === 1 || i === totalPdfPages;

    if (onlyCovers && !isCoverPage) continue;
    process.stdout.write(`  PDF page ${String(i).padStart(2)}/${totalPdfPages} ... `);

    let imgBuffer: Buffer;
    if (isCoverPage) {
      imgBuffer = await renderCoverPage(i);
    } else {
      const result = await converter(i, { responseType: 'buffer' });
      if (!result.buffer) {
        console.log('NO BUFFER — skipped');
        continue;
      }
      imgBuffer = result.buffer;
    }

    const meta = await sharp(imgBuffer).metadata();
    const analysis = isCoverPage ? null : await analyzeSpread(imgBuffer);

    if (!isCoverPage && analysis!.isTwoPages) {
      // Split into left and right pages
      const halfWidth = Math.floor(meta.width! / 2);

      const leftFile = `${String(outputPageNum).padStart(3, '0')}.webp`;
      await sharp(imgBuffer)
        .extract({ left: 0, top: 0, width: halfWidth, height: meta.height! })
        .webp({ quality: OUTPUT_QUALITY })
        .toFile(path.join(absoluteOutputDir, leftFile));
      outputPageNum++;

      const rightFile = `${String(outputPageNum).padStart(3, '0')}.webp`;
      await sharp(imgBuffer)
        .extract({ left: halfWidth, top: 0, width: meta.width! - halfWidth, height: meta.height! })
        .webp({ quality: OUTPUT_QUALITY })
        .toFile(path.join(absoluteOutputDir, rightFile));
      outputPageNum++;

      console.log(
        `SPLIT → ${leftFile}, ${rightFile}` +
          `  (best: ${analysis!.ratio.toFixed(2)} @gap${analysis!.bestGap})  [${analysis!.gapDetails}]`
      );
      summary.push({
        pdfPage: i,
        action: 'SPLIT',
        outputPages: [leftFile, rightFile],
        ratio: analysis!.ratio,
        bestGap: analysis!.bestGap,
        gapDetails: analysis!.gapDetails,
      });
    } else {
      // Single page (cover/back cover) or wide spanning image
      const action = isCoverPage ? 'COVER' : 'WIDE';
      const singleFile = `${String(outputPageNum).padStart(3, '0')}.webp`;
      await sharp(imgBuffer)
        .webp({ quality: OUTPUT_QUALITY })
        .toFile(path.join(absoluteOutputDir, singleFile));
      outputPageNum++;

      if (isCoverPage) {
        console.log(`COVER → ${singleFile}  (single page — no analysis)`);
      } else {
        console.log(
          `WIDE  → ${singleFile}` +
            `  (best: ${analysis!.ratio.toFixed(2)} @gap${analysis!.bestGap})  [${analysis!.gapDetails}]`
        );
      }
      summary.push({
        pdfPage: i,
        action,
        outputPages: [singleFile],
        ratio: analysis?.ratio ?? 0,
        bestGap: analysis?.bestGap ?? 0,
        gapDetails: analysis?.gapDetails ?? 'n/a',
      });
    }
  }

  // --- Summary ---
  console.log('\n' + '='.repeat(90));
  console.log('SUMMARY');
  console.log('='.repeat(90));
  console.log(`  PDF spreads:          ${totalPdfPages}`);
  console.log(`  Output images:        ${outputPageNum - 1}`);
  console.log(
    `  Cover (single page):  ${summary.filter((s) => s.action === 'COVER').length}`
  );
  console.log(
    `  Split (two pages):    ${summary.filter((s) => s.action === 'SPLIT').length}`
  );
  console.log(
    `  Wide (spanning):      ${summary.filter((s) => s.action === 'WIDE').length}`
  );
  console.log('');

  for (const s of summary) {
    const pages = s.outputPages.join(', ');
    console.log(
      `  PDF ${String(s.pdfPage).padStart(2)}: ${s.action.padEnd(5)} → ${pages.padEnd(15)}  ratio=${s.ratio.toFixed(2)}`
    );
  }

  console.log(`\nAll images saved to: ${absoluteOutputDir}`);
  console.log('Review the output before uploading to S3.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
