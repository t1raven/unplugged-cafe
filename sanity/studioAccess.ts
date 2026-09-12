import type {CurrentUser, SanityClient} from 'sanity'

export type StudioRole =
  | 'superAdmin'
  | 'performanceManager'
  | 'galleryManager'
  | 'cafeManager'
  | 'goodsManager'
  | 'none'

export type StudioUser = {
  _id: string
  name?: string
  email?: string
  role: StudioRole
  enabled?: boolean
}

/**
 * 최초 최고관리자.
 *
 * studioUser 데이터가 잘못되거나 모두 삭제되어도
 * Studio 관리가 가능하도록 1명만 코드에 남겨둡니다.
 *
 * 실제 Sanity 로그인 이메일로 변경하세요.
 */
const ROOT_ADMIN_EMAIL =
  process.env.NEXT_PUBLIC_SANITY_ROOT_ADMIN_EMAIL ?? ''

/**
 * Role별 접근 가능한 document type
 */
export const ROLE_DOCUMENT_TYPES: Record<
  Exclude<StudioRole, 'none'>,
  readonly string[]
> = {
  superAdmin: [
    'home',

    'performance',
    'place',
    'artist',

    'menuCategory',
    'menuItem',

    'galleryCategory',
    'galleryItem',

    'studioUser',
  ],

  performanceManager: [
    'performance',
    'place',
    'artist',
  ],

  cafeManager: [
    'menuCategory',
    'menuItem',
  ],

  galleryManager: [
    'galleryCategory',
    'galleryItem',
  ],

  goodsManager: [
    'goodsCategory',
    'goodsItem',
  ],
}

/**
 * 이메일 정규화
 */
export function normalizeEmail(
  email?: string | null
): string {
  return email?.trim().toLowerCase() ?? ''
}

/**
 * Root Admin 여부
 */
export function isRootAdmin(
  email?: string | null
): boolean {
  const currentEmail = normalizeEmail(email)
  const rootEmail = normalizeEmail(ROOT_ADMIN_EMAIL)

  if (!currentEmail || !rootEmail) {
    return false
  }

  return currentEmail === rootEmail
}

/**
 * 현재 로그인 사용자에 해당하는
 * studioUser document 조회
 */
export async function getStudioUser(
  client: SanityClient,
  currentUser?: CurrentUser | null
): Promise<StudioUser | null> {
  const email = normalizeEmail(
    currentUser?.email
  )

  if (!email) {
    return null
  }

  return client.fetch<StudioUser | null>(
    `
      *[
        _type == "studioUser"
        && lower(email) == $email
        && enabled == true
      ][0] {
        _id,
        name,
        email,
        role,
        enabled
      }
    `,
    {
      email,
    }
  )
}

/**
 * 현재 로그인 사용자의 Studio Role 반환
 *
 * 우선순위
 *
 * 1. Root Admin
 * 2. studioUser 문서
 * 3. none
 */
export async function getStudioRole(
  client: SanityClient,
  currentUser?: CurrentUser | null
): Promise<StudioRole> {
  const email = currentUser?.email

  // Root Admin은 studioUser 데이터와 관계없이
  // 항상 최고관리자
  if (isRootAdmin(email)) {
    return 'superAdmin'
  }

  const studioUser = await getStudioUser(
    client,
    currentUser
  )

  if (!studioUser?.role) {
    return 'none'
  }

  return studioUser.role
}

/**
 * Role별 접근 가능한 document type 목록
 */
export function getAllowedDocumentTypes(
  role: StudioRole
): readonly string[] {
  if (role === 'none') {
    return []
  }

  return ROLE_DOCUMENT_TYPES[role]
}

/**
 * 특정 document type 접근 가능 여부
 */
export function canAccessDocument(
  role: StudioRole,
  schemaType: string
): boolean {
  if (role === 'none') {
    return false
  }

  return ROLE_DOCUMENT_TYPES[role].includes(
    schemaType
  )
}

/**
 * 최고관리자 여부
 */
export function isSuperAdmin(
  role: StudioRole
): boolean {
  return role === 'superAdmin'
}

/**
 * 공연관리 권한 여부
 */
export function canManagePerformance(
  role: StudioRole
): boolean {
  return (
    role === 'superAdmin' ||
    role === 'performanceManager'
  )
}

/**
 * 카페 메뉴 관리 권한
 */
export function canManageCafe(
  role: StudioRole
): boolean {
  return role === 'superAdmin'
  return role === 'cafeManager'
}

/**
 * 아카이브 관리 권한 여부
 */
export function canManageGallery(
  role: StudioRole
): boolean {
  return (
    role === 'superAdmin' ||
    role === 'galleryManager'
  )
}

/**
 * 굿즈 관리 권한
 */
export function canManageGoods(
  role: StudioRole
): boolean {
  return role === 'superAdmin'
  return role === 'goodsManager'
}