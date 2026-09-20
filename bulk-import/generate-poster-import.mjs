import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import {fileURLToPath, pathToFileURL} from 'node:url'
import {parse} from 'csv-parse/sync'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * ------------------------------------------------------
 * 설정
 * ------------------------------------------------------
 */

const CSV_FILE = path.join(__dirname, 'poster.csv')
const IMAGE_DIR = path.join(__dirname, 'images')
const OUTPUT_FILE = path.join(__dirname, 'poster.ndjson')
const ERROR_FILE = path.join(__dirname, 'poster-errors.json')

/**
 * categoryRef가 CSV에서 비어있는 경우 사용할 기본 category _id
 *
 * 필요 없다면 '' 그대로 두세요.
 */
const DEFAULT_CATEGORY_REF = 'b357b289-48b0-4924-b0ef-7ee003296edf'

/**
 * ------------------------------------------------------
 * 유틸
 * ------------------------------------------------------
 */

function clean(value) {
  if (value === undefined || value === null) {
    return ''
  }

  return String(value).trim()
}

function toBoolean(value, defaultValue = true) {
  const normalized = clean(value).toLowerCase()

  if (!normalized) {
    return defaultValue
  }

  return ['true', '1', 'yes', 'y'].includes(normalized)
}

function posterDescription(artists, date) {
  return [
    artists?.trim() && `아티스트: ${artists.trim()}`,
    date?.trim() && `공연 일시: ${date.trim()}`,
  ]
    .filter(Boolean)
    .join('\n')
}

/**
 * Sanity document ID 생성
 *
 * CSV의 id가 있으면 그것을 우선 사용합니다.
 * id가 없다면 image/title을 이용해서 hash를 생성합니다.
 */
function createDocumentId(row) {
  const customId = clean(row.id)

  if (customId) {
    const safeId = customId
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    return `performance-poster-${safeId}`
  }

  const source = [
    clean(row.image),
    clean(row.title),
  ].join('|')

  const hash = crypto
    .createHash('sha1')
    .update(source)
    .digest('hex')
    .slice(0, 16)

  return `poster-${hash}`
}

/**
 * 이미지 경로를 Sanity import용 URL로 변환
 *
 * Windows:
 *
 * C:\project\bulk-import\images\001.jpg
 *
 * ↓
 *
 * file:///C:/project/bulk-import/images/001.jpg
 */
function createAssetUrl(imagePath) {
  return `image@${pathToFileURL(imagePath).href}`
}

/**
 * ------------------------------------------------------
 * 파일 체크
 * ------------------------------------------------------
 */

if (!fs.existsSync(CSV_FILE)) {
  console.error(`❌ CSV 파일을 찾을 수 없습니다.`)
  console.error(CSV_FILE)

  process.exit(1)
}

if (!fs.existsSync(IMAGE_DIR)) {
  console.error(`❌ 이미지 폴더를 찾을 수 없습니다.`)
  console.error(IMAGE_DIR)

  process.exit(1)
}

/**
 * ------------------------------------------------------
 * CSV 읽기
 * ------------------------------------------------------
 */

const csv = fs.readFileSync(CSV_FILE, 'utf8')

const rows = parse(csv, {
  columns: true,
  skip_empty_lines: true,
  trim: true,
  bom: true,
})

console.log('')
console.log('========================================')
console.log('Sanity Bulk Import Generator')
console.log('========================================')
console.log(`CSV 데이터: ${rows.length}개`)
console.log('')

/**
 * ------------------------------------------------------
 * 데이터 변환
 * ------------------------------------------------------
 */

const documents = []

const errors = []

const documentIds = new Set()

const imageNames = new Set()

rows.forEach((row, index) => {
  const rowNumber = index + 2

  const title = clean(row.title)
  const artists = clean(row.artists)
  const date = clean(row.date)
  const image = clean(row.image)

  const categoryRef =
    clean(row.categoryRef) ||
    DEFAULT_CATEGORY_REF

  /**
   * 필수값 검사
   */

  if (!title) {
    errors.push({
      row: rowNumber,
      type: 'missing_title',
      message: 'title이 없습니다.',
    })

    return
  }

  if (!image) {
    errors.push({
      row: rowNumber,
      title,
      type: 'missing_image_name',
      message: 'image 파일명이 없습니다.',
    })

    return
  }

  const imagePath = path.resolve(
    IMAGE_DIR,
    image,
  )

  /**
   * 이미지 존재 여부 검사
   */

  if (!fs.existsSync(imagePath)) {
    errors.push({
      row: rowNumber,
      title,
      image,
      type: 'image_not_found',
      message: `이미지를 찾을 수 없습니다: ${imagePath}`,
    })

    return
  }

  /**
   * Document ID
   */

  const documentId = createDocumentId(row)

  /**
   * Document ID 중복 검사
   */

  if (documentIds.has(documentId)) {
    errors.push({
      row: rowNumber,
      title,
      documentId,
      type: 'duplicate_document_id',
      message: `중복 document ID: ${documentId}`,
    })

    return
  }

  documentIds.add(documentId)

  /**
   * 이미지 중복 체크
   *
   * 동일 이미지를 여러 document에서 사용하는 것은
   * Sanity에서는 가능하므로 오류로 처리하지 않습니다.
   */
  imageNames.add(image)

  /**
   * Sanity document
   */

  const document = {
    _id: documentId,

    _type: 'galleryItem',

    title,

    description: posterDescription(artists,date),

    image: {
      _type: 'image',

      _sanityAsset: createAssetUrl(
        imagePath,
      ),
    },

    display: true,
  }

  /**
   * description이 있을 때만 추가
   */

  /*if (description) {
    document.description = description
  }*/

  /**
   * category reference
   */

  if (categoryRef) {
    document.category = {
      _type: 'reference',
      _ref: categoryRef,
    }
  }

  /**
   * orderRank
   *
   * CSV에 값이 존재할 경우에만 넣습니다.
   */
  const orderRank = clean(row.orderRank)

  if (orderRank) {
    document.orderRank = orderRank
  }

  documents.push(document)
})

/**
 * ------------------------------------------------------
 * 오류 저장
 * ------------------------------------------------------
 */

if (errors.length > 0) {
  fs.writeFileSync(
    ERROR_FILE,
    JSON.stringify(
      errors,
      null,
      2,
    ),
    'utf8',
  )
}

/**
 * ------------------------------------------------------
 * NDJSON 생성
 * ------------------------------------------------------
 */

const ndjson = documents
  .map((document) =>
    JSON.stringify(document),
  )
  .join('\n')

fs.writeFileSync(
  OUTPUT_FILE,
  `${ndjson}\n`,
  'utf8',
)

/**
 * ------------------------------------------------------
 * 결과
 * ------------------------------------------------------
 */

console.log('----------------------------------------')
console.log(`전체 CSV        : ${rows.length}`)
console.log(`정상 데이터     : ${documents.length}`)
console.log(`오류 데이터     : ${errors.length}`)
console.log(`사용 이미지     : ${imageNames.size}`)
console.log('----------------------------------------')

console.log('')

console.log(
  `✅ NDJSON 생성 완료`,
)

console.log(
  OUTPUT_FILE,
)

if (errors.length > 0) {
  console.log('')

  console.log(
    `⚠️ 오류 목록`,
  )

  console.log(
    ERROR_FILE,
  )

  console.log('')

  errors
    .slice(0, 20)
    .forEach((error) => {
      console.log(
        `[${error.row}행] ${error.message}`,
      )
    })

  if (errors.length > 20) {
    console.log(
      `외 ${errors.length - 20}개`,
    )
  }
}

console.log('')