import { Canvas } from '@react-three/fiber'
import { MapControls } from '@react-three/drei'
import { useRef } from 'react';
import Plane from '../scene/Plane';
import MacBookMini from '../scene/MacBookMini';

export default function Home() {

    const controlsRef = useRef(null);

    // useHelper(plightRef, PointLightHelper, 'cyan');
    
    return (
        <Canvas camera={{ position: [2,1,2] }} shadows>
            <color attach="background" args={["gray"]} />
            <fogExp2 attach="fog" args={["gray", 0.2]} />

            <ambientLight args={['#ffffff']} intensity={0.4}/>
            <pointLight args={['#ffffff']}
                position={[0, 1, 0]}
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

            <Plane />

            <gridHelper args={[100, 100]} />
            <MapControls ref={controlsRef} />
            
            <MacBookMini/>
        </Canvas>
    );
}