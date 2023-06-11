"use client";

import { useImmer } from "use-immer";
import { Clickable } from "./common";

export type TypeFilterName = "ANIME" | "MANGA" | "ANY";
export interface TypeFilter {
    name: TypeFilterName;
}
export const TYPE_FILTER_VALUES: TypeFilterName[] = ["ANIME", "MANGA", "ANY"];

export function useTypeFilter(): Clickable<TypeFilter, TypeFilterName> {
    const [typeFilter, setTypeFilterInteral] = useImmer<Clickable<TypeFilter, TypeFilterName>>({
        name: "ANIME",
        onClick: (name: TypeFilterName) => {
            setTypeFilterInteral(draft => {
                if (TYPE_FILTER_VALUES.includes(name)) {
                    draft.name = name;
                } else {
                    console.warn(`Invalid type filter name: ${name}`);
                }
            });
        },
    });

    return typeFilter;
}
