import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, SMAA } from '@react-three/postprocessing';
import React, { useMemo } from "react";
import { ACESFilmicToneMapping, sRGBEncoding } from "three";
import MainBall from "../planet/MainBall";
import GradientBackground from "../scene/GradientBackground";
import SurroundingText from "../Text/SurroundingText";

const pages = 10

function Content() {
    return (
        <>
            <MainBall />
            <MainBall scale={5}/>
            <SurroundingText text={'Hello World'} />
            <GradientBackground />

            <OrbitControls enablePan={false} enableZoom={false} />

            <EffectComposer multisampling={8}>
                {/* https://docs.pmnd.rs/react-postprocessing */}
                <SMAA />
            </EffectComposer>
        </>
    )
}

export default function Home() {
    return (
        <>
            <MyCanvas>
                <Content />
            </MyCanvas>
            <div>
                <div style={{ height: `${pages * 100}vh`, width: `100vw` }} />
            </div>
        </>
    );
}

function MyCanvas(props) {

    const onCreated = useMemo(() => state => {
          state.setDpr(window.devicePixelRatio)
    }, [])


    const { children, ...otherProps } = props

    return (
          <Canvas
                style={{
                      height: '100vh',
                      width: '100vw',
                      position: 'fixed',
                      top: 0,
                      left: 0
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
                      physicallyCorrectLights: true
                }}
                raycaster={{}}
                shadows={true}
                onCreated={onCreated}
                {...otherProps}
          >
                {children}
          </Canvas>
    )
}