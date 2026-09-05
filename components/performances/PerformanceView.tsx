'use client';

import { useEffect, useState } from "react";
import Image from 'next/image';
import Link from 'next/link';

import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { PortableText } from '@portabletext/react';

import { isIOS } from "@/utils/device";
import { formatDateTime } from "@/utils/formatDateTime";

import type { Performance } from '@/types/performance';

import './PerformanceView.scss';


const admissionTypeNames: Record<string, string> = {
  1: '입장번호순',
  2: '공연장대기순',
}

const viewingTypeNames: Record<string, string> = {
  1: '좌석',
  2: '입석',
}

const extractInstagramIdWithRegex = (urlStr: string): string | null => {
  const regex = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9_.]+)/;
  const match = urlStr.match(regex);

  return match ? match[1] : null;
}

const handleShare = async () => {
  const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  
  const shareData = {
    title: document.title,
    text: metaDescription,
    url: window.location.href,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (error) {
      // 사용자가 공유창을 닫은 경우
      if ((error as DOMException).name !== "AbortError") {
        console.error("공유 실패:", error);
      }
    }
  } else {
    // Web Share API를 지원하지 않는 브라우저
    await navigator.clipboard.writeText(window.location.href);
    alert("URL이 복사되었습니다.");
  }
};

interface Props {
  performance: Performance;
}

export default function PerformanceViewPage({
  performance,
}: Props) {

  const now = new Date();

  const salesOpen = new Date(performance.salesOpen ?? new Date());
  const salesClose = new Date(performance.salesClose ?? new Date());

  const [ios, setIos] = useState(false);

  useEffect(() => {
    setIos(isIOS());
  }, []);

  return (
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
                  .width(600)
                  .url()}
                alt={performance.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 600px"
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
                  {formatDateTime(performance.date)}
                </strong>
              </div>

              <div className="meta-item">
                <span>공연 장소</span>

                <strong>
                  <Link href={performance.place?.naverMap!} target="_blank">
                    <i className="material-symbols-rounded icon" translate="no">location_on</i> {performance.place?.name} ↗
                  </Link><br/>
                  <p>{performance.place?.address}</p>
                </strong>
              </div>

              {performance.price1 && (
                <div className="meta-item">
                  <span>사전 예매</span>
                  <strong>{performance.price1?.toLocaleString()}원</strong>
                </div>
              )}

              {performance.price2 && (
                <div className="meta-item">
                  <span>현장 예매</span>
                  <strong>{performance.price2?.toLocaleString()}원</strong>
                </div>
              )}

              <div className="meta-item">
                <span>입장 방식</span>

                <strong>{performance.admissionType ? admissionTypeNames[performance.admissionType] ?? performance.admissionType : '-'}</strong>
              </div>

              <div className="meta-item">
                <span>관람 방식</span>

                <strong>{performance.viewingType ? viewingTypeNames[performance.viewingType] ?? performance.viewingType : '-'}</strong>
              </div>

            </div>

            {/*{performance.reservationOpen && performance.reservationUrl && (
              now < salesOpen ? (
                <button disabled className="reservation-button">
                  사전 예매 오픈전
                </button>
              ) : salesClose < now ? (
                <button disabled className="reservation-button">
                  <span>사전 예매 마감 <br/><small>(현장 예매만 가능합니다)</small></span>
                </button>
              ) : (
                <Link
                  href={performance.reservationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="reservation-button"
                >
                  공연 예매
                </Link>
              )
            )}*/}
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
                <p>ARTIST LINEUP</p>
                <h2>아티스트 라인업</h2>
              </div>

              <div className="artist-list">

                {performance.artists.map(
                  (artist) => (
                    <article
                      key={artist._id}
                      className="artist-card"
                    >

                      <div className="artist-info">

                        <h3>
                          {artist.name}
                        </h3>

                        {artist.instagram && (
                          <Link href={artist.instagram!} target="_blank">
                            @{extractInstagramIdWithRegex(artist.instagram)} ↗
                          </Link>
                        )}

                      </div>

                      <i className="artist-icon material-symbols-rounded" translate="no">artist</i>

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
                value={performance.description}
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
          Notice
      ================================================== */}
      {performance.notice && (
        <section className="performance-description">

          <div className="performance-detail-inner">

            <div className="section-heading">
              <p>NOTICE</p>
              <h2>공지 사항</h2>
            </div>

            <div className="description-content">
              <PortableText
                value={performance.notice}
              />
            </div>

          </div>

        </section>
      )}

      <div className="reservation_gnb_btn">
        <nav>
          <button type="button" onClick={handleShare} className="gnb_btn">
            <span className="material-symbols-rounded icon" aria-label="공유하기">{ios ? "ios_share" : "share"}</span>
          </button>
          {now < salesOpen ? (
            <button disabled className="gnb_btn reservation_btn">
              <span>사전 예매 오픈전</span>
            </button>
          ) : now >= salesClose ? (
            <button disabled className="gnb_btn reservation_btn">
              <span>사전 예매 마감 <br/><small>(현장 예매만 가능합니다)</small></span>
            </button>
          ) : (
            <Link
              href={performance.reservationUrl ?? ""}
              target="_blank"
              rel="noopener noreferrer"
              className="gnb_btn reservation_btn"
            >
              <span>예매하기</span>
            </Link>
          )}
        </nav>
      </div>

      {/* ==================================================
          Reservation
      ================================================== */}

      {/*{performance.reservationOpen && performance.reservationUrl && (
        <section
          id="reservation"
          className="performance-reservation"
        >
          <div className="performance-detail-inner">

            <div className="reservation-box">

              <p>RESERVATION</p>

              <h2>공연을 예약해주세요.</h2>

              {now < salesOpen ? (
                <button disabled className="reservation-button">
                  사전 예매 오픈전
                </button>
              ) : salesClose < now ? (
                <button disabled className="reservation-button">
                  <span>사전 예매 마감 <br/><small>(현장 예매만 가능합니다)</small></span>
                </button>
              ) : (
                <Link
                  href={performance.reservationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="reservation-button"
                >
                  예매하기
                </Link>
              )}
            </div>

          </div>
        </section>
      )}*/}
    </main>
  );
}