"use client";
import React, { useContext } from "react";
import useSWR from "swr";
import { MediaItem } from "../graphql";
import { fetchAnilistMedia } from "../query";

type AnimeDetailsContextValue = MediaItem | undefined;

const AnimeDetailsContext = React.createContext<AnimeDetailsContextValue>(undefined!);

export async function AnimeDetailsProvider(props: { animeId: number; children: React.ReactNode }) {
    // console.log("AnimeDetailsProvider", props);

    const { animeId, children } = props;
    const data = await fetchAnilistMedia(animeId);

    return <AnimeDetailsContext.Provider value={data}>{children}</AnimeDetailsContext.Provider>;
}

export function useAnimeDetails() {
    return useContext(AnimeDetailsContext);
}
