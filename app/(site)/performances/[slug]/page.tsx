import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

import { formatDateTime } from "@/utils/formatDateTime";

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

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  const performance = await client.fetch(
    performanceQuery,
    {
      slug: decodeURIComponent(slug),
    },
  );

  const artist = performance.artists.length > 0 ? `${performance.artists.map(( artist: { name: string }) => artist.name ) .join('·')} | ` : '';
  const dateTime = `${formatDateTime(performance.date)}`;

  return {
    title: performance?.title
      ? `${performance.title} | UNPLUGGED LOUNGE`
      : '공연 | UNPLUGGED LOUNGE',

    description: `${artist}${dateTime}`,
    openGraph: {
      images: [{ url: `${urlFor(performance.poster) ?? '/images/common/og-image.png'}` }],
    },
  };
}

export default async function PerformanceViewPage({
  params,
}: Props) {
  const { slug } = await params;
  const performance = await client.fetch(
    performanceQuery,
    {
      slug: decodeURIComponent(slug),
    },
  );

  if (!performance) {
    notFound();
  }

  return (
    <main id="site-body" className="performance-detail">
      <PerformanceView performance={performance} />
    </main>
  );
}