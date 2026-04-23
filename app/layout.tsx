import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Playfair_Display, Cormorant_Garamond, IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import IntroSplash from "@/components/IntroSplash";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const argue = localFont({
  src: [
    {
      path: "../public/fonts/Argue.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-argue",
  display: "swap",
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover' as const,
  themeColor: '#FAFAF8',
};

export const metadata: Metadata = {
  metadataBase: new URL("https://routuremag.com"),
  title: "Routure | A Curated Magazine Experience",
  description: "Exploring the intersection of culture, style, and contemporary life.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      {
        url: "/brand/favicon-light.png",
        media: "(prefers-color-scheme: light)",
        type: "image/png",
      },
      {
        url: "/brand/favicon-dark.png",
        media: "(prefers-color-scheme: dark)",
        type: "image/png",
      },
    ],
    apple: "/brand/og-image.png",
  },
  openGraph: {
    title: "Routure Fashion Magazine",
    siteName: "Routure",
    type: "website",
    images: [{ url: "https://routuremag.com/brand/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary",
    title: "Routure Fashion Magazine",
    images: ["https://routuremag.com/brand/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[#FAFAF8]">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          if (window.location.pathname === '/') {
            var s = document.createElement('style');
            s.id = 'intro-block';
            s.textContent = 'body{visibility:hidden!important}html{background:#000!important}';
            document.head.appendChild(s);
          }
        `}} />
        <link rel="dns-prefetch" href="https://routure-issues.s3.us-east-1.amazonaws.com" />
        <link rel="preconnect" href="https://routure-issues.s3.us-east-1.amazonaws.com" crossOrigin="anonymous" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${cormorant.variable} ${plexMono.variable} ${argue.variable} antialiased bg-[#FAFAF8]`}>
        <Header />
        <main className="bg-[#FAFAF8]" style={{ paddingTop: '72px' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
