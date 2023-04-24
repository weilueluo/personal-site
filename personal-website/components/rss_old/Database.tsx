
import { FlatFeed } from "./RSS";

// map unique key to feed

// this map contains all feed seen before, updated by loader
export const DATABASE = new Map<string, FlatFeed>();

export function updateDatabase(flatFeeds: FlatFeed[]) {
    flatFeeds.forEach(feed => {
        if (!DATABASE.has(feed.uniqueKey)) {
            DATABASE.set(feed.uniqueKey, feed)
        }
    })
}

export function clearDatabase() {
    DATABASE.clear();
}