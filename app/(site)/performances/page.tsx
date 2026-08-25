import type { Metadata } from 'next';
import Link from 'next/link'
import { client } from '@/sanity/lib/client'

import PerformanceCalendar from '@/components/performances/PerformanceCalendar';

export const metadata: Metadata = {
  title: "공연 | UNPLUGGED LOUNGE",
};

const performancesQuery = `
  *[
    _type == "performance"
    && defined(date)
  ]
  | order(date asc, startTime asc)
  {
    _id,
    title,
    slug,
    date,
    startTime,
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
    performancesQuery,
    {},
    {
      next: {
        //revalidate: 60,
      },
    }
  );
}


export default async function PerformancesPage() {
  const performances = await getPerformances();

  return (
    <main id="site-body">
      <section className="sub-page-hero">
        <div className="sub-page-hero__inner">
          <p className="sub-page-hero-label">Performances</p>
          <h1>공연 일정</h1>
          <p className="sub-page-hero__description">
            언플러그드에서 펼쳐지는 <br/>
            다양한 라이브 공연을 만나보세요.
          </p>
        </div>
      </section>

      <PerformanceCalendar performances={performances} />
    </main>
  )
}