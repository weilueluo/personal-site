"use client";

import { useImmer } from "use-immer";
import { Clickable, FilterItem, SameClickable } from "./common";

export interface ClearAllFilter extends FilterItem {
    setActive: (active: boolean) => void;
}

export function useClearAllFilter(): Clickable<ClearAllFilter, SameClickable<FilterItem>[]> {
    const [clearAllFilter, setClearAllFilterInternal] = useImmer<
        Clickable<ClearAllFilter, SameClickable<FilterItem>[]>
    >({
        name: "Clear All",
        active: false,
        type: "clearAll",
        setActive: active =>
            setClearAllFilterInternal(draft => {
                draft.active = active;
            }),
        onClick: (filters: SameClickable<FilterItem>[]) => {
            filters.forEach(filter => {
                if (filter.name === "Clear All") {
                    (filter as unknown as ClearAllFilter).setActive(false);
                } else {
                    filter.onClick(filter);
                }
            });
        },
    });

    return clearAllFilter;
}
