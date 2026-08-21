import { NextRequest, NextResponse } from 'next/server'

import { client } from '@/sanity/lib/client'

const PAGE_SIZE = 12

const menuQuery = `
  *[
    _type == "menuItem" &&
    isAvailable == true &&
    category->slug.current == $category
  ]
  | order(orderRank asc)
  [$start...$end] {
    _id,
    name,
    description,
    price,

    "category": category->{
      _id,
      title,
      "slug": slug.current
    },

    "imageUrl": image.asset->url
  }
`

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const category = searchParams.get('category') ?? ''
  const page = Math.max(
    Number(searchParams.get('page')) || 1,
    1
  )

  const start = (page - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE

  if (!category) {
    return NextResponse.json({
      items: [],
      hasMore: false,
    })
  }

  const data = await client.fetch(
    menuQuery,
    {
      category,
      start,
      end,
    }
  )

  return NextResponse.json({
    data,
    hasMore: data.length === PAGE_SIZE,
  })
}