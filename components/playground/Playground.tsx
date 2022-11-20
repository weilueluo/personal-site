import { OrbitControls, useFBO, useHelper } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useContext, useEffect, useRef, useState } from "react";
import { SpotLightHelper, Vector3 } from "three";
import { lightPositionContext } from "../common/contexts";
import { getDeviceDependent } from "../common/misc";
import { initMobileScroll } from "../common/scroll";
import { getNScrollPages } from "../home/scene/global";
import GradientBackground from "../home/scene/GradientBackground";
import Stars from "../home/scene/Stars";
import { MyCanvas, MyLights } from "../home/ThreeJsHome";
import ExperimentalContent from "./ExperimentalContent";

const tempVector3 = new Vector3(-10, -10, -10);

function Content() {

    const enableOrbitControl = getDeviceDependent(false, true); // disable scroll on mobile, because it is used to play animation

    useEffect(() => {
        initMobileScroll();
    }, []);

    return (
        <>
            <lightPositionContext.Provider value={tempVector3}>
                <Stars />
                <PlaygroundLights />
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

export function PlaygroundLights() {
    const lightRef = useRef();

    useHelper(lightRef, SpotLightHelper, 'cyan')

    const lightPosition = useContext(lightPositionContext);

    // useFrame(() => {
    //     console.log(lightPosition);
    // })

    const mapSize = getDeviceDependent(128, 512);
    // const position = useContext(lightPositionContext);

    return (
        <>
            <spotLight
                ref={lightRef}
                position={lightPosition}
                color={0xffffff}
                intensity={5}
                castShadow
                shadow-mapSize-height={mapSize}
                shadow-mapSize-width={mapSize}
                shadow-camera-near={0.1}
                shadow-camera-far={20}
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
            />

            {/* <ambientLight color={0xffffff} intensity={1.0} /> */}
        </>
    );
}

export default function Playground() {
    const [pages, setPages] = useState(1);
    useEffect(() => {
        setPages(getNScrollPages())
    }, [])
    return (
        <>
            <MyCanvas>
                <Content />
            </MyCanvas>
            <div>
                <div style={{ height: `${pages * 100}vh`, width: `100vw` }} />
            </div>
        </>

    )
}