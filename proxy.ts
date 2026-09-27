import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const { nextUrl } = request
  const hostname = request.headers.get('host') ?? ''

  const isCms =
    hostname === 'cms.unplugged-lounge.com' ||
    hostname.startsWith('cms.localhost')

  // cms.주소.com → 내부 /studio
  if (isCms) {
    const url = nextUrl.clone()

    if (!url.pathname.startsWith('/studio')) {
      url.pathname =
        url.pathname === '/'
          ? '/studio'
          : `/studio${url.pathname}`

      return NextResponse.rewrite(url)
    }

    return NextResponse.next()
  }

  // 메인 도메인에서 /studio 접근 차단
  /*if (nextUrl.pathname.startsWith('/studio')) {
    return NextResponse.redirect(
      new URL('/', request.url)
    )
  }*/

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}