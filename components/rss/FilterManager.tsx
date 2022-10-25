import { RSS_OPTIONS } from "./Options";
import { FilterSection, FlatFeed } from "./RSS.d";
import { toMonday, toStartOfMonth, toStartOfTheDay, toStartOfYear, toYesterday } from "./Utils";

// did not use enum because I want to associate function and display name to the filter date
class FilterDate {

    displayName: string;
    getStartDate: Function

    private constructor(displayName: string, getStartDate: Function) {
        this.displayName = displayName
        this.getStartDate = getStartDate
    }

    static TODAY = new FilterDate('Today', () => toStartOfTheDay(new Date()));
    static YESTERDAY = new FilterDate('Two Days', () => toYesterday(new Date()));
    static THIS_WEEK = new FilterDate('This Week', () => toMonday(new Date()))
    static THIS_MONTH = new FilterDate('This Month', () => toStartOfMonth(new Date()))
    static THIS_YEAR = new FilterDate('This Year', () => toStartOfYear(new Date()))
}

const SOURCE_FILTERS = RSS_OPTIONS.map(opt => ({
    displayName: opt.name,
    name: opt.name,
    active: false
}))

const DATE_FILTERS = Object.keys(FilterDate).map(date => ({
    name: date as keyof FilterDate,
    displayName: FilterDate[date].displayName,  // can't gurrantee type of this, see https://stackoverflow.com/questions/55012174/why-doesnt-object-keys-return-a-keyof-type-in-typescript
    active: false
}))

const NAME2FILTER_FUNCTION = {
    // (flatFeeds, FilterSecton) -> flatFeeds
    source: filterSource,
    date: filterDate
}

export const DEFAULT_FILTER_SECTIONS: FilterSection[] = [
    {
        displayName: 'Source',
        name: 'source',
        filters: SOURCE_FILTERS,
    },
    {
        displayName: 'Date',
        name: 'date',
        filters: DATE_FILTERS,
    }
]

function filterSource(flatFeeds: FlatFeed[], opt: FilterSection): FlatFeed[] {
    const activeFilters = opt.filters.filter(opt => opt.active)
    if (activeFilters.length == 0) {
        // if none of the filter is selected, do not filter
        return flatFeeds
    }
    const nameWanted = new Set(activeFilters.map(opt => opt.name))
    const filtered = flatFeeds.filter(feed => feed.name && nameWanted.has(feed.name))
    // console.log('filtered source');
    // console.log(filtered);
    return filtered
}

function filterDate(flatFeeds: FlatFeed[], opt: FilterSection): FlatFeed[] {
    const activeDateFilters = opt.filters.filter(opt => opt.active)
    // console.log('active filter');
    // console.log(activeDateFilters);

    if (activeDateFilters.length == 0) {
        // if none of the filter is selected, do not filter
        return flatFeeds
    }

    for (const filter of activeDateFilters) {
        const startDate = FilterDate[filter.name].getStartDate()
        // console.log(startDate.toDateString());

        flatFeeds = flatFeeds.filter(feed => feed.jsDate && feed.jsDate.getTime() - startDate.getTime() >= 0)
    }

    // console.log('filtered date');
    // console.log(flatFeeds);
    return flatFeeds
}

export function filterFlatFeeds(flatFeeds: FlatFeed[], filterSections: FilterSection[]) {

    for (const filterSection of filterSections) {
        flatFeeds = NAME2FILTER_FUNCTION[filterSection.name](flatFeeds, filterSection)
    }
    // console.log('filtered');
    // console.log(flatFeeds);

    return flatFeeds
}


export function setAllFilters(value: boolean, oldSections: FilterSection[]) {
    return setAllFiltersInplace(value, structuredClone(oldSections))
}

export function setAllFiltersInplace(value: boolean, sections: FilterSection[]) {
    sections.forEach(section => {
        section.filters.forEach(filter => filter.active = value)
    })
    return sections
}

export function isAllFilters(value: boolean, sections: FilterSection[]) {
    for (const section of sections) {
        for (const filter of section.filters) {
            if (filter.active !== value) {
                return false
            }
        }
    }
    return true
}

// check if all filters in the section has the same boolean active value
// not all same => null
// all same => boolean indicate which same value they have
export function isAllFiltersSame(section: FilterSection) {

    let firstFoundActive: boolean = null;

    for (const filter of section.filters) {
        if (firstFoundActive === null) {
            firstFoundActive = filter.active
        } else if (firstFoundActive != filter.active) {
            return null
        }
    }
    return firstFoundActive
}