"use client";

import { BaseCompProps } from "@/shared/types/comp";
import { useCallback, useEffect, useState } from "react";
import { useImmer } from "use-immer";
import { useAdultFilter } from "./filters/adult";
import { useClearAllFilter } from "./filters/clearAll";
import { useCountryFilter } from "./filters/country";
import { useMyFavouriteFilter } from "./filters/favourite";
import { GenreFilterItem } from "./filters/genre";
import { useSortFilter } from "./filters/sort";
import { TagFilterItem } from "./filters/tag";
import { useTypeFilter } from "./filters/type";
import { MediaTag } from "./graphql/graphql";
import { fetchFilters, fetchMyAnimeCollection } from "./graphql/query";
import SearchBar from "./search-bar";
import { SearcherProps, useSearch } from "./searcher";
import SearchResult from "./search-result";

export default function AnimePage(params: BaseCompProps<"div">) {
    const [myAnimeCollection, setMyAnimeCollection] = useState<Set<number>>(() => new Set());
    useEffect(() => {
        fetchMyAnimeCollection(1).then(data => {
            const favSet = new Set<number>();
            data?.data?.forEach(data => {
                data.entries.forEach(data => favSet.add(data.media.id));
            });
            setMyAnimeCollection(favSet);
        });
    }, []);

    const [tagFilters, setTagFilters] = useImmer<TagFilterItem[]>([]);
    const [genreFilters, setGenreFilters] = useImmer<GenreFilterItem[]>([]);
    const setTagFilter = useCallback(
        (tagName: string, active: boolean) => {
            setTagFilters(draft => {
                const index = draft.findIndex(t => t.name === tagName);
                if (index !== -1) {
                    draft[index].active = active;
                } else {
                    console.error(`Tag ${tagName} not found in tagFilters`);
                }
            });
        },
        [setTagFilters]
    );
    const setGenreFilter = useCallback(
        (genre: string, active: boolean) => {
            setGenreFilters(draft => {
                const index = draft.findIndex(t => t.name === genre);
                if (index !== -1) {
                    draft[index].active = active;
                } else {
                    console.error(`Genre ${genre} not found in genreFilters`);
                }
            });
        },
        [setGenreFilters]
    );

    useEffect(() => {
        fetchFilters().then(data => {
            const genres: string[] = [];
            const tags: MediaTag[] = [];
            data.GenreCollection.forEach(genre => genres.push(genre));
            data.MediaTagCollection.forEach(tag => tags.push(tag));

            setTagFilters(
                tags.map(tag => ({
                    ...tag,
                    active: false,
                    type: "tag",
                }))
            );

            setGenreFilters(
                genres.map(genre => ({
                    name: genre,
                    active: false,
                    type: "genre",
                }))
            );

            // return { genres, tags };
        });
    }, [setGenreFilters, setTagFilters]);

    const { myFavouriteFilter, setMyFavouriteFilter } = useMyFavouriteFilter();
    const { clearAllFilter, setClearAllFilter } = useClearAllFilter();
    const { countryFilter, setCountryFilter } = useCountryFilter();
    const { adultFilter, setAdultFilter } = useAdultFilter();
    const { sortFilter, setSortFilter } = useSortFilter();
    const { typeFilter, setTypeFilter } = useTypeFilter();

    // const { tagFilters, setTagFilter } = useTagFilters(tags);
    // const { genreFilters, setGenreFilter } = useGenreFilters(genres);

    const [searchString, setSearchString] = useState<string>("");

    const searcherProps: SearcherProps = {
        searchString,
        countryFilter,
        sortFilter,
        typeFilter,
        myFavouriteFilter,
        tagFilters,
        genreFilters,
        myAnimeCollection,
    };

    const { animeData, pageInfo, rawResponse } = useSearch(searcherProps);

    const searchBarProps = {
        countryFilter,
        setCountryFilter,
        sortFilter,
        setSortFilter,
        typeFilter,
        setTypeFilter,
        myFavouriteFilter,
        setMyFavouriteFilter,
        adultFilter,
        setAdultFilter,
        clearAllFilter,
        setClearAllFilter,
        tagFilters,
        setTagFilter,
        genreFilters,
        setGenreFilter,
        setSearchString,
    };

    const searchResultProps = {
        animeData,
        pageInfo,
        rawResponse,
    };

    // useEffect(() => {
    //     console.log("searchResult", animeData, pageInfo);
    // }, [animeData, pageInfo])

    return (
        <>
            <SearchBar messages={params.messages} locale={params.locale} {...searchBarProps} />
            <SearchResult messages={params.messages} locale={params.locale} {...searchResultProps} />
        </>
    );
}
