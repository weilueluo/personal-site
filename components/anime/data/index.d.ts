export type DataManagement<T>  = [
    loadedData: T[],
    loading: boolean,
    pageInfo: PageInfo,
    loadMore: () => Promise<T[]>,
    deps: any[] // loadMore()'s dependency list
]