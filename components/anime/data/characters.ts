import { useContext } from "react";
import { DataManagement } from ".";
import { AnimeCharacter } from "..";
import { AnimeDataContext, LOADING_ID } from "../../animeDetails/AnimeDetails";
import { INIT_PAGE_INFO, useDataManagement } from "./common";
import { fetchAnimeCharactersMedia } from "./media";

const empty = []

export function useCharactersDataManagement(animeID: number): DataManagement<AnimeCharacter> {

    const fetchFunction = async (page: number) => {
        if (animeID == LOADING_ID) {
            return {
                data: [],
                pageInfo: INIT_PAGE_INFO
            }
        }
        const data = await fetchAnimeCharactersMedia(animeID, page);
        return {
            data: data?.edges,
            pageInfo: data?.pageInfo
        }
    };

    const existingData = useContext(AnimeDataContext)?.characters?.edges || empty

    const [loadedData, loading, pageInfo, loadMore, deps] = useDataManagement<AnimeCharacter>(fetchFunction, existingData, 2)

    return [loadedData, loading, pageInfo, loadMore, [...deps, animeID]];
}