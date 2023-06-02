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
import dropdown from "@/components/ui/dropdown";
import { SeparatedList } from "@/components/ui/separator";
import { useAnimeSlowFilters } from "@/shared/contexts/anime";
import { tm } from "@/shared/utils";
import React, { ComponentPropsWithoutRef, useEffect, useRef, useState } from "react";
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
    const [tagFiltersNoHentai, setTagFiltersNoHentai] = useState(() => tagFilters.filter(tag => tag.isAdult === false));
    useEffect(() => {
        setTagFiltersNoHentai(tagFilters.filter(tag => tag.isAdult === false));
    }, [tagFilters]);
    const [displayTagFilters, setDisplayTagFilters] = useState(tagFiltersNoHentai);
    useEffect(() => {
        if (adultFilter.active) {
            setDisplayTagFilters(tagFilters);
        } else {
            setDisplayTagFilters(tagFiltersNoHentai);
        }
    }, [adultFilter, tagFilters, tagFiltersNoHentai]);

    // show hentai genre only if R18 meta tag is selected
    const [genreFiltersNoHentai, setGenreFiltersNoHentai] = useState(() =>
        genreFilters.filter(genre => genre.isAdult === false)
    );
    useEffect(() => {
        setGenreFiltersNoHentai(genreFilters.filter(genre => genre.isAdult === false));
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
        setClearAllFilter(activeSlowFilters.filter(item => item.type !== "clearAll").length >= 3);
    }, [activeSlowFilters, setClearAllFilter]);

    // search bar stuff
    const { setSearchString } = useAnimeSearch();
    const searchBarRef = useRef<HTMLInputElement>(null);
    const handleOnSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (searchBarRef.current) {
            setSearchString(searchBarRef.current.value);
        }
    };

    const [placeholder, setPlaceholder] = useState("what anime do you like?");
    const [searchBarFocused, setSearchBarFocused] = useState(false);

    useEffect(() => {
        if (searchBarFocused) {
            setPlaceholder("");
        } else {
            setPlaceholder("what anime do you like?");
        }
    }, [searchBarFocused]);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex h-8 max-h-full w-full flex-row border-b border-black pb-1 md:h-10">
                <div
                    className="hover:std-hover grid h-full w-12 shrink place-items-center"
                    onClick={e => handleOnSubmit(e)}>
                    <FaSearch />
                </div>
                <form onSubmit={e => handleOnSubmit(e)} className="mx-1 flex grow items-center bg-transparent">
                    <input
                        ref={searchBarRef}
                        className="w-full font-semibold focus:outline-none"
                        placeholder={placeholder}
                        onChange={e => handleOnSubmit(e)}
                        onFocus={() => setSearchBarFocused(true)}
                        onBlur={() => setSearchBarFocused(false)}
                    />
                </form>
                <div
                    className={tm(
                        "icon-text std-pad hover:bg-button-std hover:std-hover shrink hover:cursor-pointer"
                        // !showFilter && "border border-red-200",
                        // showFilter && "border border-black"
                    )}
                    onClick={onClickShowFilter}>
                    <TbAdjustmentsHorizontal />
                    Settings
                </div>
            </div>

            <div className="flex flex-row flex-wrap md:gap-2">
                <BooleanQuickFilter
                    name={myFavouriteFilter.name}
                    onClick={() => setFavouriteFilter(!myFavouriteFilter.active)}
                    active={myFavouriteFilter.active}
                />
                <QuickFilter
                    name={typeFilter.name}
                    onNameClick={name => setTypeFilter(name as TypeFilterName)}
                    names={TYPE_FILTER_VALUES}
                />
                <QuickFilter
                    name={countryFilter.name}
                    onNameClick={name => setCountryFilter(name as CountryFilterName)}
                    names={COUNTRY_FILTER_VALUES}
                    displayMap={COUNTRT_FILTER_DISPLAY_NAMES}
                />
                <QuickFilter
                    name={sortFilter.name}
                    onNameClick={name => setSortFilter(name as SortFilterName)}
                    names={SORT_FILTER_VALUES}
                />
            </div>

            {(activeSlowFilters.length > 0 || showFilter) && (
                <div className=" flex flex-row items-center">
                    <h3 className="my-1 mr-2 font-bold">Active Filters:</h3>
                    <FilterPanel filterItems={activeSlowFilters} toggleSelection={activeSlowFilterOnClick} />
                </div>
            )}

            {showFilter && (
                <div className="flex flex-col gap-2 border border-black p-2">
                    <SeparatedList>
                        <FilterPanel title="Meta" filterItems={[adultFilter]} toggleSelection={adultFilterOnClick} />
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
                    </SeparatedList>
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
            <span className="std-hover std-pad std-text-size flex flex-row items-center justify-center gap-1 capitalize">
                <MdExpandMore className="inline-block" />
                {displayMap ? displayMap[name] : name.toLowerCase().replaceAll("_", " ")}
            </span>
            <dropdown.Dropdown variant="glass">
                {names.map(name => (
                    <div key={name} className="std-hover min-w-full px-2 capitalize" onClick={() => onNameClick(name)}>
                        {displayMap ? displayMap[name] : name.toLowerCase().replaceAll("_", " ")}
                    </div>
                ))}
            </dropdown.Dropdown>
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
            className="std-hover std-pad std-text-size flex flex-row items-center justify-center gap-1 capitalize"
            {...rest}>
            {active ? <MdOutlineRadioButtonChecked /> : <MdOutlineRadioButtonUnchecked />}
            {name.toLowerCase().replaceAll("_", " ")}
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
        <div className="flex max-h-fit flex-col gap-2">
            {title && (
                <>
                    <span className="font-semibold">{title}</span>
                </>
            )}
            <div className={tm(many && "resize-y overflow-y-auto")}>
                <div className={tm("flex flex-row flex-wrap gap-2 text-sm", many && "h-72")}>
                    {filterItems.map(item => (
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
                "std-pad std-hover h-fit bg-gray-500 text-gray-300",
                // item.active && "bg-gray-600 hover:bg-gray-500",
                // !item.active && "bg-gray-500 hover:bg-gray-600",
                !item.active && item.isAdult && "opacity-75",
                item.type === "clearAll" &&
                    "bg-gray-400 animate-in fade-in-0 slide-in-from-left-8 duration-200 hover:bg-gray-600"
            )}
            onClick={() => toggleSelection(item)}>
            {item.name}
        </span>
    );
}
