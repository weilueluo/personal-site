

export type RSSConfig = {
    title: string,
    url: string
}

export const RSS_CONFIGS: RSSConfig[] = [
    {
        title: 'Steam News',
        url: 'https://store.steampowered.com/feeds/news/?l=english'
    },
    {
        title: 'Weibo Hot',
        url: 'https://rsshub.app/weibo/search/hot'
    },
    {
        title: 'CSDN News',
        url: 'https://rsshub.app/csdn/blog/csdngeeknews'
    },
    {
        title: 'BBC News',
        url: 'https://rsshub.app/bbc'
    },
    {
        title: 'Github Trending',
        url: 'https://rsshub.app/github/trending/daily/any/en'
    },
    {
        title: 'Wangyin Blog',
        url: 'https://rsshub.app/blogs/wangyin'
    },

    // 'https://rsshub.app/hanime/video',
    // 'https://rsshub.app/zhihu/hotlist',
]