import type { Metadata } from "next";

import { client } from '@/sanity/lib/client';

import SubPageHero from '@/components/common/SubPageHero';
import GoodsList from '@/components/goods/GoodsList';

import type { Category } from '@/types/category'
import type { Goods  } from '@/types/goods'

export const metadata: Metadata = {
  title: '굿즈·앨범',
};

const categoryQuery = `
  *[
    _type == "goodsCategory" 
    && visible == true
  ]
  | order(orderRank) {
    _id,
    title,
    "slug": slug.current,
  }
`;

const listQuery = `
  *[
    _type == "goodsItem" 
    && category->slug.current == $category
    && isAvailable == true
  ]
  | order(orderRank) {
    _id,
    name,
    "slug": slug.current,
    description,

    price,
    salePrice,

    quantityDiscounts[]{
      minQuantity,
      unitPrice
    },

    "category": category->{
      _id,
      title,
      "slug": slug.current
    },

    "image": image.asset->url,

    options[]{
      name,
      values
    },

    stock,
    newItem,
    bestItem,
    soldOut
  }
`;

export const revalidate = 0;

export default async function goodsPage() {
  const categories = await client.fetch<Category[]>(categoryQuery)

  const activeCategory = categories[0]?.slug ?? ''

  const items = activeCategory
      ? await client.fetch<Goods[]>(
          listQuery,
          {
            category: activeCategory,
          }
        )
      : []

  return (
    <main id="site-body" className="goods-page">
      <SubPageHero label="ALBUM·GOODS" title="굿즈·앨범" description="언플러그드 라운지에서 판매되는 <br/>다양한 라운지 상품과 아티스트 상품을 만나보세요." />
      <GoodsList categories={categories} items={items} />
    </main>
  )
}