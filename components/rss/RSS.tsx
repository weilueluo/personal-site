import { useEffect, useState } from 'react';
import UnderDevelopment from '../common/UnderDevelopment';
import Feed from './Feed';
import { FeedsMap, FlatFeed, RSSOptions, RSSRequestError } from './RSS.d';
import styles from './RSS.module.sass';
import RSSError from './RSSError';
import RSSManager, {
    computeGUID,
    feed2flatFeeds, searchFlatFeeds, sortFlatFeedsDesc
} from './RSSManager';

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

    // setup RSS manager
    const [feeds, setFeeds] = useState<FeedsMap>(new Map());
    const rssManager = new RSSManager(setFeeds);
    rssManager.setOptions(rssOptions);

    // convert feeds to flat feeds (expand items in each rss url response)
    const [flatFeeds, setFlatFeeds] = useState([]);
    useEffect(() => {
        // convert feeds from each url into single array
        const flatFeeds = [];
        const limit = 5;  // TODO: feeds limit from each source
        feeds.forEach((feed, name) => {
            const extras = (flatFeed: FlatFeed) => {
                const date = flatFeed.pubDate || flatFeed.isoDate;
                return {
                    name: name,
                    jsDate: date ? new Date(date) : null,
                    uniqueKey: computeGUID(flatFeed),
                };
            };
            flatFeeds.push(...feed2flatFeeds(feed, extras, limit));
        });

        setFlatFeeds(flatFeeds);
    }, [feeds]);

    // convert flat feeds to JSX elements, elements are referred as content
    const [content, setContent] = useState([]);
    useEffect(() => {
        // console.log('flat feeds')
        // console.log(flatFeeds);
        sortFlatFeedsDesc(flatFeeds); // directly modify state, maybe dangerous? but it works! yolo!

        const newContent = flatFeeds.map((flatFeed, i) => (
            <Feed key={flatFeed.uniqueKey} flatFeed={flatFeed} i={i} />
        ));
        setContent(newContent);
    }, [flatFeeds]);
    useEffect(() => {
        setTotalFeeds(content.length);
    }, [content])

    // on error
    const [errorJsxs, setErrorJsxs] = useState([])
    const [totalErrors, setTotalErrors] = useState(0)
    rssManager.on_error = (errors: RSSRequestError[]) => {
        const errorJsxs = errors.map(error => <RSSError key={error.url} error={error}/>)
        setErrorJsxs(errorJsxs)
    }
    useEffect(() => {
        setTotalErrors(errorJsxs.length)
    }, [errorJsxs])
    const [showErrorActive, setShowErrorActive] = useState(false)
    const totalErrorsOnClick = () => setShowErrorActive(!showErrorActive)

    // search click stuff
    const [searchString, setSearchString] = useState('');
    const searchButtonClicked = () => {
        const searchInput = document.getElementById(
            'search-input'
        ) as HTMLInputElement;
        setSearchString(searchInput.value);
    };
    useEffect(() => {
        console.log(`Search Received: ${searchString}`);
        setFlatFeeds(searchFlatFeeds(searchString, flatFeeds));
    }, [searchString]);

    useEffect(() => {
        rssManager.reload();
    }, []);

    // filter by type
    const [filterActive, setFilterActive] = useState(false)
    const filterTextOnClick = () => setFilterActive(!filterActive)


    return (
        <>
            <UnderDevelopment />
            <div className={styles['feeds-header']}>
                <input
                    id='search-input'
                    type='text'
                    className={styles['feeds-search-box']}
                />
                <button onClick={() => searchButtonClicked()}>Search</button>
                <button onClick={() => rssManager.reload()}>Refresh</button>
                <span>Loaded Feeds: {loadedFeeds}.</span>
                <span className={styles['total-errors']} onClick={() => totalErrorsOnClick()}>Total Errors: {totalErrors}.</span>
                <span className={styles['filter-text']} onClick={() => filterTextOnClick()}>Filter</span>
            </div>
            
            {filterActive && <div>{"Filter Section (temp)"}</div>}
            {showErrorActive && <ul className={styles['errors-container']}>{errorJsxs}</ul>}
            <ul className={styles['feeds-container']}>{content}</ul>
        </>
    );
}

function LoadingFeed({ i }) {
    return <li key={i} className={styles['feed-li-loading']}></li>;
}
