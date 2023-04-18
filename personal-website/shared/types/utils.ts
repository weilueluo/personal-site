export type Nullable<T> = T | undefined | null;
export type ExcludeFalseable<T> = Exclude<T, undefined | null | 0 | false>;