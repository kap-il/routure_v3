'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import type { MosaicImage } from '@/types/issue';
import { MosaicTile } from './MosaicTile';

interface MosaicGridProps {
  images: MosaicImage[];
  issueId: string;
  gap?: number;
}

// Justified-gallery tuning.
const TARGET_ROW_HEIGHT = 460; // natural height for a leftover row that can't fill
const MAX_ROW_HEIGHT = 880;    // never let a sparse row balloon taller than this
const DEFAULT_WIDTH = 1520;    // SSR / pre-measure fallback (matches max-w-[1600px] - padding)

interface JustifiedRow {
  images: MosaicImage[];
  height: number;
  center: boolean; // true for a leftover row that can't fill — center it (balanced gaps)
}

/** Largest height a row can take without upscaling ANY of its images
 *  (display height <= native height for every image). */
function maxRowHeight(row: MosaicImage[]): number {
  let h = Infinity;
  for (const img of row) {
    if (img.width) h = Math.min(h, img.width / img.aspectRatio); // native height = width / AR
  }
  return h;
}

/**
 * Pack images into rows that fill the full container width edge-to-edge WITHOUT
 * upscaling. A row keeps accepting images until it can fill the width at a height
 * that's within every image's native resolution (and not too tall). Low-res tiles
 * therefore get packed denser instead of leaving whitespace. A leftover final row
 * that genuinely can't fill (e.g. a lone low-res cover) is centered.
 */
function buildJustifiedRows(images: MosaicImage[], containerW: number, gap: number): JustifiedRow[] {
  const rows: JustifiedRow[] = [];
  let row: MosaicImage[] = [];
  let arSum = 0;

  for (const img of images) {
    row.push(img);
    arSum += img.aspectRatio;
    const fillHeight = (containerW - gap * (row.length - 1)) / arSum; // height to fill width exactly
    const cap = maxRowHeight(row);                                    // no-upscale ceiling
    // Aim for the ~TARGET-height rhythm (fillHeight <= TARGET ≈ enough images to be
    // dense), but only close once the row can actually fill at native resolution
    // (fillHeight <= cap). Low-res rows keep packing more tiles instead of leaving
    // whitespace. A long row is force-closed as a safety valve.
    if ((fillHeight <= TARGET_ROW_HEIGHT && fillHeight <= cap) || row.length >= 6) {
      rows.push({ images: row, height: Math.min(fillHeight, cap, MAX_ROW_HEIGHT), center: false });
      row = [];
      arSum = 0;
    }
  }
  // Leftover: a final row that can't fill the width without upscaling — center it.
  if (row.length) {
    const cap = maxRowHeight(row);
    const fillHeight = (containerW - gap * (row.length - 1)) / arSum;
    const height = Math.min(fillHeight, cap, MAX_ROW_HEIGHT);
    rows.push({ images: row, height, center: height < fillHeight - 0.5 });
  }
  return rows;
}

export function MosaicGrid({ images, issueId, gap = 16 }: MosaicGridProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(DEFAULT_WIDTH);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setWidth(el.clientWidth);
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const rows = useMemo(() => buildJustifiedRows(images, width, gap), [images, width, gap]);

  return (
    <div ref={ref} className="flex flex-col" style={{ gap }}>
      {rows.map((row, idx) => (
        <div key={idx} className={`flex ${row.center ? 'justify-center' : ''}`} style={{ gap, height: row.height }}>
          {row.images.map((img) => (
            <div key={img.id} style={{ width: row.height * img.aspectRatio, flexShrink: 0 }}>
              <MosaicTile image={img} issueId={issueId} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
