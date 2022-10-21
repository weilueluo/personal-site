import { AnimeJsonType } from "."

// https://anilist.github.io/ApiV2-GraphQL-Docs/
function getGraphQLQuery(query) {
    return `query {${query}}`
}

function getAnilistMediaQuery(alias: string, id: number) {
    // their api has limit on return size
    // try not to query too much items
    return `${alias}: Media (id: ${id}) {
        id
        title {
            romaji
            english
            native
        }
        startDate {
            year
            month
            day
        }
        siteUrl
        coverImage {
            extraLarge
            large
            medium
        }
    }
`
}


// const animeGraphQLQuery = `
// query ($id: Int) {
//     Media (id: $id) {
//       id
//       title {
//         romaji
//         english
//         native
//       }
//       status
//       description
//       startDate {
//         year
//         month
//         day
//       }
//       endDate {
//         year
//         month
//         day
//       }
//       hashtag
//       updatedAt
//       trailer {
//         id
//         site
//         thumbnail
//       }
//       genres
//       averageScore
//       siteUrl
//       coverImage {
//         extraLarge
//         large
//         medium
//       }
//       bannerImage
//     }
// }
// `


// https://anilist.co/home
// their api has limit on return size
// try not to query too many items
export const ANIME_ID_MAP = {
    'SPYxFAMILY': 140960,
    'SPYxFAMILY_s2': 142838,
    'JUJUTSU_KAISEN': 113415,
    'One_Punch_Man': 21087,
    'The_Promised_Neverland': 101759,
    'Rascal_Does_Not_Dream_of_Bunny_Girl_Senpai': 101291,
    'Dr_STONE': 105333,
    'ODD_TAXI': 128547,
    'Classroom_of_the_Elite': 98659,
    'Jobless_Reincarnation': 108465,
    'Jobless_Reincarnation_s2': 127720,
    'tower_of_god': 115230,
    'beyond_the_boundary': 18153,
    'angels_of_death': 99629,
    'Kaguya_sama': 101921,
    'Kaguya_sama_s2': 112641,
    'Kaguya_sama_s3': 125367,
    'Grand_Blue_Dreaming': 100922
}

export const defaultQueryResult: AnimeJsonType = {
    id: -1
}

const graphqlEndpoint = 'https://graphql.anilist.co'

export function getAllAnilistAnimeData() {
    let anilistQuery = ''
    for (const [alias, id] of Object.entries(ANIME_ID_MAP)) {
        anilistQuery += getAnilistMediaQuery(alias, id);
    }
    const graphQLQuery = getGraphQLQuery(anilistQuery);
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: graphQLQuery
        })
    }

    // console.log(graphQLQuery);

    return fetch(graphqlEndpoint, options)
            .then(res => res.json().then(json => json.data as Map<string, AnimeJsonType>)
            .then(animeData => {
                console.log('loaded anime data');
                console.log(animeData);
                return animeData;
            }));
}

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