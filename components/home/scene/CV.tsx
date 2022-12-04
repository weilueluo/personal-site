import { useEffect, useRef } from 'react';
import { Vector3 } from 'three';
import { getDeviceDependent, isDevEnv } from '../../common/misc';
import { use3DHover } from '../../common/threejs';
import { useInnerBallMaterial } from './hooks';
import ThreeSurroundingText from './ThreeSurroundingText';


export default function CV() {

    const meshRef = useRef();

    const meshHovered = use3DHover(meshRef);
    useEffect(() => {
        document.body.style.cursor = meshHovered ? 'pointer' : 'default';
    }, [meshHovered])

    const onClick = () => {
        if (meshHovered) {  // ensure it is not a pass-through click
            // window.open(
            //     'https://github.com/Redcxx/cv',
            //     '_blank'
            // );

            if (isDevEnv()) {
                window.open('/cv', '_self');
            } else {
                window.open('/cv.html', '_self');
            }
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
                <sphereGeometry args={[sphereRadius, ballDetails, ballDetails]} />
            </mesh>
        </group>
    );
}
