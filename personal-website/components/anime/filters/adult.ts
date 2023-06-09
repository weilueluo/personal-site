"use client";

import { useImmer } from "use-immer";
import { FilterItem } from "../search";

export interface AdultFilter extends FilterItem {}

export function useAdultFilter() {
    const [adultFilter, setAdultFilterInternal] = useImmer<AdultFilter>({
        name: "R18",
        active: false,
        type: "adult",
    });

    const setAdultFilter = (active: boolean) => {
        setAdultFilterInternal(draft => {
            draft.active = active;
        });
    };

    return {
        adultFilter,
        setAdultFilter,
    };
}
