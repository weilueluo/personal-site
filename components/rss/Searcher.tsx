import { FlatFeed } from './RSS.d';

// set utils
function union<T>(setA: Set<T>, setB: Set<T>) {
    const _union = new Set(setA);
    for (const elem of setB) {
        _union.add(elem);
    }
    return _union;
}

function intersection<T>(setA: Set<T>, setB: Set<T>) {
    const _intersection = new Set<T>();
    for (const elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem);
        }
    }
    return _intersection;
}

// for spliting text
const nonAlphanumeric = /[^A-Za-z0-9_]/gim;
// https://stackoverflow.com/a/61151122/6880256
// const nonChinese = /[\x00-\x7F]/gim
const nonChinese = /[\P{Script=Han}]/gim;

// map token to feed
const INVERSE_INDEX = new Map<string, Set<FlatFeed>>();
const PROCESSED = new Set<string>();

// convert raw text into cleaned/normalized tokens
function extractTokensFromString(text: string, addEmpty = false) {
    const englishTokens = new Set(
        text
            .split(nonAlphanumeric)
            .map((token) => token.trim().toLowerCase())
            .filter((token) => token.length > 0)
    );

    // for match everything if user input empty string
    if (addEmpty) {
        englishTokens.add('');
    }

    const chineseTokens = new Set(
        [...text.replace(nonChinese, '')].filter((token) => token.length > 0)
    );

    // console.log(text);
    // console.log(englishTokens);
    // console.log(chineseTokens);

    return union(englishTokens, chineseTokens);
}

function extractTokensFromFlatFeed(flatFeed: FlatFeed) {
    const releventContent =
        (flatFeed.title || '') +
        (flatFeed.contentSnippet || flatFeed.content || '') +
        (flatFeed.name || '') +
        ((flatFeed.jsDate && flatFeed.jsDate.toDateString()) || '');
    return extractTokensFromString(releventContent, true);
}

function populateInverseIndex(flatFeeds: FlatFeed[]) {
    flatFeeds.forEach((feed) => {
        if (PROCESSED.has(feed.uniqueKey)) {
            // already processed and added to inverse index
            return;
        } else {
            extractTokensFromFlatFeed(feed).forEach((token) => {
                if (!INVERSE_INDEX.has(token)) {
                    INVERSE_INDEX.set(token, new Set());
                }
                // map token to feed
                INVERSE_INDEX.get(token).add(feed);
            });
            PROCESSED.add(feed.uniqueKey);
        }
    });
}

export function searchFlatFeeds(searchString: string, flatFeeds: FlatFeed[]) {
    if (searchString.length === 0) {
        // special case
        return flatFeeds;
    }

    const allowedUniqueKeys = new Set(flatFeeds.map((feed) => feed.uniqueKey));
    populateInverseIndex(flatFeeds);
    const tokens = extractTokensFromString(searchString, false);
    // console.log('search tokens');
    // console.log(searchTokens);

    // TODO: CONVERT TO MATCH ALL TOKENS FOR BOTH LANGUAGE

    const matchedFeedSets: Set<FlatFeed>[] = [];
    tokens.forEach((token) => {
        if (INVERSE_INDEX.has(token)) {
            matchedFeedSets.push(INVERSE_INDEX.get(token));
        }
    });

    if (matchedFeedSets.length == 0) {
        return [];
    }

    let matchedFeeds: Set<FlatFeed> = matchedFeedSets[0];
    for (let i = 1; i < matchedFeedSets.length; i++) {
        matchedFeeds = intersection<FlatFeed>(matchedFeeds, matchedFeedSets[i]);
    }

    return [...matchedFeeds].filter((feed) =>
        allowedUniqueKeys.has(feed.uniqueKey)
    );
}
