"use client";
import { favouriteAnimeFetcher } from "@/components/anime/fetcher";
import { PAGE_SIZE, SectionMedia } from "@/components/anime/graphql";
import { Page } from "@/components/anime/query";
import ProgressiveImage from "@/components/ui/Image";
import useSWRInfinite from "swr/infinite";

const getNextFavPageKey = (i: number, prev: Page<SectionMedia[]>) => {
    console.log(`getNextFavPage i=${i}, prev=${prev}`);
    console.log(prev);

    if (prev && !prev.pageInfo?.hasNextPage) {
        return null;
    }
    if (!i) {
        return 1;
    }
    return i + 1;
};

export default function Anime() {
    const { data, error, isLoading, isValidating, size, setSize } = useSWRInfinite<Page<SectionMedia[]>>(
        //@ts-ignore
        getNextFavPageKey,
        favouriteAnimeFetcher
    );

    if (error) {
        console.error(error);
        return <span>Error while loading data</span>;
    }
    const mergedData = data?.flatMap((data) => data.data || []);
    const isLoadingMore =
        isLoading || isValidating || (size > 0 && data && typeof data[data.length - 1] === "undefined");
    const isEmpty = mergedData?.length === 0;
    const isEnded = isEmpty || ((data && data[data.length - 1]?.data?.length) || 0) < PAGE_SIZE;

    return (
        <>
            <ul>
                <li>loading {`${isLoadingMore}`}</li>
                <li>isEmpty {`${isEmpty}`}</li>
                <li>isEnded {`${isEnded}`}</li>
                <li>size {`${size}`}</li>
                <button onClick={() => setSize(size + 1)}>load more</button>
            </ul>
            <ul className="flex w-full flex-row gap-2 overflow-y-scroll">
                {mergedData?.map((data) => (
                    <Card key={data.id} data={data} />
                ))}
            </ul>
        </>
    );
}

function Card({ data }: { data: SectionMedia }) {
    return (
        <div className="">
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
