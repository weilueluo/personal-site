"use client";
import {
    AnimeFastFiltersProvider,
    COUNTRT_FILTER_DISPLAY_NAMES,
    COUNTRY_FILTER_VALUES,
    CountryFilterName,
    SORT_FILTER_VALUES,
    SortFilterName,
    TYPE_FILTER_VALUES,
    TypeFilterName,
    useAnimeFastFilters,
} from "@/components/anime/fast-filters";
import { PageInfoItem, SectionMedia } from "@/components/anime/graphql";
import { AnimeSearchProvider, FilterItem, useAnimeSearch } from "@/components/anime/search";
import AnimeSlowFiltersProvider, { useAnimeSlowFilters } from "@/components/anime/slow-filters";
import ProgressiveImage from "@/components/ui/Image";
import dropdown from "@/components/ui/dropdown";
import { tm } from "@/shared/utils";
import React, { useEffect, useState, useTransition } from "react";
import { FaSearch } from "react-icons/fa";
import { MdExpandMore } from "react-icons/md";
import { TbAdjustmentsHorizontal } from "react-icons/tb";
import { VscLoading } from "react-icons/vsc";
import { useDebounce } from "react-use";

export default function Anime() {
    // return <CardList getKey={getFavouriteAnimeKey} fetcher={favouriteAnimeFetcher} title="Favourites" />;
    // TODO: move search term handling to search provider
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
                    <SearchBar handleSearchStringChange={handleSearchStringChange} />
                    <SearchResult />
                </AnimeSearchProvider>
            </AnimeSlowFiltersProvider>
        </AnimeFastFiltersProvider>
    );
}

function SearchBar({
    handleSearchStringChange,
}: {
    handleSearchStringChange: (e: React.ChangeEvent<HTMLInputElement>) => unknown;
}) {
    const {
        genreFilters,
        genreFilterOnClick,
        tagFilters,
        tagFilterOnClick,
        activeSlowFilters,
        activeSlowFilterOnClick,
    } = useAnimeSlowFilters();
    const { typeFilter, setTypeFilter, sortFilter, setSortFilter, countryFilter, setCountryFilter } =
        useAnimeFastFilters();

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
                    className="m-2 grid w-12 place-items-center rounded-md bg-gray-600 hover:bg-gray-400"
                    onClick={onClickShowFilter}>
                    <TbAdjustmentsHorizontal />
                </div>
            </div>

            <div>
                <FilterPanel title={""} filterItems={activeSlowFilters} toggleSelection={activeSlowFilterOnClick} />
            </div>

            <div className="flex flex-row gap-2">
                {/* <span>Quick Filter</span> */}
                <QuickFilter
                    name={typeFilter.name}
                    onNameClick={(name) => setTypeFilter(name as TypeFilterName)}
                    names={TYPE_FILTER_VALUES}
                />
                <QuickFilter
                    name={sortFilter.name}
                    onNameClick={(name) => setSortFilter(name as SortFilterName)}
                    names={SORT_FILTER_VALUES}
                />
                <QuickFilter
                    name={countryFilter.name}
                    onNameClick={(name) => setCountryFilter(name as CountryFilterName)}
                    names={COUNTRY_FILTER_VALUES}
                    displayMap={COUNTRT_FILTER_DISPLAY_NAMES}
                />
            </div>

            {showFilter && (
                <div className="rounded-md border border-black p-2">
                    <div>
                        <FilterPanel title="Genres" filterItems={genreFilters} toggleSelection={genreFilterOnClick} />
                        <FilterPanel
                            title="Tags"
                            filterItems={tagFilters}
                            toggleSelection={tagFilterOnClick}
                            many={true}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

function QuickFilter<T extends string>({
    name,
    onNameClick,
    names,
    displayMap,
}: {
    name: T;
    names: T[];
    onNameClick: (name: T) => void;
    displayMap?: Record<T, string>;
}) {
    return (
        <dropdown.Container>
            <span className="flex flex-row items-center justify-center rounded-md bg-gray-500 px-2 py-1 capitalize text-gray-100 hover:bg-gray-400">
                {displayMap ? displayMap[name] : name.toLowerCase().replaceAll("_", " ")}
                <MdExpandMore className="ml-2 inline-block rounded-md bg-gray-600" size="1.2em" />
            </span>
            <dropdown.List className="bg-gray-500 text-gray-100">
                {names.map((name) => (
                    <div
                        key={name}
                        className="rounded-md px-2 capitalize hover:bg-gray-400"
                        onClick={() => onNameClick(name)}>
                        {displayMap ? displayMap[name] : name.toLowerCase().replaceAll("_", " ")}
                    </div>
                ))}
            </dropdown.List>
        </dropdown.Container>
    );
}

function FilterPanel<T extends FilterItem>({
    title,
    filterItems,
    toggleSelection,
    many = false,
}: {
    title: string;
    filterItems: T[];
    toggleSelection: (item: T) => void;
    many?: boolean;
}) {
    return (
        <div className="max-h-fit">
            <span>{title}</span>
            <div className={tm(many && "resize-y overflow-y-auto")}>
                <div className={tm("flex flex-row flex-wrap gap-2 text-sm", many && "h-48")}>
                    {filterItems.map((item) => (
                        <FilterLabel key={item.name} item={item} toggleSelection={toggleSelection} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function FilterLabel<T extends FilterItem>({ item, toggleSelection }: { item: T; toggleSelection: (item: T) => void }) {
    return (
        <span
            key={item.name}
            className={tm(
                "h-fit rounded-md bg-blue-100 px-2 py-1 hover:cursor-pointer hover:bg-orange-200",
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

    // load more when reach bottom
    useEffect(() => {
        const handleScroll = () => {
            // https://stackoverflow.com/questions/9439725/how-to-detect-if-browser-window-is-scrolled-to-bottom
            if (state === CardListState.COMPLETED || state === CardListState.LOADING) {
                return;
            }
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
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
                    Search
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
            <div className="max-w-36 w-36">
                <div className="h-52 rounded-md bg-gray-400" />
                <span className="inline-block h-4 w-full rounded-md bg-gray-400"></span>
            </div>
        </div>
    );
}
