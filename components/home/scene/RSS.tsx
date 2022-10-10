import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { Group, Vector3 } from 'three';
import {
    getDeviceDependent, use3DHover, useAltScroll
} from '../../utils/hooks';
import { isDevEnv } from '../../utils/utils';
import { useInnerBallMaterial } from './hooks';
import ThreeSurroundingText from './ThreeSurroundingText';


const tempVector = new Vector3(0, 0, 0);
const zeroVector = new Vector3(0, 0, 0);
const mobilePosition = new Vector3(-3, -3, -3);
const desktopPosition = new Vector3(-5, -5, -5);


export default function RSS() {
    
    const meshRef = useRef();

    const meshHovered = use3DHover(meshRef);
    useEffect(() => {
        document.body.style.cursor = meshHovered ? 'pointer' : 'default';
    }, [meshHovered]);

    const onClick = () => {
        if (meshHovered) {
            if (isDevEnv()) {
                window.open('/rss');
            } else {
                window.open('/rss.html');
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
     const material = useInnerBallMaterial(groupRef, meshRef, new Vector3(235, 64, 52).divideScalar(255.0))

    const sphereRadius = getDeviceDependent(1.5, 2)
    const textRadius = getDeviceDependent(2, 3)
    const ballDetails = getDeviceDependent(16, 32)

    return (
        <group ref={groupRef}>
            <ThreeSurroundingText
                text={'RSS'}
                radius={textRadius}
                rotationZ={Math.PI / 2}
                initOffset={-Math.PI / 3}
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
