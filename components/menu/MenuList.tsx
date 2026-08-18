'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'

import CategoryNav from '@/components/common/CategoryNav/CategoryNav';

import type { Category } from '@/types/category';
import type { Menu } from '@/types/menu';

interface Props {
  category: Category[]
  list: Menu[]
}

export default function MenuList({ category, list }: Props) {

  const UseRef = useRef<HTMLDivElement>(null);

  const [activeCategory, setActiveCategory] = useState(
    category[0]?.slug ?? ''
  )

  const filteredItems = list.filter(
    (item) => item.category?.slug === activeCategory
  );

  /*
   * 카테고리 변경 시
   * 기존 이미지 제거 → 새 이미지 stagger 등장
   */
  useLayoutEffect(() => {

    const container = UseRef.current

    if (!container) return

    const listItems = container.querySelectorAll('.menu-card')

    if (!listItems.length) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        listItems,
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
      )
    }, container)

    return () => ctx.revert()

  }, [activeCategory])

  return (
    <section className="sub-page-section menu-content">

      <div className="inner">

        <CategoryNav
          category={category}
          activeCategory={activeCategory}
          onChange={setActiveCategory}
        />

        <div className="menu-list" ref={UseRef}>

          {filteredItems.length > 0 ? (

            <div className="menu-grid">

              {filteredItems.map((item) => (

                <article
                  className="menu-card"
                  key={item._id}
                >

                  <div className="menu-card__image">

                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={384}
                        height={480}
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
  )
}