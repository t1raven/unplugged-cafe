'use client';

import { useLayoutEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import type { Performance } from '@/types/performance';

import { urlFor } from '@/sanity/lib/image';

import './Upcoming.scss';

gsap.registerPlugin(ScrollTrigger);

interface UpcomingProps {
  performances: Performance[];
}

export default function Upcoming({
  performances,
}: UpcomingProps) {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(
        '.upcoming__item'
      );

      if (!items.length) return;

      gsap.set(items, {
        opacity: 0,
        y: 50,
      });

      gsap.to(items, {
        opacity: 1,
        y: 0,

        duration: 0.8,
        stagger: 0.15,

        ease: 'power3.out',

        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 75%',
          once: true,

          markers: false,
        },
      });
    }, rootRef);

    requestAnimationFrame(() => {
	    ScrollTrigger.refresh();
	  });

    return () => {
      ctx.revert();
    };
  }, [performances]);

  return (
    <section
      ref={rootRef}
      className="upcoming"
    >
      <div className="upcoming__inner">

        <div className="upcoming__header">
          <p>UPCOMING PERFORMANCE</p>

          <Link href="/performances">
            VIEW ALL
          </Link>
        </div>

        <div className="upcoming__list">
          {performances.length > 0 ? (
            performances.map((performance) => (
              <Link
                key={performance._id}
                href={`/performances/${performance.slug?.current ?? ''}`}
                className="upcoming__item"
              >
                <div className="upcoming__poster">
                  {performance.poster?.asset && (
                    <img
                      src={urlFor(performance.poster)
                        .width(300)
                        .height(400)
                        .fit('crop')
                        .url()}
                      alt={performance.title}
                    />
                  )}
                </div>

                <div className="upcoming__date">
                  <strong>
                    {formatDate(performance.date)}
                  </strong>

                  <span>
                    {getDay(performance.date)}
                  </span>

                  <span>
                    {performance.startTime}
                  </span>
                </div>

                <div className="upcoming__info">
                  <h2>{performance.title}</h2>
                </div>

                {/*<div className="upcoming__time">
                  {performance.startTime}
                </div>*/}

                <span className="upcoming__arrow">
                  ↗
                </span>
              </Link>
            ))
          ) : (
            <p className="upcoming__empty">
              예정된 공연이 없습니다.
            </p>
          )}
        </div>

      </div>
    </section>
  );
}

function formatDate(date: string) {
  const [, month, day] = date.split('-');

  return `${month}.${day}`;
}

function getDay(date: string) {
  const days = [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '일요일',
  ];

  return days[
    new Date(`${date}T00:00:00`).getDay()
  ];
}