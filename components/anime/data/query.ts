import { useCurrent3DHover } from "../../common/threejs";

export const MY_USER_ID = 6044692;

export const query = (s: string) => `query{${s}}`;

/////////////////////////////////////////////////
export const pageInfo = 
`pageInfo{
    total
    perPage
    currentPage
    lastPage
    hasNextPage
}`
export type PageInfo = {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
    hasNextPage: boolean
}

/////////////////////////////////////////////////
export const page = (s: string, page_: number = 1, perPage: number = 25) => 
`Page(page:${page_}, perPage:${perPage}){
    ${pageInfo}
    ${s}
}`;

/////////////////////////////////////////////////
export const title = 
`title{
    romaji
    english
    native
}`
export type Title = {
    romaji?: string,
    english?: string,
    native?: string,
}

/////////////////////////////////////////////////
export const dateFields = 
`year
month
day`
export type Date = {
    year?: number,
    month?: number,
    day?: number
}

/////////////////////////////////////////////////
export const coverImage = 
`coverImage{
    medium
    large
}`
export type CoverImage = {
    medium?: string,
    large?: string
}
export type Image = CoverImage;

/////////////////////////////////////////////////
export const sectionMediaFields = 
`id
${title}
siteUrl
startDate{
    ${dateFields}
}
${coverImage}`
export type SectionMedia = {
    id: number,
    title?: Title,
    siteUrl?: string,
    startDate?: Date,
    coverImage?: CoverImage
}

/////////////////////////////////////////////////
export const relations = 
`relations{
    edges{
        id
        relationType
        node{
            id
            siteUrl
            ${title}
            ${coverImage}
        }
    }
    ${pageInfo}
}`
export type Relation = {
    id: number,
    relationType: string,
    node: {
        id: number,
        title?: Title,
        coverImage?: CoverImage,
        siteUrl?: string
    }
}
export type Relations = {
    edges?: Relation[],
    pageInfo: PageInfo
}

/////////////////////////////////////////////////
export const name = 
`name{
    full
    native
    alternative
}`
export type Name = {
    full?: string,
    native?: string,
    alternative?: string[]
}

const yearMonthday = 
`year
month
day`

const mediumLargeFields = 
`medium
large`

/////////////////////////////////////////////////
export const characterFields = 
`id
role
node{
    id
    ${name}
    image{
        medium
        large
    }
    description
    gender
    dateOfBirth{
        ${yearMonthday}
    }
    bloodType
    siteUrl
}
voiceActors (language: JAPANESE, sort: ROLE){
    id
    ${name}
    description
    image{
        ${mediumLargeFields}
    }
    gender
    age
}`
export type VoiceActor = {
    id: number,
    name?: Name,
    description?: string,
    image?: Image,
    gender?: string,
    age?: number
}
export type Character = {
    id: number,
    role?: string,
    node?: {
        id: number,
        name?: Name,
        gender?: string,
        description?: string,
        bloodType?: string,
        siteUrl?: string,
        dateOfBirth?: Date,
        image?: Image
    }
    voiceActors?: VoiceActor[]
}

/////////////////////////////////////////////////
export const characters = (page: number) =>
`characters(page: ${page}){
    edges{
        ${characterFields}
    }
    ${pageInfo}
}`
export type Characters = {
    edges: Character[],
    pageInfo: PageInfo
}

/////////////////////////////////////////////////
export const staffFields = 
`id
role
node{
    id
    ${name}
    image{
        ${mediumLargeFields}
    }
    description
    gender
    age
    siteUrl
}`
export type Staff = {
    id: number,
    role?: string,
    node?: {
        id: number,
        name: Name,
        image: Image,
        description?: string,
        gender?: string,
        age?: number
        siteUrl?: string
    }
}

/////////////////////////////////////////////////
export const staffs = (page: number) =>
`staff(page: ${page}){
    edges{
        ${staffFields}
    }
    ${pageInfo}
}`
export type Staffs = {
    edges: Staff[],
    pageInfo?: PageInfo
}

/////////////////////////////////////////////////
export const mediaFields = 
`${sectionMediaFields}
trailer{
    id
    site
    thumbnail
}
description
status
season
seasonYear
episodes
synonyms
meanScore
bannerImage
genres
hashtag
tags{
    name
    description
}
nextAiringEpisode{
    id
    airingAt
    timeUntilAiring
    episode
}
${relations}
${characters(1)}
${staffs(1)}`

export enum AnimeStatus {
    FINISHED,
    RELEASING,
    NOT_YET_RELEASED,
    CANCELLED,
    HIATUS
}

export enum AnimeSeason {
    WINTER,
    SPRING,
    SUMMER,
    FALL
}

export type Media = {
    trailer?: {
        id?: string,
        site?: string,
        thumbnail: string
    }
    description?: string,
    status?: AnimeStatus,
    season?: AnimeSeason,
    seasonYear?: number,
    episodes?: number,
    synonyms?: string[],
    meanScore?: number,
    bannerImage?: string,
    genres?: string[],
    hashtag?: string,
    tags?: {
        name: string
        description?: string
    }[],
    nextAiringEpisode?: {
        id: number,
        airingAt: number,
        timeUntilAiring: number,
        episode: number
    },
    characters?: Characters,
    staff?: Staffs,
    relations?: Relations
} & SectionMedia;

/////////////////////////////////////////////////
export type MEDIALIST_STATUS  =
    "CURRENT" |
    "PLANNING" |
    "COMPLETED" |
    "DROPPED" |
    "PAUSED" |
    "REPEATING";

export const mediaList = (userID: number, status: MEDIALIST_STATUS = undefined) =>
`mediaList(userId:${userID}, type:ANIME${status ? `,status_in:[${status}]` : ''}){
    id
    status
    media{
        ${sectionMediaFields}
    }
}`
export type MediaListItem = {
    id: number,
    status?: MEDIALIST_STATUS,
    media?: SectionMedia
}

/////////////////////////////////////////////////
export const usersFavouritesAnimeNodes = (id: number, page: number) =>
`users(id:${id}){
    favourites(page:1){
        anime(page:${page}){
            nodes{
                ${sectionMediaFields}
            }
            ${pageInfo}
        }
    }
}`

export const medias = (id: number) =>
`media(id:${id}){
    ${mediaFields}
}`

export const mediasCharacterOnly = (id: number, page: number) =>
`media(id:${id}){
    ${characters(page)}
}`

export const mediasStaffsOnly = (id: number, page: number) =>
`media(id:${id}){
    ${staffs(page)}
}`

export type AnilistPagedData<T> = {
    pageInfo?: PageInfo,
    data?: T[]
}
