import { ImageResponse } from 'next/og';

export const revalidate = 86400; // Regenerate once per day, not on every share/crawl
export const runtime = 'edge';
export const alt = 'Routure Fashion Magazine';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000000',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://routuremag.com/brand/og-image.png"
          alt=""
          width={1200}
          height={630}
        />
      </div>
    ),
    { ...size }
  );
}
