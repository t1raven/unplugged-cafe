'use client'

import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'

import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';

import CategoryNav from '@/components/common/CategoryNav'

import type { Category } from '@/types/category'
import type { Cafe } from '@/types/cafe'

import './MenuList.scss';

interface Props {
  categories: Category[]
  items: Cafe[]
}

export default function MenuList({
  categories,
  items,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const categoryRef = useRef<HTMLElement>(null);

  const [activeCategory, setActiveCategory] = useState(
    categories[0]?.slug ?? ''
  )

  const filteredItems = items.filter(
    (item) => item.category?.slug === activeCategory
  )

  /*
   * 카테고리 변경
   */
  const handleCategoryChange = useCallback(
    async (category: string) => {

      setActiveCategory(category);

      requestAnimationFrame(() => {
        scrollToCategory();
      });
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

  useLayoutEffect(() => {
    const container = containerRef.current

    if (!container) return

    const gridItems = gsap.utils.toArray<HTMLElement>(
      '.menu-card',
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

  return (
    <>
      <CategoryNav
        category={categories}
        categoryNavRef={categoryRef}
        activeCategory={activeCategory}
        onChange={handleCategoryChange}
      />
      <section className="sub-page-section menu-content">
        <div className="inner">
          <div
            className="menu-list"
            ref={containerRef}
          >
            {filteredItems.length ? (
              <div className="menu-grid">
                {filteredItems.map((item) => (
                  <article
                    className="menu-card"
                    key={item._id}
                  >
                    
                    <div className="menu-card__image">
                      {item.imageUrl && (
                        <Image
                          src={urlFor(item.imageUrl)
                            .width(600)
                            .url()}
                          alt={item.name}
                          fill
                          priority
                          sizes="(max-width: 768px) 50vw, 400px"
                        />
                      )}
                    </div>
                    

                    <div className="menu-card__info">
                      <div className="menu-card__title">
                        <h2>{item.name}</h2>

                        <strong>
                          {item.price.toLocaleString()}원
                        </strong>
                      </div>

                      {item.description && (
                        <p>{item.description}</p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="menu-empty">
                등록된 메뉴가 없습니다.
              </div>
            )}
          </div>

        </div>
      </section>
    </>
  )
}