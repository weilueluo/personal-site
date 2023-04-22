import { Canvas } from "@react-three/fiber";
import React from "react";
import { canvasTunnel } from "../three/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
    const container = React.useRef<any>(null!);

    return (
        <main
            className={"max-w-screen relative flex h-screen w-full flex-col p-6 md:p-24"}
            ref={container}>
            {children}
            <Canvas
                shadows
                gl={{
                    alpha: true,
                }}
                eventSource={container}
                style={{
                    height: "100%",
                    width: "100%",
                    position: "fixed",
                    top: 0,
                    left: 0,
                }}>
                <canvasTunnel.Out />
            </Canvas>
        </main>
    );
}
