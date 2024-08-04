import { LOCALES, LOCALE_TYPE } from "../constants";

export function localedPath(path: string | undefined | null, newLocale: LOCALE_TYPE | undefined | null): string {
    if (path === null || path === undefined) {
        throw new Error("path must not be null or undefined");
    }
    if (newLocale === null || newLocale === undefined) {
        throw new Error("locale must not be null or undefined");
    }
    if (!LOCALES.includes(newLocale)) {
        throw new Error(`invalid locale: ${newLocale}, must be one of ${LOCALES}`);
    }

    for (const locale of LOCALES) {
        // case: /locale/xxx/ ===> /newLocale/xxx
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
        // case: /xxx/ ===> /locale/xxx/
        return `/${newLocale}${path}`;
    } else {
        // case: xxx/ ===> /locale/xxx/
        return `/${newLocale}/${path}`;
    }
}
