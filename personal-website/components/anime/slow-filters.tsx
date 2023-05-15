import React, { useEffect } from "react";
import { useImmer } from "use-immer";
import { MediaTag } from "./graphql";
import { fetchFilters } from "./query";
import { FilterItem } from "./search";

export interface GenreFilterItem extends FilterItem {}
export interface TagFilterItem extends FilterItem, MediaTag {}

interface AnimeSlowFilterContext {
    genreFilters: GenreFilterItem[];
    tagFilters: TagFilterItem[];
    genreFilterOnClick: (clickedItem: GenreFilterItem) => void;
    tagFilterOnClick: (clickedItem: TagFilterItem) => void;
    activeSlowFilters: FilterItem[];
    activeSlowFilterOnClick: (clickedItem: FilterItem) => void;
}

const AnimeSlowFilterContext = React.createContext<AnimeSlowFilterContext>(null!);

export default function AnimeSlowFiltersProvider({ children }: { children: React.ReactNode }) {
    // genre filter
    const [genreFilters, setGenreFilters] = useImmer<GenreFilterItem[]>([]);
    const genreFilterOnClick = (clickedItem: FilterItem) => {
        setGenreFilters((draft) => {
            const index = draft.findIndex((item) => item.name === clickedItem.name);
            draft[index].active = !draft[index].active;
        });
    };
    // tag filter
    const [tagFilters, setTagFilters] = useImmer<TagFilterItem[]>([]);
    const tagFilterOnClick = (clickedItem: FilterItem) => {
        setTagFilters((draft) => {
            const index = draft.findIndex((item) => item.name === clickedItem.name);
            draft[index].active = !draft[index].active;
        });
    };

    // active slow filters
    const [activeSlowFilters, setActiveSlowFilters] = useImmer<FilterItem[]>([]);
    useEffect(() => {
        setActiveSlowFilters((draft) => {
            draft = [];
            draft.push(...genreFilters.filter((item) => item.active));
            draft.push(...tagFilters.filter((item) => item.active));
            return draft;
        });
    }, [tagFilters, genreFilters, setActiveSlowFilters]);
    const activeSlowFilterOnClick = (clickedItem: FilterItem) => {
        if (clickedItem.type === "genre") {
            genreFilterOnClick(clickedItem);
        } else if (clickedItem.type === "tag") {
            tagFilterOnClick(clickedItem);
        } else {
            console.warn("unknown slow filter type clicked");
        }
    };

    // init filters on mount
    useEffect(() => {
        fetchFilters().then((data) => {
            setGenreFilters(
                data.GenreCollection.map((genre) => ({
                    name: genre,
                    active: false,
                    type: "genre",
                }))
            );
            setTagFilters(
                data.MediaTagCollection.map((tag) => ({
                    ...tag,
                    active: false,
                    type: "tag",
                }))
            );
        });
    }, [setGenreFilters, setTagFilters]);

    return (
        <AnimeSlowFilterContext.Provider
            value={{
                genreFilters,
                tagFilters,
                genreFilterOnClick,
                tagFilterOnClick,
                activeSlowFilters,
                activeSlowFilterOnClick,
            }}>
            {children}
        </AnimeSlowFilterContext.Provider>
    );
}

export function useAnimeSlowFilters(): AnimeSlowFilterContext {
    return React.useContext(AnimeSlowFilterContext);
}
