"use client";

import React from "react";

export interface MyAnimeCollectionContext {
    favourites: number[];
}

export const MyAnimeCollectionContext = React.createContext<MyAnimeCollectionContext>({
    favourites: [],
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
