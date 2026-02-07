"use client";

import AnimeDetails from "@/archive/2021/components/animeDetails/AnimeDetails";

export default function Archive2021AnimeDetailsClient({ animeID }: { animeID: string }) {
    return <AnimeDetails animeID={animeID} />;
}
