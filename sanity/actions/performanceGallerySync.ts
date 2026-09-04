import {useState} from 'react'
import {LexoRank} from 'lexorank'
import {
  type DocumentActionComponent,
  type SanityClient,
  type SanityDocument,
  useClient,
  useDocumentOperation,
} from 'sanity'

import {apiVersion} from '../env'

const POSTER_CATEGORY_ID = 'b357b289-48b0-4924-b0ef-7ee003296edf'
const POSTER_CATEGORY_SLUG = '공연-포스터'
const POSTER_CATEGORY_TITLE = '공연 포스터'

type PerformanceDocument = SanityDocument & {
  title?: string
  date?: string
  poster?: {
    _type?: 'image'
    asset?: {_type?: 'reference'; _ref?: string}
    [key: string]: unknown
  }
}

function publishedId(id: string) {
  return id.replace(/^drafts\./, '')
}

function galleryIdFor(performanceId: string) {
  return `performance-poster-${performanceId}`
}

async function getPublishedPerformance(client: SanityClient, id: string) {
  // Publishing is asynchronous; wait for the canonical document, never a draft.
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const document = await client.getDocument(id)
    if (document) return document as PerformanceDocument
    await new Promise((resolve) => window.setTimeout(resolve, 250))
  }
  throw new Error('게시된 공연 문서를 확인할 수 없습니다.')
}

async function getPosterCategoryId(client: SanityClient) {
  const existingId = await client.fetch<string | null>(
    '*[_type == "galleryCategory" && (slug.current == $slug || title == $title)][0]._id',
    {slug: POSTER_CATEGORY_SLUG, title: POSTER_CATEGORY_TITLE},
  )
  if (existingId) return existingId

  await client.createIfNotExists({
    _id: POSTER_CATEGORY_ID,
    _type: 'galleryCategory',
    title: POSTER_CATEGORY_TITLE,
    slug: {_type: 'slug', current: POSTER_CATEGORY_SLUG},
    visible: true,
    orderRank: await getNewOrderRank(client, 'galleryCategory'),
  })
  return POSTER_CATEGORY_ID
}

async function getNewOrderRank(client: SanityClient, type: string) {
  const firstRank = await client.fetch<string | null>(
    '*[_type == $type && defined(orderRank)] | order(orderRank asc)[0].orderRank',
    {type},
  )

  // This is the same placement strategy as
  // orderRankField({newItemPosition: 'before'}).
  return firstRank ? LexoRank.parse(firstRank).genPrev().toString() : LexoRank.middle().toString()
}

async function syncGalleryItem(client: SanityClient, performance: PerformanceDocument) {
  const performanceId = publishedId(performance._id)
  if (!performance.title || !performance.poster?.asset?._ref) {
    throw new Error('공연명, 공연 포스터를 모두 입력한 후 게시해주세요.')
  }

  const [categoryId, existingId] = await Promise.all([
    getPosterCategoryId(client),
    client.fetch<string | null>(
      '*[_type == "galleryItem" && performance._ref == $performanceId][0]._id',
      {performanceId},
    ),
  ])
  const galleryId = existingId ?? galleryIdFor(performanceId)
  const fields = {
    title: performance.title,
    image: performance.poster,
    category: {_type: 'reference' as const, _ref: categoryId},
    performance: {_type: 'reference' as const, _ref: performanceId},
  }

  if (!existingId) {
    await client.createIfNotExists({
      _id: galleryId,
      _type: 'galleryItem',
      display: true,
      orderRank: await getNewOrderRank(client, 'galleryItem'),
      ...fields,
    })
  }
  // This preserves editor-managed description, display and order rank fields.
  //await client.createIfNotExists({_id: galleryId, _type: 'galleryItem', ...fields})
  await client.patch(galleryId).set(fields).commit()
}

export const PublishPerformanceAndSyncGalleryAction: DocumentActionComponent = (props) => {
  const client = useClient({apiVersion})
  const {publish} = useDocumentOperation(props.id, props.type)
  const [isRunning, setIsRunning] = useState(false)

  return {
    label: '게시 및 공연 포스터 동기화',
    disabled: Boolean(publish.disabled) || isRunning,
    onHandle: async () => {
      const draft = props.draft as PerformanceDocument | null
      if (!draft?.poster?.asset?._ref) {
        window.alert('공연 포스터를 등록한 후 게시해주세요.')
        return
      }

      setIsRunning(true)
      try {
        publish.execute()
        await syncGalleryItem(client, await getPublishedPerformance(client, publishedId(props.id)))
        props.onComplete()
      } catch (error) {
        console.error('Performance gallery synchronization failed', error)
        window.alert('공연은 게시되었지만 갤러리 동기화에 실패했습니다. 다시 게시해 재시도해주세요.')
      } finally {
        setIsRunning(false)
      }
    },
  }
}

export const DeletePerformanceAndGalleryAction: DocumentActionComponent = (props) => {
  const client = useClient({apiVersion})
  const {delete: deleteOperation} = useDocumentOperation(props.id, props.type)
  const [isRunning, setIsRunning] = useState(false)

  return {
    label: '공연 및 연결된 공연 포스터 삭제',
    disabled: Boolean(deleteOperation.disabled) || isRunning,
    onHandle: async () => {
      setIsRunning(true)
      try {
        const performanceId = publishedId(props.id)
        const galleryIds = await client.fetch<string[]>(
          '*[_type == "galleryItem" && performance._ref == $performanceId]._id',
          {performanceId},
        )

        if (galleryIds.length > 0) {
          let transaction = client.transaction()
          for (const galleryId of galleryIds) transaction = transaction.delete(galleryId)
          await transaction.commit()
        }

        // The strong reference is removed first, preventing a blocked deletion.
        deleteOperation.execute()
        props.onComplete()
      } catch (error) {
        console.error('Performance gallery deletion failed', error)
        window.alert('연결된 공연 포스터 삭제에 실패했습니다. 공연은 삭제되지 않았습니다.')
      } finally {
        setIsRunning(false)
      }
    },
  }
}

