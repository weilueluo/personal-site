"use client";
import React, { useCallback, useContext, useEffect, useRef } from "react";
import { Item, Output } from "rss-parser";
import useSWR, { KeyedMutator, SWRResponse } from "swr";
import { useImmer } from "use-immer";
import { RSSConfig, RSS_CONFIGS } from "./config";
import { rssFetcher } from "./fetcher";
import { Messages } from "@/shared/i18n/type";

// type for result of using swr to fetch rss feed

export type CustomFeedItem = {
    lastBuildDate?: string; // github has this
    date?: Date;
};
export type FeedResponse = Output<CustomFeedItem>;
export type Feed = Omit<FeedResponse, "items"> & { config: RSSConfig } & { item: Item } & CustomFeedItem;

export type RawFeedResponse = SWRResponse<FeedResponse>;

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
    amount: number;
};

export type FeedInfoMap = Map<keyof Messages, FeedInfo>;

export type MutateMap = Map<string, KeyedMutator<FeedResponse>>;

export interface RSSProviderValue {
    feeds: Feed[];
    addFeeds: (config: RSSConfig, rawFeedResponse: SWRResponse) => void;
    feedInfo: FeedInfoMap;
    rssConfigs: RSSConfig[];
    mutateMap: MutateMap;
}

export interface UseRSS {
    feeds: Feed[];
    infoMap: FeedInfoMap;
    configs: RSSConfig[];
    mutateMap: MutateMap;
}

export interface UseSingleRSS {
    feeds: Feed[];
    info: FeedInfo;
    config: RSSConfig;
    mutate: KeyedMutator<FeedResponse>;
}

const RSSContext = React.createContext<RSSProviderValue>(null!);

const initFeedStatus = new Map(RSS_CONFIGS.map(config => [config.title, { status: FeedStatus.LOADING, amount: 0 }]));
const initMutateMap = new Map(RSS_CONFIGS.map(config => [config.title, () => undefined!]));

export function RSSProvider({ children }: { children: React.ReactNode }) {
    const [feeds, setFeeds] = useImmer<Feed[]>([]);
    const [feedInfo, setFeedInfo] = useImmer<FeedInfoMap>(initFeedStatus);
    const rssConfigs = useRef(RSS_CONFIGS);
    const [mutateMap, setMutateMap] = useImmer<MutateMap>(initMutateMap);

    const addFeeds = useCallback(
        (config: RSSConfig, rawFeedResponse: RawFeedResponse) => {
            const amount = rawFeedResponse?.data?.items?.length || 0;
            setMutateMap(draft => draft.set(config.title, rawFeedResponse.mutate));
            if (rawFeedResponse.error) {
                setFeedInfo(draft => {
                    draft.set(config.title, { status: FeedStatus.ERROR, error: rawFeedResponse.error, amount });
                });
                return;
            }

            if (rawFeedResponse.isLoading) {
                setFeedInfo(draft => {
                    draft.set(config.title, { status: FeedStatus.LOADING, amount });
                });
                return;
            }

            if (rawFeedResponse.isValidating) {
                setFeedInfo(draft => {
                    draft.set(config.title, { status: FeedStatus.VALIDATING, amount });
                });
                return;
            }

            if (rawFeedResponse.data) {
                setFeedInfo(draft => {
                    draft.set(config.title, { status: FeedStatus.PROCESSING, amount });
                });
                const { items: feedItems, ...feedMetadata } = rawFeedResponse.data;
                setFeeds(draft => {
                    draft = draft.filter(feed => feed.config.title !== config.title); // remove existing feeds
                    (feedItems || []).forEach(item => {
                        const dateStr = item.isoDate || item.pubDate || item.lastBuildDate;
                        const date = dateStr ? new Date(dateStr) : undefined;
                        draft.push({ item, config, date, ...feedMetadata }); // add new feeds
                    });
                    return draft;
                });
                setFeedInfo(draft => {
                    draft.set(config.title, { status: FeedStatus.COMPLETED, amount });
                });
            }
        },
        [setFeedInfo, setFeeds, setMutateMap]
    );

    return (
        <RSSContext.Provider value={{ feeds, addFeeds, feedInfo: feedInfo, rssConfigs: rssConfigs.current, mutateMap }}>
            {children}
            {rssConfigs.current.map(rssConfig => (
                <RSSState key={rssConfig.title} config={rssConfig} />
            ))}
        </RSSContext.Provider>
    );
}

export function useSingleRSS(title: keyof Messages): UseSingleRSS {
    const { feeds, feedInfo, rssConfigs, mutateMap } = useContext(RSSContext);
    const configs = rssConfigs.filter(config => config.title === title);
    if (configs.length != 1) {
        throw new Error(`Invalid config for title=${title}`);
    }
    const info = feedInfo.get(title);
    if (!info) {
        throw new Error(`Invalid info for title=${title}`);
    }
    const mutate = mutateMap.get(title);
    if (!mutate) {
        throw new Error(`Invalid mutte for title=${title}`);
    }

    return {
        feeds: feeds.filter(feed => feed.title === title),
        info,
        config: configs[0],
        mutate,
    };
}

export function useRSS(): UseRSS {
    const { feeds, feedInfo, rssConfigs, mutateMap } = useContext(RSSContext);

    return {
        feeds,
        infoMap: feedInfo,
        configs: rssConfigs,
        mutateMap,
    };
}

function RSSState({ config }: { config: RSSConfig }) {
    const { data, isLoading, isValidating, error, mutate } = useSWR(config.url, rssFetcher);
    const mutateRef = useRef(mutate);
    const { addFeeds } = React.useContext(RSSContext);

    useEffect(() => {
        console.log(config.title, { data, isLoading, isValidating, error, mutate: mutateRef.current });

        addFeeds(config, {
            data,
            isLoading,
            isValidating,
            error,
            mutate: mutateRef.current,
        });
    }, [addFeeds, config, data, error, isLoading, isValidating, mutateRef]);

    return <></>;
}
