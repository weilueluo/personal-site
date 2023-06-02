"use client";
import Loading from "@/app/[locale]/anime/[id]/loading";
import React, { useContext, useEffect } from "react";
import { MediaItem } from "../../components/anime/graphql/graphql";
import { fetchAnilistMedia } from "../../components/anime/graphql/query";

type AnimeDetailsContextValue = MediaItem | undefined;

const AnimeDetailsContext = React.createContext<AnimeDetailsContextValue>(undefined!);

export function AnimeDetailsProvider({ animeId, children }: { animeId: number; children: React.ReactNode }) {
    const [data, setData] = React.useState<AnimeDetailsContextValue | "loading">("loading");
    const [error, setError] = React.useState<Error | undefined>(undefined);
    if (error) {
        throw error;
    }

    useEffect(() => {
        fetchAnilistMedia(animeId)
            .then(data => {
                setData(data);
            })
            .catch(err => {
                setError(err);
            });
    }, [animeId]);

    // the nextjs has a bug where it will try to re-render infinitely when loading / file modified
    // so just fallback to usual stuff

    if (data === "loading") {
        return <Loading />;
    }

    return <AnimeDetailsContext.Provider value={data}>{children}</AnimeDetailsContext.Provider>;
}

export function useAnimeDetails() {
    return useContext(AnimeDetailsContext);
}
