"use client";
import {
    COUNTRT_FILTER_DISPLAY_NAMES,
    COUNTRY_FILTER_VALUES,
    CountryFilterName,
    SORT_FILTER_VALUES,
    SortFilterName,
    TYPE_FILTER_VALUES,
    TypeFilterName,
    useAnimeFastFilters,
} from "@/components/anime/fast-filters";
import { FilterItem, useAnimeSearch } from "@/components/anime/search";
import { useAnimeSlowFilters } from "@/components/anime/slow-filters";
import Separator from "@/components/ui/Separator";
import dropdown from "@/components/ui/dropdown";
import { tm } from "@/shared/utils";
import { ComponentPropsWithoutRef, useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdExpandMore, MdOutlineRadioButtonChecked, MdOutlineRadioButtonUnchecked } from "react-icons/md";
import { TbAdjustmentsHorizontal } from "react-icons/tb";

export default function SearchBar() {
    const {
        genreFilters,
        genreFilterOnClick,
        tagFilters,
        tagFilterOnClick,
        adultFilter,
        adultFilterOnClick,
        setClearAllFilter,
        activeSlowFilters,
        activeSlowFilterOnClick,
    } = useAnimeSlowFilters();

    const {
        typeFilter,
        setTypeFilter,
        sortFilter,
        setSortFilter,
        countryFilter,
        setCountryFilter,
        myFavouriteFilter,
        setFavouriteFilter,
    } = useAnimeFastFilters();

    // fast filters
    const [showFilter, setShowFilter] = useState(false);
    const onClickShowFilter = () => setShowFilter(!showFilter);

    // show adult tag filter only if hentai genre is selected
    const [tagFiltersNoHentai, setTagFiltersNoHentai] = useState(() =>
        tagFilters.filter((tag) => tag.isAdult === false)
    );
    useEffect(() => {
        setTagFiltersNoHentai(tagFilters.filter((tag) => tag.isAdult === false));
    }, [tagFilters]);
    const [displayTagFilters, setDisplayTagFilters] = useState(tagFiltersNoHentai);
    useEffect(() => {
        if (adultFilter.active) {
            setDisplayTagFilters(tagFilters);
        } else {
            setDisplayTagFilters(tagFiltersNoHentai);
        }
    }, [adultFilter, tagFilters, tagFiltersNoHentai]);

    // show hentai genre only if adult tag is selected
    const [genreFiltersNoHentai, setGenreFiltersNoHentai] = useState(() =>
        genreFilters.filter((genre) => genre.isAdult === false)
    );
    useEffect(() => {
        setGenreFiltersNoHentai(genreFilters.filter((genre) => genre.isAdult === false));
    }, [genreFilters]);
    const [displayGenreFilters, setDisplayGenreFilters] = useState(genreFiltersNoHentai);
    useEffect(() => {
        if (adultFilter.active) {
            setDisplayGenreFilters(genreFilters);
        } else {
            setDisplayGenreFilters(genreFiltersNoHentai);
        }
    }, [adultFilter, genreFilters, genreFiltersNoHentai]);

    // clear all filter label
    useEffect(() => {
        setClearAllFilter(activeSlowFilters.filter((item) => item.type !== "clearAll").length >= 3);
    }, [activeSlowFilters, setClearAllFilter]);

    const { setSearchString } = useAnimeSearch();

    return (
        <div className="flex flex-col gap-2">
            <div className="flex h-10 max-h-full w-full flex-row rounded-md bg-gray-500 text-white caret-white">
                <div className="grid h-full w-12 shrink place-items-center text-gray-300">
                    <FaSearch />
                </div>
                <input
                    className="grow bg-transparent py-1 font-semibold focus:outline-none"
                    placeholder="do you want to search something?"
                    onChange={(e) => setSearchString(e.target.value)}
                />
                <div
                    className={tm(
                        "m-2 grid w-12 shrink place-items-center rounded-md hover:cursor-pointer",
                        !showFilter && "bg-gray-600 text-gray-300 hover:bg-gray-400",
                        showFilter && "bg-gray-300 text-gray-600 hover:bg-gray-400"
                    )}
                    onClick={onClickShowFilter}>
                    <TbAdjustmentsHorizontal />
                </div>
            </div>

            <div className="flex flex-row flex-wrap gap-2">
                <BooleanQuickFilter
                    name={myFavouriteFilter.name}
                    onClick={() => setFavouriteFilter(!myFavouriteFilter.active)}
                    active={myFavouriteFilter.active}
                />
                <QuickFilter
                    name={typeFilter.name}
                    onNameClick={(name) => setTypeFilter(name as TypeFilterName)}
                    names={TYPE_FILTER_VALUES}
                />
                <QuickFilter
                    name={countryFilter.name}
                    onNameClick={(name) => setCountryFilter(name as CountryFilterName)}
                    names={COUNTRY_FILTER_VALUES}
                    displayMap={COUNTRT_FILTER_DISPLAY_NAMES}
                />
                <QuickFilter
                    name={sortFilter.name}
                    onNameClick={(name) => setSortFilter(name as SortFilterName)}
                    names={SORT_FILTER_VALUES}
                />
            </div>

            {(activeSlowFilters.length > 0 || showFilter) && (
                <div className=" flex flex-row items-center">
                    <h3 className="my-1 mr-2 font-bold">Active Filters</h3>
                    <FilterPanel filterItems={activeSlowFilters} toggleSelection={activeSlowFilterOnClick} />
                </div>
            )}

            {showFilter && (
                <div className="flex flex-col gap-4 rounded-md border border-black p-2">
                    <FilterPanel title="Misc" filterItems={[adultFilter]} toggleSelection={adultFilterOnClick} />
                    <FilterPanel
                        title="Genres"
                        filterItems={displayGenreFilters}
                        toggleSelection={genreFilterOnClick}
                    />
                    <FilterPanel
                        title="Tags"
                        filterItems={displayTagFilters}
                        toggleSelection={tagFilterOnClick}
                        many={true}
                    />
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
            <dropdown.List className="min-w-full bg-gray-500 text-gray-100">
                {names.map((name) => (
                    <div
                        key={name}
                        className="min-w-full rounded-md px-2 capitalize hover:bg-gray-400"
                        onClick={() => onNameClick(name)}>
                        {displayMap ? displayMap[name] : name.toLowerCase().replaceAll("_", " ")}
                    </div>
                ))}
            </dropdown.List>
        </dropdown.Container>
    );
}

interface BooleanQuickFilterProps extends ComponentPropsWithoutRef<"div"> {
    name: string;
    active: boolean;
}
function BooleanQuickFilter({ name, active, ...rest }: BooleanQuickFilterProps) {
    return (
        <span
            className="rounded-md, flex flex-row items-center justify-center rounded-md bg-gray-500 px-2 py-1 capitalize text-gray-100 hover:cursor-pointer hover:bg-gray-400"
            {...rest}>
            {name.toLowerCase().replaceAll("_", " ")}
            {active ? (
                <MdOutlineRadioButtonChecked className="ml-2 text-gray-300" size="1.2em" />
            ) : (
                <MdOutlineRadioButtonUnchecked className="ml-2 text-gray-300" size="1.2em" />
            )}{" "}
        </span>
    );
}

function FilterPanel<T extends FilterItem>({
    title,
    filterItems,
    toggleSelection,
    many = false,
}: {
    title?: string;
    filterItems: T[];
    toggleSelection: (item: T) => void;
    many?: boolean;
}) {
    return (
        <div className="max-h-fit">
            {title && (
                <>
                    <span className="font-bold">{title}</span>
                    <Separator className="mb-3 h-1" />
                </>
            )}
            <div className={tm(many && "resize-y overflow-y-auto")}>
                <div className={tm("flex flex-row flex-wrap gap-2 text-sm", many && " h-72")}>
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
                "h-fit rounded-md bg-gray-500 px-2 py-1 text-gray-300 hover:cursor-pointer",
                item.active && "bg-gray-600 hover:bg-gray-500",
                !item.active && "bg-gray-500 hover:bg-gray-600",
                !item.active && item.isAdult && "bg-gray-400 hover:bg-gray-600",
                item.type === "clearAll" &&
                    "bg-gray-400 animate-in fade-in-0 slide-in-from-left-8 duration-200 hover:bg-gray-600"
            )}
            onClick={() => toggleSelection(item)}>
            {item.name}
        </span>
    );
}
