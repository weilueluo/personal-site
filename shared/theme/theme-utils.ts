import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { Nullable } from "../types/utils";
import { cookieToObj } from "../utils";

export type ResolvedTheme = "light" | "dark";
export type UnResolvedTheme = ResolvedTheme | "system";
export const THEME_KEY = "x-theme"; // for local storage and cookie
export const DEFAULT_RESOLVED_THEME = "dark";
export const THEMES: UnResolvedTheme[] = ["system", "light", "dark"];

export function getThemeFromCookies(cookies: ReadonlyRequestCookies): Nullable<UnResolvedTheme> {
    // console.log(`getCookiesTheme: cookies=${JSON.stringify(cookies)}`);

    let theme: Nullable<UnResolvedTheme>;
    if (cookies) {
        for (const cookie of cookies) {
            // console.log(`getCookiesTheme: cookie=${JSON.stringify(cookie)}`);
            if (cookie[0] == THEME_KEY) {
                theme = cookie[1].value as UnResolvedTheme;
            }
        }
    }
    // console.log(`getCookiesTheme: theme=${JSON.stringify(theme)}`);
    return theme;
}

export function setClientSideCookieTheme(theme: UnResolvedTheme, days = 0) {
    if (typeof document !== "undefined" && theme) {
        const cookieObj = cookieToObj(document.cookie);
        cookieObj[THEME_KEY] = theme;
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            document.cookie = `expires=${date.toUTCString()}`;
        }

        document.cookie = `${THEME_KEY}=${theme}`;
    }
}

export function getSystemTheme(): ResolvedTheme {
    if (typeof window !== "undefined" && window.matchMedia) {
        if (window.matchMedia("(prefers-color-scheme: light)").matches) {
            return "light";
        } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            return "dark";
        }
    }
    return DEFAULT_RESOLVED_THEME;
}

export function setLocalStorageTheme(theme: UnResolvedTheme) {
    if (typeof localStorage !== "undefined") {
        localStorage.setItem(THEME_KEY, theme);
    }
}

export function getLocalStorageTheme(): Nullable<UnResolvedTheme> {
    if (typeof localStorage !== "undefined") {
        const theme = localStorage.getItem(THEME_KEY);
        if (theme !== null) {
            return theme as UnResolvedTheme;
        }
    }
    return undefined;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function removeClientSideCookieTheme() {
    if (typeof document !== "undefined") {
        const cookieObj = cookieToObj(document.cookie);
        delete cookieObj[THEME_KEY];
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function removeLocalStorageTheme(): void {
    if (typeof localStorage !== "undefined") {
        localStorage.removeItem(THEME_KEY);
    }
}

// internal methods, for implementation
export function resolve(unResolvedTheme: UnResolvedTheme, systemTheme: ResolvedTheme) {
    return unResolvedTheme === "system" ? systemTheme : unResolvedTheme;
}
