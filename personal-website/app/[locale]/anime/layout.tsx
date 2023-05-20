import { MyAnimeCollectionProvider, TagsAndGenresProvider } from "@/components/anime/collections";
import { AnimeFastFiltersProvider } from "@/components/anime/fast-filters";
import { AnimeSearchProvider } from "@/components/anime/search";
import AnimeSlowFiltersProvider from "@/components/anime/slow-filters";

export default function AnimeLayout({
    searchBar,
    searchResult,
    children
}: {
    searchBar: React.ReactNode;
    searchResult: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        // @ts-ignore async server component
        <MyAnimeCollectionProvider>
            {/* @ts-ignore async server component */}
            <TagsAndGenresProvider>
                <AnimeFastFiltersProvider>
                    <AnimeSlowFiltersProvider>
                        <AnimeSearchProvider>
                            {searchBar}
                            {searchResult}
                            {children}
                        </AnimeSearchProvider>
                    </AnimeSlowFiltersProvider>
                </AnimeFastFiltersProvider>
            </TagsAndGenresProvider>
        </MyAnimeCollectionProvider>
    );
}
