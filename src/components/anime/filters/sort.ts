"use client";

import { useImmer } from "use-immer";
import { Clickable } from "./common";

export type SortFilterName =
    | "TITLE_ENGLISH"
    | "TITLE_ENGLISH_DESC"
    | "START_DATE"
    | "START_DATE_DESC"
    | "SCORE"
    | "SCORE_DESC"
    | "UPDATED_AT"
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
    "UPDATED_AT",
    "UPDATED_AT_DESC",
    "POPULARITY",
    "POPULARITY_DESC",
    "TRENDING",
    "TRENDING_DESC",
];

export function useSortFilter(): Clickable<SortFilter, SortFilterName> {
    const [sortFilter, setSortFilterInternal] = useImmer<Clickable<SortFilter, SortFilterName>>({
        name: "TRENDING_DESC",
        onClick: (name: SortFilterName) => {
            setSortFilterInternal(draft => {
                if (SORT_FILTER_VALUES.includes(name)) {
                    draft.name = name;
                } else {
                    console.warn(`Invalid sort filter name: ${name}`);
                }
            });
        },
    });

    return sortFilter;
}
