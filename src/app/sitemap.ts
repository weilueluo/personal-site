import { LOCALES, ORIGIN } from "@/shared/constants";
import { localedPath } from "@/shared/i18n/locale";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const mainRoutes = [
        {
            url: "",
            lastModified: new Date(),
        },
        {
            url: "/about",
            lastModified: new Date(),
        },
        {
            url: "/blog",
            lastModified: new Date(),
        },
        {
            url: "/anime",
            lastModified: new Date(),
        },
        {
            url: "/rss",
            lastModified: new Date(),
        },
    ];

    const sitemapRoutes = [];
    // add routes without locale
    mainRoutes.forEach(route =>
        sitemapRoutes.push({
            url: `${ORIGIN}${route.url}`,
            lastModified: route.lastModified,
        })
    );
    // add route with locale
    LOCALES.forEach(locale =>
        mainRoutes.forEach(route =>
            sitemapRoutes.push({
                url: `${ORIGIN}${localedPath(route.url, locale)}`,
                lastModified: route.lastModified,
            })
        )
    );
    // add subdomains
    sitemapRoutes.push(
        {
            url: "https://v1.wll.dev",
            lastModified: new Date(),
        },
        {
            url: "https://v2.wll.dev",
            lastModified: new Date(),
        }
    );

    return sitemapRoutes;
}
