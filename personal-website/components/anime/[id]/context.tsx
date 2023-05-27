"use client";
import React, { useContext, useLayoutEffect } from "react";
import { MediaItem } from "../graphql/graphql";
import { fetchAnilistMedia } from "../graphql/query";
import Loading from "@/components/ui/loading/spinner";

type AnimeDetailsContextValue = MediaItem | undefined;

const AnimeDetailsContext = React.createContext<AnimeDetailsContextValue>(undefined!);

export function AnimeDetailsProvider({ animeId, children }: { animeId: number; children: React.ReactNode }) {
    const [data, setData] = React.useState<AnimeDetailsContextValue | "loading">("loading");
    const [error, setError] = React.useState<Error | undefined>(undefined);
    if (error) {
        throw error;
    }

    useLayoutEffect(() => {
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

    if (data == "loading") {
        return <Loading />;
    }

    return <AnimeDetailsContext.Provider value={data}>{children}</AnimeDetailsContext.Provider>;
}

export function useAnimeDetails() {
    return useContext(AnimeDetailsContext);
}
