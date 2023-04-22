import dynamic from "next/dynamic";
import React, { ReactNode, useRef } from "react";

const Scene = dynamic(() => import("./canvas"), { ssr: false });

const SceneLayout = ({ children }: { children: React.ReactNode }) => {
    const ref = useRef<HTMLDivElement>(null!);

    return (
        <div
            ref={ref}
            style={{
                position: "relative",
                width: " 100%",
                height: "100%",
                overflow: "auto",
                touchAction: "auto",
            }}>
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
        </div>
    );
};

export default SceneLayout;
