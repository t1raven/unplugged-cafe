import type { Metadata } from 'next';

import RentalPage from '@/components/rental/RentalPage';

import './rental.scss';

export const metadata: Metadata = {
  title: "대관 | UNPLUGGED LOUNGE",
};

export default function Rental() {
  return (
    <main id="site-body" className="rental">
      <section className="sub-page-hero">
        <div className="sub-page-hero__inner">
          <p className="sub-page-hero-label">SPACE RENTAL</p>
          <h1>대관 안내</h1>
          <p className="sub-page-hero__description">
            언플러그드 라운지는 공연과 음악을 위한 <br/>
            라이브 공간을 제공합니다.
          </p>
          <a href="#rental-application" className="rental-button apply-button">
            대관 신청하기
            <span>↗</span>
          </a>
        </div>
      </section>
      <RentalPage />
    </main>
  )
}