import ProgressiveImage from "@/components/ui/Image";
import BackButton from "./back";
import { Characters, CoverImage, Description, Relations, Staffs, Title, Trailer } from "./components";
import { useAnimeDetails } from "./context";
import { Genres, HashTags, NextAiring, Score, Status, Tags } from "./labels";

export default function AnimeDetails() {
    const data = useAnimeDetails();

    if (!data) {
        throw new Error("Failed to fetch anime data");
    }

    return (
        <div className="flex flex-col gap-2 md:gap-4">
            <div>
                <BackButton />
            </div>
            {/* banner image */}
            <ProgressiveImage
                srcs={[data?.bannerImage]}
                fill={true}
                sizes="(min-width: 1024px) 1024px, 768px"
                alt="image"
                className=" h-40 w-full overflow-hidden rounded-md"
                loading={<div className="h-40 w-full rounded-md bg-gray-500" />}
            />

            <div className="flex grid-cols-4 grid-rows-1 flex-col gap-4 md:grid">
                {/* side panel */}
                <div className="flex flex-col gap-4">
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
