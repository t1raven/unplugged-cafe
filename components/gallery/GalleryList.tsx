'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

import GalleryModal from './GalleryModal';

import './GalleryList.scss';

interface GalleryCategory {
  _id: string;
  title: string;
  slug: string;}

interface GalleryItem {
  _id: string;
  title: string;
  description?: string;

  category: GalleryCategory | null;

  imageUrl: string;
}

interface GalleryListProps {
  categories: GalleryCategory[];
  items: GalleryItem[];
}

export default function GalleryList({ items, categories }: GalleryListProps) {
  const [activeCategory, setActiveCategory] = useState(
    categories[0]?.slug ?? ''
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const galleryRef = useRef<HTMLDivElement>(null);

  const filteredItems = items.filter(
    (item) => item.category?.slug === activeCategory
  );

  /*
   * 카테고리 변경 시
   * 기존 이미지 제거 → 새 이미지 stagger 등장
   */
  useLayoutEffect(() => {
    const container = galleryRef.current;

    if (!container) return;

    const thumbnails = container.querySelectorAll('.gallery__item');

    if (!thumbnails.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        thumbnails,
        {
          opacity: 0,
          scale: 0.94,
          y: 20,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out',
          clearProps: 'all',
        }
      );
    }, container);

    return () => ctx.revert();
  }, [activeCategory]);

  /*
   * Modal 열렸을 때 body scroll 방지
   */
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedIndex]);

  const handleCategory = (category: string) => {
    if (category === activeCategory) return;

    setSelectedIndex(null);
    setActiveCategory(category);
  };

  const handleOpenModal = (index: number) => {
    setSelectedIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedIndex(null);
  };

  const handlePrev = useCallback(() => {
    if (selectedIndex === null || filteredItems.length === 0) return;

    setSelectedIndex(
      selectedIndex === 0
        ? filteredItems.length - 1
        : selectedIndex - 1
    );
  }, [selectedIndex, filteredItems.length]);

  const handleNext = useCallback(() => {
    if (selectedIndex === null || filteredItems.length === 0) return;

    setSelectedIndex(
      selectedIndex === filteredItems.length - 1
        ? 0
        : selectedIndex + 1
    );
  }, [selectedIndex, filteredItems.length]);

  return (
    <>
      <section className="sub-page-section gallery">
        <div className="inner">
          <nav className="gallery__category">
            {categories.map((category) => (
              <button
                key={category._id}
                type="button"
                className={
                  activeCategory === category.slug
                    ? 'is-active'
                    : ''
                }
                onClick={() => {
                  setSelectedIndex(null);
                  setActiveCategory(category.slug);
                }}
              >
                {category.title}
              </button>
            ))}
          </nav>

          <div
            ref={galleryRef}
            className="gallery__grid"
          >
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <button
                  key={item._id}
                  type="button"
                  className="gallery__item"
                  onClick={() => handleOpenModal(index)}
                >
                  <div className="gallery__image">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      width={384}
                      height={480}
                    />
                  </div>

                  <div className="gallery__info">
                    <h3>{item.title}</h3>
                  </div>
                </button>
              ))
            ) : (
              <div className="gallery__empty">
                등록된 이미지가 없습니다.
              </div>
            )}
          </div>
        </div>
      </section>

      {selectedIndex !== null && (
        <GalleryModal
          items={filteredItems}
          currentIndex={selectedIndex}
          onClose={handleCloseModal}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </>
  );
}