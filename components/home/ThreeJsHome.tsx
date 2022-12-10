import { OrbitControls, Stats, useHelper } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { GodRays, EffectComposer, DepthOfField, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ACESFilmicToneMapping, Color, DoubleSide, Euler, ExtrudeGeometry, MathUtils, Quaternion, ShapeGeometry, SpotLightHelper, sRGBEncoding, Vector3 } from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { lerp } from 'three/src/math/MathUtils';
import { lightPositionContext } from '../common/contexts';
import { polar2xyz } from '../common/math';
import { getDeviceDependent } from '../common/misc';
import { getAltScroll } from '../common/scroll';
import MainBall from '../playground/MainBall';
import {
    BlendFunction,
    Resizer,
    KernelSize
} from 'postprocessing'
import About from './scene/About';
import Ball from './scene/Ball';
import CV from './scene/CV';
import { getNScrollPages } from './scene/global';
import GradientBackground from './scene/GradientBackground';
import Lines from './scene/Lines';
import LoaderProgress from './scene/LoaderProgress';
import Moon from './scene/Moon';
import RSS from './scene/RSS';
import Stars from './scene/Stars';
import { generateTextShape, useExtrudeTextGeometry, useTextGeometry, useTextShape } from './scene/Text';
import styles from './StatsPanel.module.sass';
import ThreeSurroundingText from './scene/ThreeSurroundingText';


const tempVector3 = new Vector3(10, 10, 0);
const tempVec3 = new Vector3();
const initCameraPosition = new Vector3(0, 20, 20)
const targetCameraPosition = new Vector3(10, 10, -20);
const fontLoader = new FontLoader();

export function MyContent() {
    const enableOrbitControl = getDeviceDependent(false, true); // disable scroll on mobile, because it is used to play animation

    const [lightPosition, setLightPosition] = useState(tempVector3);
    const theta = useRef(0);
    const thetaSpeed = 0.04;
    const phi = useRef(0.3);
    const phiSpeed = 0.00;
    const moonRadius = getDeviceDependent(5, 10);

    // rotate light source around ball
    useFrame(() => {
        theta.current += Math.atan2(thetaSpeed, moonRadius);
        phi.current += Math.atan2(phiSpeed, moonRadius);
        const [x, y, z] = polar2xyz(theta.current, phi.current, moonRadius);
        tempVector3.set(x, y, z);
        setLightPosition(tempVector3);
    })

    // const controlRef = useRef(undefined);

    // camera 
    useFrame(state => {
        tempVec3.lerpVectors(initCameraPosition, targetCameraPosition, getAltScroll());
        state.camera.position.set(...tempVec3.toArray());

        if (textMeshRef.current) {
            // console.log(textMeshRef.current);
            textMeshRef.current.opacity = lerp(0.0, 1.0, getAltScroll())
        }
    })


    // some random text
    const [textGeometry, setTextGeometry] = useState(null);
    const textMeshRef = useRef<any>();
    useEffect(() => {
        fontLoader.load('/fonts/Fira Mono_Regular.json', font => {
            const geometry = new TextGeometry( 'Nothing Here Yet...', {
                font: font,
                size: 0.6,
                height: 0.02,
                curveSegments: 1,
                bevelEnabled: true,
                bevelThickness: 0.05,
                bevelSize: 0.05,
                bevelOffset: 0,
                bevelSegments: 1
            } );
            setTextGeometry(geometry)
        });
    }, [])
    // useEffect(() => {
    //     if (!font) return;
    //     setTextGeometry(new ExtrudeGeometry(font.generateShapes('', 0.6), {
    //         steps: 2,
    //         depth: 0.02,
    //         bevelEnabled: true,
    //         bevelThickness: 0.05,
    //         bevelSize: 0.05,
    //         bevelOffset: 0,
    //         bevelSegments: 1
    //     }));
    // }, [font])
    // const [opacity, setOpacity] = useState(0);
    // useFrame(() => {
        // const [textShape] = generateTextShape(text, fontSize)
        // if (textGeometry) {
        //     console.log(textGeometry.attributes);
        // }
        
        // setFontsize(lerp(0.0, targetSize, scrolledAmount))\
    //     setOpacity(lerp(0.0, 1.0, getAltScroll()))
    // })

    useEffect(() => {
        if (!textGeometry) return
        textGeometry.center()
        textGeometry.rotateY(90)
        textGeometry.scale(1, 1, 1)
    }, [textGeometry])


    // const rotation1 = useRef(new Euler().setFromQuaternion(new Quaternion().random()).toArray() as unknown as number[]);
    // const rotation2 = useRef(new Euler().setFromQuaternion(new Quaternion().random()).toArray() as unknown as number[]);
    // const rotation3 = useRef(new Euler().setFromQuaternion(new Quaternion().random()).toArray() as unknown as number[]);

  
    return (
        <>
            <lightPositionContext.Provider value={lightPosition}>
                <Moon />
                <Ball />
                {/* <MainBall ballRadius={7} rotation={rotation1.current} />
                <MainBall ballRadius={6} rotation={rotation2.current}/>
                <MainBall ballRadius={3} rotation={rotation3.current}/> */}
                {/* <CV />
                <RSS />
                <About /> */}
                <Lines />
                <Stars />
                <MyLights />

                {/* <ThreeSurroundingText
                    text={'Weilue\'s Place'}
                    radius={9}
                    rotationZ={0}
                    // initOffset={Math.PI}
                    fadeInOnScrollSpeed={-1}
                /> */}


            </lightPositionContext.Provider>



            {textGeometry && <mesh geometry={textGeometry}>
                <meshBasicMaterial ref={textMeshRef} side={DoubleSide} transparent={true}/>
            </mesh>}

            <GradientBackground />
            <OrbitControls
                // ref={controlRef}
                enabled={true}
                enablePan={false}
                enableZoom={false}
                enableRotate={false}
                autoRotate={false}
                autoRotateSpeed={1.0}
            // minPolarAngle={polarAngle}
            // maxPolarAngle={maxPolarAngle}
            />

            <Stats showPanel={0} className={styles.panel1} />
            <Stats showPanel={1} className={styles.panel2} />
            <Stats showPanel={2} className={styles.panel3} />
        </>
    );
}


export function MyLights() {
    const lightRef = useRef();

    // useHelper(lightRef, SpotLightHelper, 'cyan')

    // const lightPosition = useContext(lightPositionContext)
    const lightPosition = new Vector3(10, 10, 10)

    const mapSize = getDeviceDependent(128, 512);
    // const position = useContext(lightPositionContext);

    return (
        <>
            <spotLight
                ref={lightRef}
                position={lightPosition}
                color={0xffffff}
                intensity={50}
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

            <ambientLight color={0xffffff} intensity={1.0} />
        </>
    );
}


export default function ThreeJsHome() {

    // const rotation = useRef(new Euler().setFromQuaternion(new Quaternion().random()).toArray() as unknown as number[]);
    // const rotation2 = useRef(new Euler().setFromQuaternion(new Quaternion().random()).toArray() as unknown as number[]);

    return (
        <MyCanvas>
            <MyContent />
            {/* <MainBall ballRadius={8} /> 
            <MainBall ballRadius={5} rotation={rotation2.current} delay={0.012}/> 
            <MainBall ballRadius={3} rotation={rotation.current} delay={0.01}/> 
            <MainBall ballRadius={3} rotation={rotation2.current} delay={0.02}/> 
            <PostEffect /> */}

        </MyCanvas>
    );
}

const tempColor = new Color()
const white = new Color(0xffffff);
const black = new Color(0x000000);

function PostEffect() {
    // const godray = useGodray();
    const sunRef = useRef<any>(null);
    const godrayRef = useRef<any>(null);
    const bloomRef = useRef<any>(null);
    const matRef = useRef<any>();

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
            // matRef.needsUpdate = true
            // console.log(MathUtils.clamp(-1/(scroll+1e-6)+9, 0, 1));
            // console.log(matRef.current.color);
            
            
        }
    })


    // const [godray, setGodray] = useState(null);
    // const handleSun = useCallback((sun) => {
    //     sunRef.current = sun
    //     setGodray(
    //         <GodRays
    //                 ref={godrayRef}
    //                 sun={sunRef.current}
    //                 blendFunction={BlendFunction.SCREEN}
    //                 samples={50}
    //                 density={0.97}
    //                 decay={0.85}
    //                 weight={0.6}
    //                 exposure={1}
    //                 clampMax={1}
    //                 // width={Resizer.AUTO_SIZE}
    //                 // height={Resizer.AUTO_SIZE}
    //                 kernelSize={KernelSize.LARGE}
    //                 blur={1}
    //             />
    //     )
    // }, [])

    return (
        <>
            <EffectComposer >
                <DepthOfField focusDistance={0.5} focalLength={5} bokehScale={5} height={480} />
                <Bloom ref={bloomRef} intensity={0.1} luminanceThreshold={0} luminanceSmoothing={0.75} height={200} />
                <Noise opacity={0.05} />
                <Vignette eskil={false} offset={0.1} darkness={1.1} /> 
                {/* {godray} */}
            </EffectComposer>
            {/* <mesh ref={handleSun}>
                <sphereGeometry args={[7.5, 32, 16]} />
                <meshStandardMaterial ref={matRef} emissive={white} />
            </mesh> */}
        </>
    )
}

// React.useLayoutEffect = React.useEffect;  // suppress useLayoutEffect warning, because we did not use it, dont know where it comes from


export function MyCanvas(props) {
    const onCreated = useCallback((state) => {
        state.setDpr(window.devicePixelRatio);
    }, []);

    const { children, ...otherProps } = props;

    return (
        <Canvas
            style={{
                height: '100%',
                width: '100%',
                position: 'fixed',
                top: 0,
                left: 0,
            }}
            // https://docs.pmnd.rs/react-three-fiber/api/canvas#render-props
            camera={{
                position: initCameraPosition.toArray(),
                fov: 50,
                near: 0.1,
                far: 100,
            }}
            gl={{
                antialias: true,
                outputEncoding: sRGBEncoding,
                toneMapping: ACESFilmicToneMapping,
                physicallyCorrectLights: true,
            }}
            raycaster={{}}
            shadows={true}
            onCreated={onCreated}
            {...otherProps}
        >
            {children}
        </Canvas>
    );
}
