import type { Metadata } from 'next';

import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

import MenuList from '@/components/menu/MenuList';

import './menu.scss';

export const metadata: Metadata = {
  title: "메뉴 | UNPLUGGED LOUNGE",
};

const categoryQuery = `
  *[_type == "menuCategory"]
  | order(orderRank) {
    _id,
    title,
    "slug": slug.current,
  }
`;

const listQuery = `
  *[
    _type == "menuItem"
    && isAvailable == true
  ]
  | order(orderRank) {
    _id,
    name,
    description,
    price,
    new,
    best,

    "category": category->{
      _id,
      title,
      "slug": slug.current,
    },

    image
  }
`;

export default async function MenuPage() {
  const [categoryData, listData] = await Promise.all([
    client.fetch(categoryQuery),
    client.fetch(listQuery),
  ])

  const list = listData.map((item: any) => ({
    _id: item._id,
    name: item.name,
    description: item.description,
    price: item.price,

    category: item.category
      ? {
          _id: item.category._id,
          title: item.category.title,
          slug: item.category.slug,
        }
      : null,

    imageUrl: item.image?.asset
      ? urlFor(item.image)
          .width(1600)
          .quality(90)
          .url()
      : '',
  }))

  return (
    <main id="site-body" className="menu-page">
      
      {/*<section className="sub-page-section menu-intro">
        <div className="inner">
          <p>UNPLUGGED CAFE</p>
          <h1>MENU</h1>
        </div>
      </section>*/}
      <section className="sub-page-hero">
        <div className="sub-page-hero__inner">
          <p className="sub-page-hero-label">CAFE MENU</p>
          <h1>서교음악다방</h1>
          <p className="sub-page-hero__description">
            음악과 사람이 머무는 카페<br/>
            자유롭고 아름다운 추억이 가득한 청춘 쉼터
          </p>
        </div>
      </section>

      <MenuList category={categoryData} list={list} />

    </main>
  )
}