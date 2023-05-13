// this file wrap query.ts for swr

import { SectionMedia } from "./graphql";
import { Page, fetchFavouritesPage } from "./query";

export const favouriteAnimeFetcher = async (pageKey: Promise<number>) => {
    const page = await pageKey;
    return fetchFavouritesPage(page);
};
export const getFavouriteAnimeKey = (prevPage: number, prevData: Page<SectionMedia[]>) => {
    // console.log(`getNextFavPage i=${prevPage}, prev=${prevData}`);
    // console.log(prevData);

    if (prevData && !prevData.pageInfo?.hasNextPage) {
        return null;
    }
    if (!prevPage) {
        return 1;
    }
    return prevPage + 1;
};
