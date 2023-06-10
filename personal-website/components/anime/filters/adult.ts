"use client";

import { useImmer } from "use-immer";
import { FilterItem, SameClickable } from "./common";

export interface AdultFilter extends FilterItem {}

export function useAdultFilter(): SameClickable<AdultFilter> {
    const [adultFilter, setAdultFilterInternal] = useImmer<SameClickable<AdultFilter>>({
        name: "R18",
        active: false,
        type: "adult",
        onClick: filter => {
            setAdultFilterInternal(draft => {
                draft.active = !filter.active;
            });
        },
    });

    return adultFilter;
}
