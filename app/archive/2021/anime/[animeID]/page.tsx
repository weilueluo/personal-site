import Archive2021AnimeDetailsClient from "./client";

export default async function Archive2021AnimeDetails({
    params,
}: {
    params: { animeID: string } | Promise<{ animeID: string }>;
}) {
    const { animeID } = await params;
    return <Archive2021AnimeDetailsClient animeID={animeID} />;
}
