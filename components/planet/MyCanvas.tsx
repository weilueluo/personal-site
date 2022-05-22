import RootState, { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping, sRGBEncoding } from "three";
import React from "react";

export default function MyCanvas(props) {
    const {children, ...otherProps} = props
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

function onCreated(state: RootState.RootState) {
    state.setDpr(window.devicePixelRatio)
}