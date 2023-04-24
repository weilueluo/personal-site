import { tm } from "@/shared/utils";
import { Canvas } from "@react-three/fiber";
import React, { ComponentPropsWithoutRef, useImperativeHandle } from "react";
import { canvasTunnel } from "../three/utils";
import Header from "../header/Header";

export interface LayoutProps extends ComponentPropsWithoutRef<"main"> {
    useCanvas?: boolean;
}

const Layout = React.forwardRef<HTMLElement, LayoutProps>(({ children, useCanvas, className, ...otherProps }, ref) => {
    const mainRef = React.useRef<any>(null!);

    useImperativeHandle(ref, () => mainRef.current);

    return (
        <main
            className={tm("max-w-screen relative flex h-screen w-full flex-col p-6 md:p-24", className)}
            ref={mainRef}
            {...otherProps}>
            <Header />
            {children}
            {useCanvas && (
                <Canvas
                    shadows
                    gl={{
                        alpha: true,
                    }}
                    eventSource={mainRef}
                    style={{
                        height: "100%",
                        width: "100%",
                        position: "fixed",
                        top: 0,
                        left: 0,
                    }}>
                    <canvasTunnel.Out />
                </Canvas>
            )}
        </main>
    );
});

Layout.displayName = "Layout";

export default Layout;
