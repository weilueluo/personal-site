import { DATABASE } from "./Database";
import { FlatFeed } from "./RSS.d";

// for spliting text
const nonAlphanumeric = /[^A-Za-z0-9_]/gim;
// https://stackoverflow.com/a/61151122/6880256

// const nonChinese = /[\x00-\x7F]/gim
const nonChinese = /[\P{Script=Han}]/gim

// map token to feed
const INVERSE_INDEX = new Map<string, Set<FlatFeed>>();
const PROCESSED = new Set()

// convert raw text into cleaned/normalized tokens
function extractTokensFromString(
    text: string,
    addEmpty = false
) {
    const englishTokens = new Set(
        text
            .split(nonAlphanumeric)
            .map((token) => token.trim().toLowerCase())
            .filter((token) => token.length > 0)
    )

    // for match everything if user input empty string
    if (addEmpty) {
        englishTokens.add('');
    }
    
    const chineseTokens = new Set(
        [...text.replace(nonChinese, '')]
                .filter((token) => token.length > 0)
    )
    
    console.log(text);
    // console.log(englishTokens);
    console.log(chineseTokens);

    return [englishTokens, chineseTokens];
}

function extractTokensFromFlatFeed(flatFeed: FlatFeed) {
    const releventContent = (flatFeed.title || "") 
                            + (flatFeed.contentSnippet || flatFeed.content || "")
                            + (flatFeed.name || "")
                            + (flatFeed.jsDate && flatFeed.jsDate.toDateString() || "")
    return extractTokensFromString(releventContent, true);
}

function populateInverseIndex(flatFeeds: FlatFeed[]) {
    flatFeeds.forEach((feed) => {
        if (PROCESSED.has(feed.uniqueKey)) {
            // already processed and added to inverse index
            return;
        } else {
            extractTokensFromFlatFeed(feed).forEach((langTokens) => {
                langTokens.forEach((token => {
                    if (!INVERSE_INDEX.has(token)) {
                        INVERSE_INDEX.set(token, new Set());
                    }
                    // map token to feed
                    INVERSE_INDEX.get(token).add(feed);
                }))
                PROCESSED.add(feed.uniqueKey);
            });
        }
    });
}

function setIntersect(A: Set<string>, B: Set<string>) {
    return new Set([...A].filter(i => B.has(i)))
}

export function searchFlatFeeds(searchString: string, flatFeeds: FlatFeed[]) {
    if (searchString.length === 0) {
        // special case
        return flatFeeds
    }

    const allowedUniqueKeys = new Set(flatFeeds.map(feed => feed.uniqueKey))
    populateInverseIndex(flatFeeds);
    const [englishTokens, chineseTokens] = extractTokensFromString(searchString, false);
    // console.log('search tokens');
    // console.log(searchTokens);
    
    // TODO: CONVERT TO MATCH ALL TOKENS FOR BOTH LANGUAGE
    
    const key2MatchedTokens = new Map();
    englishTokens.forEach((token) => {
        if (INVERSE_INDEX.has(token)) {
            INVERSE_INDEX.get(token).forEach((feed) => {
                if (!key2MatchedTokens.has(feed.uniqueKey)) {
                    key2MatchedTokens.set(feed.uniqueKey, new Set());
                }
                key2MatchedTokens.get(feed.uniqueKey).add(token);
            });
        }
    });

    const allMatchedChineseFeeds = []
    chineseTokens.forEach((token, i) => {
        if (INVERSE_INDEX.has(token)) {
            allMatchedChineseFeeds.push(INVERSE_INDEX.get(token))
        }
    })
    console.log(allMatchedChineseFeeds);
    
    
    // token intersect, must match all chinese tokens
    let chineseFeeds = allMatchedChineseFeeds.length > 0 ? allMatchedChineseFeeds[0] : new Set()
    for (let i = 1; i < allMatchedChineseFeeds.length; i++) {
        chineseFeeds = setIntersect(chineseFeeds, allMatchedChineseFeeds[i])
    }

    chineseFeeds.forEach(feed => key2MatchedTokens.set(feed.uniqueKey, chineseTokens.size))

    return [...key2MatchedTokens.keys()]
        .filter(key => allowedUniqueKeys.has(key))
        .map((key) => DATABASE.get(key));
}