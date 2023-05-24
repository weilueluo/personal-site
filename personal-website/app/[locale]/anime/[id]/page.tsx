"use client";
import { AnimeDetailsProvider } from "@/components/anime/[id]/context";
import AnimeDetails from "@/components/anime/[id]/details";
import { fetchAnilistMedia } from "@/components/anime/graphql/query";
import { suspensify } from "@/shared/suspense";
import { Suspense } from "react";
import Loading from "./loading";

export default function Page({ params }: { params: { id: number } }) {
    const animeDetails = suspensify(fetchAnilistMedia(params.id));

    return (
        <Suspense fallback={<Loading />}>
            <AnimeDetailsProvider animeDetails={animeDetails}>
                <AnimeDetails />
            </AnimeDetailsProvider>
        </Suspense>
    );
}
