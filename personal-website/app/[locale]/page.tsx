import CanvasLayout from "@/components/three/layout";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import Title from "./title";
import Loading from "@/components/ui/loading/spinner";

const Room = dynamic(() => import("@/components/three/objects/room"), { ssr: false });
const Common = dynamic(() => import("@/components/three/common"), { ssr: false });
const View = dynamic(() => import("@/components/three/view"), {
    ssr: false,
    loading: () => <Loading />,
});

export default function Page() {
    return (
        <CanvasLayout>
            <div className="flex h-full w-full flex-col items-center justify-center">
                <Title />
                <View className="h-96 w-96" orbit>
                    <Suspense fallback={null}>
                        <Room scale={0.1} position={[0, 0, 1]} rotation={[0.65, 0.0, 0]} />
                        <Common />
                    </Suspense>
                </View>
            </div>
        </CanvasLayout>
    );
}
