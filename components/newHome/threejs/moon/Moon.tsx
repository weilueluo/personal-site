
import { useFrame } from '@react-three/fiber';
import { useContext, useRef } from 'react';
import { Matrix3, ShaderMaterial } from 'three';
import moon_fs from './moon_fs.glsl';
import moon_vs from './moon_vs.glsl';
import { lightPositionContext } from '../../../common/contexts';
import { getAltScroll } from '../../../common/scroll';

const tempMat3 = new Matrix3()

const uniforms = {
    uRotation: { value: tempMat3 },
    uScrollAmount: { value: 0.0 }
}

const material = new ShaderMaterial({
    uniforms: uniforms,
    vertexShader: moon_vs,
    fragmentShader: moon_fs,
})

export default function Moon() {

    const lightPosition = useContext(lightPositionContext)

    const meshRef = useRef(null);

    useFrame(() => {
        uniforms.uScrollAmount.value = getAltScroll();
    })

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.position.copy(lightPosition);
        }
    })
    
    return (
        <>

            <mesh
                ref={meshRef}
                castShadow
                receiveShadow
                // rotation={[Math.PI / 4, 0, 0]}
                position={lightPosition}
                material={material}
            >
                <sphereGeometry args={[0.5, 16, 16]} />
            </mesh>
        </>
    )
}