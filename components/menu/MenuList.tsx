'use client'

import {useEffect, useLayoutEffect, useRef, useState} from 'react'
import Image from 'next/image';
import gsap from 'gsap'

interface MenuCategory {
  _id: string
  title: string
  slug: string
}

interface MenuItem {
  _id: string
  name: string
  description?: string
  price: number

  category: MenuCategory | null;

  imageUrl: string;
}

interface Props {
  categories: MenuCategory[];
  items: MenuItem[];
}

export default function MenuList({ categories, items }: Props) {
  const [activeCategory, setActiveCategory] = useState(
    categories[0]?.slug ?? ''
  );

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  const filteredItems = items.filter(
    (item) => item.category?.slug === activeCategory
  );

  useLayoutEffect(() => {
    const container = menuRef.current;

    if (!container) return;

    const thumbnails = container.querySelectorAll('.menu-card');

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

  const handleCategory = (category: string) => {
    if (category === activeCategory) return;

    setSelectedIndex(null);
    setActiveCategory(category);
  };

  return (
    <section className="sub-page-section menu-content">

      <div className="inner">
        
        {/* CATEGORY */}
        <nav className="menu-category-nav">

          <div className="menu-category-nav__inner">
            {categories.map((category) => (
              <button
                key={category._id}
                type="button"
                className={
                  activeCategory === category.slug
                    ? 'active'
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
          </div>

        </nav>


        {/* MENU */}
        <div className="menu-list">

          {items.length === 0 ? (
            <div className="menu-empty">
              등록된 메뉴가 없습니다.
            </div>
          ) : (

            <div
              className="menu-grid"
              ref={menuRef}
            >
              {filteredItems.map((item, index) => (

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

                        <h2>
                          {item.name}
                        </h2>

                        <strong>
                          {item.price.toLocaleString()}원
                        </strong>

                      </div>


                      {item.description && (
                        <p>
                          {item.description}
                        </p>
                      )}

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </div>
      </div>
        
    </section>
  )
}