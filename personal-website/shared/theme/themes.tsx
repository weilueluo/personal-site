"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { useEffectOnce } from "react-use";
import { useForceUpdate } from "../hooks";
import { Nullable } from "../types/utils";
import {
    DEFAULT_RESOLVED_THEME,
    ResolvedTheme,
    THEMES,
    UnResolvedTheme,
    getSystemTheme,
    resolve,
    setClientSideCookieTheme,
} from "./theme-utils";

export interface UseTheme {
    unResolvedTheme: UnResolvedTheme;
    resolvedTheme: ResolvedTheme;
    setTheme: (theme: UnResolvedTheme) => void;
}

// constants

const ThemeContext = React.createContext<UseTheme>({
    resolvedTheme: DEFAULT_RESOLVED_THEME,
    unResolvedTheme: DEFAULT_RESOLVED_THEME,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setTheme: () => {},
});

// functions to export
export default function ThemeProvider({
    children,
    theme = undefined,
}: {
    children: React.ReactNode;
    theme?: Nullable<UnResolvedTheme>;
}) {
    // cookies theme > local storage theme > provided default theme > builtin default theme
    const initialTheme = theme || DEFAULT_RESOLVED_THEME;

    const systemTheme = useSystemTheme();
    const [unResolvedTheme, setUnResolvedTheme] = useState<UnResolvedTheme>(initialTheme);
    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => resolve(unResolvedTheme, systemTheme));

    const assignTheme = (theme: ResolvedTheme) => {
        if (typeof document !== "undefined") {
            const bodyClassList = document.querySelector("html")?.classList;
            THEMES.forEach(theme => bodyClassList?.remove(theme)); // remove old theme
            bodyClassList?.add(theme); // add new theme
        }
    };

    const forceUpdate = useForceUpdate();

    useEffectOnce(() => {
        forceUpdate();
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
