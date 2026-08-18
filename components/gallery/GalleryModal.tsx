'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

import type { Category } from '@/types/category';
import type { Gallery } from '@/types/gallery';

import './GalleryModal.scss';

interface GalleryModalProps {
  items: Gallery[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function GalleryModal({
  items,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: GalleryModalProps) {
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
          ×
        </button>

        <button
          type="button"
          className="gallery-modal__prev"
          onClick={onPrev}
          aria-label="이전 이미지"
        >
          ‹
        </button>

        <div className="gallery-modal__image">
          <img
            src={item.imageUrl}
            alt={item.title}
          />
        </div>

        <button
          type="button"
          className="gallery-modal__next"
          onClick={onNext}
          aria-label="다음 이미지"
        >
          ›
        </button>

        <div className="gallery-modal__info">
          <h2>{item.title}</h2>

          {item.description && (
            <p>{item.description}</p>
          )}

          <span>
            {currentIndex + 1} / {items.length}
          </span>
        </div>
      </div>
    </div>
  );
}