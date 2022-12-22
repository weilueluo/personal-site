import { PageInfo } from '..';
import { EMPTY_ARRAY } from '../../common/constants';
import {
    AnilistPagedData,
    Character,
    MEDIALIST_STATUS,
    Media,
    MediaListItem,
    SectionMedia,
    Staff,
    mediaList,
    medias,
    mediasCharacterOnly,
    mediasStaffsOnly,
    page,
    query,
    usersFavouritesAnimeNodes,
} from './query';

export const INIT_PAGE_INFO: PageInfo = {
    total: undefined,
    perPage: undefined,
    currentPage: 0,
    lastPage: undefined,
    hasNextPage: true,
};

const MY_USER_ID = 6044692;

const ANILIST_GRAPHQL_ENDPOINT = 'https://graphql.anilist.co';

const HEADERS = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
};

async function fetchAnilist(query: string): Promise<any> {
    console.log('Fetching Anilist data');

    const options = {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({
            query: query,
        }),
    };

    return fetch(ANILIST_GRAPHQL_ENDPOINT, options)
        .then(res =>
            res
                .json()
                .then(json => {
                    json.errors && console.log(json.errors);
                    return json.data;
                })
                .then(data => {
                    console.log('Received Anilist data');
                    console.log(data);
                    return data;
                }),
        )
        .catch(error => {
            console.log('Error while fetching Anilist data');
            console.log(error);
            return {};
        });
}

export async function fetchFavouritesPage(
    page_ = 1,
): Promise<AnilistPagedData<SectionMedia>> {
    const graphqlQuery = query(
        page(usersFavouritesAnimeNodes(MY_USER_ID, page_)),
    );
    const response = await fetchAnilist(graphqlQuery);

    const anime = response?.Page?.users?.[0]?.favourites?.anime;

    return {
        pageInfo: anime?.pageInfo,
        data: anime?.nodes,
    };
}

export async function fetchMediaList(
    page_ = 1,
    status: MEDIALIST_STATUS = undefined,
): Promise<AnilistPagedData<SectionMedia>> {
    const graphqlQuery = query(page(mediaList(MY_USER_ID, status), page_));

    const response = await fetchAnilist(graphqlQuery);

    const mediaListItems: MediaListItem[] =
        response?.Page?.mediaList || EMPTY_ARRAY;
    const medias = mediaListItems.map(node => node?.media);

    return {
        pageInfo: response?.Page?.pageInfo,
        data: medias,
    };
}

export async function fetchAnilistMedia(animeID: number): Promise<Media> {
    const graphqlQuery = query(page(medias(animeID)));

    const response = await fetchAnilist(graphqlQuery);

    return response?.Page?.media?.[0];
}

export async function fetchAnilistMediaCharacters(
    animeID: number,
    page_: number,
): Promise<AnilistPagedData<Character>> {
    const graphqlQuery = query(page(mediasCharacterOnly(animeID, page_)));

    const response = await fetchAnilist(graphqlQuery);
    const characters = response?.Page?.media?.[0]?.characters;

    return {
        pageInfo: characters?.pageInfo,
        data: characters?.edges,
    };
}

export async function fetchAnilistMediaStaffs(
    animeID: number,
    page_: number,
): Promise<AnilistPagedData<Staff>> {
    const graphqlQuery = query(page(mediasStaffsOnly(animeID, page_)));

    const response = await fetchAnilist(graphqlQuery);
    const staffs = response?.Page?.media?.[0]?.staff;

    return {
        pageInfo: staffs?.pageInfo,
        data: staffs?.edges,
    };
}
