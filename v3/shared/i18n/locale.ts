import { useParams, usePathname } from "next/navigation";
import { LOCALES, LOCALE_TYPE } from "../constants";
import { isAbsoluteUrl } from "../utils";

export function localedPath(path: string | undefined | null, newLocale: LOCALE_TYPE | undefined | null): string {
    if (path == null) {
        throw new Error("path must not be null or undefined");
    }
    if (newLocale == null) {
        throw new Error("new locale must not be null or undefined");
    }
    if (!LOCALES.includes(newLocale)) {
        throw new Error(`new locale must be one of ${LOCALES}`);
    }

    for (const locale of LOCALES) {
        // case: /locale/xxx/yyy/zzz ===> /newLocale/xxx/yyy/zzz
        const localePrefix1 = `/${locale}/`;
        if (path.startsWith(localePrefix1)) {
            return `/${newLocale}/${path.slice(localePrefix1.length)}`;
        }
        // case: /locale ===> /newLocale
        const localePrefix2 = `/${locale}`;
        if (path == localePrefix2) {
            return `/${newLocale}`;
        }
    }

    // path does not have a locale prefix
    if (path === "/") {
        // case: / ===> /locale
        return `/${newLocale}`;
    } else if (path.startsWith("/")) {
        // case: /xxx/yyy/zzz ===> /locale/xxx/yyy/zzz
        return `/${newLocale}${path}`;
    } else {
        // case: xxx/yyy/zzz ===> /locale/xxx/yyy/zzz
        return `/${newLocale}/${path}`;
    }
}

export function useResolvedHref(href?: string | undefined | null, locale?: LOCALE_TYPE): string {
    // use current path if href is not provided
    const pathname = usePathname();

    href ??= pathname;

    // use current locale if locale is not provided
    const { locale: currentLocale } = useParams() as { locale: LOCALE_TYPE };
    if (!locale) {
        locale = currentLocale;
    }

    // resolve href to a localed path if href is not an absolute url
    if (!isAbsoluteUrl(href)) {
        href = localedPath(href, locale);
    }

    if (!href) {
        throw new Error(`Failed to resolved href`);
    }

    return href;
}
