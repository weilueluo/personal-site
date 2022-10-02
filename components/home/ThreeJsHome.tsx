import { OrbitControls, Stats } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import React from 'react';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ACESFilmicToneMapping, sRGBEncoding, Vector3 } from 'three';
import styles from '../styles/StatsPanel.module.sass';
import { lightPositionContext } from '../utils/context';
import { getDeviceDependent, initMobileScroll } from '../utils/hooks';
import { polar2xyz } from '../utils/utils';
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


const tempVector3 = new Vector3(10, 10, 0);

function Content() {
    const enableOrbitControl = getDeviceDependent(false, true); // disable scroll on mobile, because it is used to play animation

    useEffect(() => {
        initMobileScroll();
    }, []);

    const [lightPosition, setLightPosition] = useState(tempVector3);
    let theta = 0;
    const thetaSpeed = 0.04;
    let phi = 0.3;
    const phiSpeed = 0.00;
    const moonRadius = getDeviceDependent(8, 10);

    // rotate light source around ball
    useFrame(() => {
        theta += Math.atan2(thetaSpeed, moonRadius);
        phi += Math.atan2(phiSpeed, moonRadius);
        const [x, y, z] = polar2xyz(theta, phi, moonRadius);
        tempVector3.set(x, y, z);
        setLightPosition(tempVector3);
    })

    return (
        <>
            <lightPositionContext.Provider value={lightPosition}>
                <Moon />
                <Ball />
                <CV />
                <RSS />
                <About />
                <Lines />
                <Stars />
        
                <GradientBackground />
                <Lights />
            </lightPositionContext.Provider>
            
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

            <Stats showPanel={0} className={styles.panel1} />
            <Stats showPanel={1} className={styles.panel2} />
            <Stats showPanel={2} className={styles.panel3} />
        </>
    );
}


function Lights() {
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


export default function Home() {
    const [pages, setPages] = useState(1)

    useEffect(() => {
        setPages(getNScrollPages())
    }, [])

    return (
        <>
            <MyCanvas>
                <Content />
            </MyCanvas>
            <LoaderProgress />
            <div>
                <div style={{ height: `${pages * 100}vh`, width: `100vw` }} />
            </div>
        </>
    );
}

React.useLayoutEffect = React.useEffect;  // suppress useLayoutEffect warning, because we did not use it, dont know where it comes from
function MyCanvas(props) {
    const onCreated = useMemo(() => (state) => {
        state.setDpr(window.devicePixelRatio);
    }, []);

    const { children, ...otherProps } = props;
    
    return (
        <Canvas
            style={{
                height: '100vh',
                width: '100vw',
                position: 'fixed',
                top: 0,
                left: 0,
                overflowY: 'scroll',
            }}
            // https://docs.pmnd.rs/react-three-fiber/api/canvas#render-props
            camera={{
                position: [0, 20, 20],
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
