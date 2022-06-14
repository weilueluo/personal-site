import { CycleRaycast } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { useEffect, useRef } from 'react';
import { Raycaster, Vector2 } from 'three';
import SurroundingText from '../Text/SurroundingText';
import { BlurPass, Resizer, KernelSize } from 'postprocessing';
import { useMouseHover } from '../utils/hooks';

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
            
            <mesh ref={meshRef} castShadow receiveShadow onClick={openCV}>
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

function openCV() {
    window.open('/docs/weilue_cv.pdf', '_blank')
}