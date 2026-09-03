'use client'

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

import {apiVersion, dataset, projectId} from './sanity/env'
import {schemaTypes} from './sanity/schemaTypes'

import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import {koKRLocale} from '@sanity/locale-ko-kr'

import {SchemaIcon} from '@sanity/icons/Schema'
import {CalendarIcon} from '@sanity/icons/Calendar'
import {MarkerIcon} from '@sanity/icons/Marker'
import {StarIcon} from '@sanity/icons/Star'
import {BottleIcon} from '@sanity/icons/Bottle'
import {ImageIcon} from '@sanity/icons/Image'
import {HomeIcon} from '@sanity/icons/Home'

export default defineConfig({
  basePath: '/studio',
  title: 'Unplugged Lounge CMS',

  projectId,
  dataset,

  plugins: [
    structureTool({
      structure: (S, context) =>
        S.list()
          .id('root')
          .title('콘텐츠')
          .items([
            // Home Singleton
            S.listItem()
              .id('home')
              .title('홈')
              .icon(HomeIcon)
              .child(
                S.document()
                  .schemaType('home')
                  .documentId('home')
              ),
             /*S.documentTypeListItem('home')
              .id('home')
              .title('홈')
              .icon(HomeIcon),*/

            // Performance
            S.documentTypeListItem('performance')
              .id('performance')
              .title('공연 일정')
              .icon(CalendarIcon),

            // Place
            S.documentTypeListItem('place')
              .id('place')
              .title('공연 장소')
              .icon(MarkerIcon),

            // Artist
            S.documentTypeListItem('artist')
              .id('artist')
              .title('아티스트')
              .icon(StarIcon),

            // Cafe
            orderableDocumentListDeskItem({
              type: 'menuCategory',
              title: '카페 카테고리',
              icon: SchemaIcon,
              S,
              context,
            }),

            orderableDocumentListDeskItem({
              type: 'menuItem',
              title: '카페 메뉴',
              icon: BottleIcon,
              S,
              context,
            }),

            // Archives
            orderableDocumentListDeskItem({
              type: 'galleryCategory',
              title: '기록 카테고리',
              icon: SchemaIcon,
              S,
              context,
            }),

            orderableDocumentListDeskItem({
              type: 'galleryItem',
              title: '기록 이미지',
              icon: ImageIcon,
              S,
              context,
            }),

            // 기타 document
            ...S.documentTypeListItems().filter(
              (item) =>
                ![
                  'home',
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

    visionTool({
      defaultApiVersion: apiVersion,
    }),

    koKRLocale(),
  ],

  schema: {
    types: schemaTypes,
  },
})