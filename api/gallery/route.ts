import { NextRequest, NextResponse } from 'next/server'

import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'

const PAGE_SIZE = 12

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const page = Math.max(
    Number(searchParams.get('page')) || 1,
    1
  )

  const category = searchParams.get('category') || ''

  const start = (page - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE

  const query = `
    *[
      _type == "gallery"
      && isPublished == true
      ${category ? `&& category->slug.current == $category` : ''}
    ]
    | order(orderRank asc, _createdAt desc)
    [$start...$end] {
      _id,
      title,
      description,

      "category": category->{
        _id,
        title,
        "slug": slug.current
      },

      image
    }
  `

  const data = await client.fetch(
    query,
    {
      category,
      start,
      end,
    }
  )

  const items = data.map((item: any) => ({
    ...item,

    imageUrl: item.image?.asset
      ? urlFor(item.image)
          .width(800)
          .quality(85)
          .auto('format')
          .url()
      : '',
  }))

  return NextResponse.json({
    items,
    hasMore: items.length === PAGE_SIZE,
    page,
  })
}