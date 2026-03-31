import { ImageResponse } from 'next/og';

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
          backgroundColor: '#E8E8E6',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://routuremag.vercel.app/images/routure-logo.png"
          alt=""
          width={400}
          height={90}
        />
      </div>
    ),
    { ...size }
  );
}
