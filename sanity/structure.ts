import type {StructureResolver} from 'sanity/structure'

import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'

import {CalendarIcon} from '@sanity/icons/Calendar'
import {MarkerIcon} from '@sanity/icons/Marker'
import {StarIcon} from '@sanity/icons/Star'
import {BottleIcon} from '@sanity/icons/Bottle'
import {ImageIcon} from '@sanity/icons/Image'
import {HomeIcon} from '@sanity/icons/Home'
import {TiersIcon} from '@sanity/icons/Tiers'
import {UsersIcon} from '@sanity/icons/Users'

import {getStudioRole} from './studioAccess'

export const structure: StructureResolver = async (S, context) => {

  const client = context.getClient({
    apiVersion: '2026-01-01',
  })

  const role = await getStudioRole(
    client,
    context.currentUser
  )

  // ===============================
  // 최고관리자
  // ===============================
  if (role === 'superAdmin') {
    return S.list()
      .id('root')
      .title('관리')
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

        S.divider(),

        // Performance
        S.documentTypeListItem('performance')
          .title('공연 일정')
          .icon(CalendarIcon),

        // Place
        S.documentTypeListItem('place')
          .title('공연 장소')
          .icon(MarkerIcon),

        // Artist
        S.documentTypeListItem('artist')
          .title('아티스트')
          .icon(StarIcon),

        S.divider(),

        // Cafe Category
        orderableDocumentListDeskItem({
          type: 'menuCategory',
          title: '카페 카테고리',
          icon: TiersIcon,
          S,
          context,
        }),

        // Cafe Menu
        orderableDocumentListDeskItem({
          type: 'menuItem',
          title: '카페 메뉴',
          icon: BottleIcon,
          S,
          context,
        }),

        S.divider(),

        // Gallery Category
        orderableDocumentListDeskItem({
          type: 'galleryCategory',
          title: '아카이브 카테고리',
          icon: TiersIcon,
          S,
          context,
        }),

        // Gallery Item
        orderableDocumentListDeskItem({
          type: 'galleryItem',
          title: '아카이브 이미지',
          icon: ImageIcon,
          S,
          context,
        }),

        S.divider(),

        S.documentTypeListItem('studioUser')
          .title('관리자 계정')
          .icon(UsersIcon),
      ])
  }

  // ===============================
  // 공연관리자
  // ===============================
  if (role === 'performanceManager') {
    return S.list()
      .id('performance-root')
      .title('공연 관리')
      .items([
        S.documentTypeListItem('performance')
          .title('공연 일정')
          .icon(CalendarIcon),

        S.documentTypeListItem('place')
          .title('공연 장소')
          .icon(MarkerIcon),

        S.documentTypeListItem('artist')
          .title('아티스트')
          .icon(StarIcon),
      ])
  }

  // ===============================
  // 아카이브관리자
  // ===============================
  if (role === 'galleryManager') {
    return S.list()
      .id('gallery-root')
      .title('아카이브 관리')
      .items([
        orderableDocumentListDeskItem({
          type: 'galleryCategory',
          title: '아카이브 카테고리',
          icon: TiersIcon,
          S,
          context,
        }),

        orderableDocumentListDeskItem({
          type: 'galleryItem',
          title: '아카이브 이미지',
          icon: ImageIcon,
          S,
          context,
        }),
      ])
  }

  // ===============================
  // 카페관리자
  // ===============================
  if (role === 'cafeManager') {
    return S.list()
      .id('cafe-root')
      .title('카페 관리')
      .items([
        orderableDocumentListDeskItem({
          type: 'menuCategory',
          title: '카페 카테고리',
          icon: TiersIcon,
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
      ])
  }

  // ===============================
  // 굿즈관리자
  // ===============================
  if (role === 'goodsManager') {

  }

  // ===============================
  // 권한 없는 사용자
  // ===============================
  return S.list()
    .id('no-access')
    .title('관리')
    .items([])
}
