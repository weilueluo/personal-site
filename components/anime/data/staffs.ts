import { useContext, useEffect } from "react";
import { DataManagement } from ".";
import { AnimeStaff } from "..";
import { AnimeDataContext } from "../../animeDetails/AnimeDetails";
import { EMPTY_ARRAY } from "../../common/constants";
import { useDataManagement } from "./common";
import { fetchAnimeStaffsMedia } from "./media";

export function useAnimeStaffsDataManagement(animeID: string | number): DataManagement<AnimeStaff> {
    
    const fetchFunction = async (page: number) => {
        const data = await fetchAnimeStaffsMedia(animeID, page);

        return {
            data: data?.edges,
            pageInfo: data?.pageInfo
        }
    }

    const existingData = useContext(AnimeDataContext)?.staff?.edges || EMPTY_ARRAY;
    
    return useDataManagement<AnimeStaff>(fetchFunction, existingData, 2)
    
}