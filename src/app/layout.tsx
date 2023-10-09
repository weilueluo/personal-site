import { inter } from "@/shared/fonts";
import { DEFAULT_RESOLVED_THEME, getThemeFromCookies, resolve } from "@/shared/theme/theme-utils";
import ThemeProvider from "@/shared/theme/themes";
import { BasePageProps } from "@/shared/types/comp";
import { tm } from "@/shared/utils";
import { cookies } from "next/headers";
import "./global.css";

export default async function Layout({ children }: BasePageProps) {
    const theme = getThemeFromCookies(cookies());
    const resolvedTheme = resolve(theme || DEFAULT_RESOLVED_THEME, DEFAULT_RESOLVED_THEME);
    return (
        <ThemeProvider theme={theme}>
            <html className={resolvedTheme}>
                <head>
                    {/* General */}
                    <title>Weilue Luo</title>
                    <meta
                        name="keywords"
                        content="Weilue Luo, Personal Website, Anime, Blog, RSS, Github, NextJs, TailwindCSS, React, portfolio, lwl, wll"
                    />
                    <meta name="description" content="A place where I put random stuff" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

                    {/* Icons for various purposes */}
                    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                    <link rel="manifest" href="/site.webmanifest" />
                    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
                    <meta name="msapplication-TileColor" content="#da532c" />
                    <meta name="theme-color" content="#ffffff" />

                    {/* Open Graph */}
                    <meta property="og:title" content="Weilue Luo" />
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content="https://wll.dev/" />
                    <meta property="og:image" content="https://wll.dev/og-image.jpg" />
                    <meta property="og:image:secure_url" content="https://wll.dev/og-image.jpg" />
                    <meta property="og:image:width" content="600" />
                    <meta property="og:image:height" content="600" />
                    <meta
                        property="og:image:alt"
                        content="Here is some text for open graph image, but the image should be working."
                    />
                    <meta property="og:description" content="I dump random stuff here." />

                    <meta property="og:profile:first_name" content="Weilue" />
                    <meta property="og:profile:last_name" content="Luo" />
                    <meta property="og:username" content="weilueluo" />
                    <meta property="og:gender" content="male" />
                </head>

                <body className={tm("std-bg std-text grid place-items-center", inter.className)}>{children}</body>
            </html>
        </ThemeProvider>
    );
}
