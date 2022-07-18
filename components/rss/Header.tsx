import { useEffect, useState } from 'react';
import { DATABASE } from './Database';
import { DEFAULT_FILTER_SECTIONS } from './FilterManager';
import styles from './Header.module.sass';
import { searchFlatFeeds } from './Searcher';

export default function RSSHeader(props) {
    const [flatFeeds, setFlatFeeds] = props.flatFeedsState;
    const [filterActive, setFilterActive] = props.filterActiveState;
    const [filterSections, setFilterSections] = props.filterSectionsState;
    const [errorActive, setErrorActive] = props.errorActiveState;
    const errors = props.errors;
    const rssLoader = props.rssLoader;
    const loading = props.loading;
    const completed = props.completed

    // const nonChinese = /[^\p{Script=Han}]/gim
    // console.log(nonChinese);
    

    // searching
    const [searchString, setSearchString] = useState('');
    const searchButtonClicked = () => {
        const searchInput = document.getElementById(
            'search-input'
        ) as HTMLInputElement;
        
        setSearchString(searchInput.value);
    };
    const searchButtonKeyDown = (event) => {
        // handle enter button entered
        if (event.code === 'Enter') {
            searchButtonClicked();
        }
    };
    useEffect(() => {
        console.log(`Search Received: ${searchString}`);
        // currently it searches from the database, not the current displayed feeds, 
        // if desired, use flatFeeds instead of [...DATABASE.values()]
        setFlatFeeds(searchFlatFeeds(searchString, [...DATABASE.values()]));
    }, [searchString]);

    // filtering
    const filterTextOnClick = () => setFilterActive(!filterActive);

    // error
    const totalErrorsOnClick = () => setErrorActive(!errorActive);

    // reset
    const resetOnClick = () => {
        setFilterSections(DEFAULT_FILTER_SECTIONS);
        setFlatFeeds([...DATABASE.values()]);
    };

    // refresh
    const refreshOnClick = () => {
        DATABASE.clear()
        rssLoader.reload()
    }

    // display status
    const [status, setStatus] = useState(<></>)
    useEffect(() => {
        if (completed) {
            setStatus(<img className={styles['completed-img']} src='/icons/misc/check-mark.svg' />)
        } else if (loading) {
            setStatus(<img className={styles['loading-img']} src='/icons/misc/progress.svg' />)
        }
    }, [loading, completed])

    return (
        <div className={styles['feeds-header']}>

            {/* TOP SECTION */}
            <div className={styles['feeds-header-top']}>
                <input
                    id='search-input'
                    type='text'
                    className={styles['feeds-search-box']}
                    onKeyDown={searchButtonKeyDown}
                    tabIndex={0}
                />
                <button className={`${styles['header-button']} ${styles['search-button']}`} onClick={searchButtonClicked}>
                    <img className={styles['search-button-img']} src="/icons/misc/magnifying-glass-solid.svg" alt="search-icon" />
                </button>
                
            </div>

            {/* MIDDLE SECTION */}
            <div className={styles['feeds-header-middle']}>
                <button className={`${styles['header-button']} ${styles['reset-button']}`} onClick={resetOnClick}>Reset</button>
                <button className={`${styles['header-button']} ${styles['refresh-button']}`} onClick={refreshOnClick}>Refresh</button>
                <button className={`${styles['header-button']} ${styles['filter-button']} ${filterActive ? styles['filter-active'] : ''}`} onClick={filterTextOnClick}>Filter</button>
            </div>

            {/* BOTTOM SECTION */}
            <div className={styles['feeds-header-bottom']}>
                <button className={`${styles['loaded-feeds']} ${styles['header-button']}`}>{flatFeeds.length} Feeds {status}</button>
                <button
                    className={`${styles['total-errors']} ${styles['header-button']}`}
                    onClick={totalErrorsOnClick}
                >
                    Error {errors.length}
                </button>
            </div>
        </div>
    );
}
