import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { i18n } from '../i18n-config';


const authRoutes = ['/auth'];

const intlMiddleware = createIntlMiddleware({
  ...i18n, localePrefix: 'always'
});


const isAuthPage = (pathname: string) => {
  const localesPattern = i18n.locales.length > 0 ? `(${i18n.locales.join('|')})` : '';
  const authRoutesPattern = `(${authRoutes.join('|')})`;
  const regex = new RegExp(`^/${localesPattern}${authRoutesPattern}(?:/.*)?$`, 'i');
  return regex.test(pathname);
}


export default function middleware(request: NextRequest) {
  const token = request.cookies.get("authjs.session-token");
  const pathname = request.nextUrl.pathname;
  const locale = request.nextUrl.pathname.split('/')[1]
  if (!i18n.locales.includes(locale)) {
    return intlMiddleware(request);
  }
  if (isAuthPage(pathname) && token) {
    return NextResponse.redirect(new URL(`/${locale}/app`, request.url))
  }
  if (!token && !isAuthPage(pathname)) {
    return NextResponse.redirect(new URL(`/${locale}/auth`, request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)',]
};
