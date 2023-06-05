// import { RSSProvider } from "@/components/rss/manager";
import { ErrorBoundary } from "react-error-boundary";
// import { UserRSSConfigsProvider } from "@/components/rss/user-config";
// import RSS from "./rss";
import { fetchMessages } from "@/shared/i18n/translation";
import { BasePageProps } from "@/shared/types/comp";
import dynamic from "next/dynamic";

const RSSProvider = dynamic(() => import("@/components/rss/manager"), {
    ssr: false,
});

const UserRSSConfigsProvider = dynamic(() => import("@/components/rss/user-config"), {
    ssr: false,
});

const RSS = dynamic(() => import("./rss"), {
    ssr: false,
});

export default async function RSSPage({ params }: BasePageProps) {
    const messages = await fetchMessages(params.locale);

    return (
        <RSSLayout>
            <RSS messages={messages} locale={params.locale} />
        </RSSLayout>
    );
}

function RSSLayout({ children }: { children: React.ReactNode }) {
    return (
        <ErrorBoundary fallback={<span>Unexpected RSS Error</span>}>
            <RSSProvider>
                <UserRSSConfigsProvider>{children}</UserRSSConfigsProvider>
            </RSSProvider>
        </ErrorBoundary>
    );
}
