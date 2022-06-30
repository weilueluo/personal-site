import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import ThreeSurroundingText from '../Text/ThreeSurroundingText';
import { useMouseHover } from '../utils/hooks';

export default function CV() {
    const meshRef = useRef();

    const meshHovered = useMouseHover(meshRef);

    useFrame((state) => {
        const mesh = meshRef.current;
        if (!mesh) {
            return;
        }

        if (meshHovered) {
            document.body.style.cursor = 'pointer';
        } else {
            document.body.style.cursor = 'default';
        }
    });

    const openCVOnClick = () => {
        if (meshHovered) {
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
                onClick={openCVOnClick}
                rotation={[Math.PI / 4, 0, 0]}
            >
                <tetrahedronGeometry args={[2, 0]} />
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
