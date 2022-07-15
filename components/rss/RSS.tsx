import { useEffect, useState } from 'react';
import UnderDevelopment from '../common/UnderDevelopment';
import { DATABASE, updateDatabase } from './Database';
import RSSError, { RSSNoError } from './Error';
import Feed from './Feed';
import Filter from './Filter';
import { DEFAULT_FILTER_SECTIONS } from './FilterManager';
import RSSLoader from './Loader';
import { RSS_OPTIONS } from './Options';
import { FeedsMap, RSSRequestError } from './RSS.d';
import styles from './RSS.module.sass';

import { searchFlatFeeds } from './Searcher';
import { feeds2flatFeeds, sortFlatFeedsDesc as sortFlatFeedsDateDesc } from './Utils';

export default function RSS() {

    // setup RSS loader
    const [rawFeeds, setFeeds] = useState<FeedsMap>(new Map());
    const rssLoader = new RSSLoader(setFeeds);
    rssLoader.setOptions(RSS_OPTIONS);

    // when rawfeeds are updated: 
    // convert feeds to flat feeds (expand items in each rss url response)
    const [flatFeeds, setFlatFeeds] = useState([]);
    useEffect(() => {
        const defaultLimit = null;
        const flatFeeds = feeds2flatFeeds(rawFeeds, defaultLimit);
        setFlatFeeds(flatFeeds);
        updateDatabase(flatFeeds)
    }, [rawFeeds]);

    // when flat feeds are updated:
    // convert flat feeds to JSX elements, elements are referred as content
    const [feedJsxs, setFeedJsxs] = useState([]);
    useEffect(() => {
        // console.log('flat feeds')
        // console.log(flatFeeds);
        sortFlatFeedsDateDesc(flatFeeds); // directly modify state, maybe dangerous? but it works, yolo!

        // map flat feed to jsx element
        const feedJsxs = flatFeeds.map((flatFeed, i) => (
            <Feed key={flatFeed.uniqueKey} flatFeed={flatFeed} i={i} />
        ));
        setFeedJsxs(feedJsxs);
    }, [flatFeeds]);

    // on error
    const [errorJsxs, setErrorJsxs] = useState([]);
    const [totalErrors, setTotalErrors] = useState(0)
    rssLoader.on_error = (errors: RSSRequestError[]) => {

        if (errors.length == 0) {
            setErrorJsxs([<RSSNoError />])
        } else {
            const errorJsxs = errors.map((error) => (
                <RSSError key={error.url} error={error} />
            ));
            setErrorJsxs(errorJsxs);
        }

        setTotalErrors(errors.length)
    };
    // whether to show errors
    const [errorActive, setErrorActive] = useState(false);
    const totalErrorsOnClick = () => setErrorActive(!errorActive);

    // searching
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

    // filtering
    // whether to show filter
    const [filterActive, setFilterActive] = useState(false);
    const filterTextOnClick = () => setFilterActive(!filterActive);
    const [filterSections, setFilterSections] = useState(DEFAULT_FILTER_SECTIONS)

    // reset
    const resetOnClick = () => {
        setFilterSections(DEFAULT_FILTER_SECTIONS)
        setFlatFeeds([...DATABASE.values()])
    }

    // initialize rssloader
    useEffect(() => {
        rssLoader.reload();
    }, []);

    return (
        <>
            <UnderDevelopment />
            <div className={styles['feeds-header']}>
                <div className={styles['feeds-header-top']}>
                    <input
                        id='search-input'
                        type='text'
                        className={styles['feeds-search-box']}
                    />
                    <button onClick={() => searchButtonClicked()}>Search</button>
                    <button onClick={() => resetOnClick()}>Reset</button>
                    <button onClick={() => rssLoader.reload()}>Refresh</button>
                </div>
                
                <span>Loaded Feeds {feedJsxs.length}</span>
                <button
                    className={styles['total-errors']}
                    onClick={() => totalErrorsOnClick()}
                >
                    Total Errors {totalErrors}
                </button>
                <button
                    className={styles['filter-text']}
                    onClick={() => filterTextOnClick()}
                >
                    Filter
                </button>
            </div>

            {filterActive && <Filter sections={filterSections} setSections={setFilterSections} flatFeeds={flatFeeds} setFlatFeeds={setFlatFeeds} />}
            {errorActive && <ul className={styles['errors-container']}>{errorJsxs}</ul>}
            <ul className={styles['feeds-container']}>{feedJsxs}</ul>
        </>
    );
}

function LoadingFeed({ i }) {
    return <li key={i} className={styles['feed-li-loading']}></li>;
}
