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
    // console.log(`currentPath`, currentPath);
    // console.log(`newPath`, newPath);

    const isRoot = newPath.startsWith("/");
    if (!isRoot) {
        return currentPath + '/' + newPath;
    }

    for (const locale of LOCALES) {
        if (currentPath.startsWith(`/${locale}/`) || currentPath == `/${locale}`) {
            return newPath === '/' ? `/${locale}` : `/${locale}${newPath}`;
        }
    }

    // currentPath == '/'
    return newPath === '/' ? `/${DEFAULT_LOCALE}` : `/${DEFAULT_LOCALE}${newPath}`;
}