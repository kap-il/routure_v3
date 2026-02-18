import sharp from 'sharp';

async function main() {
  const meta = await sharp('/tmp/routure-page-check3.webp').metadata();
  console.log(`Width: ${meta.width}, Height: ${meta.height}`);
  console.log(`Aspect ratio (w/h): ${(meta.width! / meta.height!).toFixed(4)}`);
}
main();
