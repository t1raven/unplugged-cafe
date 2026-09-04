'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

import type { Category } from '@/types/category';
import type { Archive } from '@/types/archive';

import './ArchiveModal.scss';

interface Props {
  items: Archive[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const rgbDataURL = (r: number, g: number, b: number) =>
  `data:image/gif;base64,R0lGODlhAQABAPAA${
    triplet(0, r, g) + triplet(b, 255, 255)
  }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`

const triplet = (e1: number, e2: number, e3: number) =>
  String.fromCharCode(e1, e2, e3)

export default function ArchiveModal({
  items,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

  const item = items[currentIndex];

  /*
   * Modal 등장 애니메이션
   */
  useEffect(() => {
    const modal = modalRef.current;

    if (!modal) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gallery-modal__backdrop',
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.35,
          ease: 'power2.out',
        }
      );

      gsap.fromTo(
        '.gallery-modal__content',
        {
          opacity: 0,
          scale: 0.96,
          y: 20,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          ease: 'power3.out',
        }
      );
    }, modal);

    return () => ctx.revert();
  }, []);

  /*
   * 이미지 변경
   */
  useEffect(() => {
    const image = modalRef.current?.querySelector(
      '.gallery-modal__image img'
    );

    if (!image) return;

    gsap.fromTo(
      image,
      {
        opacity: 0,
        scale: 0.98,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: 'power2.out',
      }
    );
  }, [currentIndex]);

  /*
   * ESC
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }

      if (event.key === 'ArrowLeft') {
        onPrev();
      }

      if (event.key === 'ArrowRight') {
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    // 최소 스와이프 거리 (픽셀 단위, 너무 민감하게 반응하지 않도록 설정)
    const minSwipeDistance = 50;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].clientX;
      calculateSwipe();
    };

    const calculateSwipe = () => {
      const distanceX = touchEndX - touchStartX;

      // 1. 최소 이동 거리 조건을 만족하는지 확인
      if (Math.abs(distanceX) < minSwipeDistance) return;

      // 2. 방향 판별 (양수면 오른쪽, 음수면 왼쪽 스와이프)
      if (distanceX > 0) {
        onPrev();
        // TODO: 이전 페이지 이동, 캐러셀 이전 슬라이드 등 로직 추가
      } else {
        onNext();
        // TODO: 다음 페이지 이동, 캐러셀 다음 슬라이드 등 로직 추가
      }
    };

    // 모바일 터치 이벤트 리스너 등록
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거 (메모리 누수 방지)
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [onPrev, onNext]);

  if (!item) return null;

  return (
    <div
      ref={modalRef}
      className="gallery-modal"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <button
        type="button"
        className="gallery-modal__backdrop"
        aria-label="닫기"
        onClick={onClose}
      />

      <div className="gallery-modal__content">
        <button
          type="button"
          className="gallery-modal__close"
          onClick={onClose}
          aria-label="닫기"
        >
          <span className="icon material-symbols-rounded" translate="no">close</span>
        </button>

        <div className="gallery-modal__image">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            placeholder="blur"
            blurDataURL={rgbDataURL(0, 0, 0)}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div className="gallery-modal__info">
          <h2>{item.title}</h2>

          {item.description && (
            <p>{item.description}</p>
          )}

          <span>
            {currentIndex + 1} / {items.length}
          </span>
        </div>

        <button
          type="button"
          className="gallery-modal__prev"
          onClick={onPrev}
          aria-label="이전 이미지"
        >
          <span className="icon material-symbols-rounded" translate="no">keyboard_arrow_left</span>
        </button>

        <button
          type="button"
          className="gallery-modal__next"
          onClick={onNext}
          aria-label="다음 이미지"
        >
          <span className="icon material-symbols-rounded" translate="no">keyboard_arrow_right</span>
        </button>
      </div>
    </div>
  );
}