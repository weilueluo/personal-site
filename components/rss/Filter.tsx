import { DATABASE } from './Database';
import styles from './Filter.module.sass';
import { DEFAULT_FILTER_SECTIONS, filter } from './FilterManager';
import { Filter as Filter_t, FilterSection } from './RSS.d';

export default function Filter({
    sections,
    setSections,
    flatFeeds,
    setFlatFeeds,
}) {

    const panels = sections.map((section, s_idx) => {
        const sectionName = section.displayName;

        const filters = section.filters.map((filter: Filter_t, f_idx) => {
            const onClick = () => {
                const newSections = setActive(sections, s_idx, f_idx);
                // console.log('section copy');
                // console.log(sectionsCopy);
                setSections(newSections);
            };
            return (
                <li
                    key={filter.name}
                    className={`${styles['filter']} ${
                        filter.active ? styles['active'] : ''
                    }`}
                    onClick={() => onClick()}
                >
                    {filter.displayName}
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

    const filterOnClick = () => setFlatFeeds(filter(flatFeeds, sections))
    const clearOnClick = () => {
        setSections(DEFAULT_FILTER_SECTIONS)
        filterOnClick()  // update
    }

    return (
        <div className={styles['panels-container']}>
            {panels}
            <div className={styles['footer']}>
                <button className={styles['filter-button']} onClick={() => filterOnClick()}>{'filter'}</button>
                <button className={styles['clear-button']} onClick={() => clearOnClick()}>{'clear'}</button>
            </div>
        </div>
    )
}

function setActive(sections: FilterSection[], s_idx: number, f_idx: number) {
    const sectionsCopy = structuredClone(sections);
    sectionsCopy[s_idx].filters[f_idx].active =
        !sectionsCopy[s_idx].filters[f_idx].active;
    return sectionsCopy;
}
