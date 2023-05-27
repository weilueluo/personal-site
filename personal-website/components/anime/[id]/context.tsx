"use client";
import Loading from "@/components/ui/loading/spinner";
import { suspensify } from "@/shared/suspense";
import React, { Suspense, useContext } from "react";
import { MediaItem } from "../graphql/graphql";
import { fetchAnilistMedia } from "../graphql/query";

type AnimeDetailsContextValue = MediaItem | undefined;

const AnimeDetailsContext = React.createContext<AnimeDetailsContextValue>(undefined!);

export async function AnimeDetailsProvider({ animeId, children }: { animeId: number; children: React.ReactNode }) {
    const data = await fetchAnilistMedia(animeId);
    if (!data) {
        throw new Error("Failed to fetch anime data");
    }
    return <AnimeDetailsContext.Provider value={data}>{children}</AnimeDetailsContext.Provider>;
}

export function useAnimeDetails() {
    return useContext(AnimeDetailsContext);
}
