import React from "react";

export const AnimeContext = React.createContext({});

export function AnimeProvider({ children }: { children: React.ReactNode }) {
    return <AnimeContext.Provider value={{}}>{children}</AnimeContext.Provider>;
}
