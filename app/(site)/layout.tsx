import { Noto_Sans_KR } from "next/font/google";
const notoSansKR = Noto_Sans_KR({
  weight: ['400', '500', '700'],
  variable: '--font-noto',
});
import "@/styles/globals.scss";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "UNPLUGGED LOUNGE",
  description: "Live Music Cafe",
  keywords: ["Unplugged, Live, Music, Cafe"],
  openGraph: {
    type: 'website',
    url: 'https://www.unplugged-lounge.com',
    images: [{ url: "/og-image.png" }],
  },
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
};

//Layout
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Gnb from '@/components/layout/Gnb';

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Header/>
        {children}
        <Gnb/>
        <Footer/>
      </body>
    </html>
  );
}