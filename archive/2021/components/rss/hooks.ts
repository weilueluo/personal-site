import { type Dispatch, type SetStateAction, useEffect } from "react";
import { updateDatabase } from "./Database";
import { feeds2flatFeeds } from "./Utils";
import { type FeedsMap, type FlatFeed } from "./RSS.d";



export function useRawFeed2FlatFeed(
    rawFeeds: FeedsMap,
    setFlatFeeds: Dispatch<SetStateAction<FlatFeed[]>>,
) {
    useEffect(() => {
        const flatFeeds = feeds2flatFeeds(rawFeeds);
        setFlatFeeds(flatFeeds);
        updateDatabase(flatFeeds)
    }, [rawFeeds, setFlatFeeds]);
}
