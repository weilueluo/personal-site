"use client";

import { ThemeProvider as NextThemeProvider, useTheme as useNextTheme } from "next-themes";
import React, { useEffect } from "react";
import { Nullable } from "../types/utils";
import { DEFAULT_RESOLVED_THEME, ResolvedTheme, THEME_KEY, UnResolvedTheme, setClientSideCookieTheme } from "./theme-utils";

export interface UseTheme {
    unResolvedTheme: UnResolvedTheme;
    resolvedTheme: ResolvedTheme;
    setTheme: (theme: UnResolvedTheme) => void;
}

function ThemeCookieSync() {
    const { theme } = useNextTheme();
    useEffect(() => {
        if (theme) {
            setClientSideCookieTheme(theme as UnResolvedTheme);
        }
    }, [theme]);
    return null;
}

export default function ThemeProvider({
    children,
    theme = undefined,
}: {
    children: React.ReactNode;
    theme?: Nullable<UnResolvedTheme>;
}) {
    const defaultTheme = theme || DEFAULT_RESOLVED_THEME;
    return (
        <NextThemeProvider
            attribute="class"
            defaultTheme={defaultTheme}
            enableSystem
            storageKey={THEME_KEY}
            disableTransitionOnChange>
            <ThemeCookieSync />
            {children}
        </NextThemeProvider>
    );
}

export function useTheme(): UseTheme {
    const { theme, resolvedTheme, setTheme } = useNextTheme();
    return {
        unResolvedTheme: (theme || DEFAULT_RESOLVED_THEME) as UnResolvedTheme,
        resolvedTheme: (resolvedTheme || DEFAULT_RESOLVED_THEME) as ResolvedTheme,
        setTheme: (newTheme: UnResolvedTheme) => setTheme(newTheme),
    };
}
