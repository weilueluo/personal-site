"use client";

import Loading from "@/components/ui/loading/spinner";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";

const Room = dynamic(() => import("@/components/three/objects/room"), { ssr: false });
const Common = dynamic(() => import("@/components/three/common"), { ssr: false });
const View = dynamic(() => import("@/components/three/view"), {
    ssr: false,
    loading: () => <Loading />,
});

export default function MyRoom() {
    const [zPos, setZPos] = useState(-1);
    useEffect(() => {
        if (screen.orientation.type.startsWith("portrait")) {
            setZPos(-5);
        }
    }, []);

    return (
        <View className="h-[48em] max-h-screen w-full" orbit>
            <Suspense fallback={null}>
                <Room scale={0.1} position={[0, 0, zPos]} rotation={[0.65, 0.75, 0]} />
                <Common />
            </Suspense>
        </View>
    );
}
