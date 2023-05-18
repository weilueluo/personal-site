"use client";
import {
    useAnimeFastFilters,
    TypeFilterName,
    TYPE_FILTER_VALUES,
    SortFilterName,
    SORT_FILTER_VALUES,
    CountryFilterName,
    COUNTRY_FILTER_VALUES,
    COUNTRT_FILTER_DISPLAY_NAMES,
} from "@/components/anime/fast-filters";
import { FilterItem, useAnimeSearch } from "@/components/anime/search";
import { useAnimeSlowFilters } from "@/components/anime/slow-filters";
import dropdown from "@/components/ui/dropdown";
import { tm } from "@/shared/utils";
import { ComponentPropsWithoutRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdExpandMore, MdRadioButtonChecked, MdRadioButtonUnchecked } from "react-icons/md";
import { TbAdjustmentsHorizontal } from "react-icons/tb";

export default function SearchBar() {
    const {
        genreFilters,
        genreFilterOnClick,
        tagFilters,
        tagFilterOnClick,
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
        setMyFavouriteFilter,
        favouriteActive,
    } = useAnimeFastFilters();

    // fast filters
    const [showFilter, setShowFilter] = useState(false);
    const onClickShowFilter = () => setShowFilter(!showFilter);

    const { setSearchString } = useAnimeSearch();

    return (
        <div className="flex flex-col gap-2">
            <div className="flex h-10 w-full flex-row rounded-md bg-gray-500 text-white caret-white">
                <div className="grid h-full w-12 place-items-center text-black">
                    <FaSearch />
                </div>
                <input
                    className="h-full grow bg-transparent py-1 focus:outline-none"
                    placeholder="search term"
                    onChange={(e) => setSearchString(e.target.value)}
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
                <BooleanQuickFilter
                    name={myFavouriteFilter.name}
                    onClick={() => setMyFavouriteFilter(!favouriteActive)}
                    active={favouriteActive}
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
            {active ? <MdRadioButtonChecked className="ml-2" /> : <MdRadioButtonUnchecked className="ml-2" />}
        </span>
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
