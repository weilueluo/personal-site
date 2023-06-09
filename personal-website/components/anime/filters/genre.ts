"use client";

import { useImmer } from "use-immer";
import { FilterItem } from "../search";

export interface GenreFilterItem extends FilterItem {}

export function useGenreFilters(genres: string[]) {
    const [genreFilters, setGenreFilters] = useImmer<GenreFilterItem[]>(() => {
        return genres.map(genre => ({
            name: genre,
            active: false,
            type: "genre",
            isAdult: genre === "Hentai",
        }));
    });

    const setGenreFilter = (genre: string, active: boolean) => {
        setGenreFilters(draft => {
            const index = draft.findIndex(t => t.name === genre);
            if (index !== -1) {
                draft[index].active = active;
            } else {
                console.error(`Genre ${genre} not found in genreFilters`);
            }
        });
    };

    return {
        genreFilters,
        setGenreFilter,
    };
}
