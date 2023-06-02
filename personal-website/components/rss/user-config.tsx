"use client";
import { RSSConfig } from "@/components/rss/config";
import { useRSS } from "@/components/rss/manager";
import React from "react";
import { useImmer } from "use-immer";
import { UserRSSConfigsContextProvider } from "./context";

export interface FeedConfigs {
    active: boolean;
}
export type PerFeedConfigs = { [title: string]: FeedConfigs };

export interface FeedItemConfigs {}
export type PerFeedItemConfigs = { [uniqueId: string]: FeedItemConfigs };

export interface GlobalConfigs {
    showRawDate: boolean;
}

export interface SingleUserFeedConfigs extends FeedConfigs {
    setActive: (title: string, active: boolean) => void;
    setShowRawDate: (showRawDate: boolean) => void;
}

export interface UserConfigsMap {
    globalConfigs: GlobalConfigs;
    perFeedConfigs: PerFeedConfigs;
    perFeedItemConfigs: PerFeedItemConfigs;
}

export interface UseUserRSSConfigs {
    userConfigs: UserConfigsMap;
    setActive: (title: string, active: boolean) => void;
    setShowRawDate: (showRawDate: boolean) => void;
}

function initUserConfigs(rssConfigs: RSSConfig[]): UserConfigsMap {
    const perFeedConfigs: PerFeedConfigs = {};
    const perFeedItemConfigs: PerFeedItemConfigs = {};
    const configs: UserConfigsMap = {
        globalConfigs: { showRawDate: false },
        perFeedConfigs,
        perFeedItemConfigs,
    };

    rssConfigs.forEach((rssConfig) => (perFeedConfigs[rssConfig.title] = { active: true }));

    return configs;
}

export function UserRSSConfigsProvider({ children }: { children: React.ReactNode }) {
    const { configs: rssConfigs } = useRSS();
    const [userConfigs, setUserConfigs] = useImmer<UserConfigsMap>(() => initUserConfigs(rssConfigs));

    const setActive = (feedTitle: string, active: boolean) => {
        setUserConfigs((draft) => {
            if (feedTitle in draft.perFeedConfigs) {
                draft.perFeedConfigs[feedTitle].active = active;
            } else {
                console.error(`feed title not found to update active status: ${feedTitle}`);
            }
        });
    };

    const setShowRawDate = () => {
        setUserConfigs((draft) => {
            draft.globalConfigs.showRawDate = !draft.globalConfigs.showRawDate;
        });
    };

    return (
        <UserRSSConfigsContextProvider value={{ userConfigs, setActive, setShowRawDate }}>
            {children}
        </UserRSSConfigsContextProvider>
    );
}
