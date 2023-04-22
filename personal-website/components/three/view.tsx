import { OrbitControls, View as ViewImpl } from "@react-three/drei";
import React, { useImperativeHandle } from "react";
import { canvasTunnel } from "./utils";

export interface ViewProps extends React.ComponentPropsWithoutRef<"div"> {
    orbit?: boolean;
}

const View = React.forwardRef<React.ElementRef<"div">, ViewProps>(
    ({ children, orbit, ...props }, ref) => {
        const localRef = React.useRef<HTMLDivElement>(null!);
        useImperativeHandle(ref, () => localRef.current);

        return (
            <>
                <div ref={localRef} {...props}></div>
                <canvasTunnel.In>
                    <ViewImpl track={localRef}>{children}</ViewImpl>
                    {/* <Test /> */}
                    {orbit && <OrbitControls />}
                </canvasTunnel.In>
            </>
        );
    }
);

View.displayName = "View";

export default View;
