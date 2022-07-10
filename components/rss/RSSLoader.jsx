import Parser from 'rss-parser'



export default class RSSLoader {

    async loadGithubFeed() {
        const parser = new Parser();
        console.log("hello rssloader");
        let feed = await parser.parseURL('https://github.com/redcxx')
        console.log(feed);
        return feed;
    }
}