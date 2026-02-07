import { Messages } from "@/shared/i18n/type";

export type RSSConfig = {
    title: keyof Messages;
    url: string;
    homeUrl: string;
    fetchMode?: "client" | "server";
};

export const RSS_CONFIGS: RSSConfig[] = [
    {
        title: "rss.title.reuters_top",
        // Reuters' legacy RSS endpoints are frequently unavailable; use a Google News RSS query as a fallback.
        url: "https://news.google.com/rss/search?q=site%3Areuters.com%20world&hl=en-US&gl=US&ceid=US:en",
        homeUrl: "https://www.reuters.com/world/",
        fetchMode: "client",
    },
    {
        title: "rss.title.bbc_news",
        url: "http://newsrss.bbc.co.uk/rss/newsonline_uk_edition/front_page/rss.xml",
        homeUrl: "https://www.bbc.com/news",
        fetchMode: "client",
    },
    {
        title: "rss.title.nyt_home",
        url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
        homeUrl: "https://www.nytimes.com",
        fetchMode: "client",
    },
    {
        title: "rss.title.guardian_world",
        url: "https://www.theguardian.com/world/rss",
        homeUrl: "https://www.theguardian.com/world",
        fetchMode: "client",
    },
    {
        title: "rss.title.cnn_top",
        url: "http://rss.cnn.com/rss/cnn_topstories.rss",
        homeUrl: "https://www.cnn.com",
        fetchMode: "client",
    },
    {
        title: "rss.title.cloudflare_blog",
        url: "https://blog.cloudflare.com/rss/",
        homeUrl: "https://blog.cloudflare.com",
        fetchMode: "client",
    },
    {
        title: "rss.title.meituan_tech",
        url: "https://tech.meituan.com/feed/",
        homeUrl: "https://tech.meituan.com",
        fetchMode: "client",
    },
    {
        title: "rss.title.nvidia_developer",
        url: "https://developer.nvidia.com/blog/feed/",
        homeUrl: "https://developer.nvidia.com/blog",
        fetchMode: "client",
    },
    {
        title: "rss.title.google_developers",
        url: "https://developers.googleblog.com/feeds/posts/default?alt=rss",
        homeUrl: "https://developers.googleblog.com",
        fetchMode: "client",
    },
    {
        title: "rss.title.microsoft_devblogs",
        url: "https://devblogs.microsoft.com/feed/",
        homeUrl: "https://devblogs.microsoft.com",
        fetchMode: "client",
    },
    {
        title: "rss.title.spotify_engineering",
        url: "https://engineering.atspotify.com/feed/",
        homeUrl: "https://engineering.atspotify.com",
        fetchMode: "client",
    },
    {
        title: "rss.title.netflix_techblog",
        // Use the Blogger feed to avoid TLS issues seen on the custom domain in some Node environments.
        url: "https://techblog.netflix.com/feeds/posts/default?alt=rss",
        homeUrl: "https://netflixtechblog.com",
        fetchMode: "client",
    },
    {
        title: "rss.title.discord_blog",
        url: "https://medium.com/feed/discord-engineering",
        homeUrl: "https://medium.com/discord-engineering",
        fetchMode: "client",
    },
    {
        title: "rss.title.github_blog",
        url: "https://github.blog/feed/",
        homeUrl: "https://github.blog",
        fetchMode: "client",
    },
    {
        title: "rss.title.slack_engineering",
        url: "https://slack.engineering/feed/",
        homeUrl: "https://slack.engineering",
        fetchMode: "client",
    },
    {
        title: "rss.title.uber_engineering",
        url: "https://www.uber.com/en-US/blog/engineering/rss/",
        homeUrl: "https://www.uber.com/en-US/blog/engineering/",
        fetchMode: "client",
    },
    {
        title: "rss.title.shopify_engineering",
        // Shopify Engineering doesn't expose a stable RSS/Atom endpoint; use sitemap as a lightweight feed source.
        url: "https://shopify.engineering/sitemap.xml",
        homeUrl: "https://shopify.engineering",
        fetchMode: "client",
    },
    {
        title: "rss.title.stripe_blog",
        url: "https://stripe.com/blog/feed.rss",
        homeUrl: "https://stripe.com/blog",
        fetchMode: "client",
    },
    {
        title: "rss.title.dropbox_tech",
        url: "https://dropbox.tech/feed",
        homeUrl: "https://dropbox.tech",
        fetchMode: "client",
    },
    {
        title: "rss.title.mozilla_hacks",
        url: "https://hacks.mozilla.org/feed/",
        homeUrl: "https://hacks.mozilla.org",
        fetchMode: "client",
    },
    {
        title: "rss.title.aws_architecture",
        url: "https://aws.amazon.com/blogs/architecture/feed/",
        homeUrl: "https://aws.amazon.com/blogs/architecture/",
        fetchMode: "client",
    },
    {
        title: "rss.title.google_cloud_blog",
        url: "https://blog.google/products/google-cloud/rss/",
        homeUrl: "https://blog.google/products/google-cloud/",
        fetchMode: "client",
    },
    {
        title: "rss.title.gitlab_blog",
        url: "https://about.gitlab.com/atom.xml",
        homeUrl: "https://about.gitlab.com/blog/",
        fetchMode: "client",
    },
    {
        title: "rss.title.hashicorp_blog",
        // feed.xml currently works more reliably than /feed (which often returns 429).
        url: "https://www.hashicorp.com/blog/feed.xml",
        homeUrl: "https://www.hashicorp.com/blog",
        fetchMode: "client",
    },
    {
        title: "rss.title.datadog_blog",
        url: "https://www.datadoghq.com/blog/index.xml",
        homeUrl: "https://www.datadoghq.com/blog/",
        fetchMode: "client",
    },

    // for testing only
    // {
    //     title: 'Error RSS',
    //     url: 'https://example.com/error'
    // },
];
