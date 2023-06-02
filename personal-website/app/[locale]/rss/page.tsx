import { RSSProvider } from "@/components/rss/manager";
import { ErrorBoundary } from "react-error-boundary";
import { UserRSSConfigsProvider } from "../../../components/rss/user-config";
import RSS from "./rss";

export default function RSSPage() {
    return (
        <RSSLayout>
            <RSS />
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
