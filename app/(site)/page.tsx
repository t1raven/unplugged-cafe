import { client } from '@/sanity/lib/client';

import Hero from '@/components/home/Hero';
import Upcoming from '@/components/home/Upcoming';
import About from '@/components/home/About';
import Location from '@/components/home/Location';

import type { Performance } from '@/types/performance';

const upcomingQuery = `
  *[
    _type == "performance"
    && date >= $today
  ]
  | order(date asc, startTime asc)[0...6] {
    _id,
    title,
    slug,
    date,
    startTime,
    poster,
    artists[]->{
      _id,
      name,
      slug
    },
    thumbnail,
  }
`;

export const revalidate = 0;

export default async function Home() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  const today = new Date(now.getTime() - offset).toISOString().split('T')[0];

  const performances: Performance[] =
    await client.fetch(upcomingQuery, {
      today,
    });

  return (
    <main id="site-body" className="home">
      <Hero />
      <Upcoming performances={performances} />
      <About />
      <Location />
    </main>
  );
}