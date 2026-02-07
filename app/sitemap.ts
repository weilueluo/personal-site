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
        {
            url: "/shader",
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
    // add legacy v1/v2 routes (archived)
    sitemapRoutes.push(
        {
            url: `${ORIGIN}/archive/2019`,
            lastModified: new Date(),
        },
        {
            url: `${ORIGIN}/archive/2021`,
            lastModified: new Date(),
        }
    );

    // archive routes
    const archiveRoutes = [
        "/archive",
        "/archive/2021",
        "/archive/2021/home",
        "/archive/2021/about",
        "/archive/2021/anime",
        "/archive/2021/rss",
        "/archive/2021/cv",
        "/archive/2019/index.html",
        "/archive/2019/about.html",
        "/archive/2019/works.html",
        "/archive/2019/waifu.html",
        "/archive/2019/adhoc.html",
    ];
    archiveRoutes.forEach(route =>
        sitemapRoutes.push({
            url: `${ORIGIN}${route}`,
            lastModified: new Date(),
        })
    );

    return sitemapRoutes;
}
