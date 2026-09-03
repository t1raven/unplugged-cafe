import { client } from '@/sanity/lib/client';

import Hero from '@/components/home/Hero';
import Upcoming from '@/components/home/Upcoming';
import About from '@/components/home/About';
import Location from '@/components/home/Location';

import type { Performance } from '@/types/performance';

const upcomingQuery = `
  *[
    _type == "performance"
    && date >= $now
  ]
  | order(date asc)[0...6] {
    _id,
    title,
    slug,
    date,
    poster,
    artists[]->{
      _id,
      name,
      slug
    },
    thumbnail,
  }
`;

export const homeQuery = `
  *[_type == "home" && _id == "home"][0]{
    about{
      title,
      images[]{
        image,
        alt,
      },
      description{
        text,
        align
      },
      caution{
        title,
        texts[]{
          text
        }
      }
    }
  }
`;

export const revalidate = 0;

export default async function Home() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  const localDate = new Date(now.getTime() - offset);

  const performances: Performance[] =
    await client.fetch(upcomingQuery, {
      now
    });

  const home = await client.fetch(homeQuery);

  return (
    <main id="site-body" className="home" style={{ paddingTop: 'var(--header-height)' }}>
      <Hero />
      <Upcoming performances={performances} />
      <About data={home.about} />
      <Location />
    </main>
  );
}