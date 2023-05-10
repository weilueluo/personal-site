// this file wrap query.ts for swr

import { fetchFavouritesPage } from "./query";

export const favouriteAnimeFetcher = async (i: Promise<number>) => {
    const page = await i;
    return fetchFavouritesPage(page);
};
