import { OrbitControls, shaderMaterial, useHelper } from "@react-three/drei";
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle, useMemo } from "react";
import { DirectionalLightHelper, Material, ShaderMaterial } from "three";
import Sunlight from "../scene/Sunlight"
import MyCanvas from "../planet/MyCanvas";
import { getScrollPercent, ScrollContext } from "../context/ScrollContext";
import SnowBall from "../planet/SnowBall";
import { EffectComposer, SMAA, BrightnessContrast, ChromaticAberration, ColorAverage, DepthOfField, Bloom, DotScreen, Vignette, SSAO, Pixelation, Noise, Grid, GodRays, Glitch } from '@react-three/postprocessing'
import { KernelSize, Resizer, BlendFunction, GlitchMode } from "postprocessing";
import { useScrollPercent } from "../utils/hooks";
import { useFrame } from "@react-three/fiber";
import { clamp } from "../utils/utils";
import { background_vs } from '../shaders/background_vs.glsl'
import { background_fs } from '../shaders/background_fs.glsl'
import { Color } from "three";

const pages = 10

const Sun = forwardRef(function Sun(props, forwardRef) {
    const maxSize = 6
    const [sunSize, setSunSize] = useState(maxSize)
    const scroll = useScrollPercent(0, 100)

    useFrame(state => {
        let altScroll = Math.abs((scroll) * 2 - 1)
        setSunSize(maxSize * altScroll)
    })

    return (
        <mesh ref={forwardRef} position={[0, 0, 0]}>
            <sphereGeometry args={[sunSize, 36, 36]} />
            <meshBasicMaterial color={0xffffff} transparent={true} opacity={0.2} />
        </mesh>
    );
});


function Content() {
    const [sunRef, setSunRef] = useState(null);
    const [decay, setDecay] = useState(1)
    // need to be consistent with above sun, TODO: refactor
    let scroll = useScrollPercent(0, 100)
    useFrame(state => {
        let altScroll = Math.abs((scroll) * 2 - 1)
        setDecay(altScroll * 0.099);
    })

    return (
        <>
            <SnowBall />
            <GradientBackground />

            <OrbitControls enablePan={false} enableZoom={false} />
            <color attach={"background"} args={[0x000]} />

            {/* <Sun ref={el => setSunRef(el)} /> */}

            <EffectComposer multisampling={8}>
                {/* https://docs.pmnd.rs/react-postprocessing */}
                {/* <Vignette 
        eskil={false} 
        offset={0.2} 
        darkness={1} /> */}
                {/* {sunRef && <GodRays
                    sun={sunRef}
                    blendFunction={BlendFunction.SCREEN} // The blend function of this effect.
                    samples={120} // The number of samples per pixel.
                    density={1} // The density of the light rays.
                    decay={0.9 + decay} // An illumination decay factor.
                    weight={0.3} // A light ray weight factor.
                    exposure={0.1} // A constant attenuation coefficient.
                    clampMax={0.5} // An upper bound for the saturation of the overall effect.
                    width={Resizer.AUTO_SIZE} // Render width.
                    height={Resizer.AUTO_SIZE} // Render height.
                    kernelSize={KernelSize.LARGE} // The blur kernel size. Has no effect if blur is disabled.
                    blur={true} // Whether the god rays should be blurred to reduce artifacts.
                />} */}
                {/* <Noise opacity={0.02} /> */}
                {/* <DepthOfField
            focusDistance={0} // where to focus
            focalLength={0.01} // focal length
            bokehScale={2} // bokeh size
        /> */}
                {/* <ChromaticAberration
            blendFunction={BlendFunction.NORMAL} // blend mode
            offset={[0.02, 0.002]} // color offset 
        />*/}
                {/* <BrightnessContrast
        brightness={0} // brightness. min: -1, max: 1
        contrast={0.05} // contrast: min -1, max: 1
    /> */}
                <SMAA />
            </EffectComposer>
        </>
    )
}


function GradientBackground() {
    const scroll = useScrollPercent(0, 100)

    const uniforms = {
        uColorA: { value: new Color(0x1e3966) },
        uColorB: { value: new Color(0x661e49) },
        uScrolledAmount: { value: scroll }
    }

    const material = new ShaderMaterial({
        uniforms: uniforms,
        vertexShader: background_vs,
        fragmentShader: background_fs
    })

    useFrame(() => {
        let altScroll = scroll * 2
        if (altScroll > 1) {
            altScroll = 2 - altScroll
        }
        altScroll = clamp(altScroll, 0, 0.99)  // avoid flashing at 100% animation
        material.uniforms.uScrolledAmount.value = altScroll;
    })



    return (
        <mesh material={material}>
            <planeGeometry args={[2, 2, 1, 1]} />
        </mesh>
    )
}

export default function Home() {
    const scrollAreaRef = useRef()
    return (
        <>
            <MyCanvas>
                <Content />
            </MyCanvas>
            {/* <WavePlanet /> */}
            <div className="scrollArea" ref={scrollAreaRef}>
                <div style={{ height: `${pages * 100}vh`, width: `100vw` }} />
            </div>
        </>
    );
}


function MyLight() {
    // const dlRef = useRef()
    // useHelper(dlRef, DirectionalLightHelper)
    return (
        <>
            {/* <ambientLight
                color={0xffffff}
                intensity={0.5} /> */}
            {/* <directionalLight
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
            /> */}

            {/* <Sunlight args={['#ffffff']} position={[0, 0, 0]} intensity={100}/> */}
        </>
    )
}
