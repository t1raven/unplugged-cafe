import Link from 'next/link'
import { client } from '@/sanity/lib/client'
//import { performancesQuery } from '@/sanity/lib/queries'

import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';

export const metadata: Metadata = {
  title: "공연 | UNPLUGGED CAFE",
};

const performancesQuery = `
  *[_type == "performance"]
  | order(date asc, startTime asc) {
    _id,
    title,
    slug,
    date,
    startTime,
    endTime,
    genre,
    poster,
    description,
    price,
    reservationOpen,
    featured,

    artist->{
      _id,
      name,
      slug,
      profileImage,
      genre,
      bio,
      instagram,
      youtube,
      website
    }
  }
`

export default async function PerformancesPage() {
  const performances = await client.fetch(performancesQuery)

  const genreNames: Record<string, string> = {
    acoustic: '어쿠스틱',
    jazz: '재즈',
    rock: '록',
    pop: '팝',
    indie: '인디',
    blues: '블루스',
    etc: '기타',
  }

  return (
    <>
      <Header/>
      <main id="site-body">
        <section className="sub-page-section">
          <div className="inner">
            <h1>공연</h1>

            <div>
              {performances.map((performance) => (
                <article key={performance._id} style={{borderBottom: '1px solid #fff', padding: '20px 0'}}>
                  <Link href={`/performances/${performance.slug.current}`} style={{color: '#fff'}}>
                    <h2>{performance.title}</h2>

                    <div>
                      {performance.date} {performance.startTime}
                    </div>

                    <div>
                      {performance.artist?.name}
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer/>
    </>
  )
}