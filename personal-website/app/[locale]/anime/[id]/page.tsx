import { AnimeDetailsProvider } from "@/components/anime/[id]/context";
import { AnimeDetailsPage } from "@/components/anime/[id]/detail-page";
import { fetchMessages } from "@/shared/i18n/translation";
import { BaseParams } from "@/shared/types/comp";

interface Params extends BaseParams {
    id: number;
}
interface PageProps {
    params: Params;
    children: React.ReactNode;
}

export default async function Page({ params }: PageProps) {
    const messages = await fetchMessages(params.locale);

    return (
        <AnimeDetailsProvider animeId={params.id} messages={messages} locale={params.locale}>
            <AnimeDetailsPage messages={messages} locale={params.locale} />
        </AnimeDetailsProvider>
    );
}
