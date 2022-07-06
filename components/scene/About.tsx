import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Group, Mesh, Vector3 } from 'three';
import ThreeSurroundingText from '../Text/ThreeSurroundingText';
import { getDeviceDependent, useAltScroll, useMouseHover } from '../utils/hooks';

const tempVector = new Vector3(0, 0, 0);
const zeroVector = new Vector3(0, 0, 0);
const mobilePosition = new Vector3(3, 3, 3);
const desktopPosition = new Vector3(5, 5, 5);

export default function About() {
    const meshRef = useRef();

    const meshHovered = useMouseHover(meshRef);
    useEffect(() => {
        document.body.style.cursor = meshHovered ? 'pointer' : 'default';
    }, [meshHovered])

    const onClick = () => {
        if (meshHovered) {
            // window.alert("Not Ready Yet");
            window.open('/about.html');
        }
    };

    const scrollAmount = useAltScroll();
    const groupRef = useRef();
    const finalPosition = useMemo(() => getDeviceDependent(mobilePosition, desktopPosition), [])
    useFrame((state) => {
        const group = groupRef.current as Group
        if (!group) return;

        tempVector.lerpVectors(zeroVector, finalPosition, scrollAmount);
        group.position.set(tempVector.x, tempVector.y, tempVector.z)
    });

    return (
        <group ref={groupRef}>
            <ThreeSurroundingText
                text={'About'}
                radius={3.5}
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
            >
                <dodecahedronGeometry args={[2, 0]}/>
                <meshStandardMaterial
                    color={0xffffff}
                    emissive={0x0d2f5c}
                    emissiveIntensity={1}
                    transparent={true}
                    opacity={1}
                />
            </mesh>
        </group>
    );
}
