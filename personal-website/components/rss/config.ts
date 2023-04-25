
export interface RSSConfig {
    title: string
    url: string
}

export const RSS_URLS: RSSConfig[] = [
    // steam news
    {
        title: 'Steam News',
        url: 'https://store.steampowered.com/feeds/news/?l=english',
    },

    // hanime
    // 'https://rsshub.app/hanime/video',

    // // zhihu hotlist
    // 'https://rsshub.app/zhihu/hotlist',

    // weibo hot
    {
        title: 'Weibo Hot',
        url: 'https://rsshub.app/weibo/search/hot',
    },

    // csdn news
    {
        title: 'CSDN News',
        url: 'https://rsshub.app/csdn/blog/csdngeeknews'
    },

    // dev.to weekly
    {
        title: 'Dev.to Weekly',
        url: 'https://rsshub.app/devto/weekly'
    },

    // github trending
    {
        title: 'Github Trending',
        url: 'https://rsshub.app/github/trending/daily/any/en'
    },

    // wangyin blog
    {
        title: 'Wangyin Blog',
        url: 'https://rsshub.app/blogs/wangyin'
    }
]