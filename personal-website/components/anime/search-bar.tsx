"use client";

import { FilterItem } from "@/components/anime/search";
import * as dropdown from "@/components/ui/dropdown";
import { SeparatedList } from "@/components/ui/separator";
import { FormattedMessage, formattedMessage } from "@/shared/i18n/translation";
import { BaseCompProps } from "@/shared/types/comp";
import { tm } from "@/shared/utils";
import React, { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa/index";
import { MdExpandMore, MdOutlineRadioButtonChecked, MdOutlineRadioButtonUnchecked } from "react-icons/md/index";
import { TbAdjustmentsHorizontal } from "react-icons/tb/index";
import { useImmer } from "use-immer";
import IconedText from "../ui/icon-text";
import { FILTER_NAMES, FILTER_NAME_DISPLAY_MAP } from "./fast-filters";
import { AdultFilter } from "./filters/adult";
import { COUNTRY_FILTER_VALUES, CountryFilter, CountryFilterName } from "./filters/country";
import { MyFavoriteFilter } from "./filters/favourite";
import { GenreFilterItem } from "./filters/genre";
import { SORT_FILTER_VALUES, SortFilter, SortFilterName } from "./filters/sort";
import { TagFilterItem } from "./filters/tag";
import { TYPE_FILTER_VALUES, TypeFilter, TypeFilterName } from "./filters/type";

export interface SearchBarProps extends BaseCompProps<"div"> {
    countryFilter: CountryFilter;
    setCountryFilter: (name: CountryFilterName) => void;
    sortFilter: SortFilter;
    setSortFilter: (name: SortFilterName) => void;
    typeFilter: TypeFilter;
    setTypeFilter: (name: TypeFilterName) => void;
    myFavouriteFilter: MyFavoriteFilter;
    setMyFavouriteFilter: (active: boolean) => void;
    tagFilters: TagFilterItem[];
    setTagFilter: (name: string, active: boolean) => void;
    genreFilters: GenreFilterItem[];
    setGenreFilter: (name: string, active: boolean) => void;
    adultFilter: AdultFilter;
    setAdultFilter: (active: boolean) => void;
    clearAllFilter: FilterItem;
    setClearAllFilter: (active: boolean) => void;
    setSearchString: (searchString: string) => void;
}

function useDisplayTagFilters(tagFilters: TagFilterItem[], adultFilter: AdultFilter) {
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

    return displayTagFilters;
}

function useDisplayGenreFilters(genreFilters: GenreFilterItem[], adultFilter: AdultFilter) {
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

    return displayGenreFilters;
}

export default function SearchBar({
    messages,
    locale,
    className,
    countryFilter,
    setCountryFilter,
    sortFilter,
    setSortFilter,
    typeFilter,
    setTypeFilter,
    myFavouriteFilter,
    setMyFavouriteFilter,
    tagFilters,
    setTagFilter,
    genreFilters,
    setGenreFilter,
    adultFilter,
    setAdultFilter,
    clearAllFilter,
    setClearAllFilter,
    setSearchString,
    ...rest
}: SearchBarProps) {
    const [showFilter, setShowFilter] = useState(false);
    const onClickShowFilter = () => setShowFilter(!showFilter);

    const displayTagFilters = useDisplayTagFilters(tagFilters, adultFilter);
    const displayGenreFilters = useDisplayGenreFilters(genreFilters, adultFilter);

    const adultFilterOnClick = () => setAdultFilter(!adultFilter.active);
    const genreFilterOnClick = (clickedItem: GenreFilterItem) => setGenreFilter(clickedItem.name, !clickedItem.active);
    const tagFilterOnClick = (clickedItem: TagFilterItem) => setTagFilter(clickedItem.name, !clickedItem.active);
    const myFavouriteFilterOnClick = () => setMyFavouriteFilter(!myFavouriteFilter.active);
    const clearAllFilterOnClick = () => setClearAllFilter(!clearAllFilter.active);

    // slow filters: just means those that are not directly under the search bar, need to click on the settings to show
    const [activeSlowFilters, setActiveSlowFilters] = useImmer<FilterItem[]>([]);
    useEffect(() => {
        setActiveSlowFilters(() => {
            const draft = [];
            draft.push(...genreFilters.filter(item => item.active));
            draft.push(...tagFilters.filter(item => item.active));
            if (adultFilter.active) {
                draft.push(adultFilter);
            }
            if (clearAllFilter.active) {
                draft.push(clearAllFilter);
            }
            return draft;
        });
    }, [tagFilters, genreFilters, adultFilter, clearAllFilter, setActiveSlowFilters]);
    const activeSlowFilterOnClick = (clickedItem: FilterItem) => {
        if (clickedItem.type === "genre") {
            genreFilterOnClick(clickedItem);
        } else if (clickedItem.type === "tag") {
            tagFilterOnClick(clickedItem as TagFilterItem);
        } else if (clickedItem.type === "adult") {
            adultFilterOnClick();
        } else if (clickedItem.type === "clearAll") {
            clearAllFilterOnClick();
        } else {
            console.warn("unknown slow filter type clicked");
        }
    };

    // clear all filter label
    useEffect(() => {
        setClearAllFilter(activeSlowFilters.filter(item => item.type !== "clearAll").length >= 3);
    }, [activeSlowFilters, setClearAllFilter]);

    // search bar stuff
    const searchBarRef = useRef<HTMLInputElement>(null);
    const handleOnSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (searchBarRef.current) {
            setSearchString(searchBarRef.current.value);
        }
    };

    const [placeholder, setPlaceholder] = useState(formattedMessage(messages, "anime.search.placeholder"));
    const [searchBarFocused, setSearchBarFocused] = useState(false);
    useEffect(() => {
        if (searchBarFocused) {
            setPlaceholder("");
        } else {
            setPlaceholder(formattedMessage(messages, "anime.search.placeholder"));
        }
    }, [searchBarFocused, messages]);

    return (
        <div className={tm("flex flex-col gap-2", className)} {...rest}>
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
                <IconedText onClick={onClickShowFilter}>
                    <TbAdjustmentsHorizontal />
                    <FormattedMessage id="anime.search.settings" messages={messages} />
                </IconedText>
            </div>

            <div className="flex flex-row flex-wrap md:gap-2">
                <BooleanQuickFilter
                    name={myFavouriteFilter.name}
                    onClick={() => myFavouriteFilterOnClick()}
                    active={myFavouriteFilter.active}
                    messages={messages}
                    locale={locale}
                />
                <QuickFilter
                    name={typeFilter.name}
                    onNameClick={name => setTypeFilter(name as TypeFilterName)}
                    names={TYPE_FILTER_VALUES}
                    messages={messages}
                    locale={locale}
                />
                <QuickFilter
                    name={countryFilter.name}
                    onNameClick={name => setCountryFilter(name as CountryFilterName)}
                    names={COUNTRY_FILTER_VALUES}
                    messages={messages}
                    locale={locale}
                />
                <QuickFilter
                    name={sortFilter.name}
                    onNameClick={name => setSortFilter(name as SortFilterName)}
                    names={SORT_FILTER_VALUES}
                    messages={messages}
                    locale={locale}
                />
            </div>

            {(activeSlowFilters.length > 0 || showFilter) && (
                <div className=" flex flex-row items-center">
                    <h3 className="my-1 mr-2 font-bold">
                        <FormattedMessage id="anime.search.filter.active_filters" messages={messages} />
                    </h3>
                    <FilterPanel filterItems={activeSlowFilters} toggleSelection={activeSlowFilterOnClick} />
                </div>
            )}

            {showFilter && (
                <div className="flex flex-col gap-2 border border-black p-2">
                    <SeparatedList>
                        <FilterPanel
                            title={formattedMessage(messages, "anime.search.filter.meta")}
                            filterItems={[adultFilter]}
                            toggleSelection={adultFilterOnClick}
                        />
                        <FilterPanel
                            title={formattedMessage(messages, "anime.search.filter.genres")}
                            filterItems={displayGenreFilters}
                            toggleSelection={genreFilterOnClick}
                        />
                        <FilterPanel
                            title={formattedMessage(messages, "anime.search.filter.tags")}
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

interface QuickFilterProps<T> extends BaseCompProps<"span"> {
    name: T;
    names: T[];
    onNameClick: (name: T) => void;
}

function QuickFilter<T extends FILTER_NAMES>({
    name,
    onNameClick,
    names,
    className,
    messages,
    ...rest
}: QuickFilterProps<T>) {
    return (
        <dropdown.Container>
            <span
                className={tm(
                    "std-hover std-pad std-text-size flex flex-row items-center justify-center gap-1 capitalize",
                    className
                )}
                {...rest}>
                <MdExpandMore className="inline-block" />
                <FormattedMessage id={FILTER_NAME_DISPLAY_MAP[name]} messages={messages} />
            </span>
            <dropdown.Dropdown variant="glass">
                {names.map(name => (
                    <div key={name} className="std-hover min-w-full px-2 capitalize" onClick={() => onNameClick(name)}>
                        <FormattedMessage id={FILTER_NAME_DISPLAY_MAP[name]} messages={messages} />
                    </div>
                ))}
            </dropdown.Dropdown>
        </dropdown.Container>
    );
}

interface BooleanQuickFilterProps extends BaseCompProps<"span"> {
    name: FILTER_NAMES;
    active: boolean;
}
function BooleanQuickFilter({ name, active, messages, ...rest }: BooleanQuickFilterProps) {
    return (
        <span
            className="std-hover std-pad std-text-size flex flex-row items-center justify-center gap-1 capitalize"
            {...rest}>
            {active ? <MdOutlineRadioButtonChecked /> : <MdOutlineRadioButtonUnchecked />}
            <FormattedMessage id={FILTER_NAME_DISPLAY_MAP[name]} messages={messages} />
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
