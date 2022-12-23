import { OrbitControls, Sparkles } from '@react-three/drei';
import { useCallback, useContext, useRef } from 'react';
import { AxesHelper, Euler, Quaternion, Vector3 } from 'three';
import { lightPositionContext } from '../../common/contexts';
import ThreeJsLights from './Lights';
import GradientBackground from './gradientBackground/GradientBackground';
import MainBall from './mainBall//MainBall';
import Moon from './moon/Moon';
import ThreeRotateText from './rotateText/ThreeRotateText';
import ThreeJsStats from './stats/Stats';
import { ThreeJsPostEffects } from './PostEffects';
import Lines from './lines/Lines';
import { useFrame } from '@react-three/fiber';
import { Rotator3D } from '../../common/rotate';

const rotation1 = new Euler()
    .setFromQuaternion(new Quaternion().random())
    .toArray() as unknown as number[];
const rotation2 = new Euler()
    .setFromQuaternion(new Quaternion().random())
    .toArray() as unknown as number[];
const tempVec3 = new Vector3(10, 10, 0);


export default function ThreeJsContent() {
    const lightPosition = tempVec3;

    const rotator = useRef(new Rotator3D(0,0,8.5,0.01));

    useFrame(state => {
        lightPosition.set(...rotator.current.next(0.003, 0.005))
    })

    // const handleAxesHelper = useCallback( (axesHelper:  AxesHelper) => {
    //     axesHelper.setColors('red', 'blue', 'green');
    // }, [])

    return (
        <>
            <GradientBackground />
            <ThreeJsStats />
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
                <Moon />
                <Lines />
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
