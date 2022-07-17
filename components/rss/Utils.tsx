

import Parser from "rss-parser";
import { FeedsMap as Name2FeedMap, FlatFeed } from "./RSS.d";


// --- compute global unique id from flat feed

export function computeGUID(feed: FlatFeed) {
    const key = (
            (feed.guid || "") +
            (feed.name || "") +
            (feed.title || "") +
            (feed.link || "")
    );
    
    return key
}

// --- expand feed.items
// for each item in rss feed items: move attribute to top level
export function feeds2flatFeeds(rawFeeds: Name2FeedMap) {
    const flatFeeds = []
    rawFeeds.forEach((feed, name) => {
        flatFeeds.push(...feed2flatFeeds(feed, name));
    });
    return flatFeeds
}

export function feed2flatFeeds(
    feed: Parser.Output<{}>,
    name: string,
) {
    const feedWithoutItems = structuredClone(feed);
    delete feedWithoutItems.items;
    return feed.items.map((feedItem) => {
        let flatFeed = Object.assign(
            structuredClone(feedWithoutItems),
            feedItem
        ) as FlatFeed;

        const date = flatFeed.pubDate || flatFeed.isoDate;

        const extras = {
            name: name,
            jsDate: date ? new Date(date) : null
        };

        flatFeed = Object.assign(flatFeed, extras);

        // compute uniqueKey when we have everything else
        flatFeed.uniqueKey = computeGUID(flatFeed)

        return flatFeed
    });
}


// --- sorting feeds according to date
// https://stackoverflow.com/a/11526569
export const MIN_DATE = new Date(-8640000000000000);

export function sortFlatFeedsDesc(flatfeeds: FlatFeed[]) {
    return flatfeeds.slice().sort((a, b) => {
        const aDate = a.jsDate || MIN_DATE;
        const bDate = b.jsDate || MIN_DATE;
        if (bDate > aDate) {
            return 1;
        } else if (aDate > bDate) {
            return -1;
        } else {
            return 0;
        }
    });
}


// --- date stuff
export function toStartOfTheDay(date: Date) {
    date.setHours(0,0,0,0)  // set hours, minutes, seconds and milliseconds to 0
    return date
}

export function toYesterday(date: Date) {
    date.setDate(date.getDate() - 1)
    toStartOfTheDay(date)
    return date
}

export function toMonday(date: Date) {
    const day = date.getDay()
    const monday = date.getDate() - day + (day === 0 ? -6:1); // adjust when day is sunday
    date.setDate(monday)
    toStartOfTheDay(date)
    return date
}

export function toStartOfMonth(date: Date) {
    date.setDate(1)
    toStartOfTheDay(date)
    return date
}

export function toStartOfYear(date: Date) {
    date.setMonth(0, 1) // set both month and day
    toStartOfTheDay(date)
    return date
}
