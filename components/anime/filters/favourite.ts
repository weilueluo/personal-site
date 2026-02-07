"use client";

import { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import { fetchMyAnimeCollection } from "../graphql/query";
import { SameClickable } from "./common";

export type MyFavoriteFilterName = "FAVOURITES";

export interface MyFavoriteFilter {
    name: MyFavoriteFilterName;
    active: boolean;
}

export function useMyFavouriteFilter(): SameClickable<MyFavoriteFilter> {
    const [myFavouriteFilter, setMyFavouriteFilterInternal] = useImmer<SameClickable<MyFavoriteFilter>>({
        name: "FAVOURITES",
        active: false,
        onClick: (filter: MyFavoriteFilter) => {
            setMyFavouriteFilterInternal(draft => {
                draft.active = !filter.active;
            });
        },
    });

    return myFavouriteFilter;
}

export function useAnimeCollection() {
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

    return myAnimeCollection;
}
