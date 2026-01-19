import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}