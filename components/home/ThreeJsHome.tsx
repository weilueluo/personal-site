import { OrbitControls, Stats } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ACESFilmicToneMapping, sRGBEncoding, Vector3 } from 'three';
import { lightPositionContext } from '../common/contexts';
import { polar2xyz } from '../common/math';
import { getDeviceDependent } from '../common/misc';
import { initMobileScroll } from '../common/scroll';
import { useAltScroll } from '../common/threejs';
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
import styles from './StatsPanel.module.sass';


const tempVector3 = new Vector3(10, 10, 0);
const tempVec3 = new Vector3();
const initCameraPosition = new Vector3(0, 20, 20)
const targetCameraPosition = new Vector3(10, 10, -20);

export function MyContent() {
    const enableOrbitControl = getDeviceDependent(false, true); // disable scroll on mobile, because it is used to play animation

    useEffect(() => {
        initMobileScroll();
    }, []);


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
    const scrolledAmount = useAltScroll();
    useFrame(state => {
        tempVec3.lerpVectors(initCameraPosition, targetCameraPosition, scrolledAmount);
        state.camera.position.set(...tempVec3.toArray());
    })

    return (
        <>
            <lightPositionContext.Provider value={lightPosition}>
                <Moon />
                <Ball />
                {/* <CV />
                <RSS />
                <About /> */}
                <Lines />
                <Stars />
                <MyLights />
            </lightPositionContext.Provider>

            <GradientBackground />
            <OrbitControls
                // ref={controlRef}
                enabled={true}
                enablePan={false}
                enableZoom={false}
                enableRotate={enableOrbitControl}
                autoRotate={!enableOrbitControl}
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

    const mapSize = getDeviceDependent(128, 512);
    const position = useContext(lightPositionContext);

    return (
        <>
            <spotLight
                ref={lightRef}
                position={position}
                color={0xffffff}
                intensity={5}
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

    return (
        <>
            <MyCanvas>
                <MyContent />
            </MyCanvas>
            <LoaderProgress />
        </>
    );
}

React.useLayoutEffect = React.useEffect;  // suppress useLayoutEffect warning, because we did not use it, dont know where it comes from


export function MyCanvas(props) {
    const onCreated = useMemo(() => (state) => {
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
            shadowMap={true}
            shadows={true}
            onCreated={onCreated}
            {...otherProps}
        >
            {children}
        </Canvas>
    );
}
