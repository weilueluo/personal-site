import { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import { MediaTag } from "../graphql/graphql";
import { fetchFilters } from "../graphql/query";
import { AdultFilter } from "./adult";
import { FilterItem, SameClickable } from "./common";

export interface GenreFilterItem extends FilterItem {}

export interface TagFilterItem extends Omit<FilterItem, "isAdult">, MediaTag {}

export function useTagAndGenreFilters(): {
    tagFilters: SameClickable<TagFilterItem>[];
    genreFilters: SameClickable<GenreFilterItem>[];
} {
    const [tagFilters, setTagFilters] = useImmer<SameClickable<TagFilterItem>[]>([]);
    const [genreFilters, setGenreFilters] = useImmer<SameClickable<GenreFilterItem>[]>([]);

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
                    onClick: tag => {
                        setTagFilters(draft => {
                            const index = draft.findIndex(t => t.name === tag.name);
                            if (index !== -1) {
                                draft[index].active = !draft[index].active;
                            } else {
                                console.error(`Tag ${tag.name} not found in tagFilters`);
                            }
                        });
                    },
                }))
            );

            setGenreFilters(
                genres.map(genre => ({
                    name: genre,
                    active: false,
                    type: "genre",
                    isAdult: genre === "Hentai",
                    onClick: () => {
                        setGenreFilters(draft => {
                            const index = draft.findIndex(g => g.name === genre);
                            if (index !== -1) {
                                draft[index].active = !draft[index].active;
                            } else {
                                console.error(`Genre ${genre} not found in tagFilters`);
                            }
                        });
                    },
                }))
            );
        });
    }, [setGenreFilters, setTagFilters]);

    return { tagFilters, genreFilters } as {
        tagFilters: SameClickable<TagFilterItem>[];
        genreFilters: SameClickable<GenreFilterItem>[];
    };
}

function getDisplayFilters<T extends FilterItem>(filters: SameClickable<T>[], adultFilter: AdultFilter) {
    if (adultFilter.active) {
        return filters;
    } else {
        return filters.filter(filter => filter.isAdult === false);
    }
}

export function useDisplayTagFilters(tagFilters: SameClickable<TagFilterItem>[], adultFilter: AdultFilter) {
    const [displayTagFilters, setDisplayTagFilters] = useState(() => getDisplayFilters(tagFilters, adultFilter));
    useEffect(() => {
        setDisplayTagFilters(getDisplayFilters(tagFilters, adultFilter));
    }, [adultFilter, tagFilters]);

    return displayTagFilters;
}

export function useDisplayGenreFilters(genreFilters: SameClickable<GenreFilterItem>[], adultFilter: AdultFilter) {
    const [displayGenreFilters, setDisplayGenreFilters] = useState(getDisplayFilters(genreFilters, adultFilter));
    useEffect(() => {
        setDisplayGenreFilters(getDisplayFilters(genreFilters, adultFilter));
    }, [adultFilter, genreFilters]);

    return displayGenreFilters;
}
