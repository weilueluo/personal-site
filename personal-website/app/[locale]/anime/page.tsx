"use client";
import { favouriteAnimeFetcher, getFavouriteAnimeKey } from "@/components/anime/fetcher";
import { PAGE_SIZE, SectionMedia } from "@/components/anime/graphql";
import { Page } from "@/components/anime/query";
import ProgressiveImage from "@/components/ui/Image";
import { useEffect, useState } from "react";
import useSWRInfinite from "swr/infinite";

export default function Anime() {
    // const { data, error, isLoading, isValidating, size, setSize } = useSWRInfinite<Page<SectionMedia[]>>(
    //     //@ts-ignore
    //     getFavouriteAnimeKey,
    //     favouriteAnimeFetcher
    // );

    // if (error) {
    //     console.error(error);
    //     return <span>Error while loading data</span>;
    // }
    // const mergedData = data?.flatMap((data) => data.data || []);
    // const isLoadingMore =
    //     isLoading || isValidating || (size > 0 && data && typeof data[data.length - 1] === "undefined");
    // const isEmpty = mergedData?.length === 0;
    // const isEnded = isEmpty || ((data && data[data.length - 1]?.data?.length) || 0) < PAGE_SIZE;

    // return (
    //     <>
    //         <ul>
    //             <li>loading {`${isLoadingMore}`}</li>
    //             <li>isEmpty {`${isEmpty}`}</li>
    //             <li>isEnded {`${isEnded}`}</li>
    //             <li>size {`${size}`}</li>
    //             <button onClick={() => setSize(size + 1)}>load more</button>
    //         </ul>
    //         <ul className="flex w-full flex-row gap-2 overflow-y-scroll">
    //             {mergedData?.map((data) => (
    //                 <Card key={data.id} data={data} />
    //             ))}
    //         </ul>
    //     </>
    // );

    return <CardList getKeyFunc={getFavouriteAnimeKey} fetcher={favouriteAnimeFetcher} />;
}

enum CardListState {
    ERROR = "ERROR",
    LOADING = "LOADING",
    VALIDATING = "VALIDATING",
    IDLE = "IDLE",
    COMPLETED = "COMPLETED",
}
function CardList({ getKeyFunc, fetcher }: any) {
    const { data, error, isLoading, isValidating, size, setSize } = useSWRInfinite<Page<SectionMedia[]>>(
        getKeyFunc,
        fetcher
    );

    const [mergedData, setMergedData] = useState<SectionMedia[]>([]);
    // data
    useEffect(() => {
        
    }, [data]);

    // is empty
    const [isEmpty, setIsEmpty] = useState(false);
    useEffect(() => {
        setIsEmpty(mergedData?.length === 0);
    }, [mergedData]);

    // state
    const [state, setState] = useState<CardListState>(CardListState.IDLE);
    useEffect(() => {
        if (error) {
            setState(CardListState.ERROR);
        } else if (isLoading || isValidating || (size > 0 && data && typeof data[data.length - 1] === "undefined")) {
            setState(CardListState.LOADING);
        } else if (isEmpty || ((data && data[data.length - 1]?.data?.length) || 0) < PAGE_SIZE) {
            setState(CardListState.COMPLETED);
        } else {
            setMergedData(data?.flatMap((data) => data.data || []) || []);
            setState(CardListState.IDLE)
        }
    }, [error, isLoading, data, isEmpty, isValidating, size]);

    if (error) {
        console.error(error);
    }

    const [buttonText, setButtonText] = useState("load more");
    useEffect(() => {
        if (state === CardListState.LOADING) {
            setButtonText("loading");
        } else if (state === CardListState.COMPLETED) {
            setButtonText("all loaded");
        }
    }, [state]);

    return (
        <>
            <ul>
                <li>state {`${state}`}</li>
                <li>size {`${size}`}</li>
            </ul>
            <div>
                <ul className="flex w-full flex-row gap-2 overflow-y-scroll">
                    {mergedData?.map((data) => (
                        <Card key={data.id} data={data} />
                    ))}
                </ul>
                <div>
                    <button onClick={() => setSize(size + 1)} disabled={state === CardListState.COMPLETED}>
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
                <div className="relative h-56">
                    <ProgressiveImage
                        srcs={[data.coverImage?.medium, data.coverImage?.large]}
                        alt="image"
                        fill={true}
                        className=" rounded-md object-cover object-center"
                    />
                </div>
                <span>{data.title?.english || data.title?.romaji || data.title?.native}</span>
            </div>
        </div>
    );
}
