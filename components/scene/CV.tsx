import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import ThreeSurroundingText from '../Text/ThreeSurroundingText';
import { useMouseHover } from '../utils/hooks';

export default function CV() {
    const meshRef = useRef();

    const meshHovered = useMouseHover(meshRef);
    useEffect(() => {
        document.body.style.cursor = meshHovered ? 'pointer' : 'default';
    }, [meshHovered])

    const onClick = () => {
        if (meshHovered) {  // ensure it is not a pass-through click
            window.open(
                'https://github.com/Redcxx/cv/blob/master/resume.pdf',
                '_blank'
            );
        }
    };

    return (
        <>
            <ThreeSurroundingText
                text={'CV'}
                radius={2.5}
                rotationZ={0}
                initOffset={0}
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
                <sphereBufferGeometry args={[2, 12, 6]} />
                <meshStandardMaterial
                    color={0xffffff}
                    emissive={0x0d2f5c}
                    emissiveIntensity={1}
                    transparent={true}
                    opacity={1}
                />
            </mesh>
        </>
    );
}
