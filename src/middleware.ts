import { NextRequest, NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'

import { i18n } from '../i18n-config'

const authRoutes = ['/auth']

const intlMiddleware = createIntlMiddleware({
  ...i18n,
  localePrefix: 'always',
})

const isAuthPage = (pathname: string) => {
  const localesPattern =
    i18n.locales.length > 0 ? `(${i18n.locales.join('|')})` : ''
  const authRoutesPattern = `(${authRoutes.join('|')})`
  const regex = new RegExp(
    `^/${localesPattern}${authRoutesPattern}(?:/.*)?$`,
    'i',
  )
  return regex.test(pathname)
}

export default async function middleware(request: NextRequest) {
  const token = request.cookies.get('authjs.session-token')
  const pathname = request.nextUrl.pathname
  const locale = request.nextUrl.pathname.split('/')[1]
  if (!i18n.locales.includes(locale)) {
    return intlMiddleware(request)
  }
  if (pathname === `/${locale}`) {
    return NextResponse.next()
  }

  if (!token && !isAuthPage(pathname)) {
    return NextResponse.redirect(new URL(`/${locale}/auth`, request.url))
  }
  if (token) {
    if (isAuthPage(pathname))
      return NextResponse.redirect(new URL(`/${locale}/app`, request.url))

    const session = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/session`,
    )
    if (session.status === 401) {
      const response = NextResponse.redirect(
        new URL(`/${locale}/auth`, request.url),
      )
      response.cookies.delete('authjs.session-token')
      return response
    }
    return NextResponse.next()
  }
}
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
