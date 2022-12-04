import { OrbitControls, ScrollControls, useFBO, useHelper } from "@react-three/drei";
import {
    EffectComposer,
    DepthOfField,
    Bloom,
    Noise,
    Vignette,
    GodRays
  } from "@react-three/postprocessing";
import {
    BlendFunction,
    Resizer,
    KernelSize
} from 'postprocessing'
import {useFrame, useThree} from "@react-three/fiber"
import { forwardRef, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Color, MathUtils, SpotLightHelper, Vector3 } from "three";
import { lightPositionContext } from "../common/contexts";
import { getDeviceDependent } from "../common/misc";
import { getAltScroll, initMobileScroll } from "../common/scroll";
import { getNScrollPages } from "../home/scene/global";
import GradientBackground from "../home/scene/GradientBackground";
import Stars from "../home/scene/Stars";
import { MyCanvas, MyLights } from "../home/ThreeJsHome";
import ExperimentalContent from "./ExperimentalContent";
import { useAltScroll } from "../common/threejs";
import assert from "assert";
import { useScrollLerp, useGodray } from "./godray";

const tempVector3 = new Vector3(10, -10, -10);
const tempColor = new Color()
const white = new Color(0xffffff);
const black = new Color(0x000000);

function Content() {

    const enableOrbitControl = getDeviceDependent(false, true); // disable scroll on mobile, because it is used to play animation

    useEffect(() => {
        initMobileScroll();
    }, []);

    const scroll = useAltScroll();
    
    // useFrame(() => {
    //     setSunSize(Math.max(MathUtils.lerp(7, -50, scroll), 0))
    // })

    // const [godrayBall, godrayEffect] = useGodray();

    // const effectComposerRef = useRef();
    // useFrame(() => {
    //       if (effectComposerRef.current) {
    //         effectComposerRef.current.autoRenderToScreen = true;
    //       }
    // })
    // const postEffects = useRef(
    //     <EffectComposer ref={effectComposerRef} >
    //         {/* <DepthOfField focusDistance={0} focalLength={1.2} bokehScale={2} height={480} /> */}
    //         <Bloom intensity={1} luminanceThreshold={0} luminanceSmoothing={0.9} height={200} />
    //         <Noise opacity={0.02} />
    //         <Vignette eskil={false} offset={0.1} darkness={1.1} /> 
    //         {godrayEffect}
    //     </EffectComposer>
    // )

    // useFrame(() => {
    //     if (bloomRef.current) {
    //         bloomRef.current.intensity = 1. - scroll;
    //     }
    // })


    return (
        <>
            <lightPositionContext.Provider value={tempVector3}>
                {/* <Stars /> */}
                <PlaygroundLights />
                <ExperimentalContent />

                {/* <pointLight
                    position={[10,10,0]}
                    intensity={100}
                /> */}
                {/* {godrayBall} */}
                {/* <mesh ref={handleSun}>
                    <sphereGeometry args={[sunSize, 32,16]} />
                    <meshStandardMaterial emissive={white}/>
                </mesh> */}
            </lightPositionContext.Provider>

            {/* {postEffects.current} */}



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
    const lightRef1 = useRef();
    const lightRef2 = useRef();

    // useHelper(lightRef1, SpotLightHelper, 'cyan')
    // useHelper(lightRef2, SpotLightHelper, 'yellow')

    const [lightPosition1, setLightPosition1] = useState(new Vector3(0,0,0));
    const [lightPosition2, setLightPosition2] = useState(new Vector3(0,0,0));
    const state = useThree()

    useEffect(() => {
        const lightPos1 = state.camera.position.clone().cross(state.camera.up).multiplyScalar(1);
        lightPos1.lerp(state.camera.position, 0.2)
        
        setLightPosition1(lightPos1);

        const lightPos2 = state.camera.up.clone().cross(state.camera.position).multiplyScalar(1);
        lightPos2.lerp(state.camera.position, 0.2)
        
        setLightPosition2(lightPos2);
    }, [])


    const mapSize = getDeviceDependent(128, 512);
    const shadowCam = 50;

    return (
        <>
            <spotLight
                ref={lightRef1}
                position={lightPosition1}
                color={0xffffff}
                intensity={50}
                castShadow
                shadow-mapSize-height={mapSize}
                shadow-mapSize-width={mapSize}
                shadow-camera-near={0.1}
                shadow-camera-far={shadowCam}
                shadow-camera-left={-shadowCam}
                shadow-camera-right={shadowCam}
                shadow-camera-top={shadowCam}
                shadow-camera-bottom={-shadowCam}
            />
            <spotLight
                ref={lightRef2}
                position={lightPosition2}
                color={0xffffff}
                intensity={50}
                castShadow
                shadow-mapSize-height={mapSize}
                shadow-mapSize-width={mapSize}
                shadow-camera-near={0.1}
                shadow-camera-far={shadowCam}
                shadow-camera-left={-shadowCam}
                shadow-camera-right={shadowCam}
                shadow-camera-top={shadowCam}
                shadow-camera-bottom={-shadowCam}
            />

            {/* <spotLight
                ref={lightRef2}
                position={lightPosition2}
                color={0xffffff}
                intensity={30}
                castShadow
                shadow-mapSize-height={mapSize}
                shadow-mapSize-width={mapSize}
                shadow-camera-near={0.1}
                shadow-camera-far={20}
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
            />  */}

            <ambientLight color={0xffffff} intensity={10} />
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
                <PostEffect />
            </MyCanvas>
            <div>
                <div style={{ height: `${pages * 100}vh`, width: `100vw` }} />
            </div>
        </>

    )
}


function PostEffect() {
    // const godray = useGodray();
    const sunRef = useRef(null);
    const godrayRef = useRef(null);
    const dofRef = useRef(null)
    const bloomRef = useRef(null);
    const matRef = useRef();

    useFrame((state) => {
        const scroll = getAltScroll()
        if (sunRef.current) {
            const scale = Math.max(MathUtils.lerp(1, -10, scroll), 0.1)
            sunRef.current.scale.set(scale, scale, scale)
        }
        if (godrayRef.current) {
            // clampMax
            // decay
            // density
            // exposure
            // inputBuffer
            // lightPosition
            // weight
            const uniforms = godrayRef.current.godRaysMaterial.uniforms;
            // uniforms.decay.value = Math.min(MathUtils.lerp(0.85, 0, scroll), 0.95)
            // uniforms.weight.value = Math.max(MathUtils.lerp(0.6, 1.0, scroll), 1.0)
            // uniforms.decay.value = Math.min(MathUtils.lerp(0.85, 2.0, scroll), 0.95)
            // uniforms.exposure.value = Math.max(MathUtils.lerp(1, -7, scroll), 0)
            // uniforms.density.value = Math.max(MathUtils.lerp(1, -7, scroll), 0)
            uniforms.clampMax.value = Math.max(MathUtils.lerp(1, -7, scroll), 0)
        }

        if (dofRef.current) {
            // console.log(dofRef.current);
            
        }

        if (bloomRef.current) {
            // console.log(bloomRef.current);
            bloomRef.current.uniforms.get('intensity').value =  Math.max(MathUtils.lerp(1, 0, Math.max(-1/(scroll+1e-6)+9, 0)), 0)
            // console.log(Math.max(MathUtils.lerp(1, 0, Math.max(-1/(scroll+1e-6)+6, 0)), 0));
            // console.log(bloomRef.current.uniforms.get('intensity').value)
        }

        if (matRef.current) {
            // console.log(matRef.current);
            matRef.current.color.set(tempColor.lerpColors(white, black, MathUtils.clamp(-1/(scroll+1e-6)+9, 0, 1)))
            matRef.current.emissive.set(tempColor.lerpColors(white, black, MathUtils.clamp(-1/(scroll+1e-6)+9, 0, 1)))
            matRef.needsUpdate = true
            // console.log(MathUtils.clamp(-1/(scroll+1e-6)+9, 0, 1));
            // console.log(matRef.current.color);
            
            
        }
    })


    const [godray, setGodray] = useState(null);
    const handleSun = useCallback((sun) => {
        sunRef.current = sun
        setGodray(
            <GodRays
                    ref={godrayRef}
                    sun={sunRef.current}
                    blendFunction={BlendFunction.SCREEN}
                    samples={50}
                    density={0.97}
                    decay={0.85}
                    weight={0.6}
                    exposure={1}
                    clampMax={1}
                    // width={Resizer.AUTO_SIZE}
                    // height={Resizer.AUTO_SIZE}
                    kernelSize={KernelSize.LARGE}
                    blur={1}
                />
        )
    }, [])

    return (
        <>
            <EffectComposer >
                <DepthOfField ref={dofRef} focusDistance={0.5} focalLength={5} bokehScale={5} height={480} />
                <Bloom ref={bloomRef} intensity={1} luminanceThreshold={0} luminanceSmoothing={0.75} height={200} />
                <Noise opacity={0.05} />
                <Vignette eskil={false} offset={0.1} darkness={1.1} /> 
                {godray}
            </EffectComposer>
            <mesh ref={handleSun}>
                <sphereGeometry args={[7.5, 32, 16]} />
                <meshStandardMaterial ref={matRef} emissive={white} />
            </mesh>
        </>
    )
}