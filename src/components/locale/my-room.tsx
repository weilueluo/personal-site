"use client";

import Loading from "@/components/ui/loading/spinner";
import { Sparkles } from "@react-three/drei";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const Room = dynamic(() => import("@/components/three/objects/room"), { ssr: false });
const View = dynamic(() => import("@/components/three/view"), {
    ssr: false,
    loading: () => <Loading />,
});

export default function MyRoom() {
    return (
        <View className="h-[12em] max-h-screen w-full md:h-[24em]" orbit>
            <Suspense fallback={null}>
                <Room scale={0.1} position={[0, -0.5, -0.1]} rotation={[0.65, 0.75, 0]} />
                <Sparkles count={50} scale={5} noise={0.5} speed={0.5} />
            </Suspense>
        </View>
    );
}
