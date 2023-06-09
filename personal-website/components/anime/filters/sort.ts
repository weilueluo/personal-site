"use client";

import { useImmer } from "use-immer";

export type SortFilterName =
    | "TITLE_ENGLISH"
    | "TITLE_ENGLISH_DESC"
    | "START_DATE"
    | "START_DATE_DESC"
    | "SCORE"
    | "SCORE_DESC"
    | "UPDATE_AT"
    | "UPDATED_AT_DESC"
    | "POPULARITY"
    | "POPULARITY_DESC"
    | "TRENDING"
    | "TRENDING_DESC";

export interface SortFilter {
    name: SortFilterName;
}
export const SORT_FILTER_VALUES: SortFilterName[] = [
    "TITLE_ENGLISH",
    "TITLE_ENGLISH_DESC",
    "START_DATE",
    "START_DATE_DESC",
    "SCORE",
    "SCORE_DESC",
    "UPDATE_AT",
    "UPDATED_AT_DESC",
    "POPULARITY",
    "POPULARITY_DESC",
    "TRENDING",
    "TRENDING_DESC",
];
export const SORT_FILTER: SortFilter = {
    name: "TRENDING_DESC",
};

export function useSortFilter() {
    const [sortFilter, setSortFilterInternal] = useImmer<SortFilter>(SORT_FILTER);
    const setSortFilter = (sort: SortFilterName) => {
        setSortFilterInternal(draft => {
            if (SORT_FILTER_VALUES.includes(sort)) {
                draft.name = sort;
            } else {
                console.warn(`Invalid sort filter name: ${sort}`);
            }
        });
    };

    return {
        sortFilter,
        setSortFilter,
    };
}
