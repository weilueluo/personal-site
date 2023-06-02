// server side component for fetching my favourites and filter tags and genres

import React from "react";
import { MyAnimeCollectionContextProvider, TagsAndGenresContextProvider } from "../../shared/contexts/anime";
import { MediaTag } from "./graphql/graphql";
import { fetchFilters, fetchMyAnimeCollection } from "./graphql/query";

export async function MyAnimeCollectionProvider({ children }: { children: React.ReactNode }) {
    const favSet = new Set<number>();
    await fetchMyAnimeCollection(1).then(data => {
        data?.data?.forEach(data => {
            data.entries.forEach(data => favSet.add(data.media.id));
        });
    });

    return (
        <MyAnimeCollectionContextProvider
            value={{
                favourites: favSet,
            }}>
            {children}
        </MyAnimeCollectionContextProvider>
    );
}

export async function TagsAndGenresProvider({ children }: { children: React.ReactNode }) {
    const genres: string[] = [];
    const tags: MediaTag[] = [];
    await fetchFilters().then(data => {
        data.GenreCollection.forEach(genre => genres.push(genre));
        data.MediaTagCollection.forEach(tag => tags.push(tag));
    });

    return (
        <TagsAndGenresContextProvider
            value={{
                genres,
                tags,
            }}>
            {children}
        </TagsAndGenresContextProvider>
    );
}
