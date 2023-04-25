import path from "path";
import { DEFAULT_LOCALE, LOCALES } from "./constants";

export function replaceLocale(path: string, oldLocale: string, newLocale: string) {
    const localePrefix1 = `/${oldLocale}/`;
    if (path.startsWith(localePrefix1)) {
        return `/${newLocale}/${path.slice(localePrefix1.length)}`;
    }
    const localePrefix2 = `/${oldLocale}`;
    if (path == localePrefix2) {
        return `/${newLocale}`;
    }
    // path == '/'
    return newLocale == DEFAULT_LOCALE ? path : `/${newLocale}`;
}

// currentPath: with locale prefix
// newPath: without locale prefix
export function getPathWithLocale(currentPath: string, newPath: string) {
    const isRoot = newPath.startsWith("/");
    if (!isRoot) {
        return currentPath + '/' + newPath;
    }

    for (const locale of LOCALES) {
        const localePrefix1 = `/${locale}/`;
        if (currentPath.startsWith(localePrefix1)) {
            return  `/${locale}${newPath}`;
        }

        const localePrefix2 = `/${locale}`;
        if (currentPath == localePrefix2) {
            return  `/${locale}${newPath}`;
        }
    }

    // currentPath == '/'
    return `/${DEFAULT_LOCALE}${newPath}`;
}