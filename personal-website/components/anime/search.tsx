"use client";
import React, { startTransition, useCallback, useContext, useEffect, useState } from "react";
import { useDebounce } from "react-use";
import useSWRInfinite, { SWRInfiniteResponse } from "swr/infinite";
import { useMyAnimeCollection } from "./collections";
import { useAnimeFastFilters } from "./fast-filters";
import { FetchSearchParams, PageInfoItem, SectionMedia } from "./graphql/graphql";
import { GenreFilterItem, TagFilterItem, useAnimeSlowFilters } from "./slow-filters";
import { Page, fetchSearchPage } from "./graphql/query";

export type FilterType = "genre" | "tag" | "type" | "adult" | "clearAll";

export interface FilterItem {
    name: string;
    active: boolean;
    type: FilterType;
    isAdult?: boolean;
}

interface SearchContextValue {
    swrAnimeResponse: SWRInfiniteResponse<Page<SectionMedia[]>>;
    mergedData: SectionMedia[];
    pageInfo: PageInfoItem | undefined;
    setSearchString: React.Dispatch<React.SetStateAction<string>>;
}

const SearchContext = React.createContext<SearchContextValue>(null!);

export function AnimeSearchProvider({ children }: { children: React.ReactNode }) {
    const [searchString, setSearchString] = useState<string>("");
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

    const { favourites } = useMyAnimeCollection();
    const [idsToFilter, setIdsToFilter] = useState<Set<number> | undefined>(undefined);

    const [debouncedParams, setDebouncedParams] = useState<FetchSearchParams>({
        searchString,
        activeGenreFilters,
        activeTagFilters,
        typeFilter,
        sortFilter,
        countryFilter,
        idsToFilter,
        page: 1,
    });
    useDebounce(
        () =>
            startTransition(() =>
                setDebouncedParams({
                    searchString,
                    activeGenreFilters,
                    activeTagFilters,
                    typeFilter,
                    sortFilter,
                    countryFilter,
                    idsToFilter,
                    page: 1,
                })
            ),
        500,
        [searchString, activeGenreFilters, activeTagFilters, typeFilter, sortFilter, countryFilter, idsToFilter]
    );

    const getSearchKey = useCallback(
        (prevPage: number, prevData: Page<SectionMedia[]>): FetchSearchParams | null => {
            if (prevData && !prevData.pageInfo?.hasNextPage) {
                return null;
            }

            if (prevPage === 0) {
                return {
                    ...debouncedParams,
                    page: 1,
                };
            } else {
                return {
                    ...debouncedParams,
                    page: prevPage + 1,
                };
            }
        },
        [debouncedParams]
    );

    const searchFetcher = useCallback((params: FetchSearchParams) => {
        return fetchSearchPage(params);
    }, []);

    const swrAnimeResponse = useSWRInfinite<Page<SectionMedia[]>>(getSearchKey, searchFetcher, {
        revalidateFirstPage: false,
    });

    const { data } = swrAnimeResponse;
    const [mergedData, setMergedData] = useState<SectionMedia[]>([]);
    const [pageInfo, setPageInfo] = useState<PageInfoItem | undefined>(undefined);

    useEffect(() => {
        // sometimes we get duplicate anime back... fix it
        const newMergedData = data?.flatMap((data) => data.data || []) || [];
        const newDataIds = new Set();
        const uniqueMergedData: SectionMedia[] = [];
        newMergedData.forEach((item) => {
            if (item.id && !newDataIds.has(item.id)) {
                newDataIds.add(item.id);
                uniqueMergedData.push(item);
            }
        });

        setMergedData(uniqueMergedData);

        // fix page info's total count by unique merged data
        const newPageInfo = data?.[data.length - 1]?.pageInfo;
        if (newPageInfo && !newPageInfo?.hasNextPage) {
            newPageInfo.total = uniqueMergedData.length;
        }
        setPageInfo(newPageInfo);
    }, [data]);

    useEffect(() => {
        if (myFavouriteFilter.active) {
            setIdsToFilter(favourites);
        } else {
            setIdsToFilter(undefined);
        }
    }, [favourites, myFavouriteFilter]);

    return (
        <SearchContext.Provider
            value={{
                swrAnimeResponse,
                mergedData,
                pageInfo,
                setSearchString,
            }}>
            {children}
        </SearchContext.Provider>
    );
}

export function useAnimeSearch() {
    return useContext(SearchContext);
}