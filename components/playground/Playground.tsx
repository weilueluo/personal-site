import { OrbitControls } from "@react-three/drei";
import { useEffect, useState } from "react";
import { Vector3 } from "three";
import { getNScrollPages } from "../home/scene/global";
import GradientBackground from "../home/scene/GradientBackground"
import Stars from "../home/scene/Stars";
import { MyCanvas, MyContent, MyLights } from "../home/ThreeJsHome"
import { lightPositionContext } from "../utils/context"
import { getDeviceDependent, initMobileScroll } from "../utils/hooks";
import ExperimentalContent from "./ExperimentalContent";

const tempVector3 =  new Vector3(0, 0, 0);

function Content() {

    const enableOrbitControl = getDeviceDependent(false, true); // disable scroll on mobile, because it is used to play animation

    useEffect(() => {
        initMobileScroll();
    }, []);

    return (
        <>
            <lightPositionContext.Provider value={tempVector3}>
                <Stars />
                <MyLights />

                <ExperimentalContent />
            </lightPositionContext.Provider>

            <GradientBackground />
            <OrbitControls
                enabled={true}
                enablePan={false}
                enableZoom={false}
                enableRotate={enableOrbitControl}
                autoRotate={!enableOrbitControl}
                autoRotateSpeed={1.0}
                // minPolarAngle={polarAngle}
                // maxPolarAngle={maxPolarAngle}
            />
        </>
    )
}

export default function Playground() {
    return (
        <>
            <MyCanvas>
                <Content />
            </MyCanvas>
        </>
        
    )
}