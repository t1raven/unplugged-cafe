import type {StructureResolver} from 'sanity/structure'

import { getStudioRole } from './studioAccess'

import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'

import {CalendarIcon} from '@sanity/icons/Calendar'
import {MarkerIcon} from '@sanity/icons/Marker'
import {StarIcon} from '@sanity/icons/Star'
import {BottleIcon} from '@sanity/icons/Bottle'
import {ImageIcon} from '@sanity/icons/Image'
import {HomeIcon} from '@sanity/icons/Home'
import {TiersIcon} from '@sanity/icons/Tiers'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S, context) => {

  const email = context.currentUser?.email
  const role = getStudioRole(email)

  /**
   * ========================================
   * 최고관리자
   * ========================================
   */
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
      ])
  }

  /**
   * ========================================
   * 공연관리자
   * ========================================
   */
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

  /**
   * ========================================
   * 갤러리관리자
   * ========================================
   */
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

  /**
   * ========================================
   * 카페관리자
   * ========================================
   */
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

  /**
   * ========================================
   * 굿즈관리자
   * ========================================
   */
  if (role === 'goodsManager') {

  }

  /**
   * ========================================
   * 권한 없는 사용자
   * ========================================
   */
  return S.list()
    .id('no-access')
    .title('관리')
    .items([])
}
