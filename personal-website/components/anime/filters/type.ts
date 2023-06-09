"use client";

import { useImmer } from "use-immer";

export type TypeFilterName = "ANIME" | "MANGA" | "ANY";
export interface TypeFilter {
    name: TypeFilterName;
}
export const TYPE_FILTER_VALUES: TypeFilterName[] = ["ANIME", "MANGA", "ANY"];
export const TYPE_FILTER: TypeFilter = {
    name: "ANIME",
};

export function useTypeFilter() {
    const [typeFilter, setTypeFilterInteral] = useImmer<TypeFilter>(TYPE_FILTER);
    const setTypeFilter = (type: TypeFilterName) => {
        setTypeFilterInteral(draft => {
            if (TYPE_FILTER_VALUES.includes(type)) {
                draft.name = type;
            } else {
                console.warn(`Invalid type filter name: ${type}`);
            }
        });
    };

    return {
        typeFilter,
        setTypeFilter,
    };
}
