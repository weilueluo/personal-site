import { DEFAULT_LOCALE, LOCALES } from "@/shared/constants";

export const routing = {
    locales: LOCALES,
    defaultLocale: DEFAULT_LOCALE,
    localePrefix: "always",
} as const;
