import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { Nullable } from "../types/utils";

export type ResolvedTheme = "light" | "dark";
export type UnResolvedTheme = ResolvedTheme | "system";
export const THEME_KEY = "x-theme"; // for local storage and cookie
export const DEFAULT_RESOLVED_THEME = "dark";
export const THEMES: UnResolvedTheme[] = ["system", "light", "dark"];

export function getThemeFromCookies(cookies: ReadonlyRequestCookies): Nullable<UnResolvedTheme> {
    return cookies.get(THEME_KEY)?.value as UnResolvedTheme | undefined;
}

function serializeCookie(
    name: string,
    value: string,
    options?: { days?: number; path?: string; sameSite?: "Lax" | "Strict" | "None"; secure?: boolean }
) {
    const parts: string[] = [`${encodeURIComponent(name)}=${encodeURIComponent(value)}`];

    const path = options?.path ?? "/";
    if (path) parts.push(`Path=${path}`);

    const sameSite = options?.sameSite ?? "Lax";
    if (sameSite) parts.push(`SameSite=${sameSite}`);

    if (options?.secure) parts.push("Secure");

    if (typeof options?.days === "number") {
        const expires = new Date(Date.now() + options.days * 24 * 60 * 60 * 1000);
        parts.push(`Expires=${expires.toUTCString()}`);
    }

    return parts.join("; ");
}

export function setClientSideCookieTheme(theme: UnResolvedTheme, days?: number) {
    if (typeof document === "undefined" || !theme) return;

    document.cookie = serializeCookie(THEME_KEY, theme, {
        days: typeof days === "number" && days > 0 ? days : undefined,
        path: "/",
        sameSite: "Lax",
    });
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
    if (typeof document === "undefined") return;

    document.cookie = serializeCookie(THEME_KEY, "", {
        days: -1,
        path: "/",
        sameSite: "Lax",
    });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function removeLocalStorageTheme(): void {
    if (typeof localStorage !== "undefined") {
        localStorage.removeItem(THEME_KEY);
    }
}

// internal methods, for implementation
export function resolve(unResolvedTheme: Nullable<UnResolvedTheme>, systemTheme: ResolvedTheme): ResolvedTheme {
    if (!unResolvedTheme || unResolvedTheme === "system") return systemTheme;
    return unResolvedTheme;
}
