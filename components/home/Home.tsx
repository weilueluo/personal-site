import { OrbitControls, useHelper } from "@react-three/drei";
import React, { useEffect, useRef, useState, forwardRef } from "react";
import { DirectionalLightHelper } from "three";
import Sunlight from "../scene/Sunlight"
import MyCanvas from "../planet/MyCanvas";
import { getScrollPercent, ScrollContext } from "../context/ScrollContext";
import SnowBall from "../planet/SnowBall";
import { EffectComposer, BrightnessContrast, ChromaticAberration, ColorAverage, DepthOfField, Bloom, DotScreen, Vignette, SSAO, Pixelation, Noise, Grid, GodRays, Glitch } from '@react-three/postprocessing'
import { KernelSize, Resizer, BlendFunction, GlitchMode } from "postprocessing";

const pages = 10

const Sun = forwardRef(function Sun(props, forwardRef) {
    return (
        <mesh ref={forwardRef} position={[0, 0, 0]}>
            <sphereGeometry args={[7, 36, 36]} />
            <meshBasicMaterial color={"#ffffff"} />
        </mesh>
    );
});

export default function Home() {
    const scrollAreaRef = useRef()
    const [scrollPercent, setScrollPercent] = useState(0)
    useEffect(() => {
        window.addEventListener('scroll', () => setScrollPercent(getScrollPercent()))
    })
    const sunRef = useRef();

    return (
        <>
            <MyCanvas>
                {/*<ExplodeSphere/>*/}
                <SnowBall />

                <OrbitControls enablePan={false} enableZoom={false} />
                <color attach={"background"} args={[0x141414]} />
                <MyLight />

                <Sun ref={sunRef} />

                <EffectComposer multisampling={8}>
                    {/* https://docs.pmnd.rs/react-postprocessing */}
                    {/* <Vignette eskil={false} offset={0.3} darkness={0.9} /> */}
                    {/* <Bloom height={Resizer.AUTO_SIZE} width={Resizer.AUTO_SIZE} kernelSize={3} luminanceThreshold={0} luminanceSmoothing={1.0} intensity={0.5} /> */}
                    {/* <Bloom height={Resizer.AUTO_SIZE} width={Resizer.AUTO_SIZE} kernelSize={KernelSize.HUGE} luminanceThreshold={0} luminanceSmoothing={0} intensity={0.1} /> */}
                    {/* <Pixelation granularity={5} /> */}
                    {/* <Noise
                        premultiply // enables or disables noise premultiplication
                        blendFunction={BlendFunction.ADD} // blend mode
                    /> */}
                    {/* <Grid
                        blendFunction={BlendFunction.OVERLAY} // blend mode
                        scale={1.0} // grid pattern scale
                        lineWidth={0.0} // grid pattern line width
                        // size={{ width, height }} // overrides the default pass width and height
                    /> */}
                    {/* {sunRef.current && <GodRays
                        sun={sunRef.current}
                        blendFunction={BlendFunction.Screen} // The blend function of this effect.
                        samples={60} // The number of samples per pixel.
                        density={0.9} // The density of the light rays.
                        decay={0.94} // An illumination decay factor.
                        weight={0.4} // A light ray weight factor.
                        exposure={0.8} // A constant attenuation coefficient.
                        clampMax={1} // An upper bound for the saturation of the overall effect.
                        width={Resizer.AUTO_SIZE} // Render width.
                        height={Resizer.AUTO_SIZE} // Render height.
                        kernelSize={KernelSize.MEDIUM} // The blur kernel size. Has no effect if blur is disabled.
                        blur={true} // Whether the god rays should be blurred to reduce artifacts.
                    />} */}
                    {/* <SSAO
                        blendFunction={BlendFunction.MULTIPLY} // blend mode
                        samples={30} // amount of samples per pixel (shouldn't be a multiple of the ring count)
                        rings={4} // amount of rings in the occlusion sampling pattern
                        distanceThreshold={1.0} // global distance threshold at which the occlusion effect starts to fade out. min: 0, max: 1
                        distanceFalloff={0.0} // distance falloff. min: 0, max: 1
                        rangeThreshold={0.5} // local occlusion range threshold at which the occlusion starts to fade out. min: 0, max: 1
                        rangeFalloff={0.1} // occlusion range falloff. min: 0, max: 1
                        luminanceInfluence={0.9} // how much the luminance of the scene influences the ambient occlusion
                        radius={20} // occlusion sampling radius
                        scale={0.5} // scale of the ambient occlusion
                        bias={0.5} // occlusion bias
                    /> */}
                    {/* <Glitch
                        delay={[1.5, 3.5]} // min and max glitch delay
                        duration={[0.6, 1.0]} // min and max glitch duration
                        strength={[0.3, 1.0]} // min and max glitch strength
                        mode={GlitchMode.SPORADIC} // glitch mode
                        active // turn on/off the effect (switches between "mode" prop and GlitchMode.DISABLED)
                        ratio={0.85} // Threshold for strong glitches, 0 - no weak glitches, 1 - no strong glitches.
                    /> */}
                    {/* <DotScreen
                        blendFunction={BlendFunction.NORMAL} // blend mode
                        angle={Math.PI * 0.5} // angle of the dot pattern
                        scale={1.0} // scale of the dot pattern
                    /> */}
                    {/* <DepthOfField
                            focusDistance={0} // where to focus
                            focalLength={0.01} // focal length
                            bokehScale={2} // bokeh size
                        /> */}
                    {/* <ColorAverage
                            blendFunction={BlendFunction.NORMAL} // blend mode
                        /> */}
                    {/* <ChromaticAberration
                            blendFunction={BlendFunction.NORMAL} // blend mode
                            offset={[0.02, 0.002]} // color offset
                        /> */}
                    {/* <BrightnessContrast
                        brightness={-0.2} // brightness. min: -1, max: 1
                        contrast={0.1} // contrast: min -1, max: 1
                    /> */}
                </EffectComposer>

            </MyCanvas>
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
            <ambientLight
                color={0xffffff}
                intensity={0.5} />
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
