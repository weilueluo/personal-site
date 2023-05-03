import { useRSS } from "@/components/rss/manager";
import React, { useCallback, useContext, useState } from "react";
import { useImmer } from "use-immer";

export interface UserConfig {
    active: boolean;
}

export interface SingleUserFeedConfigs extends UserConfig {
    setActive: (title: string, active: boolean) => void;
}

export interface UserConfigMap {
    [title: string]: UserConfig;
}

export interface UseUserRSSConfigs {
    userConfigs: UserConfigMap;
    setActive: (title: string, active: boolean) => void;
}

export interface UserRSSConfigsContext {
    userConfigs: UserConfigMap;
    setActive: (title: string, active: boolean) => void;
}

const UserRSSConfigsContext = React.createContext<UserRSSConfigsContext>(null!);

export function UserRSSConfigsProvider({ children }: { children: React.ReactNode }) {
    const { configs: systemConfigs } = useRSS();
    const initUserConfigs = useCallback(() => {
        const configs: UserConfigMap = {};
        systemConfigs.forEach((sysConfig) => (configs[sysConfig.title] = { active: true }));
        return configs;
    }, [systemConfigs]);
    const [userConfigs, setUserConfigs] = useImmer<UserConfigMap>(initUserConfigs);

    const setActive = useCallback(
        (title: string, active: boolean) => {
            setUserConfigs((draft) => {
                if (title in draft) {
                    draft[title].active = active;
                } else {
                    console.error(`title not found to update active status: ${title}`);
                }
            });
        },
        [setUserConfigs]
    );

    return (
        <UserRSSConfigsContext.Provider value={{ userConfigs, setActive }}>{children}</UserRSSConfigsContext.Provider>
    );
}

export function useUserRSSConfigs(): UseUserRSSConfigs {
    return useContext(UserRSSConfigsContext);
}

export function useSingleUserFeedConfigs(title: string): SingleUserFeedConfigs {
    const { userConfigs, setActive } = useContext(UserRSSConfigsContext);
    const { active } = userConfigs[title];
    return {
        active,
        setActive,
    };
}
