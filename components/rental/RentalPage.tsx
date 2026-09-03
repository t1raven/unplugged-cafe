'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import RentalEquipment from './RentalEquipment';

gsap.registerPlugin(ScrollTrigger);

export default function RentalPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>('.rental-section');

      sections.forEach((section) => {
        gsap.fromTo(
          section,
          {
            y: 50,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              once: true,
            },
          }
        );
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div className="rental-container" ref={containerRef}>
      {/* SUMMARY */}
      <section className="rental-section rental-summary">
        <div className="rental-summary__grid">
          <article>
            <span>SPACE</span>
            <strong>3F</strong>
            <p>공연장 공간은 3층입니다.</p>
          </article>

          <article>
            <span>CAPACITY</span>
            <strong>100</strong>
            <p>관객 좌석 최대 100석</p>
          </article>

          <article>
            <span>TIME</span>
            <strong>FLEXIBLE</strong>
            <p>요일 및 시간 협의 가능</p>
          </article>

          <article>
            <span>TYPE</span>
            <strong>1 TYPE</strong>
            <p>타입당 선택 가능합니다.</p>
          </article>
        </div>

        <div className="rental-summary__buttons">
          <a href="#rental-application" className="rental-button apply-button">
            대관 신청 바로가기
            <span>↗</span>
          </a>
        </div>
      </section>

      {/* NOTICE */}
      <section className="rental-section rental-notice">
        <div className="rental-section__heading">
          <h2>신청 전 필독</h2>
        </div>

        <div className="rental-notice__content">
          <p>
            대관 신청을 원하는 분들은 아래의 사항을
            <br />
            꼼꼼히 확인한 후 신청해 주세요.
          </p>

          <ul>
            <li>
              <span>01</span>
              <p>대관은 타입당 선택 가능합니다.</p>
            </li>

            <li>
              <span>02</span>
              <p>공연장 공간은 3층입니다.</p>
            </li>

            <li>
              <span>03</span>
              <p>요일과 시간은 협의 가능합니다.</p>
            </li>

            <li>
              <span>04</span>
              <p>관객 좌석은 최대 100석까지 가능합니다.</p>
            </li>

            <li>
              <span>05</span>
              <p>
                대관 전 공간 및 장비 확인을 위한 사전 답사를 권장합니다.
              </p>
            </li>
          </ul>

          <div className="rental-notice__warning">
            <strong>NOTICE</strong>

            <p>
              공지를 숙지하지 못하여 발생하는 불이익에 대해서는
              책임지지 않습니다.
            </p>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="rental-section rental-process">
        <div className="rental-section__heading">
          <h2>대관 신청 절차</h2>
        </div>

        <div className="rental-process__list">
          <article>
            <span>01</span>
            <h3>신청</h3>
            <p>대관 신청 내용을 작성합니다.</p>
          </article>

          <article>
            <span>02</span>
            <h3>일정 협의</h3>
            <p>요일 및 이용 시간을 협의합니다.</p>
          </article>

          <article>
            <span>03</span>
            <h3>예약 안내</h3>
            <p>예약 가능 여부 및 입금 계좌를 안내드립니다.</p>
          </article>

          <article>
            <span>04</span>
            <h3>입금</h3>
            <p>안내받은 계좌로 100% 입금합니다.</p>
          </article>

          <article>
            <span>05</span>
            <h3>예약 확정</h3>
            <p>입금 확인 후 예약이 최종 확정됩니다.</p>
          </article>
        </div>
      </section>

      {/* PAYMENT */}
      <section className="rental-section rental-payment">
        <div className="rental-section__heading">
          <h2>입금 및 환불</h2>
        </div>

        <div className="rental-payment__grid">
          <article>
            <span>PAYMENT</span>
            <h3>100% 선입금</h3>

            <p>
              예약문자를 수신한 후, 안내받으신 계좌로<br />
              100% 입금하시면 예약이 확정됩니다.
            </p>
          </article>

          <article>
            <span>REFUND</span>

            <div className="refund-row">
              <strong>이용 30일 전까지</strong>
              <b>100% 환불</b>
            </div>

            <div className="refund-row">
              <strong>이용 29일 전 ~ 당일</strong>
              <b>환불 불가</b>
            </div>

            <p className="refund-note">
              여러 가지 상황에 따라 변동될 수 있으니
              부담 없이 문의해 주세요.
            </p>
          </article>
        </div>
      </section>

      {/* EQUIPMENT */}
      <section className="rental-section rental-equipment-section">
        <div className="rental-section__heading">
          <h2>공연 장비</h2>
        </div>

        <RentalEquipment />
      </section>

      {/* APPLICATION */}
      <section id="rental-application" className="rental-section rental-application" >
        <div className="rental-application__inner">
          <p className="rental-label">RENTAL APPLICATION</p>

          <h2>
            공연을 계획하고
            <br />
            계신가요?
          </h2>

          <p>
            아래 신청 내용을 확인한 후 대관 신청을 진행해 주세요.
            <br />
            모든 대관은 날짜 확인 후 대관됩니다.
          </p>

          <div className="rental-application__buttons">
            <a
              href="https://docs.google.com/spreadsheets/d/1VqfBWdTR0RCg99oG9AUxaqTr1CL5Qo-GrjouthYtHsY/edit?gid=0#gid=0"
              target="_blank"
              rel="noopener noreferrer"
              className="rental-button"
            >
              대관 신청 전 상세 안내 확인
              <span>↗</span>
            </a>

            <a href="tel:010-9035-6289" className="rental-button">
              전화 문의
              <span>↗</span>
            </a>

            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSdWVBYKnyheSAefJHerrcdjftW9KodEqzz2IjfTQCm0ysvlgA/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="rental-button apply-button"
            >
              대관 신청하기 (구글폼)
              <span>↗</span>
            </a>
          </div>

          <div className="rental-contact">
            <p>UNPLUGGED LOUNGE / 서교음악다방</p>

            <span>
              DM @unplugged.lounge
              <br />
              unpluggedkorea@gmail.com
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}