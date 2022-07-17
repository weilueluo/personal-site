import { DATABASE } from './Database';
import styles from './Filter.module.sass';
import { DEFAULT_FILTER_SECTIONS, filterFlatFeeds } from './FilterManager';
import { Filter as Filter_t, FilterSection } from './RSS.d';

export default function Filter(props) {
    const [filterSections, setFilterSections] = props.filterSectionsState;
    const [flatFeeds, setFlatFeeds] = props.flatFeedsState;

    const panels = filterSections.map((section, s_idx) => {
        const sectionName = section.displayName;

        const filters = section.filters.map((filter: Filter_t, f_idx) => {
            const onClick = () => {
                const newSections = setActive(filterSections, s_idx, f_idx);
                // console.log('section copy');
                // console.log(sectionsCopy);
                setFilterSections(newSections);
            };
            return (
                <li
                    key={filter.name}
                    className={`${styles['filter']} ${
                        filter.active ? styles['active'] : ''
                    }`}
                    onClick={() => onClick()}
                >
                    <button className={styles['filter-button']}>{filter.displayName}</button>
                </li>
            );
        });

        return (
            <div key={section.name} className={styles['panel']}>
                <span className={styles['title']}>{sectionName}</span>
                <ul className={styles['filters']}>{filters}</ul>
            </div>
        );
    });

    // currently it filters from the database, not the current displayed feeds, 
    // if desired, use flatFeeds instead of [...DATABASE.values()]
    const filterOnClick = () => {
        console.log([...DATABASE.values()]);
        
        setFlatFeeds(filterFlatFeeds([...DATABASE.values()], filterSections))
    };
    const clearOnClick = () => {
        const clearSections = structuredClone(DEFAULT_FILTER_SECTIONS)
        // set everything inactive
        clearSections.forEach(section => {
            section.filters.forEach(filter => filter.active = false)
        })
        setFilterSections(clearSections);
        filterOnClick(); // update
    };

    return (
        <div className={styles['panels-container']}>
            {panels}

            <div className={styles['panel']}>
                <span className={styles['title']}>Controls</span>
                <ul className={styles['filters']}>
                    <button className={styles['filter-button']} onClick={filterOnClick}>
                        Apply
                    </button>

                    <button className={styles['filter-button']} onClick={clearOnClick}>
                        Clear
                    </button>    
                </ul>
            </div>
        </div>
    );
}

function setActive(sections: FilterSection[], s_idx: number, f_idx: number) {
    const sectionsCopy = structuredClone(sections);
    sectionsCopy[s_idx].filters[f_idx].active =
        !sectionsCopy[s_idx].filters[f_idx].active;
    return sectionsCopy;
}
