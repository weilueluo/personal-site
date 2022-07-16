import { useEffect } from "react";
import { updateDatabase } from "./Database";
import { feeds2flatFeeds } from "./Utils";



export function useRawFeed2FlatFeed(rawFeeds, setFlatFeeds) {
    useEffect(() => {
        const defaultLimit = 10;
        const flatFeeds = feeds2flatFeeds(rawFeeds, defaultLimit);
        setFlatFeeds(flatFeeds);
        updateDatabase(flatFeeds)
    }, [rawFeeds]);
}
