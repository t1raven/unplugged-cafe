'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

import './style.scss';

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from('.hero__image', {
        scale: 1.12,
        duration: 1.8,
        ease: 'power3.out',
      })
        .from(
          '.hero__eyebrow',
          {
            opacity: 0,
            y: 30,
            duration: 0.7,
            ease: 'power3.out',
          },
          '-=1'
        )
        .from(
          '.hero__title',
          {
            opacity: 0,
            y: 60,
            duration: 1,
            ease: 'power4.out',
          },
          '-=0.45'
        )
        .from(
          '.hero__location',
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
          },
          '-=0.5'
        )
        .from(
          '.hero__scroll',
          {
            opacity: 0,
            duration: 0.6,
          },
          '-=0.2'
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="hero">
      <div className="hero__image" />

      <div className="hero__overlay" />

      <div className="hero__content">
        <p className="hero__eyebrow">
          LIVE CAFE
        </p>

        <h1 className="hero__title">
          UNPLUGGED
          <br />
          LOUNGE
        </h1>

        <p className="hero__location">
          HONGDAE · SEOUL
        </p>

        <div className="hero__scroll">
          <span>SCROLL</span>
          <i />
        </div>
      </div>
    </section>
  );
}