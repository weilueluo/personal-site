import { AnimeDetailsProvider } from "@/components/anime/[id]/context";
import { AnimeDetailsPage } from "@/components/anime/[id]/detail-page";
import { fetchMessages } from "@/shared/i18n/translation";
import { BaseParams } from "@/shared/types/comp";

interface Params extends BaseParams {
    id: number;
}
interface PageProps {
    params: Params | Promise<Params>;
    children: React.ReactNode;
}

export default async function Page({ params }: PageProps) {
    const { locale, id } = await params;
    const messages = await fetchMessages(locale);

    return (
        <AnimeDetailsProvider animeId={id} messages={messages} locale={locale}>
            <AnimeDetailsPage messages={messages} locale={locale} />
        </AnimeDetailsProvider>
    );
}
