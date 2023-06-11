import { Messages } from "@/shared/i18n/type";

export type RSSConfig = {
    title: keyof Messages;
    url: string;
    homeUrl: string;
};

export const RSS_CONFIGS: RSSConfig[] = [
    {
        title: "rss.title.steam_news",
        url: "https://store.steampowered.com/feeds/news/?l=english",
        homeUrl: "https://store.steampowered.com",
    },
    {
        title: "rss.title.weibo_hot",
        url: "https://rsshub.app/weibo/search/hot",
        homeUrl: "https://weibo.com",
    },
    {
        title: "rss.title.csdn_news",
        url: "https://rsshub.app/csdn/blog/csdngeeknews",
        homeUrl: "https://www.csdn.net",
    },
    {
        title: "rss.title.bbc_news",
        url: "https://rsshub.app/bbc",
        homeUrl: "https://www.bbc.com/news",
    },
    {
        title: "rss.title.github_trending",
        url: "https://rsshub.app/github/trending/daily/any/en",
        homeUrl: "https://github.com",
    },

    // for testing only
    // {
    //     title: 'Error RSS',
    //     url: 'https://rsshub.app/error/error'
    // },

    // 'https://rsshub.app/hanime/video',
    // 'https://rsshub.app/zhihu/hotlist',
];
