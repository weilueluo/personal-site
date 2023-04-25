"use client";

import dynamic from "next/dynamic";
import React, { useRef } from "react";
const Scene = dynamic(() => import("@/components/three/scene"), { ssr: false });

const CanvasLayout = ({ children }: { children: React.ReactNode }) => {
    const ref = useRef<HTMLDivElement>(null!);

    return (
        <main
            ref={ref}
            style={{
                position: "relative",
                width: " 100%",
                height: "100%",
                overflow: "auto",
                touchAction: "auto",
            }}
            className="max-w-screen relative flex h-screen w-full flex-col p-6 md:p-24"
            >
            {children}
            <Scene
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    pointerEvents: "none",
                }}
                eventSource={ref}
                eventPrefix="client"
            />
        </main>
    );
};

CanvasLayout.displayName = "CanvasLayout";

export default CanvasLayout
