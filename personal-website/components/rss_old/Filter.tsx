import { DATABASE } from './Database';
import styles from './Filter.module.sass';
import {
    filterFlatFeeds,
    isAllFiltersSame,
    setAllFiltersInplace,
} from './FilterManager';
import { FilterSection, Filter as Filter_t } from './RSS.d';

export default function Filter(props: any) {
    const [filterSections, setFilterSections] = props.filterSectionsState;
    const [, setFlatFeeds] = props.flatFeedsState;

    const setAndApplyNewSections = (newSections: FilterSection[]) => {
        setFilterSections(newSections);
        // currently it filters from the database, not the current displayed feeds,
        // if desired, use flatFeeds instead of [...DATABASE.values()]
        setFlatFeeds(filterFlatFeeds([...DATABASE.values()], newSections));
    };

    const panels = filterSections.map((section: any, s_idx: any) => {
        const sectionName = section.displayName;

        const filters = section.filters.map((filter: Filter_t, f_idx: any) => {
            const onClick = () => {
                const newSections = setActive(filterSections, s_idx, f_idx);
                // console.log('section copy');
                // console.log(sectionsCopy);
                setAndApplyNewSections(newSections);
            };
            return (
                <li
                    key={filter.name}
                    className={`${styles['filter']} ${
                        filter.active ? styles['active'] : ''
                    }`}
                    onClick={() => onClick()}>
                    <button className={styles['filter-button']}>
                        {filter.displayName}
                    </button>
                </li>
            );
        });

        const sectionTitleOnClick = () => {
            const filterSectionsCopy = structuredClone(filterSections);
            const sameValue = isAllFiltersSame(filterSectionsCopy[s_idx]);

            // if values are not same, make everything inactive
            // else set it to opposite value
            const setValue = sameValue == null ? false : !sameValue;
            setAllFiltersInplace(setValue, [filterSectionsCopy[s_idx]]);
            setAndApplyNewSections(filterSectionsCopy);
        };

        return (
            <div key={section.name} className={styles['panel']}>
                <span
                    className={`${styles['title']}`}
                    onClick={sectionTitleOnClick}>
                    {sectionName}
                </span>
                <ul className={styles['filters']}>{filters}</ul>
            </div>
        );
    });

    // const clearOnClick = () => {
    //     const clearedSections = setAllFilters(false, DEFAULT_FILTER_SECTIONS)
    //     setAndApplyNewSections(clearedSections)
    // };

    return (
        <div className={styles['panels-container']}>
            {panels}

            {/* Enable this when there is too many panels, for clearing everything */}
            {/* <div className={styles['panel']}>
                <span className={styles['title']}>Controls</span>
                <ul className={styles['filters']}>
                    <button className={styles['filter-button']} onClick={clearOnClick}>
                        Clear
                    </button>    
                </ul>
            </div> */}
        </div>
    );
}

function setActive(sections: FilterSection[], s_idx: number, f_idx: number) {
    const sectionsCopy = structuredClone(sections);
    sectionsCopy[s_idx].filters[f_idx].active =
        !sectionsCopy[s_idx].filters[f_idx].active;
    return sectionsCopy;
}
