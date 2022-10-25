import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { Group, Vector3 } from 'three';
import { } from '../../common/hooks';
import { getDeviceDependent, isDevEnv } from '../../common/misc';
import { use3DHover, useAltScroll } from '../../common/threejs';
import { useInnerBallMaterial } from './hooks';
import ThreeSurroundingText from './ThreeSurroundingText';


const tempVector = new Vector3(0, 0, 0);
const zeroVector = new Vector3(0, 0, 0);
const mobilePosition = new Vector3(3, 3, 3);
const desktopPosition = new Vector3(5, 5, 5);

export default function About() {
    const meshRef = useRef();

    const meshHovered = use3DHover(meshRef);
    useEffect(() => {
        document.body.style.cursor = meshHovered ? 'pointer' : 'default';
    }, [meshHovered]);

    const onClick = () => {
        if (meshHovered) {
            if (isDevEnv()) {
                window.open('/about', '_self');
            } else {
                window.open('/about.html', '_self');
            }
        }
    };

    const scrollAmount = useAltScroll();
    const groupRef = useRef();
    const finalPosition = useMemo(
        () => getDeviceDependent(mobilePosition, desktopPosition),
        []
    );
    useFrame((state) => {
        const group = groupRef.current as Group;
        if (!group) return;

        tempVector.lerpVectors(zeroVector, finalPosition, scrollAmount);
        group.position.set(tempVector.x, tempVector.y, tempVector.z);
    });

    //shaders
    const material = useInnerBallMaterial(groupRef, meshRef, new Vector3(50, 168, 80).divideScalar(255.0))

    const sphereRadius = getDeviceDependent(1.5, 2)
    const textRadius = getDeviceDependent(2, 3)
    const ballDetails = getDeviceDependent(16, 32)

    return (
        <group ref={groupRef}>
            <ThreeSurroundingText
                text={'About'}
                radius={textRadius}
                rotationZ={Math.PI / 2}
                initOffset={Math.PI / 4}
                expandOnScrollSpeed={0}
                fadeInOnScrollSpeed={1}
            />

            <mesh
                ref={meshRef}
                castShadow
                receiveShadow
                onClick={onClick}
                rotation={[Math.PI / 4, 0, 0]}
                material={material}
            >
                <sphereBufferGeometry args={[sphereRadius, ballDetails, ballDetails]} />
            </mesh>
        </group>
    );
}
