"use client";
import Loading from "@/components/ui/loading/spinner";
import { suspensify } from "@/shared/suspense";
import React, { Suspense, useContext } from "react";
import { MediaItem } from "../graphql/graphql";
import { fetchAnilistMedia } from "../graphql/query";

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
