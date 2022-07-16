import { useEffect, useState } from 'react';
import UnderDevelopment from '../common/UnderDevelopment';
import RSSErrors from './Error';
import Feeds from './Feeds';
import Filter from './Filter';
import { DEFAULT_FILTER_SECTIONS } from './FilterManager';
import RSSHeader from './Header';
import { useRawFeed2FlatFeed } from './hooks';
import RSSLoader from './Loader';
import { RSS_OPTIONS } from './Options';
import { FeedsMap, RSSRequestError } from './RSS.d';
import styles from './RSS.module.sass';

export default function RSS() {
    // setup RSS loader
    const [rawFeeds, setFeeds] = useState<FeedsMap>(new Map());
    const rssLoader = new RSSLoader(setFeeds);
    rssLoader.setOptions(RSS_OPTIONS);

    // rawfeeds to flatFeeds
    const [flatFeeds, setFlatFeeds] = useState([]);
    useRawFeed2FlatFeed(rawFeeds, setFlatFeeds);

    // on error
    const [errors, setErrors] = useState([]);
    rssLoader.on_error = (errors: RSSRequestError[]) => setErrors(errors);

    // whether to show errors
    const [errorActive, setErrorActive] = useState(false);

    // filter
    const [filterActive, setFilterActive] = useState(false);
    // filter sections completely represents the state of the filter, used by filtering function and rendering
    const [filterSections, setFilterSections] = useState(
        DEFAULT_FILTER_SECTIONS
    );

    // initialize rssloader to load feeds
    // feeds = rawFeeds will get converted to flatFeeds by hooks listening on rawFeeds, and rendered by <Feeds />
    useEffect(() => rssLoader.reload(), []);

    return (
        <>
            <UnderDevelopment />

            <h1 className={styles['feeds-title']}>Weilue&apos;s RSS Feeds</h1>

            <RSSHeader
                flatFeedsState={[flatFeeds, setFlatFeeds]}
                filterActiveState={[filterActive, setFilterActive]}
                filterSectionsState={[filterSections, setFilterSections]}
                errorActiveState={[errorActive, setErrorActive]}
                rssLoader={rssLoader}
                errors={errors}
            />

            <div className={styles['separator']}></div>

           <RSSContent 
                filterSectionsState={[filterSections, setFilterSections]}
                flatFeedsState={[flatFeeds, setFlatFeeds]}
                filterActive={filterActive}
                errorActive={errorActive}
                errors={errors}
           />
        </>
    );
}

function RSSContent(props) {
    return (
        <div className={styles['content']}>
            {props.errorActive && <RSSErrors errors={props.errors} />}

            {props.filterActive && (
                <Filter
                    filterSectionsState={props.filterSectionsState}
                    flatFeedsState={props.flatFeedsState}
                />
            )}


            {(props.errorActive || props.filterActive) && <div className={styles['separator']}></div>}
            <Feeds flatFeeds={props.flatFeedsState[0]} />
        </div>
    )
}

function LoadingFeed({ i }) {
    return <li key={i} className={styles['feed-li-loading']}></li>;
}
