import { notFound } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import { PortableText } from '@portabletext/react'

import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';

const performanceQuery = `
  *[
    _type == "performance"
    && slug.current == $slug
  ][0] {
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

type Props = {
  params: Promise<{
    slug: string
  }>
}

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

  const genreNames: Record<string, string> = {
    acoustic: '어쿠스틱',
    jazz: '재즈',
    rock: '록',
    pop: '팝',
    indie: '인디',
    blues: '블루스',
    etc: '기타',
  }

  return {
    title: performance?.title
      ? `${performance.title} | UNPLUGGED CAFE`
      : '공연 | UNPLUGGED CAFE',

    description: `${performance.artist?.name ?? ''} ${genreNames[performance.genre] ?? '라이브 공연'} 공연 정보입니다.`,
  };
}

export default async function PerformanceDetailPage({
  params,
}: Props) {
  const { slug } = await params

  const performance = await client.fetch(
    performanceQuery,
    {
      slug: decodeURIComponent(slug),
    },
  )

  if (!performance) {
    notFound()
  }

  return (
    <>
      <Header/>
      <main id="site-body">
        <section className="sub-page-section">
          <div className="inner">
            <h1>{performance.title}</h1>

            <div>
              {performance.date} {performance.startTime}
            </div>

            <div>
              {performance.artist?.name}
            </div>

            <div>
              {performance.description && (
                <PortableText value={performance.description}/>
              )}
            </div>

            <div>
              {performance.price?.toLocaleString()}원
            </div>

            {performance.reservationOpen ? (
              <button>
                공연 예약
              </button>
            ) : (
              <div>예약 마감</div>
            )}
          </div>
        </section>
      </main>
      <Footer/>
    </>
  )
}