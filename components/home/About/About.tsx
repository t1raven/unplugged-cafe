'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './About.scss';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {

      /*
       * ABOUT 타이틀
       */
      gsap.from('.about__heading', {
        opacity: 0,
        y: 80,
        duration: 1,

        ease: 'power3.out',

        scrollTrigger: {
          trigger: '.about__heading',
          start: 'top 80%',
          once: true,
        },
      });


      /*
       * 이미지 등장
       */
      gsap.from('.about__image', {
        opacity: 0,
        y: 80,
        duration: 1,

        stagger: 0.15,

        ease: 'power3.out',

        scrollTrigger: {
          trigger: '.about__gallery',
          start: 'top 75%',
          once: true,
        },
      });


      /*
       * 이미지 Parallax
       */
      gsap.utils
        .toArray<HTMLElement>('.about__image')
        .forEach((image) => {

          const speed =
            Number(image.dataset.speed) || 10;

          gsap.to(image, {
            yPercent: speed,

            ease: 'none',

            scrollTrigger: {
              trigger: image,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          });

        });


      /*
       * 설명 텍스트
       */
      gsap.from('.about__text', {
        opacity: 0,
        y: 60,
        duration: 1,

        ease: 'power3.out',

        scrollTrigger: {
          trigger: '.about__text',
          start: 'top 80%',
          once: true,
        },
      });


      /*
       * Equipment
       */
      gsap.from('.about__equipment', {
        opacity: 0,
        y: 60,
        duration: 1,

        ease: 'power3.out',

        scrollTrigger: {
          trigger: '.about__equipment',
          start: 'top 80%',
          once: true,
        },
      });

    }, rootRef);

    ScrollTrigger.refresh();

    return () => ctx.revert();

  }, []);

  return (
    <section
      ref={rootRef}
      className="about"
    >

      <div className="about__inner">

        {/* 제목 */}
        <div className="about__heading">

          <p>ABOUT</p>

          <h2>
            MUSIC
            <br />
            PEOPLE
            <br />
            MOMENTS
          </h2>

        </div>


        {/* 이미지 갤러리 */}
        <div className="about__gallery">

          <div
            className="about__image about__image--01"
            data-speed="-8"
          >
            <img
              src="/images/home/about-01.jpg"
              alt="UNPLUGGED LOUNGE"
            />
          </div>


          <div
            className="about__image about__image--02"
            data-speed="12"
          >
            <img
              src="/images/home/about-02.jpg"
              alt="UNPLUGGED LOUNGE"
            />
          </div>


          <div
            className="about__image about__image--03"
            data-speed="-15"
          >
            <img
              src="/images/home/about-03.jpg"
              alt="UNPLUGGED LOUNGE"
            />
          </div>


          <div
            className="about__image about__image--04"
            data-speed="8"
          >
            <img
              src="/images/home/about-04.jpg"
              alt="UNPLUGGED LOUNGE"
            />
          </div>

        </div>


        {/* 소개 */}
        <div className="about__text">

          <p>
            음악과 사람이 머무는 카페 & 한국 인디뮤지션의 출발지
            <br />
            자유롭고 아름다운 추억이 가득한 청춘 쉼터
            <br />
            다양한 공연을 즐길 수 있는 힙한 라이브 카페
          </p>

        </div>

        <div className="about__notice">

          <h4>ETIQUETTE</h4>

          <ul>
            <li>
              카페 내에 있는 기타는 조심히 다줘주세요.<br/>
              (자유롭게 사용하시고 원래 있던 자리에 놓아주세요.)
            </li>

            <li>
              언플러그드 라운지는 자유로운 소통의 공간입니다.<br/>
              (즐겁고 편하게 대화하세요.)
            </li>

            <li>
              공연 예매자분들은 카페공간 카운터에서 예매여부 확인 후 공연장으로 입장해주세요.<br/>
              (공연 시작 후 입장은 멘트때만 가능합니다.)
            </li>

            <li>
              공연관람 중 카페음료 취식 가능합니다.<br/>
              (공연 예매자분들은 20% 할인 가격으로 음료구매 가능합니다.)
            </li>
          </ul>

        </div>


        {/* Equipment */}
        <div className="about__equipment">

          <div className="about__equipment-header">

            <h3>
              SOUND
              <br />
              EQUIPMENT
            </h3>

          </div>

          <div className="about__equipment-list">

            <div className="about__equipment-item">

              <h4>MICROPHONES</h4>

              <ul>
                <li>
                  유선 ×2
                  <span>SM 58</span>
                </li>

                <li>
                  무선 ×2
                  <span>BETA 58A</span>
                </li>
              </ul>

            </div>


            <div className="about__equipment-item">

              <h4>INSTRUMENTS</h4>

              <ul>
                <li>
                  건반
                  <span>Yamaha MX88</span>
                </li>

                <li>
                  전자드럼
                  <span>EFnote 3B</span>
                </li>

                <li>
                  카혼
                </li>
              </ul>

            </div>


            <div className="about__equipment-item">

              <h4>AMPLIFIERS</h4>

              <ul>
                <li>
                  어쿠스틱 기타
                  <span>DI 연결</span>
                </li>

                <li>
                  일렉기타 앰프 ×2
                  <span>
                    Fender Blues Jr / VOX MV50
                  </span>
                </li>

                <li>
                  베이스 앰프 ×1
                  <span>
                    Fender Rumble 25
                  </span>
                </li>
              </ul>

            </div>


            <div className="about__equipment-item">

              <h4>ACCESSORIES</h4>

              <ul>
                <li>
                  케이블
                  <span>5.5잭, XLR잭 등</span>
                </li>

                <li>
                  보면대
                  <span>
                    일반 ×3 / 핸드폰·태블릿 ×2
                  </span>
                </li>

                <li>
                  DI
                  <span>액티브 DI</span>
                </li>
              </ul>

            </div>

          </div>


          <div className="about__notice">

            <h4>NOTICE</h4>

            <ul>
              <li>
                공연공간 여건 상 어쿠스틱기타 마이킹 불가
              </li>

              <li>
                일렉기타 2대 사용 시, 1대는 DI를 통하여
                콘솔 연결
              </li>

              <li>
                개인 앰프 지참 시, 마이킹 가능
              </li>
            </ul>

          </div>

        </div>

      </div>

    </section>
  );
}