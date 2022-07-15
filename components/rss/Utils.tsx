

import Parser from "rss-parser";
import { FeedsMap as Name2FeedMap, FlatFeed } from "./RSS.d";


// --- compute global unique id from flat feed
export function computeGUID(feed: FlatFeed) {
    return (
        String(feed.guid) +
        String(feed.id) +
        String(feed.title) +
        String(feed.isoDate) +
        String(feed.pubDate)
    );
}

// --- expand feed.items
// for each item in rss feed items: move attribute to top level
export function feeds2flatFeeds(rawFeeds: Name2FeedMap, defaultLimit: number) {
    const flatFeeds = []
    rawFeeds.forEach((feed, name) => {
        flatFeeds.push(...feed2flatFeeds(feed, name, defaultLimit));
    });
    return flatFeeds
}

export function feed2flatFeeds(
    feed: Parser.Output<{}>,
    name: string,
    limit: number = null
) {
    const feedWithoutItems = structuredClone(feed);
    delete feedWithoutItems.items;
    limit = limit || feed.items.length
    return feed.items.slice(0, limit).map((feedItem) => {
        const flatFeed = Object.assign(
            structuredClone(feedWithoutItems),
            feedItem
        ) as FlatFeed;

        const date = flatFeed.pubDate || flatFeed.isoDate;

        const extras = {
                name: name,
                jsDate: date ? new Date(date) : null,
                uniqueKey: computeGUID(flatFeed),
            };

        return Object.assign(flatFeed, extras);
    });
}


// --- sorting feeds according to date
// https://stackoverflow.com/a/11526569
export const MIN_DATE = new Date(-8640000000000000);

export function sortFlatFeedsDesc(flatfeeds: FlatFeed[]) {
    flatfeeds.sort((a, b) => {
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