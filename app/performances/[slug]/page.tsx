import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { PortableText } from '@portabletext/react';

import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';

import './performance-detail.scss';

interface Artist {
  _id: string;
  name: string;
  slug?: {
    current?: string;
  };
  profileImage?: {
    asset?: {
      _ref?: string;
    };
  };
  genre?: string;
  bio?: unknown;
  instagram?: string;
  youtube?: string;
  website?: string;
}

interface Performance {
  _id: string;
  title: string;
  slug?: {
    current?: string;
  };
  date: string;
  startTime?: string;
  poster?: {
    asset?: {
      _ref?: string;
      _id?: string;
    };
  };
  description?: unknown;
  notice?: unknown;
  price1?: string;
  price2?: string;
  reservationOpen?: boolean;
  reservationUrl?: string;
  artists?: Artist[];
}

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

    poster {
      asset
    },

    description,
    notice,
    price1,
    price2,
    reservationOpen,
    reservationUrl,

    artists[]-> {
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
`;

async function getPerformance(slug: string) {
  return client.fetch<Performance | null>(
    performanceQuery,
    { slug },
    {
      next: {
        revalidate: 60,
      },
    }
  );
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const performance = await client.fetch(
    performanceQuery,
    {
      slug: decodeURIComponent(slug),
    },
  );

  return {
    title: performance?.title
      ? `${performance.title} | UNPLUGGED LOUNGE`
      : '공연 | UNPLUGGED LOUNGE',

    description: `${performance.title?? ''} 공연 정보입니다.`,
  };
}

export default async function PerformanceDetailPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const performance = await getPerformance(slug);

  if (!performance) {
    notFound();
  }

  const date = new Date(performance.date);

  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0');

  const day = String(
    date.getDate()
  ).padStart(2, '0');

  const weekday = [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ][date.getDay()];

  return (
    <>
      <Header />

      <main id="site-body" className="performance-detail">

        {/* ==================================================
            Hero
        ================================================== */}

        <section className="performance-detail-hero">

          <div className="performance-detail-inner">

            <div className="performance-poster">

              {performance.poster?.asset && (
                <Image
                  src={urlFor(performance.poster)
                    .width(900)
                    .height(1200)
                    .url()}
                  alt={performance.title}
                  width={900}
                  height={1200}
                />
              )}

            </div>

            <div className="performance-detail-content">

              <p className="performance-eyebrow">
                LIVE PERFORMANCE
              </p>

              <h1>
                {performance.title}
              </h1>

              <div className="performance-meta">

                <div className="meta-item">
                  <span>공연 일시</span>

                  <strong>
                    {year}.{month}.{day}
                    {' '}
                    {weekday}
                    {' '}
                    {performance.startTime}
                  </strong>
                </div>

                <div className="meta-item">
                  <span>장소</span>

                  <strong>
                    언플러그드 라운지 - 서울 마포구 와우산로29길 15 3층
                  </strong>
                </div>

                {performance.price1 && (
                  <div className="meta-item">
                    <span>사전 예매가</span>
                    <strong>{performance.price1?.toLocaleString()}원</strong>
                  </div>
                )}

                {performance.price2 && (
                  <div className="meta-item">
                    <span>현장 예매가</span>
                    <strong>{performance.price2?.toLocaleString()}원</strong>
                  </div>
                )}

                <div className="meta-item">
                  <span>입장 방식</span>

                  <strong>공연장대기순</strong>
                </div>

                <div className="meta-item">
                  <span>관람 방식</span>

                  <strong>좌석</strong>
                </div>

              </div>

              {performance.reservationOpen && (
                <Link
                  href={performance.reservationUrl} target="_blank"
                  className="reservation-button"
                >
                  공연 예약
                </Link>
              )}

            </div>

          </div>

        </section>

        {/* ==================================================
            Artists
        ================================================== */}

        {performance.artists &&
          performance.artists.length > 0 && (

            <section className="performance-artists">

              <div className="performance-detail-inner">

                <div className="section-heading">
                  <p>ARTISTS</p>
                  <h2>출연 아티스트</h2>
                </div>

                <div className="artist-list">

                  {performance.artists.map(
                    (artist) => (
                      <article
                        key={artist._id}
                        className="artist-card"
                      >

                        <div className="artist-image">
                          PROFILE
                        </div>

                        <div className="artist-info">

                          <h3>
                            {artist.name}
                          </h3>

                          {artist.genre && (
                            <span>
                              {artist.genre}
                            </span>
                          )}

                          {artist.bio && (
                            <div className="artist-bio">
                              <PortableText
                                value={artist.bio as any}
                              />
                            </div>
                          )}

                        </div>

                      </article>
                    )
                  )}

                </div>

              </div>

            </section>
          )}

        {/* ==================================================
            Description
        ================================================== */}

        <section className="performance-description">

          <div className="performance-detail-inner">

            <div className="section-heading">
              <p>ABOUT PERFORMANCE</p>
              <h2>공연 소개</h2>
            </div>

            <div className="description-content">
              {performance.description ? (
                <PortableText
                  value={performance.description as any}
                />
              ) : (
                <p>
                  등록된 공연 소개가 없습니다.
                </p>
              )}
            </div>

          </div>

        </section>

        {/* ==================================================
            Description
        ================================================== */}

        <section className="performance-description">

          <div className="performance-detail-inner">

            <div className="section-heading">
              <p>NOTICE</p>
              <h2>공지 사항</h2>
            </div>

            <div className="description-content">
              {performance.notice ? (
                <PortableText
                  value={performance.notice as any}
                />
              ) : (
                <p>
                  등록된 공지사항이 없습니다.
                </p>
              )}
            </div>

          </div>

        </section>

        {/* ==================================================
            Reservation
        ================================================== */}

        {performance.reservationOpen && (
          <section
            id="reservation"
            className="performance-reservation"
          >
            <div className="performance-detail-inner">

              <div className="reservation-box">

                <p>RESERVATION</p>

                <h2>
                  공연을 예약해주세요.
                </h2>

                <Link
                  href={performance.reservationUrl} target="_blank"
                  className="reservation-button"
                >
                  예약하기
                </Link>

              </div>

            </div>
          </section>
        )}

        {/* ==================================================
            Back
        ================================================== */}

        <div className="performance-back">

          <div className="performance-detail-inner">

            <Link href="/performances">
              ← 공연 일정으로 돌아가기
            </Link>

          </div>

        </div>

      </main>

      <Footer />
    </>
  );
}