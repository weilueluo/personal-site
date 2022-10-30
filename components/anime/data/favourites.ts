import { DataManagement } from ".";
import { AnimeMedia, FavAnimeMedia, UserFavouriteResponse } from "..";
import { favFields, favouriteAnime, fetchAnilistData, MY_USER_ID, query, useDataManagement, user } from "./common";

export async function fetchFavouriteAnimeData(page: number = 1): Promise<UserFavouriteResponse> {
    console.log(`fetching favourite anime data, page=${page}`);

    const graphqlQuery = query(user(favouriteAnime(favFields, 1, page), MY_USER_ID));
    const data = await (fetchAnilistData(graphqlQuery) as Promise<UserFavouriteResponse>);
    return data;
}

const empty = []

export function useFavDataManagement(): DataManagement<FavAnimeMedia> {

    const fetchFunction = async (page: number) => {
        const response = await fetchFavouriteAnimeData(page);

        return {
            data: response?.User?.favourites?.anime?.nodes,
            pageInfo: response?.User?.favourites?.anime?.pageInfo
        }
    }

    return useDataManagement<AnimeMedia>(fetchFunction, empty, 1);
}