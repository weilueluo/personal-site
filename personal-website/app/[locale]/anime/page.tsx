import { MyAnimeCollectionProvider, TagsAndGenresProvider } from "@/components/anime/collections";
import { AnimeFastFiltersProvider } from "@/components/anime/fast-filters";
import { AnimeSearchProvider } from "@/components/anime/search";
import SearchBar from "@/components/anime/search-bar";
import SearchResult from "@/components/anime/search-result";
import AnimeSlowFiltersProvider from "@/components/anime/slow-filters";
import { fetchMessages } from "@/shared/i18n/translation";
import { BasePageProps } from "@/shared/types/comp";

// TODO: fix: do not use async server component
// TODO: feat: add searches & tags & genres to url search params

export default async function Page({ params }: BasePageProps) {
    const messages = await fetchMessages(params.locale);
    return (
        // @ts-ignore async server component
        <MyAnimeCollectionProvider>
            {/* @ts-ignore async server component */}
            <TagsAndGenresProvider>
                <AnimeFastFiltersProvider>
                    <AnimeSlowFiltersProvider>
                        <AnimeSearchProvider>
                            <SearchBar messages={messages} locale={params.locale} />
                            <SearchResult messages={messages} locale={params.locale} />
                        </AnimeSearchProvider>
                    </AnimeSlowFiltersProvider>
                </AnimeFastFiltersProvider>
            </TagsAndGenresProvider>
        </MyAnimeCollectionProvider>
    );
}
