import { useContext, useRef } from "react";
import { lightPositionContext } from "../../common/contexts";
import { getDeviceDependent } from "../../common/misc";
import { useHelper } from "@react-three/drei";
import { SpotLightHelper } from "three";



export default function ThreeJsLights() {
    
    const lightPosition = useContext(lightPositionContext)

    const mapSize = getDeviceDependent(128, 512);

    const lightRef = useRef();

    useHelper(lightRef, SpotLightHelper, 'cyan');

    const num = 1;

    return (
        <>
            <spotLight
                ref={lightRef}
                position={lightPosition}
                // color={0xffffff}
                intensity={10}
                shadow-mapSize-height={mapSize}
                shadow-mapSize-width={mapSize}
                shadow-camera-near={0.01}
                shadow-camera-far={num}
                shadow-camera-left={-num}
                shadow-camera-right={num}
                shadow-camera-top={num}
                shadow-camera-bottom={-num}
                castShadow
                receiveShadow
            />

            {/* <ambientLight color={0xffffff} intensity={10} /> */}
        </>
    )
}