import { fetchMessages } from "@/shared/i18n/translation";
import { BasePageProps } from "@/shared/types/comp";
import RSSClient from "./rss-client";

export default async function RSSPage({ params }: BasePageProps) {
    const { locale } = await params;
    const messages = await fetchMessages(locale);

    return <RSSClient messages={messages} locale={locale} />;
}
