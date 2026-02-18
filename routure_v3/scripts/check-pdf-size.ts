import { config } from 'dotenv';
config({ path: '.env.local' });
import { readFileSync } from 'fs';

// Read PDF and find MediaBox/TrimBox/BleedBox
const pdf = readFileSync('./Magazines/FINAL-Routure-COSMIC2026.pdf', 'utf-8');

// Find MediaBox
const mediaBoxMatch = pdf.match(/\/MediaBox\s*\[\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\]/);
if (mediaBoxMatch) {
  const [, x1, y1, x2, y2] = mediaBoxMatch;
  const w = parseFloat(x2) - parseFloat(x1);
  const h = parseFloat(y2) - parseFloat(y1);
  console.log(`MediaBox: ${x1} ${y1} ${x2} ${y2}`);
  console.log(`  Size (pts): ${w} x ${h}`);
  console.log(`  Size (inches): ${(w/72).toFixed(2)} x ${(h/72).toFixed(2)}`);
}

const trimBoxMatch = pdf.match(/\/TrimBox\s*\[\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\]/);
if (trimBoxMatch) {
  const [, x1, y1, x2, y2] = trimBoxMatch;
  const w = parseFloat(x2) - parseFloat(x1);
  const h = parseFloat(y2) - parseFloat(y1);
  console.log(`TrimBox: ${x1} ${y1} ${x2} ${y2}`);
  console.log(`  Size (pts): ${w} x ${h}`);
  console.log(`  Size (inches): ${(w/72).toFixed(2)} x ${(h/72).toFixed(2)}`);
  console.log(`  Aspect ratio: ${(w/h).toFixed(4)}`);
} else {
  console.log('No TrimBox found');
}

const bleedBoxMatch = pdf.match(/\/BleedBox\s*\[\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\]/);
if (bleedBoxMatch) {
  const [, x1, y1, x2, y2] = bleedBoxMatch;
  const w = parseFloat(x2) - parseFloat(x1);
  const h = parseFloat(y2) - parseFloat(y1);
  console.log(`BleedBox: ${x1} ${y1} ${x2} ${y2}`);
  console.log(`  Size (pts): ${w} x ${h}`);
  console.log(`  Size (inches): ${(w/72).toFixed(2)} x ${(h/72).toFixed(2)}`);
} else {
  console.log('No BleedBox found');
}
