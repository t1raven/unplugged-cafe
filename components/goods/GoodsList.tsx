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

  useLayoutEffect(() => {
    const container = containerRef.current

    if (!container) return

    const gridItems = gsap.utils.toArray<HTMLElement>(
      '.goods-card',
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
  }, [activeCategory]);

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
        <div className="inner" ref={containerRef}>
          {filteredItems.length ? (
            <div className="goods-grid">
              {filteredItems.map((item) => (
                <GoodsCard key={item._id} goods={item} onOpenOptionModal={handleOpenOptionModal} />
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