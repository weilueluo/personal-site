import { useContext, useRef } from "react";
import { lightPositionContext } from "../../common/contexts";
import { getDeviceDependent } from "../../common/misc";
import { useHelper } from "@react-three/drei";
import { SpotLight, SpotLightHelper } from "three";
import { useFrame } from "@react-three/fiber";


export default function ThreeJsLights() {
    
    const lightPosition = useContext(lightPositionContext)

    const mapSize = getDeviceDependent(128, 512);

    const lightRef = useRef<SpotLight>();

    // useHelper(lightRef, SpotLightHelper, 'cyan');

    const num = 1;

    useFrame(() => {
        if (lightRef.current) {
            lightRef.current.position.set(lightPosition.x, lightPosition.y, lightPosition.z);
        }
    })

    const intensity = getDeviceDependent(1, 5);

    return (
        <>
            <spotLight
                ref={lightRef}
                position={lightPosition}
                // color={0xffffff}
                intensity={intensity}
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