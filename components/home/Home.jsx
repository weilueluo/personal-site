import { Canvas } from '@react-three/fiber'
import { MapControls } from '@react-three/drei'
import { useRef } from 'react';
import Plane from '../scene/Plane';
import MacBookMini from '../models/MacBookMini';
import Environment from '../scene/Environment';
import { Loader } from '@react-three/drei';
import { sRGBEncoding } from 'three';
import LoaderProgress from '../scene/LoaderProgress';
import ShibaDog from '../models/ShibaDog';
import MacBookPro from '../models/Macbookpro';
import WelcomeText from '../scene/WelcomeText';


export default function Home() {

    const controlsRef = useRef(null);

    return (
        <>
            <Canvas
                camera={{ position: [2, 2, 2] }}
                shadows={true}
                gl={{
                    outputEncoding: sRGBEncoding
                }}
            >
                <color attach="background" args={["gray"]} />
                <fogExp2 attach="fog" args={["gray", 0.2]} />

                <ambientLight args={['#ffffff']} intensity={0.01} />
                {/* <pointLight args={['#ffffff']}
                    position={[0, 1, 0]}
                    intensity={0.35}
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

                <spotLight args={['#ffffff']}
                    position={[0, 2, 0]}
                    intensity={1}
                    castShadow={true}
                    shadow-bias={-0.00001}  // solve z fighting
                    shadow-camera-near={0.1}
                    shadow-mapSize-width={1024}
                    shadow-mapSize-height={1024}
                    shadow-camera-far={1000}
                    shadow-camera-fov={30}
                    penumbra={0.5}
                    decay={1}
                    // shadow-camera-left={-10}
                    // shadow-camera-right={10}
                    // shadow-camera-top={10}
                    // shadow-camera-bottom={-10}
                />

                <Plane />

                <gridHelper args={[100, 100]} />
                <MapControls ref={controlsRef} />
                <Environment />
                {/* <MacBookMini /> */}
                <MacBookPro />
                <ShibaDog />
                <WelcomeText />
                
            </Canvas>
            <LoaderProgress />
        </>
    );
}