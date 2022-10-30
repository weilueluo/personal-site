import { useContext, useEffect } from "react";
import { DataManagement } from ".";
import { AnimeStaff } from "..";
import { AnimeDataContext } from "../../animeDetails/AnimeDetails";
import { useDataManagement } from "./common";
import { fetchAnimeStaffsMedia } from "./media";

const emptyArray = []

export function useAnimeStaffsDataManagement(animeID: string | number): DataManagement<AnimeStaff> {
    
    const fetchFunction = async (page: number) => {
        const data = await fetchAnimeStaffsMedia(animeID, page);

        return {
            data: data?.edges,
            pageInfo: data?.pageInfo
        }
    }

    const existingData = useContext(AnimeDataContext)?.staff?.edges || emptyArray;
    
    const [loadedData, loading, pageInfo, loadMore, deps] = useDataManagement<AnimeStaff>(fetchFunction, existingData, 2)
    
    return [loadedData, loading, pageInfo, loadMore, [...deps, animeID]];
}