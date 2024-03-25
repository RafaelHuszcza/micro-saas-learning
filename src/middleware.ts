import { NextRequest, NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'

import { i18n } from '../i18n-config'
import { auth } from './services/auth'
import keycloakSessionLogOut from './utils/keycloakSessionLogOut'

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
// https://nextjs.org/docs/app/building-your-application/routing/middleware#runtime

export default async function middleware(request: NextRequest) {
  const session = await auth()
  const pathname = request.nextUrl.pathname
  const locale = request.nextUrl.pathname.split('/')[1]
  if (!i18n.locales.includes(locale)) {
    return intlMiddleware(request)
  }
  if (pathname === `/${locale}`) {
    return NextResponse.next()
  }

  if (!session && !isAuthPage(pathname)) {
    return NextResponse.redirect(new URL(`/${locale}/auth`, request.url))
  }
  if (session) {
    if (isAuthPage(pathname)) {
      return NextResponse.redirect(new URL(`/${locale}/app`, request.url))
    }
    console.log(session)
    if (session.error === 'RefreshAccessTokenError') {
      const response = NextResponse.redirect(
        new URL(`/${locale}/auth`, request.url),
      )
      response.cookies.delete('authjs.session-token')
      return response
    }
    // https://nextjs.org/docs/app/building-your-application/routing/middleware#runtime
    // if not set prisma Strategy to 'jwt' then we can't use session
    // const session = await auth()
    // if (!session) {
    //   console.log(test)
    //   const response = NextResponse.redirect(
    //     new URL(`/${locale}/auth`, request.url),
    //   )
    //   response.cookies.delete('authjs.session-token')
    //   return response
    // }

    // const session = await fetch(
    //   `${process.env.NEXT_PUBLIC_API_URL}/auth/session`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token.value}`,
    //     },
    //   },
    // )
    // if (session.status === 401) {
    //   const response = NextResponse.redirect(
    //     new URL(`/${locale}/auth`, request.url),
    //   )
    //   response.cookies.delete('authjs.session-token')
    //   return response
    // }
    return NextResponse.next()
  }
  return NextResponse.next()
}
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
