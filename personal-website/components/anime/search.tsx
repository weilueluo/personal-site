"use client";
import React, { startTransition, useCallback, useContext, useEffect, useState } from "react";
import { useDebounce } from "react-use";
import useSWRInfinite, { SWRInfiniteResponse } from "swr/infinite";
import { CountryFilter, MyFavoriteFilter, SortFilter, TypeFilter, useAnimeFastFilters } from "./fast-filters";
import { SectionMedia } from "./graphql";
import { Page, fetchSearchPage } from "./query";
import { GenreFilterItem, TagFilterItem, useAnimeSlowFilters } from "./slow-filters";

export type FilterType = "genre" | "tag" | "type";

export interface FilterItem {
    name: string;
    active: boolean;
    type: FilterType;
}

interface SearchContextValue {
    swrAnimeResponse: SWRInfiniteResponse<Page<SectionMedia[]>>;
    setSearchString: React.Dispatch<React.SetStateAction<string>>;
}

const SearchContext = React.createContext<SearchContextValue>(null!);

export function AnimeSearchProvider({ children }: { children: React.ReactNode }) {
    const [searchString, setSearchString] = useState<string>("");
    const [debouncedSearchString, setDebouncedSearchString] = useState<string>("");
    useDebounce(() => startTransition(() => setDebouncedSearchString(searchString)), 500, [searchString]);
    const { genreFilters, tagFilters } = useAnimeSlowFilters();
    const { typeFilter, sortFilter, countryFilter, myFavouriteFilter } = useAnimeFastFilters();

    const [activeGenreFilters, setActiveGenreFilters] = React.useState<GenreFilterItem[]>([]);
    useEffect(() => {
        setActiveGenreFilters(genreFilters.filter((item) => item.active));
    }, [genreFilters]);

    const [activeTagFilters, setActiveTagFilters] = React.useState<TagFilterItem[]>([]);
    useEffect(() => {
        setActiveTagFilters(tagFilters.filter((item) => item.active));
    }, [tagFilters]);

    const getSearchKey = useCallback(
        (prevPage: number, prevData: Page<SectionMedia[]>) => {
            const params = {
                debouncedSearchString,
                activeGenreFilters,
                activeTagFilters,
                typeFilter,
                sortFilter,
                countryFilter,
                myFavouriteFilter,
            };

            if (prevData && !prevData.pageInfo?.hasNextPage) {
                return null;
            }

            if (prevPage === 0) {
                return {
                    ...params,
                    page: 1,
                };
            } else {
                return {
                    ...params,
                    page: prevPage + 1,
                };
            }
        },
        [
            debouncedSearchString,
            activeGenreFilters,
            activeTagFilters,
            typeFilter,
            sortFilter,
            countryFilter,
            myFavouriteFilter,
        ]
    );

    const searchFetcher = (params: {
        searchString: string;
        activeGenreFilters: GenreFilterItem[];
        activeTagFilters: TagFilterItem[];
        typeFilter: TypeFilter;
        sortFilter: SortFilter;
        countryFilter: CountryFilter;
        myFavouriteFilter: MyFavoriteFilter;
        page: number;
    }) => {
        const {
            page,
            activeGenreFilters,
            activeTagFilters,
            searchString,
            typeFilter,
            sortFilter,
            countryFilter,
            myFavouriteFilter,
        } = params;

        return fetchSearchPage(
            page,
            searchString,
            activeGenreFilters,
            activeTagFilters,
            typeFilter,
            sortFilter,
            countryFilter,
            myFavouriteFilter
        );
    };

    const swrAnimeResponse = useSWRInfinite<Page<SectionMedia[]>>(getSearchKey, searchFetcher);

    return (
        <SearchContext.Provider
            value={{
                swrAnimeResponse,
                setSearchString,
            }}>
            {children}
        </SearchContext.Provider>
    );
}

export function useAnimeSearch() {
    const context = useContext(SearchContext);

    return {
        ...context.swrAnimeResponse,
        setSearchString: context.setSearchString,
    };
}
