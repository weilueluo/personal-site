import React, { useCallback, useContext, useEffect } from "react";
import useSWRInfinite, { SWRInfiniteResponse } from "swr/infinite";
import { CountryFilter, SortFilter, TypeFilter, useAnimeFastFilters } from "./fast-filters";
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
}

const SearchContext = React.createContext<SearchContextValue>(null!);

export function AnimeSearchProvider({ searchString, children }: { searchString: string; children: React.ReactNode }) {
    const { genreFilters, tagFilters } = useAnimeSlowFilters();
    const { typeFilter, sortFilter, countryFilter } = useAnimeFastFilters();

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
                searchString,
                activeGenreFilters,
                activeTagFilters,
                typeFilter,
                sortFilter,
                countryFilter,
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
        [searchString, activeGenreFilters, activeTagFilters, typeFilter, sortFilter, countryFilter]
    );

    const searchFetcher = (params: {
        searchString: string;
        activeGenreFilters: GenreFilterItem[];
        activeTagFilters: TagFilterItem[];
        typeFilter: TypeFilter;
        sortFilter: SortFilter;
        countryFilter: CountryFilter;
        page: number;
    }) => {
        const { page, activeGenreFilters, activeTagFilters, searchString, typeFilter, sortFilter, countryFilter } =
            params;

        return fetchSearchPage(
            page,
            searchString,
            activeGenreFilters,
            activeTagFilters,
            typeFilter,
            sortFilter,
            countryFilter
        );
    };

    const swrAnimeResponse = useSWRInfinite<Page<SectionMedia[]>>(getSearchKey, searchFetcher);

    return (
        <SearchContext.Provider
            value={{
                swrAnimeResponse,
            }}>
            {children}
        </SearchContext.Provider>
    );
}

export function useAnimeSearch() {
    return useContext(SearchContext).swrAnimeResponse;
}
