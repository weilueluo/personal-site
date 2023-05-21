import { NextRequest, NextResponse } from 'next/server';

import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { DEFAULT_LOCALE, LOCALES } from './shared/constants';


// Get the preferred locale, similar to above or using a library
function getLocale(request: NextRequest) {
    const headers: { [key: string]: string } = {}
    request.headers.forEach((value, key) => {
        headers[key] = value
    })
    const languages = new Negotiator({ headers }).languages();
    return match(languages, LOCALES, DEFAULT_LOCALE);
}

export function middleware(request: NextRequest) {
    // Check if there is any supported locale in the pathname
    const pathname = request.nextUrl.pathname
    const pathnameIsMissingLocale = LOCALES.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    )

    // Redirect if there is no locale
    if (pathnameIsMissingLocale) {
        const locale = getLocale(request);
        // e.g. incoming request is /products?key=value#hash
        // The new URL is now /en/products?key=value#hash
        return NextResponse.redirect(
            new URL(`/${locale}${pathname}${request.nextUrl.search}`, request.url)
        )
    }
}

export const config = {
    matcher: [
        // matcher solution for public, api, assets and _next exclusion
        "/((?!api|static|.*\\..*|_next).*)",
    ],
}