"use client";

import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useEffectOnce } from "react-use";
import { Nullable } from "./types/utils";
import { cookieToObj } from "./utils";

// types
export type ResolvedTheme = "light" | "dark";
export type UnResolvedTheme = ResolvedTheme | "system";

export interface UseTheme {
    unResolvedTheme: UnResolvedTheme;
    resolvedTheme: ResolvedTheme;
    setTheme: (theme: UnResolvedTheme) => void;
}

// constants
const THEME_KEY = "x-theme"; // for local storage and cookie
const DEFAULT_RESOLVED_THEME = "light";
export const THEMES: UnResolvedTheme[] = ["system", "light", "dark"];
const ThemeContext = React.createContext<UseTheme>({
    resolvedTheme: DEFAULT_RESOLVED_THEME,
    unResolvedTheme: DEFAULT_RESOLVED_THEME,
    setTheme: () => {},
});

// functions to export
export default function ThemeProvider({
    children,
    cookies,
    defaultTheme = undefined,
}: {
    children: React.ReactNode;
    cookies: ReadonlyRequestCookies;
    defaultTheme?: UnResolvedTheme;
}) {
    // cookies theme > local storage theme > provided default theme > builtin default theme
    const initialTheme = getCookiesTheme(cookies) || getLocalStorageTheme() || defaultTheme || DEFAULT_RESOLVED_THEME;

    const systemTheme = useSystemTheme();
    const [unResolvedTheme, setUnResolvedTheme] = useState<UnResolvedTheme>(initialTheme);
    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => resolve(unResolvedTheme, systemTheme));

    const assignTheme = (theme: ResolvedTheme) => {
        if (typeof document !== "undefined") {
            const bodyClassList = document.querySelector("html")?.classList;
            THEMES.forEach((theme) => bodyClassList?.remove(theme)); // remove old theme
            bodyClassList?.add(theme); // add new theme
        }
    };

    useEffectOnce(() => {
        assignTheme(resolvedTheme);
    });

    useEffect(() => {
        assignTheme(resolvedTheme);
    }, [resolvedTheme]);

    // handle system theme changes on the fly
    useEffect(() => {
        if (unResolvedTheme === "system") {
            setResolvedTheme(systemTheme);
        }
    }, [systemTheme, unResolvedTheme]);

    const setTheme = useCallback(
        (newTheme: UnResolvedTheme) => {
            setUnResolvedTheme(newTheme);
            setResolvedTheme(resolve(newTheme, systemTheme));
            setClientSideCookieTheme(newTheme); // we need cookie so that server can prerender correct page to avoid flashing
            setLocalStorageTheme(newTheme); // we need local storage to persistent cookie long term, but it does not get send to server
        },
        [systemTheme]
    );

    return (
        <ThemeContext.Provider value={{ resolvedTheme, unResolvedTheme, setTheme }}>{children}</ThemeContext.Provider>
    );
}

// convinent hook to check the current theme / change the theme
export function useTheme(): UseTheme {
    return useContext(ThemeContext);
}

// internal methods, for implementation
function resolve(unResolvedTheme: UnResolvedTheme, systemTheme: ResolvedTheme) {
    return unResolvedTheme === "system" ? systemTheme : unResolvedTheme;
}

function useSystemTheme(): ResolvedTheme {
    const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() => getSystemTheme());

    // listen for system changes, so that page react when user system theme changes
    useEffectOnce(() => {
        const handleEvent = (event: MediaQueryListEvent) => {
            const newTheme = event.matches ? "light" : "dark";
            // console.log(`MediaQueryListEvent=${event}`);

            setSystemTheme(newTheme);
        };
        if (typeof window !== "undefined" && window.matchMedia) {
            window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", handleEvent);

            return () => window.matchMedia("(prefers-color-scheme: light)").removeEventListener("change", handleEvent);
        }
    });

    return systemTheme;
}

function getCookiesTheme(cookies: ReadonlyRequestCookies): Nullable<UnResolvedTheme> {
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

function setClientSideCookieTheme(theme: UnResolvedTheme, days = 0) {
    if (typeof document !== "undefined" && theme) {
        const cookieObj = cookieToObj(document.cookie);
        cookieObj[THEME_KEY] = theme;
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            document.cookie = `expires=${date.toUTCString()}`;
        }

        document.cookie = `${THEME_KEY}=${theme}`;
    }
}

function getSystemTheme(): ResolvedTheme {
    if (typeof window !== "undefined" && window.matchMedia) {
        if (window.matchMedia("(prefers-color-scheme: light)").matches) {
            return "light";
        } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            return "dark";
        }
    }
    return DEFAULT_RESOLVED_THEME;
}

function setLocalStorageTheme(theme: UnResolvedTheme) {
    if (typeof localStorage !== "undefined") {
        localStorage.setItem(THEME_KEY, theme);
    }
}

function getLocalStorageTheme(): Nullable<UnResolvedTheme> {
    if (typeof localStorage !== "undefined") {
        const theme = localStorage.getItem(THEME_KEY);
        if (theme !== null) {
            return theme as UnResolvedTheme;
        }
    }
    return undefined;
}

function removeClientSideCookieTheme() {
    if (typeof document !== "undefined") {
        const cookieObj = cookieToObj(document.cookie);
        delete cookieObj[THEME_KEY];
    }
}

function removeLocalStorageTheme(): void {
    if (typeof localStorage !== "undefined") {
        localStorage.removeItem(THEME_KEY);
    }
}
