import { AnimeDetailsProvider } from "@/components/anime/[id]/context";
import AnimeDetails from "@/components/anime/[id]/details";
export default async function Page({ params }: { params: { id: number } }) {
    // return <Loading />;

    return (
        // @ts-ignore async server component
        <AnimeDetailsProvider animeId={params.id}>
            <AnimeDetails />
        </AnimeDetailsProvider>
    );
}
