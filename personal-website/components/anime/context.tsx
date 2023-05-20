"use client";

import React from "react";
import { MediaTag } from "./graphql";

export interface MyAnimeCollectionContext {
    favourites: Set<number>;
}
export interface TagsAndGenresContext {
    genres: string[];
    tags: MediaTag[];
}

export const MyAnimeCollectionContext = React.createContext<MyAnimeCollectionContext>({
    favourites: new Set<number>(),
});
export const TagsAndGenresContext = React.createContext<TagsAndGenresContext>({
    genres: [],
    tags: [],
});

export function MyAnimeCollectionContextProvider({
    children,
    value,
}: {
    children: React.ReactNode;
    value: MyAnimeCollectionContext;
}) {
    return <MyAnimeCollectionContext.Provider value={value}>{children}</MyAnimeCollectionContext.Provider>;
}

export function TagsAndGenresContextProvider({
    children,
    value,
}: {
    children: React.ReactNode;
    value: TagsAndGenresContext;
}) {
    return <TagsAndGenresContext.Provider value={value}>{children}</TagsAndGenresContext.Provider>;
}
