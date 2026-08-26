'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './style.scss';

gsap.registerPlugin(ScrollTrigger);

export default function Location() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
  	if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.location__content', {
        opacity: 0,
        y: 60,

        duration: 1,

        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 75%',
          once: true,
        },
      });
    }, rootRef);

    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="location"
    >
      <div className="location__image" />

      <div className="location__overlay" />

      <div className="location__content">
        <p className="location__label">
          LOCATION
        </p>

        <h2>
          UNPLUGGED
          <br />
          LOUNGE
        </h2>

        <div className="location__info">
          <p>
            서울 마포구 와우산로29길 15 2층, 3층
          </p>

          <p>
            OPEN
            <br />
            MON — SUN
            <br />
            12:00 — 24:00 (23:00 Last Order)
          </p>
        </div>

        <a
          href="https://naver.me/GHvqo2Pe"
          target="_blank"
          rel="noreferrer"
        >
          GET DIRECTIONS ↗
        </a>
      </div>
    </section>
  );
}