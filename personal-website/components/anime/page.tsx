"use client";

import { FormattedMessage, formattedMessage } from "@/shared/i18n/translation";
import { BaseCompProps } from "@/shared/types/comp";
import { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useImmer } from "use-immer";
import Separator, { SeparatedList } from "../ui/separator";
import { useAdultFilter } from "./filters/adult";
import { useClearAllFilter } from "./filters/clearAll";
import { BooleanQuickFilter, FilterPanel, QuickFilter, SearchSettings } from "./filters/components";
import { COUNTRY_FILTER_VALUES, CountryFilterName, useCountryFilter } from "./filters/country";
import { useAnimeCollection, useMyFavouriteFilter } from "./filters/favourite";

import { SameClickable } from "./filters/common";
import { SORT_FILTER_VALUES, SortFilterName, useSortFilter } from "./filters/sort";
import { useDisplayGenreFilters, useDisplayTagFilters, useTagAndGenreFilters } from "./filters/tag-and-genre";
import { TYPE_FILTER_VALUES, TypeFilterName, useTypeFilter } from "./filters/type";
import SearchResult from "./search-result";
import { useSearch } from "./searcher";

export default function AnimePage({ messages, locale }: BaseCompProps<"div">) {
    const myAnimeCollection = useAnimeCollection();

    const { tagFilters, genreFilters } = useTagAndGenreFilters();
    const myFavouriteFilter = useMyFavouriteFilter();
    const clearAllFilter = useClearAllFilter();
    const countryFilter = useCountryFilter();
    const adultFilter = useAdultFilter();
    const sortFilter = useSortFilter();
    const typeFilter = useTypeFilter();

    const [searchString, setSearchString] = useState<string>("");

    const { animeData, pageInfo, rawResponse } = useSearch({
        searchString,
        countryFilter,
        sortFilter,
        typeFilter,
        myFavouriteFilter,
        tagFilters,
        genreFilters,
        myAnimeCollection,
    });

    const [showFilter, setShowFilter] = useState(false);
    const onClickShowFilter = () => setShowFilter(!showFilter);

    // slow filters: just means those that are not directly under the search bar, need to click on the settings to show
    const [activeSlowFilters, setActiveSlowFilters] = useImmer<SameClickable<any>[]>([]);
    useEffect(() => {
        setActiveSlowFilters(() => {
            const draft: SameClickable<any>[] = [];
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
    const activeSlowFilterOnClick = (clickedItem: SameClickable<any>) => {
        if (clickedItem.type === "clearAll") {
            // special case for clear all filter: clear all filters
            clickedItem.onClick(activeSlowFilters);
        } else {
            clickedItem.onClick(clickedItem);
        }
    };

    // clear all filter label
    useEffect(() => {
        clearAllFilter.setActive(activeSlowFilters.filter(item => item.type !== "clearAll").length >= 3);
    }, [activeSlowFilters, clearAllFilter]);

    const displayTagFilters = useDisplayTagFilters(tagFilters, adultFilter);
    const displayGenreFilters = useDisplayGenreFilters(genreFilters, adultFilter);

    return (
        <>
            {/* search bar */}
            <div className="flex flex-col gap-2">
                {/* 1st row search input */}
                <div className="flex h-8 max-h-full w-full flex-row justify-between md:h-10">
                    <SearchIcon />
                    <SearchInput messages={messages} setSearchString={setSearchString} locale={locale} />
                    <SearchSettings messages={messages} onClickShowFilter={onClickShowFilter} locale={locale} />
                </div>
                {/* 2nd row quick filters */}
                <div className="flex flex-row flex-wrap justify-between md:justify-start md:gap-2">
                    <BooleanQuickFilter
                        name={myFavouriteFilter.name}
                        onClick={() => myFavouriteFilter.onClick(myFavouriteFilter)}
                        active={myFavouriteFilter.active}
                        messages={messages}
                        locale={locale}
                    />
                    <QuickFilter
                        name={typeFilter.name}
                        onNameClick={name => typeFilter.onClick(name as TypeFilterName)}
                        names={TYPE_FILTER_VALUES}
                        messages={messages}
                        locale={locale}
                    />
                    <QuickFilter
                        name={countryFilter.name}
                        onNameClick={name => countryFilter.onClick(name as CountryFilterName)}
                        names={COUNTRY_FILTER_VALUES}
                        messages={messages}
                        locale={locale}
                    />
                    <QuickFilter
                        name={sortFilter.name}
                        onNameClick={name => sortFilter.onClick(name as SortFilterName)}
                        names={SORT_FILTER_VALUES}
                        messages={messages}
                        locale={locale}
                    />
                </div>
                <Separator size="sm" />

                {/* 3rd row active slow filters */}
                {(activeSlowFilters.length > 0 || showFilter) && (
                    <div className=" flex flex-row items-center">
                        <h3 className="my-1 mr-2 font-bold">
                            <FormattedMessage id="anime.search.filter.active_filters" messages={messages} />
                        </h3>
                        <FilterPanel filterItems={activeSlowFilters} toggleSelection={activeSlowFilterOnClick} />
                    </div>
                )}

                {/* 4th row settings panel which shows slow filters */}
                {showFilter && (
                    <div className="flex flex-col gap-2 border border-black p-2">
                        <SeparatedList>
                            <FilterPanel
                                title={formattedMessage(messages, "anime.search.filter.meta")}
                                filterItems={[adultFilter]}
                                toggleSelection={item => item.onClick(item)}
                            />
                            <FilterPanel
                                title={formattedMessage(messages, "anime.search.filter.genres")}
                                filterItems={displayGenreFilters}
                                toggleSelection={item => item.onClick(item)}
                            />
                            <FilterPanel
                                title={formattedMessage(messages, "anime.search.filter.tags")}
                                filterItems={displayTagFilters}
                                toggleSelection={item => item.onClick(item)}
                                many={true}
                            />
                        </SeparatedList>
                    </div>
                )}
            </div>
            <SearchResult
                messages={messages}
                locale={locale}
                animeData={animeData}
                pageInfo={pageInfo}
                rawResponse={rawResponse}
            />
        </>
    );
}

function SearchIcon() {
    return (
        <div className="hover:std-hover std-pad grid h-full shrink place-items-center">
            <FaSearch className="std-icon" />
        </div>
    );
}

interface SearchInputProps extends BaseCompProps<"form"> {
    setSearchString: (searchString: string) => void;
}

function SearchInput({ setSearchString, messages }: SearchInputProps) {
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
        <form onSubmit={e => handleOnSubmit(e)} className="mx-1 flex grow items-center">
            <input
                ref={searchBarRef}
                className="std-text-size w-full bg-transparent font-semibold focus:outline-none"
                placeholder={placeholder}
                onChange={e => handleOnSubmit(e)}
                onFocus={() => setSearchBarFocused(true)}
                onBlur={() => setSearchBarFocused(false)}
            />
        </form>
    );
}
