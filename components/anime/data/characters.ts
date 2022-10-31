import { useCallback, useContext, useEffect } from "react";
import { DataManagement } from ".";
import { AnimeCharacter } from "..";
import { AnimeDataContext, LOADING_ID } from "../../animeDetails/AnimeDetails";
import { EMPTY_ARRAY } from "../../common/constants";
import { INIT_PAGE_INFO, useDataManagement } from "./common";
import { fetchAnimeCharactersMedia } from "./media";


export function useCharactersDataManagement(animeID: number): DataManagement<AnimeCharacter> {
    
    const fetchFunction = useCallback(async (page: number) => {
        if (animeID == LOADING_ID) {
            return {
                data: EMPTY_ARRAY,
                pageInfo: INIT_PAGE_INFO
            }
        }
        const data = await fetchAnimeCharactersMedia(animeID, page);
        return {
            data: data?.edges,
            pageInfo: data?.pageInfo
        }
    }, [animeID]);

    
    const existingData = useContext(AnimeDataContext)?.characters?.edges || EMPTY_ARRAY
    const nextPage = (existingData && existingData.length > 0) ? 2 : 1;
    
    return useDataManagement<AnimeCharacter>(fetchFunction, existingData, nextPage)

}