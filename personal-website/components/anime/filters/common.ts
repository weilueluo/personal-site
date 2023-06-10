export type FilterType = "genre" | "tag" | "type" | "adult" | "clearAll";

export interface FilterItem {
    name: string;
    active: boolean;
    type: FilterType;
    isAdult?: boolean;
}

export type Clickable<T, N> = T & {
    onClick: (n: N) => void;
};

export type SameClickable<T> = Clickable<T, T>;
