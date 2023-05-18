// this files write on top of graphql.ts to provide concrete fetch methods to query anilist api

import { CountryFilter, MyFavoriteFilter, SortFilter, TypeFilter } from "./fast-filters";
import {
    AnilistGraphqlQuery,
    Character,
    Characters,
    Filters,
    MEDIALIST_STATUS,
    Media,
    MediaItem,
    MediaList,
    MediaListCollection,
    MediaListCollectionList,
    MediaListItem,
    PageInfoItem,
    Page as RawPage,
    SectionMedia,
    Staff,
    Staffs,
    UsersFavouritesAnime
} from "./graphql";
import { GenreFilterItem, TagFilterItem } from "./slow-filters";

export const INIT_PAGE_INFO: PageInfoItem = {
    total: undefined,
    perPage: undefined,
    currentPage: 0,
    lastPage: undefined,
    hasNextPage: true,
};

const MY_USER_ID = 6044692;

const ANILIST_GRAPHQL_ENDPOINT = "https://graphql.anilist.co";

const HEADERS = {
    "Content-Type": "application/json",
    Accept: "application/json",
};

async function fetchAnilist<T>(query: string): Promise<T> {
    console.log("Fetching Anilist data");

    const options = {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify({
            query,
        }),
    };

    return fetch(ANILIST_GRAPHQL_ENDPOINT, options)
        .then((res) =>
            res
                .json()
                .then((json) => {
                    json.errors && console.log(json.errors);
                    return json.data;
                })
                .then((data) => {
                    console.log("Received Anilist data");
                    console.log(data);
                    return data;
                })
        )
        .catch((error) => {
            console.log("Error while fetching Anilist data");
            console.log(error);
            return {};
        });
}

export interface Page<T> {
    pageInfo?: PageInfoItem;
    data?: T;
}


export async function fetchMyAnimeCollection(chunk: number): Promise<Page<MediaListCollectionList[]>> {
    const graphqlQuery = AnilistGraphqlQuery.fetchMyAnimeCollection(MY_USER_ID, chunk, "ANIME", 500);

    const response = await fetchAnilist<MediaListCollection>(graphqlQuery);
    console.log("fetchMyAnimeCollectionResponse", response);


    const pageInfo: PageInfoItem = {
        total: undefined,
        perPage: 500,
        currentPage: chunk,
        lastPage: undefined,
        hasNextPage: response.MediaListCollection.hasNextChunk,
    }

    return {
        pageInfo: pageInfo,
        data: response?.MediaListCollection?.lists,
    };
}

export async function fetchFilters(): Promise<Filters> {
    const graphqlQuery = AnilistGraphqlQuery.fetchFilters();

    const response = await fetchAnilist<Filters>(graphqlQuery);

    return response;
}

export async function fetchSearchPage(page: number | string, search: string, genreFilers: GenreFilterItem[], tagFilters: TagFilterItem[], typeFilter: TypeFilter, sortFilter: SortFilter, countryFilter: CountryFilter, myFavouriteFilter: MyFavoriteFilter): Promise<Page<SectionMedia[]>> {
    const graphqlQuery = AnilistGraphqlQuery.fetchSearch(search, page, genreFilers, tagFilters, typeFilter, sortFilter, countryFilter, myFavouriteFilter);

    const response = await fetchAnilist<RawPage<Media<MediaItem>>>(graphqlQuery);

    return {
        pageInfo: response?.Page?.pageInfo,
        data: response?.Page?.media,
    };
}

export async function fetchFavouritesPage(page_: number | string = 1): Promise<Page<SectionMedia[]>> {
    const graphqlQuery = AnilistGraphqlQuery.fetchFavouriteAnimes(MY_USER_ID, page_);

    const response = await fetchAnilist<RawPage<UsersFavouritesAnime>>(graphqlQuery);

    const anime = response?.Page?.users?.[0]?.favourites?.anime;

    return {
        pageInfo: anime?.pageInfo,
        data: anime?.nodes,
    };
}

export async function fetchMediaList(page_ = 1, status: MEDIALIST_STATUS): Promise<Page<(SectionMedia | undefined)[]>> {
    const graphqlQuery = AnilistGraphqlQuery.fetchMediaList(MY_USER_ID, page_, status);

    const response = await fetchAnilist<RawPage<MediaList>>(graphqlQuery);

    const mediaListItems: MediaListItem[] = response?.Page?.mediaList || [];
    const medias = mediaListItems.map((node) => node?.media);

    return {
        pageInfo: response?.Page?.pageInfo,
        data: medias,
    };
}

export async function fetchAnilistMedia(animeID: number): Promise<MediaItem | undefined> {
    const graphqlQuery = AnilistGraphqlQuery.fetchMedia(animeID);

    const response = await fetchAnilist<RawPage<Media<MediaItem>>>(graphqlQuery);

    return response?.Page?.media?.[0];
}

export async function fetchAnilistMediaCharacters(animeID: number, page_: number): Promise<Page<Character[]>> {
    const graphqlQuery = AnilistGraphqlQuery.fetchMediaCharacters(animeID, page_);

    const response = await fetchAnilist<RawPage<Media<Characters>>>(graphqlQuery);
    const characters = response?.Page?.media?.[0]?.characters;

    return {
        pageInfo: characters?.pageInfo,
        data: characters?.edges,
    };
}

export async function fetchAnilistMediaStaffs(animeID: number, page_: number): Promise<Page<Staff[]>> {
    const graphqlQuery = AnilistGraphqlQuery.fetchMediaStaffs(animeID, page_);

    const response = await fetchAnilist<RawPage<Media<Staffs>>>(graphqlQuery);
    const staffs = response?.Page?.media?.[0]?.staff;

    return {
        pageInfo: staffs?.pageInfo,
        data: staffs?.edges,
    };
}
