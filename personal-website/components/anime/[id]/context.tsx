"use client";
import React, { useContext } from "react";
import { MediaItem } from "../graphql/graphql";

type AnimeDetailsContextValue = MediaItem | undefined;

const AnimeDetailsContext = React.createContext<AnimeDetailsContextValue>(undefined!);

export function AnimeDetailsProvider({
    animeDetails,
    children,
}: {
    animeDetails: { read: () => MediaItem | undefined };
    children: React.ReactNode;
}) {
    const data = animeDetails.read();
    return <AnimeDetailsContext.Provider value={data}>{children}</AnimeDetailsContext.Provider>;
}

export function useAnimeDetails() {
    return useContext(AnimeDetailsContext);
}
