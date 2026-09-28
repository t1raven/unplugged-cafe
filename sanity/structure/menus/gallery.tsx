import type {MenuFactory} from '../types'
import {API_VERSION} from '../types'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import {ImageIcon} from '@sanity/icons/Image'
import {TiersIcon} from '@sanity/icons/Tiers'
import {CategoryCountBadge} from '../../components/StudioCountBadge'
export const createGalleryCategoryMenu: MenuFactory = (S, context) => {
  return orderableDocumentListDeskItem({
    type: 'galleryCategory',
    title: '아카이브 카테고리',
    icon: TiersIcon,
    S,
    context,
  })
}
export const createGalleryMenu: MenuFactory = (S, context) => {
  const client = context.getClient({apiVersion: API_VERSION})
  return S.listItem()
    .id('gallery-images')
    .title('아카이브 이미지')
    .icon(ImageIcon)
    .child(async () => {
      const categories =
        await client.fetch<
          {
            _id: string
            title: string
          }[]
        >(`
          *[_type == "galleryCategory"]
          | order(orderRank asc) {
            _id,
            title
          }
        `);

      return S.list()
        .id('gallery-images-category-list')
        .title('아카이브 이미지')
        .items(
          categories.map((category) =>
            orderableDocumentListDeskItem({
              type: 'galleryItem',
              id: `gallery-${category._id}`,
              title: `${category.title}`,
              icon: () => CategoryCountBadge({ type: 'galleryItem', categoryId: category._id }),

              filter:
                '_type == "galleryItem" && category._ref == $categoryId',

              params: {
                categoryId: category._id,
              },

              S,
              context,
            })
          )
        );
    })
}
