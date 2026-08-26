import type { Metadata } from 'next';

import SubPageHero from '@/components/common/SubPageHero';
import RentalPage from '@/components/rental/RentalPage';

import './rental.scss';

export const metadata: Metadata = {
  title: "대관 | UNPLUGGED LOUNGE",
};

export default function Rental() {
  return (
    <main id="site-body" className="rental">
      <SubPageHero label="SPACE RENTAL" title="대관 안내" description="언플러그드 라운지는 공연과 음악을 위한 <br/>라이브 공간을 제공합니다." />
      <RentalPage />
    </main>
  )
}