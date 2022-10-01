import { useEffect } from "react";
import { updateDatabase } from "./Database";
import { feeds2flatFeeds } from "./Utils";



export function useRawFeed2FlatFeed(rawFeeds, setFlatFeeds) {
    useEffect(() => {
        const flatFeeds = feeds2flatFeeds(rawFeeds);
        setFlatFeeds(flatFeeds);
        updateDatabase(flatFeeds)
    }, [rawFeeds, setFlatFeeds]);
}
