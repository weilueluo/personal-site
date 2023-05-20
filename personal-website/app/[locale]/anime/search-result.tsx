"use client";
import { SectionMedia } from "@/components/anime/graphql";
import { useAnimeSearch } from "@/components/anime/search";
import ProgressiveImage from "@/components/ui/Image";
import { tm } from "@/shared/utils";
import { useEffect, useState } from "react";
import { VscLoading } from "react-icons/vsc";

export default function SearchResult() {
    const { swrAnimeResponse, mergedData, pageInfo } = useAnimeSearch();

    useEffect(() => swrAnimeResponse.error && console.error(swrAnimeResponse.error), [swrAnimeResponse.error]);

    // button text by state
    const [buttonText, setButtonText] = useState("loading");
    useEffect(() => {
        if (swrAnimeResponse.isLoading || swrAnimeResponse.isValidating) {
            setButtonText("loading");
        } else if (!pageInfo?.hasNextPage) {
            setButtonText("all loaded");
        } else {
            setButtonText("load more");
        }
    }, [swrAnimeResponse.isLoading, swrAnimeResponse.isValidating, pageInfo?.hasNextPage]);

    // load more when reach bottom
    useEffect(() => {
        const handleScroll = () => {
            if (swrAnimeResponse.isLoading || swrAnimeResponse.isValidating) {
                return;
            }

            // https://stackoverflow.com/questions/9439725/how-to-detect-if-browser-window-is-scrolled-to-bottom
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
                swrAnimeResponse.setSize(swrAnimeResponse.size + 1);
            }
        };
        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, [swrAnimeResponse]);

    const [collapse, setCollapse] = useState(false);

    return (
        <>
            <div className="my-2 flex flex-row justify-between">
                <h3 className="text-xl font-bold capitalize">
                    Results
                    {(swrAnimeResponse.isLoading || swrAnimeResponse.isValidating) && (
                        <VscLoading className="mx-2 inline-block animate-spin align-middle" />
                    )}
                </h3>

                <button className="hover-shadow px-2 py-1" onClick={() => setCollapse((v) => !v)}>
                    {collapse ? "expand" : "collpase"}
                </button>
            </div>
            <div className="relative">
                <ul
                    className={tm(
                        collapse && "flex w-full flex-row gap-2 overflow-x-auto",
                        !collapse && "my-grid-cols-3 md:my-grid-cols-4 lg:my-grid-cols-5 grid justify-between"
                    )}>
                    {!mergedData && Array.from(Array(15).keys()).map((i) => <PlaceholderCard key={i} />)}
                    {mergedData.map((data) => (
                        <Card key={data.id} data={data} />
                    ))}
                </ul>

                <div className="flex w-full justify-center">
                    <button
                        className="hover-shadow px-2 py-1"
                        onClick={() => swrAnimeResponse.setSize(swrAnimeResponse.size + 1)}
                        disabled={!pageInfo?.hasNextPage}>
                        {buttonText}
                        {pageInfo && ` (${mergedData.length}/${pageInfo.total})`}
                        {(swrAnimeResponse.isLoading || swrAnimeResponse.isValidating) && (
                            <VscLoading className="mx-2 inline-block animate-spin align-middle" />
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}

function Card({ data }: { data: SectionMedia }) {
    return (
        <div>
            <div className="max-w-36 w-24 animate-in fade-in-50 slide-in-from-top-6 duration-150 sm:w-36">
                <div className="relative h-36 w-full sm:h-52">
                    <ProgressiveImage
                        srcs={[data.coverImage?.medium, data.coverImage?.large]}
                        fill={true}
                        sizes="(min-width: 1024px) 480px, 320px"
                        alt="image"
                        className="rounded-md object-cover object-center"
                        fallback={<div className="h-52 w-36 rounded-md bg-gray-500" />}
                    />
                </div>
                <span className="line-clamp-4 break-all">
                    {data.title?.english || data.title?.romaji || data.title?.native}
                </span>
            </div>
        </div>
    );
}

function PlaceholderCard() {
    return (
        <div>
            <div className="max-w-36 w-36 animate-in slide-in-from-top-6 duration-150">
                <div className="h-52 rounded-md bg-gray-400" />
                <span className="inline-block h-4 w-full rounded-md bg-gray-400"></span>
            </div>
        </div>
    );
}
