import ShaderHeader from "@/components/shader/ShaderHeader";
import ShaderRenderer from "@/components/shader/ShaderRenderer";
import { fetchMessages } from "@/shared/i18n/translation";
import { BasePageProps } from "@/shared/types/comp";

export default async function Page({ params }: BasePageProps) {
    const { locale } = await params;
    const messages = await fetchMessages(locale);

    if (!messages) return null;

    return (
        <>
            <ShaderHeader messages={messages} locale={locale} />
            <ShaderRenderer messages={messages} locale={locale} />
        </>
    );
}
