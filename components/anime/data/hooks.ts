import { useCallback, useEffect, useRef, useState } from "react";
import { PageInfo } from "..";
import { EMPTY_ARRAY } from "../../common/constants";
import { AnilistPagedData, Character, SectionMedia, Staff } from "./query";
import { fetchAnilistMediaCharacters, fetchAnilistMediaStaffs, fetchFavouritesPage, fetchMediaList, INIT_PAGE_INFO } from "./request";

export type SegmentedDataFetching<T> = [
    loadedData: T[],
    loading: boolean,
    pageInfo: PageInfo,
    fetchNext: () => Promise<T[]>
]


export function useFavouritesFetching(existingData: SectionMedia[] = EMPTY_ARRAY, startPage: number = 1) {
    return useSegmentedDataFetching(fetchFavouritesPage, existingData, startPage);
}

export function useMediaListCurrentFetching(existingData: SectionMedia[] = EMPTY_ARRAY, startPage: number = 1) {
    return useSegmentedDataFetching((page: number) => fetchMediaList(page, "CURRENT"), existingData, startPage);
}

export function useMediaListPlannedFetching(existingData: SectionMedia[] = EMPTY_ARRAY, startPage: number = 1) {
    return useSegmentedDataFetching((page: number) => fetchMediaList(page, "PLANNING"), existingData, startPage);
}


export function useMediaCharactersFetching(animeID: number, existingData: Character[], startPage: number = 1) {
    const fetchFunction = useCallback((page: number) => fetchAnilistMediaCharacters(animeID, page), [animeID]);
    return useSegmentedDataFetching(fetchFunction, existingData, startPage)
}


export function useMediaStaffsFetching(animeID: number, existingData: Staff[], startPage: number = 1) {
    const fetchFunction = useCallback((page: number) => fetchAnilistMediaStaffs(animeID, page), [animeID]);
    return useSegmentedDataFetching(fetchFunction, existingData, startPage);
}

export function useSegmentedDataFetching<T extends {id: number}>(
    fetchFunction: (page: number) => Promise<AnilistPagedData<T>>,
    existingData: T[] = EMPTY_ARRAY,
    startPage: number
): SegmentedDataFetching<T> {

    const [pageInfo, setPageInfo] = useState<PageInfo>(INIT_PAGE_INFO);
    const [loadedData, setLoadedData] = useState(existingData || EMPTY_ARRAY);
    const [loading, setLoading] = useState(false);
    const seen = useRef(new Set<number>());

    // in case existing data changes, add them as well
    useEffect(() => {
        const newData = [];
        existingData.forEach((data: T) => {
            if (!seen.current.has(data.id)) {
                seen.current.add(data.id);
                newData.push(data)
            }
        });
        setLoadedData([...loadedData, ...newData]);
    }, [existingData]) // eslint-disable-line

    const fetchNext = useCallback(async () => {
        
        if (loading || !pageInfo.hasNextPage) {
            return Promise.resolve([]);
        }
        setLoading(true);

        const response = await fetchFunction((pageInfo && pageInfo.currentPage + 1) || startPage);

        setPageInfo(response?.pageInfo || pageInfo);
        const newData = [];
        (response?.data || EMPTY_ARRAY).forEach((data: T) => {
            if (!seen.current.has(data.id)) {
                seen.current.add(data.id);
                newData.push(data);
            }
        });
        setLoadedData([...loadedData, ...newData]);
        setLoading(false);

    }, [fetchFunction, loadedData, loading, pageInfo, startPage])

    return [loadedData, loading, pageInfo, fetchNext]

}

