import { stringHash } from "@/shared/utils";
import { Feed } from "./manager";


class RSSUtils {
    constructor() {}

    public hash(feed: Feed) {
    
        const key =
            (feed.item.guid || '') +
            (feed.item.title || '') +
            (feed.item.link || '');
    
        return stringHash(key);
    }
}

export const rssUtils = new RSSUtils();