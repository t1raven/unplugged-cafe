import {readFileSync} from 'node:fs'
import {createClient} from '@sanity/client'

try {
  const envFile = readFileSync('.env.local', 'utf8')

  for (const line of envFile.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)

    if (!match || process.env[match[1]]) continue

    process.env[match[1]] = match[2].replace(/^("|')|("|')$/g, '')
  }
} catch {
  // .env.local이 없어도 환경 변수로 실행할 수 있습니다.
}

const projectId = 'hjsu6mnr'
const dataset = 'production'
const apiVersion = '2025-02-19'

const token = process.env.SANITY_API_WRITE_TOKEN

if (!token) {
  throw new Error(
    'SANITY_API_WRITE_TOKEN이 없습니다. .env.local을 확인하세요.'
  )
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
})

console.log('Sanity 설정 확인:', {
  projectId,
  dataset,
  hasToken: Boolean(token),
})

type SanityDocument = {
  _id: string
  _type: string
  _rev?: string
  _createdAt?: string
  _updatedAt?: string

  [key: string]: unknown
}

type HistoryResponse = {
  documents?: SanityDocument[]
}

async function getLastRevision(id: string) {
  const url =
    `https://${projectId}.api.sanity.io/v${apiVersion}` +
    `/data/history/${dataset}/documents/${encodeURIComponent(id)}` +
    `?lastRevision=true`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error(
      `History API 오류: ${response.status} ${response.statusText}`
    )
  }

  const data = (await response.json()) as HistoryResponse

  return data.documents?.[0] ?? null
}

async function restoreData(id: string) {
  const document = await getLastRevision(id)

  if (!document) {
    console.log(`복구 이력 없음: ${id}`)
    return
  }

  if (document._type !== 'galleryItem') {
    console.log(
      `gallery 문서가 아님: ${id} (${document._type})`
    )

    return
  }

  const restoreDocument = {...document}
  delete restoreDocument._updatedAt
  delete restoreDocument._rev

  await client.createOrReplace(restoreDocument)

  console.log(`복구 완료: ${id}`)
}

async function main() {
  const ids = [
    'galleryItem-performance-50dc4a5a-a36e-41b0-8c80-6817911fb6cf',
    'galleryItem-performance-6bb57659-3c2b-4007-900e-855668f41e97',
    'galleryItem-performance-761c192d-ef30-438e-8afa-e3db5345156b',
    'galleryItem-performance-7e8a6dba-9673-45b7-8d47-b148737b0170',
    'galleryItem-performance-d61dbb92-34c5-4f61-a4d5-f16fb31569b7',
    'galleryItem-performance-ff65c4e9-1ab6-4dec-9425-06c8fa0f2bbc',
  ]

  for (const id of ids) {
    try {
      await restoreData(id)
    } catch (error) {
      console.error(`복구 실패: ${id}`, error)
    }
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})