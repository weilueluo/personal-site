"use client";

import CanvasLayout from "@/components/three/layout";
import Loading from "@/components/ui/loading";
import dynamic from "next/dynamic";
import TestRSS from "./test";

const Room = dynamic(() => import("@/components/three/objects/room"), { ssr: false });
const Common = dynamic(() => import("@/components/three/common"), {
    ssr: false,
});
const View = dynamic(() => import("@/components/three/view"), {
    ssr: false,
    loading: () => <Loading />,
});

export default function RSSPage() {
    // useEffect(() => {
    //     RSS_URLS.forEach((url) => {});
    // }, []);

    return (
        <CanvasLayout>
            <div className="grid place-items-center">
                <h3 className=" text-xl font-semibold">RSS Feed</h3>
            </div>

            <TestRSS />

            {/* <div className="flex w-full items-center justify-center">
                <View className="hover-shadow-inset h-96 w-96" orbit>
                    <Suspense fallback={null}>
                        <Room scale={0.1} position={[0, 0, 1]} rotation={[0.65, 0.0, 0]} />
                        <Common />
                    </Suspense>
                </View>
            </div> */}

            {/* <div className="flex flex-row flex-wrap">
                {RSS_URLS.map((url) => (
                    <ErrorBoundary fallback={<span>error while loading feed</span>}>
                        <Feed key={url} url={url} className=" h-96 w-64" />
                    </ErrorBoundary>
                ))}
            </div> */}
        </CanvasLayout>
    );
}
