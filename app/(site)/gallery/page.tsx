import type { Metadata } from 'next';

import { client } from '@/sanity/lib/client';

import GalleryList from '@/components/gallery/GalleryList';

import type { Category } from '@/types/category'
import type { Gallery } from '@/types/gallery'

import './gallery.scss';

export const metadata: Metadata = {
  title: '갤러리 | UNPLUGGED CAFE',
};

const categoryQuery = `
  *[
    _type == "galleryCategory" 
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
    _type == "galleryItem" 
    && category->slug.current == $category
  ]
  | order(_createdAt desc) 
  [0...12] {
    _id,
    title,
    description,

    "category": category->{
      _id,
      title,
      "slug": slug.current
    },

    "imageUrl": image.asset->url
  }
`;

export default async function GalleryPage() {
  const categories = await client.fetch<Category[]>(categoryQuery)

  const activeCategory = categories[0]?.slug ?? ''

  const items =
    activeCategory
      ? await client.fetch<Gallery[]>(
          listQuery,
          {
            category: activeCategory,
          }
        )
      : []

  return (
    <main id="site-body" className="gallery-page">

      <section className="sub-page-hero">
        <div className="sub-page-hero__inner">
          <p className="sub-page-hero-label">Gallery</p>
          <h1>언플러그드 <br/>Moments</h1>
          <p className="sub-page-hero__description">
            우리의 음악이 함께 하는 순간들
          </p>
        </div>
      </section>

      <GalleryList categories={categories} items={items} />
    </main>
  );
}