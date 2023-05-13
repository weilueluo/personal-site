// this file wrap query.ts for swr

import { SectionMedia } from "./graphql";
import { Page, fetchFavouritesPage, fetchSearchPage } from "./query";

export const favouriteAnimeFetcher = async (pageKey: Promise<number>) => {
    const page = await pageKey;
    return fetchFavouritesPage(page);
};

export const getAnilistKey = (prevPage: number, prevData: Page<SectionMedia[]>) => {
    if (prevData && !prevData.pageInfo?.hasNextPage) {
        return null;
    }
    if (!prevPage) {
        return 1;
    }
    return prevPage + 1;
};
