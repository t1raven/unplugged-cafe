import {client} from '../sanity/lib/client'

const writeClient = client.withConfig({
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

async function removeOldDocuments() {
  const dateTime = '2026-09-20T07:47:00Z'

  const query = `
    *[
      _type == "galleryItem" &&
      _createdAt >= dateTime &&
      !(_id in path("drafts.**"))
    ]
  `

  const targets = await writeClient.fetch<
    {
      _id: string
      _createdAt: string
    }[]
  >(`
    ${query} {
      _id,
      _createdAt
    }
  `, {
    dateTime,
  })

  console.log(`삭제 대상: ${targets.length}개`)

  for (const doc of targets) {
    console.log(doc._createdAt, doc._id)
  }

  if (!targets.length) return

  const result = await writeClient.delete({
    query,
    params: {
      dateTime,
    },
  })

  console.log('삭제 완료', result)
}

removeOldDocuments().catch((error) => {
  console.error(error)
  process.exit(1)
})