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
import { Color, Material, MathUtils, Mesh, MeshStandardMaterial, SpotLightHelper, Vector3 } from "three";
import { lightPositionContext } from "../common/contexts";
import { getDeviceDependent } from "../common/misc";
import { getAltScroll } from "../common/scroll";
import { getNScrollPages } from "../home/scene/global";
import GradientBackground from "../home/scene/GradientBackground";
import Stars from "../home/scene/Stars";
import { MyCanvas, MyLights } from "../home/ThreeJsHome";
import ExperimentalContent from "./ExperimentalContent";
import assert from "assert";
import Lines from "../home/scene/Lines";
import Moon from "../home/scene/Moon";
import { polar2xyz } from "../common/math";
import { NewMoon } from "./NewMoon";

const tempVector3 = new Vector3(10, -10, -10);
const tempColor = new Color()
const white = new Color(0xffffff);
const black = new Color(0x000000);

function Content() {

    const enableOrbitControl = getDeviceDependent(false, true); // disable scroll on mobile, because it is used to play animation


    const theta = useRef(0);
    const thetaSpeed = 0.04;
    const phi = useRef(0.3);
    const phiSpeed = 0.00;
    const moonRadius = getDeviceDependent(5, 10);

    const lightRef = useRef<any>();
    const moonRef = useRef<any>();
    const [lightPosition, setLightPosition] = useState(tempVector3)

    // rotate light source around ball
    useFrame(() => {
        theta.current += Math.atan2(thetaSpeed, moonRadius);
        phi.current += Math.atan2(phiSpeed, moonRadius);
        const [x, y, z] = polar2xyz(theta.current, phi.current, moonRadius);
        // tempVector3.set(x, y, z);
        if (lightRef.current) {
            lightRef.current.position.set(x,y,z)
        }
        if (moonRef.current) {
            moonRef.current.position.set(x,y,z)
        }
        setLightPosition(tempVector3.set(x,y,z));
    })

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
        <lightPositionContext.Provider value={lightPosition}>
            <Stars />
            <Lines />
            <NewMoon ref={moonRef} />
            <PlaygroundLights ref={lightRef}/>
            <ExperimentalContent />
        </lightPositionContext.Provider>
               

                {/* <pointLight
                    position={[10,10,0]}
                    intensity={100}
                /> */}
                {/* {godrayBall} */}
                {/* <mesh ref={handleSun}>
                    <sphereGeometry args={[sunSize, 32,16]} />
                    <meshStandardMaterial emissive={white}/>
                </mesh> */}

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


export const PlaygroundLights = forwardRef((props, ref: any) => {
    // useHelper(lightRef1, SpotLightHelper, 'cyan')
    const lightPosition = useContext(lightPositionContext)

    const mapSize = getDeviceDependent(128, 512);
    const shadowCam = 50;

    return (
        <>
            <spotLight
                ref={ref}
                position={lightPosition}
                color={0xffffff}
                intensity={100}
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
            /> */}

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

            <ambientLight color={0xffffff} intensity={1} />

        </>
    );
});
PlaygroundLights.displayName = "PlaygroundLights"

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
    const sunRef = useRef<any>(null);
    const godrayRef = useRef<any>(null);
    const bloomRef = useRef<any>(null);
    const matRef = useRef<any>();
    const pointLightRef = useRef<any>();

    const handleGodray = godray => {
        godrayRef.current = godray;
        if (!godray) {
            return;
        }
        godray.godRaysPass.fullscreenMaterial.onBeforeCompile = (shader, renderer) => {
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <dithering_fragment>',
                `
                //#include <dithering_fragment>
                gl_FragColor = gl_FragColor * -1.;
            `)
            // .replace('texel=texture2D(inputBuffer,coord);', `
            // texel=vec4(0.0);
            // `)

            console.log(shader.fragmentShader);

        };

        console.log(godrayRef.current);
        
    }

    useFrame((state) => {
        const scroll = getAltScroll();

        const peak = 0.1;
        const climb = scroll * scroll * (1/(peak*peak));
        const fall = 1 - Math.max((scroll-peak) * (1/(1-peak)), 0.1)
        const peakFactor = scroll > peak ? fall : climb;

        const fallFactor = MathUtils.clamp(-1/(scroll+1e-6)+9, 0, 1)//Math.max(, 0);  // 0, when fall go to 1
        const climbFactor = MathUtils.lerp(1, 0, fallFactor); // inverse of fall factor

        if (sunRef.current) {
            const scale = Math.max(MathUtils.lerp(1, -10, scroll), 0.2)
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
            uniforms.clampMax.value = Math.max(MathUtils.lerp(1, -7, scroll), 0)
            uniforms.exposure.value = peakFactor * 9.5 + 0.5;
            // console.log(godrayRef.current);
            
        }

        if (bloomRef.current) {
            bloomRef.current.uniforms.get('intensity').value = climbFactor
        }

        if (matRef.current) {
            // matRef.current.color.set(tempColor.lerpColors(white, black, fallFactor))
            // matRef.current.emissive.set(tempColor.lerpColors(white, black, fallFactor))
            // matRef.current.color.set(black);
            // matRef.current.emissive.set(black);
        }

        if (pointLightRef.current) {
            pointLightRef.current.intensity = peakFactor * 1000 *  climbFactor;
        }
    })


    const [godray, setGodray] = useState<any>(null);
    const handleSun = useCallback((sun) => {
        sunRef.current = sun
        setGodray(
            <GodRays
                    ref={handleGodray}
                    sun={sunRef.current}
                    blendFunction={BlendFunction.SCREEN}
                    samples={60}
                    density={0.95}
                    decay={0.85}
                    weight={0.6}
                    exposure={1}
                    clampMax={1}
                    // width={Resizer.AUTO_SIZE}
                    // height={Resizer.AUTO_SIZE}
                    kernelSize={KernelSize.MEDIUM}
                    blur={1}
                />
        );
    }, [])

    const someColor =new Color(Color.NAMES.skyblue);

    useEffect(() => {
        console.log(Color.NAMES);
        
    })

    return (
        <>
            <EffectComposer >
                <DepthOfField focusDistance={0.5} focalLength={5} bokehScale={5} height={480} />
                <Bloom ref={bloomRef} intensity={2} luminanceThreshold={0} luminanceSmoothing={0.75} height={200} />
                <Noise opacity={0.02} />
                <Vignette eskil={false} offset={0} darkness={0.85} /> 
                {godray}
            </EffectComposer>
            <mesh ref={handleSun}>
                <sphereGeometry args={[4.5, 32, 16]} />
                <meshStandardMaterial ref={matRef} emissive={someColor} color={someColor}/>
            </mesh>
            <pointLight ref={pointLightRef} color={0xffffff} intensity={1.0} position={[0,0,0]} />
        </>
    )
}