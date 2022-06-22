import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import SurroundingText from '../Text/SurroundingText';
import { checkIntersect, useMouseHover } from '../utils/hooks';

export default function CV() {
    const meshRef = useRef();

    const meshHovered = useMouseHover(meshRef)

    useFrame((state) => {

        const mesh = meshRef.current
        if (!mesh) {
            return
        }

        if (meshHovered) {
            document.body.style.cursor = 'pointer'
        } else {
            document.body.style.cursor = 'default'
        }

    });

    const openCVOnClick = () => {
        if (meshHovered) {
            window.open('/docs/weilue_cv.pdf', '_blank');
        }
    }

    return (
        <>
            <SurroundingText
                text={'CV'}
                radius={2.5}
                rotationZ={0}
                initOffset={0}
                expandOnScrollSpeed={0}
            />
            <SurroundingText
                text={'CV'}
                radius={2.5}
                rotationZ={Math.PI / 4}
                initOffset={Math.PI}
                expandOnScrollSpeed={0}
            />
            <SurroundingText
                text={'CV'}
                radius={2.5}
                rotationZ={-Math.PI / 4}
                initOffset={Math.PI / 2}
                expandOnScrollSpeed={0}
            />
            
            <mesh ref={meshRef} castShadow receiveShadow onClick={openCVOnClick}>
                <tetrahedronGeometry args={[2, 0]} />
                <meshStandardMaterial
                    color={0xffffff}
                    emissive={0x45a9c4}
                    emissiveIntensity={1}
                    transparent={true}
                    opacity={1}
                />
            </mesh>
        </>
    );
}