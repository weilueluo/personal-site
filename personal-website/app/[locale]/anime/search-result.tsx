"use client"
import { SectionMedia, PageInfoItem } from "@/components/anime/graphql";
import { useAnimeSearch } from "@/components/anime/search";
import ProgressiveImage from "@/components/ui/Image";
import { tm } from "@/shared/utils";
import { useState, useEffect } from "react";
import { VscLoading } from "react-icons/vsc";

enum CardListState {
    ERROR = "ERROR",
    LOADING = "LOADING",
    VALIDATING = "VALIDATING",
    IDLE = "IDLE",
    COMPLETED = "COMPLETED",
}
export default function SearchResult() {
    const { data, error, isLoading, isValidating, size, setSize } = useAnimeSearch();

    // combine data on receive
    const [mergedData, setMergedData] = useState<SectionMedia[]>([]);
    const [pageInfo, setPageInfo] = useState<PageInfoItem | undefined>(undefined);
    useEffect(() => {
        setMergedData(data?.flatMap((data) => data.data || []) || []);
        setPageInfo(data?.[data.length - 1]?.pageInfo);
    }, [data]);

    // state for the whole card list
    const [state, setState] = useState<CardListState>(CardListState.IDLE);
    useEffect(() => error && setState(CardListState.ERROR), [error]);
    useEffect(() => {
        (isLoading || isValidating) && setState(CardListState.LOADING);
    }, [isLoading, isValidating]);
    useEffect(() => {
        if (!error && !isLoading && !isValidating) {
            setState(CardListState.IDLE);
        }
    }, [error, isLoading, isValidating]);
    useEffect(() => {
        if (state === CardListState.IDLE && data && data.length > 0 && !data[data.length - 1]?.pageInfo?.hasNextPage) {
            setState(CardListState.COMPLETED);
        }
    }, [data, state]);

    // button text by state
    const [buttonText, setButtonText] = useState("load more");
    useEffect(() => {
        if (state === CardListState.LOADING) {
            setButtonText("loading");
        } else if (state === CardListState.COMPLETED) {
            setButtonText("all loaded");
        } else if (state === CardListState.IDLE) {
            setButtonText("load more");
        }
    }, [state]);

    // load more when reach bottom
    useEffect(() => {
        const handleScroll = () => {
            // https://stackoverflow.com/questions/9439725/how-to-detect-if-browser-window-is-scrolled-to-bottom
            if (state === CardListState.COMPLETED || state === CardListState.LOADING) {
                return;
            }
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
                setSize(size + 1);
            }
        };
        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, [setSize, size, state]);

    useEffect(() => {
        if (error) console.error(error);
    }, [error]);

    const [collapse, setCollapse] = useState(false);

    return (
        <>
            <div className="my-2 flex flex-row justify-between">
                <h3 className="text-xl font-bold capitalize">
                    Search Result
                    {state === CardListState.LOADING && (
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
                        !collapse && "grid grid-cols-5"
                    )}>
                    {!data && Array.from(Array(15).keys()).map((i) => <PlaceholderCard key={i} />)}
                    {mergedData?.map((data) => (
                        <Card key={data.id} data={data} />
                    ))}
                </ul>

                <div className="flex w-full justify-center">
                    <button
                        className="hover-shadow px-2 py-1"
                        onClick={() => setSize(size + 1)}
                        disabled={state === CardListState.COMPLETED}>
                        {buttonText}
                        {pageInfo && ` (${mergedData.length}/${pageInfo.total})`}
                        {state === CardListState.LOADING && (
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
            <div className="max-w-36 w-36 animate-in fade-in-50 zoom-in-0 duration-150">
                <div className="relative h-52">
                    <ProgressiveImage
                        srcs={[data.coverImage?.medium, data.coverImage?.large]}
                        fill={true}
                        sizes="(min-width: 1024px) 480px, 320px"
                        alt="image"
                        className="rounded-md object-cover object-center"
                        fallback={<div className="h-52 rounded-md bg-gray-500" />}
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
            <div className="max-w-36 w-36 animate-in zoom-in-0">
                <div className="h-52 rounded-md bg-gray-400" />
                <span className="inline-block h-4 w-full rounded-md bg-gray-400"></span>
            </div>
        </div>
    );
}
