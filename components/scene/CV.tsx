import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import ThreeSurroundingText from '../Text/ThreeSurroundingText';
import { getDeviceDependent, useMouseHover } from '../utils/hooks';

export default function CV(props) {
    const lightPosition = props.lightPosition;
    
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

    const sphereRadius = getDeviceDependent(1.5, 2)
    const textRadius = getDeviceDependent(2, 3)
    const ballDetails = getDeviceDependent(16, 32)

    return (
        <>
            <ThreeSurroundingText
                text={'CV'}
                radius={textRadius}
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
                <sphereBufferGeometry args={[sphereRadius, ballDetails, ballDetails]} />
                <meshStandardMaterial
                    color={0x34d3eb}
                    emissive={0x0d2f5c}
                    emissiveIntensity={1}
                    transparent={true}
                    opacity={1}
                />
            </mesh>
        </>
    );
}
