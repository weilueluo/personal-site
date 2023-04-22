import Header from "@/components/header/Header";

import Layout from "@/components/ui/Layout";
import { OrbitControls } from "@react-three/drei";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const Common = dynamic(() => import("@/components/three/common"), { ssr: false });
const Room = dynamic(() => import("@/components/three/objects/room"), { ssr: false });

const View = dynamic(() => import("@/components/three/view"), {
    ssr: false,
    loading: () => (
        <div className="flex h-96 w-full flex-col items-center justify-center">
            <svg
                className="-ml-1 mr-3 h-5 w-5 animate-spin text-black"
                fill="none"
                viewBox="0 0 24 24">
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                />
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
            </svg>
        </div>
    ),
});

export default function Page() {
    // const transparentColor = new Color( 0xff0000 );
    return (
        <Layout>
            <Header />
            <div className="flex h-full w-full items-center justify-center ">
                <View className=" h-96 w-96 rounded-xl transition-[box-shadow] duration-150 hover:shadow-lg hover:shadow-gray-600">
                    <Suspense fallback={null}>
                        <Room scale={0.1} position={[0, 0, 1]} rotation={[0.65, 0.0, 0]} />
                        <OrbitControls />
                        <Common />
                    </Suspense>
                </View>
            </div>
        </Layout>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ req: { cookies }, locale }) => {
    const messages = (await import(`../public/messages/${locale}.json`)).default;

    return {
        props: {
            cookies,
            messages,
        },
    };
};
