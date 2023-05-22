"use client";
import ProgressiveImage from "@/components/ui/Image";
import LoadingItem from "@/components/ui/loading/loading";
import Link from "next/link";
import { useState } from "react";
import BackButton from "./back";
import { useAnimeDetails } from "./context";
import { Genres, HashTags, NextAiring, Score, Status, Tags } from "./labels";
import { Label } from "./primitives";
import { Characters, Relations, Staffs, Trailer } from "./sections";

export default function AnimeDetails() {
    const data = useAnimeDetails();

    // console.log("anime details", data);

    if (!data) {
        return <span>Failed to fetch anime data</span>;
    }

    return (
        <div className="flex flex-col md:gap-4">
            <div>
                <BackButton />
            </div>
            {/* banner image */}
            <ProgressiveImage
                srcs={[data?.bannerImage]}
                fill={true}
                sizes="(min-width: 1024px) 1024px, 768px"
                alt="image"
                className=" h-40 w-full overflow-hidden rounded-md animate-in slide-in-from-top-4 fade-in-0"
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

function Title() {
    const data = useAnimeDetails();

    const titles = [data?.title?.english, data?.title?.native, data?.title?.romaji].filter((title) => !!title);
    const mainTitle = titles[0];
    const subTitles = [...new Set(titles.slice(1).filter((title) => title !== mainTitle))];

    const url = data?.siteUrl;

    const [showOtherNames, setShowOtherNames] = useState(false);
    const synonyms = data?.synonyms || [];

    return (
        <div className="flex flex-col flex-wrap gap-2">
            <Link href={url || "#"} target="_blank">
                <h1 className="text-2xl font-bold hover:cursor-pointer hover:underline">{mainTitle}</h1>
            </Link>
            <div className="flex flex-row flex-wrap gap-2 text-sm">
                {subTitles.map((title) => (
                    <Label url={url} key={title} className=" bg-slate-200 hover:cursor-pointer hover:underline">
                        {title}
                    </Label>
                ))}
                {showOtherNames &&
                    synonyms.map((title) => (
                        <Label url={url} key={title} className=" bg-slate-200 hover:cursor-pointer hover:underline">
                            {title}
                        </Label>
                    ))}
                {synonyms && synonyms.length > 0 && (
                    <Label
                        key={"otherName"}
                        className=" bg-slate-200 animate-in fade-in-0 slide-in-from-left-4 hover:cursor-pointer hover:underline"
                        onClick={() => setShowOtherNames(!showOtherNames)}>
                        {showOtherNames ? "hide" : "show more..."}
                    </Label>
                )}
            </div>
        </div>
    );
}

function Description() {
    const data = useAnimeDetails();

    return data?.description ? (
        <p dangerouslySetInnerHTML={{ __html: data.description }} className=" font-semibold animate-in slide-in-from-bottom-4 fade-in-0" />
    ) : null;
}

function CoverImage() {
    const data = useAnimeDetails();

    return data?.coverImage ? (
        <div className="w-full">
            <ProgressiveImage
                srcs={[data?.coverImage?.medium, data?.coverImage?.large]}
                fill={true}
                sizes="(min-width: 1024px) 480px, 320px"
                alt="image"
                className="hidden h-56 overflow-hidden rounded-md md:block animate-in slide-in-from-left-4 fade-in-0"
                loading={<LoadingItem className="h-56 w-full" />}
            />
        </div>
    ) : null;
}
