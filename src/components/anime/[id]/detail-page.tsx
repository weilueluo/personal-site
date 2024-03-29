"use client";

import BackButton from "@/components/ui/back";
import ProgressiveImage from "@/components/ui/image";
import LoadingItem from "@/components/ui/loading/loading";
import { formattedMessage } from "@/shared/i18n/translation";
import { BaseCompProps } from "@/shared/types/comp";
import { tm } from "@/shared/utils";
import { CoverImage, Title, Description, Trailer, Relations, Characters, Staffs } from "./components";
import { useAnimeDetails } from "./context";
import { Status, NextAiring, Score, Genres, HashTags, Tags } from "./labels";

export function AnimeDetailsPage({ messages, locale, className, ...rest }: BaseCompProps<"div">) {
    const data = useAnimeDetails();

    return (
        <div className={tm("flex flex-col gap-2 md:gap-4", className)} {...rest}>
            <div className="flex flex-col gap-1 md:gap-2">
                <BackButton messages={messages} locale={locale} />
                {/* banner image */}
                <ProgressiveImage
                    srcs={[data?.bannerImage]}
                    fill={true}
                    sizes="(min-width: 1024px) 1024px, 768px"
                    alt={formattedMessage(messages, "anime.details.banner_image_alt")}
                    className=" h-40 w-full overflow-hidden"
                    loading={<LoadingItem className="h-40 w-full" />}
                />
            </div>

            <div className="flex grid-cols-4 grid-rows-1 flex-col gap-4 md:grid">
                {/* side panel */}
                <div className="flex flex-col gap-2 md:gap-4">
                    <CoverImage messages={messages} locale={locale} />
                    <div className="flex flex-col gap-2">
                        <Status messages={messages} locale={locale} />
                        <NextAiring messages={messages} locale={locale} />
                        <Score messages={messages} locale={locale} />
                    </div>
                    <Genres />
                    <HashTags />
                    <Tags />
                </div>
                {/* main panel */}
                <div className="col-start-2 col-end-[-1] flex flex-col gap-6">
                    <Title messages={messages} locale={locale} />
                    <Description />
                    <Trailer messages={messages} locale={locale} />
                    <Relations messages={messages} locale={locale} />
                    <Characters messages={messages} locale={locale} />
                    <Staffs messages={messages} locale={locale} />
                </div>
            </div>
        </div>
    );
}
