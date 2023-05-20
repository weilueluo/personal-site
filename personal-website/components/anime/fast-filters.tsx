"use client";
import React, { useState } from "react";
import { useImmer } from "use-immer";
import { useMyAnimeCollection } from "./collections";

export type TypeFilterName = "ANIME" | "MANGA" | "ANY";
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
export type CountryFilterName = "JP" | "CN" | "ANY";
export type MyFavoriteFilterName = "FAVOURITES";

export interface TypeFilter {
    name: TypeFilterName;
}
export interface SortFilter {
    name: SortFilterName;
}
export interface CountryFilter {
    name: CountryFilterName;
}
export interface MyFavoriteFilter {
    name: MyFavoriteFilterName;
    active: boolean;
}

export const TYPE_FILTER_VALUES: TypeFilterName[] = ["ANIME", "MANGA", "ANY"];
export const SORT_FILTER_VALUES = [
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
export const COUNTRY_FILTER_VALUES: CountryFilterName[] = ["JP", "CN", "ANY"];
export const COUNTRT_FILTER_DISPLAY_NAMES: Record<CountryFilterName, string> = {
    JP: "Japan",
    CN: "China",
    ANY: "Any",
};

export const TYPE_FILTER: TypeFilter = {
    name: "ANIME",
};
export const SORT_FILTER: SortFilter = {
    name: "TRENDING_DESC",
};
export const COUNTRY_FILTER: CountryFilter = {
    name: "JP",
};

export interface AnimeFastFilterContext {
    typeFilter: TypeFilter;
    setTypeFilter: (type: TypeFilterName) => void;
    sortFilter: SortFilter;
    setSortFilter: (sort: SortFilterName) => void;
    countryFilter: CountryFilter;
    setCountryFilter: (country: CountryFilterName) => void;
    myFavouriteFilter: MyFavoriteFilter;
    setFavouriteFilter: (active: boolean) => void;
}

const FastFilterContext = React.createContext<AnimeFastFilterContext>(null!);

export function AnimeFastFiltersProvider({ children }: { children: React.ReactNode }) {
    const [typeFilter, setTypeFilter_] = useImmer<TypeFilter>(TYPE_FILTER);
    const setTypeFilter = (type: TypeFilterName) => {
        setTypeFilter_((draft) => {
            if (TYPE_FILTER_VALUES.includes(type)) {
                draft.name = type;
            } else {
                console.warn(`Invalid type filter name: ${type}`);
            }
        });
    };

    const [sortFilter, setSortFilter_] = useImmer<SortFilter>(SORT_FILTER);
    const setSortFilter = (sort: SortFilterName) => {
        setSortFilter_((draft) => {
            if (SORT_FILTER_VALUES.includes(sort)) {
                draft.name = sort;
            } else {
                console.warn(`Invalid sort filter name: ${sort}`);
            }
        });
    };

    const [countryFilter, setCountryFilter_] = useImmer<CountryFilter>(COUNTRY_FILTER);
    const setCountryFilter = (country: CountryFilterName) => {
        setCountryFilter_((draft) => {
            if (COUNTRY_FILTER_VALUES.includes(country)) {
                draft.name = country;
            } else {
                console.warn(`Invalid country filter name: ${country}`);
            }
        });
    };

    const [myFavouriteFilter, setMyFavouriteFilter_] = useImmer<MyFavoriteFilter>({
        name: "FAVOURITES",
        active: true,
    });
    const setFavouriteFilter = (active: boolean) => {
        setMyFavouriteFilter_((draft) => {
            draft.active = active;
        });
    };

    return (
        <FastFilterContext.Provider
            value={{
                typeFilter,
                setTypeFilter,
                sortFilter,
                setSortFilter,
                countryFilter,
                setCountryFilter,
                myFavouriteFilter,
                setFavouriteFilter,
            }}>
            {children}
        </FastFilterContext.Provider>
    );
}

export function useAnimeFastFilters() {
    return React.useContext(FastFilterContext);
}
