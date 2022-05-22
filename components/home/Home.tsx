import { OrbitControls, useHelper } from "@react-three/drei";
import React, { useEffect, useRef, useState } from "react";
import { DirectionalLightHelper } from "three";
import Sunlight from "../scene/Sunlight"
import MyCanvas from "../planet/MyCanvas";
import ExplodeSphere from "../planet/ExplodeSphere";
import { getScrollPercent, ScrollContext } from "../context/ScrollContext";
import SnowBall from "../planet/SnowBall";

const pages = 3

export default function Home() {
    const scrollAreaRef = useRef()
    const [scrollPercent, setScrollPercent] = useState(0)
    useEffect(() => {
        window.addEventListener('scroll', () => setScrollPercent(getScrollPercent()))
    })
    return (
        <>
            <MyCanvas>
                <ScrollContext.Provider value={scrollPercent}>
                    {/*<ExplodeSphere/>*/}
                    <SnowBall />
                </ScrollContext.Provider>

                <OrbitControls enablePan={false}/>
                <color attach={"background"} args={[0x3c3c3c]}/>
                <MyLight/>

            </MyCanvas>
            <div className="scrollArea" ref={scrollAreaRef}>
                <div style={{ height: `${pages * 100}vh`, width: `100vw` }}/>
            </div>
        </>
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

            <Sunlight args={['#ffffff']} position={[0, 0, 0]} intensity={100}/>
        </>
    )
}
