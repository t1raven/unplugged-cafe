'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `\app\studio\[[...tool]]\page.tsx` route
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './sanity/env'
import {schemaTypes} from './sanity/schemaTypes'
import {structure} from './sanity/structure'

import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import {koKRLocale} from '@sanity/locale-ko-kr'

import {SchemaIcon} from '@sanity/icons/Schema'
import {CalendarIcon} from '@sanity/icons/Calendar'
import {MarkerIcon} from '@sanity/icons/Marker'
import {StarIcon} from '@sanity/icons/Star'
import {BottleIcon} from '@sanity/icons/Bottle'
import {ImageIcon} from '@sanity/icons/Image'


export default defineConfig({
  basePath: '/studio',
  title: 'Unplugged Lounge CMS',
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  plugins: [
    //structureTool({structure}),
    structureTool({
      structure: (S, context) =>
        S.list()
          .id('root')
          .title('콘텐츠')
          .items([
            S.documentTypeListItem('performance')
              .id('performance')
              .title('공연 일정')
              .icon(CalendarIcon),

            S.documentTypeListItem('place')
              .id('place')
              .title('공연 장소')
              .icon(MarkerIcon),

            S.documentTypeListItem('artist')
              .id('artist')
              .title('아티스트')
              .icon(StarIcon),

            orderableDocumentListDeskItem({
              type: 'menuCategory',
              title: '메뉴 카테고리',
              icon: SchemaIcon,
              S,
              context,
            }),

            orderableDocumentListDeskItem({
              type: 'menuItem',
              title: '메뉴 아이템',
              icon: BottleIcon,
              S,
              context,
            }),

            orderableDocumentListDeskItem({
              type: 'galleryCategory',
              title: '갤러리 카테고리',
              icon: SchemaIcon,
              S,
              context,
            }),

            S.documentTypeListItem('galleryItem')
              .id('galleryItem')
              .title('갤러리 이미지')
              .icon(ImageIcon),


            ...S.documentTypeListItems().filter(
              (item) =>
                ![
                  'performance',
                  'place',
                  'artist',
                  'menuCategory',
                  'menuItem',
                  'galleryCategory',
                  'galleryItem',
                ].includes(item.getId() || '')
            ),
          ]),
    }),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({defaultApiVersion: apiVersion}),
    koKRLocale(),
  ],
  schema: {
    types: schemaTypes,
  },
})
