import { Noto_Sans_KR } from "next/font/google";
import "@/styles/globals.scss";
const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  preload: false,
  variable: '--font-noto',
});

import type { Metadata, Viewport } from "next";
import { getSiteSettings } from '@/sanity/lib/getSiteSettings';
import { urlFor } from '@/sanity/lib/image';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  const title =
    settings?.seo?.title ??
    settings?.siteName ??
    'UNPLUGGED LOUNGE';

  const description =
    settings?.seo?.description ?? '';

  const ogImage = settings?.seo?.ogImage
    ? urlFor(settings.seo.ogImage)
        .width(400)
        .height(400)
        .url()
    : undefined;

  return {
    title,
    description,
    keywords: settings?.seo?.keywords,

    openGraph: {
      title,
      description,
      type: 'website',
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 400,
              height: 400,
            },
          ]
        : undefined,
    },
    formatDetection: {
      telephone: false,
      address: false,
      email: false,
    },
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

import ThemeProvider from '@/components/common/ThemeProvider';

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
    <html lang="ko" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <Header/>
          {children}
          <Gnb/>
          <Footer/>
        </ThemeProvider>
      </body>
    </html>
  );
}