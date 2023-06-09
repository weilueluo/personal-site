"use client";

import { useImmer } from "use-immer";
import { FilterItem } from "../search";

export interface ClearAllFilter extends FilterItem {}

export function useClearAllFilter() {
    const [clearAllFilter, setClearAllFilterInternal] = useImmer<ClearAllFilter>({
        name: "Clear All",
        active: false,
        type: "clearAll",
    });

    const setClearAllFilter = (active: boolean) => {
        setClearAllFilterInternal(draft => {
            draft.active = active;
        });
    };

    return {
        clearAllFilter,
        setClearAllFilter,
    };
}
