"use client";

import { OrbitControls, View as ViewImpl } from "@react-three/drei";
import React, { useImperativeHandle } from "react";
import { r3f } from "./scene";

export interface ViewProps extends React.ComponentPropsWithoutRef<"div"> {
    orbit?: boolean;
}

const View = React.forwardRef<React.ElementRef<"div">, ViewProps>(({ children, orbit, ...props }, ref) => {
    const localRef = React.useRef<HTMLDivElement>(null!);
    useImperativeHandle(ref, () => localRef.current);

    // console.log("orbit", orbit);

    return (
        <>
            <div ref={localRef} {...props}></div>
            <r3f.In>
                <ViewImpl track={localRef}>
                    {children}
                    {orbit && <OrbitControls />}
                </ViewImpl>
                {/* <Test /> */}
                {/* <OrbitControls dispose={null} /> */}
            </r3f.In>
        </>
    );
});

View.displayName = "View";

export default View;
