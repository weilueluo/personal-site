"use client";
import BackButton from "@/components/anime/[id]/back";
import { Characters, CoverImage, Description, Relations, Staffs, Trailer } from "@/components/anime/[id]/components";
import { AnimeDetailsProvider, useAnimeDetails } from "@/components/anime/[id]/context";
import { Genres, HashTags, NextAiring, Score, Status, Tags } from "@/components/anime/[id]/labels";
import ProgressiveImage from "@/components/ui/Image";
import Title from "../../title";

export default function Page({ params }: { params: { id: number } }) {
    return (
        // @ts-ignore async server component
        <AnimeDetailsProvider animeId={params.id}>
            <AnimeDetailsPage />
        </AnimeDetailsProvider>
    );
}

function AnimeDetailsPage() {
    const data = useAnimeDetails();

    return (
        <div className="flex flex-col gap-2 md:gap-4">
            <div className="flex flex-col gap-1 md:gap-2">
                <BackButton />
                {/* banner image */}
                <ProgressiveImage
                    srcs={[data?.bannerImage]}
                    fill={true}
                    sizes="(min-width: 1024px) 1024px, 768px"
                    alt="image"
                    className=" h-40 w-full overflow-hidden"
                    loading={<div className="h-40 w-full bg-gray-500" />}
                />
            </div>

            <div className="flex grid-cols-4 grid-rows-1 flex-col gap-4 md:grid">
                {/* side panel */}
                <div className="flex flex-col gap-2 md:gap-4">
                    <CoverImage />
                    <div className="flex flex-col gap-2">
                        <Status />
                        <NextAiring />
                        <Score />
                    </div>
                    <Genres />
                    <HashTags />
                    <Tags />
                </div>
                {/* main panel */}
                <div className="col-start-2 col-end-[-1] flex flex-col gap-6">
                    <Title />
                    <Description />
                    <Trailer />
                    <Relations />
                    <Characters />
                    <Staffs />
                </div>
            </div>
        </div>
    );
}
