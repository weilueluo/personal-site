import React, { useContext } from "react";
import { fetchMyAnimeCollection } from "./query";
import { MyAnimeCollectionContext, MyAnimeCollectionContextProvider } from "./context";

export async function MyAnimeCollectionProvider({ children }: { children: React.ReactNode }) {
    const favSet = new Set<number>();
    await fetchMyAnimeCollection(1).then((data) => {
        data?.data?.forEach((data) => {
            data.entries.forEach((data) => favSet.add(data.media.id));
        });
    });

    return (
        <MyAnimeCollectionContextProvider
            value={{
                favourites: Array.from(favSet),
            }}>
            {children}
        </MyAnimeCollectionContextProvider>
    );
}

export function useMyAnimeCollection() {
    return useContext(MyAnimeCollectionContext);
}
