import { AnimeFastFiltersProvider } from "@/components/anime/fast-filters";
import { AnimeSearchProvider } from "@/components/anime/search";
import AnimeSlowFiltersProvider from "@/components/anime/slow-filters";
import SearchBar from "./search-bar";
import SearchResult from "./search-result";
import { TagsAndGenresProvider, MyAnimeCollectionProvider } from "@/components/anime/collections";

// TODO: fix: do not use async server component
// TODO: feat: add searches & tags & genres to url search params

export default function Page() {
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
