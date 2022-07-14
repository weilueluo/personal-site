import { BaseSyntheticEvent, useEffect, useReducer, useState } from 'react';
import { useEffectOnce } from 'react-use';
import styles from './RSS.module.sass';
import UnderDevelopment from '../common/UnderDevelopment';
import Parser from 'rss-parser';
import { FeedsMap, FlatFeed, RSSOptions } from './RSS.d';
import RSSManager, { computeGUID, feed2flatFeeds, sortFlatFeedsDesc, searchFlatFeeds } from './RSSManager';
import { timeSince } from '../utils/utils';
import Feed from './Feed';

const rssOptions: RSSOptions = new Map([
    [
        'Github',
        {
            url: 'https://github.com/Redcxx.private.atom?token=AJNW6TLPB4JTBWMC7SLIJ6WA3EMWI',
        },
    ],

    [
        'Hacker News',
        {
            url: 'https://rsshub.app/hackernews',
        },
    ],

    [
        'Pixiv Weekly',
        {
            url: 'https://rsshub.app/pixiv/ranking/week',
        },
    ],

    [
        'Steam News',
        {
            url: 'https://store.steampowered.com/feeds/news/?l=english',
        },
    ],

    [
        'Token Insight',
        {
            url: ' https://tokeninsight.com/rss',
        },
    ],

    [
        'World Economic Forum',
        {
            url: 'https://rsshub.app/weforum/report',
        },
    ],

    [
        'hanime.tv',
        {
            url: 'https://rsshub.app/hanime/video',
        },
    ],

    [
        'Wired',
        {
            url: 'https://www.wired.com/feed',
        },
    ],

    [
        'BBC',
        {
            url: 'https://rsshub.app/bbc',
        },
    ],
]);

export default function RSS() {
    const [loadedFeeds, setTotalFeeds] = useState(0);

    const [feeds, setFeeds] = useState<FeedsMap>(new Map());
    const rssManager = new RSSManager(setFeeds);
    rssManager.setOptions(rssOptions);

    // convert feeds to flat feeds (expand items in each rss url response)
    const [flatFeeds, setFlatFeeds] = useState([])
    useEffect(() => {

        // convert feeds from each url into single array
        const flatFeeds = [];
        const limit = 10;
        feeds.forEach((feed, name) => {
            const extras = (flatFeed: FlatFeed) => {
                const date = flatFeed.pubDate || flatFeed.isodate
                return {
                    name: name,
                    jsDate: date ? new Date(date) : null,
                    uniqueKey: computeGUID(flatFeed)
                }
            };
            flatFeeds.push(...feed2flatFeeds(feed, extras, limit));
        });

        setFlatFeeds(flatFeeds)
    }, [feeds]);

    // convert flat feeds to JSX elements, elements are refered as content
    const [content, setContent] = useState([]);
    useEffect(() => {
        // console.log('flat feeds')
        // console.log(flatFeeds);
        sortFlatFeedsDesc(flatFeeds)  // directly modify state, maybe dangerous?

        const newContent = flatFeeds.map((flatFeed, i) => <Feed key={flatFeed.uniqueKey} flatFeed={flatFeed} i={i} />);
        setContent(newContent);
        setTotalFeeds(newContent.length);
    }, [flatFeeds])

    // search click stuff
    const [searchString, setSearchString] = useState("")
    const searchButtonClicked = () => {
        const searchInput = document.getElementById('search-input') as HTMLInputElement
        setSearchString(searchInput.value)
    }
    useEffect(() => {
        console.log(`Search Received: ${searchString}`);
        setFlatFeeds(searchFlatFeeds(searchString, flatFeeds))
    }, [searchString])


    useEffect(() => {
        rssManager.reload();
    }, []);

    return (
        <>
            <UnderDevelopment />
            <div className={styles['feeds-header']}>
                <input id='search-input' type="text" className={styles['feeds-search-box']} />
                <button onClick={() => searchButtonClicked()}>Search</button>
                <button onClick={() => rssManager.reload()}>Refresh</button>
                <span>Loaded Feeds: {loadedFeeds}</span>
            </div>
            
            <ul className={styles['feeds-container']}>{content}</ul>
        </>
    );
}

function LoadingFeed({ i }) {
    return <li key={i} className={styles['feed-li-loading']}></li>;
}
