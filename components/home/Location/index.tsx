'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getSiteSettings } from '@/lib/siteSettings';

import './style.scss';

gsap.registerPlugin(ScrollTrigger);
const settings = await getSiteSettings();

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
          {settings?.siteName}
        </h2>

        <div className="location__info">
          <p>
            {settings?.address}
          </p>

          <p>
            영업시간
            <br />
            {settings?.businessHours}
          </p>
        </div>

        <a
          href="https://naver.me/GHvqo2Pe"
          target="_blank"
          rel="noreferrer"
        >
          GET DIRECTIONS
          <i className="material-symbols-rounded icon" translate="no">arrow_outward</i>
        </a>
      </div>
    </section>
  );
}