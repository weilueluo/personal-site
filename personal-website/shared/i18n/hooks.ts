import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { NextRequest } from "next/server";
import { cache } from "react";
import { COOKIE_KEYS } from "../cookies";
import { DEFAULT_LOCALE, LOCALES } from "./settings";

export async function getTranslation(locale: string, index: string | undefined = undefined) {
    const messages = await fetchMessages(locale, index);
    return messages;
}

async function fetchMessages(locale: string, index: string | undefined = undefined) {
    let json: any = await getLocaleMessages(locale);
    if (index) {
        json = json[index]
    }
    return json;
}

const getLocaleMessages = cache((locale: string): Promise<object> => import(`/public/messages/${locale}.json`))

export function useSetLocale(): (locale: string) => unknown {
    const localeLessPath = useLocaleLessPathname();
    const params = useSearchParams().toString();
    const router = useRouter();

    const setLocale = (locale: string) => {
        router.push(getPathWithNewLocale(locale, localeLessPath, params));
    }

    return setLocale;
}

export function useLocaleLessPathname() {
    const pathname = usePathname();
    for (const locale of LOCALES) {
        if (pathname.startsWith(`/${locale}/`)) {
            return pathname.substring(`/${locale}`.length)
        }

        if (pathname === `/${locale}`) {
            return '/'
        }
    }
    // locales not matched, default locale
    return '/'
}


export function getLocaleFromPathname(pathname: string): string {
    for (const locale of LOCALES) {
        if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
            return locale
        }
    }
    // root: '/'
    return DEFAULT_LOCALE;
}


export function getPathWithNewLocale(locale: string, localeLessPath: string, params: string) {
    return `/${locale}${localeLessPath}?${params}`;
}

export function getLocaleFromAcceptLanguage(headers: Headers): string | undefined {
    const negotiatorHeaders: Record<string, string> = {};
    headers.forEach((v, k) => negotiatorHeaders[k] = v)  // convert to object

    const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

    console.log(`accept-languages=${languages}`)

    return match(languages, LOCALES, undefined as unknown as string);
}

export function getLocaleFromCookies(request: NextRequest): string | undefined {
    const cookieLocale = request.cookies.get(COOKIE_KEYS.LOCALE)?.value;

    console.log(`cookieLocale=${cookieLocale}`)

    return undefined // TODO
    // return match(cookieLocale ? [cookieLocale] : [], LOCALES, undefined);
}