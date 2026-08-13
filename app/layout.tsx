import { Noto_Sans_KR } from "next/font/google";
const notoSansKR = Noto_Sans_KR({
  weight: ['400', '500', '700'],
  variable: '--font-noto',
});
import "../styles/globals.scss";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "UNPLUGGED CAFE",
  description: "Live Music Cafe",
  keywords: ["Unplugged, Live, Music, Cafe"],
  openGraph: {
    type: 'website',
    url: 'https://www.unplugged-lounge.com',
    images: [{ url: "/og-image.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}