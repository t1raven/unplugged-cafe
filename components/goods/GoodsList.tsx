'use client'

import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'

import CategoryNav from '@/components/common/CategoryNav'

import GoodsCard from './GoodsCard';
import GoodsOptionModal from './GoodsOptionModal';
import CartButton from '@/components/cart/CartButton';
import CartModal from '@/components/cart/CartModal';

import type { Category } from '@/types/category'
import type { Goods } from '@/types/goods'

import './Goods.scss';

interface Props {
  categories: Category[]
  items: Goods[]
}

export default function goodsList({
  categories,
  items: initialItems,
}: Props) {

  const gridRef = useRef<HTMLDivElement>(null)
  const categoryRef = useRef<HTMLElement>(null)

  const animationContextRef = useRef<gsap.Context | null>(null)
  const previousLengthRef = useRef(0)

  const [activeCategory, setActiveCategory] = useState(
    categories[0]?.slug ?? ''
  )

  const [items, setItems] = useState<Goods[]>(
    initialItems
  )

  /*
   * 카테고리 변경
   */
  const handleCategoryChange = useCallback(
    async (category: string) => {
      if (category === activeCategory) return

      setActiveCategory(category)
      const params = new URLSearchParams({
        category,
      })

      const response = await fetch(
        `/api/goods?${params.toString()}`
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

      requestAnimationFrame(() => {
        scrollToCategory();
      });
    },
    [activeCategory]
  )

  const scrollToCategory = () => {
    const element = document.querySelector('.category_search_nav');

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

    const allItems = grid.querySelectorAll('.goods-card');

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

  const [selectedGoods, setSelectedGoods] = useState<Goods | null>(null);

  const handleOpenOptionModal = (
    goods: Goods
  ) => {
    setSelectedGoods(goods);
  };

  const handleCloseOptionModal = () => {
    setSelectedGoods(null);
  };

  return (
    <>
      <div className="category_search_nav">
        <div className="category_search_nav__inner">
          <CategoryNav
            category={categories}
            categoryNavRef={categoryRef}
            activeCategory={activeCategory}
            onChange={handleCategoryChange}
          />
        </div>
      </div>
          
      <section className="sub-page-section goods-list">
        <div className="inner">
          {items.length ? (
            <div className="goods-grid" ref={gridRef}>
              {items.map((item) => (
                <GoodsCard goods={item} onOpenOptionModal={handleOpenOptionModal} key={item._id} />
              ))}
            </div>
          ) : (
            <div className="goods-empty">
              판매 중인 상품이 없습니다.
            </div>
          )}
        </div>
      </section>

      <GoodsOptionModal
        goods={selectedGoods}
        open={selectedGoods !== null}
        onClose={
          handleCloseOptionModal
        }
      />

      <CartButton />
      <CartModal />
    </>
  )
}