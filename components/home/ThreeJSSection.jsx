import { Canvas } from '@react-three/fiber'
import { MapControls } from '@react-three/drei'
import { useRef } from 'react';
import Plane from '../scene/Plane';
import MacBookMini from '../scene/MacBookMini';

export default function ThreeJSSection() {

    const controlsRef = useRef(null);

    // useHelper(plightRef, PointLightHelper, 'cyan');
    
    return (
        <Canvas camera={{ position: [2,1,2] }} shadows>
            <color attach="background" args={["gray"]} />

            <ambientLight args={['#ffffff']} intensity={0.4}/>
            <directionalLight
                position={[5, 7, 0]}
                intensity={1.5}
                castShadow={true}
                shadowBias={-0.00001}
                shadow-camera-near={0.1}
                shadow-mapSize-width={4096}
                shadow-mapSize-height={4096}
                shadow-camera-far={20}
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
            />
            {/* <pointLight args={['#ffffff']} intensity={5} position={[0, 3, 0]} receiveShadow={true} shadow={true}/> */}
            {/* <spotLight args={['#ffffff', 2, 100, Math.PI/2]} /> */}

            <fogExp2 attach="fog" args={["gray", 0.2]} />

            {/* <Sky castShadow={true} distance={40} sunPosition={[1, 1, 0]} /> */}

            {/* <Plane
                receiveShadow={true}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0, 0]}
                args={[1000, 1000]}
            >
                <shadowMaterial attach="material" opacity={0.3} />
            </Plane> */}
            <Plane />

            <gridHelper args={[20, 100]} />
            <MapControls ref={controlsRef} />

            <MacBookMini position={[0, 0.1, 0]} scale={[0.001,0.001,0.001]} />

        </Canvas>
    );
}