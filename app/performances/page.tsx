import type { Metadata } from 'next';
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
//import { performancesQuery } from '@/sanity/lib/queries'

import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import PerformanceCalendar from '@/components/performances/PerformanceCalendar/PerformanceCalendar';

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
    thumbnail,
    description
  }
`;

async function getPerformances() {
  return await client.fetch(
    performancesQuery,
    {},
    {
      next: {
        revalidate: 60,
      },
    }
  );
}


export default async function PerformancesPage() {
  const performances = await getPerformances();

  return (
    <>
      <Header/>
      <main id="site-body">
        <section className="sub-page-section">
          <div className="inner">
            <h1>공연</h1>
            <p className="description">
              언플러그드에서 펼쳐지는 다양한 라이브 공연을 만나보세요.
            </p>
            
            <div className="performances-calendar">
              <div className="inner">
                <PerformanceCalendar performances={performances} />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer/>
    </>
  )
}