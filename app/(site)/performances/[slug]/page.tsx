import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

import { formatDateTime } from "@/utils/formatDateTime";
import type { Performance } from '@/types/performance';

import PerformanceView from '@/components/performances/PerformanceView';

const performanceQuery = `
  *[
    _type == "performance"
    && slug.current == $slug
  ][0] {
    _id,
    title,
    slug,
    date,
    salesOpen,
    salesClose,
    poster {
      asset
    },

    description,
    notice,
    price1,
    price2,
    admissionType,
    viewingType,
    reservationOpen,
    reservationUrl,

    artists[]-> {
      _id,
      name,
      slug,
      instagram,
    },

    place-> {
      _id,
      name,
      address,
      naverMap,
      kakaomMap,
      googleMap,
    }
  }
`;

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 0;

async function getPerformance(slug: string): Promise<Performance | null> {
  return client.fetch<Performance | null>(
    performanceQuery,
    {
      slug: decodeURIComponent(slug),
    },
  );
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  const performance = await getPerformance(slug);

  if (!performance) {
    return {
      title: '공연 | UNPLUGGED LOUNGE',
      description: 'UNPLUGGED LOUNGE 공연 안내',
    };
  }

  const artist = performance.artists?.map((artist) => artist.name).filter(Boolean).join('·') ?? '';
  const dateTime = performance.date ? formatDateTime(performance.date) : '';
  const description = [artist, dateTime].filter(Boolean).join(' | ');
  const imageUrl = performance.poster ? urlFor(performance.poster).width(600).height(800).fit('crop').url() : '/images/common/og-image.png';

  return {
    title: `${performance.title} | UNPLUGGED LOUNGE`,
    description: description,
    openGraph: {
      type: 'website',
      images: [{ url: imageUrl }],
    },
  };
}

export default async function PerformanceViewPage({
  params,
}: Props) {
  const { slug } = await params;

  const performance = await getPerformance(slug);

  if (!performance) {
    notFound();
  }

  return (
    <main id="site-body" className="performance-detail">
      <PerformanceView performance={performance} />
    </main>
  );
}