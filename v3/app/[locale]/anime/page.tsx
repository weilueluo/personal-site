import AnimePage from "@/components/anime/page";
import { fetchMessages } from "@/shared/i18n/translation";
import { BasePageProps } from "@/shared/types/comp";

// TODO: feat: add searches & tags & genres to url search params

export default async function Page({ params }: BasePageProps) {
    const messages = await fetchMessages(params.locale);

    return <AnimePage messages={messages} locale={params.locale} />;
}
