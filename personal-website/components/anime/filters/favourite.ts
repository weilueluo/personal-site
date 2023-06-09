"use client";

import { useImmer } from "use-immer";

export type MyFavoriteFilterName = "FAVOURITES";

export interface MyFavoriteFilter {
    name: MyFavoriteFilterName;
    active: boolean;
}

export function useMyFavouriteFilter() {
    const [myFavouriteFilter, setMyFavouriteFilterInternal] = useImmer<MyFavoriteFilter>({
        name: "FAVOURITES",
        active: false,
    });
    const setMyFavouriteFilter = (active: boolean) => {
        setMyFavouriteFilterInternal(draft => {
            draft.active = active;
        });
    };

    return {
        myFavouriteFilter,
        setMyFavouriteFilter,
    };
}
