import { OrbitControls, Sparkles } from '@react-three/drei';
import { BaseProps } from '../../types/react';
import GradientBackground from './gradientBackground/GradientBackground';
import ThreeJsStats from './stats/Stats';
import MainBall from '../../playground/MainBall';
import ThreeSurroundingText from '../../home/scene/ThreeSurroundingText';
import Stars from '../../home/scene/Stars';
import { Vector3 } from 'three';
import { useState } from 'react';
import { lightPositionContext } from '../../common/contexts';
import ThreeJsLights from './Lights';
import { ThreeJsPostEffects } from './PostEffects';

const tempVec3 = new Vector3(10, 10, 0);

export default function ThreeJsContent(props: BaseProps) {
    const [lightPosition, setLightPosition] = useState(tempVec3);

    return (
        <>
            <GradientBackground />
            <ThreeJsStats />
            <MainBall ballRadius={6} float={true}/>

            <ThreeSurroundingText
                text={'Weilue\'s Place'}
                radius={7.5}
                rotationZ={0}
                fadeInOnScrollSpeed={-1}
            />

            <Sparkles count={500} scale={50} size={20} speed={1} opacity={0.75} noise={5} />

            <lightPositionContext.Provider value={lightPosition}>
                {/* <ThreeJsLights /> */}
            </lightPositionContext.Provider>

            <ThreeJsPostEffects />

            <OrbitControls
                // ref={controlRef}
                enabled={true}
                enablePan={false}
                enableZoom={false}
                enableRotate={true}
                autoRotate={false}
                autoRotateSpeed={1.0}
                // minPolarAngle={polarAngle}
                // maxPolarAngle={maxPolarAngle}
            />
        </>
    );
}
