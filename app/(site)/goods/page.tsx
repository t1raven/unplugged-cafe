import type { Metadata } from 'next';

import SubPageHero from '@/components/common/SubPageHero';


export const metadata: Metadata = {
  title: "앨범·굿즈 | UNPLUGGED LOUNGE",
};

export default function Rental() {
  return (
    <main id="site-body" className="rental">
      <SubPageHero label="ALBUM·GOODS" title="앨범·굿즈" description="언플러그드 라운지에서 판매되는 <br/>뮤지션 앨범과 다양한 굿즈를 만나보세요." />
    </main>
  )
}