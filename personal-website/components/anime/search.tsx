import React, { useCallback, useContext, useEffect } from "react";
import useSWRInfinite, { SWRInfiniteResponse } from "swr/infinite";
import { useAnimeFastFilters } from "./fast-filters";
import { SectionMedia } from "./graphql";
import { Page, fetchSearchPage } from "./query";
import { GenreFilterItem, TagFilterItem, useAnimeSlowFilters } from "./slow-filters";

export type FilterType = "genre" | "tag" | "type";

export interface FilterItem {
    name: string;
    active: boolean;
    type: FilterType;
}

export interface AnimeTypeFilterItem extends FilterItem {
    name: "ANIME" | "MANGA";
    active: boolean;
}

interface SearchContextValue {
    swrAnimeResponse: SWRInfiniteResponse<Page<SectionMedia[]>>;
}

const SearchContext = React.createContext<SearchContextValue>(null!);

export function AnimeSearchProvider({ searchString, children }: { searchString: string; children: React.ReactNode }) {
    const { genreFilters, tagFilters } = useAnimeSlowFilters();
    const { typeFilter } = useAnimeFastFilters();

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
        [searchString, activeGenreFilters, activeTagFilters, typeFilter]
    );

    const searchFetcher = (params: {
        searchString: string;
        activeGenreFilters: GenreFilterItem[];
        activeTagFilters: TagFilterItem[];
        typeFilter: AnimeTypeFilterItem;
        page: number;
    }) => {
        const { page, activeGenreFilters, activeTagFilters, searchString, typeFilter } = params;

        return fetchSearchPage(page, searchString, activeGenreFilters, activeTagFilters, typeFilter);
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
