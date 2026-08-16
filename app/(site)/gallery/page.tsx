import type { Metadata } from 'next';

import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

import GalleryList from '@/components/gallery/GalleryList';

import './gallery.scss';

export const metadata: Metadata = {
  title: '갤러리 | UNPLUGGED CAFE',
};

const categoryQuery = `
  *[
    _type == "galleryCategory" && visible == true
  ]
  | order(orderRank) {
    _id,
    title,
    "slug": slug.current,
  }
`;

const galleryQuery = `
  *[
    _type == "galleryItem"
  ]
  | order(orderRank) {
    _id,
    title,
    description,

    "category": category->{
      _id,
      title,
      slug
    },

    image
  }
`;

export default async function GalleryPage() {
  const [categoryData, galleryData] = await Promise.all([
    client.fetch(categoryQuery),
    client.fetch(galleryQuery),
  ]);

  const galleryItems = galleryData
    .filter((item: any) => item.image?.asset)
    .map((item: any) => ({
      _id: item._id,
      title: item.title,
      description: item.description,

      category: item.category
        ? {
            _id: item.category._id,
            title: item.category.title,
            slug: item.category.slug?.current,
          }
        : null,

      imageUrl: urlFor(item.image)
        .width(1600)
        .quality(90)
        .url(),
    }));

  return (
    <main className="gallery-page">
      {/*<section className="gallery-page__header">
        <h1>Gallery</h1>
        <p>UNPLUGGED CAFE</p>
      </section>*/}

      <GalleryList categories={categoryData} items={galleryItems} />
    </main>
  );
}