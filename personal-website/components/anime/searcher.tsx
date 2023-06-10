"use client";
import React, { startTransition, useCallback, useEffect } from "react";
import { useDebounce } from "react-use";
import useSWRInfinite, { SWRInfiniteResponse } from "swr/infinite";
import { CountryFilter } from "./filters/country";
import { MyFavoriteFilter } from "./filters/favourite";
import { SortFilter } from "./filters/sort";
import { TypeFilter } from "./filters/type";
import { PageInfoItem, SearchParams, SectionMedia } from "./graphql/graphql";
import { Page, fetchSearchPage } from "./graphql/query";
import { TagFilterItem, GenreFilterItem } from "./filters/tag-and-genre";
import { FilterItem } from "./filters/common";

export interface SearchResult {
    animeData: SectionMedia[];
    pageInfo: PageInfoItem | undefined;
    rawResponse: Omit<SWRInfiniteResponse<Page<SectionMedia[]>, any>, "data">;
}

export interface SearcherProps {
    countryFilter: CountryFilter;
    sortFilter: SortFilter;
    typeFilter: TypeFilter;
    myFavouriteFilter: MyFavoriteFilter;
    tagFilters: TagFilterItem[];
    genreFilters: GenreFilterItem[];
    myAnimeCollection: Set<number>;
    searchString: string;
    // setSearchResult: React.Dispatch<React.SetStateAction<SearchResult | undefined>>;
}

export function useSearch({
    countryFilter,
    sortFilter,
    typeFilter,
    myFavouriteFilter,
    tagFilters,
    genreFilters,
    myAnimeCollection,
    searchString,
}: SearcherProps): SearchResult {
    const activeGenreFilters = useActiveFilters(genreFilters);
    const activeTagFilters = useActiveFilters(tagFilters);
    const idsToFilter = useIdsToFilter(myAnimeCollection, myFavouriteFilter);

    const [searchParams, setSearchParams] = React.useState<SearchParams>({
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
        () => {
            startTransition(() => {
                setSearchParams({
                    searchString,
                    activeGenreFilters,
                    activeTagFilters,
                    typeFilter,
                    sortFilter,
                    countryFilter,
                    idsToFilter,
                    page: 1,
                });
            });
        },
        500,
        [searchString, activeGenreFilters, activeTagFilters, typeFilter, sortFilter, countryFilter, idsToFilter]
    );

    const getSearchKey = useCallback(
        (prevPage: number, prevData: Page<SectionMedia[]>): SearchParams | null => {
            if (prevData && !prevData.pageInfo?.hasNextPage) {
                return null;
            }

            if (prevPage === 0) {
                return {
                    ...searchParams,
                    page: 1,
                };
            } else {
                return {
                    ...searchParams,
                    page: prevPage + 1,
                };
            }
        },
        [searchParams]
    );

    const searcher = (params: SearchParams) => fetchSearchPage(params);

    const { data, ...rawResponse } = useSWRInfinite<Page<SectionMedia[]>>(getSearchKey, searcher);

    const [animeData, setAnimeData] = React.useState<SectionMedia[]>([]);
    const [pageInfo, setPageInfo] = React.useState<PageInfoItem | undefined>(undefined);

    useEffect(() => {
        // sometimes we get duplicate anime back... fix it
        const newMergedData = data?.flatMap(data => data.data || []) || [];
        const newDataIds = new Set();
        const uniqueMergedData: SectionMedia[] = [];
        newMergedData.forEach(item => {
            if (item.id && !newDataIds.has(item.id)) {
                newDataIds.add(item.id);
                uniqueMergedData.push(item);
            }
        });

        setAnimeData(uniqueMergedData);

        // fix page info's total count by unique merged data
        const newPageInfo = data?.[data.length - 1]?.pageInfo;
        if (newPageInfo && !newPageInfo?.hasNextPage) {
            newPageInfo.total = uniqueMergedData.length;
        }
        setPageInfo(newPageInfo);
    }, [data]);

    return {
        animeData,
        pageInfo,
        rawResponse,
    };
}

function useIdsToFilter(myAnimeCollection: Set<number>, myFavouriteFilter: MyFavoriteFilter) {
    const [idsToFilter, setIdsToFilter] = React.useState<Set<number> | undefined>(undefined);
    useEffect(() => {
        if (myFavouriteFilter.active) {
            setIdsToFilter(myAnimeCollection);
        } else {
            setIdsToFilter(undefined);
        }
    }, [myFavouriteFilter, myAnimeCollection]);

    return idsToFilter;
}

function useActiveFilters<T extends FilterItem>(filterItems: T[]) {
    const [activeFilters, setActiveFilters] = React.useState<T[]>([]);
    useEffect(() => {
        setActiveFilters(filterItems.filter(item => item.active));
    }, [filterItems]);

    return activeFilters;
}
