import type { Metadata } from 'next';
import Link from 'next/link'
import { client } from '@/sanity/lib/client'

import SubPageHero from '@/components/common/SubPageHero';
import PerformanceCalendar from '@/components/performances/PerformanceCalendar';

export const metadata: Metadata = {
  title: "공연 예매 | UNPLUGGED LOUNGE",
};

const performancesQuery = `
  *[
    _type == "performance"
    && defined(date)
  ]
  | order(date asc)
  {
    _id,
    title,
    slug,
    date,
    price1,
    price2,
    artists[]->{
      _id,
      name,
      slug
    },
    poster {
      asset
    },
    description
  }
`;

async function getPerformances() {
  return await client.fetch(
    performancesQuery
  );
}

export const revalidate = 0;

export default async function PerformancesPage() {
  const performances = await getPerformances();

  return (
    <main id="site-body">
      <SubPageHero label="Performances" title="공연 예매" description="언플러그드에서 펼쳐지는 <br/>다양한 라이브 공연을 만나보세요." />
      <PerformanceCalendar performances={performances} />
    </main>
  )
}