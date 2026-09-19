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
import {PackageIcon} from '@sanity/icons/Package'
import {BillIcon} from '@sanity/icons/Bill'
import {CogIcon} from '@sanity/icons/Cog';
import {getStudioRole} from './studioAccess'

const API_VERSION = '2026-01-01'

export const structure: StructureResolver = async (S, context) => {
  const client = context.getClient({ apiVersion: API_VERSION })
  const role = await getStudioRole(client, context.currentUser)

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
              .title('홈')
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

        // Goods Category
        orderableDocumentListDeskItem({
          type: 'goodsCategory',
          title: '굿즈 카테고리',
          icon: TiersIcon,
          S,
          context,
        }),
        // Goods Item
        orderableDocumentListDeskItem({
          type: 'goodsItem',
          title: '굿즈 아이템',
          icon: PackageIcon,
          S,
          context,
        }),
        
        // Goods Order
        S.listItem()
          .id('purchase-management') // 고유 ID 추가
          .title('굿즈 주문내역')
          .icon(BillIcon)
          .child(
            S.list()
              .id('purchase-management-list') // 고유 ID 추가
              .title('굿즈 주문내역')
              .items([
                createOrderList(
                  S, 
                  'all-orders', 
                  '전체'
                ),

                createOrderList(
                  S,
                  'pending-orders', 
                  '신청',
                  'pending'
                ),

                createOrderList(
                  S,
                  'confirmed-orders', 
                  '확인',
                  'confirmed'
                ),

                createOrderList(
                  S,
                  'paid-orders', 
                  '입금 완료',
                  'paid'
                ),

                createOrderList(
                  S,
                  'completed-orders', 
                  '수령 완료',
                  'completed'
                ),

                createOrderList(
                  S,
                  'cancelled-orders', 
                  '취소',
                  'cancelled'
                ),
              ])
          ),
        S.divider(),

        S.listItem()
          .id('site-settings')
          .title('사이트 설정')
          .icon(CogIcon)
          .child(
            S.document()
              .schemaType('siteSettings')
              .documentId('siteSettings')
              .title('사이트 설정')
          ),

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
    return S.list()
      .id('goods-root')
      .title('굿즈 관리')
      .items([
        orderableDocumentListDeskItem({
          type: 'goodsCategory',
          title: '굿즈 카테고리',
          icon: TiersIcon,
          S,
          context,
        }),
        orderableDocumentListDeskItem({
          type: 'goodsItem',
          title: '굿즈 아이템',
          icon: PackageIcon,
          S,
          context,
        }),
        S.listItem()
          .id('purchase-management-goods') // 고유 ID 추가
          .title('구매 관리')
          .icon(BillIcon)
          .child(
            S.list()
              .id('purchase-management-list-goods') // 고유 ID 추가
              .title('구매 관리')
              .items([
                createOrderList(S, 'all-orders-goods', '전체 주문'), // ID 파라미터 추가
              ])
          ),
      ])
  }

  // ===============================
  // 권한 없는 사용자
  // ===============================
  return S.list()
    .id('no-access')
    .title('관리')
    .items([])
}

function createOrderList(
  S: Parameters<StructureResolver>[0],
  id: string,
  title: string,
  status?: string
) {
  const filter = status
    ? `_type == "purchaseOrder" && status == "${status}"`
    : `_type == "purchaseOrder"`;

  const list = S.documentList()
    .id(`${id}-list`)
    .title(title)
    .schemaType('purchaseOrder')
    .apiVersion(API_VERSION)
    .filter(filter)
    .defaultOrdering([
      {
        field: 'createdAt',
        direction: 'desc',
      },
    ]);

  if (status) {
    list.params({ status });
  }

  return S.listItem()
    .id(id)
    .title(title)
    .child(list);
}

