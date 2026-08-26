'use client'

import type { Category } from '@/types/category';

import './style.scss'

interface Props {
  category: Category[]
  activeCategory: string
  onChange: (slug: string) => void
}

export default function CategoryNav({ category, activeCategory, onChange }: Props) {
  return (
    <nav className={`category-nav`}>
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