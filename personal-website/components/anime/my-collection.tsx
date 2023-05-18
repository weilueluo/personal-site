import React, { useContext, useEffect } from "react";
import { fetchMyAnimeCollection } from "./query";

const MyAnimeCollectionContext = React.createContext({});

interface MyAnimeCollectionContext {}

export function MyAnimeCollectionProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        fetchMyAnimeCollection(1).then((data) => {
            console.log("data", data);
        });
    });

    return <MyAnimeCollectionContext.Provider value={{}}>{children}</MyAnimeCollectionContext.Provider>;
}

export function useMyAnimeCollection() {
    return useContext(MyAnimeCollectionContext);
}
