import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { Group, Matrix3, Matrix4, Vector3 } from 'three';
import ThreeSurroundingText from '../Text/ThreeSurroundingText';
import {
    getDeviceDependent,
    useAltScroll,
    use3MouseHover
} from '../utils/hooks';
import { isDevEnv } from '../utils/utils';
import { useInnerBallMaterial } from './hooks';


const tempVector = new Vector3(0, 0, 0);
const zeroVector = new Vector3(0, 0, 0);
const mobilePosition = new Vector3(3, 3, 3);
const desktopPosition = new Vector3(5, 5, 5);

export default function About() {
    const meshRef = useRef();

    const meshHovered = use3MouseHover(meshRef);
    useEffect(() => {
        document.body.style.cursor = meshHovered ? 'pointer' : 'default';
    }, [meshHovered]);

    const onClick = () => {
        if (meshHovered) {
            if (isDevEnv()) {
                window.open('/about');
            } else {
                window.open('/about.html');
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
                {/* <meshStandardMaterial
                    color={0x9f34eb}
                    emissive={0x0d2f5c}
                    emissiveIntensity={1}
                    transparent={true}
                    opacity={1}
                /> */}
            </mesh>
        </group>
    );
}
