//Layout
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';


export default async function Home() {
  return (
    <>
      <Header/>
      <main id="site-body">
        <section className="sub-page-section">
          <div className="inner">
            <h1>UNPLUGGED CAFE</h1>
            <p>음악과 사람이 머무는 카페 & 한국 인디뮤지션의 출발지</p>
            <p>자유롭고 아름다운 추억이 가득한 청춘 쉼터</p>
            <p>다양한 공연을 즐길 수 있는 힙한 라이브 카페</p>
          </div>
        </section>
      </main>
      <Footer/>
    </>
  );
}