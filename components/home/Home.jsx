import { Canvas } from '@react-three/fiber'
import { MapControls, useHelper } from '@react-three/drei'
import { useContext, useRef } from 'react';
import Plane from '../scene/Plane';
import LoaderProgress from '../scene/LoaderProgress';
import MacBookPro from '../models/Macbookpro';
import WelcomeText from '../scene/WelcomeText';
import { ConfigContext } from '../context/ConfigContext';
import Jelly from '../models/Jelly';
import Sun from '../scene/Sun';
import Sunlight from '../scene/Sunlight';
import { PointLightHelper } from 'three';


export default function Home() {

    const controlsRef = useRef(null);
    const config = useContext(ConfigContext)

    return (
        <>
            <Canvas
                camera={{
                    position: [-30, 15, 0],
                    fov: 75,
                    near: 0.1,
                    far: config['mapSize'] * 2
                }}
                shadows={true}
            >
                <color attach="background" args={[0xc2c2c2]} />
                {/* <fogExp2 attach="fog" args={["gray", 0.05]} /> */}

                <ambientLight args={['#ffffff']} intensity={1} />
                {/* <pointLight args={['#ffffff']}
                    position={[0, 10, 0]}
                    intensity={10}
                    castShadow={true}
                    shadow-bias={-0.00001}
                    shadow-camera-near={0.1}
                    shadow-mapSize-width={4096}
                    shadow-mapSize-height={4096}
                    shadow-camera-far={20}
                    shadow-camera-left={-10}
                    shadow-camera-right={10}
                    shadow-camera-top={10}
                    shadow-camera-bottom={-10}
                /> */}

                {/* <spotLight args={['#ffffff']}
                    position={[20, 10, 20]}
                    intensity={10}
                    castShadow={true}
                    shadow-bias={-0.00001}  // solve z fighting
                    shadow-camera-near={0.1}
                    shadow-mapSize-width={config['mapSize']}
                    shadow-mapSize-height={config['mapSize']}
                    shadow-camera-far={1000}
                    shadow-camera-fov={30}
                    penumbra={0.5}
                    decay={1}
                    shadow-camera-left={-10}
                    shadow-camera-right={10}
                    shadow-camera-top={10}
                    shadow-camera-bottom={-10}
                /> */}


                <Plane />
                <Sun />


                <gridHelper args={[config['mapSize'], config['mapSize']]} />
                <MapControls ref={controlsRef} />
                {/* <Environment /> */}
                <MacBookPro />
                {/* <ShibaDog /> */}
                <WelcomeText />
                {/* <SmolComputer /> */}
                <Jelly />
                {/* <PurplePlanet /> */}
                {/* <Mona /> */}

            </Canvas>
            <LoaderProgress />
        </>
    );
}
