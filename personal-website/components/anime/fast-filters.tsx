import React from "react";
import { useImmer } from "use-immer";

export interface TypeFilter {
    name: "ANIME" | "MANGA" | "ANY";
}
export interface SortFilter {
    name:
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
}

const TYPE_FILTER_VALUES = ["ANIME", "MANGA", "ANY"];
const SORT_FILTER_VALUES = [
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

export const TYPE_FILTER: TypeFilter = {
    name: "ANIME",
};
export const SORT_FILTER: SortFilter = {
    name: "TRENDING_DESC",
}; // TODO

export interface AnimeFastFilterContext {
    typeFilter: TypeFilter;
    typeFilterOnClick: () => void;
}

const FastFilterContext = React.createContext<AnimeFastFilterContext>(null!);

export function AnimeFastFiltersProvider({ children }: { children: React.ReactNode }) {
    const [typeFilter, setTypeFilter] = useImmer<TypeFilter>(TYPE_FILTER);
    const typeFilterOnClick = () => {
        setTypeFilter((draft) => {
            // @ts-ignore
            draft.name = TYPE_FILTER_VALUES[(TYPE_FILTER_VALUES.indexOf(draft.name) + 1) % TYPE_FILTER_VALUES.length];
        });
    };
    return (
        <FastFilterContext.Provider
            value={{
                typeFilter,
                typeFilterOnClick,
            }}>
            {children}
        </FastFilterContext.Provider>
    );
}

export function useAnimeFastFilters() {
    return React.useContext(FastFilterContext);
}
