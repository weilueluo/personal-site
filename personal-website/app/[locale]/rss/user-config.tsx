import { RSSConfig } from "@/components/rss/config";
import { useRSS } from "@/components/rss/manager";
import React, { useCallback, useContext } from "react";
import { useImmer } from "use-immer";

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

export interface UserRSSConfigsContext {
    userConfigs: UserConfigsMap;
    setActive: (title: string, active: boolean) => void;
    setShowRawDate: (showRawDate: boolean) => void;
}

const UserRSSConfigsContext = React.createContext<UserRSSConfigsContext>(null!);

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

    const setActive = useCallback(
        (feedTitle: string, active: boolean) => {
            setUserConfigs((draft) => {
                if (feedTitle in draft.perFeedConfigs) {
                    draft.perFeedConfigs[feedTitle].active = active;
                } else {
                    console.error(`feed title not found to update active status: ${feedTitle}`);
                }
            });
        },
        [setUserConfigs]
    );

    const setShowRawDate = useCallback(
        (showRawDate: boolean) => {
            setUserConfigs((draft) => {
                draft.globalConfigs.showRawDate = !draft.globalConfigs.showRawDate;
            });
        },
        [setUserConfigs]
    );

    return (
        <UserRSSConfigsContext.Provider value={{ userConfigs, setActive, setShowRawDate }}>
            {children}
        </UserRSSConfigsContext.Provider>
    );
}

export function useUserRSSConfigs(): UseUserRSSConfigs {
    return useContext(UserRSSConfigsContext);
}

export function useSingleUserFeedConfigs(title: string): SingleUserFeedConfigs {
    const { userConfigs, setActive, setShowRawDate } = useContext(UserRSSConfigsContext);
    const { active } = userConfigs.perFeedConfigs[title];
    return {
        active,
        setActive,
        setShowRawDate,
    };
}
