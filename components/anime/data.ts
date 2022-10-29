import { useState } from "react";
import { AnimeMediaResponse, FavAnimeMedia, PageInfo, UserFavouriteResponse as UserFavourite, UserFavouriteResponse } from ".";

// https://anilist.github.io/ApiV2-GraphQL-Docs/
function query(query: string) {
    return `query {
        ${query}
    }`
}

const MY_USER_ID = 6044692;

function user(query: string, userID: number) {
    return `User (id: ${userID}){
        ${query}
    }`
}

function favouriteAnime(query: string, FavPage: number = 1, animePage: number = 1) {
    return `favourites(page: ${FavPage}){
        anime(page: ${animePage}){
            nodes{
                ${query}
            }
            pageInfo{
                total
                perPage
                currentPage
                lastPage
                hasNextPage
            }
        }
    }`
}

function media(query: string, id: number | string) {
    return `Media(id: ${id}){
        ${query}
    }`;
}

const favFields = `id
title {
  romaji
  english
  native
  userPreferred
}
startDate {
  year
  month
  day
}
coverImage {
  extraLarge
  large
  medium
  color
}
siteUrl`

const mediaFields = favFields + `
trailer {
    id
    site
    thumbnail
}
description
status
format
season
seasonYear
episodes
duration
chapters
countryOfOrigin
source
updatedAt
synonyms
meanScore
bannerImage
genres
hashtag
isAdult
endDate {
    year
    month
    day
}
tags{
    name
    description
    category
    rank
    isGeneralSpoiler
    isMediaSpoiler
}
relations{
    edges{
        id
        relationType
        node{
            id
            siteUrl
            title{
                romaji
                english
                native
            }
            coverImage{
                medium
                large
                extraLarge
            }
        }
    }
}
characters (sort: ROLE){
    edges{
        id
        role
        node{
            id
            name{
                full
                native
                alternative
                alternativeSpoiler
            }
            image{
                medium
                large
            }
            description
            gender
            dateOfBirth{
                year
                month
                day
            }
            bloodType
            siteUrl
        }
        voiceActors (language: JAPANESE, sort: ROLE){
            id
            name{
                full
                native
                alternative
            }
            description
            image{
                medium
                large
            }
            languageV2
            gender
            age
        }
    }
    pageInfo{
        total
        perPage
        currentPage
        lastPage
        hasNextPage
    }
}
nextAiringEpisode{
    id
    airingAt
    timeUntilAiring
    episode
}
staff (sort: RELEVANCE){
    edges{
        id
        role
        node{
            id
            name{
                full
                native
                alternative
            }
            image{
                medium
                large
            }
            description
            gender
            age
            siteUrl
        }
    }
    pageInfo{
        total
        perPage
        currentPage
        lastPage
        hasNextPage
    }
}`

const graphqlEndpoint = 'https://graphql.anilist.co'

function fetchAnilistData(query: string): object {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: query
        })
    }

    return fetch(graphqlEndpoint, options)
        .then(res => res.json().then(json => json.data)
            .then(animeData => {
                console.log('loaded anime data');
                console.log(animeData);
                return animeData;
            }));
}

async function fetchFavouriteAnimeData(page: number = 1): Promise<UserFavouriteResponse> {
    console.log(`fetching favourite anime data, page=${page}`);
    
    const graphqlQuery = query(user(favouriteAnime(favFields, 1, page), MY_USER_ID));
    const data = await (fetchAnilistData(graphqlQuery) as Promise<UserFavouriteResponse>);
    return data;
}

export async function fetchAnimeMedia(animeID: number | string) {
    // console.log('fetch media');
    // console.log(mediaFields);

    const graphqlQuery = query(media(mediaFields, animeID));
    const data = await (fetchAnilistData(graphqlQuery) as Promise<AnimeMediaResponse>);
    return data.Media;
}

async function slowlyFetchAllFavAnimeData() {
    const favAnimeData = []
    let pageInfo = INIT_PAGE_INFO
    while (pageInfo.hasNextPage) {
        const response = await fetchFavouriteAnimeData(pageInfo.currentPage + 1);
        pageInfo = response?.User?.favourites?.anime?.pageInfo || BAD_PAGE_INFO
        const newData = response?.User?.favourites?.anime?.nodes || []
        favAnimeData.push(...newData);

        // wait before proceeding to fetch next page to avoid server blocking us
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    return favAnimeData
}

export async function slowlyFetchAllAnimeData() {
    return slowlyFetchAllFavAnimeData()
}

export async function fetchImageAsLocalUrl(url: string) {
    return fetch(url)
        .then(res => res.blob())
        .then(imageBlob => URL.createObjectURL(imageBlob))
}

export type DataManagement<T>  = [
    loadedData: T[],
    loading: boolean,
    pageInfo: PageInfo,
    tryLoadMore: () => Promise<T[]>
]

const INIT_PAGE_INFO = {
    total: undefined,
    perPage: undefined,
    currentPage: 0,
    lastPage: undefined,
    hasNextPage: true
}

const BAD_PAGE_INFO = {
    total: undefined,
    perPage: undefined,
    currentPage: undefined,
    lastPage: undefined,
    hasNextPage: false
}

// export function useMediaDataManagement(): DataManagement<AnimeMedia> {

// }

export function useFavDataManagement(): DataManagement<FavAnimeMedia> {
    const [pageInfo, setPageInfo] = useState(INIT_PAGE_INFO);
    const [loadedData, setLoadedData] = useState([]);
    const [loading, setLoading] = useState(false);
    const seen = new Set<number>();
    const fetchMore = async () => {
        if (loading || !pageInfo.hasNextPage) {
            return Promise.resolve([]);
        }
        setLoading(true);
        const data = await fetchFavouriteAnimeData(pageInfo.currentPage + 1);
        setPageInfo(data?.User?.favourites?.anime?.pageInfo || BAD_PAGE_INFO);
        const dataNodes = data?.User?.favourites?.anime?.nodes || [];
        const newData = [];
        dataNodes.forEach(d => {
            if (!seen.has(d.id)) {
                seen.add(d.id);
                newData.push(d);
            }
        });
        setLoadedData([...loadedData, ...newData]);
        setLoading(false);
        return dataNodes;
    }

    return [loadedData, loading, pageInfo, fetchMore]
}