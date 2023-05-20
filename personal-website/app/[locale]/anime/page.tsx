import { AnimeFastFiltersProvider } from "@/components/anime/fast-filters";
import { AnimeSearchProvider } from "@/components/anime/search";
import AnimeSlowFiltersProvider from "@/components/anime/slow-filters";
import SearchBar from "./search-bar";
import SearchResult from "./search-result";
import { MyAnimeCollectionProvider, TagsAndGenresProvider } from "@/components/anime/collections";

export default function Anime() {
    // return <CardList getKey={getFavouriteAnimeKey} fetcher={favouriteAnimeFetcher} title="Favourites" />;
    // TODO: move search term handling to search provider

    return (
        // @ts-ignore async server component
        <MyAnimeCollectionProvider>
            {/* @ts-ignore async server component */}
            <TagsAndGenresProvider>
                <AnimeFastFiltersProvider>
                    <AnimeSlowFiltersProvider>
                        <AnimeSearchProvider>
                            <SearchBar />
                            <SearchResult />
                        </AnimeSearchProvider>
                    </AnimeSlowFiltersProvider>
                </AnimeFastFiltersProvider>
            </TagsAndGenresProvider>
        </MyAnimeCollectionProvider>
    );
}
