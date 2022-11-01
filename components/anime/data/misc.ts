import { useState, useEffect } from "react";
import { EMPTY_ARRAY, LOADING_IMAGE_PATH } from "../../common/constants";
import { useFavouritesFetching } from "./hooks";
import { fetchFavouritesPage, fetchMediaList, INIT_PAGE_INFO } from "./request";

export function useSequentiallyLoadedImageURL(urls: string[]): [string, number] {
    urls = (urls && urls.filter(url => url && url.trim() != '')) || [];

    const [imageURL, setImageURL] = useState(LOADING_IMAGE_PATH);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index >= urls.length) {
            return;
        }
        fetchImageAsLocalUrl(urls[index])
            .then(localUrl => setImageURL(localUrl))
            .then(() => setIndex(index + 1))
            .catch(error => `failed to load image: ${urls[index]}, error=${error}`)
    }, [index, urls])

    return [imageURL, index];
}


export async function fetchImageAsLocalUrl(url: string) {
    return fetch(url)
            .then(res => res.blob())
            .then(imageBlob => URL.createObjectURL(imageBlob))
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


async function getAllFavourites() {
    const allData = []
    let pageInfo = INIT_PAGE_INFO
    while (pageInfo && pageInfo.hasNextPage) {
        const response = await fetchFavouritesPage(pageInfo.currentPage + 1);
        allData.push(...response.data)
        pageInfo = response.pageInfo
    }
    return allData;
}

async function getAllMediaList() {
    const allData = []
    let pageInfo = INIT_PAGE_INFO
    while(pageInfo && pageInfo.hasNextPage) {
        const response = await fetchMediaList(pageInfo.currentPage + 1);
        pageInfo = response?.pageInfo;
        allData.push(...response.data)
    }

    return allData
}


export async function getAllAnime() {
    return [...await getAllFavourites(), ...await getAllMediaList()];
}