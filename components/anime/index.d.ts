export enum AnimeStatus {
    FINISHED,
    RELEASING,
    NOT_YET_RELEASED,
    CANCELLED,
    HIATUS
}

export enum AnimeFormat {
    TV,
    TV_SHORT,
    MOVIE,
    SPECIAL,
    OVA,
    ONA,
    MUSIC,
    MANGA,
    NOVEL,
    ONE_SHOT
}

export enum AnimeSeason {
    WINTER,
    SPRING,
    SUMMER,
    FALL
}

export enum AnimeSource {
    ORIGINAL,
    MANGA,
    LIGHT_NOVEL,
    VISUAL_NOVEL,
    VIDEO_GAME,
    OTHER,
    NOVEL,
    DOUJINSHI,
    ANIME,
    WEB_NOVEL,
    LIVE_ACTION,
    GAME,
    COMIC,
    MULTIMEDIA_PROJECT,
    PICTURE_BOOK
}

export type FuzzyDate = {
    year?: number,
    month?: number,
    day?: number
}


export type FavAnimeMedia = {
    id: number,
    title?: {
        romaji?: string,
        english?: string,
        native?: string,
    },
    siteUrl?: string,
    startDate?: FuzzyDate,
    coverImage?: {
        extraLarge?: string,
        large?: string,
        medium?: string,
    }
}

export type AnimeRelationMedia = {
    id: number,
    title?: {
        english: string,
        native: string,
        romaji: string
    }
    coverImage?: {
        medium?: string,
        large?: string,
        extraLarge?: string
    },
    siteUrl?: string
}

export type AnimeRelation = {
    id: number,
    node: AnimeRelationMedia,
    relationType
}

export type VoiceActor = {
    id: number,
    description?: string,
    languageV2?: string,
    gender: string,
    age: number,
    name?: {
        full?: string,
        native?: string,
        alternative?: string[]
    },
    image?: {
        medium?: string,
        large?: string
    }
}

export type AnimeCharacter = {
    id,
    role?: string,
    node?: {
        id: number,
        gender?: string,
        description?: string,
        bloodType?: string,
        siteUrl?: string,
        dateOfBirth?: {
            year?: number,
            month?: number,
            day?: number
        }
        name?: {
            full: string,
            native: string,
            alternative: string[],
            alternativeSpoiler: string[]
        },
        image?: {
            medium: string,
            large: string
        }
    }
    voiceActors?: VoiceActor[]
}

export type AnimeMedia = FavAnimeMedia & {
    endDate?: FuzzyDate,
    trailer?: {
        id?: string,
        site?: string,
        thumbnail: string
    }
    description?: string,
    status?: AnimeStatus,
    format?: AnimeFormat,
    season?: AnimeSeason,
    seasonYear?: number,
    episodes?: number,
    duration?: number,
    chapters?: number,
    countryOfOrigin?: string,
    source?: AnimeSource,
    updatedAt?: number,
    bannerImage?: string,
    genres?: string[],
    synonyms?: string[],
    meanScore?: number,
    hashtag?: string,
    isAdult?: boolean,
    tags?: {
        name: string
        description?: string
        category?: string
        rank?: number
        isGeneralSpoiler?: boolean,
        isMediaSpoiler?: boolean,
    }[],
    relations?: {
        edges: AnimeRelation[],
    },
    characters?: {
        edges: AnimeCharacter[]
    }
}

export type AnimeMediaResponse = {
    Media: AnimeMedia
}

export type UserFavouriteResponse = {
    User: {
        favourites: {
            anime: {
                nodes: FavAnimeMedia[]
                pageInfo: {
                    total: number
                    perPage: number
                    currentPage: number
                    lastPage: number
                    hasNextPage: boolean
                }
            }
        }
    }
}