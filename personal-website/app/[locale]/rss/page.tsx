import Loading from "@/components/loading";
import Dog from "@/components/three/objects/dog";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import TestRSS from "./test";

const Common = dynamic(() => import("@/components/three/common"), { ssr: false });
const Room = dynamic(() => import("@/components/three/objects/room"), { ssr: false });
const View = dynamic(() => import("@/components/three/view"), {
    ssr: false,
    loading: () => <Loading />,
});

export default function RSSPage() {
    // useEffect(() => {
    //     RSS_URLS.forEach((url) => {});
    // }, []);

    return (
        <>
            <div>
                <h3>Hello RSS Feed</h3>
            </div>

            <TestRSS />

            <div className="flex h-full w-full items-center justify-center">
                <View className="hover-shadow-inset h-96 w-96" orbit>
                    <Suspense fallback={null}>
                        <Dog position={[0, 0, 1]} rotation={[0.65, 0.0, 0]} />
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
