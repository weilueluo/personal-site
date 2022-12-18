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

    return (
        <>
            <spotLight
                ref={lightRef}
                position={lightPosition}
                color={0xffffff}
                intensity={500}
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

            {/* <ambientLight color={0xffffff} intensity={0} /> */}
        </>
    )
}