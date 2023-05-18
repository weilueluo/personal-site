import { AnimeFastFiltersProvider } from "@/components/anime/fast-filters";
import { MyAnimeCollectionProvider } from "@/components/anime/my-collection";
import { AnimeSearchProvider } from "@/components/anime/search";
import AnimeSlowFiltersProvider from "@/components/anime/slow-filters";
import SearchBar from "./search-bar";
import SearchResult from "./search-result";

export default function Anime() {
    // return <CardList getKey={getFavouriteAnimeKey} fetcher={favouriteAnimeFetcher} title="Favourites" />;
    // TODO: move search term handling to search provider

    return (
        // @ts-ignore async server component
        <MyAnimeCollectionProvider>
            <AnimeFastFiltersProvider>
                <AnimeSlowFiltersProvider>
                    <AnimeSearchProvider>
                        <SearchBar />
                        <SearchResult />
                    </AnimeSearchProvider>
                </AnimeSlowFiltersProvider>
            </AnimeFastFiltersProvider>
        </MyAnimeCollectionProvider>
    );
}
