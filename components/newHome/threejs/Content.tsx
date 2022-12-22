import { OrbitControls, Sparkles } from '@react-three/drei';
import { useContext } from 'react';
import { Euler, Quaternion } from 'three';
import { lightPositionContext } from '../../common/contexts';
import ThreeJsLights from './Lights';
import GradientBackground from './gradientBackground/GradientBackground';
import MainBall from './mainBall//MainBall';
import Moon from './moon/Moon';
import ThreeRotateText from './rotateText/ThreeRotateText';
import ThreeJsStats from './stats/Stats';

const rotation1 = new Euler()
    .setFromQuaternion(new Quaternion().random())
    .toArray() as unknown as number[];
const rotation2 = new Euler()
    .setFromQuaternion(new Quaternion().random())
    .toArray() as unknown as number[];

export default function ThreeJsContent() {
    const lightPosition = useContext(lightPositionContext);

    // const handleAxesHelper = (axesHelper:  AxesHelper) => {
    //     axesHelper.setColors('red', 'blue', 'green');
    // }

    return (
        <>
            <GradientBackground />
            <ThreeJsStats />
            <Moon />
            <MainBall ballRadius={6} float={true} />
            <MainBall ballRadius={3} rotation={rotation1} delay={0.012} />
            <MainBall ballRadius={2} rotation={rotation2} delay={0.01} />

            {/* <axesHelper ref={handleAxesHelper} args={[100]} /> */}
            <ThreeRotateText
                text={"Weilue's Place"}
                radius={7.5}
                rotationZ={0}
                fadeInOnScrollSpeed={-1}
            />

            <Sparkles
                count={500}
                scale={50}
                size={20}
                speed={1}
                opacity={0.75}
                noise={5}
            />

            <lightPositionContext.Provider value={lightPosition}>
                <ThreeJsLights />
            </lightPositionContext.Provider>

            {/* <ThreeJsPostEffects /> */}

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
