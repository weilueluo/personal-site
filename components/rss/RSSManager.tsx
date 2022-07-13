import { useState } from 'react';
import { FlatFeed, RSSOptions } from './RSS.d';
import Parser from 'rss-parser'


enum State {
    NOT_INITIALIZED,
    LOADING,
    COMPLETE,
}

export default class RSSManager {
    _setFeeds: any;
    _state: State;
    _rssOptions: RSSOptions;

    _on_loading: Function;
    _on_complete: Function;
    _on_error: Function;

    constructor(setFeed) {
        this._setFeeds = setFeed;
        this._state = State.NOT_INITIALIZED;
    }

    _setState(state: State) {
        this._state = state;
        state == State.LOADING && this._on_loading && this._on_loading();
        state == State.COMPLETE && this._on_complete && this._on_complete();
    }

    setOptions(newRSSOptions: RSSOptions) {
        this._rssOptions = newRSSOptions;
    }

    reload() {
        // init states for new feed
        this._setState(State.LOADING);

        // empty old feeds
        let newFeeds = new Map();
        this._setFeeds(newFeeds);

        // clone options, ensure it will not change halfway
        const rssOptions = new Map(this._rssOptions)
        const errors = [];

        const rssPromises = [];
        rssOptions.forEach((opt, feedName) => {
            const rssPromise = loadRSSFeed(opt.url)
                .then((newFeed) => {
                    console.log(`loaded feed: ${feedName}`);
                    // console.log(newFeed);

                    // copy old feed and add new feed
                    newFeeds = new Map(newFeeds).set(feedName, newFeed);

                    // set feed to new feed
                    this._setFeeds(newFeeds);
                })
                .catch((error) => {
                    console.log(`RSSLoader error: ${error}`);
                    errors.push(error);
                    this._on_error && this._on_error(errors);
                });

            rssPromises.push(rssPromise);
        });

        Promise.allSettled(rssPromises)
            .then(() => this._setState(State.COMPLETE));
    }
}


// --- Parser
// https://github.com/rbren/rss-parser
const RSSURLParser = new Parser();

const corsProxyEndpoint = 'https://se06wfpxq7.execute-api.eu-west-2.amazonaws.com/dev?url='

async function loadRSSFeed(url) {
    return await RSSURLParser.parseURL(corsProxyEndpoint + url)
}


// --- expand feed.items
// for each item in items: move attribute to top level
export function feed2flatFeeds(feed: Parser.Output<{}>, extras: Function, limit = 5) {
    const feedWithoutItems = structuredClone(feed);
    delete feedWithoutItems.items;
    return feed.items.slice(0, limit).map(feedItem => {
        const flatFeed = Object.assign(structuredClone(feedWithoutItems), feedItem)
        return Object.assign(flatFeed, extras(flatFeed))
    });
}


// https://stackoverflow.com/a/11526569
const MIN_DATE = new Date(-8640000000000000);

export function sortFlatFeedsDesc(flatfeeds: FlatFeed[]) {
    flatfeeds.sort((a, b) => {
        const aDate = a.jsDate || MIN_DATE
        const bDate = b.jsDate || MIN_DATE
        if (bDate > aDate) {
            return 1
        } else if (aDate > bDate) {
            return -1
        } else {
            return 0
        }
    })
}