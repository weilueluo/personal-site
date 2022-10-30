import { useEffect, useMemo, useState } from "react";
import { DataManagement } from ".";
import { PageInfo } from "..";

export const ANILIST_GRAPHQL_ENDPOINT = 'https://graphql.anilist.co'

export const MY_USER_ID = 6044692;

export const INIT_PAGE_INFO = {
    total: undefined,
    perPage: undefined,
    currentPage: 0,
    lastPage: undefined,
    hasNextPage: true
}

export function fetchAnilistData(query: string): object {
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

    return fetch(ANILIST_GRAPHQL_ENDPOINT, options)
        .then(res => res.json().then(json => json.data)
            .then(animeData => {
                console.log('fetched anilist data');
                console.log(animeData);
                return animeData;
            }));
}

export async function fetchImageAsLocalUrl(url: string) {
    return fetch(url)
        .then(res => res.blob())
        .then(imageBlob => URL.createObjectURL(imageBlob))
}

// NOTE: all three pageInfo, loadedData, loading should not trigger loadMore
// otherwise will leads to infinite loop
export function useDataManagement<T extends {id: number}>(
    fetchFunction: (page: number) => Promise<{data: T[], pageInfo: PageInfo}>,
    existingData: T[],
    nextPage: number = 1,
): DataManagement<T> {
    const initPageInfo = JSON.parse(JSON.stringify(INIT_PAGE_INFO));
    initPageInfo.currentPage = nextPage - 1;
    const [pageInfo, setPageInfo] = useState(initPageInfo);

    const [loadedData, setLoadedData] = useState(existingData);
    const [loading, setLoading] = useState(false);
    const seen = useMemo(() => new Set<number>(), [])

    // next line ensure existing data is always used
    useEffect(() => {
        const newData = [];
        existingData.forEach((d: T) => {
            if (!seen.has(d.id)) {
                seen.add(d.id);
                newData.push(d)
            }
        });
        setLoadedData([...loadedData, ...newData]);
    }, [existingData]) // eslint-disable-line


    const loadMore = async () => {
        
        if (loading || !pageInfo.hasNextPage) {
            return Promise.resolve([]);
        }
        setLoading(true);

        const response = await fetchFunction(pageInfo.currentPage + 1);

        setPageInfo(response?.pageInfo || INIT_PAGE_INFO);
        const newData = [];
        (response?.data || []).forEach((d: T) => {
            if (!seen.has(d.id)) {
                seen.add(d.id);
                newData.push(d)
            }
        });
        setLoadedData([...loadedData, ...newData]);
        setLoading(false)
    }

    return [loadedData, loading, pageInfo, loadMore, []]
}

// https://anilist.github.io/ApiV2-GraphQL-Docs/
export const query = (query: string) => {
    return `query {
        ${query}
    }`
}

export const user = (query: string, userID: number) => 
`User (id: ${userID}){
    ${query}
}`

export const pageInfoFields =
`total
perPage
currentPage
lastPage
hasNextPage`

export const favouriteAnime = (query: string, FavPage: number = 1, animePage: number = 1)  =>
`favourites(page: ${FavPage}){
    anime(page: ${animePage}){
        nodes{
            ${query}
        }
        pageInfo{
            ${pageInfoFields}
        }
    }
}`

export const media = (query: string, id: number | string) => 
`Media(id: ${id}){
    ${query}
}`

export const staffFields =
`id
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
}`

export const staffs = (query: string, page: number) =>
`staff (sort: RELEVANCE, page: ${page}){
    edges{
        ${query}
    }
    pageInfo{
        ${pageInfoFields}
    }
}`

export const characterFields = 
`id
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
}`

export const characters = (query: string, page: number)  => 
`characters (sort: ROLE, page: ${page}){
    edges{
        ${query}
    }
    pageInfo{
        ${pageInfoFields}
    }
}`

export const favFields = `id
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

export const relationFields = 
`id
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
}`

export const mediaFields = favFields + `
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
        ${relationFields}
    }
    pageInfo{
        ${pageInfoFields}
    }
}
nextAiringEpisode{
    id
    airingAt
    timeUntilAiring
    episode
}
characters{
    edges{
        ${characterFields}
    }
    pageInfo{
        ${pageInfoFields}
    }
}
staff{
    edges{
        ${staffFields}
    }
    pageInfo{
        ${pageInfoFields}
    }
}`


