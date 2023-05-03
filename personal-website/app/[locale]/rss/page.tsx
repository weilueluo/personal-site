"use client";

import { RSSProvider } from "@/components/rss/manager";
import CanvasLayout from "@/components/three/layout";
import { ErrorBoundary } from "react-error-boundary";
import RSS from "./rss";
import { UserRSSConfigsProvider } from "./user-config";

export default function RSSPage() {
    return (
        <CanvasLayout>
            <RSSLayout>
                <RSS />
            </RSSLayout>
        </CanvasLayout>
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
