import { OrbitControls, useFBO, useHelper } from "@react-three/drei";
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
import { initMobileScroll } from "../common/scroll";
import { getNScrollPages } from "../home/scene/global";
import GradientBackground from "../home/scene/GradientBackground";
import Stars from "../home/scene/Stars";
import { MyCanvas, MyLights } from "../home/ThreeJsHome";
import ExperimentalContent from "./ExperimentalContent";
import { useAltScroll } from "../common/threejs";
import assert from "assert";

const tempVector3 = new Vector3(10, -10, -10);
const tempColor = new Color()
const white = new Color(0xffffff);
const black = new Color(0x000000);

function Content() {

    const enableOrbitControl = getDeviceDependent(false, true); // disable scroll on mobile, because it is used to play animation

    useEffect(() => {
        initMobileScroll();
    }, []);

    const [sunSize, setSunSize] = useState(7);
    const [sunEmissive, setSunEmissive] = useState(white)
    const scroll = useAltScroll();
    useFrame(() => {
        setSunSize(Math.max(MathUtils.lerp(7, -50, scroll), 0))
        setSunEmissive(tempColor.lerpColors(white, black, scroll))
    })

    const postEffects = useRef(
        <>
            <DepthOfField focusDistance={0} focalLength={1.2} bokehScale={2} height={480} />
            <Bloom intensity={1} luminanceThreshold={0} luminanceSmoothing={0.9} height={200} />
            <Noise opacity={0.02} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} /> 
        </>
    )


    const [godRay, setGodRay] = useState(null);
    const handleSun = useCallback(sun => {
        setGodRay( <GodRays
            sun={sun}
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
        />)
    }, [])

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
                <mesh ref={handleSun}>
                    <sphereGeometry args={[sunSize, 32,16]} />
                    <meshStandardMaterial emissive={sunEmissive}/>
                </mesh>
            </lightPositionContext.Provider>

            <EffectComposer>
                {/* <DepthOfField focusDistance={0} focalLength={1.2} bokehScale={2} height={480} /> */}
                {/* <Bloom intensity={1} luminanceThreshold={0} luminanceSmoothing={0.9} height={200} /> */}
                {/* <Noise opacity={0.02} />
                <Vignette eskil={false} offset={0.1} darkness={1.1} /> */}
                {postEffects.current}
                {godRay}
            </EffectComposer>

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
            </MyCanvas>
            <div>
                <div style={{ height: `${pages * 100}vh`, width: `100vw` }} />
            </div>
        </>

    )
}
