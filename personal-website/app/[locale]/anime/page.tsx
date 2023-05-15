"use client";
import { AnimeFastFiltersProvider, useAnimeFastFilters } from "@/components/anime/fast-filters";
import { PageInfoItem, SectionMedia } from "@/components/anime/graphql";
import { AnimeSearchProvider, FilterItem, useAnimeSearch } from "@/components/anime/search";
import AnimeSlowFiltersProvider, { useAnimeSlowFilters } from "@/components/anime/slow-filters";
import ProgressiveImage from "@/components/ui/Image";
import { tm } from "@/shared/utils";
import React, { useEffect, useState, useTransition } from "react";
import { FaSearch } from "react-icons/fa";
import { HiSwitchHorizontal } from "react-icons/hi";
import { TbAdjustmentsHorizontal } from "react-icons/tb";
import { VscLoading } from "react-icons/vsc";
import { useDebounce } from "react-use";

export default function Anime() {
    // return <CardList getKey={getFavouriteAnimeKey} fetcher={favouriteAnimeFetcher} title="Favourites" />;
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [debounceSearchTerm, setDebounceSearchTerm] = useState<string>(searchTerm);
    useDebounce(() => startTransition(() => setDebounceSearchTerm(searchTerm)), 500, [searchTerm]);
    const [isPending, startTransition] = useTransition();
    const handleSearchStringChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);

    useEffect(() => {
        console.log("searchTerm", searchTerm);
    }, [searchTerm]);
    useEffect(() => {
        console.log("debounceSearchTerm", debounceSearchTerm);
    }, [debounceSearchTerm]);

    return (
        <AnimeFastFiltersProvider>
            <AnimeSlowFiltersProvider>
                <AnimeSearchProvider searchString={debounceSearchTerm}>
                    <SearchBar handleSearchStringChange={handleSearchStringChange} isPending={isPending} />
                    <SearchResult />
                </AnimeSearchProvider>
            </AnimeSlowFiltersProvider>
        </AnimeFastFiltersProvider>
    );
}

function SearchBar({
    handleSearchStringChange,
    isPending,
}: {
    handleSearchStringChange: (e: React.ChangeEvent<HTMLInputElement>) => unknown;
    isPending: boolean;
}) {
    const {
        genreFilters,
        genreFilterOnClick,
        tagFilters,
        tagFilterOnClick,
        activeSlowFilters,
        activeSlowFilterOnClick,
    } = useAnimeSlowFilters();
    const { typeFilter, typeFilterOnClick } = useAnimeFastFilters();

    // fast filters
    const [showFilter, setShowFilter] = useState(false);
    const onClickShowFilter = () => setShowFilter(!showFilter);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex h-10 w-full flex-row rounded-md bg-gray-500 text-white caret-white">
                <div className="grid h-full w-12 place-items-center text-black">
                    <FaSearch />
                </div>
                <input
                    className="h-full grow bg-transparent py-1 focus:outline-none"
                    placeholder="search term"
                    onChange={handleSearchStringChange}
                />
                <div
                    className="m-2 grid w-12 place-items-center rounded-md hover:bg-gray-400"
                    onClick={onClickShowFilter}>
                    <TbAdjustmentsHorizontal />
                </div>
            </div>

            <div>
                <FilterPanel title={""} filterItems={activeSlowFilters} toggleSelection={activeSlowFilterOnClick} />
            </div>

            <div className="flex flex-row gap-2">
                <span>Quick Filter</span>
                <span
                    className=" flex flex-row items-center rounded-md border px-2 gap-1 capitalize hover:cursor-pointer hover:bg-orange-300"
                    onClick={typeFilterOnClick}>
                    {typeFilter.name.toLowerCase()}
                    <HiSwitchHorizontal className=" inline-block" size="0.9em" />
                </span>
            </div>

            {showFilter && (
                <div className="rounded-md border border-black p-2">
                    <div>
                        <FilterPanel title="Genres" filterItems={genreFilters} toggleSelection={genreFilterOnClick} />
                        <FilterPanel title="Tags" filterItems={tagFilters} toggleSelection={tagFilterOnClick} />
                    </div>
                </div>
            )}
        </div>
    );
}

function FilterPanel<T extends FilterItem>({
    title,
    filterItems,
    toggleSelection,
}: {
    title: string;
    filterItems: T[];
    toggleSelection: (item: T) => void;
}) {
    return (
        <div>
            <span>{title}</span>
            <div className="flex max-h-48 flex-row flex-wrap gap-2 overflow-y-auto text-sm">
                {filterItems.map((item) => (
                    <FilterLabel key={item.name} item={item} toggleSelection={toggleSelection} />
                ))}
            </div>
        </div>
    );
}

function FilterLabel<T extends FilterItem>({ item, toggleSelection }: { item: T; toggleSelection: (item: T) => void }) {
    return (
        <span
            key={item.name}
            className={tm(
                "rounded-md bg-blue-100 px-2 py-1 hover:cursor-pointer hover:bg-orange-200",
                item.active && "bg-orange-400"
            )}
            onClick={() => toggleSelection(item)}>
            {item.name}
        </span>
    );
}

enum CardListState {
    ERROR = "ERROR",
    LOADING = "LOADING",
    VALIDATING = "VALIDATING",
    IDLE = "IDLE",
    COMPLETED = "COMPLETED",
}
function SearchResult() {
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

    useEffect(() => {
        if (error) console.error(error);
    }, [error]);

    const [collapse, setCollapse] = useState(false);

    return (
        <>
            <div className="my-2 flex flex-row justify-between">
                <h3 className=" text-xl font-bold capitalize">Search {`[state=${state}]`}</h3>

                <button className=" hover-shadow px-2 py-1" onClick={() => setCollapse((v) => !v)}>
                    {collapse ? "expand" : "collpase"}
                </button>
            </div>
            <div className="relative">
                <ul
                    className={tm(
                        collapse && "flex w-full flex-row gap-2 overflow-x-auto",
                        !collapse && "grid grid-cols-5",
                        state === CardListState.LOADING && "grayscale"
                    )}>
                    {!data && Array.from(Array(3).keys()).map((i) => <PlaceholderCard key={i} />)}
                    {/* {!mergedData && Array(5).map((_, i) => <PlaceholderCard key={i} />)} */}
                    {mergedData?.map((data) => (
                        <Card key={data.id} data={data} />
                    ))}
                </ul>
                {state === CardListState.LOADING && (
                    <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                        <VscLoading size={"2em"} color="white" className=" animate-spin" />
                    </div>
                )}
                <div className="flex w-full justify-center">
                    <button
                        className="hover-shadow px-2 py-1"
                        onClick={() => setSize(size + 1)}
                        disabled={state === CardListState.COMPLETED}>
                        {buttonText}
                        {pageInfo && ` (${mergedData.length}/${pageInfo.total})`}
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
