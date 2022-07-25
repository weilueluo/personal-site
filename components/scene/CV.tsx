import { useFrame } from '@react-three/fiber';
import { useContext, useEffect, useRef } from 'react';
import { Group, Matrix3, Matrix4, ShaderMaterial, Vector3 } from 'three';
import ThreeSurroundingText from '../Text/ThreeSurroundingText';
import { lightPositionContext } from '../utils/context';
import { getDeviceDependent, useMouseHover } from '../utils/hooks';
import inner_ball_vs from '../shaders/inner_ball_vs.glsl'
import inner_ball_fs from '../shaders/inner_ball_fs.glsl'
import { useInnerBallMaterial } from './hooks';


const tempMat3 = new Matrix3()
const tempMat4 = new Matrix4()
const tempVector = new Vector3(0, 0, 0);

export default function CV() {
    
    const meshRef = useRef();

    const meshHovered = useMouseHover(meshRef);
    useEffect(() => {
        document.body.style.cursor = meshHovered ? 'pointer' : 'default';
    }, [meshHovered])

    const onClick = () => {
        if (meshHovered) {  // ensure it is not a pass-through click
            window.open(
                'https://github.com/Redcxx/cv',
                '_blank'
            );
        }
    };

    //shaders
    const groupRef = useRef()
    const material = useInnerBallMaterial(groupRef, meshRef, new Vector3(52, 211, 235).divideScalar(255.0))

    const sphereRadius = getDeviceDependent(1.5, 2)
    const textRadius = getDeviceDependent(2, 3)
    const ballDetails = getDeviceDependent(16, 32)

    return (
        <group ref={groupRef}>
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
                material={material}
            >
                <sphereBufferGeometry args={[sphereRadius, ballDetails, ballDetails]} />
                {/* <meshStandardMaterial
                    color={0x34d3eb}
                    emissive={0x0d2f5c}
                    emissiveIntensity={1}
                    transparent={true}
                    opacity={1}
                /> */}
            </mesh>
        </group>
    );
}
