import { DATABASE } from "./Database";
import { FlatFeed } from "./RSS.d";


// for spliting text
const nonAlphanumeric = /\W/gim;
// map token to feed
const INVERSE_INDEX = new Map<string, Set<FlatFeed>>();
const PROCESSED = new Set()

// convert raw text into cleaned/normalized tokens
function extractTokensFromString(
    text: string,
    filterEmpty = false,
    addEmpty = false
) {
    const tokens = new Set(
        text
            .split(nonAlphanumeric)
            .map((token) => token.trim().toLowerCase())
            .filter((token) => (filterEmpty ? token.length > 0 : true))
    );

    // for match everything if user input empty string
    if (addEmpty) {
        tokens.add('');
    }

    return tokens;
}

function extractTokensFromFlatFeed(flatFeed: FlatFeed) {
    const releventContent = (flatFeed.title || "") 
                            + (flatFeed.contentSnippet || flatFeed.content || "")
                            + (flatFeed.name || "")
                            + (flatFeed.jsDate && flatFeed.jsDate.toDateString() || "")
    return extractTokensFromString(releventContent, true, true);
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
    const allowedUniqueKeys = new Set(flatFeeds.map(feed => feed.uniqueKey))
    populateInverseIndex(flatFeeds);
    const searchTokens = extractTokensFromString(searchString, false, false);

    const key2MatchedTokens = new Map();
    searchTokens.forEach((token) => {
        if (INVERSE_INDEX.has(token)) {
            INVERSE_INDEX.get(token).forEach((feed) => {
                if (!key2MatchedTokens.has(feed.uniqueKey)) {
                    key2MatchedTokens.set(feed.uniqueKey, new Set());
                }
                key2MatchedTokens.get(feed.uniqueKey).add(token);
            });
        }
    });

    return [...key2MatchedTokens.keys()]
        .filter(key => allowedUniqueKeys.has(key))
        .map((key) => DATABASE.get(key));
}