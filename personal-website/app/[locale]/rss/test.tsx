"use client";

import { RSSProvider, useRSS } from "@/components/rss/manager";
import { sanitize } from "dompurify";
import { ErrorBoundary } from "react-error-boundary";

export default function TestRSS() {
    // console.log("feeds", feeds);

    return (
        <ErrorBoundary fallback={<span>Provider Error</span>}>
            <RSSProvider>
                <ErrorBoundary fallback={<span>TestRSS Error</span>}>
                    <RSS />
                </ErrorBoundary>
            </RSSProvider>
        </ErrorBoundary>
    );
}

function RSS() {
    const { feeds } = useRSS();

    return (
        <>
            {Object.entries(feeds).map(([url, feed]) => {
                const data = feed.data;

                if (feed.isLoading) {
                    return <span key={url}>loading</span>;
                }
                if (feed.error) {
                    return <span key={url}>error: {feed.error}</span>;
                }

                console.log(`loading RSS, url=${url}, data=${JSON.stringify(data)}`);

                return (
                    <div key={url}>
                        <h3>{data?.title}</h3>
                        <ul>
                            {data?.items.map((item) => (
                                <li
                                    key={item.guid || item.link}
                                    dangerouslySetInnerHTML={{ __html: sanitize(item.content || "") }}></li>
                            ))}
                        </ul>
                    </div>
                );
            })}
        </>
    );
}
