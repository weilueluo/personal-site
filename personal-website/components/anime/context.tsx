"use client";

import React, { useContext } from "react";
import { MediaTag } from "./graphql/graphql";
import { FilterItem } from "./search";

///////////////////////////////////////////////////////////////////////////////////////////////

export interface MyAnimeCollectionContext {
    favourites: Set<number>;
}

export const MyAnimeCollectionContext = React.createContext<MyAnimeCollectionContext>({
    favourites: new Set<number>(),
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

export function useMyAnimeCollection() {
    return useContext(MyAnimeCollectionContext);
}

///////////////////////////////////////////////////////////////////////////////////////////////

export interface TagsAndGenresContext {
    genres: string[];
    tags: MediaTag[];
}

export const TagsAndGenresContext = React.createContext<TagsAndGenresContext>({
    genres: [],
    tags: [],
});

export function TagsAndGenresContextProvider({
    children,
    value,
}: {
    children: React.ReactNode;
    value: TagsAndGenresContext;
}) {
    return <TagsAndGenresContext.Provider value={value}>{children}</TagsAndGenresContext.Provider>;
}

export function useTagsAndGenres() {
    return useContext(TagsAndGenresContext);
}

///////////////////////////////////////////////////////////////////////////////////////////////

export interface ClearAllFilter extends FilterItem {}
export interface AdultFilter extends FilterItem {}
export interface GenreFilterItem extends FilterItem {}
export interface TagFilterItem extends Omit<FilterItem, "isAdult">, MediaTag {}

interface AnimeSlowFilterContext {
    genreFilters: GenreFilterItem[];
    tagFilters: TagFilterItem[];
    genreFilterOnClick: (clickedItem: GenreFilterItem) => void;
    tagFilterOnClick: (clickedItem: TagFilterItem) => void;
    adultFilter: AdultFilter;
    adultFilterOnClick: (clickedItem: AdultFilter) => void;
    clearAllFilter: ClearAllFilter;
    setClearAllFilter: (active: boolean) => void;
    activeSlowFilters: FilterItem[];
    activeSlowFilterOnClick: (clickedItem: FilterItem) => void;
}

const AnimeSlowFilterContext = React.createContext<AnimeSlowFilterContext>(null!);

export function AnimeSlowFilterContextProvider({
    children,
    value,
}: {
    children: React.ReactNode;
    value: AnimeSlowFilterContext;
}) {
    return <AnimeSlowFilterContext.Provider value={value}>{children}</AnimeSlowFilterContext.Provider>;
}

export function useAnimeSlowFilters(): AnimeSlowFilterContext {
    return React.useContext(AnimeSlowFilterContext);
}
