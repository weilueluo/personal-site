import { Suspense } from "react";
import Title from "./title";
import Loading from "@/components/loading";
import dynamic from "next/dynamic";

const Common = dynamic(() => import("@/components/three/common"), { ssr: false });
const Room = dynamic(() => import("@/components/three/objects/room"), { ssr: false });
const View = dynamic(() => import("@/components/three/view"), {
    ssr: false,
    loading: () => <Loading />,
});

export default function Page() {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center">
            <Title />
            <View className="hover-shadow-inset h-96 w-96" orbit>
                <Suspense fallback={null}>
                    <Room scale={0.1} position={[0, 0, 1]} rotation={[0.65, 0.0, 0]} />
                    <Common />
                </Suspense>
            </View>
        </div>
    );
}
