import { FavAnimeMedia, AnimeMediaResponse, UserFavouriteResponse as UserFavourite } from "."

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
}`

// #format
//     #season
//     #seasonYear
//     #seasonInt
//     #episodes
//     #duration
//     #chapters
//     #volumes
//     #countryOfOrigin
//     #source
//     #trailer
//     #updatedAt
//     #synonyms
//     #averageScore
//     #meanScore
//     #popularity
//characters


// #type
// # relations {
// #     edges {
// #         id
// #         relationType
// #         characters
// #         characterRole
// #         characterName
// #         staffRole
// #         voiceActors
// #         voiceActorRoles
// #     }
// #     nodes
// #     pageInfo
// # }

// https://anilist.co/home
// their api has limit on return size
// try not to query too many items
// export const ANIME_ID_MAP = {
//     'SPYxFAMILY': 140960,
//     'SPYxFAMILY_s2': 142838,
//     'JUJUTSU_KAISEN': 113415,
//     'One_Punch_Man': 21087,
//     'The_Promised_Neverland': 101759,
//     'Rascal_Does_Not_Dream_of_Bunny_Girl_Senpai': 101291,
//     'Dr_STONE': 105333,
//     'ODD_TAXI': 128547,
//     'Classroom_of_the_Elite': 98659,
//     'Jobless_Reincarnation': 108465,
//     'Jobless_Reincarnation_s2': 127720,
//     'beyond_the_boundary': 18153,
//     'angels_of_death': 99629,
//     'Kaguya_sama': 101921,
//     'Kaguya_sama_s2': 112641,
//     'Kaguya_sama_s3': 125367,
//     'Grand_Blue_Dreaming': 100922
// }

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

export async function fetchFavouriteAnimeData(): Promise<FavAnimeMedia[]> {
    const graphqlQuery = query(user(favouriteAnime(favFields), MY_USER_ID));
    const data = await (fetchAnilistData(graphqlQuery) as Promise<UserFavourite>);
    console.log('loaded favourites');
    console.log(data.User.favourites);
    return data.User.favourites.anime.nodes;
}

export async function fetchAnimeMedia(animeID: number | string) {
    // console.log('fetch media');
    // console.log(mediaFields);
    
    const graphqlQuery = query(media(mediaFields, animeID));
    const data = await (fetchAnilistData(graphqlQuery) as Promise<AnimeMediaResponse>);
    return data.Media;
}

export async function fetchAllAnimeData() {
    return fetchFavouriteAnimeData()
}

export async function fetchImageAsLocalUrl(url: string) {
    return fetch(url)
        .then(res => res.blob())
        .then(imageBlob => URL.createObjectURL(imageBlob))
}