"use client";
import React, { useContext } from "react";
import { SingleUserFeedConfigs, UseUserRSSConfigs, UserConfigsMap } from "./user-config";

export interface UserRSSConfigsContext {
    userConfigs: UserConfigsMap;
    setActive: (title: string, active: boolean) => void;
    setShowRawDate: (showRawDate: boolean) => void;
}

const UserRSSConfigsContext = React.createContext<UserRSSConfigsContext>(null!);

export function UserRSSConfigsContextProvider({
    children,
    value,
}: {
    value: UserRSSConfigsContext;
    children: React.ReactNode;
}) {
    return <UserRSSConfigsContext.Provider value={value}>{children}</UserRSSConfigsContext.Provider>;
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
