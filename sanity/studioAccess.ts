export type StudioRole =
  | 'superAdmin'
  | 'performanceManager'
  | 'galleryManager'
  | 'cafeManager'
  | 'goodsManager'
  | 'none'

// 실제 Sanity 로그인 이메일로 변경
const SUPER_ADMINS = [
  'ezizflone@gmail.com',
  'happy321tree2749@gmail.com',
  'moyacci2mass@gmail.com',
]

const PERFORMANCE_MANAGERS = [
  'ojeongmi035@gmail.com',
]

const GALLERY_MANAGERS = [
  'gallery@example.com',
]

const CAFE_MANAGERS = [
  'moyacci2mass@gmail.com',
]

const GOODS_MANAGERS = [
  'goods@example.com',
]

const normalizeEmail = (email?: string | null) =>
  email?.trim().toLowerCase() ?? ''

export function getStudioRole(
  email?: string | null
): StudioRole {
  const target = normalizeEmail(email)

  if (!target) return 'none'

  if (
    SUPER_ADMINS.some(
      (email) => normalizeEmail(email) === target
    )
  ) {
    return 'superAdmin'
  }

  if (
    PERFORMANCE_MANAGERS.some(
      (email) => normalizeEmail(email) === target
    )
  ) {
    return 'performanceManager'
  }

  if (
    GALLERY_MANAGERS.some(
      (email) => normalizeEmail(email) === target
    )
  ) {
    return 'galleryManager'
  }

  if (
    CAFE_MANAGERS.some(
      (email) => normalizeEmail(email) === target
    )
  ) {
    return 'cafeManager'
  }

  if (
    GOODS_MANAGERS.some(
      (email) => normalizeEmail(email) === target
    )
  ) {
    return 'goodsManager'
  }

  return 'none'
}

export const ROLE_DOCUMENT_TYPES: Record<
  Exclude<StudioRole, 'none'>,
  string[]
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
  ],

  performanceManager: [
    'performance',
    'place',
    'artist',
  ],

  galleryManager: [
    'galleryCategory',
    'galleryItem',
  ],

  cafeManager: [
    'menuCategory',
    'menuItem',
  ],

  cafeManager: [
    'goodsCategory',
    'goodsItem',
  ],
}

export function getAllowedDocumentTypes(
  email?: string | null
) {
  const role = getStudioRole(email)

  if (role === 'none') {
    return []
  }

  return ROLE_DOCUMENT_TYPES[role]
}

export function canAccessDocument(
  email: string | null | undefined,
  schemaType: string
) {
  return getAllowedDocumentTypes(email).includes(schemaType)
}