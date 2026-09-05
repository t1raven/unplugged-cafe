'use client';

import { useEffect, useCallback, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';

import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';

import CategoryNav from '@/components/common/CategoryNav'
import ArchiveModal from './ArchiveModal';

import type { Category } from '@/types/category';
import type { Archive } from '@/types/archive';

import './ArchiveList.scss';

const PAGE_SIZE = 12;

interface Props {
  categories: Category[];
  items: Archive[];
}

export default function ArchiveList({
  categories,
  items: initialItems,
}: Props) {

  const [activeCategory, setActiveCategory] = useState(
    categories[0]?.slug ?? ''
  )

  const [items, setItems] = useState<Archive[]>(
    initialItems
  )

  const [page, setPage] = useState(1)

  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(
    initialItems.length === PAGE_SIZE
  )

  const pageRef = useRef(1)
  const gridRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const categoryRef = useRef<HTMLElement>(null);

  const animationContextRef = useRef<gsap.Context | null>(null)
  const previousLengthRef = useRef(0)

  /*
   * 다음 페이지 로드
   */
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)

    try {
      const nextPage = page + 1

      const params = new URLSearchParams({
        category: activeCategory,
        page: String(nextPage),
      })

      const response = await fetch(
        `/api/archives?${params.toString()}`
      )

      if (!response.ok) {
        throw new Error('데이터를 불러오지 못했습니다.')
      }

      const data = await response.json()

      previousLengthRef.current = items.length;

      setItems((prev) => [
        ...prev,
        ...data.items,
      ])

      setPage(nextPage)
      setHasMore(data.hasMore)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [
    page,
    activeCategory,
    loading,
    hasMore,
  ])

  /*
   * IntersectionObserver
   */
  useEffect(() => {
    const sentinel = sentinelRef.current

    if (!sentinel || !hasMore) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore()
        }
      },
      {
        //rootMargin: `${window.innerHeight * 0.2}px 0px`,
        rootMargin: `0px`,
      }
    )

    observer.observe(sentinel)

    return () => observer.disconnect()
  }, [
    loadMore,
    hasMore,
  ])

  /*
   * 카테고리 변경
   */
  const handleCategoryChange = useCallback(
    async (category: string) => {
      if (category === activeCategory) return

      setActiveCategory(category)
      setPage(1)
      setHasMore(true)
      setLoading(true)

      try {
        const params = new URLSearchParams({
          category,
          page: '1',
        })

        const response = await fetch(
          `/api/archives?${params.toString()}`
        )

        if (!response.ok) {
          throw new Error(
            '데이터를 불러오지 못했습니다.'
          )
        }

        const data = await response.json()

        animationContextRef.current?.revert();
        animationContextRef.current = null;
        previousLengthRef.current = 0;

        setItems(data.items)
        setHasMore(data.hasMore)

        requestAnimationFrame(() => {
          scrollToCategory();
        });
      } catch (error) {
        console.error(error)
        setItems([])
        setHasMore(false)
      } finally {
        setLoading(false)
      }
    },
    [activeCategory]
  )

  const scrollToCategory = () => {
    const element = categoryRef.current;

    if (!element) return;

    const elementPrev = element.previousElementSibling;

    if(elementPrev!.scrollHeight >= window.scrollY) return;

    const header = document.getElementById('site-header');

    const top = elementPrev!.scrollHeight - header!.getBoundingClientRect().height

    window.scrollTo({
      top,
      behavior: 'smooth',
    });
  };

  /*
   *  등장 애니메이션
   */
  useLayoutEffect(() => {
    const grid = gridRef.current

    if (!grid || items.length === 0) return

    const previousLength = previousLengthRef.current;

    const allItems = grid.querySelectorAll('.gallery__item');

    const newItems = Array.from(allItems).slice(
      previousLength
    );

    if (!newItems.length) return;

    animationContextRef.current?.revert();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        newItems,
        {
          opacity: 0,
          y: 30,
          scale: 0.96,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out',
          clearProps: 'all',
        }
      );
    }, grid)

    animationContextRef.current = ctx;

    previousLengthRef.current = items.length;

  }, [items])

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
    setSelectedIndex((current) => {
      if (current === null || items.length === 0) {
        return current;
      }

      return current === 0
        ? items.length - 1
        : current - 1;
    });
  }, [items.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex((current) => {
      if (current === null || items.length === 0) {
        return current;
      }

      return current === items.length - 1
        ? 0
        : current + 1;
    });
  }, [items.length]);


  /*
   * Modal 열렸을 때 body scroll 방지
   */
  useEffect(() => {
    document.body.style.overflow =
      selectedIndex !== null
        ? 'hidden'
        : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedIndex]);

  return (
    <>
      <CategoryNav
        category={categories}
        categoryNavRef={categoryRef}
        activeCategory={activeCategory}
        onChange={handleCategoryChange}
      />
      <section className="sub-page-section gallery">
        <div className="inner">
          <div className="gallery__list" ref={gridRef}>
            {items.length > 0 ? (
              <div className="gallery__grid">
                {items.map((item, index) => (
                  <button
                    key={item._id}
                    type="button"
                    className="gallery__item"
                    onClick={() => handleOpenModal(index)}
                  >
                    <div className="gallery__image">
                      <Image
                        src={urlFor(item.imageUrl)
                          .width(600)
                          .url()}
                        alt={item.title}
                        fill
                        priority
                        sizes="(max-width: 768px) 50vw, 600px"
                      />
                    </div>

                    <div className="gallery__info">
                      <h3>{item.title}</h3>
                    </div>
                  </button>
                ))}
              </div>
            ) : !loading ? (
              <div className="gallery__empty">
                등록된 이미지가 없습니다.
              </div>
            ) : null}

            {/* 무한스크롤 감지 영역 */}
            {hasMore && (
              <div
                ref={sentinelRef}
                className="gallery__sentinel"
                aria-hidden="true"
              />
            )}

            {/*{loading && (
              <div className="gallery__loading">
                Loading...
              </div>
            )}*/}
          </div>
        </div>
      </section>

      {selectedIndex !== null && (
        <ArchiveModal
          items={items}
          currentIndex={selectedIndex}
          onClose={handleCloseModal}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </>
  );
}