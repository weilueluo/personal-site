"use client";

import { OrbitControls, View as ViewImpl } from "@react-three/drei";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { r3f } from "./scene";
import { tm } from "@/shared/utils";

export interface ViewProps extends React.ComponentPropsWithoutRef<"div"> {
    orbit?: boolean;
}

const View = forwardRef(({ children, orbit, className, ...props }: ViewProps, ref) => {
    const localRef = useRef<HTMLDivElement>(null!);
    useImperativeHandle(ref, () => localRef.current);

    return (
        <>
            <div ref={localRef} className={tm("max-h-full max-w-full", className)} {...props} />
            <r3f.In>
                <ViewImpl track={localRef}>
                    {children}
                    {orbit && <OrbitControls />}
                </ViewImpl>
            </r3f.In>
        </>
    );
});
View.displayName = "View";

export default View;
