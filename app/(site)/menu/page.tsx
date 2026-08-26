import type { Metadata } from 'next'

import { client } from '@/sanity/lib/client'

import SubPageHero from '@/components/common/SubPageHero';
import MenuList from '@/components/menu/MenuList'

import type { Category } from '@/types/category'
import type { Menu } from '@/types/menu'

import './menu.scss'

export const metadata: Metadata = {
  title: '메뉴 | UNPLUGGED LOUNGE',
}

const categoryQuery = `
  *[
    _type == "menuCategory"
  ]
  | order(orderRank) {
    _id,
    title,
    "slug": slug.current
  }
`

const listQuery = `
  *[
    _type == "menuItem" &&
    isAvailable == true
  ]
  | order(orderRank) {
    _id,
    name,
    description,
    price,

    "category": category->{
      _id,
      title,
      "slug": slug.current
    },

    "imageUrl": image.asset->url
  }
`

export default async function MenuPage() {
  const [categories, items] = await Promise.all([
    client.fetch<Category[]>(categoryQuery),
    client.fetch<Menu[]>(listQuery),
  ])

  return (
    <main id="site-body" className="menu-page">

      <SubPageHero label="CAFE MENU" title="서교음악다방" description="음악과 사람이 머무는 카페<br/> 자유롭고 아름다운 추억이 가득한 청춘 쉼터" />
      <MenuList categories={categories} items={items} />
    </main>
  )
}