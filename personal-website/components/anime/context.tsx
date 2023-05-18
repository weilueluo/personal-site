import React from "react";

export interface MyAnimeCollectionContext {
    favourites: number[];
}

export const MyAnimeCollectionContext = React.createContext<MyAnimeCollectionContext>({
    favourites: [],
});
