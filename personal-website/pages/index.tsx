import Loading from "@/components/loading";
import { useMessages } from "@/shared/translation";

import { OrbitControls } from "@react-three/drei";
import dynamic from "next/dynamic";
import { Suspense, useTransition } from "react";

const Common = dynamic(() => import("@/components/three/common"), { ssr: false });
const Room = dynamic(() => import("@/components/three/objects/room"), { ssr: false });
const View = dynamic(() => import("@/components/three/view"), {
    ssr: false,
    loading: () => <Loading />,
});

export default function Page() {
    const messages: any = useMessages();

    // console.log("messages", messages);

    return (
        <>
            <div className="flex h-full w-full items-center justify-center flex-col">
                <h3>{messages["Index"]["title"]}</h3>
                <View className="hover-shadow-inset h-96 w-96">
                    <Suspense fallback={null}>
                        <Room scale={0.1} position={[0, 0, 1]} rotation={[0.65, 0.0, 0]} />
                        <OrbitControls />
                        <Common />
                    </Suspense>
                </View>
            </div>
        </>
    );
}

export { getServerSideProps } from "@/shared/getServerSideProps";
