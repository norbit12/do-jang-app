import type { Metadata } from "next";
import "./globals.css";

import { Inter, Noto_Sans_JP } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoJP = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto-jp',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "DoJang 도장닷컴",
  description: "Your ultimate task master!",
  openGraph: {
    title: "DoJang",
    description: "Your ultimate task master!",
    url: "https://djng.vercel.app",
    siteName: "DoJang",
    images: [
      {
        url: "https://raw.githubusercontent.com/ethan-mason/do-jang-app/refs/heads/main/public/ogimage.png",
        width: 1200,
        height: 630,
        alt: "DoJang - Your ultimate task master!",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${notoJP.variable}`}>{children}</body>
    </html>
  );
}