import { EMPTY_ARRAY } from "../../common/constants";
import { INIT_PAGE_INFO } from "./common";
import { fetchFavouriteAnimeData } from "./favourites";

// for pre-rendering on server side
async function slowlyFetchAllFavAnimeData() {
    const favAnimeData = []
    let pageInfo = INIT_PAGE_INFO
    while (pageInfo.hasNextPage) {
        const response = await fetchFavouriteAnimeData(pageInfo.currentPage + 1);
        pageInfo = response?.User?.favourites?.anime?.pageInfo || INIT_PAGE_INFO
        const newData = response?.User?.favourites?.anime?.nodes || []
        favAnimeData.push(...newData);

        // wait before proceeding to fetch next page to avoid server blocking us
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    return favAnimeData
}

export async function slowlyFetchAllAnimeData() {
    return slowlyFetchAllFavAnimeData()
}

export function extractCoverImageURLs(coverImage: { medium?: string, large?: string }): string[] {
    if (!coverImage) {
        return EMPTY_ARRAY;
    }

    let urls = []
    coverImage && coverImage.medium && urls.push(coverImage.medium);
    coverImage && coverImage.large && urls.push(coverImage.large);

    return urls;
}