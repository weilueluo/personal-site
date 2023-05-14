import React, { useCallback, useContext, useEffect } from "react";
import useSWR, { SWRResponse } from "swr";
import useSWRInfinite, { SWRInfiniteResponse } from "swr/infinite";
import { getAnilistKey } from "./fetcher";
import { Filters, SectionMedia } from "./graphql";
import { Page, fetchFilters, fetchSearchPage } from "./query";

export type FilterType = "genre" | "tag";

export interface FilterItem {
    name: string;
    active: boolean;
    type: FilterType;
}

interface SearchContextValue {
    swrAnimeResponse: SWRInfiniteResponse<Page<SectionMedia[]>>;
    swrFilterResponse: SWRResponse<Filters>;
    setActiveFilters: (filterItems: FilterItem[]) => void;
}

const SearchContext = React.createContext<SearchContextValue>(null!);

export function AnimeSearchProvider({ searchString, children }: { searchString: string; children: React.ReactNode }) {
    const [activeFilters, setActiveFilters] = React.useState<FilterItem[]>([]);

    const searchFetcher = useCallback(
        async (pageKey: Promise<number>) => {
            const page = await pageKey;
            return fetchSearchPage(page, searchString, activeFilters);
        },
        [activeFilters, searchString]
    );

    const swrAnimeResponse = useSWRInfinite<Page<SectionMedia[]>>(getAnilistKey, searchFetcher);

    useEffect(() => {
        swrAnimeResponse.mutate();
    }, [searchString, activeFilters]);

    const swrGenreResponse = useSWR("anime-genre-collection", fetchFilters);

    return (
        <SearchContext.Provider
            value={{
                swrAnimeResponse,
                swrFilterResponse: swrGenreResponse,
                setActiveFilters,
            }}>
            {children}
        </SearchContext.Provider>
    );
}

export function useAnimeSearch() {
    return useContext(SearchContext).swrAnimeResponse;
}

export function useAnimeFilters() {
    const { swrFilterResponse, setActiveFilters } = useContext(SearchContext);
    return {
        ...swrFilterResponse,
        setActiveFilters,
    };
}
