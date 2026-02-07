import { getRequestConfig } from "next-intl/server";
import { DEFAULT_LOCALE, LOCALES } from "@/shared/constants";

function setNestedValue(target: Record<string, unknown>, path: string, value: string) {
    const parts = path.split(".");
    let current: Record<string, unknown> = target;
    for (let i = 0; i < parts.length; i++) {
        const key = parts[i];
        if (i === parts.length - 1) {
            current[key] = value;
        } else {
            if (!current[key] || typeof current[key] !== "object") {
                current[key] = {};
            }
            current = current[key] as Record<string, unknown>;
        }
    }
}

function toNestedMessages(messages: Record<string, string>) {
    const nested: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(messages)) {
        setNestedValue(nested, key, value);
    }
    return nested;
}

export default getRequestConfig(async ({ locale }) => {
    const safeLocale = LOCALES.includes(locale as (typeof LOCALES)[number])
        ? (locale as (typeof LOCALES)[number])
        : DEFAULT_LOCALE;
    const messages = (await import(`@/public/messages/${safeLocale}.json`))
        .default as Record<string, string>;

    return {
        locale: safeLocale,
        messages: toNestedMessages(messages),
    };
});
