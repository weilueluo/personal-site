"use client";
import { enableMapSet } from "immer";
import React, { useCallback, useContext, useEffect, useRef } from "react";
import { Item, Output } from "rss-parser";
import useSWR from "swr";
import { useImmer } from "use-immer";
import { RSSConfig, RSS_CONFIGS } from "./config";
import { rssFetcher } from "./fetcher";

enableMapSet();

// type for result of using swr to fetch rss feed

export type CustomFeedItem = {
    lastBuildDate?: string;  // github has this
};
export type FeedResponse = Output<CustomFeedItem>;
export type Feed = Omit<FeedResponse, "items"> & { config: RSSConfig } & { item: Item } & CustomFeedItem;

export type RawFeedResponse = {
    data?: FeedResponse;
    error: any;
    isLoading: boolean;
    isValidating: boolean;
};

export const enum FeedStatus {
    COMPLETED = "COMPLETED",
    ERROR = "ERROR",
    LOADING = "LOADING",
    VALIDATING = "VALIDATING",
    PROCESSING = "PROCESSING",
}

export type FeedInfo = {
    status: FeedStatus;
    error?: Error;
};

export type FeedInfoMap = Map<string, FeedInfo>;

export interface RSSProviderValue {
    feeds: Feed[];
    addFeeds: (config: RSSConfig, rawFeedResponse: RawFeedResponse) => void;
    feedInfo: FeedInfoMap;
    rssConfigs: RSSConfig[];
}

export interface UseFeeds {
    feeds: Feed[];
    feedInfo: FeedInfoMap;
    rssConfigs: RSSConfig[];
}

const RSSContext = React.createContext<RSSProviderValue>(null!);

const initFeedStatus = new Map(RSS_CONFIGS.map((config) => [config.title, { status: FeedStatus.LOADING }]));

export function RSSProvider({ children }: { children: React.ReactNode }) {
    const [feeds, setFeeds] = useImmer<Feed[]>([]);
    const [feedStatus, setFeedStatus] = useImmer<FeedInfoMap>(initFeedStatus);
    const rssConfigs = useRef(RSS_CONFIGS);

    const addFeeds = useCallback(
        (config: RSSConfig, rawFeedResponse: RawFeedResponse) => {
            // map raw feed response to flat feed
            if (rawFeedResponse.error) {
                setFeedStatus((draft) => {
                    draft.set(config.title, { status: FeedStatus.ERROR, error: rawFeedResponse.error });
                });
                return;
            }

            if (rawFeedResponse.isLoading) {
                setFeedStatus((draft) => {
                    draft.set(config.title, { status: FeedStatus.LOADING });
                });
                return;
            }

            if (rawFeedResponse.isValidating) {
                setFeedStatus((draft) => {
                    draft.set(config.title, { status: FeedStatus.VALIDATING });
                });
                return;
            }

            if (rawFeedResponse.data) {
                setFeedStatus((draft) => {
                    draft.set(config.title, { status: FeedStatus.PROCESSING });
                });
                const { items, ...rest } = rawFeedResponse.data;
                const feeds = (items || []).map((item) => ({ item, config, ...rest }));
                setFeeds((draft) => {
                    draft.push(...feeds);
                });
                setFeedStatus((draft) => {
                    draft.set(config.title, { status: FeedStatus.COMPLETED });
                });
            }
        },
        [setFeedStatus, setFeeds]
    );

    return (
        <RSSContext.Provider value={{ feeds, addFeeds, feedInfo: feedStatus, rssConfigs: rssConfigs.current }}>
            {children}
            {rssConfigs.current.map((rssConfig) => (
                <RSSState key={rssConfig.title} config={rssConfig} />
            ))}
        </RSSContext.Provider>
    );
}

export function useRSS(): UseFeeds {
    const { feeds, feedInfo: feedStatus, rssConfigs } = useContext(RSSContext);

    return {
        feeds,
        feedInfo: feedStatus,
        rssConfigs,
    };
}

function RSSState({ config }: { config: RSSConfig }) {
    const { data, error, isLoading, isValidating } = useSWR(config.url, rssFetcher);

    const { addFeeds } = React.useContext(RSSContext);

    useEffect(() => {
        console.log(config.title, { data, error, isLoading, isValidating });

        addFeeds(config, { data, error, isLoading, isValidating });
    }, [addFeeds, config, data, error, isLoading, isValidating]);

    return <></>;
}
