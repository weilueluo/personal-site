"use client";
import React, { useContext, useEffect } from "react";
import { Output } from "rss-parser";
import useSWR from "swr";
import { Updater, useImmer } from "use-immer";
import { RSSConfig, RSS_URLS as RSS_CONFIGS } from "./config";
import { rssFetcher } from "./fetcher";

const RSSContext = React.createContext<RSSProviderValue>(null!);

export type FeedResult = {
    data?: Output<{}>;
    error: any;
    isLoading: boolean;
    isValidating: boolean;
} & RSSConfig;

export type Feeds = Record<string, FeedResult>;

export interface RSSProviderValue {
    feeds: Feeds;
    setFeeds: Updater<Feeds>;
}

export interface UseFeeds {
    feeds: Feeds;
}

export function RSSProvider({ children }: { children: React.ReactNode }) {
    const [feeds, setFeeds] = useImmer<Feeds>({});

    return (
        <RSSContext.Provider value={{ feeds, setFeeds }}>
            {children}
            {RSS_CONFIGS.map((rssConfig) => (
                <RSSState key={rssConfig.title} config={rssConfig} />
            ))}
        </RSSContext.Provider>
    );
}

export function useRSS(): UseFeeds {
    const { feeds } = useContext(RSSContext);

    return {
        feeds,
    };
}

function RSSState({ config }: { config: RSSConfig }) {
    const { data, error, isLoading, isValidating } = useSWR(config.url, rssFetcher);

    const { setFeeds } = React.useContext(RSSContext);

    useEffect(() => {
        setFeeds((draft) => {
            draft[config.title] = { data, error, isLoading, isValidating, ...config };
        });
    }, [data, error, isLoading, isValidating, setFeeds, config]);

    return <></>;
}
