import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { LOCALES, DEFAULT_LOCALE } from './shared/i18n/settings';
import { COOKIE_KEYS } from './shared/cookies';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

function inferLocaleFromPathname(pathname: string): string | undefined {
  for (const locale of LOCALES) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return locale
    }
  }
  return undefined
}

function inferLocaleFromHeader(headers: Headers): string | undefined {
  const headers_: { [key: string]: string } = {}
  headers.forEach((v, k) => { headers_[k] = v })  // convert to object

  const languages = new Negotiator({ headers: headers_ }).languages();

  return match(languages, LOCALES, undefined as unknown as string);
}

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // if user specified locale in pathname, do nothing
  const pathname = request.nextUrl.pathname
  const pathnameLocale = inferLocaleFromPathname(pathname);
  if (pathnameLocale) {
    return NextResponse.next();
  }

  // check locale in user cookie, redirect
  // check locale in user header, redirect
  const headerLocale = inferLocaleFromHeader(request.headers)

  // if (headerLocale) {
  //   NextResponse.redirect()
  // }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}