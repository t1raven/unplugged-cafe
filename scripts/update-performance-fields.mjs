import fs from 'node:fs'
import readline from 'node:readline'
import {getCliClient} from 'sanity/cli'

const DEFAULT_SOURCE =
  'C:/Users/eziz/Desktop/posts_improt/unplugged_lounge_all/performance.ndjson'
const FIELDS = ['salesOpen', 'salesClose', 'price1', 'price2', 'description']
const BATCH_SIZE = 50

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const source = args.find((arg) => !arg.startsWith('--')) ?? DEFAULT_SOURCE
const client = getCliClient({apiVersion: '2025-02-19'})

async function readDocuments(filePath) {
  const documents = []
  const input = fs.createReadStream(filePath, {encoding: 'utf8'})
  const lines = readline.createInterface({input, crlfDelay: Infinity})

  let lineNumber = 0
  for await (const line of lines) {
    lineNumber += 1
    if (!line.trim()) continue

    let document
    try {
      document = JSON.parse(line)
    } catch (error) {
      throw new Error(`${lineNumber}번째 줄의 JSON을 읽을 수 없습니다: ${error.message}`)
    }

    if (!document._id || document._type !== 'performance') {
      throw new Error(`${lineNumber}번째 줄에 올바른 performance 문서 ID가 없습니다.`)
    }
    documents.push(document)
  }

  return documents
}

function makePatch(document) {
  const set = {}
  const unset = []

  for (const field of FIELDS) {
    if (Object.hasOwn(document, field) && document[field] !== null) {
      set[field] = document[field]
    } else {
      unset.push(field)
    }
  }

  return {set, unset}
}

const documents = await readDocuments(source)
const duplicateIds = documents
  .map(({_id}) => _id)
  .filter((id, index, ids) => ids.indexOf(id) !== index)

if (duplicateIds.length > 0) {
  throw new Error(`중복 _id가 있습니다: ${[...new Set(duplicateIds)].join(', ')}`)
}

if (dryRun) {
  const unsetCounts = Object.fromEntries(
    FIELDS.map((field) => [field, documents.filter((doc) => !Object.hasOwn(doc, field) || doc[field] === null).length]),
  )
  console.log(JSON.stringify({source, documents: documents.length, fields: FIELDS, unsetCounts}, null, 2))
  console.log('DRY RUN 완료: Sanity에는 변경사항을 전송하지 않았습니다.')
  process.exit(0)
}

const sourceIds = documents.map(({_id}) => _id)
const existingIds = await client.fetch('*[_id in $ids]._id', {ids: sourceIds})
const existingIdSet = new Set(existingIds)
const missingIds = sourceIds.filter((id) => !existingIdSet.has(id))

if (missingIds.length > 0) {
  throw new Error(
    `Sanity에 없는 performance 문서가 ${missingIds.length}개 있습니다. 변경을 시작하지 않았습니다:\n${missingIds.join('\n')}`,
  )
}

let updated = 0
for (let offset = 0; offset < documents.length; offset += BATCH_SIZE) {
  const batch = documents.slice(offset, offset + BATCH_SIZE)
  let transaction = client.transaction()

  for (const document of batch) {
    transaction = transaction.patch(document._id, makePatch(document))
  }

  await transaction.commit({visibility: 'sync'})
  updated += batch.length
  console.log(`${updated}/${documents.length}개 문서 업데이트 완료`)
}

console.log(`완료: ${updated}개 performance 문서에서 ${FIELDS.join(', ')} 필드만 업데이트했습니다.`)
