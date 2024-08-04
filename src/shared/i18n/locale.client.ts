import { usePathname, useParams } from "next/navigation";
import { LOCALE_TYPE } from "../constants";
import { isAbsoluteUrl } from "../utils";
import { localedPath } from "./locale";

// a client util function that returns the path with new locale
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
