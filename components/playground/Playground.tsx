import { OrbitControls } from "@react-three/drei";
import { useEffect } from "react";
import { Vector3 } from "three";
import { lightPositionContext } from "../common/contexts";
import { getDeviceDependent } from "../common/misc";
import { initMobileScroll } from "../common/scroll";
import GradientBackground from "../home/scene/GradientBackground";
import Stars from "../home/scene/Stars";
import { MyCanvas, MyLights } from "../home/ThreeJsHome";
import ExperimentalContent from "./ExperimentalContent";

const tempVector3 = new Vector3(0, 0, 0);

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