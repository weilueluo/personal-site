"use client";
import {
    COUNTRY_FILTER_VALUES,
    CountryFilterName,
    FILTER_NAMES,
    FILTER_NAME_DISPLAY_MAP,
    SORT_FILTER_VALUES,
    SortFilterName,
    TYPE_FILTER_VALUES,
    TypeFilterName,
    useAnimeFastFilters,
} from "@/components/anime/fast-filters";
import { FilterItem, useAnimeSearch } from "@/components/anime/search";
import * as dropdown from "@/components/ui/dropdown";
import { SeparatedList } from "@/components/ui/separator";
import { FormattedMessage, formattedMessage } from "@/shared/i18n/translation";
import { BaseCompProps } from "@/shared/types/comp";
import { tm } from "@/shared/utils";
import React, { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa/index";
import { MdExpandMore, MdOutlineRadioButtonChecked, MdOutlineRadioButtonUnchecked } from "react-icons/md/index";
import { TbAdjustmentsHorizontal } from "react-icons/tb/index";
import { useAnimeSlowFilters } from "./context";

export default function SearchBar({ messages, locale, className, ...rest }: BaseCompProps<"div">) {
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
                <div
                    className={tm(
                        "icon-text std-pad hover:bg-button-std hover:std-hover shrink hover:cursor-pointer"
                        // !showFilter && "border border-red-200",
                        // showFilter && "border border-black"
                    )}
                    onClick={onClickShowFilter}>
                    <TbAdjustmentsHorizontal />
                    <FormattedMessage id="anime.search.settings" messages={messages} />
                </div>
            </div>

            <div className="flex flex-row flex-wrap md:gap-2">
                <BooleanQuickFilter
                    name={myFavouriteFilter.name}
                    onClick={() => setFavouriteFilter(!myFavouriteFilter.active)}
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
