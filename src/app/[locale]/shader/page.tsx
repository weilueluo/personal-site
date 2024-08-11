import ShaderHeader from "@/components/shader/ShaderHeader";
import { fetchMessages } from "@/shared/i18n/translation";
import { BasePageProps } from "@/shared/types/comp";

export default async function Page({ params, children }: BasePageProps) {
    const messages = await fetchMessages(params.locale);

    if (!messages) return null;

    return (
        <>
            <ShaderHeader messages={messages} locale={params.locale} />
        </>
    );
}
