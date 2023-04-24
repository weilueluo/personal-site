import Parser from 'rss-parser';
import { isDevEnv } from '../common/misc';
import { FlatFeed, RSSOption, RSSRequestError } from './RSS.d';

enum State {
    NOT_INITIALIZED,
    LOADING,
    COMPLETE,
}

export default class RSSLoader {
    _setFeeds: (feeds: Map<string, FlatFeed>) => unknown;
    _state: State;
    _rssOptions: RSSOption[];

    on_loading: () => unknown;
    on_complete: () => unknown;
    on_error: (error) => unknown;

    constructor(setFeed: (feed) => unknown) {
        this._setFeeds = setFeed;
        this._state = State.NOT_INITIALIZED;
    }

    _setState(state: State) {
        this._state = state;
        state == State.LOADING && this.on_loading && this.on_loading();
        state == State.COMPLETE && this.on_complete && this.on_complete();
    }

    setOptions(newRSSOptions: RSSOption[]) {
        this._rssOptions = newRSSOptions;
    }

    // load feeds using set rssOptions, and set result using _setFeeds
    reload() {
        // init states for new feed
        this._setState(State.LOADING);

        // empty old feeds
        let newFeeds = new Map();
        this._setFeeds(newFeeds);

        // clone options, ensure it will not change halfway
        const rssOptions = [...this._rssOptions];
        const errors: RSSRequestError[] = [];

        const rssPromises = [];
        rssOptions.forEach(opt => {
            const rssPromise = loadRSSFeed(opt.url)
                .then(newFeed => {
                    console.log(`loaded feed: ${opt.name}`);
                    // console.log(newFeed);

                    // copy old feed and add new feed
                    newFeeds = new Map(newFeeds).set(opt.name, newFeed);

                    // set feed to new feed
                    this._setFeeds(newFeeds);

                    // refresh error as well, in case previously there is error
                    // but not this time, and it is not updated
                    this.on_error && this.on_error(errors);
                })
                .catch(error => {
                    console.log(`RSSLoader error: ${error}`);
                    console.log(error);

                    error.url = opt.url;
                    errors.push(error);
                    this.on_error && this.on_error(errors);
                });

            rssPromises.push(rssPromise);
        });

        Promise.allSettled(rssPromises).then(() => {
            this._setState(State.COMPLETE);
            this.on_error && this.on_error(errors);
        });
    }
}

// https://github.com/rbren/rss-parser
const RSSURLParser = new Parser();

// https://github.com/Redcxx/cors-proxy
const corsProxyEndpoint =
    'https://hauww8y4w1.execute-api.eu-west-2.amazonaws.com';

async function loadRSSFeed(url: string) {
    const corsURL =
        corsProxyEndpoint + (isDevEnv() ? '/dev?url=' : '/prod?url=') + url;
    return await RSSURLParser.parseURL(corsURL);
}
