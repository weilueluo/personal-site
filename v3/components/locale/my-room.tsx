"use client";

import Loading from "@/components/ui/loading/spinner";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const Room = dynamic(() => import("@/components/three/objects/room"), { ssr: false });
const Common = dynamic(() => import("@/components/three/common"), { ssr: false });
const View = dynamic(() => import("@/components/three/view"), {
    ssr: false,
    loading: () => <Loading />,
});

export default function MyRoom() {
    return (
        <View className="h-96 w-full" orbit>
            <Suspense fallback={null}>
                <Room scale={0.1} position={[0, 0, 1]} rotation={[0.65, 0.0, 0]} />
                <Common />
            </Suspense>
        </View>
    );
}
