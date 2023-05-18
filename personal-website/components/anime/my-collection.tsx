import React, { useContext } from "react";
import { fetchMyAnimeCollection } from "./query";
import { MyAnimeCollectionContext } from "./context";

export async function MyAnimeCollectionProvider({ children }: { children: React.ReactNode }) {
    const favSet = new Set<number>();
    await fetchMyAnimeCollection(1).then((data) => {
        console.log("fetchMyFavAnimeCollection", data);

        data?.data?.forEach((data) => {
            data.entries.forEach((data) => favSet.add(data.media.id));
        });
    });

    return (
        <MyAnimeCollectionContext.Provider
            value={{
                favourites: Array.from(favSet),
            }}>
            {children}
        </MyAnimeCollectionContext.Provider>
    );
}

export function useMyAnimeCollection() {
    return useContext(MyAnimeCollectionContext);
}
