export type RSSConfig = {
    title: string;
    url: string;
    homeUrl: string;
};

export const RSS_CONFIGS: RSSConfig[] = [
    {
        title: "Steam News",
        url: "https://store.steampowered.com/feeds/news/?l=english",
        homeUrl: "https://store.steampowered.com",
    },
    {
        title: "Weibo Hot",
        url: "https://rsshub.app/weibo/search/hot",
        homeUrl: "https://weibo.com",
    },
    {
        title: "CSDN News",
        url: "https://rsshub.app/csdn/blog/csdngeeknews",
        homeUrl: "https://www.bbc.com/news",
    },
    {
        title: "BBC News",
        url: "https://rsshub.app/bbc",
        homeUrl: "https://www.csdn.net",
    },
    {
        title: "Github Trending",
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
