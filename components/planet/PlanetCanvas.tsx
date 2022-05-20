import { Canvas } from "@react-three/fiber"
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal } from "react"
import RootState from '@react-three/fiber'
import { OrbitControls } from "@react-three/drei"
import { ACESFilmicToneMapping, sRGBEncoding } from "three"
import styles from './Planet.module.sass'

export default function PlanetCanvas(props: { children: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | ReactFragment | ReactPortal }) {
    return (
        <Canvas
        className={styles.planet}
            // https://docs.pmnd.rs/react-three-fiber/api/canvas#render-props
            camera={{
                position: [0, 0, 500],
                fov: 50,
                near: 0.1,
                far: 1000,
            }}
            gl={{
                antialias: true,
                outputEncoding: sRGBEncoding,
                toneMapping: ACESFilmicToneMapping,
                physicallyCorrectLights: true
            }}
            raycaster={{

            }}
            shadows={true}
            // dpr={window.devicePixelRatio}
            onCreated={onCreated}
            // onPointerMissed={event => { }}
        >
            <pointLight
                args={[0xffffff, 1]}
                position={[200, 200, 200]}
            />
            {props.children}
            <OrbitControls />
        </Canvas>
    )
}

function onCreated(state: RootState.RootState) {
    state.setDpr(window.devicePixelRatio)
}