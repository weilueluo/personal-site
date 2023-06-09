"use client";

import { useImmer } from "use-immer";
import { MediaTag } from "../graphql/graphql";
import { FilterItem } from "../search";

export interface TagFilterItem extends Omit<FilterItem, "isAdult">, MediaTag {}

export function useTagFilters(tags: MediaTag[]) {
    const [tagFilters, setTagFilters] = useImmer<TagFilterItem[]>(() => {
        return tags.map(tag => ({
            ...tag,
            active: false,
            type: "tag",
        }));
    });

    const setTagFilter = (tagName: string, active: boolean) => {
        setTagFilters(draft => {
            const index = draft.findIndex(t => t.name === tagName);
            if (index !== -1) {
                draft[index].active = active;
            } else {
                console.error(`Tag ${tagName} not found in tagFilters`);
            }
        });
    };

    return {
        tagFilters,
        setTagFilter,
    };
}
