import { AnimeJsonType } from "."

// https://anilist.github.io/ApiV2-GraphQL-Docs/
const animeGraphQLQuery = `
query ($id: Int) {
    Media (id: $id) {
      id
      title {
        romaji
        english
        native
      }
      status
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
      hashtag
      updatedAt
      trailer {
        id
        site
        thumbnail
      }
      genres
      averageScore
      siteUrl
      coverImage {
        extraLarge
        large
        medium
      }
      bannerImage
    }
}
`

// https://anilist.co/home
export const ANIME_IDS: number[] = [
    140960, // spy x family 
    142838, // spy x family p2 
    113415, // JUJUTSU KAISEN
    21087, // One-Punch Man
    101759, // The Promised Neverland
    101291, // Rascal Does Not Dream of Bunny Girl Senpai
    105333, // Dr. STONE
    128547, // ODDTAXI
    98659, // Classroom-of-the-Elite
    108465, // Mushoku-Tensei-Jobless-Reincarnation
    127720, // Mushoku-Tensei-Jobless-Reincarnation s2
    115230, // tower of god
    18153, // beyond the boundary
    99629, // angels of death
    101921, // Kaguya-sama: Love is War
    112641,  // Kaguya-sama: Love is War?
    125367, // Kaguya-sama: Love is War -Ultra Romantic-
    100922, // Grand Blue Dreaming
]

export const defaultQueryResult: AnimeJsonType = {
    id: -1
}

const graphqlEndpoint = 'https://graphql.anilist.co'

export function getAnilistAnimeData(id: number): Promise<AnimeJsonType> {
    const variables = {
        id: id
    }
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: animeGraphQLQuery,
            variables: variables
        })
    }

    return fetch(graphqlEndpoint, options)
            .then(res => res.json().then(json => json.data.Media as AnimeJsonType)
            .then(animeData => {
                console.log(`loaded anime data: ${id} ${animeData.title ? animeData.title.native : 'N/A'}`);
                return animeData
            }));
}