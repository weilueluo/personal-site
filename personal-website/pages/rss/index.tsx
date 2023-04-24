import { RSS_URLS } from "@/components/rss/config";
import { RSSProvider, useRSS } from "@/components/rss/manager";
import Common from "@/components/three/common";
import Room from "@/components/three/objects/room";
import View from "@/components/three/view";
import { OrbitControls } from "@react-three/drei";
import { sanitize } from "dompurify";
import { Suspense, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default function RSSPage() {
    useEffect(() => {
        RSS_URLS.forEach((url) => {});
    }, []);

    return (
        <>
            <div>
                <h3>Hello RSS Feed</h3>
            </div>

            <ErrorBoundary fallback={<span>Provider Error</span>}>
                <RSSProvider>
                    <ErrorBoundary fallback={<span>TestRSS Error</span>}>
                        <TestRSS />
                    </ErrorBoundary>
                </RSSProvider>
            </ErrorBoundary>

            <div className="flex h-full w-full items-center justify-center">
                <View className="hover-shadow-inset h-96 w-96">
                    <Suspense fallback={null}>
                        <Room scale={0.1} position={[0, 0, 1]} rotation={[0.65, 0.0, 0]} />
                        <OrbitControls />
                        <Common />
                    </Suspense>
                </View>
            </div>

            {/* <div className="flex flex-row flex-wrap">
                {RSS_URLS.map((url) => (
                    <ErrorBoundary fallback={<span>error while loading feed</span>}>
                        <Feed key={url} url={url} className=" h-96 w-64" />
                    </ErrorBoundary>
                ))}
            </div> */}
        </>
    );
}

function TestRSS() {
    const { feeds } = useRSS();

    // console.log("feeds", feeds);

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

export { getServerSideProps } from "@/shared/getServerSideProps";
