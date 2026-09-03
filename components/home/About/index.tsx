'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';

import './style.scss';

gsap.registerPlugin(ScrollTrigger);

export type TextAlign = 'left' | 'center' | 'right';

interface Props {
  data: {
    title?: string;
    images?: {
      image: string;
      alt?: string;
      position?: string;
    }[];
    description?: {
      text?: string;
      align?: TextAlign;
    };
    caution?: {
      title?: string;
      texts?: {
        text?: string;
      }[];
    };
  };
}

export default function About({ data }: Props) {
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
      const speedDate = [-8, 12, -15, 8];

      gsap.utils
        .toArray<HTMLElement>('.about__image')
        .forEach((image,index) => {

          const speed = speedDate[index] || 10;

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

          <h2>{data.title}</h2>

        </div>


        {/* 이미지 갤러리 */}
        <div className="about__gallery">
          {(data.images ?? []).map((item, index) => (
            <div
              key={index}
              className={`about__image about__image--${index+1}`}
            >
              <Image
                src={urlFor(item.image).width(800).url()}
                alt={item.alt || ""}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          ))}
        </div>


        {/* 소개 */}
        {data.description?.text && (
          <div className="about__text">
            <p style={{ textAlign: data.description.align || 'right' }}>
              {data.description.text}
            </p>
          </div>
        )}

        {data.caution?.title && (
          <div className="about__notice">

            <h4>
              {data.caution.title || 'ETIQUETTE'}
            </h4>

            <ul>
              {data.caution.texts?.map((item, index) => (
                <li key={index}>
                  {item.text}
                </li>
              ))}
            </ul>

          </div>
        )}
          

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
                    일반 ×3 / 핸드폰·태블릿 거치대 ×2
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