"use client";
import { favouriteAnimeFetcher, getAnilistKey } from "@/components/anime/fetcher";
import { AnilistGraphqlQuery, SectionMedia } from "@/components/anime/graphql";
import { Page, fetchSearchPage } from "@/components/anime/query";
import ProgressiveImage from "@/components/ui/Image";
import { tm } from "@/shared/utils";
import { useCallback, useEffect, useState, useTransition } from "react";
import useSWRInfinite from "swr/infinite";
import { FaSearch } from "react-icons/fa";

export default function Anime() {
    // return <CardList getKey={getFavouriteAnimeKey} fetcher={favouriteAnimeFetcher} title="Favourites" />;
    const [searchTerm, setSearchTerm] = useState<string>("naruto");
    const [isPending, startTransition] = useTransition();
    const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        startTransition(() => {
            setSearchTerm(e.target.value);
        });
    };

    const searchFetcher = useCallback(
        async (pageKey: Promise<number>) => {
            const page = await pageKey;
            return fetchSearchPage(page, searchTerm);
        },
        [searchTerm]
    );

    return (
        <>
            <div className="flex h-12 w-full flex-row gap-4">
                <input
                    className="h-full grow border-b border-transparent bg-transparent px-4 py-2 focus:border-black focus:outline-none"
                    placeholder="search term"
                    onChange={handleSearchTermChange}
                />
                <button className="hover-shadow grid h-full w-12 place-items-center">
                    <FaSearch size={"1.2em"} />
                </button>
            </div>
            <div>{`isPending=${isPending.toString()}`}</div>
            <CardList getKey={getAnilistKey} fetcher={searchFetcher} title="Search" />
        </>
    );
}

enum CardListState {
    ERROR = "ERROR",
    LOADING = "LOADING",
    VALIDATING = "VALIDATING",
    IDLE = "IDLE",
    COMPLETED = "COMPLETED",
}
function CardList({ getKey, fetcher, title }: { getKey: any; fetcher: any; title?: string }) {
    const { data, error, isLoading, isValidating, size, setSize, mutate } = useSWRInfinite<Page<SectionMedia[]>>(
        getKey,
        fetcher,
        {
        }
    );

    // useEffect(() => {
    //     mutate();
    // }, [fetcher, mutate]);

    // combine data on receive
    const [mergedData, setMergedData] = useState<SectionMedia[]>([]);
    useEffect(() => setMergedData(data?.flatMap((data) => data.data || []) || []), [data]);

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

    if (error) {
        console.error(error);
    }

    useEffect(() => {
        console.log("data", data);
    }, [data]);

    const [collapse, setCollapse] = useState(false);

    return (
        <>
            <div className="my-2 flex flex-row justify-between">
                <h3 className=" text-xl font-bold capitalize">
                    {title} - {`state=${state}`}
                </h3>

                <button className=" hover-shadow px-2 py-1" onClick={() => setCollapse((v) => !v)}>
                    {collapse ? "expand" : "collpase"}
                </button>
            </div>
            <div>
                <ul
                    className={tm(
                        collapse && "flex w-full flex-row gap-2 overflow-x-auto",
                        !collapse && "grid grid-cols-5"
                    )}>
                    {!data && Array.from(Array(3).keys()).map((i) => <PlaceholderCard key={i} />)}
                    {/* {!mergedData && Array(5).map((_, i) => <PlaceholderCard key={i} />)} */}
                    {mergedData?.map((data) => (
                        <Card key={data.id} data={data} />
                    ))}
                </ul>
                <div>
                    <button
                        className="hover-shadow px-2 py-1"
                        onClick={() => setSize(size + 1)}
                        disabled={state === CardListState.COMPLETED}>
                        {buttonText}
                    </button>
                </div>
            </div>
        </>
    );
}

function Card({ data }: { data: SectionMedia }) {
    return (
        <div>
            <div className="max-w-36 w-36">
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
                <span>{data.title?.english || data.title?.romaji || data.title?.native}</span>
            </div>
        </div>
    );
}

function PlaceholderCard() {
    return (
        <div>
            <div className="max-w-36 w-36">
                <div className="h-52 rounded-md bg-gray-400" />
                <span className="inline-block h-4 w-full rounded-md bg-gray-400"></span>
            </div>
        </div>
    );
}
