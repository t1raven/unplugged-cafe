// scripts/migrate-order-rank.ts

import {client} from '../sanity/lib/client'
import {LexoRank} from 'lexorank'

const writeClient = client.withConfig({
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

const DOCUMENT_TYPE = 'galleryItem'
const CATEGORY = '공연'

async function migrate() {
  const documents = await writeClient.fetch<
    {
      _id: string
      _createdAt: string
      orderRank?: string
    }[]
  >(
    `
      *[
        _type == $type &&
        category->slug.current == $category &&
        !(_id in path("drafts.**"))
      ]
      | order(_createdAt desc) {
        _id,
        _createdAt,
        orderRank
      }
    `,
    {
      type: DOCUMENT_TYPE,
      category: CATEGORY,
    }
  )

  console.log(`Found ${documents.length} documents`)

  if (!documents.length) return

  let rank = LexoRank.middle()

  const transaction = writeClient.transaction()

  for (const document of documents) {
    const orderRank = rank.toString()

    console.log(
      document._createdAt,
      document._id,
      '→',
      orderRank
    )

    transaction.patch(document._id, {
      set: {
        orderRank,
      },
    })

    rank = rank.genNext()
  }

  await transaction.commit()

  console.log(`Updated ${documents.length} documents`)
}

migrate().catch((error) => {
  console.error(error)
  process.exit(1)
})