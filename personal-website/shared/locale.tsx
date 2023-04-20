// import { usePathname, useRouter, useSearchParams } from "next/navigation";

// export const LOCALES = ["en", "zh", "jp"];
// export const DEFAULT_LOCALE = "en";

// export interface UseLocale {
//     localeLessPathname: string;
//     locale: string;
//     setLocale: (locale: string) => void;
// }

// export function useLocale(): UseLocale {
//     const pathname = usePathname();
//     const localeLessPathname = useLocaleLessPathname(pathname);
//     const locale = extractLocale(pathname);
//     const setLocale = useSetLocaleFunction(localeLessPathname);

//     return {
//         localeLessPathname,
//         locale,
//         setLocale,
//     };
// }

// function useSetLocaleFunction(localeLessPathname: string): (locale: string) => unknown {
//     const params = useSearchParams().toString();
//     console.log(`params=${params}`);
    
//     const router = useRouter();

//     const setLocale = (locale: string) => {
//         console.log(`setLocale: locale=${locale}, localeLessPathname=${localeLessPathname}, params=${params}`);
//         console.log(`/${locale}${localeLessPathname}${params && '?'}${params}`);
        
//         router.push(`/${locale}${localeLessPathname}${params && '?'}${params}`);
//     };

//     return setLocale;
// }

// function useLocaleLessPathname(pathname: string) {
//     for (const locale of LOCALES) {
//         if (pathname.startsWith(`/${locale}/`)) {
//             return pathname.substring(`/${locale}`.length);
//         }

//         if (pathname === `/${locale}`) {
//             return "/";
//         }
//     }
//     // root: '/'
//     return "/";
// }

// function extractLocale(pathname: string): string {
//     for (const locale of LOCALES) {
//         if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
//             return locale;
//         }
//     }
//     // root: '/'
//     return DEFAULT_LOCALE;
// }


// export function getLocaleFromAcceptLanguage(headers: Headers): string | undefined {
//     const negotiatorHeaders: Record<string, string> = {};
//     headers.forEach((v, k) => (negotiatorHeaders[k] = v)); // convert to object

//     const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

//     console.log(`accept-languages=${languages}`);

//     return match(languages, LOCALES, undefined as unknown as string);
// }

// export function getLocaleFromCookies(request: NextRequest): string | undefined {
//     const cookieLocale = request.cookies.get(COOKIE_KEYS.LOCALE)?.value;

//     console.log(`cookieLocale=${cookieLocale}`);

//     return undefined; // TODO
//     // return match(cookieLocale ? [cookieLocale] : [], LOCALES, undefined);
// }