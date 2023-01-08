import { OrbitControls, Sparkles, Stars } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useContext, useRef } from 'react';
import { Euler, Quaternion, Vector3 } from 'three';
import { lightPositionContext } from '../../common/contexts';
import { getDeviceDependent } from '../../common/misc';
import { Rotator3D } from '../../common/rotate';
import { PostEffectModeContext } from '../options/OptionsManager';
import ThreeJsLights from './Lights';
import { ThreeJsPostEffects } from './PostEffects';
import GradientBackground from './gradientBackground/GradientBackground';
import Lines from './lines/Lines';
import MainBall from './mainBall//MainBall';
import Moon from './moon/Moon';
import ThreeRotateText from './rotateText/ThreeRotateText';
import ThreeJsStats from './stats/Stats';
import CameraMovement from './camera/CameraMovement';

const rotation1 = new Euler()
    .setFromQuaternion(new Quaternion().random())
    .toArray() as unknown as number[];
const rotation2 = new Euler()
    .setFromQuaternion(new Quaternion().random())
    .toArray() as unknown as number[];
const tempVec3 = new Vector3(10, 10, 0);

export default function ThreeJsCanvasContent() {
    const lightPosition = tempVec3;

    // const handleAxesHelper = useCallback( (axesHelper:  AxesHelper) => {
    //     axesHelper.setColors('red', 'blue', 'green');
    // }, [])

    const usePostEffects = useContext(PostEffectModeContext);

    const outerBallRadius = getDeviceDependent(3.5, 6);
    const innerBallRadius1 = outerBallRadius / 2;
    const innerBallRadius2 = outerBallRadius / 3;
    const godRayRadius = outerBallRadius - getDeviceDependent(0.1, 1);
    const rotateTextRadius = outerBallRadius + getDeviceDependent(1, 1.5);
    const rotateLightRadius = outerBallRadius + getDeviceDependent(2, 2.5);

    // move light position around
    const rotator = useRef(new Rotator3D(0, 0, rotateLightRadius, 0.01));
    useFrame(() => {
        lightPosition.set(...rotator.current.next(0.003, 0.005));
    });

    return (
        <>
            <GradientBackground />
            <MainBall
                ballRadius={outerBallRadius}
                float={true}
                rotate={true}
                rotateSpeed={1}
            />
            <MainBall
                ballRadius={innerBallRadius1}
                rotation={rotation1}
                delay={0.02}
                rotate={true}
                rotateSpeed={0.5}
            />
            <MainBall
                ballRadius={innerBallRadius2}
                rotation={rotation2}
                delay={0.01}
                rotate={true}
                rotateSpeed={0.25}
            />

            {/* <axesHelper ref={handleAxesHelper} args={[100]} /> */}
            <ThreeRotateText
                text={"Weilue's Place"}
                radius={rotateTextRadius}
                rotationZ={0}
                fadeInOnScrollSpeed={-1}
            />

            {/* <CameraMovement /> */}

            <lightPositionContext.Provider value={lightPosition}>
                <ThreeJsLights />
                <Moon />
                <Lines />
            </lightPositionContext.Provider>

            <Stars
                radius={1}
                depth={50}
                count={usePostEffects ? 500 : 2000}
                factor={4}
                saturation={1}
                fade
                speed={1.2}
            />

            {usePostEffects && (
                <>
                    <ThreeJsPostEffects godRayRadius={godRayRadius} />
                    <Sparkles
                        count={getDeviceDependent(250, 400)}
                        scale={getDeviceDependent(35, 50)}
                        size={getDeviceDependent(15, 20)}
                        speed={1}
                        opacity={0.5}
                        noise={5}
                    />
                </>
            )}

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
            {/* <ThreeJsStats /> */}
                
        </>
    );
}
