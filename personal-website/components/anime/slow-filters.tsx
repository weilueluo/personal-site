"use client";

import React, { useEffect } from "react";
import { useImmer } from "use-immer";
import {
    AdultFilter,
    AnimeSlowFilterContextProvider,
    ClearAllFilter,
    GenreFilterItem,
    TagFilterItem,
    useTagsAndGenres,
} from "./context";
import { FilterItem } from "./search";

export default function AnimeSlowFiltersProvider({ children }: { children: React.ReactNode }) {
    const { tags, genres } = useTagsAndGenres();

    // genre filter
    const [genreFilters, setGenreFilters] = useImmer<GenreFilterItem[]>(() => {
        return genres.map((genre) => ({
            name: genre,
            active: false,
            type: "genre",
            isAdult: genre === "Hentai",
        }));
    });
    const genreFilterOnClick = (clickedItem: FilterItem) => {
        setGenreFilters((draft) => {
            const index = draft.findIndex((item) => item.name === clickedItem.name);
            draft[index].active = !draft[index].active;
        });
    };
    // tag filter
    const [tagFilters, setTagFilters] = useImmer<TagFilterItem[]>(() => {
        return tags.map((tag) => ({
            ...tag,
            active: false,
            type: "tag",
        }));
    });
    const tagFilterOnClick = (clickedItem: FilterItem) => {
        setTagFilters((draft) => {
            const index = draft.findIndex((item) => item.name === clickedItem.name);
            draft[index].active = !draft[index].active;
        });
    };
    // adult filter: this could be a faster filter, but hide it in slow filters...
    const [adultFilter, setAdultFilter] = useImmer<AdultFilter>({
        name: "R18",
        active: false,
        type: "adult",
    });
    const adultFilterOnClick = (item: FilterItem) => {
        setAdultFilter((draft) => {
            draft.active = !item.active;
        });
    };
    // clear all filter: special filter that clear all active filters on click
    const [clearAllFilter, setClearAllFilter_] = useImmer<ClearAllFilter>({
        name: "Clear All",
        active: false,
        type: "clearAll",
    });
    const clearAllFilterOnClick = () => {
        activeSlowFilters.forEach((item) => {
            if (item.type !== "clearAll") {
                activeSlowFilterOnClick(item);
            }
        });
    };
    const setClearAllFilter = (active: boolean) => {
        setClearAllFilter_((draft) => {
            draft.active = active;
        });
    };

    // active slow filters
    const [activeSlowFilters, setActiveSlowFilters] = useImmer<FilterItem[]>([]);
    useEffect(() => {
        setActiveSlowFilters(() => {
            const draft = [];
            draft.push(...genreFilters.filter((item) => item.active));
            draft.push(...tagFilters.filter((item) => item.active));
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
            tagFilterOnClick(clickedItem);
        } else if (clickedItem.type === "adult") {
            adultFilterOnClick(clickedItem);
        } else if (clickedItem.type === "clearAll") {
            clearAllFilterOnClick();
        } else {
            console.warn("unknown slow filter type clicked");
        }
    };

    return (
        <AnimeSlowFilterContextProvider
            value={{
                genreFilters,
                tagFilters,
                genreFilterOnClick,
                tagFilterOnClick,
                adultFilter,
                adultFilterOnClick,
                clearAllFilter,
                setClearAllFilter,
                activeSlowFilters,
                activeSlowFilterOnClick,
            }}>
            {children}
        </AnimeSlowFilterContextProvider>
    );
}
