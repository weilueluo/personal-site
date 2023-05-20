"use client";

import React from "react";

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
