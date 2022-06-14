import { OrbitControls, Stats } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, SMAA } from '@react-three/postprocessing';
import { useMemo, useRef } from 'react';
import {
    ACESFilmicToneMapping, sRGBEncoding
} from 'three';
import Ball from '../scene/Ball';
import CV from '../scene/CV';
import { useNScrollPages } from '../scene/global';
import GradientBackground from '../scene/GradientBackground';
import Lines from '../scene/Lines';
import LoaderProgress from '../scene/LoaderProgress';
import Stars from '../scene/Stars';
import SurroundingText from '../Text/SurroundingText';

const pages = useNScrollPages();

function Content() {
    return (
        <>
            {/* <MainBall /> */}
            <Ball />
            <CV />
            <Lines />
            {/* <MainBall scale={5}/> */}
            <Stars />
            <SurroundingText
                text={"Weilue's Place"}
                rotationZ={0}
                initOffset={Math.PI}
            />
            <SurroundingText
                text={"Weilue's Place"}
                rotationZ={Math.PI / 4}
                initOffset={Math.PI / 2}
            />
            <SurroundingText
                text={"Weilue's Place"}
                rotationZ={-Math.PI / 4}
                initOffset={-Math.PI / 2}
            />
            <GradientBackground />
            <Lights />

            <OrbitControls enablePan={false} enableZoom={false} />

            <EffectComposer multisampling={8}>
                {/* https://docs.pmnd.rs/react-postprocessing */}
                <SMAA />
            </EffectComposer>

            <Stats />
        </>
    );
}

function Lights() {
    const lightRef = useRef();

    // useHelper(lightRef, DirectionalLightHelper, 0x000000)

    return (
        <>
            <directionalLight
                ref={lightRef}
                position={[100, 100, 0]}
                color={0xffffff}
                intensity={5}
                castShadow
                shadow-mapSize-height={512}
                shadow-mapSize-width={512}
                shadow-camera-near={0.1}
                shadow-camera-far={20}
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
            />

            <pointLight
                position={[0, 0, 0]}
                color={0xffffff}
                intensity={5}
                castShadow
                shadow-mapSize-height={512}
                shadow-mapSize-width={512}
                shadow-camera-near={0.1}
                shadow-camera-far={20}
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
            />

            <ambientLight color={0xffffff} intensity={0.3} />
        </>
    );
}

export default function Home() {
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

function MyCanvas(props) {
    const onCreated = useMemo(
        () => (state) => {
            state.setDpr(window.devicePixelRatio);
        },
        []
    );

    const { children, ...otherProps } = props;

    return (
        <Canvas
            style={{
                height: '100vh',
                width: '100vw',
                position: 'fixed',
                top: 0,
                left: 0,
            }}
            // https://docs.pmnd.rs/react-three-fiber/api/canvas#render-props
            camera={{
                position: [0, 10, 10],
                fov: 100,
                near: 0.1,
                far: 1000,
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
