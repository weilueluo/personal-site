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
        setFlatFeeds(searchFlatFeeds(searchString, flatFeeds));
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
    const refreshOnClick = () => rssLoader.reload()

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
                    <img className={styles['search-button-img']} src="/icons/font-awesome/magnifying-glass-solid.svg" alt="search-icon" />
                </button>
                
            </div>

            {/* MIDDLE SECTION */}
            <div className={styles['feeds-header-middle']}>
                <button className={styles['header-button']} onClick={resetOnClick}>Reset</button>
                <button className={styles['header-button']} onClick={refreshOnClick}>Refresh</button>
                <button className={`${styles['header-button']} ${filterActive ? styles['filter-active'] : ''}`} onClick={filterTextOnClick}>Filter</button>
            </div>

            {/* BOTTOM SECTION */}
            <div className={styles['feeds-header-bottom']}>
                <button className={`${styles['loaded-feeds']} ${styles['header-button']}`}>Feeds {flatFeeds.length}</button>
                <button
                    className={`${styles['total-errors']} ${styles['header-button']}`}
                    onClick={totalErrorsOnClick}
                >
                    Errors {errors.length}
                </button>
            </div>
        </div>
    );
}
