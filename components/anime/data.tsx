import { AnimeMedia, AnimeMediaResponse, UserFavouriteResponse as UserFavourite } from "."

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
        }
    }`
}

function media(query: string, id: number) {
    return `Media(id: ${id}){
        ${query}
    }`;
}

function fields() {
    return `id
    title {
      romaji
      english
      native
      userPreferred
    }
    description
    startDate {
      year
      month
      day
    }
    endDate {
      year
      month
      day
    }
    format
    coverImage {
      extraLarge
      large
      medium
      color
    }
    bannerImage
    genres
    hashtag
    isAdult
    siteUrl
    status`
}

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

export async function fetchFavouriteAnimeData(): Promise<AnimeMedia[]> {
    const graphqlQuery = query(user(favouriteAnime(fields()), MY_USER_ID));
    const data = await (fetchAnilistData(graphqlQuery) as Promise<UserFavourite>);
    return data.User.favourites.anime.nodes;
}

export async function fetchAnimeMedia(animeID: number) {
    const graphqlQuery = query(media(fields(), animeID));
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



// export function getAllAnilistAnimeData() {
//     let anilistQuery = ''
//     for (const [alias, id] of Object.entries(ANIME_ID_MAP)) {
//         anilistQuery += getAnilistMediaQuery(alias, id);
//     }
//     const graphQLQuery = getGraphQLQuery(anilistQuery);
//     const options = {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json',
//         },
//         body: JSON.stringify({
//             query: graphQLQuery
//         })
//     }

//     // console.log(graphQLQuery);

//     return fetch(graphqlEndpoint, options)
//             .then(res => res.json().then(json => json.data as Map<string, AnimeJsonType>)
//             .then(animeData => {
//                 console.log('loaded anime data');
//                 console.log(animeData);
//                 return animeData;
//             }));
// }

// export function getAnilistAnimeData(id: number): Promise<AnimeJsonType> {
//     const variables = {
//         id: id
//     }
//     const options = {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json',
//         },
//         body: JSON.stringify({
//             query: getGraphQLQuery(getAnilistMediaQuery('Media', id)),
//             variables: variables
//         })
//     }

//     return fetch(graphqlEndpoint, options)
//             .then(res => res.json().then(json => json.data.Media as AnimeJsonType)
//             .then(animeData => {
//                 console.log(`loaded anime data: ${id} ${animeData.title ? animeData.title.native : 'N/A'}`);
//                 return animeData
//             }));
// }