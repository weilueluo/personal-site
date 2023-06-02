"use client";
import { SectionMedia } from "@/components/anime/graphql/graphql";
import { useAnimeSearch } from "@/components/anime/search";
import ProgressiveImage from "@/components/ui/image";
import { tm } from "@/shared/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ComponentPropsWithoutRef, useEffect, useState } from "react";
import { MdExpandMore } from "react-icons/md";
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

    const pathname = usePathname();

    return (
        <>
            {/* loading header */}
            <div className="my-2 flex flex-row justify-between">
                <h3 className="text-xl font-bold capitalize">
                    Results
                    {(swrAnimeResponse.isLoading || swrAnimeResponse.isValidating) && (
                        <VscLoading className="mx-2 inline-block animate-spin align-middle" />
                    )}
                </h3>

                <button className="icon-text std-hover std-pad" onClick={() => setCollapse(v => !v)}>
                    <MdExpandMore className="inline-block" />
                    {collapse ? "expand" : "collpase"}
                </button>
            </div>

            {/* content */}
            <div className="relative">
                {/* image cards */}
                <ul
                    className={tm(
                        collapse && "flex w-full flex-row gap-2 overflow-x-auto",
                        !collapse && "my-grid-cols-3 md:my-grid-cols-4 lg:my-grid-cols-5 grid justify-between"
                    )}>
                    {mergedData.map(data => (
                        <Link href={`${pathname}/${data.id}`} key={data.id} prefetch={false}>
                            <Card data={data} />
                        </Link>
                    ))}
                    {(swrAnimeResponse.isLoading || swrAnimeResponse.isValidating) &&
                        (!mergedData || mergedData.length == 0) &&
                        Array.from(Array(15).keys()).map(i => <PlaceholderCard key={i} />)}
                </ul>

                {/* load more info / button */}
                <div className="flex w-full justify-center">
                    <button
                        className="std-pad std-hover mt-2"
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

interface CardProps extends ComponentPropsWithoutRef<"div"> {
    data: SectionMedia;
}
const Card = React.forwardRef<HTMLDivElement, CardProps>((props, ref) => {
    const { data, className } = props;
    return (
        <div ref={ref} className={tm("group hover:underline", className)}>
            <div className="max-w-36 w-24 duration-150 sm:w-36">
                <ProgressiveImage
                    srcs={[data.coverImage?.medium, data.coverImage?.large]}
                    fill={true}
                    sizes="(min-width: 1024px) 480px, 320px"
                    alt="image"
                    className="relative h-36 w-full overflow-hidden sm:h-52"
                    loading={<div className="h-36 w-24 bg-gray-500 sm:h-52 sm:w-36" />}
                />
                <span className="line-clamp-4 break-words font-semibold">
                    {data.title?.english || data.title?.romaji || data.title?.native}
                </span>
            </div>
        </div>
    );
});
Card.displayName = "Card";

function PlaceholderCard() {
    return (
        <div>
            <div className="max-w-36 w-24 animate-in slide-in-from-top-6 duration-150 sm:w-36">
                <div className="h-36 bg-gray-400 sm:h-52" />
                <span className="inline-block h-4 w-full bg-gray-400"></span>
            </div>
        </div>
    );
}
