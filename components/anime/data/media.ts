import { AnimeCharactersMedia, AnimeMediaCharactersResponse, AnimeMediaResponse, AnimeMediaStaffsResponse, AnimeStaffsMedia } from "..";
import { query, media, mediaFields, fetchAnilistData, characters, characterFields, staffs, staffFields } from "./common";

export async function fetchAnimeMedia(animeID: number | string) {
    const graphqlQuery = query(media(mediaFields, animeID));
    const data = await (fetchAnilistData(graphqlQuery) as Promise<AnimeMediaResponse>);
    return data?.Media;
}

export async function fetchAnimeCharactersMedia(animeID: number | string, characterPage: number = 1): Promise<AnimeCharactersMedia> {
    console.log(`fetching anime characters media, page=${characterPage}`);
    
    const graphqlQuery = query(media(characters(characterFields, characterPage), animeID));
    // console.log(graphqlQuery);
    
    const data = await (fetchAnilistData(graphqlQuery) as Promise<AnimeMediaCharactersResponse>)
    // console.log('fetched characters');
    // console.log(data);
    
    
    return data?.Media?.characters;
}

export async function fetchAnimeStaffsMedia(animeID: string | number, staffPage: number = 1): Promise<AnimeStaffsMedia> {
    console.log(`fetching anime staff media, page=${staffPage}`);
    const graphqlQuery = query(media(staffs(staffFields, staffPage), animeID));

    const data = await (fetchAnilistData(graphqlQuery) as Promise<AnimeMediaStaffsResponse>);

    return data?.Media?.staff;
}

// fetchAnimeRelationsMedia: not implemented because no page parameter in Media.relations