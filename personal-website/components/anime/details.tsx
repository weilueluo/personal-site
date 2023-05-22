import React, { useContext } from "react";
import { fetchAnilistMedia } from "./query";
import { MediaItem } from "./graphql";

type AnimeDetailsContextValue = MediaItem | undefined;

const AnimeDetailsContext = React.createContext<AnimeDetailsContextValue>(undefined!);

export async function AnimeDetailsProvider({ animeId, children }: { animeId: number; children: React.ReactNode }) {
    const data = await fetchAnilistMedia(animeId);

    return <AnimeDetailsContext.Provider value={data}>{children}</AnimeDetailsContext.Provider>;
}


export function useAnimeDetails() {
    return useContext(AnimeDetailsContext);
}
