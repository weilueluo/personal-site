import React, { useEffect } from "react";
import { Output } from "rss-parser";
import useSWR from "swr";
import { Updater, useImmer } from "use-immer";
import { RSS_URLS } from "./config";
import { rssFetcher } from "./fetcher";
import { ErrorBoundary } from "react-error-boundary";

const RSSContext = React.createContext<RSSProviderValue>(null!);

export interface FeedResult {
    data?: Output<{}>;
    error: any;
    isLoading: boolean;
    isValidating: boolean;
}

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
            {RSS_URLS.map((url) => (
                <RSSState key={url} url={url} />
            ))}
        </RSSContext.Provider>
    );
}

export function useRSS(): UseFeeds {
    const { feeds } = React.useContext(RSSContext);

    return {
        feeds,
    };
}

function RSSState({ url }: { url: string }) {
    const { data, error, isLoading, isValidating } = useSWR(url, rssFetcher);

    const { setFeeds } = React.useContext(RSSContext);

    useEffect(() => {
        setFeeds((draft) => {
            draft[url] = { data, error, isLoading, isValidating };
        });
    }, [data, error, isLoading, isValidating, setFeeds, url]);

    return <></>;
}
