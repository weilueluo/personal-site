import { Canvas } from '@react-three/fiber'
import { MapControls } from '@react-three/drei'
import { useContext, useRef } from 'react';
import Plane from '../scene/Plane';
import Environment from '../scene/Environment';
import LoaderProgress from '../scene/LoaderProgress';
import ShibaDog from '../models/ShibaDog';
import MacBookPro from '../models/Macbookpro';
import WelcomeText from '../scene/WelcomeText';
import { ConfigContext } from '../context/ConfigContext';
import Rushia from '../models/Rushia';
import Gura from '../models/Gura';
import SmolComputer from '../models/SmolComputer';
import Jelly from '../models/Jelly';

export default function Home() {

    const controlsRef = useRef(null);
    const config = useContext(ConfigContext)

    return (
        <>
            <Canvas
                camera={{ 
                    position: [-10, 5, 10], 
                    fov: 75,
                    near: 0.1,
                    far: config['mapSize']
                }}
                shadows={true}
            >
                <color attach="background" args={["gray"]} />
                <fogExp2 attach="fog" args={["gray", 0.05]} />

                <ambientLight args={['#ffffff']} intensity={1} />
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
                    position={[0, 6, 0]}
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
                    // shadow-camera-left={-10}
                    // shadow-camera-right={10}
                    // shadow-camera-top={10}
                    // shadow-camera-bottom={-10}
                />

                <Plane />

                <gridHelper args={[config['mapSize'], config['mapSize']]} />
                <MapControls ref={controlsRef} />
                <Environment />
                <MacBookPro />
                <ShibaDog />
                <WelcomeText />
                <SmolComputer />
                <Jelly />
                
            </Canvas>
            <LoaderProgress />
        </>
    );
}
