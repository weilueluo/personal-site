import MyCanvas from "../planet/MyCanvas";
import ExplodeSphere from "../planet/ExplodeSphere"

import { OrbitControls, useHelper } from "@react-three/drei";
import React, { useRef } from "react";
import { DirectionalLightHelper } from "three";
import Sunlight from "../scene/Sunlight"

export default function Home() {
    return (
        <MyCanvas>
            <ExplodeSphere/>
            <OrbitControls/>
            <color attach={"background"} args={[0x3c3c3c]}/>
            <MyLight/>
        </MyCanvas>
    );
}


function MyLight() {
    const dlRef = useRef()
    useHelper(dlRef, DirectionalLightHelper)
    return (
        <>
            <ambientLight
                color={0xffffff}
                intensity={0.5}/>
            <directionalLight
                ref={dlRef}
                position={[20, 20, 20]}
                castShadow
                shadow-mapSize-width={4096}
                shadow-mapSize-height={4096}
                shadow-camera-far={50}
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
            />

            <Sunlight args={['#ffffff']} position={[0,0,0]} />
        </>
    )
}
