export enum AnimeMediaStatus {
    FINISHED,
    RELEASING,
    NOT_YET_RELEASED,
    CANCELLED,
    HIATUS
}

export type AnimeMedia = {
    id: number,
    title?: {
        romaji?: string,
        english?: string,
        native?: string,
    },
    status?: AnimeMediaStatus,
    description?: string,
    startDate?: {
        year?: number,
        month?: number,
        day?: number,
    },
    endDate?: {
        year?: number,
        month?: number,
        day?: number,
    },
    hashtag?: string,
    updatedAt?: number,
    trailer?: {
        id?: string,
        site?: string,
        thumbnail?: string,
    }
    genres?: string[],
    averageScore?: number,
    siteUrl?: string,
    coverImage?: {
        extraLarge?: string,
        large?: string,
        medium?: string,
    },
    bannerImage?: string
}

export type AnimeMediaResponse = {
    Media: AnimeMedia
}

export type UserFavouriteResponse = {
    User: {
        favourites: {
            anime: {
                nodes: AnimeMedia[]
            }
        }
    }
}

export type SectionProps = {
    fetchData: () => Promise<AnimeMedia[]>,
    title: string
}