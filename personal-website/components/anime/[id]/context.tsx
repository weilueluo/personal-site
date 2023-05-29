"use client";
import Loading from "@/app/[locale]/anime/[id]/loading";
import React, { useContext, useEffect } from "react";
import { MediaItem } from "../graphql/graphql";
import { fetchAnilistMedia } from "../graphql/query";

type AnimeDetailsContextValue = MediaItem | undefined;

const AnimeDetailsContext = React.createContext<AnimeDetailsContextValue>(undefined!);

export function AnimeDetailsProvider({ animeId, children }: { animeId: number; children: React.ReactNode }) {
    const [data, setData] = React.useState<AnimeDetailsContextValue | "loading">("loading");
    const [error, setError] = React.useState<Error | undefined>(undefined);
    if (error) {
        throw error;
    }

    // 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

    useEffect(() => {
        fetchAnilistMedia(animeId)
            .then((data) => {
                setData(data);
            })
            .catch((err) => {
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
