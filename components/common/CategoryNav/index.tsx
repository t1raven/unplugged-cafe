'use client'

import { RefObject } from 'react'
import type { Category } from '@/types/category';

import './style.scss'

interface Props {
  category: Category[]
  activeCategory: string
  onChange: (slug: string) => void
  categoryNavRef: RefObject<HTMLElement | null>
}

export default function CategoryNav({ category, activeCategory, onChange, categoryNavRef}: Props) {
  return (
    <nav className={`category-nav`} ref={categoryNavRef}>
      <div className="category-nav__inner">
        {category.map((category) => (
          <button
            key={category._id}
            type="button"
            className={ activeCategory === category.slug ? 'active' : '' }
            onClick={() => onChange(category.slug)}
          >
            {category.title}
          </button>
        ))}
      </div>
    </nav>
  )
}