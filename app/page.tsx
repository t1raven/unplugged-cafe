//Layout
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';


export default async function Home() {
  return (
    <>
      <Header/>
      <main id="site-body">
        <section>
          <div className="container">
            <h1>UNPLUGGED CAFE</h1>
            <p>음악이 시작되는 공간</p>
          </div>
        </section>
      </main>
      <Footer/>
    </>
  );
}