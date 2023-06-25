import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: "https://wll.dev",
            lastModified: new Date(),
        },
        {
            url: "https://wll.dev/about",
            lastModified: new Date(),
        },
        {
            url: "https://wll.dev/blog",
            lastModified: new Date(),
        },
        {
            url: "https://wll.dev/anime",
            lastModified: new Date(),
        },
        {
            url: "https://wll.dev/rss",
            lastModified: new Date(),
        },
    ];
}
