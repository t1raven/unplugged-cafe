'use client';

import { useEffect, useCallback, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

import CategoryNav from '@/components/common/CategoryNav/CategoryNav'
import GalleryModal from './GalleryModal';

import type { Category } from '@/types/category';
import type { Gallery } from '@/types/gallery';

import './GalleryList.scss';

interface Props {
  categories: Category[];
  items: Gallery[];
}

export default function GalleryList({
  categories,
  items,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  const [activeCategory, setActiveCategory] = useState(
    categories[0]?.slug ?? ''
  )

  const filteredItems = items.filter(
    (item) => item.category?.slug === activeCategory
  )

  useLayoutEffect(() => {
    const container = containerRef.current

    if (!container) return

    const gridItems = gsap.utils.toArray<HTMLElement>(
      '.gallery__item',
      container
    )

    if (!gridItems.length) return

    const ctx = gsap.context(() => {
      gsap.from(gridItems, {
        opacity: 0,
        scale: 0.94,
        y: 20,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'all',
      })
    }, container)

    return () => ctx.revert()
  }, [activeCategory])

  /*
   * Modal
   */
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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

  return (
    <>
      <section className="sub-page-section gallery">
        <div className="inner">

          <CategoryNav
            category={categories}
            activeCategory={activeCategory}
            onChange={setActiveCategory}
          />

          <div className="gallery__grid" ref={containerRef}>
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