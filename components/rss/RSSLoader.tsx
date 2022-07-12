import Parser from 'rss-parser'

// https://github.com/rbren/rss-parser
const RSSURLParser = new Parser();


const corsProxyEndpoint = 'https://se06wfpxq7.execute-api.eu-west-2.amazonaws.com/dev?url='

export default class RSSLoader {

    static async loadURL(url: string) {
        return await RSSURLParser.parseURL(corsProxyEndpoint + url)
    }
}


